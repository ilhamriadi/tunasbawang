const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

const compactFormatter = new Intl.NumberFormat('id-ID', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function formatRupiah(value: number) {
  return rupiahFormatter.format(value)
}

export function formatCompact(value: number) {
  return compactFormatter.format(value)
}

export const store = {
  name: 'Tunas Bawang',
  whatsapp: '6285117829731',
  whatsappDisplay: '+62 851-1782-9731',
  email: 'halo@tunasbawang.id',
  address: 'Jl. Poros Enrekang–Toraja, Kec. Anggeraja, Kab. Enrekang, Sulawesi Selatan',
}

export function whatsappLink(message: string) {
  return `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`
}
