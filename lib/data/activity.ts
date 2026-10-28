import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Json } from '@/lib/database.types'

export async function logActivity(
  action: string,
  entityType?: string,
  entityId?: string,
  detail?: Json,
) {
  const supabase = await createClient()
  const { error } = await supabase.from('admin_activity_log').insert({
    action,
    entity_type: entityType ?? null,
    entity_id: entityId ?? null,
    detail: detail ?? null,
  })
  // Activity logging must never break the underlying operation.
  if (error) console.error('logActivity failed:', error.message)
}

export async function listActivity(limit = 20) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('admin_activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error

  const rows = (data ?? []) as Array<{
    id: string
    actor_id: string | null
    action: string
    entity_type: string | null
    entity_id: string | null
    detail: Json | null
    created_at: string
  }>

  const actorIds = [...new Set(rows.map((r) => r.actor_id).filter(Boolean))] as string[]
  const nameById = new Map<string, string>()
  if (actorIds.length) {
    const supabase2 = await createClient()
    const { data: profiles } = await supabase2.from('profiles').select('id, full_name').in('id', actorIds)
    for (const p of profiles ?? []) {
      if (p.full_name) nameById.set(p.id, p.full_name)
    }
  }

  return rows.map((r) => ({
    id: r.id,
    actorName: (r.actor_id && nameById.get(r.actor_id)) || null,
    action: r.action,
    entityType: r.entity_type,
    entityId: r.entity_id,
    detail: r.detail,
    createdAt: r.created_at,
  }))
}
