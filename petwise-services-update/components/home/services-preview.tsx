'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { pillButton } from '@/lib/styles'
import { useLanguage } from '../language-provider'
import { serviceList } from '../services/service-list'

export function ServicesPreview() {
  const { t, lang } = useLanguage()
  const highlights = serviceList.slice(0, 4)

  return (
    <section className="bg-card py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
          <Image
            src="/images/grooming.png"
            alt={t.servicesPreview.imageAlt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col items-start gap-5">
          <span className="text-sm font-bold tracking-wide text-primary uppercase">{t.servicesPreview.eyebrow}</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">{t.servicesPreview.title}</h2>
          <p className="text-base leading-relaxed text-muted-foreground">{t.servicesPreview.text}</p>
          <ul className="grid w-full grid-cols-2 gap-3">
            {highlights.map(({ id, Icon }) => (
              <li key={id} className="flex items-center gap-3 rounded-2xl bg-background p-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-sm font-bold">{t.services.items[id].title}</span>
              </li>
            ))}
          </ul>
          <Link href={`/${lang}/services`} className={pillButton({ size: 'md' })}>
            {t.servicesPreview.cta}
            <ArrowRight className="rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
