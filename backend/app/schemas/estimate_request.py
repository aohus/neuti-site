from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from fastapi import Form


class EstimateRequestBase(BaseModel):
    org_type: str
    org_name: str
    contact_name: str
    contact_phone: str
    contact_email: EmailStr | None = None
    work_type: str
    work_location: str
    desired_date: str | None = None
    budget_range: str | None = None
    details: str | None = None


class EstimateRequestCreate(EstimateRequestBase):
    @classmethod
    def as_form(
        cls,
        org_type: str = Form(...),
        org_name: str = Form(...),
        contact_name: str = Form(...),
        contact_phone: str = Form(...),
        contact_email: EmailStr | None = Form(None),
        work_type: str = Form(...),
        work_location: str = Form(...),
        desired_date: str | None = Form(None),
        budget_range: str | None = Form(None),
        details: str | None = Form(None),
    ):
        return cls(
            org_type=org_type,
            org_name=org_name,
            contact_name=contact_name,
            contact_phone=contact_phone,
            contact_email=contact_email,
            work_type=work_type,
            work_location=work_location,
            desired_date=desired_date,
            budget_range=budget_range,
            details=details,
        )


class EstimateRequestStatusUpdate(BaseModel):
    status: str  # new, in_progress, completed


class EstimateRequestResponse(EstimateRequestBase):
    id: int
    image_url: str | None = None
    status: str = "new"
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
