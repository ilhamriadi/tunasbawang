import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getOrder } from '@/lib/data/orders'
import { PageHeader } from '@/components/admin/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/admin/status-badge'
import { OrderActions } from '@/components/admin/orders/order-actions'
import { formatRupiah, formatDateTime } from '@/lib/admin/format'

export const metadata = { title: 'Detail Pesanan' }

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await getOrder(id)
  if (!order) notFound()

  return (
    <div className="flex flex-col gap-6">
      <Button variant="ghost" size="sm" className="w-fit" render={<Link href="/admin/orders" />}>
        <ArrowLeft />
        Kembali ke daftar pesanan
      </Button>

      <PageHeader
        title={order.orderNumber}
        description={`Dibuat ${formatDateTime(order.createdAt)}`}
        actions={<OrderActions orderId={order.id} status={order.status} paymentStatus={order.paymentStatus} />}
      />

      <div className="flex flex-wrap items-center gap-2">
        <OrderStatusBadge status={order.status} />
        <PaymentStatusBadge status={order.paymentStatus} />
        <span className="text-sm text-muted-foreground">
          {order.shippingName ? `Pengiriman: ${order.shippingName}` : ''}
          {order.paymentName ? ` · Pembayaran: ${order.paymentName}` : ''}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Item pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Produk</th>
                    <th className="pb-2 font-medium">Varian</th>
                    <th className="pb-2 font-medium">Qty</th>
                    <th className="pb-2 font-medium">Harga satuan</th>
                    <th className="pb-2 text-right font-medium">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((it) => (
                    <tr key={it.id} className="border-b last:border-0">
                      <td className="py-2 pr-2">{it.productName}</td>
                      <td className="py-2 pr-2 text-muted-foreground">{it.optionLabel ?? '—'}</td>
                      <td className="py-2 pr-2 tabular-nums">{it.quantity}</td>
                      <td className="py-2 pr-2 tabular-nums">{formatRupiah(it.unitPrice)}</td>
                      <td className="py-2 text-right tabular-nums font-medium">{formatRupiah(it.lineTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <dl className="mt-4 flex flex-col gap-2 border-t pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="tabular-nums">{formatRupiah(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Ongkos kirim</dt>
                <dd className="tabular-nums">{formatRupiah(order.shippingCost)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Diskon</dt>
                <dd className="tabular-nums">{formatRupiah(order.discount)}</dd>
              </div>
              <div className="flex justify-between border-t pt-2 font-semibold">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatRupiah(order.total)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Pelanggan</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm">
              <p className="font-medium">{order.customerName ?? '—'}</p>
              {order.customerPhone && <p className="text-muted-foreground">{order.customerPhone}</p>}
              {order.customerAddress && (
                <p className="text-muted-foreground">
                  {order.customerAddress}
                  {order.customerCity ? `, ${order.customerCity}` : ''}
                  {order.customerPostalCode ? ` ${order.customerPostalCode}` : ''}
                </p>
              )}
              {order.note && <p className="mt-2 rounded-md bg-muted/50 p-2 text-xs">{order.note}</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
