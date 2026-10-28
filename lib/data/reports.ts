import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { LOW_STOCK_DEFAULT, type OrderStatus } from '@/lib/constants'

const JAKARTA_OFFSET_MS = 7 * 60 * 60 * 1000

// Shift a timestamp into Asia/Jakarta wall-clock parts (UTC+7, no DST).
function jakartaParts(iso: string) {
  const d = new Date(iso)
  const shifted = new Date(d.getTime() + JAKARTA_OFFSET_MS)
  return {
    y: shifted.getUTCFullYear(),
    m: shifted.getUTCMonth(),
    day: shifted.getUTCDate(),
    dow: shifted.getUTCDay(), // 0 = Sun
  }
}

export type Granularity = 'day' | 'week' | 'month'

function bucketKey(iso: string, granularity: Granularity) {
  const p = jakartaParts(iso)
  if (granularity === 'day') return `${p.y}-${String(p.m + 1).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`
  if (granularity === 'month') return `${p.y}-${String(p.m + 1).padStart(2, '0')}`
  // week: Monday of the current week
  const mondayOffset = (p.dow + 6) % 7
  const d = new Date(Date.UTC(p.y, p.m, p.day) - mondayOffset * 24 * 3600 * 1000)
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
}

type OrderAggRow = { created_at: string; total: number; status: string; payment_status: string }

async function fetchOrdersInRange(fromIso: string): Promise<OrderAggRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('created_at, total, status, payment_status')
    .gte('created_at', fromIso)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as OrderAggRow[]
}

function isRevenue(order: OrderAggRow) {
  return order.payment_status === 'paid' && order.status !== 'cancelled'
}

export async function getDashboardSummary(rangeDays = 30) {
  const supabase = await createClient()
  const fromIso = new Date(Date.now() - rangeDays * 24 * 3600 * 1000).toISOString()

  const [ordersRes, productsRes, customersRes, lowStockRes, activityRes] = await Promise.all([
    supabase.from('orders').select('total, status, payment_status, created_at').gte('created_at', fromIso),
    supabase.from('products').select('slug', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('customers').select('id', { count: 'exact', head: true }),
    supabase.from('products').select('slug', { count: 'exact', head: true }).eq('status', 'active').gt('stock', 0).lte('stock', LOW_STOCK_DEFAULT),
    supabase.from('admin_activity_log').select('id', { count: 'exact', head: true }),
  ])

  const orders = (ordersRes.data ?? []) as OrderAggRow[]

  let totalRevenue = 0
  let awaitingCount = 0
  let paidCount = 0
  for (const o of orders) {
    if (isRevenue(o)) {
      totalRevenue += o.total
      paidCount += 1
    }
    if (o.status === 'pending') awaitingCount += 1
  }

  return {
    totalRevenue,
    ordersReceived: orders.length,
    paidOrders: paidCount,
    awaitingProcessing: awaitingCount,
    productCount: productsRes.count ?? 0,
    lowStockCount: lowStockRes.count ?? 0,
    customerCount: customersRes.count ?? 0,
    activityCount: activityRes.count ?? 0,
  }
}

export async function getRevenueSeries(rangeDays = 30, granularity: Granularity = 'day') {
  const fromIso = new Date(Date.now() - rangeDays * 24 * 3600 * 1000).toISOString()
  const orders = await fetchOrdersInRange(fromIso)

  const revenue = new Map<string, number>()
  const volume = new Map<string, number>()

  for (const o of orders) {
    const key = bucketKey(o.created_at, granularity)
    if (isRevenue(o)) revenue.set(key, (revenue.get(key) ?? 0) + o.total)
    volume.set(key, (volume.get(key) ?? 0) + 1)
  }

  // Build full ordered bucket list (including empty buckets) for the range.
  const buckets: string[] = []
  const now = new Date()
  const count =
    granularity === 'day' ? rangeDays : granularity === 'month' ? Math.max(6, Math.ceil(rangeDays / 30)) : Math.max(4, Math.ceil(rangeDays / 7))

  for (let i = count - 1; i >= 0; i--) {
    let d: Date
    if (granularity === 'day') d = new Date(now.getTime() - i * 24 * 3600 * 1000)
    else if (granularity === 'month') d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1))
    else d = new Date(now.getTime() - i * 7 * 24 * 3600 * 1000)
    buckets.push(bucketKey(d.toISOString(), granularity))
  }

  return buckets.map((key) => {
    const [y, m, d] = key.split('-').map(Number)
    let label: string
    if (granularity === 'day') label = `${d}/${m}`
    else if (granularity === 'month') {
      label = new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', month: 'short' }).format(new Date(Date.UTC(y, m - 1, 1)))
    } else label = `${d}/${m}`
    return { key, label, revenue: revenue.get(key) ?? 0, orders: volume.get(key) ?? 0 }
  })
}

