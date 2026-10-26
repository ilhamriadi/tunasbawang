import { Marquee } from './marquee'

export function AnnouncementBar() {
  return (
    <Marquee
      className="border-t-0 bg-foreground text-background"
      items={[
        'Panen segar',
        'Langsung dari petani',
        'Gratis ongkir se-Enrekang min. Rp250.000',
        'Bibit bergaransi daya tumbuh 95%',
        'Pesan via WhatsApp 0851-1782-9731',
      ]}
    />
  )
}
