from fastapi import FastAPI
from src.api import api_router

app = FastAPI(title="Invest")

app.include_router(api_router, prefix="/api/v1")
