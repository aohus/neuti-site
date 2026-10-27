from typing import Any

from pydantic import BaseModel, ConfigDict
from datetime import datetime

# --- Answer Schemas ---
class AnswerBase(BaseModel):
    content: str

class AnswerCreate(AnswerBase):
    inquiry_id: int

class Answer(AnswerBase):
    id: int
    inquiry_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- Notice Schemas ---
class NoticeBase(BaseModel):
    title: str
    content: str

class NoticeCreate(NoticeBase):
    pass

class NoticeUpdate(NoticeBase):
    title: str | None = None
    content: str | None = None

class Notice(NoticeBase):
    id: int
    created_at: datetime
    views: int
    model_config = ConfigDict(from_attributes=True)

# --- Inquiry Schemas ---
class InquiryBase(BaseModel):
    title: str
    content: str
    author: str
    is_secret: bool = False

class InquiryCreate(InquiryBase):
    password: str | None = None

# 공개 작성 폼 요청. 스팸 판정 필드는 저장하지 않고 엔드포인트에서 걸러낸다.
class InquirySubmit(InquiryCreate):
    website: str | None = None
    elapsed_ms: int | None = None

    def to_create(self) -> InquiryCreate:
        return InquiryCreate(**self.model_dump(exclude={"website", "elapsed_ms"}))

class InquiryAccess(BaseModel):
    password: str

class InquiryUpdate(InquiryBase):
    title: str | None = None
    content: str | None = None
    author: str | None = None
    password: str | None = None

class Inquiry(InquiryBase):
    id: int
    created_at: datetime
    answer: Answer | None = None
    model_config = ConfigDict(from_attributes=True)

# 목록용. 비밀글 본문·답변이 익명 사용자에게 새지 않도록 본문 필드를 아예 두지 않는다.
# 본문은 비밀번호 확인을 거치는 상세 조회(GET /inquiry/{id})로만 내려간다.
class InquiryListItem(BaseModel):
    id: int
    title: str
    author: str
    is_secret: bool
    created_at: datetime
    has_answer: bool

    @classmethod
    def from_model(cls, inquiry: Any) -> "InquiryListItem":
        return cls(
            id=inquiry.id,
            title=inquiry.title,
            author=inquiry.author,
            is_secret=bool(inquiry.is_secret),
            created_at=inquiry.created_at,
            has_answer=inquiry.answer is not None,
        )

# For detail view with password check
class InquiryInDB(Inquiry):
    password_hash: str | None = None
