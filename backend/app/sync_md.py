import asyncio
import os
import sys
import time
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

from app.db.session import async_session
from app.repositories.performance_repo import performance_repo
from app.utils.markdown import parse_markdown_performance, normalize_img_url

# 마크다운 파일 경로 설정
DATA_DIR = Path("data/content_text")

async def sync_performances():
    if not DATA_DIR.exists():
        print(f"Data directory {DATA_DIR} not found.")
        return

    for md_file in DATA_DIR.glob("*.md"):
        async with async_session() as session:
            print(f"Processing {md_file.name}...")
            
            # 마크다운 파일의 이름을 이미지 하위 폴더명으로 간주 (힌트 반영)
            post_dir_name = md_file.stem
            
            try:
                with open(md_file, "r", encoding="utf-8") as f:
                    content = f.read()
            
                # 텍스트 내 이미지 보정을 위해 post_dir_name 전달
                parsed = parse_markdown_performance(content, post_dir_name)
                metadata = parsed["metadata"]
                content_json = parsed["content_json"]
                
                title = metadata.get("title")
                if not title:
                    print(f"Skip {md_file.name}: No title found in frontmatter.")
                    continue
                
                # 썸네일 URL도 post_dir_name을 사용하여 보정
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
                    "construction_date": metadata.get("construction_date")
                }

                # Use repository instead of direct DB filter
                db_obj = await performance_repo.get_by_title(session, title=title)
                
                if db_obj:
                    print(f"Updating: {title}")
                    for key, value in performance_data.items():
                        setattr(db_obj, key, value)
                    await session.commit()
                else:
                    print(f"Creating: {title}")
                    # Using repository create method would require a schema, 
                    # but here we have a dict. We can manually add it or use repo.
                    from app.schemas.performance import PerformanceCreate
                    perf_in = PerformanceCreate(**performance_data)
                    await performance_repo.create(session, obj_in=perf_in)
            except Exception as e:
                import traceback
                print(f"Error processing {md_file.name}: {str(e)}")
                traceback.print_exc()
    
    print("Sync completed.")

class MarkdownHandler(FileSystemEventHandler):
    def __init__(self, loop):
        self.loop = loop
        self.last_run = 0

    def on_any_event(self, event):
        if event.is_directory or not event.src_path.endswith('.md'):
            return
        
        current_time = time.time()
        if current_time - self.last_run < 1:
            return
        self.last_run = current_time
        
        print(f"File change detected: {event.src_path}")
        asyncio.run_coroutine_threadsafe(sync_performances(), self.loop)

async def watch_mode():
    print(f"Starting watch mode on {DATA_DIR}...")
    await sync_performances()
    
    loop = asyncio.get_running_loop()
    event_handler = MarkdownHandler(loop)
    observer = Observer()
    observer.schedule(event_handler, str(DATA_DIR), recursive=False)
    observer.start()
    
    try:
        while True:
            await asyncio.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    if "--watch" in sys.argv:
        asyncio.run(watch_mode())
    else:
        asyncio.run(sync_performances())
