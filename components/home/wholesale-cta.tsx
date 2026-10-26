import { MessageCircle } from 'lucide-react'
import { whatsappLink } from '@/lib/format'

export function WholesaleCta() {
  return (
    <section aria-labelledby="grosir-judul" className="mx-auto max-w-7xl px-4 pb-16">
      <div className="flex flex-col items-start gap-6 border-3 border-foreground bg-primary p-6 text-primary-foreground shadow-brutal-lg md:flex-row md:items-center md:justify-between md:p-10">
        <div className="max-w-2xl">
          <h2 id="grosir-judul" className="font-display text-3xl leading-tight text-balance uppercase md:text-4xl">
            Butuh partai besar untuk pasar atau kelompok tani?
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-primary-foreground/90">
            Kami melayani pembelian di atas 100 kg dengan harga khusus dan pengiriman truk langsung dari Enrekang.
          </p>
        </div>
        <a
          href={whatsappLink('Halo Tunas Bawang, saya mau tanya harga grosir.')}
          target="_blank"
          rel="noopener noreferrer"
          className="brutal-press inline-flex shrink-0 items-center gap-2 border-3 border-foreground bg-accent px-6 py-4 font-display text-accent-foreground uppercase shadow-brutal"
        >
          <MessageCircle className="size-5" strokeWidth={3} aria-hidden="true" />
          Chat harga grosir
        </a>
      </div>
    </section>
  )
}
