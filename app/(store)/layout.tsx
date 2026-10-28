import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { AnnouncementBar } from '@/components/site/announcement-bar'
import { CartProvider } from '@/lib/cart'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <AnnouncementBar />
      <SiteHeader />
      <main id="konten">{children}</main>
      <SiteFooter />
    </CartProvider>
  )
}
