import asyncio
import os
import sys
import time
from pathlib import Path
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

from app.db.session import async_session
from app.models.performance import Performance
from app.utils.markdown import parse_markdown_performance

# 마크다운 파일 경로 설정
DATA_DIR = Path("data/performances")

async def sync_performances():
    if not DATA_DIR.exists():
        print(f"Data directory {DATA_DIR} not found.")
        return

    async with async_session() as session:
        # 1. 현재 폴더에 존재하는 마크다운 파일들의 제목(Title) 목록 수집
        existing_titles = []
        
        for md_file in DATA_DIR.glob("*.md"):
            print(f"Processing {md_file.name}...")
            
            with open(md_file, "r", encoding="utf-8") as f:
                content = f.read()
            
            try:
                parsed = parse_markdown_performance(content)
                metadata = parsed["metadata"]
                content_json = parsed["content_json"]
                
                title = metadata.get("title")
                if not title:
                    print(f"Skip {md_file.name}: No title found in frontmatter.")
                    continue
                
                existing_titles.append(title)
                
                # DB에서 기존 항목 검색
                result = await session.execute(select(Performance).filter(Performance.title == title))
                db_obj = result.scalar_one_or_none()
                
                def normalize_url(url: str | None) -> str | None:
                    if not url: return url
                    if 'uploads/' in url:
                        return '/uploads/' + url.split('uploads/')[-1]
                    return url

                # 메타데이터 매핑
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
                    "thumbnail_url": normalize_url(metadata.get("thumbnail_url")),
                    "construction_date": metadata.get("construction_date")
                }
                
                if db_obj:
                    # 변경 사항이 있을 때만 업데이트 (간단하게 모든 필드 셋)
                    for key, value in performance_data.items():
                        setattr(db_obj, key, value)
                else:
                    print(f"Creating: {title}")
                    new_performance = Performance(**performance_data)
                    session.add(new_performance)
            except Exception as e:
                print(f"Error processing {md_file.name}: {str(e)}")
        
        # 2. 삭제 로직
        if existing_titles:
            delete_query = delete(Performance).where(Performance.title.not_in(existing_titles))
            result = await session.execute(delete_query)
            if result.rowcount > 0:
                print(f"Deleted {result.rowcount} removed performances from DB.")
        
        await session.commit()
        print("Sync completed.")

class MarkdownHandler(FileSystemEventHandler):
    def __init__(self, loop):
        self.loop = loop
        self.last_run = 0

    def on_any_event(self, event):
        if event.is_directory or not event.src_path.endswith('.md'):
            return
        
        # 짧은 시간 내의 중복 이벤트 방지 (Debounce)
        current_time = time.time()
        if current_time - self.last_run < 1:
            return
        self.last_run = current_time
        
        print(f"File change detected: {event.src_path}")
        asyncio.run_coroutine_threadsafe(sync_performances(), self.loop)

async def watch_mode():
    print(f"Starting watch mode on {DATA_DIR}...")
    await sync_performances() # 시작 시 최초 1회 실행
    
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
