from pydantic import BaseModel


class ArbitrageResult(BaseModel):
    initial_amount: float
    final_amount: float
    revenue: float
    revenue_relative: float
    payment_method_from: str
    payment_method_to: str
    symbols: list[str]
