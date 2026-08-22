"""업로드 이미지 검증·저장 유틸.

견적 요청·수목진단 의뢰 폼은 인증 없이 누구나 호출할 수 있다. 확장자를 사용자가
보낸 파일명에서 그대로 뽑아 쓰면 `.html` 이나 `.svg` 도 저장되고, `/uploads` 는
사이트와 같은 오리진에서 서빙되므로 저장형 XSS 가 된다. 그래서 확장자·매직바이트·
크기를 모두 검증한 뒤에만 디스크에 남긴다.
"""

import logging
from pathlib import Path
from uuid import uuid4

import aiofiles
from fastapi import HTTPException, UploadFile

logger = logging.getLogger(__name__)

ALLOWED_IMAGE_EXTENSIONS = frozenset({".jpg", ".jpeg", ".png", ".webp"})
MAX_IMAGE_BYTES = 10 * 1024 * 1024
CHUNK_BYTES = 1024 * 1024
MAGIC_HEAD_BYTES = 12

# 확장자만 믿으면 .jpg 로 위장한 HTML 이 그대로 저장된다.
_MAGIC_PREFIXES = (
    b"\xff\xd8\xff",  # JPEG
    b"\x89PNG\r\n\x1a\n",  # PNG
)
_RIFF_PREFIX = b"RIFF"
_WEBP_TAG = b"WEBP"

_INVALID_TYPE_DETAIL = "이미지는 jpg, jpeg, png, webp 형식만 업로드할 수 있습니다."
_TOO_LARGE_DETAIL = f"이미지는 {MAX_IMAGE_BYTES // (1024 * 1024)}MB 이하만 업로드할 수 있습니다."


def has_image_magic(head: bytes) -> bool:
    """파일 앞부분이 허용된 이미지 포맷의 시그니처인지 확인한다."""
    if head.startswith(_MAGIC_PREFIXES):
        return True
    # WEBP 는 "RIFF" + 4바이트 길이 + "WEBP" 구조다.
    return head.startswith(_RIFF_PREFIX) and head[8:12] == _WEBP_TAG


def validate_image_extension(filename: str | None) -> str:
    """허용된 이미지 확장자면 소문자로 정규화해 반환하고, 아니면 400 을 던진다."""
    extension = Path(filename or "").suffix.lower()
    if extension not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(status_code=400, detail=_INVALID_TYPE_DETAIL)
    return extension


async def save_upload_image(image: UploadFile, *, upload_dir: Path, prefix: str = "") -> str:
    """검증을 통과한 이미지를 저장하고 공개 URL 경로를 반환한다.

    파일명은 항상 uuid 로 새로 짓는다. 사용자가 보낸 이름은 확장자 판별에만 쓴다.
    """
    extension = validate_image_extension(image.filename)

    head = await image.read(MAGIC_HEAD_BYTES)
    if not has_image_magic(head):
        raise HTTPException(status_code=400, detail=_INVALID_TYPE_DETAIL)

    upload_dir.mkdir(parents=True, exist_ok=True)
    file_name = f"{prefix}{uuid4()}{extension}"
    full_path = upload_dir / file_name

    written = len(head)
    try:
        async with aiofiles.open(full_path, mode="wb") as f:
            await f.write(head)
            while chunk := await image.read(CHUNK_BYTES):
                written += len(chunk)
                if written > MAX_IMAGE_BYTES:
                    raise HTTPException(status_code=413, detail=_TOO_LARGE_DETAIL)
                await f.write(chunk)
    except Exception:
        # 검증에 실패한 파일을 디스크에 남기지 않는다.
        full_path.unlink(missing_ok=True)
        raise

    return f"/uploads/{file_name}"
