import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckoutView } from '@/components/checkout/checkout-view'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Selesaikan pesanan Anda di Tunas Bawang.',
  robots: { index: false },
}

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm font-medium">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="underline-offset-2 hover:underline">
              Beranda
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">Checkout</li>
        </ol>
      </nav>
      <h1 className="mb-8 border-b-3 border-foreground pb-6 font-display text-4xl uppercase md:text-6xl">Checkout</h1>
      <CheckoutView />
    </div>
  )
}
