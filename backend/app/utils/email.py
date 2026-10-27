import logging
from html import escape

from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType

from app.core.config import settings

logger = logging.getLogger(__name__)

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=settings.USE_CREDENTIALS,
    VALIDATE_CERTS=settings.VALIDATE_CERTS,
)

ESTIMATE_FIELDS = [
    ("기관유형", "org_type"),
    ("기관명", "org_name"),
    ("담당자", "contact_name"),
    ("연락처", "contact_phone"),
    ("이메일", "contact_email"),
    ("작업유형", "work_type"),
    ("작업위치", "work_location"),
    ("희망시기", "desired_date"),
    ("예산규모", "budget_range"),
]

SUBJECT_PREFIX = "[느티나무병원 홈페이지]"


def _field(data: dict, key: str) -> str:
    # 공개 폼 입력이 그대로 들어오므로 HTML로 해석되지 않게 이스케이프한다.
    # model_dump()는 미입력 선택항목을 None으로 주므로 '-'로 바꾼다.
    value = data.get(key)
    return escape(str(value)) if value else "-"


async def _send(subject: str, email_to: str, body: str) -> None:
    # 백그라운드 작업에서 호출되므로 실패해도 접수 응답에는 영향이 없다.
    # 대신 반드시 로그를 남겨 SMTP 장애를 알아챌 수 있게 한다.
    try:
        # 수신 주소 검증(EmailStr)도 여기서 일어나므로 try 안에서 만든다.
        message = MessageSchema(
            subject=subject,
            recipients=[email_to],
            body=body,
            subtype=MessageType.html,
        )
        await FastMail(conf).send_message(message)
    except Exception:
        logger.exception("알림 메일 발송 실패: %s", subject)


async def send_diagnosis_notification(email_to: str, data: dict) -> None:
    body = f"""
    <h3>새로운 수목진단의뢰가 접수되었습니다.</h3>
    <ul>
        <li>의뢰자: {_field(data, "name")}</li>
        <li>연락처: {_field(data, "contact")}</li>
        <li>이메일: {_field(data, "email")}</li>
        <li>주소: {_field(data, "address")}</li>
        <li>증상: {_field(data, "symptom")}</li>
    </ul>
    """
    await _send(f"{SUBJECT_PREFIX} 진단 의뢰", email_to, body)


async def send_estimate_notification(email_to: str, data: dict) -> None:
    rows = "".join(
        f'<tr><td style="padding:6px 12px; font-weight:bold; color:#666;">{label}</td>'
        f'<td style="padding:6px 12px;">{_field(data, key)}</td></tr>'
        for label, key in ESTIMATE_FIELDS
    )
    details = (
        "<div style='margin-top:16px; padding:12px; background:#f5f5f5; border-radius:8px;'>"
        f"<strong>상세 요청사항:</strong><br/>{_field(data, 'details')}</div>"
        if data.get("details")
        else ""
    )
    admin_url = escape(f"{settings.SITE_URL}/admin/estimates")
    body = f"""
    <h3>새로운 수의계약 견적 요청이 접수되었습니다.</h3>
    <table style="border-collapse:collapse; margin-top:16px;">{rows}</table>
    {details}
    <p style="margin-top:24px;">
        <a href="{admin_url}">관리자 페이지에서 견적 요청 확인하기</a>
    </p>
    """
    await _send(f"{SUBJECT_PREFIX} 새로운 견적접수", email_to, body)
