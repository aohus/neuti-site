import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.config import settings
import io

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

        # 3. Create performance record
        perf_data = {
            "title": "Test Performance",
            "content": "<p>Test Content</p>",
            "thumbnail_url": image_url,
            "client": "Test Client",
            "construction_date": "2026-01-31T00:00:00"
        }
        create_res = await ac.post("/api/v1/performance/", json=perf_data, headers=headers)
        assert create_res.status_code == 200
        perf_id = create_res.json()["id"]

        # 4. List performance records
        list_res = await ac.get("/api/v1/performance/")
        assert list_res.status_code == 200
        assert len(list_res.json()) >= 1

        # 5. Get detail
        detail_res = await ac.get(f"/api/v1/performance/{perf_id}")
        assert detail_res.status_code == 200
        assert detail_res.json()["title"] == "Test Performance"

        # 6. Update
        update_data = {"title": "Updated Title"}
        update_res = await ac.patch(f"/api/v1/performance/{perf_id}", json=update_data, headers=headers)
        assert update_res.status_code == 200
        assert update_res.json()["title"] == "Updated Title"

        # 7. Delete
        delete_res = await ac.delete(f"/api/v1/performance/{perf_id}", headers=headers)
        assert delete_res.status_code == 200

        # 8. Verify deletion
        verify_res = await ac.get(f"/api/v1/performance/{perf_id}")
        assert verify_res.status_code == 404
