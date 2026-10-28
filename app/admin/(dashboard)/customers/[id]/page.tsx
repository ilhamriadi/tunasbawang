import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getCustomer, listCustomerOrders } from '@/lib/data/customers'
import { PageHeader } from '@/components/admin/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/admin/status-badge'
import { formatRupiah, formatDate, formatDateTime } from '@/lib/admin/format'
import type { OrderStatus, PaymentStatus } from '@/lib/constants'

export const metadata = { title: 'Profil Pelanggan' }

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const customer = await getCustomer(id)
  if (!customer) notFound()
  const orders = await listCustomerOrders(id)

  return (
    <div className="flex flex-col gap-6">
      <Button variant="ghost" size="sm" className="w-fit" render={<Link href="/admin/customers" />}>
        <ArrowLeft />
        Kembali
      </Button>

      <PageHeader title={customer.name} description={`Pelanggan sejak ${formatDate(customer.createdAt)}`} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Informasi</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Telepon</span>
              <span>{customer.phone ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span>{customer.email ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kota</span>
              <span>{customer.city ?? '—'}</span>
            </div>
            <div className="flex flex-col gap-1 border-t pt-2">
              <span className="text-muted-foreground">Alamat</span>
              <span>{customer.address ?? '—'}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-muted-foreground">Total pesanan</span>
              <span className="font-medium">{customer.orderCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total belanja</span>
              <span className="font-medium tabular-nums">{formatRupiah(customer.totalSpent)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Riwayat pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada pesanan.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-muted-foreground">
                      <th className="pb-2 font-medium">Nomor</th>
                      <th className="pb-2 font-medium">Tanggal</th>
                      <th className="pb-2 font-medium">Total</th>
                      <th className="pb-2 font-medium">Status</th>
                      <th className="pb-2 font-medium">Bayar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className="border-b last:border-0">
                        <td className="py-2 pr-2 font-mono text-xs">
                          <Link href={`/admin/orders/${o.id}`} className="hover:underline">
                            {o.order_number}
                          </Link>
                        </td>
                        <td className="py-2 pr-2 text-muted-foreground">{formatDateTime(o.created_at)}</td>
                        <td className="py-2 pr-2 tabular-nums">{formatRupiah(o.total)}</td>
                        <td className="py-2 pr-2">
                          <OrderStatusBadge status={o.status as OrderStatus} />
                        </td>
                        <td className="py-2">
                          <PaymentStatusBadge status={o.payment_status as PaymentStatus} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
