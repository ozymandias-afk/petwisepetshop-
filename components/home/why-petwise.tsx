'use client'

import { Award, HeartHandshake, MessageCircleHeart, ShieldCheck } from 'lucide-react'
import { useLanguage } from '../language-provider'

const icons = [Award, ShieldCheck, MessageCircleHeart, HeartHandshake]

export function WhyPetwise() {
  const { t } = useLanguage()

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="rounded-[2rem] bg-primary px-6 py-12 text-primary-foreground sm:px-10">
        <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">{t.why.title}</h2>
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {t.why.items.map((item, i) => {
            const Icon = icons[i]
            return (
              <li key={item.title} className="flex flex-col items-center gap-3 text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-white/15">
                  <Icon className="size-7" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-white/85">{item.text}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
