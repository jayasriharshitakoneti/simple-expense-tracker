from sqlalchemy import Column, Integer, String, Numeric, Date, DateTime, Text
from sqlalchemy.sql import func
from db import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    date = Column(Date, nullable=False)
    description = Column(String(500), nullable=False)
    merchant = Column(String(255))
    amount = Column(Numeric(12, 2), nullable=False)
    category = Column(String(100), default="Uncategorized")  # Keep this for manual categorization
    notes = Column(Text)
    created_at = Column(DateTime, default=func.now())