import logging
import os
from typing import Any, List
from uuid import uuid4

import aiofiles
from fastapi import APIRouter, BackgroundTasks, Depends, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.config import settings
from app.db.session import get_db
from app.schemas.estimate_request import (
    EstimateRequestCreate,
    EstimateRequestResponse,
    EstimateRequestStatusUpdate,
)
from app.services.estimate_request_service import estimate_request_service
from app.utils.email import send_estimate_notification

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("", response_model=EstimateRequestResponse)
@router.post("/", response_model=EstimateRequestResponse, include_in_schema=False)
async def create_estimate_request(
    *,
    db: AsyncSession = Depends(get_db),
    request_in: EstimateRequestCreate = Depends(EstimateRequestCreate.as_form),
    image: UploadFile | None = File(None),
    background_tasks: BackgroundTasks,
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

    result = await estimate_request_service.create_request(
        db, obj_in=request_in, image_url=image_url
    )

    # TODO: 네이버 SMTP 설정 완료 후 주석 해제
    # try:
    #     email_data = request_in.model_dump()
    #     background_tasks.add_task(
    #         send_estimate_notification,
    #         settings.MAIL_USERNAME,
    #         email_data,
    #     )
    # except Exception:
    #     logger.warning("Failed to queue estimate email notification", exc_info=True)

    return result


@router.get("", response_model=List[EstimateRequestResponse])
@router.get("/", response_model=List[EstimateRequestResponse], include_in_schema=False)
async def read_estimate_requests(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    status: str | None = None,
    current_admin: str = Depends(deps.get_current_admin),
) -> Any:
    """
    견적 요청 목록 조회 (관리자 전용).
    """
    return await estimate_request_service.get_requests(
        db, skip=skip, limit=limit, status=status
    )


@router.patch("/{request_id}/status", response_model=EstimateRequestResponse)
async def update_estimate_status(
    request_id: int,
    status_in: EstimateRequestStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_admin: str = Depends(deps.get_current_admin),
) -> Any:
    """
    견적 요청 상태 변경 (관리자 전용).
    """
    return await estimate_request_service.update_status(
        db, request_id=request_id, status=status_in.status
    )


@router.delete("/{request_id}")
async def delete_estimate_request(
    request_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin: str = Depends(deps.get_current_admin),
) -> Any:
    """
    견적 요청 삭제 (관리자 전용).
    """
    await estimate_request_service.delete_request(db, request_id=request_id)
    return {"ok": True}
