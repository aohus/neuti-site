from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, desc
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.board import Inquiry as InquiryModel, Answer as AnswerModel
from app.schemas.board import Inquiry, InquiryCreate, InquiryUpdate, AnswerCreate, Answer
from app.api import deps
from app.core import security

router = APIRouter()

@router.get("/", response_model=List[Inquiry])
async def read_inquiries(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve inquiries.
    """
    result = await db.execute(
        select(InquiryModel)
        .options(selectinload(InquiryModel.answer))
        .order_by(desc(InquiryModel.created_at))
        .offset(skip).limit(limit)
    )
    return result.scalars().all()

@router.post("/", response_model=Inquiry)
async def create_inquiry(
    *,
    db: AsyncSession = Depends(get_db),
    inquiry_in: InquiryCreate,
) -> Any:
    """
    Create new inquiry.
    """
    obj_data = inquiry_in.model_dump(exclude={"password"})
    if inquiry_in.password:
        obj_data["password_hash"] = security.get_password_hash(inquiry_in.password)
        obj_data["is_secret"] = True
    
    db_obj = InquiryModel(**obj_data)
    db.add(db_obj)
    await db.commit()
    
    # Reload with relationships to avoid lazy loading errors during serialization
    result = await db.execute(
        select(InquiryModel)
        .options(selectinload(InquiryModel.answer))
        .where(InquiryModel.id == db_obj.id)
    )
    return result.scalar_one()

@router.get("/{id}", response_model=Inquiry)
async def read_inquiry(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    password: str | None = None,
    current_admin: str | None = Depends(deps.get_current_admin_optional), # Optional admin
) -> Any:
    """
    Get inquiry by ID.
    If secret, requires correct password or admin privileges.
    NOTE: In a real app, password should be sent in a separate POST verify or as a header.
    For simplicity, we use query param here but handle it carefully.
    """
    result = await db.execute(
        select(InquiryModel)
        .options(selectinload(InquiryModel.answer))
        .where(InquiryModel.id == id)
    )
    inquiry = result.scalar_one_or_none()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    
    if inquiry.is_secret and not current_admin:
        if not password or not security.verify_password(password, inquiry.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Password required or incorrect for secret inquiry"
            )
            
    return inquiry

@router.post("/{id}/verify-password")
async def verify_inquiry_password(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    password: str,
) -> Any:
    """
    Verify password for a secret inquiry.
    Returns success if correct.
    """
    result = await db.execute(select(InquiryModel).where(InquiryModel.id == id))
    inquiry = result.scalar_one_or_none()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    
    if not inquiry.password_hash or not security.verify_password(password, inquiry.password_hash):
        return {"success": False}
    
    return {"success": True}

@router.delete("/{id}", response_model=Inquiry)
async def delete_inquiry(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    password: str | None = None,
    current_admin: str = Depends(deps.get_current_admin),
) -> Any:
    """
    Delete an inquiry.
    Requires admin privileges.
    """
    result = await db.execute(select(InquiryModel).where(InquiryModel.id == id))
    inquiry = result.scalar_one_or_none()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    
    await db.delete(inquiry)
    await db.commit()
    return inquiry

@router.post("/{id}/answer", response_model=Answer)
async def create_answer(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    answer_in: AnswerCreate,
    current_admin: str = Depends(deps.get_current_admin),
) -> Any:
    """
    Create or update answer for an inquiry.
    Admin only.
    """
    result = await db.execute(select(InquiryModel).where(InquiryModel.id == id))
    inquiry = result.scalar_one_or_none()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    
    # Check if answer already exists
    result = await db.execute(select(AnswerModel).where(AnswerModel.inquiry_id == id))
    existing_answer = result.scalar_one_or_none()
    
    if existing_answer:
        existing_answer.content = answer_in.content
        db.add(existing_answer)
        db_obj = existing_answer
    else:
        db_obj = AnswerModel(inquiry_id=id, content=answer_in.content)
        db.add(db_obj)
    
    await db.commit()
    await db.refresh(db_obj)
    return db_obj
