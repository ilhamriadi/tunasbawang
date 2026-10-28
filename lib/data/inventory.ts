import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { InventoryMovement } from '@/lib/data/types'
import type { InventoryType } from '@/lib/constants'

export type StockRow = {
  slug: string
  sku: string
  name: string
  category: string
  unit: string
  stock: number
  status: string
  image: string | null
}

export async function listStock(opts: { search?: string; lowStockOnly?: boolean; outOfStockOnly?: boolean; threshold?: number } = {}) {
  const supabase = await createClient()
  const { search = '', lowStockOnly = false, outOfStockOnly = false, threshold = 50 } = opts

  let query = supabase
    .from('products')
    .select('slug, sku, name, category, unit, stock, status, image')
    .neq('status', 'archived')

  if (search.trim()) {
    const term = `%${search.trim()}%`
    query = query.or(`name.ilike.${term},sku.ilike.${term}`)
  }
  if (outOfStockOnly) query = query.eq('stock', 0)
  else if (lowStockOnly) query = query.gt('stock', 0).lte('stock', threshold)

  query = query.order('stock', { ascending: true })

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as StockRow[]
}

export async function adjustStock(slug: string, delta: number, reason: string, reference?: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('adjust_stock', {
    p_slug: slug,
    p_delta: delta,
    p_reason: reason,
    p_reference: reference ?? null,
  })
  if (error) throw new Error(error.message)
  return data as number
}

export async function listMovements(opts: { slug?: string; page?: number; pageSize?: number } = {}) {
  const supabase = await createClient()
  const { slug, page = 1, pageSize = 20 } = opts

  let query = supabase.from('inventory_movements').select('*', { count: 'exact' })
  if (slug) query = query.eq('product_slug', slug)
  query = query.order('created_at', { ascending: false })
  const from = (page - 1) * pageSize
  const { data, count, error } = await query.range(from, from + pageSize - 1)
  if (error) throw error

  const rows = (data ?? []) as Array<{
    id: string
    product_slug: string | null
    product_name: string
    type: string
    quantity: number
    reason: string
    reference: string | null
    created_by: string | null
    created_at: string
  }>

  const actorIds = [...new Set(rows.map((r) => r.created_by).filter(Boolean))] as string[]
  const nameById = new Map<string, string>()
  if (actorIds.length) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', actorIds)
    for (const p of profiles ?? []) {
      if (p.full_name) nameById.set(p.id, p.full_name)
    }
  }

  const mapped: InventoryMovement[] = rows.map((m) => ({
    id: m.id,
    productSlug: m.product_slug,
    productName: m.product_name,
    type: m.type as InventoryType,
    quantity: m.quantity,
    reason: m.reason,
    reference: m.reference,
    createdByName: (m.created_by && nameById.get(m.created_by)) || null,
    createdAt: m.created_at,
  }))

  return {
    data: mapped,
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
  }
}
