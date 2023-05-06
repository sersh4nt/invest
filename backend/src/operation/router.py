from datetime import datetime
from typing import Annotated, List

import src.operation.service as operations_service
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from src.account.dependencies import get_user_subaccount
from src.account.models import Subaccount
from src.db.session import get_async_session
from src.operation.schemas import (
    ActiveOrderScheme,
    OperationScheme,
    OperationStats,
    RevenueStats,
)
from src.utils import quotation_to_decimal

router = APIRouter(tags=["operations"])


@router.get(
    "/subaccounts/{subaccount_id}/operations", response_model=List[OperationScheme]
)
async def list_operations(
    subaccount: Subaccount = Depends(get_user_subaccount),
    dt_from: Annotated[datetime | None, Query(alias="from")] = None,
    dt_to: Annotated[datetime | None, Query(alias="to")] = None,
    page_size: Annotated[int, Query(gt=0)] = 50,
    page: Annotated[int, Query(ge=0)] = 0,
    session: AsyncSession = Depends(get_async_session),
):
    operations = await operations_service.get_operations(
        session,
        subaccount=subaccount,
        dt_from=dt_from,
        dt_to=dt_to,
        page=page,
        page_size=page_size,
    )
    return operations


@router.get(
    "/subaccounts/{subaccount_id}/active-orders", response_model=List[ActiveOrderScheme]
)
async def list_active_orders(
    subaccount: Subaccount = Depends(get_user_subaccount),
    session: AsyncSession = Depends(get_async_session),
):
    orders = await operations_service.get_active_orders(session, subaccount=subaccount)
    return [
        {
            "broker_id": order.order_id,
            "lots_requested": order.lots_requested,
            "lots_executed": order.lots_executed,
            "instrument_figi": order.figi,
            "direction": order.direction.name[16:],
            "price": quotation_to_decimal(order.initial_order_price),
            "type": order.order_type.name[11:],
            "date": order.order_date,
        }
        for order in orders
    ]


@router.get(
    "/subaccounts/{subaccount_id}/stats/operations",
    response_model=OperationStats,
    tags=["stats"],
)
async def get_daily_operations_stats(
    subaccount: Subaccount = Depends(get_user_subaccount),
    session: AsyncSession = Depends(get_async_session),
):
    response = await operations_service.get_operations_stats(
        session, subaccount=subaccount
    )
    return response


@router.get(
    "/subaccounts/{subaccount_id}/stats/revenue",
    response_model=RevenueStats,
    tags=["stats"],
)
async def get_portfolio_revenue(
    subaccount: Subaccount = Depends(get_user_subaccount),
    session: AsyncSession = Depends(get_async_session),
):
    result = await operations_service.get_portfolio_revenue(
        session, subaccount=subaccount
    )
    return result
