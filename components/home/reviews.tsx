'use client'

import { Quote, Star } from 'lucide-react'
import { useLanguage } from '../language-provider'
import { SectionHeading } from '../section-heading'

export function Reviews() {
  const { t } = useLanguage()

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading title={t.reviews.title} align="center" />
      <ul className="mt-10 grid gap-6 md:grid-cols-3">
        {t.reviews.items.map((review) => (
          <li key={review.name} className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex gap-0.5" role="img" aria-label="5/5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-primary text-primary" aria-hidden="true" />
                ))}
              </div>
              <Quote className="size-6 text-accent-foreground/20" aria-hidden="true" />
            </div>
            <blockquote className="flex-1 text-base leading-relaxed">{review.text}</blockquote>
            <p className="flex items-center gap-3 font-bold">
              <span
                className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground"
                aria-hidden="true"
              >
                {review.name.charAt(0)}
              </span>
              {review.name}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
