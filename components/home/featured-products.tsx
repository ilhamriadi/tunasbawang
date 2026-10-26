import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getFeaturedProducts } from '@/lib/products'
import { ProductCard } from '@/components/product/product-card'
import { SectionHeading } from './section-heading'

export function FeaturedProducts() {
  const featured = getFeaturedProducts().slice(0, 8)

  return (
    <section aria-labelledby="unggulan-judul" className="border-y-3 border-foreground bg-muted">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeading
          id="unggulan-judul"
          eyebrow="Pilihan petani"
          title="Produk unggulan"
          action={
            <Link
              href="/produk"
              className="brutal-press inline-flex items-center gap-2 border-3 border-foreground bg-card px-4 py-2 font-bold uppercase shadow-brutal"
            >
              Lihat semua
              <ArrowRight className="size-4" strokeWidth={3} aria-hidden="true" />
            </Link>
          }
        />
        <ul className="mt-8 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {featured.map((p) => (
            <li key={p.slug}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
