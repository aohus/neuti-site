from fastapi import APIRouter
from app.api.api_v1.endpoints import diagnosis, login, notice, inquiry, performance, technology_item

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(notice.router, prefix="/notice", tags=["notice"])
api_router.include_router(inquiry.router, prefix="/inquiry", tags=["inquiry"])
api_router.include_router(diagnosis.router, prefix="/diagnosis", tags=["diagnosis"])
api_router.include_router(performance.router, prefix="/performance", tags=["performance"])
api_router.include_router(performance.utils_router, prefix="/upload", tags=["upload"])
api_router.include_router(technology_item.router, prefix="/technology-item", tags=["technology-item"])
