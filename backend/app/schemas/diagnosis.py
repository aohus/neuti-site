from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime

class DiagnosisRequestBase(BaseModel):
    name: str
    contact: str
    email: EmailStr | None = None
    address: str
    symptom: str

class DiagnosisRequestCreate(DiagnosisRequestBase):
    pass

class DiagnosisRequest(DiagnosisRequestBase):
    id: int
    image_path: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
