export type CategorySlug = 'bawang-merah' | 'bibit' | 'pupuk' | 'alat-tani'

export type Category = {
  slug: CategorySlug
  name: string
  tagline: string
  image: string
  tone: 'primary' | 'accent' | 'card' | 'foreground'
}

export type ProductOption = {
  label: string
  multiplier: number
}

export type Product = {
  slug: string
  name: string
  category: CategorySlug
  price: number
  unit: string
  image: string
  description: string
  stock: number
  options: ProductOption[]
  badge?: 'Terlaris' | 'Baru' | 'Promo'
  rating: number
  sold: number
  featured?: boolean
  createdAt: string
}

export const categories: Category[] = [
  {
    slug: 'bawang-merah',
    name: 'Bawang Merah',
    tagline: 'Segar langsung dari kebun',
    image: '/images/produk/bawang-super-philip.png',
    tone: 'primary',
  },
  {
    slug: 'bibit',
    name: 'Bibit',
    tagline: 'Umbi & biji unggul siap tanam',
    image: '/images/produk/bibit-umbi.png',
    tone: 'accent',
  },
  {
    slug: 'pupuk',
    name: 'Pupuk',
    tagline: 'Nutrisi tepat, panen melimpah',
    image: '/images/produk/pupuk-npk.png',
    tone: 'card',
  },
  {
    slug: 'alat-tani',
    name: 'Alat Tani',
    tagline: 'Peralatan kuat untuk ladang',
    image: '/images/produk/sprayer.png',
    tone: 'foreground',
  },
]

