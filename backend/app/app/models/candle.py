from app.db.base_class import Base
from sqlalchemy import (
    BigInteger,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
)

from .mixins import IntegerIDPKMixin


class Candle(Base, IntegerIDPKMixin):
    __tablename__ = "candles"

    instrument_id = Column(BigInteger, ForeignKey("instruments.id"))
    high = Column(Numeric(18, 9))
    low = Column(Numeric(18, 9))
    open = Column(Numeric(18, 9))
    close = Column(Numeric(18, 9))
    volume = Column(Integer)
    date = Column(DateTime(timezone=True))
    resolution = Column(String)
