"""Q&A 목록 API 가 비밀글 본문·답변을 익명 사용자에게 노출하지 않는지 검증한다."""

import uuid

import pytest
from httpx import ASGITransport, AsyncClient

from app.core.config import settings
from app.main import app

LIST_KEYS = {"id", "title", "author", "is_secret", "created_at", "has_answer"}


async def _admin_headers(ac: AsyncClient) -> dict[str, str]:
    res = await ac.post(
        "/api/v1/login/access-token",
        data={"username": settings.ADMIN_USERNAME, "password": settings.ADMIN_PASSWORD},
    )
    return {"Authorization": f"Bearer {res.json()['access_token']}"}


@pytest.mark.asyncio
async def test_목록은_비밀글_본문과_답변을_내려주지_않는다():
    marker = f"privacy-{uuid.uuid4().hex[:8]}"
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        headers = await _admin_headers(ac)
        created = await ac.post(
            "/api/v1/inquiry/",
            json={
                "title": marker,
                "content": "SECRET-BODY 연락처 010-0000-0000",
                "author": "민원인",
                "is_secret": True,
                "password": "pw1234",
            },
        )
        inquiry_id = created.json()["id"]
        await ac.post(
            f"/api/v1/inquiry/{inquiry_id}/answer",
            json={"inquiry_id": inquiry_id, "content": "SECRET-ANSWER"},
            headers=headers,
        )
        try:
            res = await ac.get("/api/v1/inquiry/", params={"limit": 100})
            assert res.status_code == 200
            assert "SECRET-BODY" not in res.text
            assert "SECRET-ANSWER" not in res.text

            mine = [i for i in res.json() if i["title"] == marker]
            assert len(mine) == 1
            assert set(mine[0]) == LIST_KEYS
            assert mine[0]["is_secret"] is True
            assert mine[0]["has_answer"] is True
        finally:
            await ac.delete(f"/api/v1/inquiry/{inquiry_id}", headers=headers)


@pytest.mark.asyncio
async def test_비밀글_상세는_여전히_비밀번호로_열람된다():
    marker = f"privacy-{uuid.uuid4().hex[:8]}"
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        headers = await _admin_headers(ac)
        created = await ac.post(
            "/api/v1/inquiry/",
            json={"title": marker, "content": "본문", "author": "a", "is_secret": True, "password": "pw1234"},
        )
        inquiry_id = created.json()["id"]
        try:
            res = await ac.get(f"/api/v1/inquiry/{inquiry_id}", params={"password": "pw1234"})
            assert res.status_code == 200
            assert res.json()["content"] == "본문"
        finally:
            await ac.delete(f"/api/v1/inquiry/{inquiry_id}", headers=headers)


@pytest.mark.asyncio
@pytest.mark.parametrize("limit", [0, 101, 100000])
async def test_목록_limit_은_1에서_100_사이만_허용한다(limit: int):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/v1/inquiry/", params={"limit": limit})
    assert res.status_code == 422
