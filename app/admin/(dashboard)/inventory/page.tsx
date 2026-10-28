import { Boxes, PackageCheck, TriangleAlert } from 'lucide-react'
import { listMovements, listStock } from '@/lib/data/inventory'
import { getStoreSettings } from '@/lib/data/settings'
import { PageHeader } from '@/components/admin/page-header'
import { StatCard } from '@/components/admin/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { StockBadge } from '@/components/admin/status-badge'
import { AdjustStockDialog } from '@/components/admin/inventory/adjust-stock-dialog'
import { formatNumber, formatDateTime } from '@/lib/admin/format'
import { inventoryTypeLabels, type InventoryType } from '@/lib/constants'

export const metadata = { title: 'Inventori' }

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const sp = await searchParams
  const q = sp.q ?? ''
  const filter = sp.filter ?? ''
  const settings = await getStoreSettings()
  const threshold = settings.lowStockThreshold

  const [stock, movements] = await Promise.all([
    listStock({ search: q, lowStockOnly: filter === 'low', outOfStockOnly: filter === 'out', threshold }),
    listMovements({ pageSize: 15 }),
  ])

  const lowCount = stock.filter((s) => s.stock > 0 && s.stock <= threshold).length
  const outCount = stock.filter((s) => s.stock === 0).length

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Inventori" description="Pantau dan sesuaikan stok produk." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total SKU" value={formatNumber(stock.length)} icon={Boxes} tone="info" />
        <StatCard label="Stok Menipis" value={formatNumber(lowCount)} icon={TriangleAlert} tone="warning" />
        <StatCard label="Stok Habis" value={formatNumber(outCount)} icon={PackageCheck} tone="danger" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <form method="GET" action="/admin/inventory" className="flex flex-1 flex-wrap items-center gap-2">
          <Input name="q" defaultValue={q} placeholder="Cari nama atau SKU…" className="min-w-52 flex-1" />
          <select name="filter" defaultValue={filter} className="h-8 rounded-md border border-border bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">Semua</option>
            <option value="low">Stok menipis</option>
            <option value="out">Stok habis</option>
          </select>
          <Button type="submit" variant="outline" size="sm">
            Terapkan
          </Button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="px-3 py-2.5 font-medium">Produk</th>
              <th className="px-3 py-2.5 font-medium">SKU</th>
              <th className="px-3 py-2.5 font-medium">Stok</th>
              <th className="px-3 py-2.5 font-medium">Status</th>
              <th className="px-3 py-2.5 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {stock.map((s) => (
              <tr key={s.slug} className="border-t">
                <td className="px-3 py-2.5 font-medium">{s.name}</td>
                <td className="px-3 py-2.5 font-mono text-xs">{s.sku}</td>
                <td className="px-3 py-2.5 tabular-nums">{formatNumber(s.stock)} {s.unit}</td>
                <td className="px-3 py-2.5">
                  <StockBadge stock={s.stock} threshold={threshold} />
                </td>
                <td className="px-3 py-2.5 text-right">
                  <AdjustStockDialog slug={s.slug} name={s.name} stock={s.stock} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat pergerakan stok</CardTitle>
        </CardHeader>
        <CardContent>
          {movements.data.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada pergerakan stok.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Produk</th>
                    <th className="pb-2 font-medium">Jenis</th>
                    <th className="pb-2 font-medium">Jumlah</th>
                    <th className="pb-2 font-medium">Alasan</th>
                    <th className="pb-2 font-medium">Oleh</th>
                    <th className="pb-2 font-medium">Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.data.map((m) => (
                    <tr key={m.id} className="border-b last:border-0">
                      <td className="py-2 pr-2">{m.productName}</td>
                      <td className="py-2 pr-2">
                        <span className={m.type === 'in' ? 'text-emerald-600' : m.type === 'out' ? 'text-red-600' : 'text-amber-600'}>
                          {inventoryTypeLabels[m.type as InventoryType]}
                        </span>
                      </td>
                      <td className="py-2 pr-2 tabular-nums">{formatNumber(m.quantity)}</td>
                      <td className="py-2 pr-2 text-muted-foreground">{m.reason}</td>
                      <td className="py-2 pr-2 text-muted-foreground">{m.createdByName ?? '—'}</td>
                      <td className="py-2 text-muted-foreground">{formatDateTime(m.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
