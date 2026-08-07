"""Maintenance records router."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas
from app.dependencies import get_current_user

router = APIRouter()


@router.get("/", response_model=List[schemas.MaintenanceRecordResponse])
def list_maintenance(
    asset_id: int = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    query = db.query(models.MaintenanceRecord)
    if asset_id:
        query = query.filter(models.MaintenanceRecord.asset_id == asset_id)
    return query.order_by(models.MaintenanceRecord.created_at.desc()).all()


@router.post("/", response_model=schemas.MaintenanceRecordResponse, status_code=status.HTTP_201_CREATED)
def create_maintenance(
    record_in: schemas.MaintenanceRecordCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    asset = db.query(models.Asset).filter(models.Asset.id == record_in.asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    db_record = models.MaintenanceRecord(**record_in.model_dump())
    db.add(db_record)

    # Update asset status if maintenance is scheduled
    if record_in.status == "SCHEDULED":
        old_status = asset.status
        asset.status = "IN_MAINTENANCE"
        history = models.AssetStatusHistory(
            asset_id=asset.id,
            old_status=old_status,
            new_status="IN_MAINTENANCE",
            changed_by=current_user.id,
            reason="Maintenance scheduled"
        )
        db.add(history)

    db.commit()
    db.refresh(db_record)
    return db_record


@router.put("/{record_id}", response_model=schemas.MaintenanceRecordResponse)
def update_maintenance(
    record_id: int,
    record_in: schemas.MaintenanceRecordUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    record = db.query(models.MaintenanceRecord).filter(models.MaintenanceRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Maintenance record not found")

    for field, value in record_in.model_dump(exclude_unset=True).items():
        setattr(record, field, value)

    # If completed, set asset back to available
    if record_in.status == "COMPLETED" and record.asset:
        asset = db.query(models.Asset).filter(models.Asset.id == record.asset_id).first()
        if asset and asset.status == "IN_MAINTENANCE":
            old_status = asset.status
            asset.status = "AVAILABLE"
            history = models.AssetStatusHistory(
                asset_id=asset.id,
                old_status=old_status,
                new_status="AVAILABLE",
                changed_by=current_user.id,
                reason="Maintenance completed"
            )
            db.add(history)

    db.commit()
    db.refresh(record)
    return record


@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_maintenance(
    record_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    record = db.query(models.MaintenanceRecord).filter(models.MaintenanceRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Maintenance record not found")
    db.delete(record)
    db.commit()
    return None
