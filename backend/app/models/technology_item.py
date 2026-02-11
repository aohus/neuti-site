from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from app.db.base_class import Base


class TechnologyItem(Base):
    __tablename__ = "technologyitem"

    id = Column(Integer, primary_key=True, index=True)
    item_key = Column(String, unique=True, nullable=False)  # e.g. "landscape_planting"
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    doctor_note = Column(Text, nullable=True)
    key_points = Column(JSON, nullable=True)   # ["포인트1", "포인트2"]
    images = Column(JSON, nullable=True)       # [{"src": ..., "tag": ..., "alt": ...}, ...]
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
