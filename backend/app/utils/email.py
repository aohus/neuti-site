from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from app.core.config import settings
from pydantic import EmailStr

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
    VALIDATE_CERTS=settings.VALIDATE_CERTS
)

async def send_diagnosis_notification(email_to: str, data: dict):
    message = MessageSchema(
        subject=f"{settings.PROJECT_NAME} - 새로운 수목진단의뢰 접수",
        recipients=[email_to],
        template_body=data,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    # Note: templates are not setup yet, using simple body for now
    message.template_body = None
    message.body = f"""
    <h3>새로운 수목진단의뢰가 접수되었습니다.</h3>
    <ul>
        <li>의뢰자: {data.get('name')}</li>
        <li>연락처: {data.get('contact')}</li>
        <li>이메일: {data.get('email')}</li>
        <li>주소: {data.get('address')}</li>
        <li>증상: {data.get('symptom')}</li>
    </ul>
    """
    await fm.send_message(message)


async def send_estimate_notification(email_to: str, data: dict):
    message = MessageSchema(
        subject=f"{settings.PROJECT_NAME} - 새로운 견적 요청 접수",
        recipients=[email_to],
        template_body=None,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    message.body = f"""
    <h3>새로운 수의계약 견적 요청이 접수되었습니다.</h3>
    <table style="border-collapse:collapse; margin-top:16px;">
        <tr><td style="padding:6px 12px; font-weight:bold; color:#666;">기관유형</td><td style="padding:6px 12px;">{data.get('org_type', '')}</td></tr>
        <tr><td style="padding:6px 12px; font-weight:bold; color:#666;">기관명</td><td style="padding:6px 12px;">{data.get('org_name', '')}</td></tr>
        <tr><td style="padding:6px 12px; font-weight:bold; color:#666;">담당자</td><td style="padding:6px 12px;">{data.get('contact_name', '')}</td></tr>
        <tr><td style="padding:6px 12px; font-weight:bold; color:#666;">연락처</td><td style="padding:6px 12px;">{data.get('contact_phone', '')}</td></tr>
        <tr><td style="padding:6px 12px; font-weight:bold; color:#666;">이메일</td><td style="padding:6px 12px;">{data.get('contact_email', '-')}</td></tr>
        <tr><td style="padding:6px 12px; font-weight:bold; color:#666;">작업유형</td><td style="padding:6px 12px;">{data.get('work_type', '')}</td></tr>
        <tr><td style="padding:6px 12px; font-weight:bold; color:#666;">작업위치</td><td style="padding:6px 12px;">{data.get('work_location', '')}</td></tr>
        <tr><td style="padding:6px 12px; font-weight:bold; color:#666;">희망시기</td><td style="padding:6px 12px;">{data.get('desired_date', '-')}</td></tr>
        <tr><td style="padding:6px 12px; font-weight:bold; color:#666;">예산규모</td><td style="padding:6px 12px;">{data.get('budget_range', '-')}</td></tr>
    </table>
    {"<div style='margin-top:16px; padding:12px; background:#f5f5f5; border-radius:8px;'><strong>상세 요청사항:</strong><br/>" + data.get('details', '') + "</div>" if data.get('details') else ""}
    """
    await fm.send_message(message)
