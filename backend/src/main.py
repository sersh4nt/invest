from fastapi import FastAPI

from src.api import api_router
from src.config import app_config

app = FastAPI(**app_config)


@app.get("/healthcheck", include_in_schema=False)
async def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(api_router, prefix="/api/v1")
