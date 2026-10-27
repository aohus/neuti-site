from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.api_v1.api import api_router
from app.core.config import settings

# 파일명이 내용 해시가 아니라 같은 이름으로 교체(재압축 등)될 수 있다.
# 그래서 하루만 신선하게 두고, 이후엔 쓰던 걸 보여주며 뒤에서 재검증한다.
UPLOADS_CACHE_CONTROL = "public, max-age=86400, stale-while-revalidate=604800"


class CachedStaticFiles(StaticFiles):
    """StaticFiles 는 Cache-Control 을 붙이지 않아 모바일이 매번 재검증 왕복을 한다."""

    def file_response(self, *args, **kwargs):  # type: ignore[no-untyped-def]
        response = super().file_response(*args, **kwargs)
        response.headers["Cache-Control"] = UPLOADS_CACHE_CONTROL
        return response


app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)

# Static files
app.mount("/uploads", CachedStaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok"}

app.include_router(api_router, prefix=settings.API_V1_STR)
