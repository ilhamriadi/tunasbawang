import { BadgeCheck, HandCoins, Leaf, Truck } from 'lucide-react'
import { SectionHeading } from './section-heading'

const values = [
  {
    icon: Leaf,
    title: 'Panen sendiri',
    body: 'Bawang dan bibit berasal dari kebun kami dan kelompok tani mitra di Anggeraja.',
  },
  {
    icon: BadgeCheck,
    title: 'Garansi tumbuh',
    body: 'Bibit umbi dijamin daya tumbuh minimal 95%. Kurang dari itu? Kami ganti.',
  },
  {
    icon: HandCoins,
    title: 'Harga petani',
    body: 'Tanpa tengkulak berlapis. Harga grosir otomatis untuk pembelian partai besar.',
  },
  {
    icon: Truck,
    title: 'Kirim cepat',
    body: 'Dikemas pagi, dikirim hari yang sama. Ke seluruh Sulawesi dan Indonesia.',
  },
]

export function ValueProps() {
  return (
    <section aria-labelledby="kenapa-judul" className="mx-auto max-w-7xl px-4 py-14">
      <SectionHeading id="kenapa-judul" eyebrow="Kenapa kami" title="Dari kebun, bukan dari gudang." />
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {values.map(({ icon: Icon, title, body }, i) => (
          <li
            key={title}
            className="flex flex-col gap-3 border-3 border-foreground bg-card p-5 shadow-brutal"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-12 items-center justify-center border-3 border-foreground bg-primary text-primary-foreground">
                <Icon className="size-6" strokeWidth={2.5} aria-hidden="true" />
              </span>
              <span className="font-display text-3xl text-foreground/15" aria-hidden="true">
                {`0${i + 1}`}
              </span>
            </div>
            <h3 className="font-display text-xl uppercase">{title}</h3>
            <p className="leading-relaxed text-muted-foreground">{body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
