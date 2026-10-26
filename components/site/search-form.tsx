import { Search } from 'lucide-react'

export function SearchForm({ defaultValue }: { defaultValue?: string }) {
  return (
    <form action="/produk" role="search" className="flex w-full">
      <label htmlFor="cari-produk" className="sr-only">
        Cari produk
      </label>
      <input
        id="cari-produk"
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="Cari bawang, bibit, pupuk..."
        className="h-11 w-full min-w-0 border-3 border-r-0 border-foreground bg-card px-3 font-medium placeholder:text-muted-foreground focus-visible:outline-offset-0"
      />
      <button
        type="submit"
        className="flex h-11 shrink-0 items-center gap-2 border-3 border-foreground bg-accent px-4 font-bold uppercase hover:bg-primary hover:text-primary-foreground"
      >
        <Search className="size-4" strokeWidth={3} aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">Cari</span>
      </button>
    </form>
  )
}
