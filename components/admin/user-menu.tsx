'use client'

import { useRouter } from 'next/navigation'
import { LogOut, ChevronUp } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import { roleLabels } from '@/lib/constants'

type UserMenuProps = {
  name: string | null
  email: string | null
  role: 'admin' | 'staff' | null
}

export function UserMenu({ name, email, role }: UserMenuProps) {
  const router = useRouter()
  const initials = (name ?? email ?? 'A').slice(0, 2).toUpperCase()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/admin/login')
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="flex items-center gap-2 rounded-lg px-1.5 py-1 outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar className="size-7">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium sm:block">{name ?? email ?? 'Admin'}</span>
            <ChevronUp className="hidden size-3.5 text-muted-foreground sm:block" />
          </button>
        }
      />
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="truncate text-sm font-medium">{name ?? email ?? 'Admin'}</span>
            <span className="truncate text-xs text-muted-foreground">{email}</span>
            <span className="mt-1 text-xs text-muted-foreground">{role ? roleLabels[role] : '—'}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut />
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
