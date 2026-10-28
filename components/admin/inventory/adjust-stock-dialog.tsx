'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { PackageMinus, PackagePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { adjustStockAction } from '@/lib/actions/inventory'

export function AdjustStockDialog({
  slug,
  name,
  stock,
}: {
  slug: string
  name: string
  stock: number
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [direction, setDirection] = useState<'in' | 'out'>('in')
  const [quantity, setQuantity] = useState('')
  const [reason, setReason] = useState('')
  const [reference, setReference] = useState('')
  const [pending, startTransition] = useTransition()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const qty = Number(quantity)
    if (!Number.isInteger(qty) || qty <= 0) {
      toast.error('Jumlah harus bilangan bulat positif')
      return
    }
    startTransition(async () => {
      const res = await adjustStockAction({
        slug,
        delta: direction === 'in' ? qty : -qty,
        reason,
        reference,
      })
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      toast.success(`Stok diperbarui → ${res.newStock}`)
      setOpen(false)
      setQuantity('')
      setReason('')
      setReference('')
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            Sesuaikan
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sesuaikan stok</DialogTitle>
          <DialogDescription>
            {name} · stok saat ini {stock}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={direction === 'in' ? 'default' : 'outline'}
              onClick={() => setDirection('in')}
            >
              <PackagePlus />
              Stok masuk
            </Button>
            <Button
              type="button"
              variant={direction === 'out' ? 'default' : 'outline'}
              onClick={() => setDirection('out')}
            >
              <PackageMinus />
              Stok keluar
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="qty">Jumlah</Label>
            <Input id="qty" type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="reason">Alasan (wajib)</Label>
            <Input id="reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Mis. barang masuk dari pemasok" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ref">Referensi (opsional)</Label>
            <Input id="ref" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="No. nota / pesanan" />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={pending || !reason.trim() || !quantity}>
              {pending ? 'Menyimpan…' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
