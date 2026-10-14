'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { categoryIds, products as fallbackProducts, type CategoryId, type Product } from '@/lib/products'
import { useLanguage } from '../language-provider'
import { ProductCard } from '../product-card'
import { categoryIcons } from '../home/categories'

export function ShopBrowser({ initialCategory, products = fallbackProducts }: { initialCategory: CategoryId | null; products?: Product[] }) {
  const { lang, t } = useLanguage()
  const [category, setCategory] = useState<CategoryId | null>(initialCategory)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      if (category && p.category !== category) return false
      if (!q) return true
      return [p.name.ar, p.name.en, p.description[lang]].some((s) => s.toLowerCase().includes(q))
    })
  }, [category, query, lang])

  const selectCategory = (next: CategoryId | null) => {
    setCategory(next)
    const url = next ? `/${lang}/shop?category=${next}` : `/${lang}/shop`
    window.history.replaceState(null, '', url)
  }

  const chip = (active: boolean) =>
    cn(
      'inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-colors',
      active
        ? 'border-primary bg-primary text-primary-foreground'
        : 'border-border bg-card text-foreground hover:border-primary/50 hover:text-primary',
    )

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-5">
        <div className="relative max-w-md">
          <label htmlFor="product-search" className="sr-only">
            {t.shop.searchLabel}
          </label>
          <Search
            className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id="product-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.shop.search}
            className="w-full rounded-full border border-input bg-card py-3 ps-12 pe-4 text-base focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none"
          />
        </div>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="group">
          <button type="button" className={chip(category === null)} aria-pressed={category === null} onClick={() => selectCategory(null)}>
            {t.categories.all}
          </button>
          {categoryIds.map((id) => {
            const Icon = categoryIcons[id]
            const active = category === id
            return (
              <button key={id} type="button" className={chip(active)} aria-pressed={active} onClick={() => selectCategory(id)}>
                <Icon className="size-4" aria-hidden="true" />
                {t.categories.names[id]}
              </button>
            )
          })}
        </div>

        <p className="text-sm font-semibold text-muted-foreground" aria-live="polite">
          {t.shop.results(filtered.length)}
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center text-muted-foreground">
          {t.shop.empty}
        </p>
      )}
    </div>
  )
}
