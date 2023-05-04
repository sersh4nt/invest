from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api import api_router
from src.config import app_config
from src.db import base  # noqa: F401

app = FastAPI(**app_config)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/healthcheck", include_in_schema=False)
async def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(api_router, prefix="/api/v1")
