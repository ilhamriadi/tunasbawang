import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Pagination({
  page,
  totalPages,
  basePath,
  query,
}: {
  page: number
  totalPages: number
  basePath: string
  query?: Record<string, string | undefined>
}) {
  if (totalPages <= 1) return null

  function href(p: number) {
    const sp = new URLSearchParams()
    for (const [k, v] of Object.entries(query ?? {})) {
      if (v) sp.set(k, v)
    }
    if (p > 1) sp.set('page', String(p))
    const qs = sp.toString()
    return qs ? `${basePath}?${qs}` : basePath
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm text-muted-foreground">
        Halaman {page} dari {totalPages}
      </span>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" disabled={page <= 1} render={<Link href={href(page - 1)} />}>
          <ChevronLeft />
          Sebelumnya
        </Button>
        <Button variant="outline" size="sm" disabled={page >= totalPages} render={<Link href={href(page + 1)} />}>
          Berikutnya
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}
