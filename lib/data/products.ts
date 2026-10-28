import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Product, ProductOption } from '@/lib/data/types'
import { parseOptions } from '@/lib/data/types'
import type { ProductStatus } from '@/lib/constants'
import type { ProductInput } from '@/lib/validators'

type ProductRow = {
  slug: string
  sku: string
  name: string
  category: string
  price: number
  sale_price: number | null
  unit: string
  image: string | null
  description: string | null
  stock: number
  options: unknown
  badge: string | null
  rating: number
  sold: number
  featured: boolean
  status: string
  created_at: string
  updated_at: string
}

function mapProduct(row: ProductRow, categoryName: string | null): Product {
  return {
    slug: row.slug,
    sku: row.sku,
    name: row.name,
    category: row.category,
    categoryName,
    price: row.price,
    salePrice: row.sale_price,
    unit: row.unit,
    image: row.image,
    description: row.description,
    stock: row.stock,
    options: parseOptions(row.options as never),
    badge: row.badge,
    rating: Number(row.rating),
    sold: row.sold,
    featured: row.featured,
    status: row.status as ProductStatus,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

async function categoryNameMap() {
  const supabase = await createClient()
  const { data } = await supabase.from('categories').select('slug, name')
  const map = new Map<string, string>()
  for (const c of data ?? []) map.set(c.slug, c.name)
  return map
}

export type ProductListParams = {
  search?: string
  category?: string
  status?: ProductStatus | 'all'
  lowStockOnly?: boolean
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'stock_asc' | 'name'
  page?: number
  pageSize?: number
  lowStockThreshold?: number
}

export async function listProducts(params: ProductListParams = {}) {
  const supabase = await createClient()
  const {
    search = '',
    category,
    status = 'all',
    lowStockOnly = false,
    sort = 'newest',
    page = 1,
    pageSize = 10,
    lowStockThreshold = 50,
  } = params

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase.from('products').select('*', { count: 'exact' })
  if (search.trim()) {
    const term = `%${search.trim()}%`
    query = query.or(`name.ilike.${term},sku.ilike.${term},slug.ilike.${term}`)
  }
  if (category) query = query.eq('category', category)
  if (status !== 'all') query = query.eq('status', status)
  if (lowStockOnly) query = query.gt('stock', 0).lte('stock', lowStockThreshold)

  switch (sort) {
    case 'oldest':
      query = query.order('created_at', { ascending: true })
      break
    case 'price_asc':
      query = query.order('price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price', { ascending: false })
      break
    case 'stock_asc':
      query = query.order('stock', { ascending: true })
      break
    case 'name':
      query = query.order('name', { ascending: true })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  const { data, count, error } = await query.range(from, to)
  if (error) throw error

  const names = await categoryNameMap()
  const rows = (data ?? []) as unknown as ProductRow[]
  return {
    data: rows.map((r) => mapProduct(r, names.get(r.category) ?? null)),
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single()
  if (error || !data) return null
  const names = await categoryNameMap()
  return mapProduct(data as unknown as ProductRow, names.get(data.category) ?? null)
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const supabase = await createClient()
  const { error } = await supabase.from('products').insert({
    slug: input.slug,
    sku: input.sku,
    name: input.name,
    category: input.category,
    price: input.price,
    sale_price: input.salePrice ?? null,
    unit: input.unit,
    image: input.image || null,
    description: input.description || null,
    stock: input.stock,
    options: input.options,
    badge: input.badge ?? null,
    rating: input.rating ?? 0,
    featured: input.featured ?? false,
    status: input.status,
  })
  if (error) throw error
  const created = await getProduct(input.slug)
  if (!created) throw new Error('Gagal membuat produk')
  return created
}

export async function updateProduct(slug: string, input: ProductInput): Promise<Product> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('products')
    .update({
      sku: input.sku,
      name: input.name,
      category: input.category,
      price: input.price,
      sale_price: input.salePrice ?? null,
      unit: input.unit,
      image: input.image || null,
      description: input.description || null,
      stock: input.stock,
      options: input.options,
      badge: input.badge ?? null,
      rating: input.rating ?? 0,
      featured: input.featured ?? false,
      status: input.status,
    })
    .eq('slug', slug)
  if (error) throw error
  const updated = await getProduct(slug)
  if (!updated) throw new Error('Gagal memperbarui produk')
  return updated
}

export async function setProductsStatus(slugs: string[], status: ProductStatus) {
  const supabase = await createClient()
  const { error } = await supabase.from('products').update({ status }).in('slug', slugs)
  if (error) throw error
}

export async function getProductOptions(slug: string): Promise<ProductOption[]> {
  const p = await getProduct(slug)
  return p?.options ?? []
}
