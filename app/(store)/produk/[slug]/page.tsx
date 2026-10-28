import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PackageCheck, ShieldCheck, Star, Truck } from 'lucide-react'
import { getStorefrontCategories, getStorefrontProducts } from '@/lib/data/storefront'
import { formatCompact, formatRupiah } from '@/lib/format'
import { FREE_SHIPPING_MIN } from '@/lib/checkout'
import { PurchasePanel } from '@/components/product/purchase-panel'
import { ProductCard } from '@/components/product/product-card'
import { StockIndicator } from '@/components/product/stock-indicator'

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const products = await getStorefrontProducts()
  const product = products.find((p) => p.slug === slug)
  if (!product) return { title: 'Produk tidak ditemukan' }
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: [product.image] },
  }
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params
  const [products, categories] = await Promise.all([
    getStorefrontProducts(),
    getStorefrontCategories(),
  ])
  const product = products.find((p) => p.slug === slug)
  if (!product) notFound()

  const category = categories.find((c) => c.slug === product.category)
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4)

  const specs = [
    { label: 'Kategori', value: category?.name ?? '-' },
    { label: 'Satuan harga', value: `per ${product.unit}` },
    { label: 'Pilihan kemasan', value: product.options.map((o) => o.label).join(', ') },
    { label: 'Asal', value: 'Enrekang, Sulawesi Selatan' },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm font-medium">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="underline-offset-2 hover:underline">
              Beranda
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/produk?kategori=${product.category}`} className="underline-offset-2 hover:underline">
              {category?.name}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-muted-foreground">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="relative lg:sticky lg:top-40 lg:self-start">
          <div className="relative aspect-square overflow-hidden border-3 border-foreground bg-muted shadow-brutal-lg">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className={product.stock === 0 ? 'object-cover grayscale' : 'object-cover'}
            />
            {product.badge && product.stock > 0 && (
              <span className="absolute top-4 left-4 -rotate-3 border-3 border-foreground bg-accent px-3 py-1 font-display text-lg uppercase shadow-brutal-sm">
                {product.badge}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Link
              href={`/produk?kategori=${product.category}`}
              className="self-start border-3 border-foreground bg-card px-2 py-0.5 text-xs font-bold tracking-wide uppercase hover:bg-accent"
            >
              {category?.name}
            </Link>
            <h1 className="text-balance font-display text-4xl leading-tight uppercase md:text-5xl">{product.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium">
              <span className="flex items-center gap-1">
                <Star className="size-4 fill-accent text-foreground" aria-hidden="true" />
                <span className="font-bold">{product.rating.toFixed(1)}</span>
                <span className="sr-only">dari 5 bintang</span>
              </span>
              <span className="text-muted-foreground">{`${formatCompact(product.sold)} terjual`}</span>
            </div>
          </div>

          <p className="border-y-3 border-foreground py-4">
            <span className="font-display text-4xl text-primary">{formatRupiah(product.price)}</span>
            <span className="text-lg font-medium text-muted-foreground">{` / ${product.unit}`}</span>
          </p>

          <StockIndicator stock={product.stock} unit={product.unit} />

          <p className="text-pretty text-lg leading-relaxed">{product.description}</p>

          <PurchasePanel product={product} />

          <ul className="grid gap-3 sm:grid-cols-3">
            <li className="flex items-start gap-2 border-3 border-foreground bg-card p-3 text-sm">
              <Truck className="mt-0.5 size-5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
              <span>
                <strong className="block">Gratis ongkir</strong>
                {`Min. belanja ${formatRupiah(FREE_SHIPPING_MIN)}`}
              </span>
            </li>
            <li className="flex items-start gap-2 border-3 border-foreground bg-card p-3 text-sm">
              <PackageCheck className="mt-0.5 size-5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
              <span>
                <strong className="block">Dikemas rapi</strong>
                Karung jaring & kardus berventilasi
              </span>
            </li>
            <li className="flex items-start gap-2 border-3 border-foreground bg-card p-3 text-sm">
              <ShieldCheck className="mt-0.5 size-5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
              <span>
                <strong className="block">Garansi segar</strong>
                Ganti baru jika rusak saat tiba
              </span>
            </li>
          </ul>

          <section aria-labelledby="spesifikasi" className="border-3 border-foreground bg-card">
            <h2 id="spesifikasi" className="border-b-3 border-foreground bg-foreground px-4 py-2 font-display text-background uppercase">
              Spesifikasi
            </h2>
            <dl className="divide-y-3 divide-foreground">
              {specs.map((s) => (
                <div key={s.label} className="grid grid-cols-[9rem_1fr] gap-2 px-4 py-2 text-sm">
                  <dt className="font-bold">{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="produk-terkait" className="mt-20">
          <h2 id="produk-terkait" className="mb-6 border-b-3 border-foreground pb-4 font-display text-3xl uppercase md:text-4xl">
            Produk Terkait
          </h2>
          <ul className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
