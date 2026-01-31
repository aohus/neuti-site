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
async def override_get_db(db_session: AsyncSession):
    app.dependency_overrides[get_db] = lambda: db_session
    yield
    app.dependency_overrides.clear()
