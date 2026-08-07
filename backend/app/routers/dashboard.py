"""Dashboard router with KPIs and analytics."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime, timedelta
from typing import List

from app.database import get_db
from app import models, schemas
from app.dependencies import get_current_user

router = APIRouter()


@router.get("/", response_model=schemas.DashboardResponse)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Stats
    total_assets = db.query(models.Asset).count()
    available_assets = db.query(models.Asset).filter(models.Asset.status == "AVAILABLE").count()
    assigned_assets = db.query(models.Asset).filter(models.Asset.status == "ASSIGNED").count()
    in_repair_assets = db.query(models.Asset).filter(models.Asset.status == "IN_REPAIR").count()
    total_users = db.query(models.User).filter(models.User.is_active == True).count()
    total_vendors = db.query(models.Vendor).count()

    # Warranty expiring in next 30 days
    thirty_days_later = datetime.utcnow().date() + timedelta(days=30)
    upcoming_warranty = db.query(models.Asset).filter(
        models.Asset.warranty_expiry <= thirty_days_later,
        models.Asset.warranty_expiry >= datetime.utcnow().date()
    ).count()

    # Low stock consumables
    low_stock = db.query(models.Consumable).filter(
        models.Consumable.quantity <= models.Consumable.reorder_level
    ).count()

    # Recent activity
    recent_activity = db.query(models.AuditLog).order_by(
        models.AuditLog.created_at.desc()
    ).limit(10).all()

    activity_list = []
    for log in recent_activity:
        user_name = None
        if log.performed_by_user:
            user_name = f"{log.performed_by_user.first_name} {log.performed_by_user.last_name or ''}".strip()
        activity_list.append({
            "id": log.id,
            "action": log.action,
            "table_name": log.table_name,
            "record_id": log.record_id,
            "performed_by": user_name,
            "created_at": log.created_at
        })

    # Assets by status
    status_counts = db.query(models.Asset.status, func.count(models.Asset.id)).group_by(models.Asset.status).all()
    assets_by_status = {status: count for status, count in status_counts}

    # Assets by category (top 10)
    category_counts = db.query(
        models.AssetCategory.name,
        func.count(models.Asset.id)
    ).join(models.Asset, models.Asset.category_id == models.AssetCategory.id).group_by(
        models.AssetCategory.name
    ).order_by(func.count(models.Asset.id).desc()).limit(10).all()
    assets_by_category = [{"name": name, "count": count} for name, count in category_counts]

    return {
        "stats": {
            "total_assets": total_assets,
            "available_assets": available_assets,
            "assigned_assets": assigned_assets,
            "in_repair_assets": in_repair_assets,
            "total_users": total_users,
            "total_vendors": total_vendors,
            "upcoming_warranty_expiry": upcoming_warranty,
            "low_stock_consumables": low_stock
        },
        "recent_activity": activity_list,
        "assets_by_status": assets_by_status,
        "assets_by_category": assets_by_category
    }
