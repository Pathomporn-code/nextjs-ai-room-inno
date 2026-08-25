## Goal

สร้างระบบจัดการสินค้าใน Admin Dashboard ให้รองรับ Create, Read, Update และ Delete

ใช้ `react-hook-form` + Zod สำหรับ validation และใช้ schema ร่วมกันระหว่าง Client และ Route Handlers

## Features

- Product list
- Search
- Pagination
- Create product
- Edit product
- Delete product
- Category dropdown

## APIs

- `GET /api/admin/products`
  - รองรับ `search` และ `page`
- `POST /api/admin/products`
- `PUT /api/admin/products/[id]`
- `DELETE /api/admin/products/[id]`
- `GET /api/admin/categories`

ทุก Route Handler ต้องตรวจสอบสิทธิ์ `admin`

## Validation

สร้าง shared Product schema สำหรับ:

- name: required
- description: optional
- price: number > 0
- categoryId: required

ใช้ schema เดียวกันทั้ง Client Form และ Server API

## Behavior

- Search ให้ debounce ก่อน fetch
- Form เดียวรองรับทั้ง Create และ Edit
- Delete ต้องมี confirmation dialog
- ห้ามลบสินค้าที่มี Order Items อ้างอิงอยู่
- หลัง Create / Edit / Delete สำเร็จ ให้ refresh product list

## UX

- แสดง loading ระหว่าง fetch/submit
- Disable form ระหว่าง submit
- แสดง success/error toast ทุก action
- Delete dialog ต้องแสดงชื่อสินค้า
- รองรับ error state ที่เหมาะสม

## Constraints

- `page.tsx` ตรวจสอบสิทธิ์ Admin ก่อน render Client Component
- Product price จาก Prisma Decimal ต้อง serialize เป็น `number`
- ใช้ TypeScript types ที่เหมาะสมกับ API responses

## Acceptance Criteria

- Admin สามารถค้นหาและดูรายการสินค้าแบบแบ่งหน้าได้
- สามารถเพิ่มและแก้ไขสินค้าได้พร้อม validation
- สามารถลบสินค้าได้หลังยืนยัน
- สินค้าที่ถูกใช้งานใน Order ไม่สามารถลบได้
- UI refresh หลัง CRUD สำเร็จโดยไม่ต้อง reload หน้า
- Non-admin ไม่สามารถเรียก Admin APIs ได้