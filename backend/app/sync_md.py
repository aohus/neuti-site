import asyncio
import logging
import sys
import time
import unicodedata
from datetime import date, datetime
from pathlib import Path
from typing import Any

from sqlalchemy import text
from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer

from app.db.session import async_session
from app.repositories.performance_repo import performance_repo
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


def parse_construction_date(value: Any) -> datetime | None:
    """프론트매터의 construction_date 를 DB 컬럼(DateTime) 타입으로 정규화합니다.

    YAML 은 `2024-11-08` 을 date 로, 따옴표가 붙으면 str 로 읽습니다.
    asyncpg 는 DateTime 컬럼에 date/str 를 그대로 넣으면 오류가 나므로 datetime 으로 맞춥니다.
    """
    if value is None or value == "":
        return None
    if isinstance(value, datetime):
        return value
    if isinstance(value, date):
        return datetime(value.year, value.month, value.day)
    if isinstance(value, str):
        try:
            return datetime.fromisoformat(value.strip())
        except ValueError:
            logger.warning("Invalid construction_date: %r", value)
            return None
    logger.warning("Unsupported construction_date type: %r", value)
    return None


def md_stem(md_file: Path) -> str:
    """마크다운 파일명(확장자 제외)을 NFC 로 정규화해 돌려줍니다.

    macOS 에서 만들어진 한글 파일명은 NFD(분해형)로 들어올 수 있다. git 인덱스와
    uploads/ 디렉터리는 NFC 이므로, 정규화하지 않으면 같은 글인데도 source_file
    매칭이 실패해 중복 행이 생기고 이미지 경로도 어긋난다.
    """
    return unicodedata.normalize("NFC", md_file.stem)


async def sync_single_file(md_file: Path) -> None:
    """단일 마크다운 파일을 파싱하여 DB에 동기화합니다."""
    post_dir_name = md_stem(md_file)

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
                "source_file": post_dir_name,
                "title": title,
                "subtitle": metadata.get("subtitle"),
                "content": content_json,
                "category": metadata.get("category"),
                "year": int(metadata.get("year")) if metadata.get("year") else None,
                "job_main_category": metadata.get("job_main_category"),
                "job_sub_category": metadata.get("job_sub_category"),
                "site_type": metadata.get("site_type"),
                "site_location": metadata.get("site_location"),
                "client": metadata.get("client"),
                "thumbnail_url": thumbnail_url,
                "construction_date": parse_construction_date(
                    metadata.get("construction_date")
                ),
            }

            # 1순위는 파일명 매칭. 제목을 바꿔도 같은 행을 계속 갱신하므로 중복이 생기지 않는다.
            db_obj = await performance_repo.get_by_source_file(
                session, source_file=post_dir_name
            )
            # source_file 이 아직 없던 시절에 만들어진 행은 제목으로 한 번만 인수한다.
            if not db_obj:
                db_obj = await performance_repo.get_by_title(session, title=title)
                if db_obj and db_obj.source_file:
                    db_obj = None  # 다른 파일이 이미 소유한 행이면 건드리지 않는다

            if db_obj:
                logger.info("Updating: %s (%s)", title, md_file.name)
                await performance_repo.update(session, db_obj=db_obj, obj_in=performance_data)
            else:
                logger.info("Creating: %s (%s)", title, md_file.name)
                await performance_repo.create_from_markdown(
                    session, data=performance_data
                )

        except Exception:
            await session.rollback()
            logger.exception("Error processing %s", md_file.name)


async def prune_deleted_performances(known_source_files: list[str]) -> None:
    """원본 마크다운이 사라진 시공사례 행을 삭제합니다.

    `source_file` 이 NULL 인 행(관리자 UI 로 직접 등록한 글)은 건드리지 않습니다.
    """
    async with async_session() as session:
        try:
            orphans = await performance_repo.get_orphaned_md_records(
                session, known_source_files=known_source_files
            )
            for orphan in orphans:
                logger.info(
                    "Removing orphaned record: %s (source_file=%s)",
                    orphan.title,
                    orphan.source_file,
                )
                await performance_repo.remove(session, id=orphan.id)
        except Exception:
            await session.rollback()
            logger.exception("Error pruning orphaned performance records")


async def sync_all_performances() -> None:
    """data/performances/ 내 모든 마크다운 파일을 동기화합니다."""
    if not DATA_DIR.exists():
        logger.warning("Data directory %s not found.", DATA_DIR)
        return

    md_files = sorted(DATA_DIR.glob("*.md"))
    for md_file in md_files:
        logger.info("Processing %s ...", md_file.name)
        await sync_single_file(md_file)

    await prune_deleted_performances([md_stem(f) for f in md_files])

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

        # 삭제·이동이면 해당 파일만 볼 수 없으므로 전체 동기화로 고아 행까지 정리한다.
        coro = (
            sync_single_file(md_path)
            if md_path.exists()
            else sync_all_performances()
        )
        asyncio.run_coroutine_threadsafe(coro, self.loop)


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