export const products: Product[] = [
  {
    slug: 'bawang-merah-super-philip',
    name: 'Bawang Merah Super Philip',
    category: 'bawang-merah',
    price: 38000,
    unit: 'kg',
    image: '/images/produk/bawang-super-philip.png',
    description:
      'Umbi besar, warna merah mengkilap, aroma kuat. Dipanen dari lahan dataran tinggi Enrekang dan dijemur alami.',
    stock: 850,
    options: [
      { label: '1 kg', multiplier: 1 },
      { label: '5 kg', multiplier: 5 },
      { label: '10 kg', multiplier: 10 },
    ],
    badge: 'Terlaris',
    rating: 4.9,
    sold: 2140,
    featured: true,
    createdAt: '2026-10-18',
  },
  {
    slug: 'bawang-merah-bima-brebes',
    name: 'Bawang Merah Bima Brebes',
    category: 'bawang-merah',
    price: 35000,
    unit: 'kg',
    image: '/images/produk/bawang-bima-brebes.png',
    description:
      'Varietas Bima Brebes ukuran sedang, rasa pedas khas, cocok untuk bumbu dapur dan bawang goreng.',
    stock: 620,
    options: [
      { label: '1 kg', multiplier: 1 },
      { label: '5 kg', multiplier: 5 },
      { label: '10 kg', multiplier: 10 },
    ],
    rating: 4.8,
    sold: 1385,
    featured: true,
    createdAt: '2026-10-10',
  },
  {
    slug: 'bawang-merah-batu-ijo',
    name: 'Bawang Merah Batu Ijo Premium',
    category: 'bawang-merah',
    price: 42000,
    unit: 'kg',
    image: '/images/produk/bawang-batu-ijo.png',
    description:
      'Grade premium, umbi padat dan tahan simpan lama. Pilihan utama restoran dan pedagang pasar.',
    stock: 310,
    options: [
      { label: '1 kg', multiplier: 1 },
      { label: '5 kg', multiplier: 5 },
      { label: '25 kg (karung)', multiplier: 25 },
    ],
    badge: 'Baru',
    rating: 4.9,
    sold: 412,
    createdAt: '2026-10-22',
  },
  {
    slug: 'bibit-umbi-bima-brebes',
    name: 'Bibit Umbi Bima Brebes',
    category: 'bibit',
    price: 48000,
    unit: 'kg',
    image: '/images/produk/bibit-umbi.png',
    description:
      'Umbi bibit sudah melewati masa dormansi 60 hari, tunas mulai muncul. Daya tumbuh di atas 95%.',
    stock: 540,
    options: [
      { label: '1 kg', multiplier: 1 },
      { label: '10 kg', multiplier: 10 },
      { label: '50 kg', multiplier: 50 },
    ],
    badge: 'Terlaris',
    rating: 4.9,
    sold: 1870,
    featured: true,
    createdAt: '2026-10-05',
  },
  {
    slug: 'bibit-umbi-super-philip',
    name: 'Bibit Umbi Super Philip',
    category: 'bibit',
    price: 52000,
    unit: 'kg',
    image: '/images/produk/bibit-umbi.png',
    description:
      'Bibit Super Philip asli Enrekang, adaptif di dataran tinggi, potensi hasil 18–22 ton per hektar.',
    stock: 280,
    options: [
      { label: '1 kg', multiplier: 1 },
      { label: '10 kg', multiplier: 10 },
      { label: '50 kg', multiplier: 50 },
    ],
    rating: 4.8,
    sold: 964,
    createdAt: '2026-09-28',
  },
  {
    slug: 'bibit-semai-tajuk',
    name: 'Bibit Semai Tajuk (Tray)',
    category: 'bibit',
    price: 75000,
    unit: 'tray',
    image: '/images/produk/bibit-semai.png',
    description:
      'Bibit semai umur 30 hari dalam tray isi 200 lubang. Akar kuat, siap pindah tanam ke bedengan.',
    stock: 95,
    options: [
      { label: '1 tray', multiplier: 1 },
      { label: '5 tray', multiplier: 5 },
    ],
    badge: 'Baru',
    rating: 4.7,
    sold: 188,
    featured: true,
    createdAt: '2026-10-20',
  },
  {
    slug: 'biji-tss-lokananta',
    name: 'Biji TSS Lokananta',
    category: 'bibit',
    price: 185000,
    unit: 'pack',
    image: '/images/produk/biji-tss.png',
    description:
      'True Shallot Seed varietas Lokananta, isi 10 gram. Hemat biaya bibit hingga 40% dibanding umbi.',
    stock: 140,
    options: [
      { label: '1 pack', multiplier: 1 },
      { label: '5 pack', multiplier: 5 },
    ],
    rating: 4.6,
    sold: 302,
    createdAt: '2026-09-15',
  },
  {
    slug: 'pupuk-npk-khusus-bawang',
    name: 'Pupuk NPK Khusus Bawang 25 kg',
    category: 'pupuk',
    price: 340000,
    unit: 'sak',
    image: '/images/produk/pupuk-npk.png',
    description:
      'Formula NPK 16-16-16 plus sulfur untuk pembesaran umbi dan warna merah yang lebih pekat.',
    stock: 120,
    options: [
      { label: '1 sak', multiplier: 1 },
      { label: '4 sak', multiplier: 4 },
    ],
    badge: 'Promo',
    rating: 4.8,
    sold: 756,
    featured: true,
    createdAt: '2026-10-01',
  },
  {
    slug: 'pupuk-organik-kompos',
    name: 'Pupuk Organik Kompos 20 kg',
    category: 'pupuk',
    price: 65000,
    unit: 'sak',
    image: '/images/produk/pupuk-organik.png',
    description:
      'Kompos matang dari kotoran ternak dan sisa tanaman. Menggemburkan tanah dan menjaga kelembapan.',
    stock: 210,
    options: [
      { label: '1 sak', multiplier: 1 },
      { label: '5 sak', multiplier: 5 },
      { label: '10 sak', multiplier: 10 },
    ],
    rating: 4.7,
    sold: 489,
    createdAt: '2026-09-20',
  },
  {
    slug: 'sprayer-elektrik-16l',
    name: 'Sprayer Elektrik 16 Liter',
    category: 'alat-tani',
    price: 385000,
    unit: 'unit',
    image: '/images/produk/sprayer.png',
    description:
      'Tangki 16 L dengan pompa baterai 12V, tahan hingga 6 jam semprot. Nozzle bisa diatur kabut atau lurus.',
    stock: 34,
    options: [{ label: '1 unit', multiplier: 1 }],
    badge: 'Terlaris',
    rating: 4.8,
    sold: 241,
    featured: true,
    createdAt: '2026-09-30',
  },
  {
    slug: 'mulsa-plastik-hitam-perak',
    name: 'Mulsa Plastik Hitam Perak',
    category: 'alat-tani',
    price: 620000,
    unit: 'roll',
    image: '/images/produk/mulsa.png',
    description:
      'Lebar 120 cm, panjang 500 m. Menekan gulma, menjaga suhu tanah, dan mengurangi serangan hama.',
    stock: 48,
    options: [{ label: '1 roll', multiplier: 1 }],
    rating: 4.7,
    sold: 133,
    featured: true,
    createdAt: '2026-10-12',
  },
  {
    slug: 'cangkul-baja-tempa',
    name: 'Cangkul Baja Tempa',
    category: 'alat-tani',
    price: 95000,
    unit: 'unit',
    image: '/images/produk/cangkul.png',
    description:
      'Mata cangkul baja tempa tebal dengan gagang kayu jati. Kuat untuk membuat bedengan di tanah keras.',
    stock: 76,
    options: [{ label: '1 unit', multiplier: 1 }],
    rating: 4.6,
    sold: 198,
    createdAt: '2026-09-08',
  },
  {
    slug: 'gunting-panen-stainless',
    name: 'Gunting Panen Stainless',
    category: 'alat-tani',
    price: 45000,
    unit: 'unit',
    image: '/images/produk/gunting-panen.png',
    description:
      'Gunting stainless anti karat dengan pegangan karet. Ringan dan tajam untuk memotong daun dan akar bawang.',
    stock: 0,
    options: [{ label: '1 unit', multiplier: 1 }],
    rating: 4.5,
    sold: 320,
    createdAt: '2026-08-30',
  },
]

