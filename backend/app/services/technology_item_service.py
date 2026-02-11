from typing import Any, List
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.technology_item_repo import technology_item_repo
from app.schemas.technology_item import TechnologyItemUpdate


class TechnologyItemService:
    async def get_all(self, db: AsyncSession) -> List[Any]:
        return await technology_item_repo.get_all_ordered(db)

    async def update_item(
        self, db: AsyncSession, *, id: int, obj_in: TechnologyItemUpdate
    ) -> Any:
        db_obj = await technology_item_repo.get(db, id=id)
        if not db_obj:
            raise HTTPException(status_code=404, detail="Technology item not found")
        return await technology_item_repo.update(db, db_obj=db_obj, obj_in=obj_in)


technology_item_service = TechnologyItemService()
