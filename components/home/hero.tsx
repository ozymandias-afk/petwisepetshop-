'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, Clock, Stethoscope } from 'lucide-react'
import { pillButton } from '@/lib/styles'
import { useLanguage } from '../language-provider'

export function Hero() {
  const { t, lang } = useLanguage()

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-40 -top-40 size-[34rem] rounded-full bg-accent blur-3xl"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-12 sm:px-6 md:py-20 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-4 py-1.5 text-xs font-bold text-primary">
            <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
            {t.hero.badge}
          </span>
          <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {t.hero.title}
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-muted-foreground text-pretty">{t.hero.subtitle}</p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href={`/${lang}/shop`} className={pillButton({ size: 'lg' })}>
              {t.hero.shop}
              <ArrowRight className="rtl:rotate-180" aria-hidden="true" />
            </Link>
            <Link href={`/${lang}/services`} className={pillButton({ variant: 'outline', size: 'lg' })}>
              <Stethoscope aria-hidden="true" />
              {t.hero.book}
            </Link>
          </div>
          <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <BadgeCheck className="size-5 text-primary" aria-hidden="true" />
            {t.hero.brands}
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border-8 border-card shadow-2xl shadow-foreground/10 lg:rotate-2">
            <Image
              src="/images/petwise-shop.webp"
              alt={t.hero.imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-5 start-4 flex items-center gap-3 rounded-2xl bg-card p-3 pe-5 shadow-xl shadow-foreground/10 sm:start-[-1.5rem]">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Clock className="size-5" aria-hidden="true" />
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-muted-foreground">{t.hero.openDaily}</span>
              <span className="text-sm font-extrabold">{t.hero.hours}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
