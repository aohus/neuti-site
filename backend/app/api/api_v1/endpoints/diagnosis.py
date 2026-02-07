import os
from typing import Any, List
from uuid import uuid4

import aiofiles
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.config import settings
from app.db.session import get_db
from app.schemas.diagnosis import DiagnosisRequest, DiagnosisRequestCreate
from app.services.diagnosis_service import diagnosis_service
from app.utils.email import send_diagnosis_notification

router = APIRouter()


@router.post("", response_model=DiagnosisRequest)
@router.post("/", response_model=DiagnosisRequest, include_in_schema=False)
async def create_diagnosis_request(
    *,
    db: AsyncSession = Depends(get_db),
    request_in: DiagnosisRequestCreate = Depends(DiagnosisRequestCreate.as_form),
    image: UploadFile | None = File(None),
) -> Any:
    """
    수목 진단 의뢰 등록.
    """
    image_path = None
    if image:
        if not os.path.exists(settings.UPLOAD_DIR):
            os.makedirs(settings.UPLOAD_DIR)

        file_ext = os.path.splitext(image.filename)[1]
        file_name = f"diagnosis_{uuid4()}{file_ext}"
        full_path = settings.UPLOAD_DIR / file_name

        async with aiofiles.open(full_path, mode="wb") as f:
            content = await image.read()
            await f.write(content)
        image_path = f"/uploads/{file_name}"

    return await diagnosis_service.create_request(db, obj_in=request_in, image_path=image_path)


@router.get("", response_model=List[DiagnosisRequest])
@router.get("/", response_model=List[DiagnosisRequest], include_in_schema=False)
async def read_diagnosis_requests(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_admin: str = Depends(deps.get_current_admin),
) -> Any:
    """
    진단 의뢰 목록 조회 (관리자 전용).
    """
    return await diagnosis_service.get_requests(db, skip=skip, limit=limit)