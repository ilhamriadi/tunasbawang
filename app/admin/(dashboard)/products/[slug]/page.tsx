import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/data/products'
import { listCategories } from '@/lib/data/categories'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { ProductForm } from '@/components/admin/products/product-form'

export const metadata = { title: 'Edit Produk' }

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [product, categories] = await Promise.all([getProduct(slug), listCategories()])
  if (!product) notFound()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={product.name} description={`Edit produk · ${product.sku}`} />
      <Card>
        <CardContent>
          <ProductForm categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} product={product} />
        </CardContent>
      </Card>
    </div>
  )
}
