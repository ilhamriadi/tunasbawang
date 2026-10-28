'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ChevronDown, CreditCard, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  updateOrderStatusAction,
  updatePaymentStatusAction,
} from '@/lib/actions/orders'
import {
  ORDER_TRANSITIONS,
  PAYMENT_STATUSES,
  orderStatusLabels,
  paymentStatusLabels,
  type OrderStatus,
  type PaymentStatus,
} from '@/lib/constants'

export function OrderActions({ orderId, status, paymentStatus }: { orderId: string; status: OrderStatus; paymentStatus: PaymentStatus }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const allowed = ORDER_TRANSITIONS[status] ?? []

  function setStatus(next: OrderStatus) {
    startTransition(async () => {
      const res = await updateOrderStatusAction(orderId, { status: next })
      if (!res.ok) toast.error(res.error)
      else {
        toast.success(`Status diubah ke "${orderStatusLabels[next]}"`)
        router.refresh()
      }
    })
  }

  function setPayment(next: PaymentStatus) {
    startTransition(async () => {
      const res = await updatePaymentStatusAction(orderId, { paymentStatus: next })
      if (!res.ok) toast.error(res.error)
      else {
        toast.success(`Status pembayaran: ${paymentStatusLabels[next]}`)
        router.refresh()
      }
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="sm" disabled={allowed.length === 0 || pending}>
              <Truck />
              Ubah status pengiriman
              <ChevronDown />
            </Button>
          }
        />
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Transisi yang diizinkan</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {allowed.length === 0 ? (
            <DropdownMenuItem disabled>Status final — tidak ada transisi</DropdownMenuItem>
          ) : (
            allowed.map((next) => (
              <DropdownMenuItem key={next} onClick={() => setStatus(next)}>
                {orderStatusLabels[next]}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="sm" disabled={pending}>
              <CreditCard />
              Pembayaran
              <ChevronDown />
            </Button>
          }
        />
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel>Verifikasi pembayaran manual</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {PAYMENT_STATUSES.map((s) => (
            <DropdownMenuItem key={s} onClick={() => setPayment(s)} disabled={s === paymentStatus}>
              {paymentStatusLabels[s]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <p className="text-xs text-muted-foreground">
        Status pembayaran hanya berubah lewat verifikasi manual — tidak otomatis saat status pengiriman berubah.
      </p>
    </div>
  )
}
