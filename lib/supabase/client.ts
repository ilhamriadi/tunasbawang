import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'

function getEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !anonKey) {
    throw new Error(
      'Supabase belum dikonfigurasi: atur NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local',
    )
  }
  return { url, anonKey }
}

/**
 * Browser-side Supabase client (anon/publishable key only — never the service
 * role). Uses @supabase/ssr's cookie-backed client so the session is visible
 * to the server middleware after sign-in.
 */
let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClient() {
  if (browserClient) return browserClient
  const { url, anonKey } = getEnv()
  browserClient = createBrowserClient<Database>(url, anonKey)
  return browserClient
}
