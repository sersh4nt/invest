from fastapi import APIRouter
from starlette.responses import JSONResponse

from src.account.router import router as account_router
from src.operation.router import router as operations_router
from src.portfolio.router import router as portfolio_router
from src.user.router import router as user_router
from src.arbitrage.router import router as arbitrage_router

api_router = APIRouter(default_response_class=JSONResponse)

api_router.include_router(user_router)
api_router.include_router(account_router)
api_router.include_router(portfolio_router)
api_router.include_router(operations_router)
api_router.include_router(arbitrage_router)
