import pyodbc
import bcrypt

# Hash password using bcrypt directly
password = "admin123".encode('utf-8')
password_hash = bcrypt.hashpw(password, bcrypt.gensalt()).decode('utf-8')

odbc_str = (
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=localhost;"
    "DATABASE=IT_Inventory;"
    "Trusted_Connection=yes;"
    "TrustServerCertificate=yes;"
)

conn = pyodbc.connect(odbc_str)
cursor = conn.cursor()

# Check if admin exists
cursor.execute("SELECT COUNT(*) FROM users WHERE email = ?", ("admin@itinventory.com",))
if cursor.fetchone()[0] > 0:
    print("Admin user already exists.")
    conn.close()
    exit(0)

# Insert admin
cursor.execute("""
    INSERT INTO users (email, password_hash, first_name, last_name, role_id, is_active)
    VALUES (?, ?, ?, ?, ?, ?)
""", (
    "admin@itinventory.com",
    password_hash,
    "Admin",
    "User",
    1,   # admin role
    1    # active
))
conn.commit()
print("Admin created! Email: admin@itinventory.com | Password: admin123")
conn.close()