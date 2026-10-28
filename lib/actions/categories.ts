'use server'

import { revalidatePath } from 'next/cache'
import { requireStaff } from '@/lib/auth'
import { categorySchema } from '@/lib/validators'
import { createCategory, deleteCategory, updateCategory } from '@/lib/data/categories'
import { logActivity } from '@/lib/data/activity'

export type ActionResult = { ok: true } | { ok: false; error: string }

export async function createCategoryAction(input: unknown): Promise<ActionResult> {
  await requireStaff()
  const parsed = categorySchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Data tidak valid' }
  }
  try {
    await createCategory(parsed.data)
    await logActivity('kategori.dibuat', 'category', parsed.data.slug, { name: parsed.data.name })
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal membuat kategori' }
  }
  revalidatePath('/admin/categories')
  return { ok: true }
}

export async function updateCategoryAction(slug: string, input: unknown): Promise<ActionResult> {
  await requireStaff()
  const parsed = categorySchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Data tidak valid' }
  }
  try {
    await updateCategory(slug, parsed.data)
    await logActivity('kategori.diperbarui', 'category', slug, { name: parsed.data.name })
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal memperbarui kategori' }
  }
  revalidatePath('/admin/categories')
  return { ok: true }
}

export async function deleteCategoryAction(slug: string): Promise<ActionResult> {
  await requireStaff()
  try {
    const res = await deleteCategory(slug)
    if (!res.ok) return { ok: false, error: res.error }
    await logActivity('kategori.dihapus', 'category', slug)
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal menghapus kategori' }
  }
  revalidatePath('/admin/categories')
  return { ok: true }
}
