"""테스트가 저장소의 `backend/uploads/` 를 오염시키지 않는지 지키는 회귀 테스트.

업로드 엔드포인트는 요청 시점에 `settings.UPLOAD_DIR` 을 읽는다. 이 값이 기본값
`Path("uploads")` 그대로면 pytest 를 `backend/` 에서 돌릴 때마다 운영과 똑같은
`backend/uploads/` 에 `uuid.jpg` 가 실제로 쌓인다. 실제로 2026-02 ~ 08 사이
22개의 더미 이미지(18바이트 `fake image content`, 44바이트 `JPEG_BYTES`)가
누적됐고 일부는 커밋까지 됐다.

`uploads` 최상위는 관리자 업로드본이 커밋되는 자리라 `.gitignore` 로 덮을 수
없다(배포 rsync 가 이 파일들을 지우지 않는다). 그래서 테스트 쪽에서 실제
디렉터리를 아예 안 쓰게 막는 것이 유일한 근본 대책이다.
"""

from pathlib import Path
from unittest.mock import patch

import pytest
from httpx import ASGITransport, AsyncClient

from app.core.config import settings
from app.main import app
from tests.conftest import JPEG_BYTES

REPO_UPLOAD_DIR = Path(__file__).resolve().parents[1] / "uploads"


def _snapshot() -> set[Path]:
    """저장소 uploads 최상위의 현재 파일 목록."""
    if not REPO_UPLOAD_DIR.exists():
        return set()
    return set(REPO_UPLOAD_DIR.iterdir())


def test_테스트_중_UPLOAD_DIR_은_저장소_uploads_를_가리키지_않는다():
    assert settings.UPLOAD_DIR.resolve() != REPO_UPLOAD_DIR


@pytest.mark.asyncio
async def test_진단_의뢰_업로드는_저장소_uploads_에_파일을_남기지_않는다():
    # Arrange
    before = _snapshot()
    data = {
        "name": "홍길동",
        "contact": "010-1234-5678",
        "address": "서울시 강남구",
        "symptom": "잎이 노랗게 변해요",
    }
    files = {"image": ("test.jpg", JPEG_BYTES, "image/jpeg")}

    # Act
    with patch("app.services.diagnosis_service.send_diagnosis_notification"):
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as ac:
            response = await ac.post("/api/v1/diagnosis/", data=data, files=files)

    # Assert
    assert response.status_code == 200
    assert response.json()["image_path"] is not None
    assert _snapshot() == before
