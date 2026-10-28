import { Truck } from 'lucide-react'
import type { ResolvedCartLine } from '@/lib/cart'
import { FREE_SHIPPING_MIN } from '@/lib/checkout'
import { formatRupiah } from '@/lib/format'

export function OrderSummary({
  lines,
  subtotal,
  shippingName,
  shippingCost,
  total,
  submitting = false,
}: {
  lines: ResolvedCartLine[]
  subtotal: number
  shippingName: string
  shippingCost: number
  total: number
  submitting?: boolean
}) {
  const remainingForFree = FREE_SHIPPING_MIN - subtotal
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_MIN) * 100)
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0)

  return (
    <aside aria-labelledby="ringkasan-pesanan" className="lg:sticky lg:top-40 lg:self-start">
      <div className="border-3 border-foreground bg-card shadow-brutal-lg">
        <h2
          id="ringkasan-pesanan"
          className="border-b-3 border-foreground bg-foreground px-4 py-3 font-display text-background uppercase"
        >
          Ringkasan Pesanan
        </h2>

        <div className="border-b-3 border-foreground bg-muted p-4">
          <p className="flex items-center gap-2 text-sm font-bold">
            <Truck className="size-4" strokeWidth={2.5} aria-hidden="true" />
            {remainingForFree > 0
              ? `Belanja ${formatRupiah(remainingForFree)} lagi untuk gratis ongkir reguler`
              : 'Selamat! Anda dapat gratis ongkir reguler'}
          </p>
          <div className="mt-2 h-3 border-2 border-foreground bg-card" aria-hidden="true">
            <div className="h-full bg-primary transition-[width]" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <dl className="flex flex-col gap-3 p-4">
          <div className="flex justify-between gap-4">
            <dt>{`Subtotal (${itemCount} barang)`}</dt>
            <dd className="font-bold">{formatRupiah(subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>
              Ongkir
              <span className="block text-sm text-muted-foreground">{shippingName}</span>
            </dt>
            <dd className="font-bold">{shippingCost === 0 ? 'Gratis' : formatRupiah(shippingCost)}</dd>
          </div>
          <div className="flex items-end justify-between gap-4 border-t-3 border-foreground pt-3">
            <dt className="font-display uppercase">Total</dt>
            <dd className="font-display text-2xl text-primary" aria-live="polite">
              {formatRupiah(total)}
            </dd>
          </div>
        </dl>

        <div className="border-t-3 border-foreground p-4">
          <button
            type="submit"
            form="checkout-form"
            disabled={submitting}
            className="brutal-press w-full border-3 border-foreground bg-primary px-6 py-4 font-display text-lg text-primary-foreground uppercase shadow-brutal disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Memproses…' : 'Buat Pesanan'}
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Dengan membuat pesanan, Anda menyetujui syarat & ketentuan Tunas Bawang.
          </p>
        </div>
      </div>
    </aside>
  )
}
