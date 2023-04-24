from src.db.base_class import Base
from sqlalchemy import Column, Integer, String, Text


class Currency(Base):
    __tablename__ = "currencies"

    iso: str = Column(String(length=3), primary_key=True, index=True)
    figi: str = Column(String(length=12))
    ticker: str = Column(String)
    lot: int = Column(Integer)
    name: str = Column(Text)
