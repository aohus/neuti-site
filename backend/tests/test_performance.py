import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.config import settings
import io
import json

@pytest.mark.asyncio
async def test_performance_flow():
    # 1. Login as admin
    login_data = {
        "username": settings.ADMIN_USERNAME,
        "password": settings.ADMIN_PASSWORD,
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        login_res = await ac.post("/api/v1/login/access-token", data=login_data)
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 2. Upload image
        file_content = b"fake image content"
        files = {"image": ("test.jpg", io.BytesIO(file_content), "image/jpeg")}
        upload_res = await ac.post("/api/v1/performance/upload-image", files=files, headers=headers)
        assert upload_res.status_code == 200
        image_url = upload_res.json()
        assert image_url.startswith("/uploads/")

        # 3. Create performance record with metadata
        perf_data = {
            "title": "Test Performance",
            "content": "<p>Test Content</p>",
            "thumbnail_url": image_url,
            "client": "Test Client",
            "category": "나무병원",
            "year": 2024,
            "job_main_category": "고사목제거",
            "job_sub_category": "고사목",
            "site_type": "공공기관",
            "site_location": "성남시청",
            "construction_date": "2026-01-31T00:00:00"
        }
        create_res = await ac.post("/api/v1/performance/", json=perf_data, headers=headers)
        assert create_res.status_code == 200
        data = create_res.json()
        assert data["title"] == "Test Performance"
        assert data["year"] == 2024
        assert data["job_main_category"] == "고사목제거"
        perf_id = data["id"]

        # 4. List performance records
        list_res = await ac.get("/api/v1/performance/")
        assert list_res.status_code == 200
        assert len(list_res.json()) >= 1

        # 5. Get detail
        detail_res = await ac.get(f"/api/v1/performance/{perf_id}")
        assert detail_res.status_code == 200
        assert detail_res.json()["title"] == "Test Performance"
        assert detail_res.json()["site_location"] == "성남시청"

        # 6. Update metadata
        update_data = {"year": 2025, "site_location": "수정구청"}
        update_res = await ac.patch(f"/api/v1/performance/{perf_id}", json=update_data, headers=headers)
        assert update_res.status_code == 200
        assert update_res.json()["year"] == 2025
        assert update_res.json()["site_location"] == "수정구청"

        # 7. Delete
        delete_res = await ac.delete(f"/api/v1/performance/{perf_id}", headers=headers)
        assert delete_res.status_code == 200

        # 8. Verify deletion
        verify_res = await ac.get(f"/api/v1/performance/{perf_id}")
        assert verify_res.status_code == 404

@pytest.mark.asyncio
async def test_markdown_upload_flow():
    # 1. Login as admin
    login_data = {
        "username": settings.ADMIN_USERNAME,
        "password": settings.ADMIN_PASSWORD,
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        login_res = await ac.post("/api/v1/login/access-token", data=login_data)
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 2. Upload MD file
        md_content = """---
title: MD Upload Test
year: 2026
job_main_category: 진단
site_type: 공원
client: Green Park
---
This is a test content.
![img](/uploads/test.jpg)
"""
        files = {"file": ("test.md", io.BytesIO(md_content.encode('utf-8')), "text/markdown")}
        upload_res = await ac.post("/api/v1/performance/upload-md", files=files, headers=headers)
        assert upload_res.status_code == 200
        data = upload_res.json()
        assert data["title"] == "MD Upload Test"
        assert data["year"] == 2026
        assert data["job_main_category"] == "진단"
        assert data["site_type"] == "공원"
        
        # Verify content conversion
        content_json = data["content"]
        blocks = json.loads(content_json)
        assert any(b["type"] == "text" and "This is a test content." in b["value"] for b in blocks)
        assert any(b["type"] == "image" and "/uploads/test.jpg" in b["value"] for b in blocks)

        # Cleanup
        await ac.delete(f"/api/v1/performance/{data['id']}", headers=headers)

@pytest.mark.asyncio
async def test_update_performance_put():
    # 1. Login as admin
    login_data = {
        "username": settings.ADMIN_USERNAME,
        "password": settings.ADMIN_PASSWORD,
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        login_res = await ac.post("/api/v1/login/access-token", data=login_data)
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 2. Create initial performance
        perf_data = {
            "title": "Initial Title",
            "content": "Initial Content",
            "category": "조경식재"
        }
        create_res = await ac.post("/api/v1/performance/", json=perf_data, headers=headers)
        perf_id = create_res.json()["id"]

        # 3. Update using PUT
        update_data = {
            "title": "Updated Title",
            "content": "Updated Content",
            "category": "수목치료",
            "year": 2026,
            "client": "New Client"
        }
        update_res = await ac.put(f"/api/v1/performance/{perf_id}", json=update_data, headers=headers)
        
        # Currently, PUT is not implemented, so this should fail (e.g., 405 Method Not Allowed)
        assert update_res.status_code == 200
        data = update_res.json()
        assert data["title"] == "Updated Title"
        assert data["content"] == "Updated Content"
        assert data["category"] == "수목치료"
        assert data["year"] == 2026
        assert data["client"] == "New Client"

        # Cleanup
        await ac.delete(f"/api/v1/performance/{perf_id}", headers=headers)

@pytest.mark.asyncio
async def test_update_performance_unauthorized():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Update attempt without token
        update_res = await ac.put("/api/v1/performance/1", json={"title": "Hack"})
        assert update_res.status_code == 401

@pytest.mark.asyncio
async def test_general_upload_image():
    # 1. Login as admin
    login_data = {
        "username": settings.ADMIN_USERNAME,
        "password": settings.ADMIN_PASSWORD,
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        login_res = await ac.post("/api/v1/login/access-token", data=login_data)
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 2. Upload image to general endpoint
        file_content = b"fake image content"
        files = {"image": ("test.jpg", io.BytesIO(file_content), "image/jpeg")}
        # This path /api/v1/upload/image is mentioned in the plan
        upload_res = await ac.post("/api/v1/upload/image", files=files, headers=headers)
        assert upload_res.status_code == 200
        image_url = upload_res.json()
        assert image_url.startswith("/uploads/")
