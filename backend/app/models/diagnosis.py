from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.db.base_class import Base

class DiagnosisRequest(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    contact = Column(String, nullable=False)
    email = Column(String, nullable=True)
    address = Column(String, nullable=False)
    symptom = Column(Text, nullable=False)
    image_path = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
