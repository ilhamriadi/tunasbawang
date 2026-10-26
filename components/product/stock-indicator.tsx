import { cn } from '@/lib/utils'

const LOW_STOCK = 50

export function StockIndicator({ stock, unit }: { stock: number; unit: string }) {
  const status = stock === 0 ? 'habis' : stock <= LOW_STOCK ? 'menipis' : 'tersedia'
  const label = {
    habis: 'Stok habis',
    menipis: `Stok menipis — sisa ${stock} ${unit}`,
    tersedia: `Stok tersedia — ${stock.toLocaleString('id-ID')} ${unit}`,
  }[status]
  const fill = stock === 0 ? 0 : Math.min(100, Math.max(8, (stock / 500) * 100))

  return (
    <div className="flex flex-col gap-2">
      <p className="flex items-center gap-2 text-sm font-bold">
        <span
          aria-hidden="true"
          className={cn(
            'size-3 border-2 border-foreground',
            status === 'habis' && 'bg-destructive',
            status === 'menipis' && 'bg-accent',
            status === 'tersedia' && 'bg-primary',
          )}
        />
        {label}
      </p>
      <div className="h-3 w-full max-w-xs border-2 border-foreground bg-card" aria-hidden="true">
        <div
          className={cn('h-full', status === 'menipis' ? 'bg-accent' : 'bg-primary')}
          style={{ width: `${fill}%` }}
        />
      </div>
    </div>
  )
}
