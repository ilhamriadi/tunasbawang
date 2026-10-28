import Link from 'next/link'
import {
  Banknote,
  Boxes,
  Clock,
  Package,
  ShoppingCart,
  TriangleAlert,
  Users,
} from 'lucide-react'
import {
  getBestSellers,
  getDashboardSummary,
  getOrderStatusDistribution,
  getRecentOrders,
  getRevenueSeries,
} from '@/lib/data/reports'
import { listActivity } from '@/lib/data/activity'
import { StatCard } from '@/components/admin/stat-card'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  OrderStatusChart,
  RevenueChart,
  type StatusSlice,
} from '@/components/dashboard/charts'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/admin/status-badge'
import { EmptyState } from '@/components/admin/empty-state'
import { formatRupiah, formatRupiahCompact, formatDateTime } from '@/lib/admin/format'
import type { OrderStatus, PaymentStatus } from '@/lib/constants'

const RANGES = [
  { value: '7', label: '7 hari' },
  { value: '30', label: '30 hari' },
  { value: '90', label: '90 hari' },
]

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>
}) {
  const { range } = await searchParams
  const rangeDays = range === '7' ? 7 : range === '90' ? 90 : 30
  const granularity: 'day' | 'month' = rangeDays === 90 ? 'month' : 'day'

  const [summary, series, statusDist, bestSellers, recentOrders, recentActivity] = await Promise.all([
    getDashboardSummary(rangeDays),
    getRevenueSeries(rangeDays, granularity),
    getOrderStatusDistribution(),
    getBestSellers(5),
    getRecentOrders(6),
    listActivity(6),
  ])

  const statusSlices: StatusSlice[] = statusDist.map((s) => ({ status: s.status, count: s.count }))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Ringkasan performa toko dari data nyata."
        actions={
          <div className="flex items-center gap-1 rounded-lg border bg-card p-0.5">
            {RANGES.map((r) => (
              <Link
                key={r.value}
                href={r.value === '30' ? '/admin' : `/admin?range=${r.value}`}
                className={
                  r.value === String(rangeDays)
                    ? 'rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground'
                    : 'rounded-md px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted'
                }
              >
                {r.label}
              </Link>
            ))}
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Pendapatan" value={formatRupiah(summary.totalRevenue)} icon={Banknote} tone="default" hint={`${summary.paidOrders} pesanan lunas`} />
        <StatCard label="Pesanan Masuk" value={String(summary.ordersReceived)} icon={ShoppingCart} tone="info" />
        <StatCard label="Menunggu Proses" value={String(summary.awaitingProcessing)} icon={Clock} tone="warning" />
        <StatCard label="Produk Aktif" value={String(summary.productCount)} icon={Package} tone="success" />
        <StatCard label="Stok Menipis" value={String(summary.lowStockCount)} icon={TriangleAlert} tone="danger" />
        <StatCard label="Pelanggan" value={String(summary.customerCount)} icon={Users} tone="neutral" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pendapatan</CardTitle>
            <CardDescription>Pendapatan dari pesanan lunas (tidak termasuk dibatalkan/refund).</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart data={series} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Status Pesanan</CardTitle>
            <CardDescription>Distribusi seluruh pesanan.</CardDescription>
          </CardHeader>
          <CardContent>
            <OrderStatusChart data={statusSlices} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Produk Terlaris</CardTitle>
            <CardDescription>Berdasarkan jumlah terjual.</CardDescription>
          </CardHeader>
          <CardContent>
            {bestSellers.length === 0 ? (
              <EmptyState icon={Boxes} title="Belum ada penjualan" />
            ) : (
              <ul className="flex flex-col gap-3">
                {bestSellers.map((p, i) => (
                  <li key={p.name} className="flex items-center gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.quantity} unit terjual</p>
                    </div>
                    <span className="text-sm font-medium tabular-nums">{formatRupiahCompact(p.revenue)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Pesanan Terbaru</CardTitle>
              <CardDescription>6 pesanan terakhir.</CardDescription>
            </div>
            <Link href="/admin/orders" className="text-sm font-medium text-primary hover:underline">
              Lihat semua
            </Link>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <EmptyState icon={ShoppingCart} title="Belum ada pesanan" description="Pesanan baru akan muncul di sini." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-muted-foreground">
                      <th className="pb-2 font-medium">Nomor</th>
                      <th className="pb-2 font-medium">Pelanggan</th>
                      <th className="pb-2 font-medium">Total</th>
                      <th className="pb-2 font-medium">Status</th>
                      <th className="pb-2 font-medium">Bayar</th>
                      <th className="pb-2 font-medium">Waktu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((o) => (
                      <tr key={o.id} className="border-b last:border-0">
                        <td className="py-2 pr-2 font-mono text-xs">
                          <Link href={`/admin/orders/${o.id}`} className="hover:underline">
                            {o.order_number}
                          </Link>
                        </td>
                        <td className="py-2 pr-2">{o.customer_name ?? '—'}</td>
                        <td className="py-2 pr-2 tabular-nums">{formatRupiah(o.total)}</td>
                        <td className="py-2 pr-2">
                          <OrderStatusBadge status={o.status as OrderStatus} />
                        </td>
                        <td className="py-2 pr-2">
                          <PaymentStatusBadge status={o.payment_status as PaymentStatus} />
                        </td>
                        <td className="py-2 text-muted-foreground">{formatDateTime(o.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
          <CardDescription>Jejak audit perubahan admin.</CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <EmptyState icon={Clock} title="Belum ada aktivitas" />
          ) : (
            <ul className="flex flex-col divide-y">
              {recentActivity.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <span className="truncate">
                    <span className="font-medium">{a.action}</span>
                    {a.actorName && <span className="text-muted-foreground"> · {a.actorName}</span>}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatDateTime(a.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
