from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.db.base_class import Base

class Performance(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)  # 블로그 형태의 본문 (HTML 또는 JSON)
    thumbnail_url = Column(String, nullable=True) # 목록에 표시될 대표 이미지
    client = Column(String, nullable=True) # 발주처
    category = Column(String, nullable=True) # 사업 분야 (나무병원, 조경식재 등)
    construction_date = Column(DateTime(timezone=True), nullable=True) # 시공일
    created_at = Column(DateTime(timezone=True), server_default=func.now())
