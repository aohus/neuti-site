"""GET /performance/feed 와 updated_at 동작 테스트."""

import json
import uuid
from datetime import UTC, datetime

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app
from app.repositories.performance_repo import performance_repo

MARKER = f"피드테스트-{uuid.uuid4().hex[:8]}"
FEED_KEYS = {
    "id", "title", "subtitle", "thumbnail_url", "job_main_category",
    "summary", "created_at", "updated_at",
}


def _row(name: str, date: datetime | None, **extra) -> dict:
    content = json.dumps(
        [{"type": "text", "value": f"## 개요\n\n| a | b |\n|---|---|\n본문 {name}"}],
        ensure_ascii=False,
    )
    return {
        "title": f"{MARKER} {name}",
        "content": content,
        "construction_date": date,
        **extra,
    }


@pytest.fixture
async def rows(db_session):
    created = []
    for name, date in [
        ("옛날", datetime(2022, 3, 1, tzinfo=UTC)),
        ("최근", datetime(2026, 5, 1, tzinfo=UTC)),
        ("중간", datetime(2024, 7, 1, tzinfo=UTC)),
    ]:
        created.append(
            await performance_repo.create_from_markdown(
                db_session,
                data=_row(name, date, subtitle=f"부제 {name}", job_main_category="전정"),
            )
        )
    yield created
    for row in created:
        await performance_repo.remove(db_session, id=row.id)


async def _get(path: str):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        return await ac.get(path)


@pytest.mark.asyncio
async def test_feed는_지정된_필드만_담고_content는_없다(rows):
    res = await _get("/api/v1/performance/feed?limit=1000")
    assert res.status_code == 200
    mine = [r for r in res.json() if r["title"].startswith(MARKER)]
    assert len(mine) == 3
    for item in mine:
        assert set(item) == FEED_KEYS
        assert "content" not in item
        assert item["summary"].startswith("본문")  # 소제목·표 머리행은 요약에서 빠진다
        assert "|" not in item["summary"]
        assert item["updated_at"]


@pytest.mark.asyncio
async def test_feed는_목록과_같은_시공일_최신순이다(rows):
    res = await _get("/api/v1/performance/feed?limit=1000")
    titles = [r["title"].split()[-1] for r in res.json() if r["title"].startswith(MARKER)]
    assert titles == ["최근", "중간", "옛날"]


@pytest.mark.asyncio
async def test_feed_limit이_적용된다(rows):
    res = await _get("/api/v1/performance/feed?limit=2")
    assert res.status_code == 200
    assert len(res.json()) == 2


@pytest.mark.asyncio
async def test_feed_limit_상한_1000을_넘으면_422():
    assert (await _get("/api/v1/performance/feed?limit=1001")).status_code == 422
    assert (await _get("/api/v1/performance/feed?limit=0")).status_code == 422


@pytest.mark.asyncio
async def test_feed는_id로_해석되지_않는다():
    res = await _get("/api/v1/performance/feed")
    assert res.status_code == 200
    assert isinstance(res.json(), list)


@pytest.mark.asyncio
async def test_상세_응답에_updated_at이_있다(rows):
    res = await _get(f"/api/v1/performance/{rows[0].id}")
    assert res.status_code == 200
    assert res.json()["updated_at"]


@pytest.mark.asyncio
async def test_ORM_수정은_updated_at을_갱신한다(db_session, rows):
    row = rows[0]
    before = row.updated_at
    updated = await performance_repo.update(db_session, db_obj=row, obj_in={"title": f"{MARKER} 수정"})
    assert updated.updated_at > before
