import 'server-only'
import { createClient } from '@/lib/supabase/server'
import {
  categories as fallbackCategories,
  products as fallbackProducts,
  type Category,
  type CategorySlug,
  type Product,
  type ProductOption,
} from '@/lib/products'

// Whether Supabase env vars are configured. When absent (e.g. preview build
// without secrets), the storefront gracefully falls back to the static catalog
// in lib/products.ts so it never breaks.
function isConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY))
}

export async function getStorefrontCategories(): Promise<Category[]> {
  const order = ['bawang-merah', 'bibit', 'pupuk', 'alat-tani'] as const;
  if (!isConfigured()) return fallbackCategories;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('slug, name, tagline, image, tone');
    if (error || !data?.length) return fallbackCategories;
    // Preserve custom order defined above
    const dataMap = new Map(data.map((c: any) => [c.slug, c]));
    const ordered = order.map((slug) => dataMap.get(slug)).filter(Boolean) as any[];
    return ordered.map((c) => ({
      slug: c.slug as CategorySlug,
      name: c.name,
      tagline: c.tagline ?? '',
      image: c.image ?? '',
      tone: (c.tone as Category['tone']) ?? 'primary',
    }));
  } catch {
    return fallbackCategories;
  }
}

export async function getStorefrontProducts(): Promise<Product[]> {
  if (!isConfigured()) return fallbackProducts
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    if (error || !data?.length) return fallbackProducts

    return data.map((p) => {
      const options: ProductOption[] = Array.isArray(p.options)
        ? (p.options as Array<{ label: string; multiplier: number }>)
            .filter((o) => o && typeof o.label === 'string' && typeof o.multiplier === 'number')
            .map((o) => ({ label: o.label, multiplier: o.multiplier }))
        : []
      return {
        slug: p.slug,
        name: p.name,
        category: p.category as CategorySlug,
        price: p.price,
        unit: p.unit,
        image: p.image ?? '',
        description: p.description ?? '',
        stock: p.stock,
        options: options.length ? options : [{ label: '1', multiplier: 1 }],
        badge: (p.badge as Product['badge']) ?? undefined,
        rating: Number(p.rating),
        sold: p.sold,
        featured: p.featured,
        createdAt: (p.created_at ?? '').slice(0, 10),
      }
    })
  } catch {
    return fallbackProducts
  }
}
