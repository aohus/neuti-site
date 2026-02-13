from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.db.base_class import Base


class EstimateRequest(Base):
    id = Column(Integer, primary_key=True, index=True)
    org_type = Column(String, nullable=False)        # 소속 기관 유형
    org_name = Column(String, nullable=False)        # 기관/업체명
    contact_name = Column(String, nullable=False)    # 담당자명
    contact_phone = Column(String, nullable=False)   # 연락처
    contact_email = Column(String, nullable=True)    # 이메일
    work_type = Column(String, nullable=False)       # 작업 유형
    work_location = Column(String, nullable=False)   # 작업 위치
    desired_date = Column(String, nullable=True)     # 희망 시기
    budget_range = Column(String, nullable=True)     # 예산 규모
    details = Column(Text, nullable=True)            # 상세 요청사항
    image_url = Column(String, nullable=True)        # 참고 사진
    status = Column(String, nullable=False, default="new", server_default="new")  # new, in_progress, completed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
