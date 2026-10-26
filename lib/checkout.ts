export const FREE_SHIPPING_MIN = 250000

export type ShippingId = 'reguler' | 'kilat' | 'kargo' | 'ambil'
export type PaymentId = 'transfer' | 'qris' | 'cod'

export type ShippingMethod = {
  id: ShippingId
  name: string
  eta: string
  cost: number
  freeEligible: boolean
}

export const shippingMethods: ShippingMethod[] = [
  { id: 'reguler', name: 'Reguler', eta: '2–4 hari kerja', cost: 18000, freeEligible: true },
  { id: 'kilat', name: 'Kilat', eta: '1–2 hari kerja', cost: 32000, freeEligible: false },
  { id: 'kargo', name: 'Kargo (di atas 20 kg)', eta: '4–7 hari kerja', cost: 55000, freeEligible: false },
  { id: 'ambil', name: 'Ambil di Gudang Enrekang', eta: 'Siap diambil hari ini', cost: 0, freeEligible: false },
]

export const paymentMethods: { id: PaymentId; name: string; detail: string }[] = [
  { id: 'transfer', name: 'Transfer Bank', detail: 'BRI, BNI, Mandiri, BCA' },
  { id: 'qris', name: 'QRIS', detail: 'GoPay, OVO, DANA, ShopeePay' },
  { id: 'cod', name: 'Bayar di Tempat (COD)', detail: 'Khusus wilayah Sulawesi Selatan' },
]

export function shippingCost(method: ShippingMethod, subtotal: number) {
  if (method.freeEligible && subtotal >= FREE_SHIPPING_MIN) return 0
  return method.cost
}
