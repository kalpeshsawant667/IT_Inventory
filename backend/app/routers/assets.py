"""Assets router with full CRUD, status history, and filtering."""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from app.database import get_db
from app import models, schemas
from app.dependencies import get_current_user

router = APIRouter()


@router.get("/", response_model=schemas.AssetListResponse)
def list_assets(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    status: Optional[str] = None,
    category_id: Optional[int] = None,
    location_id: Optional[int] = None,
    assigned_to_user_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    query = db.query(models.Asset)

    if search:
        query = query.filter(
            (models.Asset.name.ilike(f"%{search}%")) |
            (models.Asset.asset_tag.ilike(f"%{search}%")) |
            (models.Asset.serial_number.ilike(f"%{search}%"))
        )
    if status:
        query = query.filter(models.Asset.status == status)
    if category_id:
        query = query.filter(models.Asset.category_id == category_id)
    if location_id:
        query = query.filter(models.Asset.location_id == location_id)
    if assigned_to_user_id:
        query = query.filter(models.Asset.assigned_to_user_id == assigned_to_user_id)

    total = query.count()
    items = query.order_by(models.Asset.created_at.desc()).offset(skip).limit(limit).all()
    return {"total": total, "items": items}


@router.get("/{asset_id}", response_model=schemas.AssetResponse)
def get_asset(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    asset = db.query(models.Asset).filter(models.Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset


@router.post("/", response_model=schemas.AssetResponse, status_code=status.HTTP_201_CREATED)
def create_asset(
    asset_in: schemas.AssetCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    existing = db.query(models.Asset).filter(models.Asset.asset_tag == asset_in.asset_tag).first()
    if existing:
        raise HTTPException(status_code=400, detail="Asset tag already exists")

    if asset_in.serial_number:
        existing_sn = db.query(models.Asset).filter(models.Asset.serial_number == asset_in.serial_number).first()
        if existing_sn:
            raise HTTPException(status_code=400, detail="Serial number already exists")

    db_asset = models.Asset(**asset_in.model_dump(), created_by=current_user.id)
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)

    # Log status history
    history = models.AssetStatusHistory(
        asset_id=db_asset.id,
        old_status=None,
        new_status=db_asset.status,
        changed_by=current_user.id,
        reason="Asset created"
    )
    db.add(history)
    db.commit()

    return db_asset


@router.put("/{asset_id}", response_model=schemas.AssetResponse)
def update_asset(
    asset_id: int,
    asset_in: schemas.AssetUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    asset = db.query(models.Asset).filter(models.Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    old_status = asset.status
    update_data = asset_in.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(asset, field, value)

    db.commit()
    db.refresh(asset)

    # Log status change if status changed
    if "status" in update_data and old_status != asset.status:
        history = models.AssetStatusHistory(
            asset_id=asset.id,
            old_status=old_status,
            new_status=asset.status,
            changed_by=current_user.id,
            reason="Status updated via API"
        )
        db.add(history)
        db.commit()

    return asset


@router.delete("/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_asset(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    asset = db.query(models.Asset).filter(models.Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    db.delete(asset)
    db.commit()
    return None


@router.post("/{asset_id}/status-change", response_model=schemas.AssetStatusHistoryResponse)
def change_status(
    asset_id: int,
    status_change: schemas.AssetStatusChange,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    asset = db.query(models.Asset).filter(models.Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    old_status = asset.status
    asset.status = status_change.new_status
    db.commit()
    db.refresh(asset)

    history = models.AssetStatusHistory(
        asset_id=asset.id,
        old_status=old_status,
        new_status=asset.status,
        changed_by=current_user.id,
        reason=status_change.reason or "Manual status change"
    )
    db.add(history)
    db.commit()
    db.refresh(history)
    return history


@router.get("/{asset_id}/history", response_model=List[schemas.AssetStatusHistoryResponse])
def get_asset_history(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    asset = db.query(models.Asset).filter(models.Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return db.query(models.AssetStatusHistory).filter(
        models.AssetStatusHistory.asset_id == asset_id
    ).order_by(models.AssetStatusHistory.created_at.desc()).all()
