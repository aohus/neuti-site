import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.config import settings

@pytest.mark.asyncio
async def test_create_notice_as_admin():
    # 1. Login to get token
    login_data = {
        "username": settings.ADMIN_USERNAME,
        "password": settings.ADMIN_PASSWORD,
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        login_res = await ac.post("/api/v1/login/access-token", data=login_data)
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # 2. Create notice
        notice_data = {"title": "Test Notice", "content": "Notice Content"}
        response = await ac.post("/api/v1/notice/", json=notice_data, headers=headers)
        
    assert response.status_code == 200
    assert response.json()["title"] == notice_data["title"]

@pytest.mark.asyncio
async def test_create_notice_unauthorized():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        notice_data = {"title": "Test Notice", "content": "Notice Content"}
        response = await ac.post("/api/v1/notice/", json=notice_data)
    
    assert response.status_code == 401 # Should fail because token is missing

@pytest.mark.asyncio
async def test_create_inquiry_public():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        inquiry_data = {
            "title": "Question", 
            "content": "I have a question", 
            "author": "User1",
            "is_secret": False
        }
        response = await ac.post("/api/v1/inquiry/", json=inquiry_data)
    
    assert response.status_code == 200
    assert response.json()["title"] == inquiry_data["title"]

@pytest.mark.asyncio
async def test_read_secret_inquiry_with_password():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. Create secret inquiry
        inquiry_data = {
            "title": "Secret", 
            "content": "Secret Content", 
            "author": "User1",
            "is_secret": True,
            "password": "mypassword"
        }
        create_res = await ac.post("/api/v1/inquiry/", json=inquiry_data)
        inquiry_id = create_res.json()["id"]
        
        # 2. Try to read without password
        read_res_fail = await ac.get(f"/api/v1/inquiry/{inquiry_id}")
        assert read_res_fail.status_code == 401
        
        # 3. Read with correct password
        read_res_ok = await ac.get(f"/api/v1/inquiry/{inquiry_id}?password=mypassword")
        assert read_res_ok.status_code == 200
        assert read_res_ok.json()["content"] == inquiry_data["content"]
