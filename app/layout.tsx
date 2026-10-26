import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Archivo_Black, Space_Grotesk } from 'next/font/google'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { AnnouncementBar } from '@/components/site/announcement-bar'
import { CartProvider } from '@/lib/cart'
import './globals.css'

const archivoBlack = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-archivo-black',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Tunas Bawang — Bawang Merah, Bibit, Pupuk & Alat Tani',
    template: '%s | Tunas Bawang',
  },
  description:
    'Toko online Tunas Bawang dari Enrekang, Sulawesi Selatan. Jual bawang merah segar, bibit unggul, pupuk, dan alat pertanian langsung dari petani.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#16A34A',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${archivoBlack.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-dvh antialiased">
        <CartProvider>
          <AnnouncementBar />
          <SiteHeader />
          <main id="konten">{children}</main>
          <SiteFooter />
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
