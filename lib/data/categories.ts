import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Category } from '@/lib/data/types'
import type { CategoryInput } from '@/lib/validators'

export async function listCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('slug, name, tagline, image, tone, created_at')
    .order('name', { ascending: true })
  if (error) throw error

  const { count } = await supabase
    .from('products')
    .select('category', { count: 'exact', head: true })

  // Count products per category.
  const { data: products } = await supabase.from('products').select('category')
  const countMap = new Map<string, number>()
  for (const p of products ?? []) {
    countMap.set(p.category, (countMap.get(p.category) ?? 0) + 1)
  }
  void count

  return (data ?? []).map((c) => ({
    slug: c.slug,
    name: c.name,
    tagline: c.tagline,
    image: c.image,
    tone: c.tone,
    createdAt: c.created_at,
    productCount: countMap.get(c.slug) ?? 0,
  }))
}

export async function getCategory(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('categories').select('*').eq('slug', slug).single()
  if (error || !data) return null
  return data
}

export async function createCategory(input: CategoryInput) {
  const supabase = await createClient()
  const { error } = await supabase.from('categories').insert({
    slug: input.slug,
    name: input.name,
    tagline: input.tagline || null,
    image: input.image || null,
    tone: input.tone,
  })
  if (error) throw error
}

export async function updateCategory(slug: string, input: CategoryInput) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('categories')
    .update({
      name: input.name,
      tagline: input.tagline || null,
      image: input.image || null,
      tone: input.tone,
    })
    .eq('slug', slug)
  if (error) throw error
}

/** Returns { ok } or { error } when the category is still in use. */
export async function deleteCategory(slug: string) {
  const supabase = await createClient()
  const { count } = await supabase
    .from('products')
    .select('slug', { count: 'exact', head: true })
    .eq('category', slug)
  if ((count ?? 0) > 0) {
    return { ok: false as const, error: 'Kategori masih dipakai oleh produk.' }
  }
  const { error } = await supabase.from('categories').delete().eq('slug', slug)
  if (error) return { ok: false as const, error: error.message }
  return { ok: true as const }
}
