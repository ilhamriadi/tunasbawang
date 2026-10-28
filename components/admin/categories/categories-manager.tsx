'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Pencil, Plus, Trash2 } from 'lucide-react'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { categorySchema } from '@/lib/validators'
import { createCategoryAction, deleteCategoryAction, updateCategoryAction } from '@/lib/actions/categories'
import { slugify } from '@/lib/admin/format'
import { CATEGORY_TONES, categoryToneLabels } from '@/lib/constants'
import type { Category } from '@/lib/data/types'

type FormState = { name: string; slug: string; tagline: string; image: string; tone: string }

const empty: FormState = { name: '', slug: '', tagline: '', image: '', tone: 'primary' }

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState<FormState>(empty)
  const [pending, startTransition] = useTransition()

  function openCreate() {
    setEditing(null)
    setForm(empty)
    setOpen(true)
  }

  function openEdit(c: Category) {
    setEditing(c)
    setForm({ name: c.name, slug: c.slug, tagline: c.tagline ?? '', image: c.image ?? '', tone: c.tone })
    setOpen(true)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = categorySchema.safeParse(form)
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? 'Data tidak valid')
      return
    }
    startTransition(async () => {
      const res = editing
        ? await updateCategoryAction(editing.slug, parsed.data)
        : await createCategoryAction(parsed.data)
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      toast.success(editing ? 'Kategori diperbarui' : 'Kategori dibuat')
      setOpen(false)
      router.refresh()
    })
  }

  function remove(slug: string) {
    startTransition(async () => {
      const res = await deleteCategoryAction(slug)
      if (!res.ok) toast.error(res.error)
      else {
        toast.success('Kategori dihapus')
        router.refresh()
      }
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button onClick={openCreate} className="w-fit">
              <Plus />
              Tambah Kategori
            </Button>
          }
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Kategori' : 'Tambah Kategori'}</DialogTitle>
            <DialogDescription>Kategori menentukan pengelompokan produk di toko.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="cat-name">Nama</Label>
              <Input
                id="cat-name"
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value
                  setForm((f) => ({
                    ...f,
                    name,
                    slug: !f.slug || f.slug === slugify(editing?.name ?? '') ? slugify(name) : f.slug,
                  }))
                }}
                placeholder="Bawang Merah"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="cat-slug">Slug</Label>
              <Input id="cat-slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="cat-tagline">Tagline</Label>
              <Input id="cat-tagline" value={form.tagline} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))} placeholder="Segar langsung dari kebun" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="cat-image">URL gambar</Label>
              <Input id="cat-image" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="/images/produk/…" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Tone</Label>
              <Select value={form.tone} onValueChange={(v) => setForm((f) => ({ ...f, tone: v ?? 'primary' }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_TONES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {categoryToneLabels[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? 'Menyimpan…' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="px-3 py-2.5 font-medium">Nama</th>
              <th className="px-3 py-2.5 font-medium">Slug</th>
              <th className="px-3 py-2.5 font-medium">Tagline</th>
              <th className="px-3 py-2.5 font-medium">Produk</th>
              <th className="px-3 py-2.5 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.slug} className="border-t">
                <td className="px-3 py-2.5 font-medium">{c.name}</td>
                <td className="px-3 py-2.5 font-mono text-xs">{c.slug}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{c.tagline ?? '—'}</td>
                <td className="px-3 py-2.5 tabular-nums">{c.productCount}</td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => openEdit(c)}>
                      <Pencil />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <Button variant="ghost" size="icon-sm" disabled={c.productCount > 0}>
                            <Trash2 />
                          </Button>
                        }
                      />
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus kategori?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Kategori &ldquo;{c.name}&rdquo; akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => remove(c.slug)}>Hapus</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
