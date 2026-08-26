import pyodbc
import bcrypt

# Password hashing
password = "admin123".encode("utf-8")
password_hash = bcrypt.hashpw(
    password,
    bcrypt.gensalt()
).decode("utf-8")

# SQL Server connection
odbc_str = (
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=localhost\\SQLEXPRESS;"
    "DATABASE=IT_Inventory;"
    "Trusted_Connection=yes;"
    "TrustServerCertificate=yes;"
)

conn = pyodbc.connect(odbc_str)
cursor = conn.cursor()

# Check if admin already exists
cursor.execute(
    "SELECT COUNT(*) FROM dbo.users WHERE email = ?",
    ("admin@itinventory.com",)
)

if cursor.fetchone()[0] > 0:
    print("Admin user already exists.")
    conn.close()
    exit()

# Get the next ID manually since identity auto-increment is off
cursor.execute("SELECT ISNULL(MAX(id), 0) + 1 FROM dbo.users")
next_id = cursor.fetchone()[0]

# Insert admin with explicit ID
cursor.execute("""
    INSERT INTO dbo.users (
        id,
        employee_id,
        first_name,
        last_name,
        email,
        phone,
        department,
        designation,
        location,
        status,
        created_at,
        password_hash,
        role_id,
        is_active,
        department_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, GETDATE(), ?, ?, ?, ?)
""", (
    next_id,
    "EMP-001",
    "Admin",
    "User",
    "admin@itinventory.com",
    "555-0199",
    "IT",
    "System Administrator",
    "Headquarters",
    "Active",
    password_hash,
    1,
    1,
    1
))

conn.commit()

print("Admin created successfully!")
print("Email: admin@itinventory.com")
print("Password: admin123")
print(f"Generated ID: {next_id}")

conn.close()