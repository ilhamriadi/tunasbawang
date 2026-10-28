import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Order, OrderItem } from '@/lib/data/types'
import type { OrderStatus, PaymentStatus } from '@/lib/constants'

type OrderRow = {
  id: string
  order_number: string
  customer_id: string | null
  status: string
  payment_status: string
  subtotal: number
  shipping_cost: number
  discount: number
  total: number
  shipping_name: string | null
  payment_name: string | null
  customer_name: string | null
  customer_phone: string | null
  customer_address: string | null
  customer_city: string | null
  customer_postal_code: string | null
  note: string | null
  created_at: string
  updated_at: string
}

export type OrderListParams = {
  search?: string
  status?: OrderStatus | 'all'
  paymentStatus?: PaymentStatus | 'all'
  from?: string
  to?: string
  page?: number
  pageSize?: number
}

export async function listOrders(params: OrderListParams = {}) {
  const supabase = await createClient()
  const {
    search = '',
    status = 'all',
    paymentStatus = 'all',
    from,
    to,
    page = 1,
    pageSize = 10,
  } = params

  let query = supabase.from('orders').select('*', { count: 'exact' })
  if (search.trim()) {
    const term = `%${search.trim()}%`
    query = query.or(`order_number.ilike.${term},customer_name.ilike.${term},customer_phone.ilike.${term}`)
  }
  if (status !== 'all') query = query.eq('status', status)
  if (paymentStatus !== 'all') query = query.eq('payment_status', paymentStatus)
  if (from) query = query.gte('created_at', from)
  if (to) query = query.lte('created_at', to)

  query = query.order('created_at', { ascending: false })

  const fromRow = (page - 1) * pageSize
  const { data, count, error } = await query.range(fromRow, fromRow + pageSize - 1)
  if (error) throw error

  const rows = (data ?? []) as unknown as OrderRow[]
  return {
    data: rows.map((r) => ({
      id: r.id,
      orderNumber: r.order_number,
      customerId: r.customer_id,
      status: r.status as OrderStatus,
      paymentStatus: r.payment_status as PaymentStatus,
      subtotal: r.subtotal,
      shippingCost: r.shipping_cost,
      discount: r.discount,
      total: r.total,
      shippingName: r.shipping_name,
      paymentName: r.payment_name,
      customerName: r.customer_name,
      customerPhone: r.customer_phone,
      customerAddress: r.customer_address,
      customerCity: r.customer_city,
      customerPostalCode: r.customer_postal_code,
      note: r.note,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      items: [],
    })),
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
  }
}

export async function getOrder(id: string): Promise<Order | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('orders').select('*').eq('id', id).single()
  if (error || !data) return null
  const o = data as unknown as OrderRow

  const { data: items } = await supabase.from('order_items').select('*').eq('order_id', id)

  const orderItems: OrderItem[] = (items ?? []).map((i) => ({
    id: i.id,
    productSlug: i.product_slug,
    productName: i.product_name,
    optionLabel: i.option_label,
    quantity: i.quantity,
    unitPrice: i.unit_price,
    lineTotal: i.line_total,
  }))

  return {
    id: o.id,
    orderNumber: o.order_number,
    customerId: o.customer_id,
    status: o.status as OrderStatus,
    paymentStatus: o.payment_status as PaymentStatus,
    subtotal: o.subtotal,
    shippingCost: o.shipping_cost,
    discount: o.discount,
    total: o.total,
    shippingName: o.shipping_name,
    paymentName: o.payment_name,
    customerName: o.customer_name,
    customerPhone: o.customer_phone,
    customerAddress: o.customer_address,
    customerCity: o.customer_city,
    customerPostalCode: o.customer_postal_code,
    note: o.note,
    createdAt: o.created_at,
    updatedAt: o.updated_at,
    items: orderItems,
  }
}

/** Update fulfillment status. Does NOT touch payment_status. */
export async function updateOrderStatus(id: string, status: OrderStatus) {
  const supabase = await createClient()
  const { error } = await supabase.from('orders').update({ status }).eq('id', id)
  if (error) throw error
}

/** Update payment status (authorized manual verification). */
export async function updatePaymentStatus(id: string, paymentStatus: PaymentStatus) {
  const supabase = await createClient()
  const { error } = await supabase.from('orders').update({ payment_status: paymentStatus }).eq('id', id)
  if (error) throw error
}
