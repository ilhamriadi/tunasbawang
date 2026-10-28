'use server'

import { revalidatePath } from 'next/cache'
import { requireStaff } from '@/lib/auth'
import { inventoryAdjustmentSchema } from '@/lib/validators'
import { adjustStock } from '@/lib/data/inventory'
import { logActivity } from '@/lib/data/activity'

export type ActionResult = { ok: true; newStock?: number } | { ok: false; error: string }

export async function adjustStockAction(input: unknown): Promise<ActionResult> {
  await requireStaff()
  const parsed = inventoryAdjustmentSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Data tidak valid' }
  }
  const { slug, delta, reason, reference } = parsed.data
  try {
    const newStock = await adjustStock(slug, delta, reason, reference || undefined)
    await logActivity('stok.disesuaikan', 'product', slug, { delta, reason })
    revalidatePath('/admin/inventory')
    revalidatePath('/admin/products')
    return { ok: true, newStock }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal menyesuaikan stok' }
  }
}
