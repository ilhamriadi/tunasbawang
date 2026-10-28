'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StatusBadge } from '@/components/admin/status-badge'
import { createUserAction, setUserBannedAction, setUserRoleAction } from '@/lib/actions/users'
import { roleLabels, type Role } from '@/lib/constants'
import { formatDate } from '@/lib/admin/format'
import type { AdminProfile } from '@/lib/data/types'

export function UsersManager({ users }: { users: AdminProfile[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<Role>('staff')
  const [tempPassword, setTempPassword] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function create(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const res = await createUserAction({ email, fullName, role })
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      setTempPassword(res.tempPassword ?? null)
      setEmail('')
      setFullName('')
      setRole('staff')
      router.refresh()
    })
  }

  function changeRole(id: string, next: Role) {
    startTransition(async () => {
      const res = await setUserRoleAction(id, next)
      if (!res.ok) toast.error(res.error)
      else {
        toast.success('Peran diperbarui')
        router.refresh()
      }
    })
  }

  function toggleBan(id: string, banned: boolean) {
    startTransition(async () => {
      const res = await setUserBannedAction(id, banned)
      if (!res.ok) toast.error(res.error)
      else {
        toast.success(banned ? 'Akun dinonaktifkan' : 'Akun diaktifkan')
        router.refresh()
      }
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button className="w-fit">
              <Plus />
              Tambah Pengguna
            </Button>
          }
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah pengguna</DialogTitle>
            <DialogDescription>Buat akun admin/staf baru. Kata sandi sementara ditampilkan sekali.</DialogDescription>
          </DialogHeader>
          {tempPassword ? (
            <div className="flex flex-col gap-3">
              <div className="rounded-lg border border-amber-600/30 bg-amber-500/10 p-3 text-sm">
                <p className="font-medium">Akun dibuat. Kata sandi sementara:</p>
                <p className="mt-1 font-mono text-lg select-all">{tempPassword}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Bagikan ke pengguna — mereka harus mengganti kata sandi setelah masuk.
                </p>
              </div>
              <DialogFooter>
                <Button onClick={() => { setTempPassword(null); setOpen(false) }}>Selesai</Button>
              </DialogFooter>
            </div>
          ) : (
            <form onSubmit={create} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="u-name">Nama lengkap</Label>
                <Input id="u-name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nama admin" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="u-email">Email</Label>
                <Input id="u-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@tunasbawang.id" required />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Peran</Label>
                <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="staff">Staf</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={pending || !email}>
                  {pending ? 'Membuat…' : 'Buat akun'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="px-3 py-2.5 font-medium">Nama</th>
              <th className="px-3 py-2.5 font-medium">Email</th>
              <th className="px-3 py-2.5 font-medium">Peran</th>
              <th className="px-3 py-2.5 font-medium">Dibuat</th>
              <th className="px-3 py-2.5 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-3 py-2.5 font-medium">{u.fullName ?? '—'}</td>
                <td className="px-3 py-2.5">{u.email ?? '—'}</td>
                <td className="px-3 py-2.5">
                  {u.role === 'admin' ? (
                    <StatusBadge tone="brand">
                      <ShieldCheck className="size-3" />
                      {roleLabels.admin}
                    </StatusBadge>
                  ) : (
                    <StatusBadge tone="neutral">{roleLabels.staff}</StatusBadge>
                  )}
                </td>
                <td className="px-3 py-2.5 text-muted-foreground">{formatDate(u.createdAt)}</td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center justify-end gap-1.5">
                    <Select value={u.role} onValueChange={(v) => changeRole(u.id, v as Role)}>
                      <SelectTrigger className="h-7 w-28 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="staff">Staf</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="outline" onClick={() => toggleBan(u.id, true)}>
                      Nonaktifkan
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
