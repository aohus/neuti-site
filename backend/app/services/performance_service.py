import os
import shutil
from typing import Any, List, Optional
from fastapi import UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.repositories.performance_repo import performance_repo
from app.schemas.performance import PerformanceCreate, PerformanceUpdate, PerformanceStats
from app.utils.markdown import parse_markdown_performance


class PerformanceService:
    async def get_stats(self, db: AsyncSession) -> PerformanceStats:
        all_performances = await performance_repo.get_all(db)
        
        total_count = len(all_performances)
        public_types = ["공공기관", "공원", "학교"]
        public_client_count = sum(
            1 for p in all_performances if p.site_type in public_types
        )

        categories: dict[str, int] = {}
        job_categories: dict[str, int] = {}
        years: dict[str, int] = {}
        client_types: dict[str, int] = {}

        for p in all_performances:
            if p.category:
                categories[p.category] = categories.get(p.category, 0) + 1
            if p.job_main_category:
                job_categories[p.job_main_category] = (
                    job_categories.get(p.job_main_category, 0) + 1
                )
            if p.year:
                yr_str = str(p.year)
                years[yr_str] = years.get(yr_str, 0) + 1
            ct = p.client_type or "미분류"
            client_types[ct] = client_types.get(ct, 0) + 1

        return {
            "total_count": total_count,
            "public_client_count": public_client_count,
            "categories": categories,
            "job_categories": job_categories,
            "years": years,
            "client_types": client_types,
        }

    async def get_performances(
        self,
        db: AsyncSession,
        *,
        skip: int = 0,
        limit: int = 100,
        category: Optional[str] = None,
        year: Optional[int] = None,
        job_main: Optional[str] = None,
        site_type: Optional[str] = None,
        client_type: Optional[str] = None,
        q: Optional[str] = None,
    ) -> List[Any]:
        return await performance_repo.get_multi_with_filters(
            db,
            skip=skip,
            limit=limit,
            category=category,
            year=year,
            job_main=job_main,
            site_type=site_type,
            client_type=client_type,
            q=q,
        )

    async def create_from_md(
        self, db: AsyncSession, *, file: UploadFile
    ) -> Any:
        if not file.filename.endswith(".md"):
            raise HTTPException(status_code=400, detail="Only .md files are allowed")

        content = await file.read()
        try:
            parsed = parse_markdown_performance(content.decode("utf-8"))
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Failed to parse markdown: {str(e)}"
            )

        metadata = parsed["metadata"]
        title = metadata.get("title")
        if not title:
            raise HTTPException(status_code=400, detail="Title is required in frontmatter")

        perf_in = PerformanceCreate(
            title=title,
            content=parsed["content_json"],
            category=metadata.get("category"),
            year=int(metadata.get("year")) if metadata.get("year") else None,
            job_main_category=metadata.get("job_main_category"),
            job_sub_category=metadata.get("job_sub_category"),
            site_type=metadata.get("site_type"),
            site_location=metadata.get("site_location"),
            client=metadata.get("client"),
            client_type=metadata.get("client_type"),
            thumbnail_url=metadata.get("thumbnail_url"),
            construction_date=metadata.get("construction_date"),
        )
        return await performance_repo.create(db, obj_in=perf_in)

    async def delete_performance(self, db: AsyncSession, *, id: int) -> Any:
        db_obj = await performance_repo.get(db, id=id)
        if not db_obj:
            raise HTTPException(status_code=404, detail="Performance record not found")

        title_to_delete = db_obj.title

        # Delete MD file if exists
        if settings.PERFORMANCE_DATA_DIR.exists():
            import frontmatter
            for md_file in settings.PERFORMANCE_DATA_DIR.glob("*.md"):
                try:
                    post = frontmatter.load(md_file)
                    if post.metadata.get("title") == title_to_delete:
                        os.remove(md_file)
                        break
                except Exception:
                    pass

        return await performance_repo.remove(db, id=id)

    async def get_performance(self, db: AsyncSession, *, id: int) -> Any:
        db_obj = await performance_repo.get(db, id=id)
        if not db_obj:
            raise HTTPException(status_code=404, detail="Performance record not found")
        return db_obj

    async def update_performance(
        self, db: AsyncSession, *, id: int, obj_in: PerformanceUpdate
    ) -> Any:
        db_obj = await performance_repo.get(db, id=id)
        if not db_obj:
            raise HTTPException(status_code=404, detail="Performance record not found")
        return await performance_repo.update(db, db_obj=db_obj, obj_in=obj_in)

    async def create_performance(
        self, db: AsyncSession, *, obj_in: PerformanceCreate
    ) -> Any:
        return await performance_repo.create(db, obj_in=obj_in)


performance_service = PerformanceService()
