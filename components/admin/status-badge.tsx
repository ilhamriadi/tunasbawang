import { cn } from '@/lib/utils'
import type { OrderStatus, PaymentStatus, ProductStatus } from '@/lib/constants'
import {
  orderStatusLabels,
  paymentStatusLabels,
  productStatusLabels,
} from '@/lib/constants'

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'brand'

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-muted text-muted-foreground ring-1 ring-border',
  success: 'bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-600/20 dark:text-emerald-400',
  warning: 'bg-amber-500/10 text-amber-700 ring-1 ring-amber-600/20 dark:text-amber-400',
  danger: 'bg-red-500/10 text-red-700 ring-1 ring-red-600/20 dark:text-red-400',
  info: 'bg-sky-500/10 text-sky-700 ring-1 ring-sky-600/20 dark:text-sky-400',
  brand: 'bg-primary/10 text-primary ring-1 ring-primary/20',
}

export function StatusBadge({ tone = 'neutral', children }: { tone?: BadgeTone; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        toneClasses[tone],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {children}
    </span>
  )
}

export function orderStatusTone(status: OrderStatus): BadgeTone {
  switch (status) {
    case 'pending':
      return 'warning'
    case 'processing':
      return 'info'
    case 'shipped':
      return 'brand'
    case 'delivered':
      return 'success'
    case 'cancelled':
      return 'danger'
  }
}

export function paymentStatusTone(status: PaymentStatus): BadgeTone {
  switch (status) {
    case 'paid':
      return 'success'
    case 'unpaid':
      return 'warning'
    case 'refunded':
      return 'danger'
  }
}

export function productStatusTone(status: ProductStatus): BadgeTone {
  switch (status) {
    case 'active':
      return 'success'
    case 'draft':
      return 'neutral'
    case 'archived':
      return 'danger'
  }
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <StatusBadge tone={orderStatusTone(status)}>{orderStatusLabels[status]}</StatusBadge>
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <StatusBadge tone={paymentStatusTone(status)}>{paymentStatusLabels[status]}</StatusBadge>
}

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return <StatusBadge tone={productStatusTone(status)}>{productStatusLabels[status]}</StatusBadge>
}

export function StockBadge({ stock, threshold = 50 }: { stock: number; threshold?: number }) {
  if (stock === 0) return <StatusBadge tone="danger">Stok habis</StatusBadge>
  if (stock <= threshold) return <StatusBadge tone="warning">Stok menipis</StatusBadge>
  return <StatusBadge tone="success">Tersedia</StatusBadge>
}
