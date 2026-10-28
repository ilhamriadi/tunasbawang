'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { createStaffUser, setUserBanned, setUserRole } from '@/lib/data/users'
import { logActivity } from '@/lib/data/activity'
import type { Role } from '@/lib/constants'

export type ActionResult =
  | { ok: true; tempPassword?: string }
  | { ok: false; error: string }

export async function createUserAction(input: {
  email: string
  fullName: string
  role: Role
}): Promise<ActionResult> {
  await requireAdmin()
  const email = input.email?.trim().toLowerCase()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Email tidak valid' }
  }
  if (input.role !== 'admin' && input.role !== 'staff') {
    return { ok: false, error: 'Peran tidak valid' }
  }
  try {
    const res = await createStaffUser(email, input.fullName?.trim() || email, input.role)
    await logActivity('pengguna.dibuat', 'user', res.id, { email, role: input.role })
    revalidatePath('/admin/settings/users')
    return { ok: true, tempPassword: res.tempPassword }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal membuat pengguna' }
  }
}

export async function setUserRoleAction(id: string, role: Role): Promise<ActionResult> {
  await requireAdmin()
  if (role !== 'admin' && role !== 'staff') return { ok: false, error: 'Peran tidak valid' }
  try {
    await setUserRole(id, role)
    await logActivity('pengguna.peran', 'user', id, { role })
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal mengubah peran' }
  }
  revalidatePath('/admin/settings/users')
  return { ok: true }
}

export async function setUserBannedAction(id: string, banned: boolean): Promise<ActionResult> {
  await requireAdmin()
  try {
    await setUserBanned(id, banned)
    await logActivity(banned ? 'pengguna.dinonaktifkan' : 'pengguna.diaktifkan', 'user', id)
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Gagal mengubah status akun' }
  }
  revalidatePath('/admin/settings/users')
  return { ok: true }
}
