'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { categories } from '@/lib/products'

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="menu-seluler"
        className="flex size-11 items-center justify-center border-3 border-foreground bg-card shadow-brutal brutal-press"
      >
        {open ? <X className="size-5" strokeWidth={3} /> : <Menu className="size-5" strokeWidth={3} />}
        <span className="sr-only">{open ? 'Tutup menu' : 'Buka menu'}</span>
      </button>

      {open && (
        <nav
          id="menu-seluler"
          aria-label="Menu seluler"
          className="absolute inset-x-0 top-full border-b-3 border-foreground bg-background"
        >
          <ul className="flex flex-col">
            <li>
              <Link
                href="/produk"
                onClick={() => setOpen(false)}
                className="block border-b-3 border-foreground bg-accent px-4 py-3 font-display uppercase"
              >
                Semua Produk
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/produk?kategori=${c.slug}`}
                  onClick={() => setOpen(false)}
                  className="block border-b-3 border-foreground px-4 py-3 font-bold uppercase last:border-b-0 hover:bg-accent"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}
