from decimal import Decimal

from sqlalchemy.sql.selectable import Select
from tinkoff.invest import MoneyValue, Quotation

from src.common.pagination import PaginationOpts


def quotation_to_decimal(q: Quotation | MoneyValue) -> Decimal:
    return Decimal(q.units) + Decimal(q.nano) / 1_000_000_000


def quotation_to_float(q: Quotation | MoneyValue) -> float:
    return float(q.units) + float(q.nano) / 1_000_000_000


def decimal_to_quotation(d: Decimal, currency: str | None = None) -> Quotation:
    units = int(d)
    nano = int((d - units) * 1_000_000_000)
    if currency is not None:
        return MoneyValue(units=units, nano=nano, currency=currency)
    return Quotation(units=units, nano=nano)


def paginate_stmt(stmt: Select, pagination: PaginationOpts = None):
    if pagination is not None and pagination.page_size is not None:
        offset = (pagination.page or 0) * pagination.page_size
        limit = pagination.page_size
        stmt = stmt.offset(offset).limit(limit)
    return stmt
