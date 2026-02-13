from typing import Any
from app.repositories.base import CRUDBase
from app.models.estimate_request import EstimateRequest
from app.schemas.estimate_request import EstimateRequestCreate


class CRUDEstimateRequest(CRUDBase[EstimateRequest, EstimateRequestCreate, Any]):
    pass


estimate_request_repo = CRUDEstimateRequest(EstimateRequest)
