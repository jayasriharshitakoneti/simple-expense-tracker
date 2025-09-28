from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class TransactionResponse(BaseModel):
    id: int
    date: date
    description: str
    merchant: Optional[str]
    amount: float
    category: Optional[str]
    notes: Optional[str]

    class Config:
        from_attributes = True

class TransactionUpdate(BaseModel):
    category: Optional[str] = None
    merchant: Optional[str] = None
    notes: Optional[str] = None

class CategorySummary(BaseModel):
    category: str
    total: float

class MerchantSummary(BaseModel):
    merchant: str
    total: float
    count: int

class SummaryResponse(BaseModel):
    month: str
    total_expense: float
    total_income: float
    net: float
    by_category: List[CategorySummary]
    top_merchants: List[MerchantSummary]