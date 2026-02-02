from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
import aiofiles
import os
from uuid import uuid4

from app.db.session import get_db
from app.models.performance import Performance as PerformanceModel
from app.schemas.performance import Performance, PerformanceCreate, PerformanceUpdate
from app.api import deps
from app.core.config import settings
from app.utils.markdown import parse_markdown_performance

router = APIRouter()
utils_router = APIRouter()

@router.post("/upload-md", response_model=Performance)
async def upload_markdown(
    *,
    db: AsyncSession = Depends(get_db),
    file: UploadFile = File(...),
    current_admin: str = Depends(deps.get_current_admin)
) -> Any:
    """
    마크다운 파일을 업로드하여 시공 사례를 자동으로 등록합니다.
    """
    if not file.filename.endswith('.md'):
        raise HTTPException(status_code=400, detail="Only .md files are allowed")
    
    content = await file.read()
    try:
        parsed = parse_markdown_performance(content.decode('utf-8'))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse markdown: {str(e)}")
    
    metadata = parsed["metadata"]
    
    # 필수 필드 확인
    title = metadata.get("title")
    if not title:
        raise HTTPException(status_code=400, detail="Title is required in frontmatter")
    
    # 데이터 매핑
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
        thumbnail_url=metadata.get("thumbnail_url"),
        construction_date=metadata.get("construction_date")
    )
    
    db_obj = PerformanceModel(**perf_in.model_dump())
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

@utils_router.post("/image", response_model=str)
@router.post("/upload-image", response_model=str)
async def upload_image(
    *,
    image: UploadFile = File(...),
    current_admin: str = Depends(deps.get_current_admin)
) -> Any:
    """
    이미지 업로드 API. 업로드된 이미지의 URL(경로)을 반환합니다.
    """
    if not os.path.exists(settings.UPLOAD_DIR):
        os.makedirs(settings.UPLOAD_DIR)
    
    file_ext = os.path.splitext(image.filename)[1]
    file_name = f"{uuid4()}{file_ext}"
    image_path = settings.UPLOAD_DIR / file_name
    
    async with aiofiles.open(image_path, mode='wb') as f:
        content = await image.read()
        await f.write(content)
    
    # URL로 반환하기 위해 /uploads/파일명 형식을 사용합니다.
    return f"/uploads/{file_name}"

@router.get("", response_model=List[Performance])
@router.get("/", response_model=List[Performance], include_in_schema=False)
async def read_performances(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    category: str | None = None,
    year: int | None = None,
    job_main: str | None = None,
    site_type: str | None = None,
    q: str | None = None
) -> Any:
    """
    시공 사례 목록 조회. 다중 필터링 및 키워드 검색을 지원합니다.
    """
    query = select(PerformanceModel)
    
    if category:
        query = query.filter(PerformanceModel.category == category)
    if year:
        query = query.filter(PerformanceModel.year == year)
    if job_main:
        query = query.filter(PerformanceModel.job_main_category == job_main)
    if site_type:
        query = query.filter(PerformanceModel.site_type == site_type)
    if q:
        query = query.filter(
            (PerformanceModel.title.ilike(f"%{q}%")) |
            (PerformanceModel.client.ilike(f"%{q}%")) |
            (PerformanceModel.site_location.ilike(f"%{q}%"))
        )
    
    result = await db.execute(
        query.offset(skip).limit(limit).order_by(desc(PerformanceModel.created_at))
    )
    return result.scalars().all()

@router.post("", response_model=Performance)
@router.post("/", response_model=Performance, include_in_schema=False)
async def create_performance(
    *,
    db: AsyncSession = Depends(get_db),
    performance_in: PerformanceCreate,
    current_admin: str = Depends(deps.get_current_admin)
) -> Any:
    """
    시공 사례 등록 (관리자 전용).
    """
    db_obj = PerformanceModel(**performance_in.model_dump())
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

@router.get("/{id}", response_model=Performance)
async def read_performance(
    *,
    db: AsyncSession = Depends(get_db),
    id: int
) -> Any:
    """
    시공 사례 상세 조회.
    """
    result = await db.execute(select(PerformanceModel).filter(PerformanceModel.id == id))
    performance = result.scalar_one_or_none()
    if not performance:
        raise HTTPException(status_code=404, detail="Performance record not found")
    return performance

@router.put("/{id}", response_model=Performance)
@router.patch("/{id}", response_model=Performance)
async def update_performance(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    performance_in: PerformanceUpdate,
    current_admin: str = Depends(deps.get_current_admin)
) -> Any:
    """
    시공 사례 수정 (관리자 전용).
    """
    result = await db.execute(select(PerformanceModel).filter(PerformanceModel.id == id))
    db_obj = result.scalar_one_or_none()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Performance record not found")
    
    update_data = performance_in.model_dump(exclude_unset=True)
    for field in update_data:
        setattr(db_obj, field, update_data[field])
    
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

@router.delete("/{id}", response_model=Performance)
async def delete_performance(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    current_admin: str = Depends(deps.get_current_admin)
) -> Any:
    """
    시공 사례 삭제 (관리자 전용).
    """
    result = await db.execute(select(PerformanceModel).filter(PerformanceModel.id == id))
    db_obj = result.scalar_one_or_none()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Performance record not found")
    
    await db.delete(db_obj)
    await db.commit()
    return db_obj