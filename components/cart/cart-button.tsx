'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart'

export function CartButton() {
  const { count } = useCart()

  return (
    <Link
      href="/checkout"
      className="brutal-press relative flex size-11 items-center justify-center border-3 border-foreground bg-primary text-primary-foreground shadow-brutal"
    >
      <ShoppingCart className="size-5" strokeWidth={2.5} aria-hidden="true" />
      <span className="sr-only">{`Keranjang belanja, ${count} barang`}</span>
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-2.5 -right-2.5 flex min-w-6 items-center justify-center border-3 border-foreground bg-accent px-1 text-xs font-bold text-accent-foreground"
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  )
}
