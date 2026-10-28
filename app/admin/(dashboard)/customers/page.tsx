import Link from 'next/link'
import { Search, Users } from 'lucide-react'
import { listCustomers } from '@/lib/data/customers'
import { PageHeader } from '@/components/admin/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/admin/pagination'
import { EmptyState } from '@/components/admin/empty-state'
import { formatRupiah, formatDate } from '@/lib/admin/format'

export const metadata = { title: 'Pelanggan' }

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const sp = await searchParams
  const page = Math.max(1, Number(sp.page) || 1)
  const q = sp.q ?? ''

  const result = await listCustomers(q, page, 15)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Pelanggan" description={`${result.total} pelanggan.`} />

      <form method="GET" action="/admin/customers" className="flex items-center gap-2">
        <div className="relative min-w-52 flex-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" defaultValue={q} placeholder="Cari nama, telepon, atau email…" className="pl-8" />
        </div>
        <Button type="submit" variant="outline" size="sm">
          Cari
        </Button>
      </form>

      {result.data.length === 0 ? (
        <EmptyState icon={Users} title="Tidak ada pelanggan" description="Pelanggan baru dari pesanan akan muncul di sini." />
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-3 py-2.5 font-medium">Nama</th>
                <th className="px-3 py-2.5 font-medium">Kontak</th>
                <th className="px-3 py-2.5 font-medium">Kota</th>
                <th className="px-3 py-2.5 font-medium">Pesanan</th>
                <th className="px-3 py-2.5 font-medium">Total belanja</th>
                <th className="px-3 py-2.5 font-medium">Bergabung</th>
                <th className="px-3 py-2.5 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {result.data.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="px-3 py-2.5 font-medium">{c.name}</td>
                  <td className="px-3 py-2.5">
                    <span className="block">{c.phone ?? '—'}</span>
                    {c.email && <span className="block text-xs text-muted-foreground">{c.email}</span>}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">{c.city ?? '—'}</td>
                  <td className="px-3 py-2.5 tabular-nums">{c.orderCount}</td>
                  <td className="px-3 py-2.5 tabular-nums">{formatRupiah(c.totalSpent)}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{formatDate(c.createdAt)}</td>
                  <td className="px-3 py-2.5 text-right">
                    <Button variant="outline" size="sm" render={<Link href={`/admin/customers/${c.id}`} />}>
                      Detail
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={result.totalPages} basePath="/admin/customers" query={{ q }} />
    </div>
  )
}
