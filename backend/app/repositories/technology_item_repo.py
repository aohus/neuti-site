from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import CRUDBase
from app.models.technology_item import TechnologyItem
from app.schemas.technology_item import TechnologyItemCreate, TechnologyItemUpdate


class CRUDTechnologyItem(CRUDBase[TechnologyItem, TechnologyItemCreate, TechnologyItemUpdate]):
    async def get_all_ordered(self, db: AsyncSession) -> List[TechnologyItem]:
        result = await db.execute(
            select(self.model).order_by(self.model.sort_order)
        )
        return result.scalars().all()

    async def get_by_item_key(self, db: AsyncSession, *, item_key: str) -> Optional[TechnologyItem]:
        result = await db.execute(
            select(self.model).filter(self.model.item_key == item_key)
        )
        return result.scalar_one_or_none()


technology_item_repo = CRUDTechnologyItem(TechnologyItem)
