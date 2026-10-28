import { getAuthUser, isStaffRole } from '@/lib/auth'
import { getOrdersForExport } from '@/lib/data/reports'

function csvEscape(value: unknown): string {
  const s = value == null ? '' : String(value)
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

export async function GET(request: Request) {
  const user = await getAuthUser()
  if (!user || !isStaffRole(user.role)) {
    return new Response('Unauthorized', { status: 401 })
  }

  const url = new URL(request.url)
  const from = url.searchParams.get('from') || undefined
  const to = url.searchParams.get('to') || undefined

  const rows = await getOrdersForExport(from, to)

  const header = [
    'Nomor Pesanan',
    'Tanggal',
    'Pelanggan',
    'Telepon',
    'Status',
    'Pembayaran',
    'Subtotal',
    'Ongkir',
    'Diskon',
    'Total',
    'Pengiriman',
    'Metode Bayar',
  ]

  const lines = rows.map((r) =>
    [
      r.order_number,
      r.created_at,
      r.customer_name,
      r.customer_phone,
      r.status,
      r.payment_status,
      r.subtotal,
      r.shipping_cost,
      r.discount,
      r.total,
      r.shipping_name,
      r.payment_name,
    ]
      .map(csvEscape)
      .join(','),
  )

  const csv = '\uFEFF' + [header.map(csvEscape).join(','), ...lines].join('\n')

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="pesanan-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
