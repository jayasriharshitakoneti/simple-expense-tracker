# Simple Expense Tracker

A minimal, full-stack expense tracking application built with **FastAPI + MySQL + React + TypeScript**. Upload CSV bank statements and get instant spending insights with powerful filtering capabilities.

## Features

### 📤 CSV Upload & Processing
- **Multiple CSV Format Support**: Bank of America checking/credit cards, plus generic CSV files
- **Smart Date Parsing**: Automatically converts MM/DD/YYYY to standard format
- **Merchant Extraction**: Intelligently extracts merchant names from transaction descriptions
- **No Duplicates Allowed**: Upload the same file multiple times without creating duplicates
- **Real-time Upload Feedback**: See exactly how many transactions were inserted vs skipped

### 📊 Financial Summary Dashboard
- **Monthly Overview**: Total expenses, income, and net balance at a glance
- **Merchant-Based Categories**: Automatic categorization by merchant for instant spending insights
- **Top Merchants Analysis**: See where your money goes most frequently
- **Visual Amount Indicators**: Color-coded positive (green) and negative (red) amounts

### 🔍 Advanced Filtering & Search
- **Month-Based Filtering**: View transactions for specific months or all-time
- **Merchant Filtering**: Focus on spending with specific merchants
- **Transaction Type Filtering**: Show only expenses or income
- **Text Search**: Search across transaction descriptions and merchant names
- **Clickable Merchant Names**: Click any merchant in the transaction table to instantly filter by that merchant

### ✏️ Transaction Management
- **Inline Category Editing**: Click and edit categories directly in the transaction table
- **Safe Transaction Deletion**: Delete unwanted transactions with detailed confirmation dialogs
- **Real-time Updates**: Changes reflect immediately across all views
- **Transaction Details**: View date, description, merchant, amount, and custom categories

### 🎯 User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Data**: All changes update instantly without page refreshes
- **Clean Interface**: Minimal, intuitive design focused on functionality
- **Error Handling**: Helpful error messages and loading states

## Tech Stack

### Backend
- **FastAPI**: Modern, fast Python web framework
- **MySQL**: Reliable database with mysql-connector-python
- **SQLAlchemy**: Powerful ORM for database operations
- **Python 3.12**: Latest stable Python version

### Frontend
- **React 18**: Modern React with functional components and hooks
- **TypeScript**: Type-safe JavaScript for better development experience
- **Vite**: Lightning-fast build tool and dev server
- **Vanilla CSS**: Clean, custom styling without framework dependencies

### Database Schema
- **Transactions Table**: Stores date, description, merchant, amount, category, and notes
- **No Unique Constraints**: Allows similar transactions (like multiple MBTA rides)
- **Flexible Categories**: Manual categorization with merchant-based defaults

## Quick Start

### Prerequisites
- Python 3.12+
- Node.js 16+
- MySQL server running locally

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to start tracking your expenses!

## CSV File Formats

### Bank of America Checking
```csv
Date,Description,Amount,Running Balance
01/15/2025,AMAZON.COM*AMZN.COM/BILL,-89.99,1234.56
01/16/2025,PAYROLL DEPOSIT,2500.00,3634.55
```

### Bank of America Credit
```csv
Posted Date,Reference Number,Payee,Address,Amount
01/15/2025,1234567890,AMAZON.COM,AMZN.COM/BILL WA,-45.67
01/16/2025,1234567891,STARBUCKS #5678,COFFEE SHOP,-6.78
```

### Generic Format
```csv
Date,Description,Amount
01/15/2025,COFFEE SHOP PURCHASE,-4.50
01/16/2025,SALARY DEPOSIT,2500.00
```

## API Endpoints

- `POST /api/upload` - Upload CSV file
- `GET /api/transactions` - List transactions with optional filtering
- `GET /api/summary` - Get financial summary with merchant breakdowns
- `GET /api/merchants` - Get list of all merchants
- `PATCH /api/transactions/{id}` - Update transaction category/notes
- `DELETE /api/transactions/{id}` - Delete transaction

## Database

The application automatically creates a `simple_expense_tracker` database in MySQL on first run. No manual database setup required!

## Contributing

This is a minimal application designed for personal expense tracking. The codebase is kept intentionally small (~600 total lines) for easy understanding and modification.

## License

Open source - feel free to modify for your personal use.

---

**Built for simplicity, designed for insight.** Track your spending without the complexity.
