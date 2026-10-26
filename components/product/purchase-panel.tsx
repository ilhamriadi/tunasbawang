'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, MessageCircle, ShoppingCart, Zap } from 'lucide-react'
import { useCart } from '@/lib/cart'
import type { Product } from '@/lib/products'
import { formatRupiah, whatsappLink } from '@/lib/format'
import { QuantityStepper } from '@/components/cart/quantity-stepper'
import { cn } from '@/lib/utils'

type Feedback = { type: 'success' | 'error'; message: string } | null

export function PurchasePanel({ product }: { product: Product }) {
  const router = useRouter()
  const { addItem, maxQuantityFor } = useCart()
  const [option, setOption] = useState(product.options[0].label)
  const [quantity, setQuantity] = useState(1)
  const [feedback, setFeedback] = useState<Feedback>(null)

  const selected = product.options.find((o) => o.label === option) ?? product.options[0]
  const max = maxQuantityFor(product.slug, option)
  const soldOut = product.stock === 0
  const unavailable = max === 0
  const safeQty = Math.min(quantity, Math.max(1, max))
  const total = product.price * selected.multiplier * safeQty

  function handleAdd(goToCheckout: boolean) {
    const result = addItem(product.slug, option, safeQty)
    if (!result.ok) {
      setFeedback({ type: 'error', message: result.reason })
      return
    }
    if (goToCheckout) {
      router.push('/checkout')
      return
    }
    setFeedback({ type: 'success', message: `${safeQty} × ${option} ditambahkan ke keranjang.` })
    setQuantity(1)
  }

  return (
    <div className="flex flex-col gap-6">
      <fieldset disabled={soldOut}>
        <legend className="mb-3 text-sm font-bold tracking-wide uppercase">Pilih ukuran kemasan</legend>
        <div className="flex flex-wrap gap-3">
          {product.options.map((o) => {
            const active = o.label === option
            const optionMax = maxQuantityFor(product.slug, o.label)
            return (
              <label
                key={o.label}
                className={cn(
                  'relative flex cursor-pointer flex-col border-3 border-foreground px-4 py-2 transition-transform has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-foreground',
                  active ? 'bg-foreground text-background shadow-brutal-sm' : 'bg-card shadow-brutal hover:bg-accent',
                  optionMax === 0 && !active && 'cursor-not-allowed opacity-50',
                )}
              >
                <input
                  type="radio"
                  name="kemasan"
                  value={o.label}
                  checked={active}
                  onChange={() => {
                    setOption(o.label)
                    setQuantity(1)
                    setFeedback(null)
                  }}
                  className="sr-only"
                />
                <span className="font-bold">{o.label}</span>
                <span className={cn('text-xs', active ? 'text-background/80' : 'text-muted-foreground')}>
                  {formatRupiah(product.price * o.multiplier)}
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-end gap-6">
        <div>
          <p className="mb-3 text-sm font-bold tracking-wide uppercase" id="jumlah-label">
            Jumlah
          </p>
          <QuantityStepper
            value={safeQty}
            max={Math.max(1, max)}
            onChange={(q) => {
              setQuantity(q)
              setFeedback(null)
            }}
            label="Jumlah pembelian"
          />
        </div>
        <div className="pb-1">
          <p className="text-sm font-bold tracking-wide text-muted-foreground uppercase">Total</p>
          <p className="font-display text-3xl" aria-live="polite">
            {formatRupiah(total)}
          </p>
        </div>
      </div>

      {!soldOut && unavailable && (
        <p className="border-3 border-foreground bg-muted px-3 py-2 text-sm font-medium">
          Seluruh stok untuk pilihan ini sudah ada di keranjang Anda.
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => handleAdd(false)}
          disabled={unavailable}
          className="brutal-press flex flex-1 items-center justify-center gap-2 border-3 border-foreground bg-accent px-6 py-4 font-bold uppercase shadow-brutal disabled:pointer-events-none disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
        >
          <ShoppingCart className="size-5" strokeWidth={2.5} aria-hidden="true" />
          {soldOut ? 'Stok Habis' : 'Tambah ke Keranjang'}
        </button>
        <button
          type="button"
          onClick={() => handleAdd(true)}
          disabled={unavailable}
          className="brutal-press flex flex-1 items-center justify-center gap-2 border-3 border-foreground bg-primary px-6 py-4 font-bold text-primary-foreground uppercase shadow-brutal disabled:pointer-events-none disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
        >
          <Zap className="size-5" strokeWidth={2.5} aria-hidden="true" />
          Beli Sekarang
        </button>
      </div>

      <div aria-live="polite" className="min-h-0">
        {feedback && (
          <div
            className={cn(
              'flex flex-wrap items-center justify-between gap-3 border-3 border-foreground px-4 py-3 font-medium',
              feedback.type === 'success' ? 'bg-primary text-primary-foreground' : 'bg-destructive text-background',
            )}
          >
            <span className="flex items-center gap-2">
              {feedback.type === 'success' && <Check className="size-5" strokeWidth={3} aria-hidden="true" />}
              {feedback.message}
            </span>
            {feedback.type === 'success' && (
              <Link href="/checkout" className="font-bold uppercase underline underline-offset-4">
                Lihat keranjang
              </Link>
            )}
          </div>
        )}
      </div>

      <a
        href={whatsappLink(`Halo Tunas Bawang, saya ingin bertanya tentang ${product.name}.`)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 self-start text-sm font-bold underline underline-offset-4 hover:bg-accent"
      >
        <MessageCircle className="size-4" strokeWidth={2.5} aria-hidden="true" />
        Tanya dulu via WhatsApp
      </a>
    </div>
  )
}
