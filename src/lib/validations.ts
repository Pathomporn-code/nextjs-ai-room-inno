import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "ชื่อสินค้าจำเป็นต้องกรอก"),
  description: z.string().optional(),
  price: z.number().gt(0, "ราคาต้องมากกว่า 0"),
  categoryId: z.number().int().positive("หมวดหมู่จำเป็นต้องเลือก"),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const productSearchSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type ProductSearchParams = z.infer<typeof productSearchSchema>;