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
