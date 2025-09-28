# Expense Tracker Backend

Minimal FastAPI backend for expense tracking with MySQL.

## Prerequisites
- MySQL server running locally
- Database credentials: root / Root@123

## Setup
```bash
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000