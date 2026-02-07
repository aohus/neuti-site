from typing import Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.repositories.diagnosis_repo import diagnosis_repo
from app.schemas.diagnosis import DiagnosisRequestCreate
from app.utils.email import send_diagnosis_notification
from app.core.config import settings


class DiagnosisService:
    async def create_request(
        self, db: AsyncSession, *, obj_in: DiagnosisRequestCreate, image_path: Optional[str] = None
    ) -> Any:
        obj_in_data = obj_in.model_dump()
        from app.models.diagnosis import DiagnosisRequest
        db_obj = DiagnosisRequest(**obj_in_data, image_path=image_path)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)

        # Send notification
        try:
            await send_diagnosis_notification(settings.MAIL_USERNAME, obj_in_data)
        except Exception:
            # Don't fail the request if email fails
            pass

        return db_obj

    async def get_requests(
        self, db: AsyncSession, *, skip: int = 0, limit: int = 100
    ) -> List[Any]:
        return await diagnosis_repo.get_multi(db, skip=skip, limit=limit)


diagnosis_service = DiagnosisService()
