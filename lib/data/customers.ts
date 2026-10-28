import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Customer } from '@/lib/data/types'

export async function listCustomers(search = '', page = 1, pageSize = 10) {
  const supabase = await createClient()
  let query = supabase.from('customers').select('*', { count: 'exact' })
  if (search.trim()) {
    const term = `%${search.trim()}%`
    query = query.or(`name.ilike.${term},phone.ilike.${term},email.ilike.${term}`)
  }
  query = query.order('created_at', { ascending: false })
  const from = (page - 1) * pageSize
  const { data, count, error } = await query.range(from, from + pageSize - 1)
  if (error) throw error

  // Aggregate order stats from valid orders (exclude cancelled/refunded).
  const { data: orders } = await supabase
    .from('orders')
    .select('customer_id, total, status, payment_status')

  const agg = new Map<string, { count: number; spent: number }>()
  for (const o of orders ?? []) {
    if (!o.customer_id) continue
    if (o.status === 'cancelled' || o.payment_status === 'refunded') continue
    const cur = agg.get(o.customer_id) ?? { count: 0, spent: 0 }
    cur.count += 1
    cur.spent += o.total
    agg.set(o.customer_id, cur)
  }

  const rows = (data ?? []).map((c) => {
    const a = agg.get(c.id) ?? { count: 0, spent: 0 }
    return {
      id: c.id,
      name: c.name,
      phone: c.phone,
      email: c.email,
      address: c.address,
      city: c.city,
      postalCode: c.postal_code,
      createdAt: c.created_at,
      orderCount: a.count,
      totalSpent: a.spent,
    } satisfies Customer
  })

  return {
    data: rows,
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
  }
}

export async function getCustomer(id: string): Promise<Customer | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('customers').select('*').eq('id', id).single()
  if (error || !data) return null
  const { data: orders } = await supabase
    .from('orders')
    .select('total, status, payment_status')
    .eq('customer_id', id)

  let count = 0
  let spent = 0
  for (const o of orders ?? []) {
    if (o.status === 'cancelled' || o.payment_status === 'refunded') continue
    count += 1
    spent += o.total
  }

  return {
    id: data.id,
    name: data.name,
    phone: data.phone,
    email: data.email,
    address: data.address,
    city: data.city,
    postalCode: data.postal_code,
    createdAt: data.created_at,
    orderCount: count,
    totalSpent: spent,
  }
}

export async function listCustomerOrders(customerId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('id, order_number, status, payment_status, total, created_at')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}
