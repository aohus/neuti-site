import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from unittest.mock import patch

@pytest.mark.asyncio
async def test_create_diagnosis_request():
    data = {
        "name": "홍길동",
        "contact": "010-1234-5678",
        "email": "test@example.com",
        "address": "서울시 강남구",
        "symptom": "잎이 노랗게 변해요"
    }
    
    with patch("app.api.api_v1.endpoints.diagnosis.send_diagnosis_notification") as mock_send:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.post("/api/v1/diagnosis/", data=data)
            
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["name"] == data["name"]
    assert res_data["contact"] == data["contact"]
    assert "id" in res_data
    mock_send.assert_called_once()

@pytest.mark.asyncio
async def test_create_diagnosis_request_with_file():
    data = {
        "name": "홍길동",
        "contact": "010-1234-5678",
        "address": "서울시 강남구",
        "symptom": "잎이 노랗게 변해요"
    }
    files = {"image": ("test.jpg", b"fake-image-content", "image/jpeg")}
    
    with patch("app.api.api_v1.endpoints.diagnosis.send_diagnosis_notification") as mock_send:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.post("/api/v1/diagnosis/", data=data, files=files)
            
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["image_path"] is not None
    assert "uploads" in res_data["image_path"]
    mock_send.assert_called_once()
