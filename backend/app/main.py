import asyncio
import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager, suppress

from fastapi import FastAPI
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.api_v1.api import api_router
from app.core.config import settings
from app.utils.thumbnail import prune_thumbnail_cache

logger = logging.getLogger(__name__)

# 원본 교체·삭제로 남은 썸네일을 사람이 지우지 않아도 되게 기동 시와 하루마다 정리한다.
THUMB_PRUNE_INTERVAL_SECONDS = 24 * 60 * 60

# 파일명이 내용 해시가 아니라 같은 이름으로 교체(재압축 등)될 수 있다.
# 그래서 하루만 신선하게 두고, 이후엔 쓰던 걸 보여주며 뒤에서 재검증한다.
UPLOADS_CACHE_CONTROL = "public, max-age=86400, stale-while-revalidate=604800"


class CachedStaticFiles(StaticFiles):
    """StaticFiles 는 Cache-Control 을 붙이지 않아 모바일이 매번 재검증 왕복을 한다."""

    def file_response(self, *args, **kwargs):  # type: ignore[no-untyped-def]
        response = super().file_response(*args, **kwargs)
        response.headers["Cache-Control"] = UPLOADS_CACHE_CONTROL
        return response


async def _prune_thumbnails_periodically() -> None:
    while True:
        try:
            removed = await run_in_threadpool(
                prune_thumbnail_cache, settings.UPLOAD_DIR, settings.THUMB_CACHE_DIR
            )
            if removed:
                logger.info("썸네일 캐시 정리: %d개 삭제", removed)
        except Exception:
            # 정리 실패로 서비스가 죽으면 안 된다. 다음 주기에 다시 시도한다.
            logger.exception("썸네일 캐시 정리 실패")
        await asyncio.sleep(THUMB_PRUNE_INTERVAL_SECONDS)


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    task = asyncio.create_task(_prune_thumbnails_periodically())
    yield
    task.cancel()
    with suppress(asyncio.CancelledError):
        await task


app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION, lifespan=lifespan)

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
