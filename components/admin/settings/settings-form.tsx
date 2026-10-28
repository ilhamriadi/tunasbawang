'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { saveSettingsAction } from '@/lib/actions/settings'
import type { StoreSettings } from '@/lib/data/types'

export function SettingsForm({ settings }: { settings: StoreSettings }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [form, setForm] = useState(settings)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const res = await saveSettingsAction(form)
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      toast.success('Pengaturan disimpan')
      router.refresh()
    })
  }

  const set = <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  return (
    <form onSubmit={submit} className="flex max-w-2xl flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="storeName">Nama toko</Label>
          <Input id="storeName" value={form.storeName} onChange={(e) => set('storeName', e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input id="whatsapp" value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} placeholder="6285xxxxxxx" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="lowStockThreshold">Ambang stok menipis</Label>
          <Input
            id="lowStockThreshold"
            type="number"
            min="1"
            value={form.lowStockThreshold}
            onChange={(e) => set('lowStockThreshold', Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="currency">Mata uang</Label>
          <Input id="currency" value={form.currency} onChange={(e) => set('currency', e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="timezone">Zona waktu</Label>
          <Input id="timezone" value={form.timezone} onChange={(e) => set('timezone', e.target.value)} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="address">Alamat</Label>
        <Textarea id="address" rows={2} value={form.address} onChange={(e) => set('address', e.target.value)} />
      </div>
      <div>
        <Button type="submit" disabled={pending}>
          <Save />
          {pending ? 'Menyimpan…' : 'Simpan pengaturan'}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Pengaturan ini non-rahasia dan tersimpan di tabel settings. Kunci API/secret tidak pernah disimpan di sini.
      </p>
    </form>
  )
}
