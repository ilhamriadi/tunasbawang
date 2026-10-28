'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const checkoutItemSchema = z.object({
  slug: z.string().min(1),
  option: z.string().min(1),
  quantity: z.number().int().positive(),
})

const checkoutSchema = z.object({
  order_number: z.string().min(3),
  customer: z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    address: z.string(),
    city: z.string(),
    postalCode: z.string(),
    note: z.string(),
  }),
  items: z.array(checkoutItemSchema).min(1),
  subtotal: z.number().int().min(0),
  shippingCost: z.number().int().min(0),
  total: z.number().int().min(0),
  shippingName: z.string(),
  paymentName: z.string(),
})

export type CheckoutResult =
  | { ok: true; orderId: string; orderNumber: string }
  | { ok: false; error: string }

/**
 * Public guest checkout. Calls the security-definer place_order() RPC, which
 * validates the payload, decrements stock atomically, and records inventory
 * movements. Public callers cannot write arbitrary rows directly (RLS).
 */
export async function placeOrderAction(input: unknown): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: 'Data pesanan tidak valid.' }
  }
  const payload = parsed.data

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('place_order', { payload })
    if (error) {
      // Surface the RPC's raised exception (e.g. "Stok ... tidak mencukupi").
      return { ok: false, error: error.message }
    }
    return { ok: true, orderId: data as string, orderNumber: payload.order_number }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal membuat pesanan.' }
  }
}
