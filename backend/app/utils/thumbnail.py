"""uploads 이미지의 축소판(WebP)을 만들고 디스크에 캐시한다.

시공사례 카드·상세 이미지는 uploads 원본(장변 1600px)을 그대로 받아 모바일에서
목록 한 페이지가 4MB 를 넘었다. next/image 는 uploads 에 쓸 수 없으므로
(RecentPortfolio 주석 참고) 백엔드가 폭을 줄인 사본을 만든다.
"""

import hashlib
import os
import stat
import threading
import time
from pathlib import Path
from tempfile import NamedTemporaryFile

from PIL import Image, ImageOps

from app.utils.upload import ALLOWED_IMAGE_EXTENSIONS

# 임의 폭을 받으면 폭마다 캐시가 생겨 디스크·CPU 를 소모시킬 수 있다.
# 그래서 허용목록으로 묶는다.
# 프론트 src/lib/thumb.ts 의 THUMB_WIDTHS 와 같아야 한다.
THUMB_WIDTHS = frozenset({480, 960})
WEBP_QUALITY = 78
# 업로드는 10MB 로 제한되지만 1비트 PNG 는 수십 KB 로 수천만 픽셀을 담는다.
# Pillow 의 MAX_IMAGE_PIXELS 는 2배를 넘어야 예외라 직접 헤더 크기로 막는다.
# 커밋되는 원본은 장변 1600px(약 200만 픽셀)이라 여유가 크다.
MAX_SOURCE_PIXELS = 25_000_000
# 확장자와 다른 포맷(GIF·PSD·EPS 등)의 디코더에 닿지 않게 한다.
DECODE_FORMATS = ("JPEG", "PNG", "WEBP")
# CPU 0.5 개·메모리 512MB 컨테이너라 캐시 미스 생성은 동시에 2개까지만 돌린다.
_GENERATION_SLOTS = threading.BoundedSemaphore(2)

# 이보다 오래된 .tmp 는 생성 도중 죽은 프로세스가 남긴 것으로 본다.
STALE_TMP_SECONDS = 10 * 60

Image.MAX_IMAGE_PIXELS = MAX_SOURCE_PIXELS


class ThumbnailError(Exception):
    """원본은 있지만 썸네일을 만들 수 없을 때(손상·위장 파일 등)."""


def resolve_source(upload_dir: Path, rel_path: str) -> Path | None:
    """uploads 안의 허용된 이미지 파일이면 절대경로를, 아니면 None 을 돌려준다."""
    root = upload_dir.resolve()
    try:
        source = (root / rel_path).resolve(strict=True)
    # ValueError: 경로에 NUL 바이트가 섞인 요청 (그대로 두면 500)
    except (OSError, RuntimeError, ValueError):
        return None
    if not source.is_relative_to(root) or not source.is_file():
        return None
    if source.suffix.lower() not in ALLOWED_IMAGE_EXTENSIONS:
        return None
    return source


def _cache_name(source: Path, width: int) -> str:
    """원본 버전마다 다른 캐시 파일 이름.

    원본을 같은 이름으로 덮어쓰면 mtime·크기가 바뀌어 새 이름이 된다. 이름만으로
    '지금 원본에 해당하는 캐시'를 다시 계산할 수 있어야 prune 이 낡은 걸 고른다.
    """
    info = source.stat()
    path_digest = hashlib.sha256(str(source).encode()).hexdigest()[:32]
    return f"{path_digest}_{width}_{info.st_mtime_ns}_{info.st_size}.webp"


