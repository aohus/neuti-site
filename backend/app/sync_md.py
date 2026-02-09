import asyncio
import logging
import sys
import time
from pathlib import Path

from sqlalchemy import text
from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer

from app.db.session import async_session
from app.repositories.performance_repo import performance_repo
from app.schemas.performance import PerformanceCreate
from app.utils.markdown import normalize_img_url, parse_markdown_performance

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

DATA_DIR = Path("data/performances")

MAX_DB_RETRIES = 5
DB_RETRY_INTERVAL = 5  # seconds


async def wait_for_db() -> bool:
    """DB 연결이 준비될 때까지 재시도합니다."""
    for attempt in range(1, MAX_DB_RETRIES + 1):
        try:
            async with async_session() as session:
                await session.execute(text("SELECT 1"))
                logger.info("DB connection ready.")
                return True
        except Exception as e:
            logger.warning(
                "DB not ready (attempt %d/%d): %s", attempt, MAX_DB_RETRIES, e
            )
            if attempt < MAX_DB_RETRIES:
                await asyncio.sleep(DB_RETRY_INTERVAL)
    logger.error("DB connection failed after %d attempts.", MAX_DB_RETRIES)
    return False


async def sync_single_file(md_file: Path) -> None:
    """단일 마크다운 파일을 파싱하여 DB에 동기화합니다."""
    post_dir_name = md_file.stem

    async with async_session() as session:
        try:
            with open(md_file, "r", encoding="utf-8") as f:
                content = f.read()

            parsed = parse_markdown_performance(content, post_dir_name)
            metadata = parsed["metadata"]
            content_json = parsed["content_json"]

            title = metadata.get("title")
            if not title:
                logger.warning("Skip %s: No title found in frontmatter.", md_file.name)
                return

            thumbnail_raw = metadata.get("thumbnail_url")
            thumbnail_url = normalize_img_url(thumbnail_raw, post_dir_name)

            performance_data = {
                "title": title,
                "content": content_json,
                "category": metadata.get("category"),
                "year": int(metadata.get("year")) if metadata.get("year") else None,
                "job_main_category": metadata.get("job_main_category"),
                "job_sub_category": metadata.get("job_sub_category"),
                "site_type": metadata.get("site_type"),
                "site_location": metadata.get("site_location"),
                "client": metadata.get("client"),
                "thumbnail_url": thumbnail_url,
                "construction_date": metadata.get("construction_date"),
            }

            db_obj = await performance_repo.get_by_title(session, title=title)

            if db_obj:
                logger.info("Updating: %s", title)
                await performance_repo.update(session, db_obj=db_obj, obj_in=performance_data)
            else:
                logger.info("Creating: %s", title)
                perf_in = PerformanceCreate(**performance_data)
                await performance_repo.create(session, obj_in=perf_in)

        except Exception:
            await session.rollback()
            logger.exception("Error processing %s", md_file.name)


async def sync_all_performances() -> None:
    """data/performances/ 내 모든 마크다운 파일을 동기화합니다."""
    if not DATA_DIR.exists():
        logger.warning("Data directory %s not found.", DATA_DIR)
        return

    for md_file in sorted(DATA_DIR.glob("*.md")):
        logger.info("Processing %s ...", md_file.name)
        await sync_single_file(md_file)

    logger.info("Sync completed.")


class MarkdownHandler(FileSystemEventHandler):
    def __init__(self, loop: asyncio.AbstractEventLoop):
        self.loop = loop
        self.last_run: float = 0

    def on_any_event(self, event):
        if event.is_directory or not event.src_path.endswith(".md"):
            return

        current_time = time.time()
        if current_time - self.last_run < 1:
            return
        self.last_run = current_time

        md_path = Path(event.src_path)
        logger.info("File change detected: %s", md_path.name)
        asyncio.run_coroutine_threadsafe(sync_single_file(md_path), self.loop)


async def watch_mode() -> None:
    logger.info("Starting watch mode on %s ...", DATA_DIR)

    if not await wait_for_db():
        return

    await sync_all_performances()

    loop = asyncio.get_running_loop()
    event_handler = MarkdownHandler(loop)
    observer = Observer()
    observer.schedule(event_handler, str(DATA_DIR), recursive=False)
    observer.start()

    try:
        while True:
            await asyncio.sleep(1)
    except KeyboardInterrupt:
        logger.info("Shutting down watcher ...")
    finally:
        observer.stop()
        observer.join()


if __name__ == "__main__":
    if "--watch" in sys.argv:
        asyncio.run(watch_mode())
    else:
        asyncio.run(sync_all_performances())
