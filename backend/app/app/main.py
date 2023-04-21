from app.api.http.router import http_router
from fastapi import FastAPI

app = FastAPI(title="Invest")

app.include_router(http_router, prefix="/api")
