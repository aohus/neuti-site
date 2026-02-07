from typing import Any
from app.repositories.base import CRUDBase
from app.models.diagnosis import DiagnosisRequest
from app.schemas.diagnosis import DiagnosisRequestCreate


class CRUDDiagnosis(CRUDBase[DiagnosisRequest, DiagnosisRequestCreate, Any]):
    pass


diagnosis_repo = CRUDDiagnosis(DiagnosisRequest)
