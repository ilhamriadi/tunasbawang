import Link from 'next/link'
import { Search } from 'lucide-react'
import { listOrders } from '@/lib/data/orders'
import { PageHeader } from '@/components/admin/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/admin/pagination'
import { EmptyState } from '@/components/admin/empty-state'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/admin/status-badge'
import { ShoppingCart } from 'lucide-react'
import { formatRupiah, formatDateTime } from '@/lib/admin/format'
import { ORDER_STATUSES, PAYMENT_STATUSES, orderStatusLabels, paymentStatusLabels, type OrderStatus, type PaymentStatus } from '@/lib/constants'

export const metadata = { title: 'Pesanan' }

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const sp = await searchParams
  const page = Math.max(1, Number(sp.page) || 1)
  const q = sp.q ?? ''
  const status = sp.status ?? 'all'
  const payment = sp.payment ?? 'all'

  const result = await listOrders({
    search: q,
    status: status === 'all' ? 'all' : (status as OrderStatus),
    paymentStatus: payment === 'all' ? 'all' : (payment as PaymentStatus),
    page,
    pageSize: 15,
  })

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Pesanan" description={`${result.total} pesanan.`} />

      <form method="GET" action="/admin/orders" className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-52 flex-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" defaultValue={q} placeholder="Cari nomor, nama, atau telepon…" className="pl-8" />
        </div>
        <select name="status" defaultValue={status} className="h-8 rounded-md border border-border bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <option value="all">Semua status</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {orderStatusLabels[s]}
            </option>
          ))}
        </select>
        <select name="payment" defaultValue={payment} className="h-8 rounded-md border border-border bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <option value="all">Semua pembayaran</option>
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {paymentStatusLabels[s]}
            </option>
          ))}
        </select>
        <Button type="submit" variant="outline" size="sm">
          Terapkan
        </Button>
      </form>

      {result.data.length === 0 ? (
        <EmptyState icon={ShoppingCart} title="Tidak ada pesanan" description="Pesanan baru dari toko akan muncul di sini." />
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-3 py-2.5 font-medium">Nomor</th>
                <th className="px-3 py-2.5 font-medium">Pelanggan</th>
                <th className="px-3 py-2.5 font-medium">Tanggal</th>
                <th className="px-3 py-2.5 font-medium">Total</th>
                <th className="px-3 py-2.5 font-medium">Status</th>
                <th className="px-3 py-2.5 font-medium">Pembayaran</th>
                <th className="px-3 py-2.5 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {result.data.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="px-3 py-2.5 font-mono text-xs">{o.orderNumber}</td>
                  <td className="px-3 py-2.5">
                    <span className="block font-medium">{o.customerName ?? '—'}</span>
                    {o.customerPhone && <span className="block text-xs text-muted-foreground">{o.customerPhone}</span>}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">{formatDateTime(o.createdAt)}</td>
                  <td className="px-3 py-2.5 tabular-nums font-medium">{formatRupiah(o.total)}</td>
                  <td className="px-3 py-2.5">
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className="px-3 py-2.5">
                    <PaymentStatusBadge status={o.paymentStatus} />
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <Button variant="outline" size="sm" render={<Link href={`/admin/orders/${o.id}`} />}>
                      Detail
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={result.totalPages} basePath="/admin/orders" query={{ q, status, payment }} />
    </div>
  )
}
