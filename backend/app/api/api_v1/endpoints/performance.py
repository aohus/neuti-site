import os
from typing import Any
from uuid import uuid4

import aiofiles
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.config import settings
from app.db.session import get_db
from app.schemas.performance import (
    Performance,
    PerformanceCreate,
    PerformanceStats,
    PerformanceUpdate,
)
from app.services.performance_service import performance_service

router = APIRouter()
utils_router = APIRouter()


@router.get("/stats", response_model=PerformanceStats)
async def get_performance_stats(
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    시공 사례 통계 정보를 반환합니다.
    """
    return await performance_service.get_stats(db)


@router.post("/upload-md", response_model=Performance)
async def upload_markdown(
    *,
    db: AsyncSession = Depends(get_db),
    file: UploadFile = File(...),
    current_admin: str = Depends(deps.get_current_admin),
) -> Any:
    """
    마크다운 파일을 업로드하여 시공 사례를 자동으로 등록합니다.
    """
    return await performance_service.create_from_md(db, file=file)


@utils_router.post("/image", response_model=str)
@router.post("/upload-image", response_model=str)
async def upload_image(
    *,
    image: UploadFile = File(...),
    current_admin: str = Depends(deps.get_current_admin),
) -> Any:
    """
    이미지 업로드 API. 업로드된 이미지의 URL(경로)을 반환합니다.
    """
    if not os.path.exists(settings.UPLOAD_DIR):
        os.makedirs(settings.UPLOAD_DIR)

    file_ext = os.path.splitext(image.filename)[1]
    file_name = f"{uuid4()}{file_ext}"
    image_path = settings.UPLOAD_DIR / file_name

    async with aiofiles.open(image_path, mode="wb") as f:
        content = await image.read()
        await f.write(content)

    return f"/uploads/{file_name}"


@router.get("", response_model=list[Performance])
@router.get("/", response_model=list[Performance], include_in_schema=False)
async def read_performances(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    category: str | None = None,
    year: int | None = None,
    job_main: str | None = None,
    site_type: str | None = None,
    q: str | None = None,
) -> Any:
    """
    시공 사례 목록 조회. 다중 필터링 및 키워드 검색을 지원합니다.
    """
    return await performance_service.get_performances(
        db,
        skip=skip,
        limit=limit,
        category=category,
        year=year,
        job_main=job_main,
        site_type=site_type,
        q=q,
    )


@router.post("", response_model=Performance)
@router.post("/", response_model=Performance, include_in_schema=False)
async def create_performance(
    *,
    db: AsyncSession = Depends(get_db),
    performance_in: PerformanceCreate,
    current_admin: str = Depends(deps.get_current_admin),
) -> Any:
    """
    시공 사례 등록 (관리자 전용).
    """
    return await performance_service.create_performance(db, obj_in=performance_in)


@router.get("/{id}", response_model=Performance)
async def read_performance(
    *, db: AsyncSession = Depends(get_db), id: int
) -> Any:
    """
    시공 사례 상세 조회.
    """
    return await performance_service.get_performance(db, id=id)


@router.put("/{id}", response_model=Performance)
@router.patch("/{id}", response_model=Performance)
async def update_performance(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    performance_in: PerformanceUpdate,
    current_admin: str = Depends(deps.get_current_admin),
) -> Any:
    """
    시공 사례 수정 (관리자 전용).
    """
    return await performance_service.update_performance(
        db, id=id, obj_in=performance_in
    )


@router.delete("/{id}", response_model=Performance)
async def delete_performance(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    current_admin: str = Depends(deps.get_current_admin),
) -> Any:
    """
    시공 사례 삭제 (관리자 전용).
    """
    return await performance_service.delete_performance(db, id=id)