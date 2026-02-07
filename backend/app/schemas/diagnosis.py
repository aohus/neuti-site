from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime

class DiagnosisRequestBase(BaseModel):
    name: str
    contact: str
    email: EmailStr | None = None
    address: str
    symptom: str

from fastapi import Form

class DiagnosisRequestCreate(DiagnosisRequestBase):
    @classmethod
    def as_form(
        cls,
        name: str = Form(...),
        contact: str = Form(...),
        email: EmailStr | None = Form(None),
        address: str = Form(...),
        symptom: str = Form(...),
    ):
        return cls(
            name=name,
            contact=contact,
            email=email,
            address=address,
            symptom=symptom
        )

class DiagnosisRequest(DiagnosisRequestBase):
    id: int
    image_path: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
