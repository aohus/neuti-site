"""문의 작성 스팸 차단과 비밀글 비밀번호 대입 방어."""

import uuid

import pytest
from httpx import ASGITransport, AsyncClient

from app.api.api_v1.endpoints import inquiry as inquiry_endpoint
from app.core.config import settings
from app.main import app
from app.utils.antispam import MIN_FILL_MS

PASSWORD = "pw1234"


def _payload(**overrides) -> dict:
    return {
        "title": f"protect-{uuid.uuid4().hex[:8]}",
        "content": "본문",
        "author": "민원인",
        "is_secret": True,
        "password": PASSWORD,
        "website": "",
        "elapsed_ms": MIN_FILL_MS + 1000,
        **overrides,
    }


async def _admin_headers(ac: AsyncClient) -> dict[str, str]:
    res = await ac.post(
        "/api/v1/login/access-token",
        data={"username": settings.ADMIN_USERNAME, "password": settings.ADMIN_PASSWORD},
    )
    return {"Authorization": f"Bearer {res.json()['access_token']}"}


@pytest.fixture(autouse=True)
def _reset_limiter():
    inquiry_endpoint.access_limiter.clear()
    yield
    inquiry_endpoint.access_limiter.clear()


@pytest.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


@pytest.fixture
async def secret_inquiry(client: AsyncClient):
    res = await client.post("/api/v1/inquiry/", json=_payload())
    assert res.status_code == 200
    inquiry_id = res.json()["id"]
    yield inquiry_id
    await client.delete(f"/api/v1/inquiry/{inquiry_id}", headers=await _admin_headers(client))


# --- 스팸 차단 ---


@pytest.mark.asyncio
async def test_허니팟이_채워진_문의는_거부한다(client: AsyncClient):
    res = await client.post("/api/v1/inquiry/", json=_payload(website="http://spam.example"))
    assert res.status_code == 400


@pytest.mark.asyncio
async def test_너무_빨리_제출된_문의는_거부한다(client: AsyncClient):
    res = await client.post("/api/v1/inquiry/", json=_payload(elapsed_ms=MIN_FILL_MS - 1))
    assert res.status_code == 400


@pytest.mark.asyncio
async def test_정상_문의는_접수되고_스팸_판정_필드는_응답에_없다(client: AsyncClient, secret_inquiry: int):
    res = await client.post(f"/api/v1/inquiry/{secret_inquiry}/access", json={"password": PASSWORD})
    assert res.status_code == 200
    assert "website" not in res.json()
    assert "elapsed_ms" not in res.json()


# --- 비밀글 열람 ---


@pytest.mark.asyncio
async def test_비밀번호는_본문으로_받아_열람한다(client: AsyncClient, secret_inquiry: int):
    res = await client.post(f"/api/v1/inquiry/{secret_inquiry}/access", json={"password": PASSWORD})
    assert res.status_code == 200
    assert res.json()["content"] == "본문"


@pytest.mark.asyncio
async def test_쿼리스트링_비밀번호로는_더_이상_열리지_않는다(client: AsyncClient, secret_inquiry: int):
    # 쿼리스트링은 접근 로그·브라우저 기록에 남는다
    res = await client.get(f"/api/v1/inquiry/{secret_inquiry}", params={"password": PASSWORD})
    assert res.status_code == 401


@pytest.mark.asyncio
async def test_틀린_비밀번호는_401(client: AsyncClient, secret_inquiry: int):
    res = await client.post(f"/api/v1/inquiry/{secret_inquiry}/access", json={"password": "nope"})
    assert res.status_code == 401


@pytest.mark.asyncio
async def test_연속으로_틀리면_맞는_비밀번호도_잠시_막는다(client: AsyncClient, secret_inquiry: int):
    url = f"/api/v1/inquiry/{secret_inquiry}/access"
    for _ in range(inquiry_endpoint.MAX_PASSWORD_FAILURES):
        assert (await client.post(url, json={"password": "nope"})).status_code == 401

    res = await client.post(url, json={"password": PASSWORD})
    assert res.status_code == 429


@pytest.mark.asyncio
async def test_맞히면_실패_횟수를_초기화한다(client: AsyncClient, secret_inquiry: int):
    url = f"/api/v1/inquiry/{secret_inquiry}/access"
    for _ in range(inquiry_endpoint.MAX_PASSWORD_FAILURES - 1):
        await client.post(url, json={"password": "nope"})
    assert (await client.post(url, json={"password": PASSWORD})).status_code == 200

    for _ in range(inquiry_endpoint.MAX_PASSWORD_FAILURES - 1):
        assert (await client.post(url, json={"password": "nope"})).status_code == 401
    assert (await client.post(url, json={"password": PASSWORD})).status_code == 200


@pytest.mark.asyncio
async def test_공개글은_비밀번호_없이_열람한다(client: AsyncClient):
    created = await client.post("/api/v1/inquiry/", json=_payload(is_secret=False, password=None))
    inquiry_id = created.json()["id"]
    try:
        res = await client.get(f"/api/v1/inquiry/{inquiry_id}")
        assert res.status_code == 200
    finally:
        await client.delete(f"/api/v1/inquiry/{inquiry_id}", headers=await _admin_headers(client))
