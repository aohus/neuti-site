from unittest.mock import patch

import pytest
from httpx import ASGITransport, AsyncClient

from app.core.config import settings
from app.main import app


@pytest.mark.asyncio
async def test_견적_요청을_접수하면_관리자에게_알림_메일을_보낸다():
    # Arrange
    data = {
        "org_type": "지자체",
        "org_name": "성남시청",
        "contact_name": "홍길동",
        "contact_phone": "010-1234-5678",
        "work_type": "방제",
        "work_location": "중원구",
    }

    # Act
    with patch(
        "app.api.api_v1.endpoints.estimate_request.send_estimate_notification"
    ) as mock_send:
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as ac:
            response = await ac.post("/api/v1/estimate/", data=data)

    # Assert
    assert response.status_code == 200
    mock_send.assert_called_once()
    email_to, email_data = mock_send.call_args.args
    assert email_to == settings.MAIL_USERNAME
    assert email_data["org_name"] == "성남시청"
