from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from urllib.parse import quote_plus
import os
from dotenv import load_dotenv
import urllib.parse
load_dotenv()

odbc_str = (
    r"DRIVER={ODBC Driver 17 for SQL Server};"
    r"SERVER=localhost\SQLEXPRESS;"
    r"DATABASE=IT_Inventory;"
    r"Trusted_Connection=yes;"
)

DATABASE_URL = f"mssql+pyodbc:///?odbc_connect={quote_plus(odbc_str)}"
engine = create_engine(DATABASE_URL)
# DATABASE_URL = URL.create(
#     "mssql+pyodbc",
#     username="",
#     password="",
#     host="localhost",
#     database="IT_Inventory",
#     query={
#         "driver": "ODBC Driver 17 for SQL Server",
#         "trusted_connection": "yes",
#     },
# )

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()