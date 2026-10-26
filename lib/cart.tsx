'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { products, type Product, type ProductOption } from '@/lib/products'

export type CartLine = {
  slug: string
  option: string
  quantity: number
}

export type ResolvedCartLine = CartLine & {
  product: Product
  selectedOption: ProductOption
  unitPrice: number
  lineTotal: number
}

type AddResult = { ok: true } | { ok: false; reason: string }

type CartContextValue = {
  lines: ResolvedCartLine[]
  count: number
  subtotal: number
  addItem: (slug: string, option: string, quantity: number) => AddResult
  setQuantity: (slug: string, option: string, quantity: number) => void
  removeItem: (slug: string, option: string) => void
  clear: () => void
  maxQuantityFor: (slug: string, option: string) => number
}

const CartContext = createContext<CartContextValue | null>(null)

export const MAX_QTY_PER_LINE = 99

function resolveLine(line: CartLine): ResolvedCartLine | null {
  const product = products.find((p) => p.slug === line.slug)
  const selectedOption = product?.options.find((o) => o.label === line.option)
  if (!product || !selectedOption) return null
  const unitPrice = product.price * selectedOption.multiplier
  return { ...line, product, selectedOption, unitPrice, lineTotal: unitPrice * line.quantity }
}

function usedStock(lines: CartLine[], slug: string, excludeOption?: string) {
  const product = products.find((p) => p.slug === slug)
  if (!product) return 0
  return lines
    .filter((l) => l.slug === slug && l.option !== excludeOption)
    .reduce((sum, l) => {
      const multiplier = product.options.find((o) => o.label === l.option)?.multiplier ?? 0
      return sum + multiplier * l.quantity
    }, 0)
}

function computeMaxQuantity(lines: CartLine[], slug: string, option: string) {
  const product = products.find((p) => p.slug === slug)
  const multiplier = product?.options.find((o) => o.label === option)?.multiplier
  if (!product || !multiplier) return 0
  const remaining = product.stock - usedStock(lines, slug, option)
  return Math.max(0, Math.min(MAX_QTY_PER_LINE, Math.floor(remaining / multiplier)))
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [rawLines, setRawLines] = useState<CartLine[]>([])

  const maxQuantityFor = useCallback(
    (slug: string, option: string) => computeMaxQuantity(rawLines, slug, option),
    [rawLines],
  )

  const addItem = useCallback(
    (slug: string, option: string, quantity: number): AddResult => {
      if (!Number.isInteger(quantity) || quantity < 1) return { ok: false, reason: 'Jumlah tidak valid.' }
      const existing = rawLines.find((l) => l.slug === slug && l.option === option)
      const max = computeMaxQuantity(rawLines, slug, option)
      const next = (existing?.quantity ?? 0) + quantity
      if (max === 0) return { ok: false, reason: 'Stok tidak mencukupi.' }
      if (next > max) return { ok: false, reason: `Maksimal ${max} untuk pilihan ini.` }

      setRawLines((prev) =>
        existing
          ? prev.map((l) => (l.slug === slug && l.option === option ? { ...l, quantity: next } : l))
          : [...prev, { slug, option, quantity }],
      )
      return { ok: true }
    },
    [rawLines],
  )

  const setQuantity = useCallback((slug: string, option: string, quantity: number) => {
    setRawLines((prev) => {
      const max = computeMaxQuantity(prev, slug, option)
      const clamped = Math.max(1, Math.min(max, Math.floor(quantity)))
      return prev.map((l) => (l.slug === slug && l.option === option ? { ...l, quantity: clamped } : l))
    })
  }, [])

  const removeItem = useCallback((slug: string, option: string) => {
    setRawLines((prev) => prev.filter((l) => !(l.slug === slug && l.option === option)))
  }, [])

  const clear = useCallback(() => setRawLines([]), [])

  const value = useMemo<CartContextValue>(() => {
    const lines = rawLines.map(resolveLine).filter((l): l is ResolvedCartLine => l !== null)
    return {
      lines,
      count: lines.reduce((sum, l) => sum + l.quantity, 0),
      subtotal: lines.reduce((sum, l) => sum + l.lineTotal, 0),
      addItem,
      setQuantity,
      removeItem,
      clear,
      maxQuantityFor,
    }
  }, [rawLines, addItem, setQuantity, removeItem, clear, maxQuantityFor])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
