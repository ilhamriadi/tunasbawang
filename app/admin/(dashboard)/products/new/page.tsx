import { listCategories } from '@/lib/data/categories'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { ProductForm } from '@/components/admin/products/product-form'

export const metadata = { title: 'Tambah Produk' }

export default async function NewProductPage() {
  const categories = await listCategories()
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Tambah Produk" description="Buat produk baru untuk katalog toko." />
      <Card>
        <CardContent>
          <ProductForm categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} />
        </CardContent>
      </Card>
    </div>
  )
}
