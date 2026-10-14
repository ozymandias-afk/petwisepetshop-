'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { products as fallbackProducts, type Product } from '@/lib/products'
import { useLanguage } from '../language-provider'
import { ProductCard } from '../product-card'
import { SectionHeading } from '../section-heading'

export function FeaturedProducts({ products = fallbackProducts }: { products?: Product[] }) {
  const { t, lang } = useLanguage()
  const featured = products.filter((p) => p.featured).slice(0, 4)

  return (
    <section className="bg-card py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading title={t.featured.title} subtitle={t.featured.subtitle} />
          <Link href={`/${lang}/shop`} className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline">
            {t.common.viewAll}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
