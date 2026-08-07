"""Pydantic schemas for request/response validation."""
from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List
from datetime import datetime, date
from decimal import Decimal


# ─────────────────────────────────────────────
# Auth Schemas
# ─────────────────────────────────────────────
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: Optional[int] = None
    type: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


# ─────────────────────────────────────────────
# User Schemas
# ─────────────────────────────────────────────
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: Optional[str] = None
    phone: Optional[str] = None
    is_active: bool = True


class UserCreate(UserBase):
    password: str
    role_id: int
    department_id: Optional[int] = None


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    role_id: Optional[int] = None
    department_id: Optional[int] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    role_id: int
    department_id: Optional[int] = None
    created_at: datetime
    last_login: Optional[datetime] = None


class UserMinimal(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: str
    first_name: str
    last_name: Optional[str] = None


# ─────────────────────────────────────────────
# Role Schemas
# ─────────────────────────────────────────────
class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None
    permissions_json: Optional[str] = None


class RoleCreate(RoleBase):
    pass


class RoleResponse(RoleBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime


# ─────────────────────────────────────────────
# Location Schemas
# ─────────────────────────────────────────────
class LocationBase(BaseModel):
    name: str
    type: str
    parent_id: Optional[int] = None
    address: Optional[str] = None


class LocationCreate(LocationBase):
    pass


class LocationUpdate(LocationBase):
    pass


class LocationResponse(LocationBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime


# ─────────────────────────────────────────────
# Vendor Schemas
# ─────────────────────────────────────────────
class VendorBase(BaseModel):
    name: str
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None


class VendorCreate(VendorBase):
    pass


class VendorUpdate(VendorBase):
    pass


class VendorResponse(VendorBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime


# ─────────────────────────────────────────────
# Asset Category Schemas
# ─────────────────────────────────────────────
class AssetCategoryBase(BaseModel):
    name: str
    parent_id: Optional[int] = None
    description: Optional[str] = None


class AssetCategoryCreate(AssetCategoryBase):
    pass


class AssetCategoryUpdate(AssetCategoryBase):
    pass


class AssetCategoryResponse(AssetCategoryBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime


# ─────────────────────────────────────────────
# Asset Schemas
# ─────────────────────────────────────────────
class AssetBase(BaseModel):
    asset_tag: str
    name: str
    category_id: Optional[int] = None
    model: Optional[str] = None
    manufacturer: Optional[str] = None
    serial_number: Optional[str] = None
    specifications_json: Optional[str] = None
    purchase_date: Optional[date] = None
    warranty_expiry: Optional[date] = None
    purchase_cost: Optional[Decimal] = None
    vendor_id: Optional[int] = None
    status: str = "AVAILABLE"
    location_id: Optional[int] = None
    assigned_to_user_id: Optional[int] = None
    notes: Optional[str] = None


class AssetCreate(AssetBase):
    pass


class AssetUpdate(BaseModel):
    asset_tag: Optional[str] = None
    name: Optional[str] = None
    category_id: Optional[int] = None
    model: Optional[str] = None
    manufacturer: Optional[str] = None
    serial_number: Optional[str] = None
    specifications_json: Optional[str] = None
    purchase_date: Optional[date] = None
    warranty_expiry: Optional[date] = None
    purchase_cost: Optional[Decimal] = None
    vendor_id: Optional[int] = None
    status: Optional[str] = None
    location_id: Optional[int] = None
    assigned_to_user_id: Optional[int] = None
    notes: Optional[str] = None


class AssetResponse(AssetBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_by: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    category: Optional[AssetCategoryResponse] = None
    vendor: Optional[VendorResponse] = None
    location: Optional[LocationResponse] = None
    assigned_user: Optional[UserMinimal] = None
    creator: Optional[UserMinimal] = None


class AssetListResponse(BaseModel):
    total: int
    items: List[AssetResponse]


class AssetStatusChange(BaseModel):
    new_status: str
    reason: Optional[str] = None


class AssetStatusHistoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    asset_id: int
    old_status: Optional[str] = None
    new_status: Optional[str] = None
    changed_by: Optional[int] = None
    reason: Optional[str] = None
    created_at: datetime
    changed_by_user: Optional[UserMinimal] = None


# ─────────────────────────────────────────────
# Assignment Schemas
# ─────────────────────────────────────────────
class AssetAssignmentBase(BaseModel):
    asset_id: int
    assigned_to_user_id: int
    assigned_date: date
    expected_return_date: Optional[date] = None
    notes: Optional[str] = None


class AssetAssignmentCreate(AssetAssignmentBase):
    pass


class AssetAssignmentReturn(BaseModel):
    actual_return_date: Optional[date] = None
    notes: Optional[str] = None


class AssetAssignmentResponse(AssetAssignmentBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    assigned_by_user_id: Optional[int] = None
    actual_return_date: Optional[date] = None
    status: str
    created_at: datetime
    asset: Optional[AssetResponse] = None
    assigned_user: Optional[UserMinimal] = None
    assigned_by: Optional[UserMinimal] = None


# ─────────────────────────────────────────────
# Maintenance Schemas
# ─────────────────────────────────────────────
class MaintenanceRecordBase(BaseModel):
    asset_id: int
    maintenance_type: Optional[str] = None
    description: Optional[str] = None
    scheduled_date: Optional[date] = None
    cost: Optional[Decimal] = None
    performed_by: Optional[str] = None
    status: Optional[str] = None


class MaintenanceRecordCreate(MaintenanceRecordBase):
    pass


class MaintenanceRecordUpdate(BaseModel):
    maintenance_type: Optional[str] = None
    description: Optional[str] = None
    scheduled_date: Optional[date] = None
    completed_date: Optional[date] = None
    cost: Optional[Decimal] = None
    performed_by: Optional[str] = None
    status: Optional[str] = None


class MaintenanceRecordResponse(MaintenanceRecordBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    completed_date: Optional[date] = None
    created_at: datetime
    asset: Optional[AssetResponse] = None


# ─────────────────────────────────────────────
# Dashboard Schemas
# ─────────────────────────────────────────────
class DashboardStats(BaseModel):
    total_assets: int
    available_assets: int
    assigned_assets: int
    in_repair_assets: int
    total_users: int
    total_vendors: int
    upcoming_warranty_expiry: int
    low_stock_consumables: int


class RecentActivity(BaseModel):
    id: int
    action: str
    table_name: str
    record_id: int
    performed_by: Optional[str] = None
    created_at: datetime


class DashboardResponse(BaseModel):
    stats: DashboardStats
    recent_activity: List[RecentActivity]
    assets_by_status: dict
    assets_by_category: List[dict]
