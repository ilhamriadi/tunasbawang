import type { Metadata } from 'next'
import Link from 'next/link'
import { SearchX } from 'lucide-react'
import { getCategory, isCategorySlug, isSortOption, queryProducts } from '@/lib/products'
import { ProductCard } from '@/components/product/product-card'
import { CategoryFilter, SortFilter, buildHref } from '@/components/product/product-filters'

type SearchParams = Promise<{ kategori?: string; q?: string; sort?: string }>

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { kategori } = await searchParams
  const category = isCategorySlug(kategori) ? getCategory(kategori) : undefined
  return {
    title: category ? category.name : 'Semua Produk',
    description: category
      ? `Belanja ${category.name.toLowerCase()} berkualitas dari Tunas Bawang, Enrekang.`
      : 'Bawang merah, bibit, pupuk, dan alat tani dari Tunas Bawang, Enrekang.',
  }
}

export default async function ProdukPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const kategori = isCategorySlug(params.kategori) ? params.kategori : undefined
  const sort = isSortOption(params.sort) ? params.sort : 'terbaru'
  const q = params.q?.trim().slice(0, 80) || undefined
  const state = { kategori, q, sort }

  const results = queryProducts({ category: kategori, q, sort })
  const category = kategori ? getCategory(kategori) : undefined

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
          <li>
            {category ? (
              <Link href="/produk" className="underline-offset-2 hover:underline">
                Produk
              </Link>
            ) : (
              <span aria-current="page">Produk</span>
            )}
          </li>
          {category && (
            <>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{category.name}</li>
            </>
          )}
        </ol>
      </nav>

      <header className="flex flex-col gap-2 border-b-3 border-foreground pb-6">
        <h1 className="font-display text-4xl leading-tight uppercase md:text-6xl">
          {category ? category.name : 'Semua Produk'}
        </h1>
        <p className="text-lg text-muted-foreground" aria-live="polite">
          {q ? (
            <>
              {`${results.length} hasil untuk `}
              <mark className="bg-accent px-1 font-bold text-foreground">{`“${q}”`}</mark>{' '}
              <Link href={buildHref(state, { q: undefined })} className="font-bold text-foreground underline">
                Hapus pencarian
              </Link>
            </>
          ) : (
            `${results.length} produk tersedia`
          )}
        </p>
      </header>

      <div className="flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between">
        <CategoryFilter state={state} />
        <SortFilter state={state} />
      </div>

      {results.length > 0 ? (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {results.map((p, i) => (
            <li key={p.slug}>
              <ProductCard product={p} priority={i < 4} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-4 border-3 border-dashed border-foreground bg-card px-6 py-16 text-center">
          <SearchX className="size-12" strokeWidth={2.5} aria-hidden="true" />
          <h2 className="font-display text-2xl uppercase">Produk tidak ditemukan</h2>
          <p className="max-w-md text-muted-foreground">
            Coba kata kunci lain seperti &quot;bibit&quot;, &quot;philip&quot;, atau &quot;sprayer&quot;.
          </p>
          <Link
            href="/produk"
            className="brutal-press border-3 border-foreground bg-accent px-5 py-2 font-bold uppercase shadow-brutal"
          >
            Lihat semua produk
          </Link>
        </div>
      )}
    </div>
  )
}
