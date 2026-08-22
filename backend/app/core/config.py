from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# backend/ — 이 파일은 backend/app/core/config.py 다.
# 운영 컨테이너에서도 `COPY app ./app` + `WORKDIR /app` 이라 /app 으로 맞는다.
BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    PROJECT_NAME: str = "Neuti Tree Hospital"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"

    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "app"
    DATABASE_URL: str | None = None

    @property
    def async_database_url(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # Email
    MAIL_USERNAME: str = "coopneuti@naver.com"
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str = "coopneuti@naver.com"
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_FROM_NAME: str = "느티나무홈페이지"
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    USE_CREDENTIALS: bool = True
    VALIDATE_CERTS: bool = True

    # Storage
    UPLOAD_DIR: Path = BASE_DIR / "uploads"
    PERFORMANCE_DATA_DIR: Path = BASE_DIR / "data" / "performances"

    @field_validator("UPLOAD_DIR", "PERFORMANCE_DATA_DIR")
    @classmethod
    def _resolve_against_base_dir(cls, value: Path) -> Path:
        """상대경로로 들어온 값을 backend/ 기준 절대경로로 바꾼다.

        .env 와 compose 가 `UPLOAD_DIR=uploads` 처럼 상대경로를 넘기는데,
        이걸 CWD 기준으로 두면 backend/ 밖에서 실행할 때 app.main import 가
        StaticFiles 의 디렉터리 검사에서 죽고, 업로드도 엉뚱한 곳에 쌓인다.
        """
        return value if value.is_absolute() else BASE_DIR / value

    # Runtime
    SQL_ECHO: bool = False
    CORS_ORIGINS: list[str] = ["*"]

    # Authentication
    SECRET_KEY: str = "your-super-secret-key-for-development" # In production, use a strong key
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days

    # Admin Credentials
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "admin1234" # Default password for development

    model_config = SettingsConfigDict(case_sensitive=True, extra="ignore")

settings = Settings()
