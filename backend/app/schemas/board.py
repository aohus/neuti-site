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

# For detail view with password check
class InquiryInDB(Inquiry):
    password_hash: str | None = None
