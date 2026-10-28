import 'server-only'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

/**
 * Privileged client (service-role key). NEVER import this into a Client
 * Component, Route that runs in the browser, or any `NEXT_PUBLIC_`-exposed
 * module. Use only in server actions / route handlers that already verified
 * the caller is an authorized administrator.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY tidak diatur. Variabel ini hanya boleh ada di server (Vercel Environment Variables), bukan NEXT_PUBLIC_.',
    )
  }
  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
