import type { LucideIcon } from 'lucide-react'
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from '@/components/ui/empty'

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon
  title: string
  description?: string
}) {
  return (
    <Empty className="rounded-xl border bg-card py-14">
      <EmptyMedia variant="icon">
        <Icon />
      </EmptyMedia>
      <EmptyTitle>{title}</EmptyTitle>
      {description && <EmptyDescription>{description}</EmptyDescription>}
    </Empty>
  )
}
