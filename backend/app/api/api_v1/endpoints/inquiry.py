from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.board import Inquiry, InquiryCreate, InquiryUpdate, Answer, AnswerCreate
from app.api import deps
from app.services.inquiry_service import inquiry_service
from app.core.security import verify_password

router = APIRouter()

@router.get("", response_model=List[Inquiry])
@router.get("/", response_model=List[Inquiry], include_in_schema=False)
async def read_inquiries(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve inquiries.
    """
    return await inquiry_service.get_inquiries(db, skip=skip, limit=limit)

@router.post("", response_model=Inquiry)
@router.post("/", response_model=Inquiry, include_in_schema=False)
async def create_inquiry(
    *,
    db: AsyncSession = Depends(get_db),
    inquiry_in: InquiryCreate,
) -> Any:
    """
    Create new inquiry.
    """
    return await inquiry_service.create_inquiry(db, obj_in=inquiry_in)

@router.get("/{id}", response_model=Inquiry)
async def read_inquiry(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    password: str | None = None,
) -> Any:
    """
    Get inquiry by ID.
    """
    return await inquiry_service.get_inquiry_with_access(db, id=id, password=password)

@router.delete("/{id}", response_model=Inquiry)
async def delete_inquiry(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    current_admin: str = Depends(deps.get_current_admin),
) -> Any:
    """
    Delete an inquiry.
    """
    return await inquiry_service.delete_inquiry(db, id=id)

@router.post("/{id}/answer", response_model=Answer)
async def create_answer(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    answer_in: AnswerCreate,
    current_admin: str = Depends(deps.get_current_admin),
) -> Any:
    """
    Create answer for inquiry (Admin only).
    """
    if answer_in.inquiry_id != id:
        raise HTTPException(status_code=400, detail="Inquiry ID mismatch")
    return await inquiry_service.create_answer(db, obj_in=answer_in)