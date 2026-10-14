import { LocalizedPageHeader } from '@/components/localized-page-header'
import { ShopBrowser } from '@/components/shop/shop-browser'
import { categoryIds, type CategoryId } from '@/lib/products'
import { getPublishedProducts } from '@/lib/server-products'
import { pageMetadata } from '@/lib/server-lang'

export const generateMetadata = () => pageMetadata('shop')

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams
  const products = await getPublishedProducts()
  const initialCategory = categoryIds.includes(category as CategoryId) ? (category as CategoryId) : null

  return (
    <>
      <LocalizedPageHeader page="shop" />
      <ShopBrowser key={initialCategory ?? 'all'} initialCategory={initialCategory} products={products} />
    </>
  )
}
