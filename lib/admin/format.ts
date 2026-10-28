// Admin-side formatting helpers. Business dates/times are rendered in
// Asia/Jakarta (WIB) per project requirements; currency is IDR.

const TZ = 'Asia/Jakarta'

const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

const rupiahCompact = new Intl.NumberFormat('id-ID', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const number = new Intl.NumberFormat('id-ID')

export function formatRupiah(value: number) {
  return rupiah.format(value)
}

export function formatRupiahCompact(value: number) {
  return `Rp ${rupiahCompact.format(value)}`
}

export function formatNumber(value: number) {
  return number.format(value)
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: TZ,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

export function formatDateShort(value: string | Date) {
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: TZ,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function formatDateTime(value: string | Date) {
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: TZ,
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
