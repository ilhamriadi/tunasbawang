'use server'

import { revalidatePath } from 'next/cache'
import { requireStaff } from '@/lib/auth'
import { orderStatusSchema, paymentStatusSchema } from '@/lib/validators'
import { updateOrderStatus, updatePaymentStatus } from '@/lib/data/orders'
import { logActivity } from '@/lib/data/activity'
import { ORDER_TRANSITIONS, type OrderStatus } from '@/lib/constants'

export type ActionResult = { ok: true } | { ok: false; error: string }

export async function updateOrderStatusAction(id: string, input: unknown): Promise<ActionResult> {
  await requireStaff()
  const parsed = orderStatusSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Status tidak valid' }

  const status = parsed.data.status
  // Fetch current status to validate the transition server-side.
  const { getOrder } = await import('@/lib/data/orders')
  const order = await getOrder(id)
  if (!order) return { ok: false, error: 'Pesanan tidak ditemukan' }

  const allowed = ORDER_TRANSITIONS[order.status as OrderStatus] ?? []
  if (!allowed.includes(status)) {
    return { ok: false, error: `Transisi ${order.status} → ${status} tidak diizinkan` }
  }

  try {
    await updateOrderStatus(id, status)
    await logActivity('pesanan.status', 'order', id, { from: order.status, to: status })
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal memperbarui status' }
  }
  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${id}`)
  revalidatePath('/admin')
  return { ok: true }
}

/** Authorized manual payment verification. Never implied by fulfillment updates. */
export async function updatePaymentStatusAction(id: string, input: unknown): Promise<ActionResult> {
  await requireStaff()
  const parsed = paymentStatusSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Status pembayaran tidak valid' }
  try {
    await updatePaymentStatus(id, parsed.data.paymentStatus)
    await logActivity('pesanan.pembayaran', 'order', id, { paymentStatus: parsed.data.paymentStatus })
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal memperbarui status pembayaran' }
  }
  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${id}`)
  revalidatePath('/admin')
  return { ok: true }
}
