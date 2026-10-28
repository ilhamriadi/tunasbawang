import type { Metadata } from 'next'
import Link from 'next/link'
import { SearchX } from 'lucide-react'
import { getStorefrontCategories, getStorefrontProducts } from '@/lib/data/storefront'
import type { CategorySlug, Product, SortOption } from '@/lib/products'
import { ProductCard } from '@/components/product/product-card'
import { CategoryFilter, SortFilter, buildHref } from '@/components/product/product-filters'

type SearchParams = Promise<{ kategori?: string; q?: string; sort?: string }>

const SORT_KEYS: SortOption[] = ['terbaru', 'terlaris', 'termurah', 'termahal']

function sortProducts(list: Product[], sort: SortOption): Product[] {
  const copy = [...list]
  switch (sort) {
    case 'terlaris':
      return copy.sort((a, b) => b.sold - a.sold)
    case 'termurah':
      return copy.sort((a, b) => a.price - b.price)
    case 'termahal':
      return copy.sort((a, b) => b.price - a.price)
    default:
      return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { kategori } = await searchParams
  const categories = await getStorefrontCategories()
  const category = categories.find((c) => c.slug === kategori)
  return {
    title: category ? category.name : 'Semua Produk',
    description: category
      ? `Belanja ${category.name.toLowerCase()} berkualitas dari Tunas Bawang, Enrekang.`
      : 'Bawang merah, bibit, pupuk, dan alat tani dari Tunas Bawang, Enrekang.',
  }
}

export default async function ProdukPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const [categories, products] = await Promise.all([
    getStorefrontCategories(),
    getStorefrontProducts(),
  ])

  const kategori = categories.some((c) => c.slug === params.kategori)
    ? (params.kategori as CategorySlug)
    : undefined
  const sort = SORT_KEYS.includes(params.sort as SortOption)
    ? (params.sort as SortOption)
    : 'terbaru'
  const q = params.q?.trim().slice(0, 80) || undefined

  let results = products
  if (kategori) results = results.filter((p) => p.category === kategori)
  if (q) {
    const term = q.toLowerCase()
    results = results.filter((p) => {
      const catName = categories.find((c) => c.slug === p.category)?.name ?? ''
      return `${p.name} ${p.description} ${catName}`.toLowerCase().includes(term)
    })
  }
  results = sortProducts(results, sort)

  const category = kategori ? categories.find((c) => c.slug === kategori) : undefined
  const state = { kategori, q, sort }

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
        <CategoryFilter state={state} categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} />
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
