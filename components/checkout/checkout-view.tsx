'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBasket } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { paymentMethods, shippingCost, shippingMethods, type PaymentId, type ShippingId } from '@/lib/checkout'
import { CartItem } from '@/components/cart/cart-item'
import { CheckoutForm, type CustomerDetails } from './checkout-form'
import { OrderSummary } from './order-summary'
import { OrderSuccess, type PlacedOrder } from './order-success'
import { placeOrderAction } from '@/lib/actions/checkout'

function createOrderNumber() {
  const now = new Date()
  const ymd = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `TB-${ymd}-${rand}`
}

export function CheckoutView() {
  const { lines, subtotal, clear } = useCart()
  const [shippingId, setShippingId] = useState<ShippingId>('reguler')
  const [paymentId, setPaymentId] = useState<PaymentId>('transfer')
  const [placed, setPlaced] = useState<PlacedOrder | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const shipping = shippingMethods.find((m) => m.id === shippingId) ?? shippingMethods[0]
  const payment = paymentMethods.find((m) => m.id === paymentId) ?? paymentMethods[0]
  const ongkir = shippingCost(shipping, subtotal)
  const total = subtotal + ongkir

  if (placed) return <OrderSuccess order={placed} />

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 border-3 border-dashed border-foreground bg-card px-6 py-16 text-center">
        <ShoppingBasket className="size-14" strokeWidth={2.5} aria-hidden="true" />
        <h2 className="font-display text-2xl uppercase">Keranjang masih kosong</h2>
        <p className="max-w-md text-muted-foreground">
          Pilih bawang merah segar, bibit unggul, atau perlengkapan tani untuk mulai belanja.
        </p>
        <Link
          href="/produk"
          className="brutal-press border-3 border-foreground bg-accent px-6 py-3 font-bold uppercase shadow-brutal"
        >
          Belanja Sekarang
        </Link>
      </div>
    )
  }

  async function handleSubmit(customer: CustomerDetails) {
    setSubmitting(true)
    setSubmitError(null)
    const orderNumber = createOrderNumber()
    const res = await placeOrderAction({
      order_number: orderNumber,
      customer,
      items: lines.map((l) => ({ slug: l.slug, option: l.option, quantity: l.quantity })),
      subtotal,
      shipping_cost: ongkir,
      total,
      shipping_name: shipping.name,
      payment_name: payment.name,
    })
    setSubmitting(false)
    if (!res.ok) {
      setSubmitError(res.error)
      return
    }
    setPlaced({
      number: res.orderNumber,
      createdAt: new Date().toISOString(),
      customer,
      lines: lines.map((l) => ({
        name: l.product.name,
        option: l.option,
        quantity: l.quantity,
        total: l.lineTotal,
      })),
      shipping: { name: shipping.name, cost: ongkir },
      payment: payment.name,
      subtotal,
      total,
    })
    clear()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:gap-10">
      <div className="flex flex-col gap-8">
        {submitError && (
          <div className="border-3 border-foreground bg-destructive/10 px-4 py-3 text-sm font-bold text-destructive">
            {submitError}
          </div>
        )}
        <section aria-labelledby="ringkasan-barang" className="border-3 border-foreground bg-card shadow-brutal">
          <h2
            id="ringkasan-barang"
            className="flex items-center justify-between border-b-3 border-foreground bg-accent px-4 py-3 font-display uppercase"
          >
            <span>
              <span className="mr-2 inline-flex size-7 items-center justify-center bg-foreground text-background">1</span>
              Barang Belanjaan
            </span>
            <Link href="/produk" className="font-sans text-sm font-bold normal-case underline underline-offset-4">
              + Tambah barang
            </Link>
          </h2>
          <ul>
            {lines.map((line) => (
              <CartItem key={`${line.slug}-${line.option}`} line={line} />
            ))}
          </ul>
        </section>

        <CheckoutForm
          shippingId={shippingId}
          onShippingChange={setShippingId}
          paymentId={paymentId}
          onPaymentChange={setPaymentId}
          subtotal={subtotal}
          onSubmit={handleSubmit}
        />
      </div>

      <OrderSummary
        lines={lines}
        subtotal={subtotal}
        shippingName={shipping.name}
        shippingCost={ongkir}
        total={total}
        submitting={submitting}
      />
    </div>
  )
}
