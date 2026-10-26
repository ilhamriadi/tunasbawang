import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { categories, countByCategory, type Category } from '@/lib/products'
import { cn } from '@/lib/utils'
import { SectionHeading } from './section-heading'

const toneStyles: Record<Category['tone'], string> = {
  primary: 'bg-primary text-primary-foreground',
  accent: 'bg-accent text-accent-foreground',
  card: 'bg-card text-card-foreground',
  foreground: 'bg-foreground text-background',
}

export function CategoryGrid() {
  return (
    <section aria-labelledby="kategori-judul" className="mx-auto max-w-7xl px-4 py-14">
      <SectionHeading id="kategori-judul" eyebrow="Kategori" title="Mau belanja apa hari ini?" />
      <ul className="mt-8 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
        {categories.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/produk?kategori=${c.slug}`}
              className={cn(
                'brutal-press flex h-full flex-col border-3 border-foreground shadow-brutal',
                toneStyles[c.tone],
              )}
            >
              <div className="relative aspect-[4/3] border-b-3 border-foreground bg-muted">
                <Image src={c.image} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
              </div>
              <div className="flex flex-1 items-end justify-between gap-2 p-3 md:p-4">
                <div>
                  <h3 className="font-display text-lg leading-tight uppercase md:text-2xl">{c.name}</h3>
                  <p className="mt-1 hidden text-sm font-medium opacity-80 sm:block">{c.tagline}</p>
                  <p className="mt-1 text-xs font-bold uppercase">{`${countByCategory(c.slug)} produk`}</p>
                </div>
                <ArrowUpRight className="size-6 shrink-0" strokeWidth={3} aria-hidden="true" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
