-- สร้าง MySQL user สำหรับ application (แทน root)
-- รันใน MySQL: mysql -u root -p < scripts/create-app-user.sql

CREATE USER IF NOT EXISTS 'ecommerce_app'@'localhost' IDENTIFIED BY 'CHANGE_THIS_PASSWORD';
GRANT SELECT, INSERT, UPDATE, DELETE ON ecommerce.* TO 'ecommerce_app'@'localhost';
FLUSH PRIVILEGES;

-- หลังรันเสร็จ แก้ .env:
-- DATABASE_URL=mysql://ecommerce_app:CHANGE_THIS_PASSWORD@localhost:3306/ecommerce?connection_limit=5&pool_timeout=30
