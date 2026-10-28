import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  tone = 'default',
}: {
  label: string
  value: string
  icon: LucideIcon
  hint?: string
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
}) {
  return (
    <Card className="gap-3">
      <CardContent className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="truncate text-2xl font-semibold tabular-nums tracking-tight">{value}</span>
          {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
        </div>
        <span
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-lg',
            tone === 'default' && 'bg-primary/10 text-primary',
            tone === 'success' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
            tone === 'warning' && 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
            tone === 'danger' && 'bg-red-500/10 text-red-600 dark:text-red-400',
            tone === 'info' && 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
            tone === 'neutral' && 'bg-muted text-muted-foreground',
          )}
        >
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  )
}
