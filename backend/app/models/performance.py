from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.db.base_class import Base

class Performance(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    subtitle = Column(String, nullable=True)  # 목록/상세 상단에 주제목과 함께 노출되는 부제목
    # data/performances/<source_file>.md 에서 동기화된 행이면 그 파일명(확장자 제외).
    # 관리자 UI 로 직접 등록한 행은 NULL 이며, md 동기화가 건드리지 않는다.
    source_file = Column(String, nullable=True, index=True)
    content = Column(Text, nullable=False)  # 블로그 형태의 본문 (HTML 또는 JSON)
    thumbnail_url = Column(String, nullable=True) # 목록에 표시될 대표 이미지
    client = Column(String, nullable=True) # 발주처
    client_type = Column(String, nullable=True) # 발주처 유형: 관공서, 공공기관, 민간
    category = Column(String, nullable=True) # 사업 분야 (나무병원, 조경식재 등)
    year = Column(Integer, nullable=True) # 연도
    job_main_category = Column(String, nullable=True) # 작업분류
    job_sub_category = Column(String, nullable=True) # 작업소분류
    site_type = Column(String, nullable=True) # 대상지 분류
    site_location = Column(String, nullable=True) # 대상지
    construction_date = Column(DateTime(timezone=True), nullable=True) # 시공일
    created_at = Column(DateTime(timezone=True), server_default=func.now())
