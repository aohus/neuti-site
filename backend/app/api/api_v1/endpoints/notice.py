from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.board import Notice, NoticeCreate, NoticeUpdate
from app.api import deps
from app.services.notice_service import notice_service

router = APIRouter()

@router.get("", response_model=List[Notice])
@router.get("/", response_model=List[Notice], include_in_schema=False)
async def read_notices(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve notices.
    """
    return await notice_service.get_notices(db, skip=skip, limit=limit)

@router.post("", response_model=Notice)
@router.post("/", response_model=Notice, include_in_schema=False)
async def create_notice(
    *,
    db: AsyncSession = Depends(get_db),
    notice_in: NoticeCreate,
    current_admin: str = Depends(deps.get_current_admin),
) -> Any:
    """
    Create new notice.
    """
    return await notice_service.create_notice(db, obj_in=notice_in)

@router.get("/{id}", response_model=Notice)
async def read_notice(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
) -> Any:
    """
    Get notice by ID.
    """
    return await notice_service.get_notice(db, id=id)

@router.put("/{id}", response_model=Notice)
async def update_notice(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    notice_in: NoticeUpdate,
    current_admin: str = Depends(deps.get_current_admin),
) -> Any:
    """
    Update a notice.
    """
    return await notice_service.update_notice(db, id=id, obj_in=notice_in)

@router.delete("/{id}", response_model=Notice)
async def delete_notice(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    current_admin: str = Depends(deps.get_current_admin),
) -> Any:
    """
    Delete a notice.
    """
    return await notice_service.delete_notice(db, id=id)