import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { whatsappLink } from '@/lib/format'

export function Hero() {
  return (
    <section aria-labelledby="hero-judul" className="border-b-3 border-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:py-16 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col items-start gap-6">
          <span className="-rotate-2 border-3 border-foreground bg-accent px-3 py-1 text-sm font-bold uppercase shadow-brutal-sm">
            Langsung dari Enrekang, Sulsel
          </span>
          <h1
            id="hero-judul"
            className="font-display text-5xl leading-[0.95] tracking-tight text-balance uppercase md:text-6xl xl:text-7xl"
          >
            Bawang merah <span className="bg-primary px-2 text-primary-foreground">segar</span> dari lereng gunung.
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-pretty">
            Hasil panen, bibit unggul, pupuk, dan alat tani — dipilih oleh petani untuk petani. Harga jujur, kirim ke
            seluruh Indonesia.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/produk"
              className="brutal-press inline-flex h-13 items-center gap-2 border-3 border-foreground bg-primary px-6 font-display text-primary-foreground uppercase shadow-brutal"
            >
              Belanja Sekarang
              <ArrowRight className="size-5" strokeWidth={3} aria-hidden="true" />
            </Link>
            <a
              href={whatsappLink('Halo Tunas Bawang, saya mau pesan.')}
              target="_blank"
              rel="noopener noreferrer"
              className="brutal-press inline-flex h-13 items-center gap-2 border-3 border-foreground bg-card px-6 font-display uppercase shadow-brutal"
            >
              <MessageCircle className="size-5" strokeWidth={3} aria-hidden="true" />
              Tanya via WA
            </a>
          </div>
          <dl className="mt-2 grid w-full max-w-lg grid-cols-3 border-3 border-foreground bg-card">
            {[
              { value: '12+', label: 'Tahun bertani' },
              { value: '8rb+', label: 'Pesanan' },
              { value: '4.9', label: 'Rating' },
            ].map((stat) => (
              <div key={stat.label} className="border-r-3 border-foreground p-3 last:border-r-0">
                <dt className="text-xs font-bold text-muted-foreground uppercase">{stat.label}</dt>
                <dd className="font-display text-2xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="grid grid-cols-5 grid-rows-6 gap-4 aspect-square sm:aspect-[5/4] lg:aspect-square">
          <div className="relative col-span-3 row-span-4 rotate-[-1.5deg] border-3 border-foreground bg-card shadow-brutal-lg">
            <Image
              src="/images/hero-petani.png"
              alt="Petani Enrekang memegang ikatan bawang merah hasil panen"
              fill
              priority
              sizes="(min-width: 1024px) 30vw, 60vw"
              className="object-cover"
            />
          </div>
          <div className="relative col-span-2 row-span-3 rotate-2 border-3 border-foreground bg-card shadow-brutal">
            <Image
              src="/images/hero-bibit.png"
              alt="Bibit bawang merah yang baru tumbuh"
              fill
              sizes="(min-width: 1024px) 20vw, 40vw"
              className="object-cover"
            />
          </div>
          <div className="relative col-span-2 row-span-3 -rotate-1 border-3 border-foreground bg-card shadow-brutal">
            <Image
              src="/images/hero-panen.png"
              alt="Keranjang bambu berisi bawang merah segar"
              fill
              sizes="(min-width: 1024px) 20vw, 40vw"
              className="object-cover"
            />
          </div>
          <div className="col-span-3 row-span-2 flex rotate-1 flex-col justify-center border-3 border-foreground bg-accent p-4 shadow-brutal">
            <p className="font-display text-2xl leading-tight uppercase md:text-3xl">Panen tiap minggu</p>
            <p className="text-sm font-medium">Stok selalu baru, tidak ada barang gudang lama.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
