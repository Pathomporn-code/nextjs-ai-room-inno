import { describe, it, expect } from 'vitest'
import * as z from 'zod'

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'กรุณากรอกชื่อ')
      .min(2, 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร')
      .max(50, 'ชื่อต้องไม่เกิน 50 ตัวอักษร'),
    email: z
      .string()
      .min(1, 'กรุณากรอกอีเมล')
      .email('รูปแบบอีเมลไม่ถูกต้อง'),
    password: z
      .string()
      .min(1, 'กรุณากรอกรหัสผ่าน')
      .min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'),
    confirmPassword: z
      .string()
      .min(1, 'กรุณายืนยันรหัสผ่าน'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'รหัสผ่านไม่ตรงกัน',
    path: ['confirmPassword'],
  })

describe('registerSchema', () => {
  it('should pass with valid data', () => {
    const result = registerSchema.safeParse({
      name: 'สมชาย',
      email: 'somchai@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('should fail when name is empty', () => {
    const result = registerSchema.safeParse({
      name: '',
      email: 'somchai@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    })
    expect(result.success).toBe(false)
  })

  it('should fail when name is less than 2 characters', () => {
    const result = registerSchema.safeParse({
      name: 's',
      email: 'somchai@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    })
    expect(result.success).toBe(false)
  })

  it('should fail when email is invalid', () => {
    const result = registerSchema.safeParse({
      name: 'สมชาย',
      email: 'not-an-email',
      password: 'password123',
      confirmPassword: 'password123',
    })
    expect(result.success).toBe(false)
  })

  it('should fail when password is less than 8 characters', () => {
    const result = registerSchema.safeParse({
      name: 'สมชาย',
      email: 'somchai@example.com',
      password: '1234567',
      confirmPassword: '1234567',
    })
    expect(result.success).toBe(false)
  })

  it('should fail when passwords do not match', () => {
    const result = registerSchema.safeParse({
      name: 'สมชาย',
      email: 'somchai@example.com',
      password: 'password123',
      confirmPassword: 'password456',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('รหัสผ่านไม่ตรงกัน')
    }
  })
})
