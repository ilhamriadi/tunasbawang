import Link from 'next/link'
import { Leaf } from 'lucide-react'

export function BrandLogo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <Link href="/admin" className="flex items-center gap-2 px-2 py-1.5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Leaf className="size-4" strokeWidth={2.5} />
      </span>
      {!collapsed && (
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight">Tunas Bawang</span>
          <span className="text-[11px] text-muted-foreground">Panel Admin</span>
        </span>
      )}
    </Link>
  )
}
