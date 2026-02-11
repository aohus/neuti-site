from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict


class TechnologyImageSchema(BaseModel):
    src: str
    tag: str
    alt: str


class TechnologyItemBase(BaseModel):
    item_key: str
    title: str
    description: str | None = None
    doctor_note: str | None = None
    key_points: list[str] | None = None
    images: list[TechnologyImageSchema] | None = None
    sort_order: int = 0


class TechnologyItemCreate(TechnologyItemBase):
    pass


class TechnologyItemUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    doctor_note: str | None = None
    key_points: list[str] | None = None
    images: list[TechnologyImageSchema] | None = None
    sort_order: int | None = None


class TechnologyItem(TechnologyItemBase):
    id: int
    created_at: datetime
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
