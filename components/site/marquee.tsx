import { Sprout } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const loop = [...items, ...items]
  return (
    <div className={cn('overflow-hidden border-y-3 border-foreground', className)}>
      <p className="sr-only">{items.join('. ')}</p>
      <div className="flex w-max animate-marquee motion-reduce:animate-none" aria-hidden="true">
        {loop.map((item, i) => (
          <span key={i} className="flex items-center gap-4 px-4 py-2 font-display text-sm tracking-wide uppercase">
            {item}
            <Sprout className="size-4" strokeWidth={2.5} />
          </span>
        ))}
      </div>
    </div>
  )
}
