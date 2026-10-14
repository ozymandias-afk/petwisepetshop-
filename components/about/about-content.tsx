'use client'

import Image from 'next/image'
import { HeartPulse, MessageCircleHeart, ShieldCheck } from 'lucide-react'
import { useLanguage } from '../language-provider'

const valueIcons = [HeartPulse, MessageCircleHeart, ShieldCheck]

export function AboutContent() {
  const { t } = useLanguage()

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] border-8 border-card shadow-2xl shadow-foreground/10">
          <Image
            src="/images/petwise-shop.webp"
            alt={t.about.imageAlt}
            fill
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-5">
          <h2 className="text-3xl font-extrabold tracking-tight">{t.about.storyTitle}</h2>
          {t.about.story.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="text-lg leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
          <p className="text-xl font-extrabold text-primary">{t.common.tagline}</p>
        </div>
      </div>

      <section className="mt-20">
        <h2 className="text-center text-3xl font-extrabold tracking-tight">{t.about.valuesTitle}</h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {t.about.values.map((value, i) => {
            const Icon = valueIcons[i]
            return (
              <li key={value.title} className="flex flex-col items-center gap-3 rounded-3xl bg-card p-8 text-center shadow-sm">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-primary">
                  <Icon className="size-7" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold">{value.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{value.text}</p>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
