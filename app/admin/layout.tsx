import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: {
    default: 'Admin · Tunas Bawang',
    template: '%s · Admin Tunas Bawang',
  },
  robots: { index: false, follow: false },
}

export default function AdminAreaLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <div className="admin min-h-svh">{children}</div>
        <Toaster richColors position="top-right" />
      </TooltipProvider>
    </ThemeProvider>
  )
}
