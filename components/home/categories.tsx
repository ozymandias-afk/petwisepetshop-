'use client'

import Link from 'next/link'
import { Bird, Bone, Cat, Dog, Fish, Rabbit, type LucideIcon } from 'lucide-react'
import { categoryIds, type CategoryId } from '@/lib/products'
import { useLanguage } from '../language-provider'
import { SectionHeading } from '../section-heading'

export const categoryIcons: Record<CategoryId, LucideIcon> = {
  dog: Dog,
  cat: Cat,
  birds: Bird,
  fish: Fish,
  'small-pets': Rabbit,
  accessories: Bone,
}

export function Categories() {
  const { t, lang } = useLanguage()

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading title={t.categories.title} subtitle={t.categories.subtitle} />
      <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categoryIds.map((id) => {
          const Icon = categoryIcons[id]
          return (
            <li key={id}>
              <Link
                href={`/${lang}/shop/category/${id}`}
                className="group flex flex-col items-center gap-4 rounded-3xl border border-border bg-card px-4 py-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
              >
                <span className="flex size-16 items-center justify-center rounded-2xl bg-accent text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-8" aria-hidden="true" />
                </span>
                <span className="text-sm font-bold sm:text-base">{t.categories.names[id]}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
