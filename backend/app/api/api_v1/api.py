from fastapi import APIRouter
from app.api.api_v1.endpoints import diagnosis

api_router = APIRouter()
api_router.include_router(diagnosis.router, prefix="/diagnosis", tags=["diagnosis"])