export async function getOrderStatusDistribution() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('orders').select('status, payment_status')
  if (error) throw error
  const rows = (data ?? []) as { status: string; payment_status: string }[]
  const map = new Map<string, number>()
  for (const r of rows) map.set(r.status, (map.get(r.status) ?? 0) + 1)
  const order: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  return order.map((s) => ({ status: s, count: map.get(s) ?? 0 }))
}

export async function getBestSellers(limit = 5) {
  const supabase = await createClient()
  const { data: items, error } = await supabase
    .from('order_items')
    .select('product_name, quantity, line_total, order_id')
  if (error) throw error

  const { data: orders } = await supabase.from('orders').select('id, status, payment_status')
  const validOrder = new Map<string, boolean>()
  for (const o of orders ?? []) {
    validOrder.set(o.id, o.status !== 'cancelled' && o.payment_status !== 'refunded')
  }

  const agg = new Map<string, { qty: number; revenue: number }>()
  for (const it of items ?? []) {
    if (!validOrder.get(it.order_id)) continue
    const cur = agg.get(it.product_name) ?? { qty: 0, revenue: 0 }
    cur.qty += it.quantity
    cur.revenue += it.line_total
    agg.set(it.product_name, cur)
  }

  return [...agg.entries()]
    .map(([name, v]) => ({ name, quantity: v.qty, revenue: v.revenue }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit)
}

export async function getSalesByCategory() {
  const supabase = await createClient()
  const { data: items, error } = await supabase.from('order_items').select('product_slug, line_total, order_id')
  if (error) throw error

  const { data: orders } = await supabase.from('orders').select('id, status, payment_status')
  const validOrder = new Map<string, boolean>()
  for (const o of orders ?? []) {
    validOrder.set(o.id, o.status !== 'cancelled' && o.payment_status !== 'refunded')
  }

  const { data: products } = await supabase.from('products').select('slug, category')
  const catBySlug = new Map<string, string>()
  for (const p of products ?? []) catBySlug.set(p.slug, p.category)

  const agg = new Map<string, number>()
  for (const it of items ?? []) {
    if (!validOrder.get(it.order_id)) continue
    const cat = it.product_slug ? (catBySlug.get(it.product_slug) ?? 'Lainnya') : 'Lainnya'
    agg.set(cat, (agg.get(cat) ?? 0) + it.line_total)
  }
  return [...agg.entries()].map(([category, revenue]) => ({ category, revenue }))
}

export async function getRecentOrders(limit = 6) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('id, order_number, customer_name, total, status, payment_status, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data ?? []
}

export async function getRecentActivity(limit = 8) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('admin_activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data ?? []
}

export async function getOrdersForExport(from?: string, to?: string) {
  const supabase = await createClient()
  let query = supabase
    .from('orders')
    .select('order_number, created_at, customer_name, customer_phone, status, payment_status, subtotal, shipping_cost, discount, total, shipping_name, payment_name')
    .order('created_at', { ascending: false })
  if (from) query = query.gte('created_at', from)
  if (to) query = query.lte('created_at', to)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}
