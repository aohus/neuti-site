from typing import Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException
from app.repositories.estimate_request_repo import estimate_request_repo
from app.schemas.estimate_request import EstimateRequestCreate
from app.models.estimate_request import EstimateRequest


class EstimateRequestService:
    async def create_request(
        self,
        db: AsyncSession,
        *,
        obj_in: EstimateRequestCreate,
        image_url: Optional[str] = None,
    ) -> Any:
        obj_data = obj_in.model_dump()
        db_obj = EstimateRequest(**obj_data, image_url=image_url)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_requests(
        self, db: AsyncSession, *, skip: int = 0, limit: int = 100, status: Optional[str] = None
    ) -> List[Any]:
        query = select(EstimateRequest).order_by(EstimateRequest.created_at.desc())
        if status:
            query = query.where(EstimateRequest.status == status)
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    async def update_status(
        self, db: AsyncSession, *, request_id: int, status: str
    ) -> Any:
        result = await db.execute(
            select(EstimateRequest).where(EstimateRequest.id == request_id)
        )
        db_obj = result.scalar_one_or_none()
        if not db_obj:
            raise HTTPException(status_code=404, detail="견적 요청을 찾을 수 없습니다")
        db_obj.status = status
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def delete_request(
        self, db: AsyncSession, *, request_id: int
    ) -> None:
        result = await db.execute(
            select(EstimateRequest).where(EstimateRequest.id == request_id)
        )
        db_obj = result.scalar_one_or_none()
        if not db_obj:
            raise HTTPException(status_code=404, detail="견적 요청을 찾을 수 없습니다")
        await db.delete(db_obj)
        await db.commit()


estimate_request_service = EstimateRequestService()
