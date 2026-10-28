import { Download } from 'lucide-react'
import {
  getBestSellers,
  getDashboardSummary,
  getRevenueSeries,
  getSalesByCategory,
} from '@/lib/data/reports'
import { PageHeader } from '@/components/admin/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { RevenueChart, OrdersBarChart } from '@/components/dashboard/charts'
import { formatRupiah, formatRupiahCompact, formatNumber } from '@/lib/admin/format'
import { EmptyState } from '@/components/admin/empty-state'
import { BarChart3 } from 'lucide-react'

export const metadata = { title: 'Laporan' }

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const sp = await searchParams
  const from = sp.from ?? ''
  const to = sp.to ?? ''

  // Default: last 30 days.
  const fromIso = from ? new Date(from).toISOString() : new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
  const toIso = to ? new Date(`${to}T23:59:59`).toISOString() : new Date().toISOString()

  const rangeDays = Math.max(1, Math.round((new Date(toIso).getTime() - new Date(fromIso).getTime()) / (24 * 3600 * 1000)))
  const granularity: 'day' | 'month' = rangeDays > 45 ? 'month' : 'day'

  const [summary, series, bestSellers, byCategory] = await Promise.all([
    getDashboardSummary(rangeDays),
    getRevenueSeries(rangeDays, granularity),
    getBestSellers(10),
    getSalesByCategory(),
  ])

  const exportHref = `/admin/reports/export${from || to ? `?from=${from}&to=${to}` : ''}`

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Laporan"
        description="Analitik dihitung dari data pesanan nyata."
        actions={
          <Button variant="outline" render={<a href={exportHref} download />}>
            <Download />
            Ekspor CSV
          </Button>
        }
      />

      <form method="GET" action="/admin/reports" className="flex flex-wrap items-end gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Dari</label>
          <Input type="date" name="from" defaultValue={from} className="w-40" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Sampai</label>
          <Input type="date" name="to" defaultValue={to} className="w-40" />
        </div>
        <Button type="submit" variant="outline" size="sm">
          Terapkan
        </Button>
      </form>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Total pendapatan (lunas)</CardDescription>
            <CardTitle className="text-2xl">{formatRupiah(summary.totalRevenue)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Pesanan masuk</CardDescription>
            <CardTitle className="text-2xl">{formatNumber(summary.ordersReceived)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Pesanan lunas</CardDescription>
            <CardTitle className="text-2xl">{formatNumber(summary.paidOrders)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pendapatan</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={series} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Volume pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <OrdersBarChart data={series} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Produk terlaris</CardTitle>
          </CardHeader>
          <CardContent>
            {bestSellers.length === 0 ? (
              <EmptyState icon={BarChart3} title="Belum ada data" />
            ) : (
              <ul className="flex flex-col gap-2">
                {bestSellers.map((p, i) => (
                  <li key={p.name} className="flex items-center gap-3 text-sm">
                    <span className="w-5 text-muted-foreground">{i + 1}.</span>
                    <span className="min-w-0 flex-1 truncate">{p.name}</span>
                    <span className="tabular-nums text-muted-foreground">{formatNumber(p.quantity)} unit</span>
                    <span className="w-24 text-right tabular-nums font-medium">{formatRupiahCompact(p.revenue)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Penjualan per kategori</CardTitle>
          </CardHeader>
          <CardContent>
            {byCategory.length === 0 ? (
              <EmptyState icon={BarChart3} title="Belum ada data" />
            ) : (
              <ul className="flex flex-col gap-3">
                {byCategory.map((c) => {
                  const max = Math.max(...byCategory.map((x) => x.revenue), 1)
                  return (
                    <li key={c.category} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{c.category}</span>
                        <span className="tabular-nums">{formatRupiah(c.revenue)}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${(c.revenue / max) * 100}%` }} />
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
