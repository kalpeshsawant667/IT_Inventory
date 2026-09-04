USE IT_Inventory;
GO

/* =========================================================
   1. USERS
   ========================================================= */

INSERT INTO dbo.users (id, employee_id, first_name, last_name, email, phone, department, designation, location, status, password_hash, role_id, is_active)
SELECT v.*
FROM (VALUES
    (1, 'EMP001', 'Kalpesh', 'Sawant', 'kalpesh.sawant@company.com', '9876543210', 'IT', 'System Engineer', 'Goa', 'Active', NULL, 1, 1),
    (2, 'EMP002', 'Rahul', 'Patil', 'rahul.patil@company.com', '9876543211', 'IT', 'Network Engineer', 'Goa', 'Active', NULL, 1, 1),
    (3, 'EMP003', 'Amit', 'Naik', 'amit.naik@company.com', '9876543212', 'IT', 'Support Engineer', 'Goa', 'Active', NULL, 1, 1),
    (4, 'EMP004', 'Vikram', 'Sharma', 'vikram.sharma@company.com', '9876543213', 'Engineering', 'Software Engineer', 'Mumbai', 'Active', NULL, 1, 1),
    (5, 'EMP005', 'Rohit', 'Kamat', 'rohit.kamat@company.com', '9876543214', 'Engineering', 'Senior Engineer', 'Mumbai', 'Active', NULL, 1, 1),
    (6, 'EMP006', 'Neha', 'Desai', 'neha.desai@company.com', '9876543215', 'HR', 'HR Executive', 'Goa', 'Active', NULL, 1, 1),
    (7, 'EMP007', 'Priya', 'Naik', 'priya.naik@company.com', '9876543216', 'Finance', 'Accountant', 'Goa', 'Active', NULL, 1, 1),
    (8, 'EMP008', 'Suresh', 'Rao', 'suresh.rao@company.com', '9876543217', 'IT', 'System Administrator', 'Mumbai', 'Active', NULL, 1, 1),
    (9, 'EMP009', 'Akshay', 'Shinde', 'akshay.shinde@company.com', '9876543218', 'Engineering', 'Project Engineer', 'Mumbai', 'Active', NULL, 1, 1),
    (10, 'EMP010', 'Sanjay', 'Naik', 'sanjay.naik@company.com', '9876543219', 'Engineering', 'Senior Engineer', 'Mumbai', 'Active', NULL, 1, 1)
) AS v(id, employee_id, first_name, last_name, email, phone, department, designation, location, status, password_hash, role_id, is_active)
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.users u WHERE u.id = v.id
);


/* =========================================================
   2. ASSET CATEGORIES
   ========================================================= */

INSERT INTO asset_categories
(
    category_id,
    category_name
)
VALUES
(1, 'Laptop'),
(2, 'Desktop'),
(3, 'Monitor'),
(4, 'Printer'),
(5, 'Mobile'),
(6, 'Tablet'),
(7, 'Network Equipment'),
(8, 'Server'),
(9, 'UPS'),
(10, 'Accessories');
GO


/* =========================================================
   3. VENDORS
   ========================================================= */

INSERT INTO vendors
(
    vendor_id,
    vendor_name,
    contact_person,
    email,
    phone,
    address
)
VALUES
(1, 'Lenovo India', 'Amit Kumar',
 'support@lenovo.com', '1800110756',
 'Bangalore, Karnataka'),

(2, 'Dell Technologies', 'Rahul Mehta',
 'support@dell.com', '18004256735',
 'Bangalore, Karnataka'),

(3, 'HP India', 'Suresh Rao',
 'support@hp.com', '18002581550',
 'Chennai, Tamil Nadu'),

(4, 'Cisco Systems', 'Vijay Singh',
 'support@cisco.com', '18001234567',
 'Bangalore, Karnataka'),

(5, 'Samsung India', 'Anil Joseph',
 'support@samsung.com', '1800407267864',
 'Gurgaon, Haryana'),

(6, 'APC', 'Rajesh Nair',
 'support@apc.com', '18001035454',
 'Mumbai, Maharashtra'),

(7, 'Canon India', 'Prakash Shah',
 'support@canon.com', '18001803366',
 'Gurgaon, Haryana');
GO


/* =========================================================
   4. LOCATIONS
   ========================================================= */

