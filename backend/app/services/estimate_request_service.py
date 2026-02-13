from typing import Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
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
        self, db: AsyncSession, *, skip: int = 0, limit: int = 100
    ) -> List[Any]:
        return await estimate_request_repo.get_multi(db, skip=skip, limit=limit)


estimate_request_service = EstimateRequestService()
