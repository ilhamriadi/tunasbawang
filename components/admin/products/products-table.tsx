'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Archive, Pencil, Trash2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { ProductStatusBadge, StockBadge } from '@/components/admin/status-badge'
import { formatRupiah } from '@/lib/admin/format'
import { setProductsStatusAction } from '@/lib/actions/products'
import type { Product } from '@/lib/data/types'
import type { ProductStatus } from '@/lib/constants'

export function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>([])
  const [pending, startTransition] = useTransition()

  function toggle(slug: string) {
    setSelected((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]))
  }

  function toggleAll() {
    setSelected((prev) => (prev.length === products.length ? [] : products.map((p) => p.slug)))
  }

  function applyStatus(status: ProductStatus) {
    startTransition(async () => {
      const res = await setProductsStatusAction(selected, status)
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      toast.success('Status produk diperbarui')
      setSelected([])
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2">
          <span className="text-sm text-muted-foreground">{selected.length} produk dipilih</span>
          <div className="ml-auto flex items-center gap-1.5">
            <Button size="sm" variant="outline" onClick={() => applyStatus('active')} disabled={pending}>
              Terbitkan
            </Button>
            <Button size="sm" variant="outline" onClick={() => applyStatus('draft')} disabled={pending}>
              Jadikan draf
            </Button>
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button size="sm" variant="destructive" disabled={pending}>
                    <Archive />
                    Arsipkan
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Arsipkan {selected.length} produk?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Produk yang diarsipkan tidak tampil di toko, tetapi riwayat pesanan tetap tersimpan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={() => applyStatus('archived')}>Arsipkan</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button size="sm" variant="ghost" onClick={() => setSelected([])}>
              Batal
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="w-10 px-3 py-2.5">
                <Checkbox checked={selected.length === products.length && products.length > 0} onCheckedChange={toggleAll} />
              </th>
              <th className="px-3 py-2.5 font-medium">Produk</th>
              <th className="px-3 py-2.5 font-medium">SKU</th>
              <th className="px-3 py-2.5 font-medium">Kategori</th>
              <th className="px-3 py-2.5 font-medium">Harga</th>
              <th className="px-3 py-2.5 font-medium">Stok</th>
              <th className="px-3 py-2.5 font-medium">Status</th>
              <th className="px-3 py-2.5 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.slug} className="border-t">
                <td className="px-3 py-2.5">
                  <Checkbox checked={selected.includes(p.slug)} onCheckedChange={() => toggle(p.slug)} />
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt="" className="size-9 rounded-md border object-cover" />
                    ) : (
                      <span className="flex size-9 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">—</span>
                    )}
                    <div className="min-w-0">
                      <Link href={`/admin/products/${p.slug}`} className="block truncate font-medium hover:underline">
                        {p.name}
                      </Link>
                      <span className="block truncate text-xs text-muted-foreground">{p.slug}</span>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5 font-mono text-xs">{p.sku}</td>
                <td className="px-3 py-2.5">{p.categoryName ?? p.category}</td>
                <td className="px-3 py-2.5 tabular-nums">{formatRupiah(p.price)}</td>
                <td className="px-3 py-2.5">
                  <div className="flex flex-col gap-1">
                    <span className="tabular-nums">{p.stock}</span>
                    <StockBadge stock={p.stock} />
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <ProductStatusBadge status={p.status} />
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon-sm" render={<Link href={`/admin/products/${p.slug}`} />}>
                      <Pencil />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <Button variant="ghost" size="icon-sm">
                            <Archive />
                          </Button>
                        }
                      />
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Arsipkan produk?</AlertDialogTitle>
                          <AlertDialogDescription>
                            {p.name} tidak akan tampil di toko. Riwayat pesanan tetap tersimpan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              startTransition(async () => {
                                const res = await setProductsStatusAction([p.slug], 'archived')
                                if (!res.ok) toast.error(res.error)
                                else {
                                  toast.success('Produk diarsipkan')
                                  router.refresh()
                                }
                              })
                            }
                          >
                            Arsipkan
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
