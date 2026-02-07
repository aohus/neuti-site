from typing import Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.repositories.notice_repo import notice_repo
from app.schemas.board import NoticeCreate, NoticeUpdate


class NoticeService:
    async def get_notices(
        self, db: AsyncSession, *, skip: int = 0, limit: int = 100
    ) -> List[Any]:
        return await notice_repo.get_multi(db, skip=skip, limit=limit)

    async def get_notice(self, db: AsyncSession, *, id: int) -> Any:
        db_obj = await notice_repo.get(db, id=id)
        if not db_obj:
            raise HTTPException(status_code=404, detail="Notice not found")
        
        # Increment views
        await notice_repo.increment_views(db, id=id)
        # Refresh to get updated views
        return await notice_repo.get(db, id=id)

    async def create_notice(
        self, db: AsyncSession, *, obj_in: NoticeCreate
    ) -> Any:
        return await notice_repo.create(db, obj_in=obj_in)

    async def update_notice(
        self, db: AsyncSession, *, id: int, obj_in: NoticeUpdate
    ) -> Any:
        db_obj = await notice_repo.get(db, id=id)
        if not db_obj:
            raise HTTPException(status_code=404, detail="Notice not found")
        return await notice_repo.update(db, db_obj=db_obj, obj_in=obj_in)

    async def delete_notice(self, db: AsyncSession, *, id: int) -> Any:
        db_obj = await notice_repo.get(db, id=id)
        if not db_obj:
            raise HTTPException(status_code=404, detail="Notice not found")
        return await notice_repo.remove(db, id=id)


notice_service = NoticeService()
