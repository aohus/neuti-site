from pydantic import BaseModel, ConfigDict
from datetime import datetime

class PerformanceBase(BaseModel):
    title: str
    content: str
    category: str | None = None
    thumbnail_url: str | None = None
    client: str | None = None
    construction_date: datetime | None = None

class PerformanceCreate(PerformanceBase):
    pass

class PerformanceUpdate(PerformanceBase):
    title: str | None = None
    content: str | None = None
    category: str | None = None
    thumbnail_url: str | None = None
    client: str | None = None
    construction_date: datetime | None = None

class Performance(PerformanceBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
