import logging
from urllib.parse import quote

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, RedirectResponse, Response

from app.core.config import settings
from app.utils.thumbnail import (
    THUMB_WIDTHS,
    ThumbnailError,
    get_or_create_thumbnail,
    resolve_source,
)

logger = logging.getLogger(__name__)

router = APIRouter()

# 원본 /uploads 와 같은 기준 (app/main.py UPLOADS_CACHE_CONTROL 참고)
THUMB_CACHE_CONTROL = "public, max-age=86400, stale-while-revalidate=604800"


@router.get("/{width}/{path:path}")
def read_thumbnail(width: int, path: str) -> Response:
    """uploads 이미지를 지정 폭으로 줄인 WebP (공개).

    async 가 아닌 이유: Pillow 디코딩·인코딩은 CPU 작업이라 이벤트 루프를 막는다.
    동기 함수로 두면 FastAPI 가 스레드풀에서 돌린다.
    """
    if width not in THUMB_WIDTHS:
        raise HTTPException(status_code=404)
    source = resolve_source(settings.UPLOAD_DIR, path)
    if source is None:
        raise HTTPException(status_code=404)
    try:
        thumb = get_or_create_thumbnail(source, width, settings.THUMB_CACHE_DIR)
    except ThumbnailError as exc:
        # 확장자만 jpg 인 PDF 같은 파일. 원본으로 보내 기존 동작을 유지한다.
        logger.warning("썸네일 생성 실패, 원본으로 대체: %r (%s)", path, exc)
        return RedirectResponse(f"/uploads/{quote(path)}", status_code=307)
    return FileResponse(
        thumb,
        media_type="image/webp",
        headers={"Cache-Control": THUMB_CACHE_CONTROL},
    )
