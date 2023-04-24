from fastapi import APIRouter
from src.user.router import router as user_router
from starlette.responses import JSONResponse

api_router = APIRouter(default_response_class=JSONResponse)

api_router.include_router(user_router)
