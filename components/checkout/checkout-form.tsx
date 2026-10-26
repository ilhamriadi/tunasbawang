'use client'

import { useState } from 'react'
import { Banknote, Lock, QrCode, Landmark } from 'lucide-react'
import {
  paymentMethods,
  shippingCost,
  shippingMethods,
  type PaymentId,
  type ShippingId,
} from '@/lib/checkout'
import { formatRupiah } from '@/lib/format'
import { cn } from '@/lib/utils'

export type CustomerDetails = {
  name: string
  phone: string
  address: string
  city: string
  postalCode: string
  note: string
}

type Errors = Partial<Record<keyof CustomerDetails, string>>

const paymentIcons = { transfer: Landmark, qris: QrCode, cod: Banknote } as const

function validate(data: CustomerDetails): Errors {
  const errors: Errors = {}
  if (data.name.trim().length < 3) errors.name = 'Nama minimal 3 huruf.'
  if (!/^(\+62|62|0)8\d{7,11}$/.test(data.phone.replace(/[\s-]/g, '')))
    errors.phone = 'Gunakan nomor WhatsApp aktif, mis. 0812 3456 7890.'
  if (data.address.trim().length < 10) errors.address = 'Tulis alamat lengkap (jalan, RT/RW, desa).'
  if (data.city.trim().length < 3) errors.city = 'Isi kecamatan dan kabupaten/kota.'
  if (!/^\d{5}$/.test(data.postalCode.trim())) errors.postalCode = 'Kode pos 5 digit.'
  return errors
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  const id = `langkah-${number}`
  return (
    <section aria-labelledby={id} className="border-3 border-foreground bg-card shadow-brutal">
      <h2 id={id} className="border-b-3 border-foreground bg-accent px-4 py-3 font-display uppercase">
        <span className="mr-2 inline-flex size-7 items-center justify-center bg-foreground text-background">{number}</span>
        {title}
      </h2>
      <div className="p-4 md:p-6">{children}</div>
    </section>
  )
}

