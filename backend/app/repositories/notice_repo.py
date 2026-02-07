from typing import Any, List, Optional
from sqlalchemy import select, desc, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import CRUDBase
from app.models.board import Notice
from app.schemas.board import NoticeCreate, NoticeUpdate


class CRUDNotice(CRUDBase[Notice, NoticeCreate, NoticeUpdate]):
    async def increment_views(self, db: AsyncSession, *, id: int) -> None:
        await db.execute(
            update(self.model).where(self.model.id == id).values(views=self.model.views + 1)
        )
        await db.commit()


notice_repo = CRUDNotice(Notice)
