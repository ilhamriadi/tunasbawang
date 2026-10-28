import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { StoreSettings } from '@/lib/data/types'
import { LOW_STOCK_DEFAULT } from '@/lib/constants'
import type { SettingsInput } from '@/lib/validators'

const DEFAULTS: StoreSettings = {
  storeName: 'Tunas Bawang',
  email: 'halo@tunasbawang.id',
  whatsapp: '6285117829731',
  address: 'Jl. Poros Enrekang–Toraja, Kec. Anggeraja, Kab. Enrekang, Sulawesi Selatan',
  lowStockThreshold: LOW_STOCK_DEFAULT,
  currency: 'IDR',
  timezone: 'Asia/Jakarta',
}

export async function getStoreSettings(): Promise<StoreSettings> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('settings').select('key, value')
  if (error) throw error

  const map = new Map<string, unknown>()
  for (const row of data ?? []) {
    const v = row.value
    map.set(row.key, typeof v === 'object' && v !== null && 'v' in v ? (v as { v: unknown }).v : v)
  }

  const str = (key: string, fallback: string) => {
    const v = map.get(key)
    return typeof v === 'string' && v ? v : fallback
  }
  const num = (key: string, fallback: number) => {
    const v = map.get(key)
    return typeof v === 'number' ? v : fallback
  }

  return {
    storeName: str('store_name', DEFAULTS.storeName),
    email: str('email', DEFAULTS.email),
    whatsapp: str('whatsapp', DEFAULTS.whatsapp),
    address: str('address', DEFAULTS.address),
    lowStockThreshold: num('low_stock_threshold', DEFAULTS.lowStockThreshold),
    currency: str('currency', DEFAULTS.currency),
    timezone: str('timezone', DEFAULTS.timezone),
  }
}

export async function saveStoreSettings(input: SettingsInput) {
  const supabase = await createClient()
  const rows = [
    { key: 'store_name', value: input.storeName },
    { key: 'email', value: input.email ?? '' },
    { key: 'whatsapp', value: input.whatsapp ?? '' },
    { key: 'address', value: input.address ?? '' },
    { key: 'low_stock_threshold', value: input.lowStockThreshold },
    { key: 'currency', value: input.currency },
    { key: 'timezone', value: input.timezone },
  ]
  const { error } = await supabase.from('settings').upsert(rows, { onConflict: 'key' })
  if (error) throw error
}
