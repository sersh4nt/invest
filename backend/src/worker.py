from celery import Celery, chain, group
from celery.schedules import crontab
from sqlalchemy import select

from src.account.models import Subaccount
from src.config import settings
from src.db import base  # noqa: F401
from src.db.session import get_sync_session
from src.instrument.flows import (
    UpdateBondsFlow,
    UpdateCurrenciesFlow,
    UpdateETFSFlow,
    UpdateFuturesFlow,
    UpdateOptionsFlow,
    UpdateSharesFlow,
)
from src.operation.flows import StoreSubaccountOperationsFlow
from src.portfolio.flows import StorePortfolioFlow
from src.backtest.flows import BackTestStrategyFlow

celery = Celery("worker", broker=settings.REDIS_URI, backend=settings.REDIS_URI)


@celery.on_after_configure.connect
def setup_periodic_tasks(sender: Celery, **kwargs):
    sender.add_periodic_task(crontab("*/5"), store_portfolio.s())
    sender.add_periodic_task(crontab("*"))


@celery.task
def store_operations_by_subaccount_id(subaccount_id: int, *args, **kwargs):
    flow = StoreSubaccountOperationsFlow(subaccount_id)
    flow.run(*args, **kwargs)


@celery.task
def store_portfolio_by_subaccount_id(subaccount_id: int, *args, **kwargs):
    flow = StorePortfolioFlow()
    flow.run(subaccount_id, *args, **kwargs)


@celery.task
def store_operations(*args, **kwargs):
    db = next(get_sync_session())
    ids = db.scalars(select(Subaccount.id).filter(Subaccount.is_enabled))
    return group(
        [store_operations_by_subaccount_id.s(id, *args, **kwargs) for id in ids]
    )()


@celery.task
def store_portfolio(*args, **kwargs):
    db = next(get_sync_session())
    ids = db.scalars(select(Subaccount.id).filter(Subaccount.is_enabled))
    return group(
        [store_portfolio_by_subaccount_id.s(id, *args, **kwargs) for id in ids]
    )()


@celery.task
def update_instruments(*args, **kwargs):
    flow = chain(
        update_currencies.s(*args, **kwargs),
        update_bonds.s(*args, **kwargs),
        update_etfs.s(*args, **kwargs),
        update_shares.s(*args, **kwargs),
        update_futures.s(*args, **kwargs),
        update_options.s(*args, **kwargs),
    )
    flow()


@celery.task
def update_currencies(*args, **kwargs):
    flow = UpdateCurrenciesFlow()
    flow.run(*args, **kwargs)


@celery.task
def update_bonds(*args, **kwargs):
    flow = UpdateBondsFlow()
    flow.run(*args, **kwargs)


@celery.task
def update_etfs(*args, **kwargs):
    flow = UpdateETFSFlow()
    flow.run(*args, **kwargs)


@celery.task
def update_futures(*args, **kwargs):
    flow = UpdateFuturesFlow()
    flow.run(*args, **kwargs)


@celery.task
def update_options(*args, **kwargs):
    flow = UpdateOptionsFlow()
    flow.run(*args, **kwargs)


@celery.task
def update_shares(*args, **kwargs):
    flow = UpdateSharesFlow()
    flow.run(*args, **kwargs)


@celery.task
def backtest_strategy(data: dict, token: str, *args, **kwargs):
    flow = BackTestStrategyFlow(data, token)
    flow.run(*args, **kwargs)
