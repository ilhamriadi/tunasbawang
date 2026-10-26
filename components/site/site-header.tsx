import Link from 'next/link'
import { CartButton } from '@/components/cart/cart-button'
import { Logo } from './logo'
import { SearchForm } from './search-form'
import { MobileNav } from './mobile-nav'
import { categories } from '@/lib/products'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-3 border-foreground bg-background">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:gap-6">
        <Logo />

        <div className="hidden flex-1 md:block">
          <SearchForm />
        </div>

        <nav aria-label="Navigasi utama" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            <li>
              <Link href="/produk" className="px-3 py-2 font-bold uppercase hover:bg-accent">
                Semua Produk
              </Link>
            </li>
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <CartButton />
          <MobileNav />
        </div>
      </div>

      <div className="border-t-3 border-foreground px-4 py-2 md:hidden">
        <SearchForm />
      </div>

      <nav aria-label="Kategori" className="hidden border-t-3 border-foreground bg-card lg:block">
        <ul className="mx-auto flex max-w-7xl items-stretch px-4">
          {categories.map((c) => (
            <li key={c.slug} className="border-r-3 border-foreground first:border-l-3">
              <Link
                href={`/produk?kategori=${c.slug}`}
                className="block px-5 py-2 text-sm font-bold uppercase hover:bg-accent"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
