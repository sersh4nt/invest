from celery import Celery, group
from sqlalchemy import select

from src.account.models import Subaccount
from src.config import settings
from src.db.session import get_sync_session
from src.instrument.flows import UpdateCurrenciesFlow, UpdateInstrumentsFlow
from src.portfolio.flows import StorePortfolioFlow

celery = Celery("worker", broker=settings.REDIS_URI, backend=settings.REDIS_URI)


# @celery.on_after_configure.connect
# def setup_periodic_tasks(sender, **kwargs):
#     sender.add_periodic_task(crontab("*/10"), store_portfolio.s())


@celery.task
def store_portfolio_by_subaccount_id(subaccount_id: int, *args, **kwargs):
    flow = StorePortfolioFlow()
    flow.run(subaccount_id, *args, **kwargs)


@celery.task
def store_portfolio(*args, **kwargs):
    db = next(get_sync_session())
    ids = db.execute(select(Subaccount.id).filter(Subaccount.is_enabled)).all()
    return group(
        [store_portfolio_by_subaccount_id.s(id, *args, **kwargs) for id in ids]
    )()


@celery.task
def update_instruments(*args, **kwargs):
    flow = UpdateCurrenciesFlow()
    flow.run(*args, **kwargs)
    flow = UpdateInstrumentsFlow()
    flow.run(*args, **kwargs)
