"""Asset assignments router."""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from app.database import get_db
from app import models, schemas
from app.dependencies import get_current_user

router = APIRouter()


@router.get("/", response_model=List[schemas.AssetAssignmentResponse])
def list_assignments(
    skip: int = 0,
    limit: int = 100,
    asset_id: Optional[int] = None,
    user_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    query = db.query(models.AssetAssignment)
    if asset_id:
        query = query.filter(models.AssetAssignment.asset_id == asset_id)
    if user_id:
        query = query.filter(models.AssetAssignment.assigned_to_user_id == user_id)
    if status:
        query = query.filter(models.AssetAssignment.status == status)
    return query.order_by(models.AssetAssignment.created_at.desc()).offset(skip).limit(limit).all()


@router.post("/", response_model=schemas.AssetAssignmentResponse, status_code=status.HTTP_201_CREATED)
def create_assignment(
    assignment_in: schemas.AssetAssignmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    asset = db.query(models.Asset).filter(models.Asset.id == assignment_in.asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    if asset.status != "AVAILABLE":
        raise HTTPException(status_code=400, detail="Asset is not available for assignment")

    db_assignment = models.AssetAssignment(
        **assignment_in.model_dump(),
        assigned_by_user_id=current_user.id
    )
    db.add(db_assignment)

    # Update asset status
    asset.status = "ASSIGNED"
    asset.assigned_to_user_id = assignment_in.assigned_to_user_id

    # Log status history
    history = models.AssetStatusHistory(
        asset_id=asset.id,
        old_status="AVAILABLE",
        new_status="ASSIGNED",
        changed_by=current_user.id,
        reason=f"Assigned to user {assignment_in.assigned_to_user_id}"
    )
    db.add(history)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment


@router.post("/{assignment_id}/return", response_model=schemas.AssetAssignmentResponse)
def return_assignment(
    assignment_id: int,
    return_data: schemas.AssetAssignmentReturn,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    assignment = db.query(models.AssetAssignment).filter(
        models.AssetAssignment.id == assignment_id,
        models.AssetAssignment.status == "ASSIGNED"
    ).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Active assignment not found")

    assignment.status = "RETURNED"
    assignment.actual_return_date = return_data.actual_return_date or date.today()
    if return_data.notes:
        assignment.notes = (assignment.notes or "") + f"\nReturn note: {return_data.notes}"

    asset = db.query(models.Asset).filter(models.Asset.id == assignment.asset_id).first()
    asset.status = "AVAILABLE"
    asset.assigned_to_user_id = None

    history = models.AssetStatusHistory(
        asset_id=asset.id,
        old_status="ASSIGNED",
        new_status="AVAILABLE",
        changed_by=current_user.id,
        reason="Asset returned"
    )
    db.add(history)
    db.commit()
    db.refresh(assignment)
    return assignment
