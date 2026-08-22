"""경로 설정이 실행 위치(CWD)에 흔들리지 않는지 지키는 회귀 테스트.

`UPLOAD_DIR`·`PERFORMANCE_DATA_DIR` 을 CWD 상대경로로 두면 두 가지가 깨진다.

1. `backend/` 밖에서 실행하면 `app.main` import 자체가 죽는다.
   `StaticFiles(directory=settings.UPLOAD_DIR)` 가 import 시점에 디렉터리
   존재를 확인하기 때문이다.
2. 실행 위치에 따라 업로드가 엉뚱한 곳에 쌓인다. 테스트가 실제
   `backend/uploads/` 를 오염시킨 사건이 이 문제의 한 갈래였다.

`.env` 가 `UPLOAD_DIR=uploads` 로 상대경로를 넘기고 있으므로, 기본값만
절대경로로 바꿔서는 부족하다. 어떤 경로로 들어오든 `backend/` 기준으로
절대경로화되어야 한다.
"""

import os
import subprocess
import sys
from pathlib import Path

from app.core.config import Settings

BACKEND_DIR = Path(__file__).resolve().parents[1]
REPO_ROOT = BACKEND_DIR.parent


def test_상대경로로_주어진_설정값은_backend_기준_절대경로가_된다():
    settings = Settings(
        UPLOAD_DIR=Path("uploads"),
        PERFORMANCE_DATA_DIR=Path("data/performances"),
    )

    assert settings.UPLOAD_DIR == BACKEND_DIR / "uploads"
    assert settings.PERFORMANCE_DATA_DIR == BACKEND_DIR / "data" / "performances"


def test_절대경로로_주어진_설정값은_그대로_유지된다(tmp_path):
    settings = Settings(UPLOAD_DIR=tmp_path)

    assert settings.UPLOAD_DIR == tmp_path


def test_기본값은_절대경로다():
    settings = Settings()

    assert settings.UPLOAD_DIR.is_absolute()
    assert settings.PERFORMANCE_DATA_DIR.is_absolute()


def test_저장소_루트에서_실행해도_앱을_import_할_수_있다():
    # Arrange — 운영 컨테이너(WORKDIR /app)가 아닌 위치에서 도구를 돌리는 상황
    env = {**os.environ, "PYTHONPATH": str(BACKEND_DIR), "UPLOAD_DIR": "uploads"}

    # Act
    result = subprocess.run(
        [sys.executable, "-c", "import app.main"],
        cwd=REPO_ROOT,
        env=env,
        capture_output=True,
        text=True,
    )

    # Assert
    assert result.returncode == 0, result.stderr
