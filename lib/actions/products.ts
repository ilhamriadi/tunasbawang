'use server'

import { revalidatePath } from 'next/cache'
import { requireStaff } from '@/lib/auth'
import { productSchema } from '@/lib/validators'
import { createProduct, setProductsStatus, updateProduct } from '@/lib/data/products'
import { logActivity } from '@/lib/data/activity'

export type ActionResult = { ok: true } | { ok: false; error: string }

async function saveProduct(input: unknown, slug?: string): Promise<ActionResult> {
  await requireStaff()
  const parsed = productSchema.safeParse(input)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { ok: false, error: first?.message ?? 'Data tidak valid' }
  }
  const data = parsed.data
  try {
    if (slug) {
      await updateProduct(slug, data)
      await logActivity('produk.diperbarui', 'product', slug, { name: data.name })
    } else {
      await createProduct(data)
      await logActivity('produk.dibuat', 'product', data.slug, { name: data.name })
    }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal menyimpan produk' }
  }
  revalidatePath('/admin/products')
  revalidatePath('/admin/products/[slug]', 'page')
  revalidatePath('/produk')
  revalidatePath('/')
  return { ok: true }
}

export async function createProductAction(input: unknown): Promise<ActionResult> {
  return saveProduct(input)
}

export async function updateProductAction(slug: string, input: unknown): Promise<ActionResult> {
  return saveProduct(input, slug)
}

export async function setProductsStatusAction(
  slugs: string[],
  status: 'active' | 'draft' | 'archived',
): Promise<ActionResult> {
  await requireStaff()
  if (!slugs.length) return { ok: false, error: 'Tidak ada produk yang dipilih' }
  try {
    await setProductsStatus(slugs, status)
    await logActivity('produk.status', 'product', slugs.join(','), { status })
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal memperbarui status' }
  }
  revalidatePath('/admin/products')
  revalidatePath('/produk')
  revalidatePath('/')
  return { ok: true }
}
