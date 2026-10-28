import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { AdminProfile } from '@/lib/data/types'
import type { Role } from '@/lib/constants'

export async function listUsers(): Promise<AdminProfile[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, created_at')
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []).map((p) => ({
    id: p.id,
    email: p.email,
    fullName: p.full_name,
    role: p.role as Role,
    createdAt: p.created_at,
  }))
}

/** Create a staff/admin account and return a one-time temp password. */
export async function createStaffUser(email: string, fullName: string, role: Role) {
  const admin = createAdminClient()
  const tempPassword = crypto.randomUUID().slice(0, 16)

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name: fullName || email },
  })
  if (error) throw new Error(error.message)

  const userId = data.user.id
  const { error: roleError } = await admin.from('profiles').update({ role }).eq('id', userId)
  if (roleError) throw new Error(roleError.message)

  return { id: userId, email, tempPassword }
}

export async function setUserRole(id: string, role: Role) {
  const supabase = await createClient()
  const { error } = await supabase.from('profiles').update({ role }).eq('id', id)
  if (error) throw error
}

export async function setUserBanned(id: string, banned: boolean) {
  const admin = createAdminClient()
  const { error } = await admin.auth.admin.updateUserById(id, {
    ban_duration: banned ? '876000h' : 'none',
  })
  if (error) throw new Error(error.message)
}
