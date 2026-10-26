import Link from 'next/link'
import { Sprout } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <Link href="/" className={cn('group inline-flex items-center gap-2', className)} aria-label="Tunas Bawang, ke beranda">
      <span className="relative flex size-11 items-center justify-center border-3 border-foreground bg-accent shadow-brutal-sm">
        <span className="font-display text-lg leading-none tracking-tight">TB</span>
        <Sprout
          className="absolute -top-3 -right-2 size-5 rotate-12 fill-primary text-foreground"
          strokeWidth={2.5}
          aria-hidden="true"
        />
      </span>
      <span
        className={cn(
          'font-display text-xl leading-none tracking-tight uppercase',
          inverted ? 'text-background' : 'text-foreground',
        )}
      >
        Tunas
        <span className="text-primary">Bawang</span>
      </span>
    </Link>
  )
}
