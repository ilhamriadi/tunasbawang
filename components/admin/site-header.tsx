'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from './theme-toggle'
import { UserMenu } from './user-menu'

type SiteHeaderProps = {
  title?: string
  user: { name: string | null; email: string | null; role: 'admin' | 'staff' | null }
}

export function SiteHeader({ title, user }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-1 !h-4" />
      {title && <span className="text-sm font-semibold tracking-tight">{title}</span>}
      <div className="ml-auto flex items-center gap-1.5">
        <ThemeToggle />
        <UserMenu name={user.name} email={user.email} role={user.role} />
      </div>
    </header>
  )
}