export type SortOption = 'terbaru' | 'terlaris' | 'termurah' | 'termahal'

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'terbaru', label: 'Terbaru' },
  { value: 'terlaris', label: 'Terlaris' },
  { value: 'termurah', label: 'Termurah' },
  { value: 'termahal', label: 'Termahal' },
]

export function isCategorySlug(value: unknown): value is CategorySlug {
  return categories.some((c) => c.slug === value)
}

export function isSortOption(value: unknown): value is SortOption {
  return sortOptions.some((s) => s.value === value)
}

export function getCategory(slug: CategorySlug) {
  return categories.find((c) => c.slug === slug)
}

export function getFeaturedProducts() {
  return products.filter((p) => p.featured)
}

export function countByCategory(slug: CategorySlug) {
  return products.filter((p) => p.category === slug).length
}

export function queryProducts({
  category,
  q,
  sort = 'terbaru',
}: {
  category?: CategorySlug
  q?: string
  sort?: SortOption
}) {
  const term = q?.trim().toLowerCase()
  const filtered = products.filter((p) => {
    if (category && p.category !== category) return false
    if (term) {
      const haystack = `${p.name} ${p.description} ${getCategory(p.category)?.name ?? ''}`.toLowerCase()
      if (!haystack.includes(term)) return false
    }
    return true
  })

  const sorters: Record<SortOption, (a: Product, b: Product) => number> = {
    terbaru: (a, b) => b.createdAt.localeCompare(a.createdAt),
    terlaris: (a, b) => b.sold - a.sold,
    termurah: (a, b) => a.price - b.price,
    termahal: (a, b) => b.price - a.price,
  }

  return [...filtered].sort(sorters[sort])
}
