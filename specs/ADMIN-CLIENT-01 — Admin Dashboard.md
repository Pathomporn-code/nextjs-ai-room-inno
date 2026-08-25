## Goal

สร้าง Admin Dashboard โดยให้ UI และการ fetch ข้อมูลทำใน `DashboardClient` ผ่าน Route Handlers

`page.tsx` ทำหน้าที่ตรวจสอบสิทธิ์ Admin และ render `<DashboardClient />` เท่านั้น

## Components

- KPI Cards
- Revenue Chart
- Recent Orders
- Period Selector: `7d | 30d | 90d`

ใช้ Recharts สำหรับ Revenue Chart และโหลดแบบ client-only

## APIs

ใช้ API ที่จะสร้างใน `ADMIN-CLIENT-02`

- `GET /api/admin/stats`
- `GET /api/admin/revenue?period=30d`
- `GET /api/admin/orders?limit=5`

Types และ state ที่จำเป็นให้ออกแบบตาม API response

## Behavior

- เมื่อเปิด Dashboard ให้โหลด stats, revenue และ recent orders
- เปลี่ยน period แล้วโหลด revenue ใหม่
- refresh stats และ orders ทุก 30 วินาที
- ทุก section ต้องรองรับ loading, error และ retry

## Constraints

- Data fetching ใช้ `fetch()` ฝั่ง Client
- ตรวจสอบ `session.user.role === 'admin'` ก่อนเข้า Dashboard
- ราคาแสดงเป็นสกุล `THB` ด้วย locale `th-TH`
- วันที่แสดงด้วย locale `th-TH`

## Acceptance Criteria

- Admin สามารถเปิด Dashboard และเห็นข้อมูลสำคัญได้
- Revenue สามารถเปลี่ยนช่วง `7d / 30d / 90d`
- Stats และ Recent Orders refresh อัตโนมัติทุก 30 วินาที
- Loading และ Error state ทำงานถูกต้อง
- Non-admin ไม่สามารถเข้าหน้า Dashboard ได้