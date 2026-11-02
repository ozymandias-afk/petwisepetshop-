import { Hero } from '@/components/home/hero'
import { Categories } from '@/components/home/categories'
import { FeaturedProducts } from '@/components/home/featured-products'
import { WhyPetwise } from '@/components/home/why-petwise'
import { Reviews } from '@/components/home/reviews'
import { pageMetadata } from '@/lib/server-lang'
import { getPublishedProducts } from '@/lib/server-products'

export const generateMetadata = () => pageMetadata('home')

export default async function HomePage() {
  const products = await getPublishedProducts()
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts products={products} />
      <WhyPetwise />
      <Reviews />
    </>
  )
}
