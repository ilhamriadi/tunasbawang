import { Hero } from '@/components/home/hero'
import { CategoryGrid } from '@/components/home/category-grid'
import { FeaturedProducts } from '@/components/home/featured-products'
import { ValueProps } from '@/components/home/value-props'
import { WholesaleCta } from '@/components/home/wholesale-cta'
import { Marquee } from '@/components/site/marquee'
import { getStorefrontCategories, getStorefrontProducts } from '@/lib/data/storefront'

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getStorefrontCategories(),
    getStorefrontProducts(),
  ])

  return (
    <>
      <Hero />
      <Marquee
        className="border-t-0 bg-accent"
        items={['Super Philip', 'Bima Brebes', 'Batu Ijo', 'Tajuk', 'Lokananta TSS', 'Pupuk NPK', 'Mulsa', 'Sprayer']}
      />
      <CategoryGrid categories={categories} products={products} />
      <FeaturedProducts products={products} />
      <ValueProps />
      <WholesaleCta />
    </>
  )
}
