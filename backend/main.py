from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
import csv
import io
from typing import Optional

from db import get_db, create_tables
from models import Transaction
from schemas import TransactionUpdate, TransactionResponse, SummaryResponse
from parse_csv import parse_csv_content

app = FastAPI(title="Simple Expense Tracker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],  # Added wildcard for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables on startup
create_tables()

@app.post("/api/upload")
async def upload_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    print(f"Received file: {file.filename}")
    
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files allowed")
    
    content = await file.read()
    text_content = content.decode('utf-8')
    print(f"CSV content length: {len(text_content)}")
    
    transactions = parse_csv_content(text_content)
    print(f"Parsed {len(transactions)} transactions")
    
    inserted = 0
    
    for trans_data in transactions:
        try:
            transaction = Transaction(**trans_data)
            db.add(transaction)
            inserted += 1
        except Exception as e:
            print(f"Error adding transaction: {e}")
    
    try:
        db.commit()
        result = {"inserted": inserted, "skipped": 0}
        print(f"Upload result: {result}")
        return result
    except Exception as e:
        db.rollback()
        print(f"Database commit error: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/api/transactions")
def get_transactions(month: Optional[str] = None, search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Transaction)
    
    if month:
        query = query.filter(Transaction.date.like(f"{month}%"))
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Transaction.description.like(search_term)) |
            (Transaction.merchant.like(search_term))
        )
    
    transactions = query.order_by(Transaction.date.desc()).all()
    return [TransactionResponse.from_orm(t) for t in transactions]

@app.patch("/api/transactions/{transaction_id}")
def update_transaction(transaction_id: int, update: TransactionUpdate, db: Session = Depends(get_db)):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    if update.category is not None:
        transaction.category = update.category
    if update.merchant is not None:
        transaction.merchant = update.merchant
    if update.notes is not None:
        transaction.notes = update.notes
    
    db.commit()
    return TransactionResponse.from_orm(transaction)

@app.get("/api/summary")
def get_summary(month: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Transaction)
    
    if month:
        query = query.filter(Transaction.date.like(f"{month}%"))
    
    transactions = query.all()
    
    total_expense = sum(t.amount for t in transactions if t.amount < 0)
    total_income = sum(t.amount for t in transactions if t.amount > 0)
    net = total_income + total_expense
    
    # Group by merchant (treating merchant as category)
    merchants = {}
    
    for t in transactions:
        if t.amount < 0:  # Only count expenses for merchant spending
            merch = t.merchant or "Unknown"
            if merch not in merchants:
                merchants[merch] = {"total": 0, "count": 0}
            merchants[merch]["total"] += abs(t.amount)
            merchants[merch]["count"] += 1
    
    # Sort by spending amount
    by_merchant = [{"category": k, "total": v["total"]} for k, v in sorted(merchants.items(), key=lambda x: x[1]["total"], reverse=True)]
    top_merchants = [{"merchant": k, "total": v["total"], "count": v["count"]} for k, v in sorted(merchants.items(), key=lambda x: x[1]["total"], reverse=True)]
    
    return SummaryResponse(
        month=month or "all",
        total_expense=total_expense,
        total_income=total_income,
        net=net,
        by_category=by_merchant,
        top_merchants=top_merchants
    )

# Add new endpoint for merchant filtering
@app.get("/api/merchants")
def get_merchants(db: Session = Depends(get_db)):
    merchants = db.query(Transaction.merchant).filter(Transaction.merchant.isnot(None)).distinct().all()
    return [{"merchant": m[0]} for m in merchants if m[0]]

@app.delete("/api/transactions/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    db.delete(transaction)
    db.commit()
    return {"message": "Transaction deleted successfully"}