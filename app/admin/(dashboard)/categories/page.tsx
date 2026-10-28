import { listCategories } from '@/lib/data/categories'
import { PageHeader } from '@/components/admin/page-header'
import { CategoriesManager } from '@/components/admin/categories/categories-manager'

export const metadata = { title: 'Kategori' }

export default async function CategoriesPage() {
  const categories = await listCategories()
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Kategori" description={`${categories.length} kategori dalam katalog.`} />
      <CategoriesManager categories={categories} />
    </div>
  )
}
