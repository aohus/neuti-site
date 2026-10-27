import logging
from unittest.mock import AsyncMock, patch

import pytest

from app.utils.email import send_diagnosis_notification, send_estimate_notification

ESTIMATE_DATA = {
    "org_type": "지자체",
    "org_name": "성남시청",
    "contact_name": "홍길동",
    "contact_phone": "010-1234-5678",
    "contact_email": None,
    "work_type": "방제",
    "work_location": "중원구",
    "desired_date": None,
    "budget_range": None,
    "details": None,
}


@pytest.fixture
def send_message():
    with patch("app.utils.email.FastMail") as fastmail:
        fastmail.return_value.send_message = AsyncMock()
        yield fastmail.return_value.send_message


def _sent_body(send_message: AsyncMock) -> str:
    send_message.assert_awaited_once()
    return send_message.await_args.args[0].body


@pytest.mark.asyncio
async def test_견적_메일_본문은_사용자_입력의_html을_이스케이프한다(send_message):
    # Arrange
    data = {
        **ESTIMATE_DATA,
        "org_name": "<a href='http://evil'>클릭</a>",
        "details": "<script>x</script>",
    }

    # Act
    await send_estimate_notification("admin@example.com", data)

    # Assert
    body = _sent_body(send_message)
    assert "<a href='http://evil'>" not in body
    assert "<script>" not in body
    assert "&lt;script&gt;" in body


@pytest.mark.asyncio
async def test_견적_메일_본문은_비어있는_선택항목을_none_대신_대시로_쓴다(send_message):
    # Arrange — model_dump() 는 미입력 선택항목을 키는 남기고 값만 None 으로 준다

    # Act
    await send_estimate_notification("admin@example.com", ESTIMATE_DATA)

    # Assert
    body = _sent_body(send_message)
    assert "None" not in body
    assert "상세 요청사항" not in body


@pytest.mark.asyncio
async def test_진단_메일_본문은_사용자_입력의_html을_이스케이프한다(send_message):
    # Arrange
    data = {
        "name": "<b>홍길동</b>",
        "contact": "010",
        "address": "서울",
        "symptom": "<img src=x>",
    }

    # Act
    await send_diagnosis_notification("admin@example.com", data)

    # Assert
    body = _sent_body(send_message)
    assert "<b>홍길동</b>" not in body
    assert "<img src=x>" not in body
    assert "&lt;b&gt;홍길동&lt;/b&gt;" in body


@pytest.mark.asyncio
async def test_메일_발송이_실패하면_예외를_올리지_않고_로그를_남긴다(
    send_message, caplog
):
    # Arrange
    send_message.side_effect = ConnectionError("smtp down")

    # Act
    with caplog.at_level(logging.ERROR, logger="app.utils.email"):
        await send_estimate_notification("admin@example.com", ESTIMATE_DATA)

    # Assert
    assert "알림 메일 발송 실패" in caplog.text
    assert "smtp down" in caplog.text


@pytest.mark.asyncio
async def test_수신_주소가_잘못돼도_예외를_올리지_않고_로그를_남긴다(
    send_message, caplog
):
    # Arrange — MAIL_USERNAME 에 '@naver.com' 없이 아이디만 넣은 경우
    bad_recipient = "coopneuti"

    # Act
    with caplog.at_level(logging.ERROR, logger="app.utils.email"):
        await send_estimate_notification(bad_recipient, ESTIMATE_DATA)

    # Assert
    send_message.assert_not_awaited()
    assert "알림 메일 발송 실패" in caplog.text
