from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete, desc

from app.db.session import get_db
from app.models.board import Notice as NoticeModel
from app.schemas.board import Notice, NoticeCreate, NoticeUpdate
from app.api import deps

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
    result = await db.execute(
        select(NoticeModel).order_by(desc(NoticeModel.created_at)).offset(skip).limit(limit)
    )
    return result.scalars().all()

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
    db_obj = NoticeModel(**notice_in.model_dump())
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

@router.get("/{id}", response_model=Notice)
async def read_notice(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
) -> Any:
    """
    Get notice by ID.
    """
    result = await db.execute(select(NoticeModel).where(NoticeModel.id == id))
    notice = result.scalar_one_or_none()
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
    
    # Increment views
    await db.execute(
        update(NoticeModel).where(NoticeModel.id == id).values(views=notice.views + 1)
    )
    await db.commit()
    await db.refresh(notice)
    return notice

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
    result = await db.execute(select(NoticeModel).where(NoticeModel.id == id))
    notice = result.scalar_one_or_none()
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
    
    update_data = notice_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(notice, field, value)
    
    db.add(notice)
    await db.commit()
    await db.refresh(notice)
    return notice

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
    result = await db.execute(select(NoticeModel).where(NoticeModel.id == id))
    notice = result.scalar_one_or_none()
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
    
    await db.delete(notice)
    await db.commit()
    return notice
