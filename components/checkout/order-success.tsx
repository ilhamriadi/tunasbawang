import Link from 'next/link'
import { CheckCircle2, MessageCircle } from 'lucide-react'
import { formatRupiah, whatsappLink } from '@/lib/format'
import type { CustomerDetails } from './checkout-form'

export type PlacedOrder = {
  number: string
  createdAt: string
  customer: CustomerDetails
  lines: { name: string; option: string; quantity: number; total: number }[]
  shipping: { name: string; cost: number }
  payment: string
  subtotal: number
  total: number
}

const dateFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'full', timeStyle: 'short' })

function buildWhatsappMessage(order: PlacedOrder) {
  const items = order.lines
    .map((l) => `- ${l.name} (${l.option}) x${l.quantity} = ${formatRupiah(l.total)}`)
    .join('\n')
  return [
    `Halo Tunas Bawang, saya ingin konfirmasi pesanan *${order.number}*`,
    '',
    items,
    '',
    `Subtotal: ${formatRupiah(order.subtotal)}`,
    `Ongkir (${order.shipping.name}): ${order.shipping.cost === 0 ? 'Gratis' : formatRupiah(order.shipping.cost)}`,
    `*Total: ${formatRupiah(order.total)}*`,
    `Pembayaran: ${order.payment}`,
    '',
    `Penerima: ${order.customer.name} (${order.customer.phone})`,
    `Alamat: ${order.customer.address}, ${order.customer.city} ${order.customer.postalCode}`,
    order.customer.note ? `Catatan: ${order.customer.note}` : '',
  ]
    .filter((line, i, arr) => line !== '' || arr[i - 1] !== '')
    .join('\n')
}

export function OrderSuccess({ order }: { order: PlacedOrder }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col items-center gap-3 border-3 border-foreground bg-primary px-6 py-10 text-center text-primary-foreground shadow-brutal-lg">
        <CheckCircle2 className="size-14" strokeWidth={2.5} aria-hidden="true" />
        <h2 className="font-display text-3xl uppercase md:text-4xl">Pesanan Dibuat!</h2>
        <p className="max-w-md text-primary-foreground/90">
          Kirim konfirmasi via WhatsApp agar kami bisa segera memproses dan mengirim detail pembayaran.
        </p>
        <p className="mt-2 border-3 border-foreground bg-accent px-4 py-1 font-display text-lg text-accent-foreground">
          {order.number}
        </p>
      </div>

      <section aria-labelledby="detail-pesanan" className="border-3 border-foreground bg-card shadow-brutal">
        <h3 id="detail-pesanan" className="border-b-3 border-foreground px-4 py-3 font-display uppercase">
          Detail Pesanan
        </h3>
        <ul className="divide-y-3 divide-foreground border-b-3 border-foreground">
          {order.lines.map((l) => (
            <li key={`${l.name}-${l.option}`} className="flex justify-between gap-4 px-4 py-3 text-sm">
              <span>
                <span className="font-bold">{l.name}</span>
                <span className="block text-muted-foreground">{`${l.option} × ${l.quantity}`}</span>
              </span>
              <span className="font-bold">{formatRupiah(l.total)}</span>
            </li>
          ))}
        </ul>
        <dl className="grid gap-2 p-4 text-sm sm:grid-cols-[10rem_1fr]">
          <dt className="font-bold">Tanggal</dt>
          <dd>{dateFormatter.format(new Date(order.createdAt))}</dd>
          <dt className="font-bold">Penerima</dt>
          <dd>{`${order.customer.name} · ${order.customer.phone}`}</dd>
          <dt className="font-bold">Alamat</dt>
          <dd>{`${order.customer.address}, ${order.customer.city} ${order.customer.postalCode}`}</dd>
          <dt className="font-bold">Pengiriman</dt>
          <dd>{`${order.shipping.name} — ${order.shipping.cost === 0 ? 'Gratis' : formatRupiah(order.shipping.cost)}`}</dd>
          <dt className="font-bold">Pembayaran</dt>
          <dd>{order.payment}</dd>
          <dt className="font-display uppercase">Total</dt>
          <dd className="font-display text-xl text-primary">{formatRupiah(order.total)}</dd>
        </dl>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href={whatsappLink(buildWhatsappMessage(order))}
          target="_blank"
          rel="noopener noreferrer"
          className="brutal-press flex flex-1 items-center justify-center gap-2 border-3 border-foreground bg-primary px-6 py-4 font-bold text-primary-foreground uppercase shadow-brutal"
        >
          <MessageCircle className="size-5" strokeWidth={2.5} aria-hidden="true" />
          Konfirmasi via WhatsApp
        </a>
        <Link
          href="/produk"
          className="brutal-press flex flex-1 items-center justify-center border-3 border-foreground bg-card px-6 py-4 font-bold uppercase shadow-brutal"
        >
          Lanjut Belanja
        </Link>
      </div>
    </div>
  )
}