INSERT INTO locations
(
    location_id,
    location_name,
    city,
    state
)
VALUES
(1, 'Goa Engineering Hub', 'Panaji', 'Goa'),
(2, 'Goa IT Office', 'Verna', 'Goa'),
(3, 'Mumbai Office', 'Mumbai', 'Maharashtra'),
(4, 'Bangalore Office', 'Bangalore', 'Karnataka'),
(5, 'Server Room - Goa', 'Panaji', 'Goa'),
(6, 'Warehouse', 'Verna', 'Goa');
GO


/* =========================================================
   5. ASSETS
   ========================================================= */

INSERT INTO assets
(
    asset_tag,
    serial_number,
    category_id,
    vendor_id,
    location_id,
    brand,
    model,
    processor,
    ram,
    storage,
    purchase_date,
    warranty_expiry,
    purchase_cost,
    asset_status,
    remarks
)
VALUES

-- Laptop 1
(
    'LAP-0001',
    'PF4ABC001',
    1,
    1,
    1,
    'Lenovo',
    'ThinkPad T16 Gen 3',
    'Intel Core Ultra 7',
    '32 GB',
    '1 TB SSD',
    '2025-01-15',
    '2028-01-14',
    125000.00,
    'Assigned',
    'Engineering laptop'
),

-- Laptop 2
(
    'LAP-0002',
    'PF4ABC002',
    1,
    1,
    1,
    'Lenovo',
    'ThinkPad T14 Gen 4',
    'Intel Core i7',
    '16 GB',
    '512 GB SSD',
    '2025-02-10',
    '2028-02-09',
    105000.00,
    'Assigned',
    'Engineering laptop'
),

-- Laptop 3
(
    'LAP-0003',
    'DLABC003',
    1,
    2,
    2,
    'Dell',
    'Latitude 5440',
    'Intel Core i5',
    '16 GB',
    '512 GB SSD',
    '2024-06-20',
    '2027-06-19',
    85000.00,
    'Available',
    'Spare laptop'
),

-- Laptop 4
(
    'LAP-0004',
    'HPABC004',
    1,
    3,
    1,
    'HP',
    'EliteBook 840 G10',
    'Intel Core i7',
    '16 GB',
    '512 GB SSD',
    '2024-08-15',
    '2027-08-14',
    95000.00,
    'Assigned',
    'Management laptop'
),

-- Desktop
(
    'DESK-0001',
    'DELLPC001',
    2,
    2,
    3,
    'Dell',
    'OptiPlex 7010',
    'Intel Core i5',
    '16 GB',
    '512 GB SSD',
    '2024-04-10',
    '2027-04-09',
    72000.00,
    'Assigned',
    'Finance workstation'
),

-- Monitor 1
(
    'MON-0001',
    'MONABC001',
    3,
    2,
    1,
    'Dell',
    'P2422H',
    NULL,
    NULL,
    NULL,
    '2024-05-15',
    '2027-05-14',
    18000.00,
    'Assigned',
    '24 inch monitor'
),

-- Monitor 2
(
    'MON-0002',
    'MONABC002',
    3,
    2,
    1,
    'Dell',
    'P2422H',
    NULL,
    NULL,
    NULL,
    '2024-05-15',
    '2027-05-14',
    18000.00,
    'Available',
    '24 inch spare monitor'
),

-- Printer
(
    'PRN-0001',
    'CANON001',
    4,
    7,
    1,
    'Canon',
    'ImageCLASS MF445dw',
    NULL,
    NULL,
    NULL,
    '2024-03-01',
    '2027-02-28',
    42000.00,
    'Available',
    'Network laser printer'
),

-- Mobile
(
    'MOB-0001',
    'SAMABC001',
    5,
    5,
    1,
    'Samsung',
    'Galaxy S24',
    NULL,
    '8 GB',
    '256 GB',
    '2025-03-15',
    '2027-03-14',
    75000.00,
    'Assigned',
    'Company mobile'
),

-- Tablet
(
    'TAB-0001',
    'TABABC001',
    6,
    5,
    3,
    'Samsung',
    'Galaxy Tab S9',
    NULL,
    '8 GB',
    '128 GB',
    '2025-04-20',
    '2027-04-19',
    65000.00,
    'Available',
    'Meeting room tablet'
),

-- Network switch
(
    'NET-0001',
    'CISCO001',
    7,
    4,
    5,
    'Cisco',
    'Catalyst 9200',
    NULL,
    NULL,
    NULL,
    '2024-01-20',
    '2029-01-19',
    145000.00,
    'Available',
    'Core network switch'
),

