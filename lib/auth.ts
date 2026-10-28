import 'server-only'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Role } from '@/lib/constants'

export type AuthUser = {
  id: string
  email: string | null
  role: Role | null
  fullName: string | null
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  return {
    id: user.id,
    email: user.email ?? null,
    role: (profile?.role as Role) ?? null,
    fullName: profile?.full_name ?? null,
  }
}

export function isStaffRole(role: Role | null): role is Role {
  return role === 'admin' || role === 'staff'
}

/** Require an authenticated staff/admin user; otherwise redirect to login. */
export async function requireStaff(): Promise<AuthUser> {
  const user = await getAuthUser()
  if (!user) redirect('/admin/login')
  if (!isStaffRole(user.role)) redirect('/admin/login?error=forbidden')
  return { ...user, role: user.role }
}

/** Require an authenticated admin user. */
export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireStaff()
  if (user.role !== 'admin') redirect('/admin')
  return { ...user, role: 'admin' }
}
