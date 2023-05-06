from datetime import datetime
from typing import Annotated, Optional

import src.portfolio.service as portfolio_service
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from src.account.dependencies import get_user_subaccount
from src.account.models import Subaccount
from src.db.session import get_async_session
from src.portfolio.schemas import (
    PortfolioCostList,
    PortfolioCostStat,
    PortfolioScheme,
)

router = APIRouter(tags=["portfolio"])


@router.get(
    "/subaccounts/{subaccount_id}/portfolio", response_model=Optional[PortfolioScheme]
)
async def get_latest_portfolio(
    subaccount: Subaccount = Depends(get_user_subaccount),
    session: AsyncSession = Depends(get_async_session),
):
    portfolio = await portfolio_service.get_latest_portfolio(
        session, subaccount=subaccount
    )
    return portfolio


@router.get(
    "/subaccounts/{subaccount_id}/portfolio-cost",
    response_model=PortfolioCostList,
)
async def list_portfolio_cost(
    subaccount: Subaccount = Depends(get_user_subaccount),
    session: AsyncSession = Depends(get_async_session),
    dt_from: Annotated[datetime | None, Query(alias="from")] = None,
    dt_to: Annotated[datetime | None, Query(alias="to")] = None,
    currency: str = "rub",
):
    values = await portfolio_service.get_portfolio_cost(
        session, subaccount=subaccount, currency=currency, dt_from=dt_from, dt_to=dt_to
    )
    return {
        "values": [{"value": v[0], "ts": v[1]} for v in values],
        "currency": currency,
    }


@router.get(
    "/subaccounts/{subaccount_id}/stats/cost",
    response_model=PortfolioCostStat,
    tags=["stats"],
)
async def get_portfolio_cost_stat(
    subaccount: Subaccount = Depends(get_user_subaccount),
    session: AsyncSession = Depends(get_async_session),
):
    result = await portfolio_service.get_portfolio_cost_stat(
        session, subaccount=subaccount
    )
    return result
