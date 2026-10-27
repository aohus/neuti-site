"""업로드 이미지 썸네일 API 테스트.

시공사례 목록 카드는 모바일에서 화면 폭 정도로만 보이는데, uploads 원본
(장변 1600px, 장당 300~600KB)을 그대로 받아 목록 한 페이지가 4MB 를 넘었다.
`/api/v1/thumb/{width}/{path}` 가 폭을 줄인 WebP 를 만들어 디스크에 캐시한다.
"""

from io import BytesIO
from pathlib import Path
from urllib.parse import quote

import pytest
from httpx import ASGITransport, AsyncClient
from PIL import Image

from app.core.config import settings
from app.main import app

THUMB_PREFIX = f"{settings.API_V1_STR}/thumb"


def _write_jpeg(path: Path, size: tuple[int, int] = (1600, 1200)) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    Image.new("RGB", size, (34, 139, 34)).save(path, "JPEG", quality=90)


@pytest.fixture(autouse=True)
def thumb_cache_dir(tmp_path_factory, monkeypatch) -> Path:
    cache_dir = tmp_path_factory.mktemp("thumb-cache")
    monkeypatch.setattr(settings, "THUMB_CACHE_DIR", cache_dir)
    return cache_dir


async def _get(path: str):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        return await ac.get(path)


@pytest.mark.asyncio
async def test_허용된_폭으로_줄인_webp_를_돌려준다(isolate_upload_dir: Path):
    # Arrange
    _write_jpeg(isolate_upload_dir / "2026_현장" / "사진.jpg")

    # Act
    response = await _get(f"{THUMB_PREFIX}/480/2026_현장/사진.jpg")

    # Assert
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/webp"
    assert "max-age" in response.headers["cache-control"]
    image = Image.open(BytesIO(response.content))
    assert image.format == "WEBP"
    assert image.size == (480, 360)


@pytest.mark.asyncio
async def test_원본보다_큰_폭을_요청해도_확대하지_않는다(isolate_upload_dir: Path):
    _write_jpeg(isolate_upload_dir / "small.jpg", size=(400, 300))

    response = await _get(f"{THUMB_PREFIX}/960/small.jpg")

    assert response.status_code == 200
    assert Image.open(BytesIO(response.content)).size == (400, 300)


@pytest.mark.asyncio
async def test_두_번째_요청은_캐시된_파일을_재사용한다(
    isolate_upload_dir: Path, thumb_cache_dir: Path
):
    _write_jpeg(isolate_upload_dir / "a.jpg")

    first = await _get(f"{THUMB_PREFIX}/480/a.jpg")
    cached = list(thumb_cache_dir.iterdir())
    mtimes = [p.stat().st_mtime_ns for p in cached]
    second = await _get(f"{THUMB_PREFIX}/480/a.jpg")

    assert first.status_code == second.status_code == 200
    assert len(cached) == 1
    assert [p.stat().st_mtime_ns for p in thumb_cache_dir.iterdir()] == mtimes


@pytest.mark.asyncio
async def test_원본이_바뀌면_새_썸네일을_만든다(isolate_upload_dir: Path):
    source = isolate_upload_dir / "a.jpg"
    _write_jpeg(source, size=(1600, 1200))
    await _get(f"{THUMB_PREFIX}/480/a.jpg")

    _write_jpeg(source, size=(1200, 1600))
    response = await _get(f"{THUMB_PREFIX}/480/a.jpg")

    assert Image.open(BytesIO(response.content)).size == (480, 640)


@pytest.mark.asyncio
@pytest.mark.parametrize("width", [100, 481, 4000])
async def test_허용목록에_없는_폭은_404(isolate_upload_dir: Path, width: int):
    # 임의 폭을 받으면 폭마다 캐시 파일이 생겨 디스크·CPU 를 소모시킬 수 있다.
    _write_jpeg(isolate_upload_dir / "a.jpg")

    response = await _get(f"{THUMB_PREFIX}/{width}/a.jpg")

    assert response.status_code == 404


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "path",
    [
        "..%2F..%2Fapp%2Fcore%2Fconfig.py",
        "..%2Fsecret.jpg",
        "%2Fetc%2Fpasswd",
        "a%00b.jpg",
    ],
)
async def test_uploads_밖의_경로는_404(isolate_upload_dir: Path, path: str):
    (isolate_upload_dir.parent / "secret.jpg").write_bytes(b"x")

    response = await _get(f"{THUMB_PREFIX}/480/{path}")

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_없는_파일은_404(isolate_upload_dir: Path):
    response = await _get(f"{THUMB_PREFIX}/480/nope.jpg")

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_허용되지_않은_확장자는_404(isolate_upload_dir: Path):
    (isolate_upload_dir / "page.html").write_text("<script>alert(1)</script>")

    response = await _get(f"{THUMB_PREFIX}/480/page.html")

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_디코딩할_수_없는_이미지는_원본으로_돌려보낸다(isolate_upload_dir: Path):
    # 저장소 uploads/브로슈어/*.jpg 처럼 확장자만 jpg 인 PDF 가 실제로 있다.
    # 썸네일을 못 만들면 원본 URL 로 보내 지금과 같은 동작을 유지한다.
    (isolate_upload_dir / "브로슈어").mkdir()
    (isolate_upload_dir / "브로슈어" / "fake.jpg").write_bytes(b"%PDF-1.5 not an image")

    response = await _get(f"{THUMB_PREFIX}/480/브로슈어/fake.jpg")

    assert response.status_code == 307
    assert response.headers["location"] == f"/uploads/{quote('브로슈어')}/fake.jpg"


@pytest.mark.asyncio
async def test_uploads_정적_응답에_캐시_헤더가_붙는다():
    # StaticFiles 는 import 시점의 실제 backend/uploads/ 를 본다(conftest 주석 참고).
    repo_uploads = Path(__file__).resolve().parents[1] / "uploads"
    sample = next(repo_uploads.rglob("*.jpg"), None)
    if sample is None:
        pytest.skip("저장소 uploads 에 jpg 가 없다")
    rel = sample.relative_to(repo_uploads).as_posix()

    response = await _get(f"/uploads/{rel}")

    assert response.status_code == 200
    assert "max-age" in response.headers["cache-control"]


@pytest.mark.asyncio
async def test_픽셀_수가_과도한_이미지는_디코딩하지_않고_원본으로_보낸다(
    isolate_upload_dir: Path, thumb_cache_dir: Path
):
    # 1비트 PNG 는 수십 KB 로 수천만 픽셀을 담아 업로드 용량 검사를 통과한다.
    # 디코딩하면 RGB 변환·리사이즈 사본만으로 512MB 컨테이너가 OOM 으로 죽는다.
    Image.new("1", (6000, 6000)).save(isolate_upload_dir / "bomb.png")

    response = await _get(f"{THUMB_PREFIX}/480/bomb.png")

    assert response.status_code == 307
    assert list(thumb_cache_dir.glob("*.webp")) == []


@pytest.mark.asyncio
async def test_확장자와_다른_포맷은_디코딩하지_않는다(isolate_upload_dir: Path):
    # 허용 포맷(JPEG/PNG/WEBP) 밖의 Pillow 디코더에 닿지 않게 한다.
    Image.new("RGB", (100, 100)).save(isolate_upload_dir / "x.jpg", "GIF")

    response = await _get(f"{THUMB_PREFIX}/480/x.jpg")

    assert response.status_code == 307