-- Server
(
    'SRV-0001',
    'SRVDELL001',
    8,
    2,
    5,
    'Dell',
    'PowerEdge R550',
    'Intel Xeon Silver',
    '64 GB',
    '2 TB SSD',
    '2024-02-15',
    '2029-02-14',
    350000.00,
    'Available',
    'Application server'
),

-- UPS
(
    'UPS-0001',
    'UPSAPC001',
    9,
    6,
    5,
    'APC',
    'Smart-UPS 3000',
    NULL,
    NULL,
    NULL,
    '2024-02-20',
    '2027-02-19',
    185000.00,
    'Available',
    'Server room UPS'
),

-- Accessory
(
    'ACC-0001',
    'DOCK001',
    10,
    1,
    1,
    'Lenovo',
    'ThinkPad Universal Dock',
    NULL,
    NULL,
    NULL,
    '2025-01-15',
    '2028-01-14',
    22000.00,
    'Assigned',
    'USB-C docking station'
);
GO


/* =========================================================
   6. ASSET ASSIGNMENTS
   ========================================================= */

INSERT INTO asset_assignments
(
    assignment_id,
    asset_id,
    user_id,
    assigned_date,
    expected_return,
    returned_date,
    assignment_status,
    remarks
)
VALUES

(
    1,
    (SELECT asset_id FROM assets WHERE asset_tag = 'LAP-0001'),
    1,
    '2025-05-05',
    NULL,
    NULL,
    'Assigned',
    'Primary laptop'
),

(
    2,
    (SELECT asset_id FROM assets WHERE asset_tag = 'LAP-0002'),
    2,
    '2025-06-01',
    NULL,
    NULL,
    'Assigned',
    'Engineering laptop'
),

(
    3,
    (SELECT asset_id FROM assets WHERE asset_tag = 'LAP-0004'),
    5,
    '2025-06-15',
    NULL,
    NULL,
    'Assigned',
    'Project manager laptop'
),

(
    4,
    (SELECT asset_id FROM assets WHERE asset_tag = 'DESK-0001'),
    4,
    '2025-01-10',
    NULL,
    NULL,
    'Assigned',
    'Finance workstation'
),

(
    5,
    (SELECT asset_id FROM assets WHERE asset_tag = 'MON-0001'),
    1,
    '2025-05-05',
    NULL,
    NULL,
    'Assigned',
    'External monitor'
),

(
    6,
    (SELECT asset_id FROM assets WHERE asset_tag = 'MOB-0001'),
    6,
    '2025-07-01',
    NULL,
    NULL,
    'Assigned',
    'Company mobile'
),

(
    7,
    (SELECT asset_id FROM assets WHERE asset_tag = 'ACC-0001'),
    1,
    '2025-05-05',
    NULL,
    NULL,
    'Assigned',
    'Laptop docking station'
);
GO


/* =========================================================
   7. MAINTENANCE
   ========================================================= */

INSERT INTO maintenance
(
    maintenance_id,
    asset_id,
    issue_description,
    vendor_name,
    service_date,
    service_cost,
    status,
    remarks
)
VALUES

(
    1,
    (SELECT asset_id FROM assets WHERE asset_tag = 'LAP-0003'),
    'Battery not holding charge',
    'Dell Technologies',
    '2026-01-15',
    8500.00,
    'Completed',
    'Battery replaced'
),

(
    2,
    (SELECT asset_id FROM assets WHERE asset_tag = 'LAP-0004'),
    'Operating system issue',
    'Internal IT',
    '2026-02-10',
    0.00,
    'Completed',
    'OS reinstalled and updated'
),

(
    3,
    (SELECT asset_id FROM assets WHERE asset_tag = 'PRN-0001'),
    'Paper feed error',
    'Canon India',
    '2026-03-05',
    3500.00,
    'Completed',
    'Paper feed roller replaced'
),

(
    4,
    (SELECT asset_id FROM assets WHERE asset_tag = 'SRV-0001'),
    'Preventive maintenance',
    'Dell Technologies',
    '2026-04-20',
    12000.00,
    'Completed',
    'Server health check completed'
),

(
    5,
    (SELECT asset_id FROM assets WHERE asset_tag = 'MON-0002'),
    'Display flickering',
    'Dell Technologies',
    '2026-05-10',
    NULL,
    'In Progress',
    'Replacement under evaluation'
);
GO


/* =========================================================
   8. SOFTWARE LICENSES
   ========================================================= */

