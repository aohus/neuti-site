from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.board import (
    Answer,
    AnswerCreate,
    Inquiry,
    InquiryAccess,
    InquiryListItem,
    InquirySubmit,
)
from app.api import deps
from app.services.inquiry_service import inquiry_service
from app.utils.antispam import check_spam
from app.utils.attempt_limiter import AttemptLimiter

router = APIRouter()

# 비밀글 비밀번호 대입 방어: 같은 IP·같은 글에서 10분 안에 5번 틀리면 잠시 막는다.
MAX_PASSWORD_FAILURES = 5
PASSWORD_FAILURE_WINDOW_SECONDS = 600
access_limiter = AttemptLimiter(
    max_failures=MAX_PASSWORD_FAILURES,
    window_seconds=PASSWORD_FAILURE_WINDOW_SECONDS,
)


def _client_ip(request: Request) -> str:
    # 운영에선 Traefik 이 X-Forwarded-For 를 붙인다. 마지막 값이 프록시가 본 실제 접속 IP 다
    # (앞쪽 값은 클라이언트가 임의로 넣을 수 있다).
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[-1].strip()
    return request.client.host if request.client else "unknown"

MAX_LIST_LIMIT = 100


@router.get("", response_model=List[InquiryListItem])
@router.get("/", response_model=List[InquiryListItem], include_in_schema=False)
async def read_inquiries(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(MAX_LIST_LIMIT, ge=1, le=MAX_LIST_LIMIT),
) -> Any:
    """
    문의 목록. 인증 없이 열리므로 본문·답변은 내려주지 않는다(비밀글 보호).
    """
    inquiries = await inquiry_service.get_inquiries(db, skip=skip, limit=limit)
    return [InquiryListItem.from_model(i) for i in inquiries]

@router.post("", response_model=Inquiry)
@router.post("/", response_model=Inquiry, include_in_schema=False)
async def create_inquiry(
    *,
    db: AsyncSession = Depends(get_db),
    inquiry_in: InquirySubmit,
) -> Any:
    """
    문의 작성 (누구나). 허니팟·작성 시간으로 봇 제출을 거른다.
    """
    check_spam(website=inquiry_in.website, elapsed_ms=inquiry_in.elapsed_ms)
    return await inquiry_service.create_inquiry(db, obj_in=inquiry_in.to_create())

@router.get("/{id}", response_model=Inquiry)
async def read_inquiry(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
) -> Any:
    """
    공개 문의 조회. 비밀글은 401 — POST /{id}/access 로 비밀번호를 보내 열람한다.
    """
    return await inquiry_service.get_inquiry_with_access(db, id=id, password=None)


@router.post("/{id}/access", response_model=Inquiry)
async def access_inquiry(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    access_in: InquiryAccess,
    request: Request,
) -> Any:
    """
    비밀글 열람. 비밀번호는 로그·브라우저 기록에 남지 않도록 본문으로 받고, 연속 실패는 막는다.
    """
    key = f"{_client_ip(request)}:{id}"
    # 검증 전에 시도를 차감한다. 검사와 기록 사이에 await 가 끼면 병렬 요청이 한도를 우회한다.
    access_limiter.acquire(key)
    try:
        inquiry = await inquiry_service.get_inquiry_with_access(db, id=id, password=access_in.password)
    except HTTPException as exc:
        if exc.status_code != status.HTTP_401_UNAUTHORIZED:
            access_limiter.release(key)
        raise
    except Exception:
        access_limiter.release(key)
        raise
    access_limiter.reset(key)
    return inquiry

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