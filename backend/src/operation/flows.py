from datetime import datetime, timedelta
from typing import List

from sqlalchemy import select
from sqlalchemy.orm import Session
from tinkoff.invest import (
    Client,
    GetOperationsByCursorRequest,
    OperationItem,
    OperationState,
)
from tinkoff.invest.exceptions import RequestError

from src.account.models import Subaccount
from src.common.utils import quotation_to_decimal
from src.db.session import get_sync_session
from src.operation.models import Operation, OperationTrade


class StoreSubaccountOperationsFlow:
    def __init__(self, subaccount_id: int) -> None:
        self.subaccount_id = subaccount_id

    def _get_last_operation_date(self, session: Session) -> datetime | None:
        # stmt = (
        #     select(Operation.date)
        #     .filter(Operation.subaccount_id == self.subaccount_id)
        #     .order_by(Operation.date.desc())
        # )
        # return session.scalars(stmt).first()
        return datetime.today()

    def _insert_operations_by_batch(
        self, *, session: Session, operations: List[OperationItem]
    ):
        items = {
            op.id: Operation(
                subaccount_id=self.subaccount_id,
                broker_id=op.id,
                currency=op.payment.currency,
                payment=quotation_to_decimal(op.payment),
                price=quotation_to_decimal(op.price),
                type=op.type.name[15:],
                state=op.state.name[16:],
                quantity=op.quantity,
                instrument_figi=op.figi or None,
                date=op.date,
                trades=[
                    OperationTrade(
                        date=trade.date,
                        quantity=trade.quantity,
                        price=quotation_to_decimal(trade.price),
                    )
                    for trade in op.trades_info.trades
                ],
            )
            for op in operations
            if op.parent_operation_id == ""
        }

        for op in operations:
            if op.parent_operation_id == "":
                continue

            parent = items.get(op.parent_operation_id, None)
            if parent is None:
                continue

            parent.commission = quotation_to_decimal(op.payment)

        session.add_all(items.values())
        session.commit()

    def run(self, *args, **kwargs):
        session = next(get_sync_session())
        subaccount = session.get(Subaccount, self.subaccount_id)

        if subaccount is None:
            return

        dt_from = (
            self._get_last_operation_date(session) or subaccount.opened_date
        ) + timedelta(microseconds=1)

        with Client(subaccount.account.token) as client:
            prev_cursor = None
            failures = 0
            while True:
                request = GetOperationsByCursorRequest(
                    account_id=subaccount.broker_id,
                    from_=dt_from,
                    state=OperationState.OPERATION_STATE_EXECUTED,
                    without_commissions=False,
                    without_overnights=False,
                    without_trades=False,
                    limit=1000,
                )

                if prev_cursor is not None:
                    setattr(request, "cursor", prev_cursor)

                try:
                    response = client.operations.get_operations_by_cursor(request)
                except RequestError:
                    failures += 1
                    if failures > 5:
                        return
                    continue

                self._insert_operations_by_batch(
                    session=session, operations=response.items
                )

                prev_cursor = response.next_cursor
                if not response.has_next:
                    break

        session.close()
