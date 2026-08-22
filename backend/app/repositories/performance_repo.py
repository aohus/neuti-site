from typing import Any, List, Optional
from sqlalchemy import select, desc, nullslast
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
        client_type: Optional[str] = None,
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
        if client_type:
            query = query.filter(self.model.client_type == client_type)
        if q:
            query = query.filter(
                (self.model.title.ilike(f"%{q}%"))
                | (self.model.client.ilike(f"%{q}%"))
                | (self.model.site_location.ilike(f"%{q}%"))
            )

        # 시공일 최신순. `created_at`(DB 행 삽입 시각)으로 정렬하면 안 된다 —
        # md 기반 시공사례는 sync_all_performances() 가 **파일명 순서**로 INSERT 하므로
        # created_at 이 시공 시점이 아니라 파일명 정렬 순서를 반영한다.
        # (`2026_` 접두사 파일이 가장 먼저 INSERT 되어 최신 글이 꼴찌로 밀렸다)
        # 시공일이 없는 행(관리자 UI 등록분)은 뒤로 밀고 삽입 순서로 보조 정렬한다.
        result = await db.execute(
            query.offset(skip)
            .limit(limit)
            .order_by(
                nullslast(desc(self.model.construction_date)),
                desc(self.model.created_at),
            )
        )
        return result.scalars().all()

    async def get_all(self, db: AsyncSession) -> List[Performance]:
        result = await db.execute(select(self.model))
        return result.scalars().all()

    async def get_by_title(self, db: AsyncSession, *, title: str) -> Optional[Performance]:
        result = await db.execute(select(self.model).filter(self.model.title == title))
        return result.scalars().first()

    async def create_from_markdown(
        self, db: AsyncSession, *, data: dict[str, Any]
    ) -> Performance:
        """마크다운 동기화 전용 생성.

        `source_file` 처럼 공개 스키마(PerformanceCreate)에 없는 내부 필드까지
        그대로 반영해야 하므로 모델을 직접 만든다.
        """
        db_obj = self.model(**data)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_by_source_file(
        self, db: AsyncSession, *, source_file: str
    ) -> Optional[Performance]:
        """마크다운 파일명(확장자 제외)으로 동기화된 행을 찾습니다."""
        result = await db.execute(
            select(self.model).filter(self.model.source_file == source_file)
        )
        return result.scalars().first()

    async def get_orphaned_md_records(
        self, db: AsyncSession, *, known_source_files: list[str]
    ) -> List[Performance]:
        """마크다운에서 왔지만 더 이상 원본 파일이 없는 행들을 반환합니다.

        source_file 이 NULL 인 행(관리자 UI 등록분)은 대상에서 제외됩니다.
        """
        query = select(self.model).filter(self.model.source_file.isnot(None))
        if known_source_files:
            query = query.filter(self.model.source_file.notin_(known_source_files))
        result = await db.execute(query)
        return result.scalars().all()


performance_repo = CRUDPerformance(Performance)
