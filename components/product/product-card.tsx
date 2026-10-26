import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import type { Product } from '@/lib/products'
import { getCategory } from '@/lib/products'
import { formatCompact, formatRupiah } from '@/lib/format'
import { cn } from '@/lib/utils'

const badgeStyles: Record<NonNullable<Product['badge']>, string> = {
  Terlaris: 'bg-accent text-accent-foreground',
  Baru: 'bg-primary text-primary-foreground',
  Promo: 'bg-destructive text-background',
}

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const category = getCategory(product.category)
  const soldOut = product.stock === 0

  return (
    <article className="group relative flex h-full flex-col border-3 border-foreground bg-card shadow-brutal transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg">
      <div className="relative aspect-square overflow-hidden border-b-3 border-foreground bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className={cn('object-cover transition-transform duration-300 group-hover:scale-105', soldOut && 'grayscale')}
        />
        {product.badge && !soldOut && (
          <span
            className={cn(
              'absolute top-2 left-2 border-3 border-foreground px-2 py-0.5 text-xs font-bold uppercase',
              badgeStyles[product.badge],
            )}
          >
            {product.badge}
          </span>
        )}
        {soldOut && (
          <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 -rotate-6 border-y-3 border-foreground bg-foreground py-1 text-center font-display text-background uppercase">
            Stok Habis
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <p className="text-xs font-bold tracking-wide text-muted-foreground uppercase">{category?.name}</p>
        <h3 className="text-balance font-bold leading-snug">
          <Link href={`/produk/${product.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center gap-1 text-xs font-medium">
          <Star className="size-3.5 fill-accent text-foreground" aria-hidden="true" />
          <span>{product.rating.toFixed(1)}</span>
          <span className="text-muted-foreground">{`· ${formatCompact(product.sold)} terjual`}</span>
        </div>
        <p className="mt-auto pt-1">
          <span className="font-display text-lg">{formatRupiah(product.price)}</span>
          <span className="text-sm font-medium text-muted-foreground">{` / ${product.unit}`}</span>
        </p>
      </div>
    </article>
  )
}
