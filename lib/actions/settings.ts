'use server'

import { revalidatePath } from 'next/cache'
import { requireStaff } from '@/lib/auth'
import { settingsSchema } from '@/lib/validators'
import { saveStoreSettings } from '@/lib/data/settings'
import { logActivity } from '@/lib/data/activity'

export type ActionResult = { ok: true } | { ok: false; error: string }

export async function saveSettingsAction(input: unknown): Promise<ActionResult> {
  await requireStaff()
  const parsed = settingsSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Data tidak valid' }
  }
  try {
    await saveStoreSettings(parsed.data)
    await logActivity('pengaturan.diubah', 'settings', 'store')
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal menyimpan pengaturan' }
  }
  revalidatePath('/admin/settings')
  return { ok: true }
}
