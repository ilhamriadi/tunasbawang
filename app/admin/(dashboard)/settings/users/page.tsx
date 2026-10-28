import { requireAdmin } from '@/lib/auth'
import { listUsers } from '@/lib/data/users'
import { PageHeader } from '@/components/admin/page-header'
import { UsersManager } from '@/components/admin/settings/users-manager'

export const metadata = { title: 'Pengguna & Peran' }

export default async function UsersPage() {
  await requireAdmin()
  const users = await listUsers()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Pengguna & Peran"
        description="Kelola akun administrator. Hanya admin yang dapat mengakses halaman ini."
      />
      <UsersManager users={users} />
    </div>
  )
}
