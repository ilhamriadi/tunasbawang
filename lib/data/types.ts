import type { Json } from '@/lib/database.types'
import type { InventoryType, OrderStatus, PaymentStatus, ProductStatus, Role } from '@/lib/constants'

export type ProductOption = { label: string; multiplier: number }

export type Product = {
  slug: string
  sku: string
  name: string
  category: string
  categoryName: string | null
  price: number
  salePrice: number | null
  unit: string
  image: string | null
  description: string | null
  stock: number
  options: ProductOption[]
  badge: string | null
  rating: number
  sold: number
  featured: boolean
  status: ProductStatus
  createdAt: string
  updatedAt: string
}

export type Category = {
  slug: string
  name: string
  tagline: string | null
  image: string | null
  tone: string
  createdAt: string
  productCount: number
}

export type Customer = {
  id: string
  name: string
  phone: string | null
  email: string | null
  address: string | null
  city: string | null
  postalCode: string | null
  createdAt: string
  orderCount: number
  totalSpent: number
}

export type OrderItem = {
  id: string
  productSlug: string | null
  productName: string
  optionLabel: string | null
  quantity: number
  unitPrice: number
  lineTotal: number
}

export type Order = {
  id: string
  orderNumber: string
  customerId: string | null
  status: OrderStatus
  paymentStatus: PaymentStatus
  subtotal: number
  shippingCost: number
  discount: number
  total: number
  shippingName: string | null
  paymentName: string | null
  customerName: string | null
  customerPhone: string | null
  customerAddress: string | null
  customerCity: string | null
  customerPostalCode: string | null
  note: string | null
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

export type InventoryMovement = {
  id: string
  productSlug: string | null
  productName: string
  type: InventoryType
  quantity: number
  reason: string
  reference: string | null
  createdByName: string | null
  createdAt: string
}

export type AdminProfile = {
  id: string
  email: string | null
  fullName: string | null
  role: Role
  createdAt: string
}

export type ActivityEntry = {
  id: string
  actorName: string | null
  action: string
  entityType: string | null
  entityId: string | null
  detail: Json | null
  createdAt: string
}

export type StoreSettings = {
  storeName: string
  email: string
  whatsapp: string
  address: string
  lowStockThreshold: number
  currency: string
  timezone: string
}

export function parseOptions(json: Json | null): ProductOption[] {
  if (!Array.isArray(json)) return []
  return json
    .filter((o): o is { label: string; multiplier: number } => {
      return (
        typeof o === 'object' &&
        o !== null &&
        typeof (o as Record<string, unknown>).label === 'string' &&
        typeof (o as Record<string, unknown>).multiplier === 'number'
      )
    })
    .map((o) => ({ label: o.label, multiplier: o.multiplier }))
}