function Field({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string
  label: string
  error?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-bold uppercase">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm font-bold text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

const inputClass =
  'w-full border-3 border-foreground bg-background px-3 py-2.5 placeholder:text-muted-foreground/70 focus-visible:bg-card focus-visible:shadow-brutal-sm focus-visible:outline-none aria-[invalid=true]:border-destructive aria-[invalid=true]:bg-destructive/5'

export function CheckoutForm({
  shippingId,
  onShippingChange,
  paymentId,
  onPaymentChange,
  subtotal,
  onSubmit,
}: {
  shippingId: ShippingId
  onShippingChange: (id: ShippingId) => void
  paymentId: PaymentId
  onPaymentChange: (id: PaymentId) => void
  subtotal: number
  onSubmit: (details: CustomerDetails) => void
}) {
  const [errors, setErrors] = useState<Errors>({})

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const data: CustomerDetails = {
      name: String(form.get('name') ?? '').slice(0, 80),
      phone: String(form.get('phone') ?? '').slice(0, 20),
      address: String(form.get('address') ?? '').slice(0, 300),
      city: String(form.get('city') ?? '').slice(0, 100),
      postalCode: String(form.get('postalCode') ?? '').slice(0, 5),
      note: String(form.get('note') ?? '').slice(0, 300),
    }
    const nextErrors = validate(data)
    setErrors(nextErrors)
    const firstInvalid = Object.keys(nextErrors)[0]
    if (firstInvalid) {
      document.getElementById(`co-${firstInvalid}`)?.focus()
      return
    }
    onSubmit(data)
  }

  const fieldProps = (key: keyof CustomerDetails) => ({
    id: `co-${key}`,
    name: key,
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `co-${key}-error` : undefined,
    onInput: () => errors[key] && setErrors((prev) => ({ ...prev, [key]: undefined })),
  })

  return (
    <form id="checkout-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
      <Step number={2} title="Alamat Pengiriman">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="co-name" label="Nama penerima" error={errors.name}>
            <input {...fieldProps('name')} autoComplete="name" placeholder="Andi Baso" className={inputClass} />
          </Field>
          <Field id="co-phone" label="No. WhatsApp" error={errors.phone}>
            <input
              {...fieldProps('phone')}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="0812 3456 7890"
              className={inputClass}
            />
          </Field>
          <Field id="co-address" label="Alamat lengkap" error={errors.address} className="sm:col-span-2">
            <textarea
              {...fieldProps('address')}
              rows={3}
              autoComplete="street-address"
              placeholder="Jl. Poros Malino No. 12, RT 02/RW 04, Desa Bontolerung"
              className={cn(inputClass, 'resize-y')}
            />
          </Field>
          <Field id="co-city" label="Kecamatan, Kota/Kab." error={errors.city}>
            <input
              {...fieldProps('city')}
              autoComplete="address-level2"
              placeholder="Anggeraja, Enrekang"
              className={inputClass}
            />
          </Field>
          <Field id="co-postalCode" label="Kode pos" error={errors.postalCode}>
            <input
              {...fieldProps('postalCode')}
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={5}
              placeholder="91752"
              className={inputClass}
            />
          </Field>
          <Field id="co-note" label="Catatan untuk penjual (opsional)" className="sm:col-span-2">
            <input
              id="co-note"
              name="note"
              placeholder="Mis. kirim pagi hari, titip di warung depan"
              className={inputClass}
            />
          </Field>
        </div>
      </Step>

      <Step number={3} title="Metode Pengiriman">
        <fieldset>
          <legend className="sr-only">Pilih metode pengiriman</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {shippingMethods.map((m) => {
              const cost = shippingCost(m, subtotal)
              const active = m.id === shippingId
              return (
                <label
                  key={m.id}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 border-3 border-foreground p-3 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-foreground',
                    active ? 'bg-primary text-primary-foreground shadow-brutal-sm' : 'bg-background hover:bg-muted',
                  )}
                >
                  <input
                    type="radio"
                    name="shipping"
                    value={m.id}
                    checked={active}
                    onChange={() => onShippingChange(m.id)}
                    className="mt-1 size-4 accent-foreground"
                  />
                  <span className="flex flex-1 flex-col">
                    <span className="font-bold">{m.name}</span>
                    <span className={cn('text-sm', active ? 'text-primary-foreground/85' : 'text-muted-foreground')}>
                      {m.eta}
                    </span>
                  </span>
                  <span className="font-display">
                    {cost === 0 ? (
                      <span className={cn('px-1.5', !active && 'bg-accent')}>Gratis</span>
                    ) : (
                      formatRupiah(cost)
                    )}
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>
      </Step>

      <Step number={4} title="Metode Pembayaran">
        <fieldset>
          <legend className="sr-only">Pilih metode pembayaran</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {paymentMethods.map((m) => {
              const Icon = paymentIcons[m.id]
              const active = m.id === paymentId
              return (
                <label
                  key={m.id}
                  className={cn(
                    'flex cursor-pointer flex-col gap-2 border-3 border-foreground p-3 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-foreground',
                    active ? 'bg-foreground text-background shadow-brutal-sm' : 'bg-background hover:bg-muted',
                  )}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m.id}
                    checked={active}
                    onChange={() => onPaymentChange(m.id)}
                    className="sr-only"
                  />
                  <Icon className="size-6" strokeWidth={2.5} aria-hidden="true" />
                  <span className="font-bold">{m.name}</span>
                  <span className={cn('text-xs', active ? 'text-background/75' : 'text-muted-foreground')}>
                    {m.detail}
                  </span>
                </label>
              )
            })}
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="size-4" strokeWidth={2.5} aria-hidden="true" />
            Detail pembayaran dikirim via WhatsApp setelah pesanan dibuat.
          </p>
        </fieldset>
      </Step>
    </form>
  )
}
