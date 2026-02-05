from typing import Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
import aiofiles
import os
from uuid import uuid4

from app.db.session import get_db
from app.models.diagnosis import DiagnosisRequest
from app.schemas.diagnosis import DiagnosisRequest as DiagnosisRequestSchema
from app.core.config import settings
from app.utils.email import send_diagnosis_notification

router = APIRouter()

@router.post("", response_model=DiagnosisRequestSchema)
@router.post("/", response_model=DiagnosisRequestSchema, include_in_schema=False)
async def create_diagnosis_request(
    *,
    db: AsyncSession = Depends(get_db),
    name: str = Form(...),
    contact: str = Form(...),
    email: str = Form(None),
    address: str = Form(...),
    symptom: str = Form(...),
    image: UploadFile = File(None)
) -> Any:
    # 1. Handle File Upload
    image_path = None
    if image:
        if not os.path.exists(settings.UPLOAD_DIR):
            os.makedirs(settings.UPLOAD_DIR)
        
        file_ext = os.path.splitext(image.filename)[1]
        file_name = f"{uuid4()}{file_ext}"
        image_path = str(settings.UPLOAD_DIR / file_name)
        
        async with aiofiles.open(image_path, mode='wb') as f:
            content = await image.read()
            await f.write(content)

    # 2. Save to DB
    db_obj = DiagnosisRequest(
        name=name,
        contact=contact,
        email=email,
        address=address,
        symptom=symptom,
        image_path=image_path
    )
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)

    # 3. Send Notification
    try:
        await send_diagnosis_notification(
            settings.MAIL_FROM, # Notify admin
            {
                "name": name,
                "contact": contact,
                "email": email,
                "address": address,
                "symptom": symptom
            }
        )
    except Exception as e:
        print(f"Failed to send email: {e}")
        # We don't fail the request if email fails, but maybe we should log it better

    return db_obj
