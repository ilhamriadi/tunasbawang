'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { useCart, type ResolvedCartLine } from '@/lib/cart'
import { formatRupiah } from '@/lib/format'
import { QuantityStepper } from './quantity-stepper'

export function CartItem({ line }: { line: ResolvedCartLine }) {
  const { setQuantity, removeItem, maxQuantityFor } = useCart()
  const { product, option, quantity } = line

  return (
    <li className="flex gap-3 border-b-3 border-foreground p-4 last:border-b-0 sm:gap-4">
      <Link
        href={`/produk/${product.slug}`}
        className="relative size-20 shrink-0 overflow-hidden border-3 border-foreground bg-muted sm:size-24"
      >
        <Image src={product.image} alt={product.name} fill sizes="96px" className="object-cover" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={`/produk/${product.slug}`} className="font-bold leading-snug hover:underline">
              {product.name}
            </Link>
            <p className="text-sm text-muted-foreground">
              <span className="mr-2 inline-block border-2 border-foreground bg-accent px-1.5 text-xs font-bold text-foreground">
                {option}
              </span>
              {`${formatRupiah(line.unitPrice)} / pilihan`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeItem(product.slug, option)}
            className="flex size-9 shrink-0 items-center justify-center border-3 border-foreground bg-card hover:bg-destructive hover:text-background"
            aria-label={`Hapus ${product.name} (${option})`}
          >
            <Trash2 className="size-4" strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          <QuantityStepper
            size="sm"
            value={quantity}
            max={maxQuantityFor(product.slug, option)}
            onChange={(q) => setQuantity(product.slug, option, q)}
            label={`Jumlah ${product.name}`}
          />
          <p className="font-display text-lg">{formatRupiah(line.lineTotal)}</p>
        </div>
      </div>
    </li>
  )
}
