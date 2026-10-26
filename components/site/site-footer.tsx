import Link from 'next/link'
import { Mail, MapPin, MessageCircle } from 'lucide-react'
import { Logo } from './logo'
import { SocialLinks } from './social-links'
import { categories } from '@/lib/products'
import { store, whatsappLink } from '@/lib/format'

export function SiteFooter() {
  return (
    <footer className="border-t-3 border-foreground bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Logo inverted />
          <p className="max-w-md text-pretty leading-relaxed text-background/80">
            Toko tani dari kaki Gunung Latimojong. Kami menjual hasil panen dan perlengkapan tanam yang kami pakai
            sendiri di kebun, supaya petani lain bisa panen lebih baik.
          </p>
          <SocialLinks />
        </div>

        <div>
          <h2 className="mb-4 font-display text-lg uppercase text-accent">Belanja</h2>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/produk" className="hover:text-accent hover:underline">
                Semua Produk
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/produk?kategori=${c.slug}`} className="hover:text-accent hover:underline">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-display text-lg uppercase text-accent">Kontak</h2>
          <ul className="flex flex-col gap-3 text-background/90">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span className="text-sm leading-relaxed">{store.address}</span>
            </li>
            <li>
              <a
                href={whatsappLink('Halo Tunas Bawang, saya mau tanya produk.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-accent hover:underline"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                {store.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${store.email}`} className="flex items-center gap-2 hover:text-accent hover:underline">
                <Mail className="size-4" aria-hidden="true" />
                {store.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t-3 border-background/20">
        <p className="mx-auto max-w-7xl px-4 py-4 text-sm text-background/70">
          {'© 2026 Tunas Bawang, Enrekang. Semua hak dilindungi.'}
        </p>
      </div>
    </footer>
  )
}
