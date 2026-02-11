from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.db.session import get_db
from app.schemas.technology_item import TechnologyItem, TechnologyItemUpdate
from app.services.technology_item_service import technology_item_service

router = APIRouter()


@router.get("", response_model=list[TechnologyItem])
@router.get("/", response_model=list[TechnologyItem], include_in_schema=False)
async def get_technology_items(
    db: AsyncSession = Depends(get_db),
) -> Any:
    """기술력 항목 전체 목록 (공개)."""
    return await technology_item_service.get_all(db)


@router.patch("/{id}", response_model=TechnologyItem)
async def update_technology_item(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    item_in: TechnologyItemUpdate,
    current_admin: str = Depends(deps.get_current_admin),
) -> Any:
    """기술력 항목 수정 (관리자 전용)."""
    return await technology_item_service.update_item(db, id=id, obj_in=item_in)
