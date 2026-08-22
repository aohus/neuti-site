import asyncio
import pytest
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from app.db.session import get_db
from app.main import app
from app.core.config import settings
from app.db.base import Base

TEST_DATABASE_URL = settings.async_database_url

# 업로드 엔드포인트는 매직바이트로 이미지 여부를 검증한다(app/utils/upload.py).
# 임의의 바이트열을 쓰면 400 으로 거부되므로 실제 JPEG 시그니처를 쓴다.
JPEG_BYTES = b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01" + b"\x00" * 32

@pytest.fixture(scope="session")
def event_loop_policy():
    return asyncio.get_event_loop_policy()

@pytest.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    engine = create_async_engine(TEST_DATABASE_URL)
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session
    await engine.dispose()

@pytest.fixture(scope="function", autouse=True)
def isolate_upload_dir(tmp_path_factory, monkeypatch):
    """업로드 대상을 임시 디렉터리로 돌려 저장소의 backend/uploads/ 를 지킨다.

    settings.UPLOAD_DIR 기본값은 상대경로 Path("uploads") 라, backend/ 에서
    pytest 를 돌리면 업로드 엔드포인트가 운영과 똑같은 backend/uploads/ 에
    더미 이미지를 실제로 쓴다. 엔드포인트는 요청 시점에 이 값을 읽으므로
    속성만 갈아끼우면 전부(diagnosis·estimate·performance) 격리된다.

    tmp_path 대신 tmp_path_factory 를 쓰는 이유: tmp_path 하위에 만들면
    같은 tmp_path 로 "디렉터리가 비었는지" 검사하는 테스트가 깨진다.
    """
    upload_dir = tmp_path_factory.mktemp("uploads")
    monkeypatch.setattr(settings, "UPLOAD_DIR", upload_dir)
    return upload_dir


@pytest.fixture(scope="function", autouse=True)
async def override_get_db(db_session: AsyncSession):
    app.dependency_overrides[get_db] = lambda: db_session
    yield
    app.dependency_overrides.clear()
