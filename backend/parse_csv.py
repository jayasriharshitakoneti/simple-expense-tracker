import csv
import io
from datetime import datetime
import re

def parse_csv_content(content: str):
    """Parse CSV content and return list of transaction dictionaries"""
    transactions = []
    reader = csv.DictReader(io.StringIO(content))
    
    # Detect CSV format based on headers
    headers = [h.strip() for h in reader.fieldnames or []]
    
    for row in reader:
        # Skip empty rows
        if not any(row.values()):
            continue
            
        try:
            trans_data = parse_row(row, headers)
            if trans_data:
                transactions.append(trans_data)
        except Exception:
            # Skip invalid rows
            continue
    
    return transactions

def parse_row(row, headers):
    """Parse a single CSV row into transaction data"""
    # Determine date field
    date_value = None
    description_value = None
    amount_value = None
    
    # BoA Credit format
    if 'Posted Date' in headers:
        date_value = row.get('Posted Date', '').strip()
        description_value = row.get('Payee', '').strip()
        amount_value = row.get('Amount', '').strip()
    # BoA Checking or Generic format
    elif 'Date' in headers:
        date_value = row.get('Date', '').strip()
        description_value = row.get('Description', '').strip()
        amount_value = row.get('Amount', '').strip()
    
    if not date_value or not description_value or not amount_value:
        return None
    
    # Parse date (MM/DD/YYYY to YYYY-MM-DD)
    try:
        parsed_date = datetime.strptime(date_value, '%m/%d/%Y').date()
    except ValueError:
        try:
            # Try other common formats
            parsed_date = datetime.strptime(date_value, '%Y-%m-%d').date()
        except ValueError:
            return None
    
    # Parse amount
    try:
        amount = float(amount_value.replace('$', '').replace(',', ''))
    except ValueError:
        return None
    
    # Extract merchant from description
    merchant = extract_merchant(description_value)
    
    return {
        'date': parsed_date,
        'description': description_value,
        'merchant': merchant,
        'amount': amount,
        'category': 'Uncategorized'
    }

def extract_merchant(description):
    """Extract merchant name from description"""
    # Remove common prefixes and clean up
    desc = description.upper().strip()
    
    # Extract first word that contains letters/numbers
    words = re.findall(r'\b[A-Z0-9]+[A-Z0-9]*\b', desc)
    
    # Return first meaningful word or fallback
    for word in words:
        if len(word) > 2 and not word.isdigit():
            return word
    
    return desc[:20] if desc else "UNKNOWN"