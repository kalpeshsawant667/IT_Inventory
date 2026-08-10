"""Database configuration and session management."""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from urllib.parse import quote_plus
import os
from dotenv import load_dotenv

load_dotenv()

# Build connection from .env or fallback to Windows Auth
raw_url = os.getenv("DATABASE_URL")
if raw_url:
    DATABASE_URL = raw_url
else:
    odbc_str = (
        "DRIVER={ODBC Driver 17 for SQL Server};"
        "SERVER=PC-PF3RD5DF\\SQLEXPRESS;"
        "DATABASE=IT_Inventory;"
        "Trusted_Connection=yes;"
    )
    DATABASE_URL = f"mssql+pyodbc:///?odbc_connect={quote_plus(odbc_str)}"

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()