from decimal import Decimal

from tinkoff.invest import MoneyValue, Quotation


def quotation_to_decimal(q: Quotation | MoneyValue) -> Decimal:
    return Decimal(q.units) + Decimal(q.nano) / 1_000_000_000


def decimal_to_quotation(d: Decimal, currency: str | None = None) -> Quotation:
    units = int(d)
    nano = int((d - units) * 1_000_000_000)
    if currency is not None:
        return MoneyValue(units=units, nano=nano, currency=currency)
    return Quotation(units=units, nano=nano)
