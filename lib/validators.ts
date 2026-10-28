import { z } from 'zod'
import {
  BADGE_OPTIONS,
  CATEGORY_TONES,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  PRODUCT_STATUSES,
  UNITS,
} from '@/lib/constants'

const slug = z
  .string()
  .min(2, 'Slug minimal 2 karakter')
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung')

const money = z.number().int('Harus bilangan bulat').min(0, 'Tidak boleh negatif')

const optionSchema = z.object({
  label: z.string().min(1, 'Label pilihan wajib diisi'),
  multiplier: z.number().int().positive('Pengali harus > 0'),
})

export const categorySchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(80),
  slug: slug,
  tagline: z.string().max(160).optional().or(z.literal('')),
  image: z.string().max(500).optional().or(z.literal('')),
  tone: z.enum(CATEGORY_TONES),
})

export const productSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(160),
  slug: slug,
  sku: z.string().min(2, 'SKU minimal 2 karakter').max(64),
  category: slug,
  price: money,
  salePrice: money.nullable().optional(),
  unit: z.enum(UNITS).or(z.string().min(1).max(20)),
  image: z.string().max(500).optional().or(z.literal('')),
  description: z.string().max(2000).optional().or(z.literal('')),
  stock: z.number().int().min(0, 'Stok tidak boleh negatif'),
  options: z.array(optionSchema).min(1, 'Minimal satu pilihan'),
  badge: z.enum(BADGE_OPTIONS).nullable().optional(),
  rating: z.number().min(0).max(5).optional(),
  featured: z.boolean().optional(),
  status: z.enum(PRODUCT_STATUSES),
})

export const orderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
})

export const paymentStatusSchema = z.object({
  paymentStatus: z.enum(PAYMENT_STATUSES),
})

export const inventoryAdjustmentSchema = z.object({
  slug: z.string().min(1),
  delta: z.coerce.number().int().refine((v) => v !== 0, 'Penyesuaian tidak boleh nol'),
  reason: z.string().min(3, 'Alasan minimal 3 karakter').max(300),
  reference: z.string().max(120).optional().or(z.literal('')),
})

export const settingsSchema = z.object({
  storeName: z.string().min(1, 'Nama toko wajib diisi').max(80),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  whatsapp: z.string().max(20).optional().or(z.literal('')),
  address: z.string().max(300).optional().or(z.literal('')),
  lowStockThreshold: z.coerce.number().int().min(1).max(100000),
  currency: z.string().min(1).max(10),
  timezone: z.string().min(1).max(50),
})

export const profileSchema = z.object({
  role: z.enum(['admin', 'staff']),
})

export type CategoryInput = z.infer<typeof categorySchema>
export type ProductInput = z.infer<typeof productSchema>
export type InventoryAdjustmentInput = z.infer<typeof inventoryAdjustmentSchema>
export type SettingsInput = z.infer<typeof settingsSchema>
