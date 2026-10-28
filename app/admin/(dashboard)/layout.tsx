import { requireStaff } from '@/lib/auth'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/admin/app-sidebar'
import { SiteHeader } from '@/components/admin/site-header'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStaff()

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex min-h-svh w-full flex-col">
        <SiteHeader user={{ name: user.fullName, email: user.email, role: user.role }} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </SidebarProvider>
  )
}
