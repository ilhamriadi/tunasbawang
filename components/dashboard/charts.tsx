'use client'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatRupiah, formatRupiahCompact } from '@/lib/admin/format'
import { orderStatusLabels, type OrderStatus } from '@/lib/constants'

export type SeriesPoint = { label: string; revenue: number; orders: number }

export function RevenueChart({ data }: { data: SeriesPoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} dy={8} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
            tickFormatter={(v: number) => formatRupiahCompact(v)}
            width={64}
          />
          <Tooltip
            formatter={(value, name) =>
              name === 'revenue' ? [formatRupiah(Number(value)), 'Pendapatan'] : [String(value), 'Pesanan']
            }
            contentStyle={{ borderRadius: 8, fontSize: 12 }}
          />
          <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2} fill="url(#rev)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'var(--chart-2)',
  processing: 'var(--chart-5)',
  shipped: 'var(--chart-1)',
  delivered: 'var(--chart-3)',
  cancelled: 'var(--chart-4)',
}

export type StatusSlice = { status: OrderStatus; count: number }

export function OrderStatusChart({ data }: { data: StatusSlice[] }) {
  const total = data.reduce((s, d) => s + d.count, 0)
  if (total === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
        Belum ada pesanan
      </div>
    )
  }
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="status" innerRadius={55} outerRadius={85} paddingAngle={2}>
            {data.map((d) => (
              <Cell key={d.status} fill={STATUS_COLORS[d.status]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [String(value), orderStatusLabels[String(name) as OrderStatus] ?? String(name)]}
            contentStyle={{ borderRadius: 8, fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        {data.map((d) => (
          <span key={d.status} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-2 rounded-full" style={{ background: STATUS_COLORS[d.status] }} />
            {orderStatusLabels[d.status]} ({d.count})
          </span>
        ))}
      </div>
    </div>
  )
}

export function OrdersBarChart({ data }: { data: SeriesPoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} dy={8} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={40} allowDecimals={false} />
          <Tooltip formatter={(value) => [String(value), 'Pesanan']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
          <Bar dataKey="orders" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
