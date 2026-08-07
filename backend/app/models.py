"""SQLAlchemy ORM models matching the IT Inventory database schema."""
from sqlalchemy import (
    Column, BigInteger, String, DateTime, Date, Numeric, Integer, Boolean,
    ForeignKey, Text, CheckConstraint, Index, JSON
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Role(Base):
    __tablename__ = "roles"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    permissions_json = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    users = relationship("User", back_populates="role")


class Location(Base):
    __tablename__ = "locations"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)
    parent_id = Column(BigInteger, ForeignKey("locations.id"), nullable=True)
    address = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    parent = relationship("Location", remote_side=[id], backref="children")
    assets = relationship("Asset", back_populates="location")
    users = relationship("User", foreign_keys="User.department_id", back_populates="department")
    consumables = relationship("Consumable", back_populates="location")


class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password_hash = Column(Text, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=True)
    phone = Column(String(30), nullable=True)
    role_id = Column(BigInteger, ForeignKey("roles.id"), nullable=False)
    department_id = Column(BigInteger, ForeignKey("locations.id"), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    last_login = Column(DateTime, nullable=True)

    role = relationship("Role", back_populates="users")
    department = relationship("Location", foreign_keys=[department_id], back_populates="users")
    assigned_assets = relationship("Asset", foreign_keys="Asset.assigned_to_user_id", back_populates="assigned_user")
    created_assets = relationship("Asset", foreign_keys="Asset.created_by", back_populates="creator")
    assignments_assigned = relationship("AssetAssignment", foreign_keys="AssetAssignment.assigned_to_user_id", back_populates="assigned_user")
    assignments_by = relationship("AssetAssignment", foreign_keys="AssetAssignment.assigned_by_user_id", back_populates="assigned_by")
    status_changes = relationship("AssetStatusHistory", back_populates="changed_by_user")
    audit_logs = relationship("AuditLog", back_populates="performed_by_user")


class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    contact_person = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True)
    phone = Column(String(30), nullable=True)
    address = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    assets = relationship("Asset", back_populates="vendor")


