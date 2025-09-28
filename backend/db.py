from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# MySQL connection string using mysql-connector-python
DATABASE_URL = "mysql+mysqlconnector://root:Root%40123@localhost:3306/simple_expense_tracker"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    # Create database if it doesn't exist
    from sqlalchemy import create_engine, text
    temp_engine = create_engine("mysql+mysqlconnector://root:Root%40123@localhost:3306")
    with temp_engine.connect() as conn:
        conn.execute(text("CREATE DATABASE IF NOT EXISTS simple_expense_tracker"))
        conn.commit()
    
    # Create tables
    from models import Transaction
    Base.metadata.create_all(bind=engine)