INSERT INTO software_licenses
(
    license_id,
    software_name,
    license_key,
    purchased_quantity,
    assigned_quantity,
    expiry_date,
    vendor
)
VALUES

(
    1,
    'Microsoft 365 Business Premium',
    'XXXXX-XXXXX-XXXXX-XXXXX-0001',
    100,
    75,
    '2027-03-31',
    'Microsoft'
),

(
    2,
    'Windows 11 Pro',
    'XXXXX-XXXXX-XXXXX-XXXXX-0002',
    100,
    82,
    '2030-12-31',
    'Microsoft'
),

(
    3,
    'Adobe Acrobat Pro',
    'XXXXX-XXXXX-XXXXX-XXXXX-0003',
    25,
    18,
    '2027-06-30',
    'Adobe'
),

(
    4,
    'Autodesk AutoCAD',
    'XXXXX-XXXXX-XXXXX-XXXXX-0004',
    20,
    15,
    '2027-08-31',
    'Autodesk'
),

(
    5,
    'VMware Workstation Pro',
    'XXXXX-XXXXX-XXXXX-XXXXX-0005',
    10,
    7,
    '2027-12-31',
    'Broadcom'
);
GO


/* =========================================================
   9. ASSET HISTORY
   ========================================================= */

INSERT INTO asset_history
(
    history_id,
    asset_id,
    action_taken,
    action_date,
    performed_by,
    remarks
)
VALUES

(
    1,
    (SELECT asset_id FROM assets WHERE asset_tag = 'LAP-0001'),
    'Asset Created',
    '2025-01-15',
    'IT Admin',
    'Asset added to inventory'
),

(
    2,
    (SELECT asset_id FROM assets WHERE asset_tag = 'LAP-0001'),
    'Asset Assigned',
    '2025-05-05',
    'IT Admin',
    'Assigned to EMP001'
),

(
    3,
    (SELECT asset_id FROM assets WHERE asset_tag = 'LAP-0002'),
    'Asset Created',
    '2025-02-10',
    'IT Admin',
    'Asset added to inventory'
),

(
    4,
    (SELECT asset_id FROM assets WHERE asset_tag = 'LAP-0002'),
    'Asset Assigned',
    '2025-06-01',
    'IT Admin',
    'Assigned to EMP002'
),

(
    5,
    (SELECT asset_id FROM assets WHERE asset_tag = 'LAP-0003'),
    'Asset Created',
    '2024-06-20',
    'IT Admin',
    'Asset added to inventory'
),

(
    6,
    (SELECT asset_id FROM assets WHERE asset_tag = 'LAP-0003'),
    'Maintenance',
    '2026-01-15',
    'IT Admin',
    'Battery replaced'
),

(
    7,
    (SELECT asset_id FROM assets WHERE asset_tag = 'PRN-0001'),
    'Asset Created',
    '2024-03-01',
    'IT Admin',
    'Printer added to inventory'
),

(
    8,
    (SELECT asset_id FROM assets WHERE asset_tag = 'PRN-0001'),
    'Maintenance',
    '2026-03-05',
    'IT Admin',
    'Paper feed roller replaced'
),

(
    9,
    (SELECT asset_id FROM assets WHERE asset_tag = 'SRV-0001'),
    'Asset Created',
    '2024-02-15',
    'IT Admin',
    'Server added to inventory'
),

(
    10,
    (SELECT asset_id FROM assets WHERE asset_tag = 'SRV-0001'),
    'Maintenance',
    '2026-04-20',
    'IT Admin',
    'Preventive maintenance completed'
);
GO


/* =========================================================
   VERIFICATION
   ========================================================= */

SELECT 'Users' AS TableName, COUNT(*) AS RecordCount
FROM users

UNION ALL

SELECT 'Asset Categories', COUNT(*)
FROM asset_categories

UNION ALL

SELECT 'Vendors', COUNT(*)
FROM vendors

UNION ALL

SELECT 'Locations', COUNT(*)
FROM locations

UNION ALL

SELECT 'Assets', COUNT(*)
FROM assets

UNION ALL

SELECT 'Asset Assignments', COUNT(*)
FROM asset_assignments

UNION ALL

SELECT 'Maintenance', COUNT(*)
FROM maintenance

UNION ALL

SELECT 'Software Licenses', COUNT(*)
FROM software_licenses

UNION ALL

SELECT 'Asset History', COUNT(*)
FROM asset_history;
GO