class AssetCategory(Base):
    __tablename__ = "asset_categories"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    name = Column(String(150), nullable=False, unique=True)
    parent_id = Column(BigInteger, ForeignKey("asset_categories.id"), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    parent = relationship("AssetCategory", remote_side=[id], backref="children")
    assets = relationship("Asset", back_populates="category")
    consumables = relationship("Consumable", back_populates="category")


class Asset(Base):
    __tablename__ = "assets"
    __table_args__ = (
        CheckConstraint("status IN ('AVAILABLE', 'ASSIGNED', 'IN_REPAIR', 'IN_MAINTENANCE', 'RETIRED', 'LOST', 'DISPOSED')", name="ck_assets_status"),
    )

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    asset_tag = Column(String(100), nullable=False, unique=True, index=True)
    name = Column(String(255), nullable=False)
    category_id = Column(BigInteger, ForeignKey("asset_categories.id"), nullable=True)
    model = Column(String(150), nullable=True)
    manufacturer = Column(String(150), nullable=True)
    serial_number = Column(String(255), unique=True, nullable=True, index=True)
    specifications_json = Column(Text, nullable=True)
    purchase_date = Column(Date, nullable=True)
    warranty_expiry = Column(Date, nullable=True)
    purchase_cost = Column(Numeric(12, 2), nullable=True)
    vendor_id = Column(BigInteger, ForeignKey("vendors.id"), nullable=True)
    status = Column(String(50), nullable=False, default="AVAILABLE", index=True)
    location_id = Column(BigInteger, ForeignKey("locations.id"), nullable=True, index=True)
    assigned_to_user_id = Column(BigInteger, ForeignKey("users.id"), nullable=True, index=True)
    notes = Column(Text, nullable=True)
    created_by = Column(BigInteger, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    category = relationship("AssetCategory", back_populates="assets")
    vendor = relationship("Vendor", back_populates="assets")
    location = relationship("Location", back_populates="assets")
    assigned_user = relationship("User", foreign_keys=[assigned_to_user_id], back_populates="assigned_assets")
    creator = relationship("User", foreign_keys=[created_by], back_populates="created_assets")
    status_history = relationship("AssetStatusHistory", back_populates="asset", cascade="all, delete-orphan")
    assignments = relationship("AssetAssignment", back_populates="asset", cascade="all, delete-orphan")
    maintenance_records = relationship("MaintenanceRecord", back_populates="asset", cascade="all, delete-orphan")
    software_installations = relationship("AssetSoftware", back_populates="asset", cascade="all, delete-orphan")


class AssetStatusHistory(Base):
    __tablename__ = "asset_status_history"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    asset_id = Column(BigInteger, ForeignKey("assets.id", ondelete="CASCADE"), nullable=False, index=True)
    old_status = Column(String(50), nullable=True)
    new_status = Column(String(50), nullable=True)
    changed_by = Column(BigInteger, ForeignKey("users.id"), nullable=True)
    reason = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    asset = relationship("Asset", back_populates="status_history")
    changed_by_user = relationship("User", back_populates="status_changes")


class AssetAssignment(Base):
    __tablename__ = "asset_assignments"
    __table_args__ = (
        CheckConstraint("status IN ('ASSIGNED', 'RETURNED', 'OVERDUE')", name="ck_assignment_status"),
    )

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    asset_id = Column(BigInteger, ForeignKey("assets.id", ondelete="CASCADE"), nullable=False, index=True)
    assigned_to_user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False, index=True)
    assigned_by_user_id = Column(BigInteger, ForeignKey("users.id"), nullable=True)
    assigned_date = Column(Date, nullable=False)
    expected_return_date = Column(Date, nullable=True)
    actual_return_date = Column(Date, nullable=True)
    status = Column(String(50), nullable=False, default="ASSIGNED")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    asset = relationship("Asset", back_populates="assignments")
    assigned_user = relationship("User", foreign_keys=[assigned_to_user_id], back_populates="assignments_assigned")
    assigned_by = relationship("User", foreign_keys=[assigned_by_user_id], back_populates="assignments_by")


class MaintenanceRecord(Base):
    __tablename__ = "maintenance_records"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    asset_id = Column(BigInteger, ForeignKey("assets.id", ondelete="CASCADE"), nullable=False, index=True)
    maintenance_type = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    scheduled_date = Column(Date, nullable=True)
    completed_date = Column(Date, nullable=True)
    cost = Column(Numeric(12, 2), nullable=True)
    performed_by = Column(String(255), nullable=True)
    status = Column(String(50), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    asset = relationship("Asset", back_populates="maintenance_records")


class Software(Base):
    __tablename__ = "software"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    publisher = Column(String(255), nullable=True)
    version = Column(String(100), nullable=True)
    license_type = Column(String(100), nullable=True)
    total_licenses = Column(Integer, default=0)
    used_licenses = Column(Integer, default=0)
    expiry_date = Column(Date, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    asset_installations = relationship("AssetSoftware", back_populates="software")


class AssetSoftware(Base):
    __tablename__ = "asset_software"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    asset_id = Column(BigInteger, ForeignKey("assets.id", ondelete="CASCADE"), nullable=False, index=True)
    software_id = Column(BigInteger, ForeignKey("software.id", ondelete="CASCADE"), nullable=False)
    license_key_encrypted = Column(Text, nullable=True)
    installed_date = Column(Date, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    asset = relationship("Asset", back_populates="software_installations")
    software = relationship("Software", back_populates="asset_installations")


class Consumable(Base):
    __tablename__ = "consumables"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    category_id = Column(BigInteger, ForeignKey("asset_categories.id"), nullable=True)
    sku = Column(String(100), unique=True, nullable=True)
    quantity = Column(Integer, nullable=False, default=0)
    reorder_level = Column(Integer, default=0)
    unit_cost = Column(Numeric(12, 2), nullable=True)
    location_id = Column(BigInteger, ForeignKey("locations.id"), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    category = relationship("AssetCategory", back_populates="consumables")
    location = relationship("Location", back_populates="consumables")
    transactions = relationship("ConsumableTransaction", back_populates="consumable", cascade="all, delete-orphan")


class ConsumableTransaction(Base):
    __tablename__ = "consumable_transactions"
    __table_args__ = (
        CheckConstraint("transaction_type IN ('IN', 'OUT', 'ADJUSTMENT')", name="ck_transaction_type"),
    )

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    consumable_id = Column(BigInteger, ForeignKey("consumables.id", ondelete="CASCADE"), nullable=False, index=True)
    transaction_type = Column(String(30), nullable=False)
    quantity = Column(Integer, nullable=False)
    reference_type = Column(String(100), nullable=True)
    reference_id = Column(BigInteger, nullable=True)
    performed_by = Column(BigInteger, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    consumable = relationship("Consumable", back_populates="transactions")
    user = relationship("User")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    table_name = Column(String(100), nullable=False)
    record_id = Column(BigInteger, nullable=False)
    action = Column(String(30), nullable=False)
    old_values_json = Column(Text, nullable=True)
    new_values_json = Column(Text, nullable=True)
    performed_by = Column(BigInteger, ForeignKey("users.id"), nullable=True)
    ip_address = Column(String(45), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    performed_by_user = relationship("User", back_populates="audit_logs")
