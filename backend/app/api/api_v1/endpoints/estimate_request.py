import os
from typing import Any, List
from uuid import uuid4

import aiofiles
from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.config import settings
from app.db.session import get_db
from app.schemas.estimate_request import EstimateRequestCreate, EstimateRequestResponse
from app.services.estimate_request_service import estimate_request_service

router = APIRouter()


@router.post("", response_model=EstimateRequestResponse)
@router.post("/", response_model=EstimateRequestResponse, include_in_schema=False)
async def create_estimate_request(
    *,
    db: AsyncSession = Depends(get_db),
    request_in: EstimateRequestCreate = Depends(EstimateRequestCreate.as_form),
    image: UploadFile | None = File(None),
) -> Any:
    """
    수의계약 간편 견적 요청 등록 (누구나 접수 가능).
    """
    image_url = None
    if image:
        if not os.path.exists(settings.UPLOAD_DIR):
            os.makedirs(settings.UPLOAD_DIR)

        file_ext = os.path.splitext(image.filename)[1]
        file_name = f"estimate_{uuid4()}{file_ext}"
        full_path = settings.UPLOAD_DIR / file_name

        async with aiofiles.open(full_path, mode="wb") as f:
            content = await image.read()
            await f.write(content)
        image_url = f"/uploads/{file_name}"

    return await estimate_request_service.create_request(
        db, obj_in=request_in, image_url=image_url
    )


@router.get("", response_model=List[EstimateRequestResponse])
@router.get("/", response_model=List[EstimateRequestResponse], include_in_schema=False)
async def read_estimate_requests(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_admin: str = Depends(deps.get_current_admin),
) -> Any:
    """
    견적 요청 목록 조회 (관리자 전용).
    """
    return await estimate_request_service.get_requests(db, skip=skip, limit=limit)
