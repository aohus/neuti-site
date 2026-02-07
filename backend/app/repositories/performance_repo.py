from typing import Any, List, Optional
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import CRUDBase
from app.models.performance import Performance
from app.schemas.performance import PerformanceCreate, PerformanceUpdate


class CRUDPerformance(CRUDBase[Performance, PerformanceCreate, PerformanceUpdate]):
    async def get_multi_with_filters(
        self,
        db: AsyncSession,
        *,
        skip: int = 0,
        limit: int = 100,
        category: Optional[str] = None,
        year: Optional[int] = None,
        job_main: Optional[str] = None,
        site_type: Optional[str] = None,
        q: Optional[str] = None,
    ) -> List[Performance]:
        query = select(self.model)

        if category:
            query = query.filter(self.model.category == category)
        if year:
            query = query.filter(self.model.year == year)
        if job_main:
            query = query.filter(self.model.job_main_category == job_main)
        if site_type:
            query = query.filter(self.model.site_type == site_type)
        if q:
            query = query.filter(
                (self.model.title.ilike(f"%{q}%"))
                | (self.model.client.ilike(f"%{q}%"))
                | (self.model.site_location.ilike(f"%{q}%"))
            )

        result = await db.execute(
            query.offset(skip).limit(limit).order_by(desc(self.model.created_at))
        )
        return result.scalars().all()

    async def get_all(self, db: AsyncSession) -> List[Performance]:
        result = await db.execute(select(self.model))
        return result.scalars().all()

    async def get_by_title(self, db: AsyncSession, *, title: str) -> Optional[Performance]:
        result = await db.execute(select(self.model).filter(self.model.title == title))
        return result.scalar_one_or_none()


performance_repo = CRUDPerformance(Performance)
