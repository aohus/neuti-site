from typing import Any, List, Optional
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.repositories.base import CRUDBase
from app.models.board import Inquiry, Answer
from app.schemas.board import InquiryCreate, InquiryUpdate, AnswerCreate


class CRUDInquiry(CRUDBase[Inquiry, InquiryCreate, InquiryUpdate]):
    async def get(self, db: AsyncSession, id: Any) -> Optional[Inquiry]:
        result = await db.execute(
            select(self.model)
            .filter(self.model.id == id)
            .options(selectinload(self.model.answer))
        )
        return result.scalar_one_or_none()

    async def get_multi(
        self, db: AsyncSession, *, skip: int = 0, limit: int = 100
    ) -> List[Inquiry]:
        result = await db.execute(
            select(self.model)
            .options(selectinload(self.model.answer))
            .order_by(desc(self.model.created_at))
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()


class CRUDAnswer(CRUDBase[Answer, AnswerCreate, Any]):
    pass


inquiry_repo = CRUDInquiry(Inquiry)
answer_repo = CRUDAnswer(Answer)
