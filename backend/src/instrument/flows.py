from datetime import datetime, timedelta, timezone
from math import log
from statistics import mean
from typing import Any, Callable, Literal

from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm.session import Session
from tinkoff.invest import AioRequestError
from tinkoff.invest import Bond as TBond
from tinkoff.invest import CandleInterval, Client
from tinkoff.invest import Currency as TCurrency
from tinkoff.invest import Etf as TETF
from tinkoff.invest import Future as TFuture
from tinkoff.invest import GetOrderBookResponse, HistoricCandle, InstrumentStatus
from tinkoff.invest import Option as TOption
from tinkoff.invest import Share as TShare

from src.common.utils import quotation_to_decimal, quotation_to_float
from src.config import settings
from src.db.session import get_sync_session
from src.instrument.models import (
    ETF,
    Bond,
    Currency,
    Future,
    Instrument,
    InstrumentMetrics,
    Option,
    Share,
)

TinkoffInstrument = TETF | TBond | TShare | TFuture | TOption | TCurrency


class BaseUpdateInstrumentFlow:
    instrument: Literal["bonds", "etfs", "shares", "options", "futures"] = "bonds"

    _options = [
        ("grpc.max_send_message_length", 512 * 1024 * 1024),
        ("grpc.max_receive_message_length", 512 * 1024 * 1024),
    ]

    _additional_fields: dict[str, Callable[[TinkoffInstrument], Any]] = {
        "uid": lambda x: x.uid,
    }

    _base_fields: dict[str, Callable[[TinkoffInstrument], Any]] = {
        "uid": lambda x: x.uid,
        "type": lambda x: x.__class__.__name__.lower(),
        "figi": lambda x: getattr(x, "figi", None),
        "ticker": lambda x: x.ticker,
        "lot": lambda x: x.lot,
        "currency": lambda x: x.currency,
        "name": lambda x: x.name,
        "min_price_increment": lambda x: quotation_to_decimal(x.min_price_increment),
        "position_uid": lambda x: x.position_uid,
        "is_tradable": lambda x: x.api_trade_available_flag,
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
            case "currencies":
                return Currency

    def _get_instrument_fields(
        self,
        instrument: TinkoffInstrument,
        mapping: dict[str, Callable] = _base_fields,
    ) -> dict[str, Any]:
        return {k: fn(instrument) for k, fn in mapping.items()}

    def _get_additional_fields(self, instrument: TinkoffInstrument) -> dict[str, Any]:
        return self._get_instrument_fields(instrument, self._additional_fields)

    def _get_instruments(self) -> list[TinkoffInstrument]:
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
        values: list[dict[str, Any]],
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
        session.close()

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


class UpdateCurrenciesFlow(BaseUpdateInstrumentFlow):
    instrument = "currencies"

    _additional_fields = {
        "uid": lambda x: x.uid,
        "iso": lambda x: x.iso_currency_name,
    }


class UpdateInstrumentMetrics:
    def __init__(self, figi: str, *args, **kwargs):
        self.figi = figi

    def _get_metrics_model(self, session: Session) -> InstrumentMetrics:
        stmt = select(InstrumentMetrics).filter(InstrumentMetrics.figi == self.figi)
        obj = session.execute(stmt).scalar_one_or_none()
        if obj is None:
            obj = InstrumentMetrics(figi=self.figi)
            session.add(obj)
            session.commit()
        return obj

    def _get_candles(
        self, interval: CandleInterval, dt_from: datetime, dt_to: datetime
    ) -> list[HistoricCandle]:
        with Client(settings.TINKOFF_TOKEN) as client:
            try:
                candles = client.get_all_candles(
                    figi=self.figi, from_=dt_from, to=dt_to, interval=interval
                )
                return list(candles)
            except AioRequestError:
                return []

    def _get_orderbook(self, depth: int = 20) -> GetOrderBookResponse | None:
        with Client(settings.TINKOFF_TOKEN) as client:
            try:
                ob = client.market_data.get_order_book(figi=self.figi, depth=depth)
                return ob
            except AioRequestError:
                return None

    def _create_prices_arr(self, candles: list[HistoricCandle]) -> list[float]:
        if len(candles) == 0:
            return []

        result = [quotation_to_float(candles[0].open)]

        def add_price(price: float):
            if result[-1] == price:
                return
            result.append(price)

        for candle in candles:
            o, h, l, c = (
                quotation_to_float(candle.open),
                quotation_to_float(candle.high),
                quotation_to_float(candle.low),
                quotation_to_float(candle.close),
            )
            add_price(o)
            if o > c:
                add_price(h)
                add_price(l)
            else:
                add_price(l)
                add_price(h)
            add_price(c)

        return result

    def _calculate_volatility(self, prices: list[float]) -> float:
        k = prices[-1] / prices[0]
        prices = [p * k for p in prices]

        percent, max_percent, d_percent = 0.25, 10.0, 0.25
        waves: dict[float, float] = {}

        while percent <= max_percent:
            cnt, extrema_local = 0, prices[0]

            p = percent / 100 + 1.0

            for price in prices:
                if price <= extrema_local:
                    extrema_local = price
                    continue

                current = round(log(price / extrema_local) / log(p))
                if current != 0:
                    cnt += current
                    extrema_local *= p**cnt

            if cnt != 0:
                waves[p] = cnt
            percent += d_percent

        return max(
            [
                count * (log(percent) / log(1.0004) - 2.0)
                for percent, count in waves.items()
            ]
        )

    def _calculate_spread(self, session: Session) -> float:
        orderbook = self._get_orderbook()
        if (
            orderbook is not None
            and len(orderbook.bids) > 0
            and len(orderbook.asks) > 0
        ):
            instrument = session.get(Instrument, orderbook.instrument_uid)
            spread = abs(orderbook.bids[0].price - orderbook.asks[0].price)
            if instrument is not None:
                spread = quotation_to_decimal(spread) / instrument.min_price_increment
                spread = float(spread)
            else:
                spread = quotation_to_float(spread)
            return spread
        return 0.0

    def _calculate_volume(
        self, hour_candles: list[HistoricCandle], day_candles: list[HistoricCandle]
    ) -> tuple[float, float]:
        if len(day_candles) >= 80:
            mean_volume = mean([c.volume for c in day_candles[-80:]])
        else:
            return 0, 0

        sell_d, buy_d, sell_v, buy_v = 1, 1, 0, 0
        b, s = False, False

        prev = hour_candles[0]
        for candle in hour_candles[1:]:
            if candle.time - prev.time > timedelta(hours=1):
                buy_d += 1 if b else 0
                sell_d += 1 if s else 0
                b, s = False, False

            if candle.open >= candle.close:
                buy_v += candle.volume
                b = True
            else:
                sell_v += candle.volume
                s = True

            prev = candle

        return buy_v / buy_d / mean_volume, sell_v / sell_d / mean_volume

    def _calculate_relative_price(self, day_candles: list[HistoricCandle]) -> float:
        year_min = quotation_to_float(min([c.low for c in day_candles]))
        year_max = quotation_to_float(max([c.high for c in day_candles]))
        return quotation_to_float(day_candles[-1].close) - year_min / (
            year_max - year_min
        )

    def _calculate_gain(self, day_candles: list[HistoricCandle]) -> float:
        if len(day_candles) < 30:
            return 0
        return (
            quotation_to_float(day_candles[-1].close)
            / quotation_to_float(day_candles[-30].open)
            - 1.0
        )

    def run(self, *args, **kwargs):
        session = next(get_sync_session())
        metrics = self._get_metrics_model(session)

        dt_to = datetime.utcnow().replace(tzinfo=timezone.utc)

        minute_candles = self._get_candles(
            CandleInterval.CANDLE_INTERVAL_1_MIN, dt_to - timedelta(days=80), dt_to
        )
        if len(minute_candles) == 0:
            return

        prices = self._create_prices_arr(minute_candles)
        metrics.volatility = self._calculate_volatility(prices)
        metrics.last_price = prices[-1]
        metrics.spread = self._calculate_spread(session)

        hour_candles = self._get_candles(
            CandleInterval.CANDLE_INTERVAL_HOUR, dt_to - timedelta(days=14), dt_to
        )
        day_candles = self._get_candles(
            CandleInterval.CANDLE_INTERVAL_DAY, dt_to - timedelta(days=365), dt_to
        )
        metrics.buy_volume, metrics.sell_volume = self._calculate_volume(
            hour_candles, day_candles
        )
        metrics.relative_price = self._calculate_relative_price(day_candles)
        metrics.gain = self._calculate_gain(day_candles)

        session.add(metrics)
        session.commit()
        session.close()
