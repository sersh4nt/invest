from fastapi import APIRouter

from .v1.router import router

http_router = APIRouter()
http_router.include_router(router, prefix="/v1")
