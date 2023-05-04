from typing import Any, Dict, Literal, Optional

from pydantic import BaseSettings, PostgresDsn, RedisDsn, validator

SHOW_DOCS_ENVS = ("local", "staging")


class Settings(BaseSettings):
    POSTGRES_SERVER: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str

    SECRET_KEY: str
    DB_URI_ASYNC: PostgresDsn | None = None
    DB_URI_SYNC: PostgresDsn | None = None

    @validator("DB_URI_ASYNC", pre=True)
    def assemble_db_uri_async(cls, v: Optional[str], values: Dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        return PostgresDsn.build(
            scheme="postgresql+asyncpg",
            user=values.get("POSTGRES_USER"),
            password=values.get("POSTGRES_PASSWORD"),
            host=values.get("POSTGRES_SERVER"),
            path=f"/{values.get('POSTGRES_DB') or ''}",
        )

    @validator("DB_URI_SYNC", pre=True)
    def assemble_db_uri_sync(cls, v: Optional[str], values: Dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        return PostgresDsn.build(
            scheme="postgresql+psycopg",
            user=values.get("POSTGRES_USER"),
            password=values.get("POSTGRES_PASSWORD"),
            host=values.get("POSTGRES_SERVER"),
            path=f"/{values.get('POSTGRES_DB') or ''}",
        )

    ADMIN_EMAIL: str
    ADMIN_PASSWORD: str
    ENVIRONMENT: str

    LOG_LEVEL: Literal["INFO", "WARN", "ERROR", "DEBUG"]

    REDIS_URI: RedisDsn

    TINKOFF_TOKEN: str

    JWT_SECRET: str
    JWT_LIFETIME: int


settings = Settings()

app_config: Dict[str, Any] = {"title": "Invest API"}

if settings.ENVIRONMENT not in SHOW_DOCS_ENVS:
    app_config.update({"openapi_url": None})
