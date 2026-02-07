from typing import Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.repositories.inquiry_repo import inquiry_repo, answer_repo
from app.schemas.board import InquiryCreate, InquiryUpdate, AnswerCreate
from app.core.security import get_password_hash, verify_password


class InquiryService:
    async def get_inquiries(
        self, db: AsyncSession, *, skip: int = 0, limit: int = 100
    ) -> List[Any]:
        return await inquiry_repo.get_multi(db, skip=skip, limit=limit)

    async def get_inquiry(self, db: AsyncSession, *, id: int) -> Any:
        db_obj = await inquiry_repo.get(db, id=id)
        if not db_obj:
            raise HTTPException(status_code=404, detail="Inquiry not found")
        return db_obj

    async def get_inquiry_with_access(
        self, db: AsyncSession, *, id: int, password: Optional[str] = None
    ) -> Any:
        inquiry = await self.get_inquiry(db, id=id)
        
        if inquiry.is_secret:
            if not password:
                raise HTTPException(status_code=401, detail="Password required for secret inquiry")
            if not inquiry.password_hash or not verify_password(password, inquiry.password_hash):
                raise HTTPException(status_code=401, detail="Invalid password")
                
        return inquiry

    async def create_inquiry(
        self, db: AsyncSession, *, obj_in: InquiryCreate
    ) -> Any:
        # Hash password if provided
        obj_in_data = obj_in.model_dump()
        password = obj_in_data.pop("password", None)
        if password:
            obj_in_data["password_hash"] = get_password_hash(password)
        
        # Create inquiry without 'password' field in constructor
        from app.models.board import Inquiry
        db_obj = Inquiry(**obj_in_data)
        db.add(db_obj)
        await db.commit()
        
        # Return fetched object with relationship loaded
        return await self.get_inquiry(db, id=db_obj.id)

    async def delete_inquiry(self, db: AsyncSession, *, id: int) -> Any:
        db_obj = await inquiry_repo.get(db, id=id)
        if not db_obj:
            raise HTTPException(status_code=404, detail="Inquiry not found")
        return await inquiry_repo.remove(db, id=id)

    async def create_answer(
        self, db: AsyncSession, *, obj_in: AnswerCreate
    ) -> Any:
        return await answer_repo.create(db, obj_in=obj_in)


inquiry_service = InquiryService()
