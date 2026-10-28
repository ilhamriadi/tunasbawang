import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { listProducts } from '@/lib/data/products'
import { listCategories } from '@/lib/data/categories'
import { PageHeader } from '@/components/admin/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/admin/pagination'
import { EmptyState } from '@/components/admin/empty-state'
import { ProductsTable } from '@/components/admin/products/products-table'
import { Package } from 'lucide-react'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const sp = await searchParams
  const page = Math.max(1, Number(sp.page) || 1)
  const q = sp.q ?? ''
  const category = sp.category ?? ''
  const status = sp.status ?? 'all'

  const [result, categories] = await Promise.all([
    listProducts({
      search: q,
      category: category || undefined,
      status: status === 'all' ? 'all' : (status as 'active' | 'draft' | 'archived'),
      page,
      pageSize: 12,
    }),
    listCategories(),
  ])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Produk"
        description={`${result.total} produk dalam katalog.`}
        actions={
          <Button render={<Link href="/admin/products/new" />}>
            <Plus />
            Tambah Produk
          </Button>
        }
      />

      <form method="GET" action="/admin/products" className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-52 flex-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" defaultValue={q} placeholder="Cari nama, SKU, atau slug…" className="pl-8" />
        </div>
        <select
          name="category"
          defaultValue={category}
          className="h-8 rounded-md border border-border bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Semua kategori</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          name="status"
          defaultValue={status}
          className="h-8 rounded-md border border-border bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">Semua status</option>
          <option value="active">Aktif</option>
          <option value="draft">Draf</option>
          <option value="archived">Arsip</option>
        </select>
        <Button type="submit" variant="outline" size="sm">
          Terapkan
        </Button>
      </form>

      {result.data.length === 0 ? (
        <EmptyState icon={Package} title="Tidak ada produk" description="Sesuaikan filter atau tambahkan produk baru." />
      ) : (
        <ProductsTable products={result.data} />
      )}

      <Pagination page={page} totalPages={result.totalPages} basePath="/admin/products" query={{ q, category, status }} />
    </div>
  )
}