def _resize(source: Path, width: int) -> Image.Image:
    try:
        with Image.open(source, formats=DECODE_FORMATS) as image:
            if image.width * image.height > MAX_SOURCE_PIXELS:
                raise ThumbnailError(f"too many pixels: {image.size}")
            # JPEG 는 축소 디코딩으로 전체 해상도 디코딩 비용을 건너뛴다.
            # EXIF 회전 뒤의 가로가 세로였을 수 있어 양 변 모두 width 이상으로 요청한다.
            image.draft("RGB", (width, width))
            oriented = ImageOps.exif_transpose(image)
            if oriented.mode not in ("RGB", "RGBA"):
                oriented = oriented.convert("RGB")
            if oriented.width <= width:
                return oriented.copy()
            height = round(oriented.height * width / oriented.width)
            return oriented.resize((width, height), Image.Resampling.LANCZOS)
    except ThumbnailError:
        raise
    except Exception as exc:
        # 손상 파일은 OSError 말고도 SyntaxError·EOFError·struct.error 등을 낸다.
        # 어떤 실패든 원본으로 대체하는 쪽(엔드포인트의 307)이 500 보다 낫다.
        raise ThumbnailError(repr(exc)) from exc


def _save_atomically(image: Image.Image, target: Path) -> None:
    # 동시 요청이 같은 캐시를 만들어도 반쯤 쓴 파일이 노출되지 않게
    # 임시 파일에 쓴 뒤 교체한다.
    with NamedTemporaryFile(dir=target.parent, suffix=".tmp", delete=False) as tmp:
        tmp_path = Path(tmp.name)
    try:
        image.save(tmp_path, "WEBP", quality=WEBP_QUALITY, method=4)
        os.replace(tmp_path, target)
    except Exception:
        tmp_path.unlink(missing_ok=True)
        raise


def get_or_create_thumbnail(source: Path, width: int, cache_dir: Path) -> Path:
    """캐시된 썸네일 경로를 돌려준다. 없으면 만든다."""
    cache_dir.mkdir(parents=True, exist_ok=True)
    target = cache_dir / _cache_name(source, width)
    if target.exists():
        return target
    with _GENERATION_SLOTS:
        # 기다리는 동안 같은 썸네일을 다른 요청이 이미 만들었을 수 있다.
        if not target.exists():
            _save_atomically(_resize(source, width), target)
    return target


def _expected_names(upload_dir: Path) -> set[str]:
    """지금 uploads 에 있는 원본 버전들에 해당하는 캐시 파일 이름."""
    root = upload_dir.resolve()
    names: set[str] = set()
    for path in root.rglob("*"):
        if path.suffix.lower() not in ALLOWED_IMAGE_EXTENSIONS:
            continue
        # resolve_source 와 같은 절대경로여야 캐시 이름이 일치한다.
        source = path.resolve()
        if not source.is_relative_to(root):
            continue
        try:
            if source.is_file():
                names.update(_cache_name(source, width) for width in THUMB_WIDTHS)
        except FileNotFoundError:
            continue  # 훑는 사이 지워진 원본
    return names


def _is_removable(entry: Path, expected: set[str], started: float) -> bool:
    try:
        info = entry.stat()
    except FileNotFoundError:
        return False  # 훑는 사이 os.replace 로 이름이 바뀐 .tmp 등
    if not stat.S_ISREG(info.st_mode):
        return False
    mtime = info.st_mtime
    if entry.suffix == ".tmp":
        return mtime < started - STALE_TMP_SECONDS
    # 원본 스냅샷 뒤에 올라온 사진의 썸네일을 요청이 막 만들었을 수 있다.
    return entry.name not in expected and mtime < started


def prune_thumbnail_cache(upload_dir: Path, cache_dir: Path) -> int:
    """현재 원본 버전에 해당하지 않는 썸네일과 죽은 임시 파일을 지운다.

    지운 파일 수를 돌려준다. 원본이 지워졌거나 교체된 썸네일, 이전 형식의 캐시가
    대상이다. 생성 중일 수 있는 최근 .tmp 와 정리 도중 생긴 파일은 남긴다.
    """
    if not cache_dir.is_dir():
        return 0
    started = time.time()
    expected = _expected_names(upload_dir)
    removed = 0
    for entry in cache_dir.iterdir():
        if _is_removable(entry, expected, started):
            entry.unlink(missing_ok=True)
            removed += 1
    return removed
