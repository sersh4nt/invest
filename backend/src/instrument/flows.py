from typing import Any, Callable, Dict, List, Literal

from sqlalchemy.dialects.postgresql import insert
from tinkoff.invest import Bond as TBond
from tinkoff.invest import Client
from tinkoff.invest import Etf as TETF
from tinkoff.invest import Future as TFuture
from tinkoff.invest import InstrumentStatus
from tinkoff.invest import Option as TOption
from tinkoff.invest import Share as TShare

from src.config import settings
from src.db.session import get_sync_session
from src.instrument.models import ETF, Bond, Currency, Future, Instrument, Option, Share
from src.utils import quotation_to_decimal

TinkoffInstrument = TETF | TBond | TShare | TFuture | TOption


class BaseUpdateInstrumentFlow:
    instrument: Literal["bonds", "etfs", "shares", "options", "futures"] = "bonds"

    _options = [
        ("grpc.max_send_message_length", 512 * 1024 * 1024),
        ("grpc.max_receive_message_length", 512 * 1024 * 1024),
    ]

    _additional_fields: Dict[str, Callable[[TinkoffInstrument], Any]] = {
        "uid": lambda x: x.uid,
    }
    _base_fields: Dict[str, Callable] = {
        "uid": lambda x: x.uid,
        "type": lambda x: x.__class__.__name__.lower(),
        "figi": lambda x: getattr(x, "figi", None),
        "ticker": lambda x: x.ticker,
        "lot": lambda x: x.lot,
        "currency": lambda x: x.currency,
        "name": lambda x: x.name,
        "min_price_increment": lambda x: quotation_to_decimal(x.min_price_increment),
        "position_uid": lambda x: x.position_uid,
    }

    def _get_orm_class(self):
        match self.instrument:
            case "bonds":
                return Bond
            case "etfs":
                return ETF
            case "shares":
                return Share
            case "options":
                return Option
            case "futures":
                return Future

    def _get_instrument_fields(
        self,
        instrument: TinkoffInstrument,
        mapping: Dict[str, Callable] = _base_fields,
    ) -> Dict[str, Any]:
        return {k: fn(instrument) for k, fn in mapping.items()}

    def _get_additional_fields(self, instrument: TinkoffInstrument) -> Dict[str, Any]:
        return self._get_instrument_fields(instrument, self._additional_fields)

    def _get_instruments(self) -> List[TinkoffInstrument]:
        with Client(settings.TINKOFF_TOKEN, options=self._options) as client:
            method: Callable = getattr(client.instruments, self.instrument)
            response = method(instrument_status=InstrumentStatus(2))
        return response.instruments

    def _batch_items(self, items: list, batch_size: int = 1000) -> list:
        for i in range(0, len(items), batch_size):
            yield items[i : i + batch_size]

    def _insert_by_batch(
        self,
        Class: Any,
        values: List[Dict[str, Any]],
        update_fields: list = None,
        batch_size: int = 1000,
    ):
        session = next(get_sync_session())
        for batch in self._batch_items(values, batch_size):
            stmt = insert(Class).values(batch)

            if update_fields is not None:
                stmt = stmt.on_conflict_do_update(
                    index_elements=["uid"],
                    set_={k: getattr(stmt.excluded, k) for k in update_fields},
                )

            session.execute(stmt)
            session.commit()

    def run(self, *args, **kwargs):
        instruments = self._get_instruments()

        base_values = [self._get_instrument_fields(i) for i in instruments]
        self._insert_by_batch(Instrument, base_values, list(self._base_fields.keys()))

        Class = self._get_orm_class()
        values = [self._get_additional_fields(i) for i in instruments]
        self._insert_by_batch(Class, values, list(self._additional_fields.keys()))


class UpdateBondsFlow(BaseUpdateInstrumentFlow):
    instrument = "bonds"

    _additional_fields = {
        "uid": lambda x: x.uid,
        "coupon_quantity_per_year": lambda x: x.coupon_quantity_per_year,
        "maturity_date": lambda x: x.maturity_date,
        "nominal": lambda x: quotation_to_decimal(x.nominal),
        "initial_nominal": lambda x: quotation_to_decimal(x.initial_nominal),
        "issue_size": lambda x: x.issue_size,
    }


class UpdateETFSFlow(BaseUpdateInstrumentFlow):
    instrument = "etfs"

    _additional_fields = {
        "uid": lambda x: x.uid,
        "fixed_commission": lambda x: quotation_to_decimal(x.fixed_commission),
    }


class UpdateSharesFlow(BaseUpdateInstrumentFlow):
    instrument = "shares"


class UpdateFuturesFlow(BaseUpdateInstrumentFlow):
    instrument = "futures"
    _additional_fields = {
        "uid": lambda x: x.uid,
        "futures_type": lambda x: x.futures_type,
        "asset_type": lambda x: x.asset_type,
        "basic_asset": lambda x: x.basic_asset_position_uid or None,
        "basic_asset_size": lambda x: quotation_to_decimal(x.basic_asset_size),
        "expiration_date": lambda x: x.expiration_date,
    }


class UpdateOptionsFlow(BaseUpdateInstrumentFlow):
    instrument = "options"

    _additional_fields = {
        "uid": lambda x: x.uid,
        "direction": lambda x: x.direction.name,
        "payment_type": lambda x: x.payment_type.name,
        "style": lambda x: x.style.name,
        "settlement_style": lambda x: x.settlement_type.name,
        "settlement_currency": lambda x: x.settlement_currency or None,
        "asset_type": lambda x: x.asset_type,
        "basic_asset": lambda x: x.basic_asset_position_uid or None,
        "basic_asset_size": lambda x: quotation_to_decimal(x.basic_asset_size),
        "strike_price": lambda x: quotation_to_decimal(x.strike_price),
    }


class UpdateCurrenciesFlow:
    BLACKLIST = ["xau", "xag"]
    ADDITIONAL_CURRENCUES = [
        {
            "iso": "nok",
            "name": "Норвежская крона",
            "figi": None,
            "uid": None,
            "ticker": None,
            "lot": None,
        },
        {
            "iso": "sek",
            "name": "Шведская крона",
            "figi": None,
            "uid": None,
            "ticker": None,
            "lot": None,
        },
    ]

    def run(self, *args, **kwargs):
        with Client(settings.TINKOFF_TOKEN) as client:
            currencies = client.instruments.currencies(
                instrument_status=InstrumentStatus(2)
            )

        currencies = [
            {
                "iso": c.iso_currency_name,
                "figi": c.figi,
                "uid": c.uid,
                "ticker": c.ticker,
                "lot": c.lot,
                "name": c.name,
            }
            for c in currencies.instruments
            if c.iso_currency_name not in self.BLACKLIST
        ]

        currencies.extend(self.ADDITIONAL_CURRENCUES)

        db = next(get_sync_session())

        stmt = (
            insert(Currency)
            .values(currencies)
            .on_conflict_do_nothing(index_elements=["iso"])
        )
        db.execute(stmt)
        db.commit()
