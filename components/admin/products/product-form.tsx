'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Plus, Save, Trash2 } from 'lucide-react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { productSchema } from '@/lib/validators'
import { createProductAction, updateProductAction } from '@/lib/actions/products'
import { slugify } from '@/lib/admin/format'
import {
  BADGE_OPTIONS,
  PRODUCT_STATUSES,
  UNITS,
  productStatusLabels,
} from '@/lib/constants'
import type { Product } from '@/lib/data/types'

type CategoryOption = { slug: string; name: string }

type FormValues = z.infer<typeof productSchema>

function toFormValues(p: Product | null): FormValues {
  return {
    name: p?.name ?? '',
    slug: p?.slug ?? '',
    sku: p?.sku ?? '',
    category: p?.category ?? '',
    price: p?.price ?? 0,
    salePrice: p?.salePrice ?? null,
    unit: p?.unit ?? 'kg',
    image: p?.image ?? '',
    description: p?.description ?? '',
    stock: p?.stock ?? 0,
    options: p?.options?.length ? p.options : [{ label: '1', multiplier: 1 }],
    badge: (p?.badge ?? null) as FormValues['badge'],
    rating: p?.rating ?? 0,
    featured: p?.featured ?? false,
    status: p?.status ?? 'active',
  }
}

export function ProductForm({
  categories,
  product,
}: {
  categories: CategoryOption[]
  product?: Product | null
}) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const isEdit = Boolean(product)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: toFormValues(product ?? null),
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'options' })
  const name = watch('name')
  const slug = watch('slug')

  function onNameChange(value: string) {
    setValue('name', value)
    if (!slug || slug === slugify(product?.name ?? '')) {
      setValue('slug', slugify(value))
    }
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    const payload = {
      ...values,
      salePrice: values.salePrice ?? null,
      badge: values.badge ?? null,
      image: values.image ?? '',
      description: values.description ?? '',
    }
    const res = isEdit
      ? await updateProductAction(product!.slug, payload)
      : await createProductAction(payload)
    setSubmitting(false)

    if (!res.ok) {
      toast.error(res.error)
      return
    }
    toast.success(isEdit ? 'Produk diperbarui' : 'Produk dibuat')
    router.push('/admin/products')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Nama produk</Label>
          <Input id="name" {...register('name', { onChange: (e) => onNameChange(e.target.value) })} placeholder="Bawang Merah Super Philip" />
          {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register('slug')} placeholder="bawang-merah-super-philip" />
          {errors.slug && <p className="text-xs text-red-600">{errors.slug.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" {...register('sku')} placeholder="TB-BM-001" />
          {errors.sku && <p className="text-xs text-red-600">{errors.sku.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Kategori</Label>
          <Select value={watch('category')} onValueChange={(v) => setValue('category', v ?? '')}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-xs text-red-600">{errors.category.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="price">Harga (Rp)</Label>
          <Input id="price" type="number" {...register('price', { valueAsNumber: true })} />
          {errors.price && <p className="text-xs text-red-600">{errors.price.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="salePrice">Harga promo (Rp, opsional)</Label>
          <Input
            id="salePrice"
            type="number"
            value={watch('salePrice') ?? ''}
            onChange={(e) => setValue('salePrice', e.target.value === '' ? null : Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Satuan</Label>
          <Select value={watch('unit')} onValueChange={(v) => setValue('unit', v ?? 'kg')}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {UNITS.map((u) => (
                <SelectItem key={u} value={u}>
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="stock">Stok</Label>
          <Input id="stock" type="number" {...register('stock', { valueAsNumber: true })} />
          {errors.stock && <p className="text-xs text-red-600">{errors.stock.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="image">URL gambar</Label>
          <Input id="image" {...register('image')} placeholder="/images/produk/…" />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Status</Label>
          <Select
            value={watch('status')}
            onValueChange={(v) => setValue('status', v as FormValues['status'])}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {productStatusLabels[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Badge</Label>
          <Select
            value={watch('badge') ?? 'none'}
            onValueChange={(v) =>
              setValue('badge', v === 'none' ? null : (v as NonNullable<FormValues['badge']>))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Tanpa badge</SelectItem>
              {BADGE_OPTIONS.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="rating">Rating (0–5)</Label>
          <Input id="rating" type="number" step="0.1" min="0" max="5" {...register('rating', { valueAsNumber: true })} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea id="description" rows={3} {...register('description')} />
      </div>

      <div className="flex flex-col gap-3">
        <Label>Pilihan varian (label + pengali)</Label>
        <div className="flex flex-col gap-2">
          {fields.map((field, idx) => (
            <div key={field.id} className="flex items-center gap-2">
              <Input placeholder="Label (mis. 5 kg)" {...register(`options.${idx}.label`)} className="flex-1" />
              <Input
                type="number"
                placeholder="Pengali"
                {...register(`options.${idx}.multiplier`, { valueAsNumber: true })}
                className="w-28"
              />
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => remove(idx)} disabled={fields.length <= 1}>
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => append({ label: '', multiplier: 1 })}>
          <Plus />
          Tambah varian
        </Button>
      </div>

      <label className="flex w-fit items-center gap-2 text-sm">
        <Checkbox checked={watch('featured') ?? false} onCheckedChange={(v) => setValue('featured', v === true)} />
        Tampilkan sebagai produk unggulan
      </label>

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={submitting}>
          <Save />
          {submitting ? 'Menyimpan…' : isEdit ? 'Simpan perubahan' : 'Buat produk'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/products')}>
          Batal
        </Button>
      </div>
    </form>
  )
}
