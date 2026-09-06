from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.database import engine, Base
# Importing all routers and models ensures metadata maps properly to engine
from app.routers import auth, users, assets, assignments, locations, categories, vendors, maintenance, dashboard
from app import models  

# Automatically create database tables if they do not exist
#Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="IT Inventory API",
    description="Backend API for IT Inventory Management System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Robust CORS Configuration: Handles localhost, 127.0.0.1, and env overrides
raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Existing Routers (Unmodified)
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(assets.router, prefix="/api/v1/assets", tags=["Assets"])
app.include_router(assignments.router, prefix="/api/v1/assignments", tags=["Assignments"])
app.include_router(locations.router, prefix="/api/v1/locations", tags=["Locations"])
app.include_router(categories.router, prefix="/api/v1/categories", tags=["Categories"])
app.include_router(vendors.router, prefix="/api/v1/vendors", tags=["Vendors"])
app.include_router(maintenance.router, prefix="/api/v1/maintenance", tags=["Maintenance"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["Dashboard"])


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "it-inventory-api"}