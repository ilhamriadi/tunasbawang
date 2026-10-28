import Link from 'next/link'
import { sortOptions, type CategorySlug, type SortOption } from '@/lib/products'
import { cn } from '@/lib/utils'

type FilterState = { kategori?: CategorySlug; q?: string; sort: SortOption }

function buildHref(state: FilterState, patch: Partial<FilterState>) {
  const next = { ...state, ...patch }
  const params = new URLSearchParams()
  if (next.kategori) params.set('kategori', next.kategori)
  if (next.q) params.set('q', next.q)
  if (next.sort && next.sort !== 'terbaru') params.set('sort', next.sort)
  const qs = params.toString()
  return qs ? `/produk?${qs}` : '/produk'
}

const chipBase =
  'inline-flex shrink-0 items-center whitespace-nowrap border-3 border-foreground px-3 py-1.5 text-sm font-bold uppercase'

export function CategoryFilter({
  state,
  categories,
}: {
  state: FilterState
  categories: { slug: CategorySlug; name: string }[]
}) {
  const items = [{ slug: undefined, name: 'Semua' }, ...categories]
  return (
    <nav aria-label="Filter kategori">
      <ul className="flex gap-2 overflow-x-auto pb-1">
        {items.map((c) => {
          const active = state.kategori === c.slug
          return (
            <li key={c.slug ?? 'semua'}>
              <Link
                href={buildHref(state, { kategori: c.slug })}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  chipBase,
                  active
                    ? 'bg-foreground text-background'
                    : 'bg-card shadow-brutal-sm hover:bg-accent',
                )}
              >
                {c.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export function SortFilter({ state }: { state: FilterState }) {
  return (
    <nav aria-label="Urutkan produk" className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="text-sm font-bold uppercase">Urutkan:</span>
      <ul className="grid grid-cols-4 border-3 border-foreground bg-card">
        {sortOptions.map((s) => {
          const active = state.sort === s.value
          return (
            <li key={s.value} className="border-r-3 border-foreground text-center last:border-r-0">
              <Link
                href={buildHref(state, { sort: s.value })}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'block px-3 py-1.5 text-sm font-bold',
                  active ? 'bg-primary text-primary-foreground' : 'hover:bg-accent',
                )}
              >
                {s.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export { buildHref }
