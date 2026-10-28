// Shared domain constants + Indonesian labels for the admin panel.

export const LOW_STOCK_DEFAULT = 50

export const PRODUCT_STATUSES = ['active', 'draft', 'archived'] as const
export type ProductStatus = (typeof PRODUCT_STATUSES)[number]

export const productStatusLabels: Record<ProductStatus, string> = {
  active: 'Aktif',
  draft: 'Draf',
  archived: 'Arsip',
}

export const ORDER_STATUSES = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const
export type OrderStatus = (typeof ORDER_STATUSES)[number]

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: 'Menunggu',
  processing: 'Diproses',
  shipped: 'Dikirim',
  delivered: 'Selesai',
  cancelled: 'Dibatalkan',
}

export const PAYMENT_STATUSES = ['unpaid', 'paid', 'refunded'] as const
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  unpaid: 'Belum Bayar',
  paid: 'Lunas',
  refunded: 'Refund',
}

export const ROLES = ['admin', 'staff'] as const
export type Role = (typeof ROLES)[number]

export const roleLabels: Record<Role, string> = {
  admin: 'Admin',
  staff: 'Staf',
}

export const INVENTORY_TYPES = ['in', 'out', 'adjustment'] as const
export type InventoryType = (typeof INVENTORY_TYPES)[number]

export const inventoryTypeLabels: Record<InventoryType, string> = {
  in: 'Masuk',
  out: 'Keluar',
  adjustment: 'Penyesuaian',
}

export const CATEGORY_TONES = ['primary', 'accent', 'card', 'foreground'] as const
export type CategoryTone = (typeof CATEGORY_TONES)[number]

export const categoryToneLabels: Record<CategoryTone, string> = {
  primary: 'Hijau',
  accent: 'Kuning',
  card: 'Putih',
  foreground: 'Hitam',
}

// Valid fulfillment transitions: an order may only move forward, and only a
// pending order may be cancelled.
export const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
}

export const BADGE_OPTIONS = ['Terlaris', 'Baru', 'Promo'] as const
export const UNITS = ['kg', 'sak', 'tray', 'pack', 'unit', 'roll'] as const
