import asyncio
import os
from pathlib import Path
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

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
        for md_file in DATA_DIR.glob("*.md"):
            print(f"Processing {md_file.name}...")
            
            with open(md_file, "r", encoding="utf-8") as f:
                content = f.read()
            
            parsed = parse_markdown_performance(content)
            metadata = parsed["metadata"]
            content_json = parsed["content_json"]
            
            def normalize_url(url: str | None) -> str | None:
                if not url: return url
                if 'uploads/' in url:
                    return '/uploads/' + url.split('uploads/')[-1]
                return url

            title = metadata.get("title")
            if not title:
                print(f"Skip {md_file.name}: No title found in frontmatter.")
                continue
            
            # DB에서 기존 항목 검색
            result = await session.execute(select(Performance).filter(Performance.title == title))
            db_obj = result.scalar_one_or_none()
            
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
            }
            
            if db_obj:
                print(f"Updating existing performance: {title}")
                for key, value in performance_data.items():
                    setattr(db_obj, key, value)
            else:
                print(f"Creating new performance: {title}")
                new_performance = Performance(**performance_data)
                session.add(new_performance)
        
        await session.commit()
        print("Sync completed successfully.")

if __name__ == "__main__":
    asyncio.run(sync_performances())
