'use client'

import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export function QuantityStepper({
  value,
  min = 1,
  max,
  onChange,
  label,
  size = 'md',
}: {
  value: number
  min?: number
  max: number
  onChange: (value: number) => void
  label: string
  size?: 'sm' | 'md'
}) {
  const btn = cn(
    'flex items-center justify-center bg-card hover:bg-accent disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground',
    size === 'sm' ? 'size-9' : 'size-12',
  )

  return (
    <div className="inline-flex items-stretch border-3 border-foreground shadow-brutal-sm" role="group" aria-label={label}>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Kurangi jumlah"
      >
        <Minus className="size-4" strokeWidth={3} aria-hidden="true" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const next = Number.parseInt(e.target.value, 10)
          if (Number.isNaN(next)) return
          onChange(Math.max(min, Math.min(max, next)))
        }}
        aria-label={label}
        className={cn(
          'border-x-3 border-foreground bg-background text-center font-display [appearance:textfield] focus-visible:outline-offset-[-3px] [&::-webkit-inner-spin-button]:appearance-none',
          size === 'sm' ? 'w-12 text-base' : 'w-16 text-lg',
        )}
      />
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Tambah jumlah"
      >
        <Plus className="size-4" strokeWidth={3} aria-hidden="true" />
      </button>
    </div>
  )
}
