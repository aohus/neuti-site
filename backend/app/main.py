from fastapi import FastAPI
from app.api.api_v1.api import api_router
from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)

@app.get("/health")
async def health_check():
    return {"status": "ok"}

app.include_router(api_router, prefix=settings.API_V1_STR)
