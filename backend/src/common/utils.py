from decimal import Decimal
from typing import TypeVar

from sqlalchemy.sql.selectable import Select
from tinkoff.invest import MoneyValue, Quotation

from src.common.pagination import PaginationOpts

SelectType = TypeVar("SelectType", bound=Select)


def quotation_to_decimal(q: Quotation | MoneyValue) -> Decimal:
    return Decimal(q.units) + Decimal(q.nano) / 1_000_000_000


def quotation_to_float(q: Quotation | MoneyValue) -> float:
    return float(q.units) + float(q.nano) / 1_000_000_000


def decimal_to_quotation(d: Decimal) -> Quotation:
    units = int(d)
    nano = int((d - units) * 1_000_000_000)
    return Quotation(units=units, nano=nano)


def paginate_stmt(
    stmt: SelectType, pagination: PaginationOpts | None = None
) -> SelectType:
    if pagination is not None and pagination.page_size is not None:
        offset = (pagination.page or 0) * pagination.page_size
        limit = pagination.page_size
        stmt = stmt.offset(offset).limit(limit)
    return stmt
