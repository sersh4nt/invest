from datetime import datetime
from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

import src.account.service as account_service
import src.operation.service as operations_service
from src.account.dependencies import get_user_subaccount
from src.account.models import Subaccount
from src.common.exceptions import BadRequest
from src.common.pagination import Page, PaginationOpts
from src.common.schemas import DefaultResponse
from src.common.utils import quotation_to_decimal
from src.db.session import get_async_session
from src.operation.schemas import (
    ActiveOrderScheme,
    CancelOrderScheme,
    OperationScheme,
    OperationStats,
    OrderCreate,
    RevenueStats,
)

router = APIRouter(tags=["operations"])


@router.get(
    "/subaccounts/{subaccount_id}/operations", response_model=Page[OperationScheme]
)
async def list_operations(
    subaccount: Subaccount = Depends(get_user_subaccount),
    dt_from: Annotated[datetime | None, Query(alias="from")] = None,
    dt_to: Annotated[datetime | None, Query(alias="to")] = None,
    session: AsyncSession = Depends(get_async_session),
    pagination: PaginationOpts = Depends(),
):
    print(pagination.page, pagination.page_size)
    operations, count = await operations_service.get_operations(
        session,
        subaccount=subaccount,
        dt_from=dt_from,
        dt_to=dt_to,
        pagination=pagination,
    )
    return {"count": count, "page": pagination.page or 0, "items": operations}


@router.get(
    "/subaccounts/{subaccount_id}/active-orders", response_model=List[ActiveOrderScheme]
)
async def list_active_orders(
    subaccount: Subaccount = Depends(get_user_subaccount),
    session: AsyncSession = Depends(get_async_session),
):
    orders, instruments = await operations_service.get_active_orders(
        session, subaccount=subaccount
    )
    instruments = {i.figi: i for i in instruments}
    return [
        {
            "broker_id": order.order_id,
            "lots_requested": order.lots_requested,
            "lots_executed": order.lots_executed,
            "instrument": instruments[order.figi],
            "direction": order.direction.name[16:],
            "price": quotation_to_decimal(order.initial_order_price),
            "type": order.order_type.name[11:],
            "date": order.order_date,
        }
        for order in orders
    ]


@router.post(
    "/subaccounts/{subaccount_id}/active-orders", response_model=DefaultResponse
)
async def create_order(
    data: OrderCreate,
    subaccount: Subaccount = Depends(get_user_subaccount),
):
    status, msg = await operations_service.create_order(
        subaccount=subaccount, data=data
    )
    if not status:
        raise HTTPException(status_code=400, detail=msg)
    return {"status": status, "msg": msg}


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


@router.post("/cancel", response_model=bool)
async def cancel_order(
    data: CancelOrderScheme,
    session: AsyncSession = Depends(get_async_session),
):
    subaccount = await account_service.get_subaccount_by_id(
        session, subaccount_id=data.subaccount_id
    )
    if subaccount is None:
        raise BadRequest()
    return await operations_service.cancel_order(subaccount, data.order_id)
