'use client'

import { whatsappLink } from '@/lib/site'
import { useLanguage } from '../language-provider'
import { WhatsAppIcon } from '../brand-icons'
import { serviceList } from './service-list'

export function ServicesGrid() {
  const { t } = useLanguage()

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {serviceList.map(({ id, Icon }) => {
        const service = t.services.items[id]
        return (
          <li
            key={id}
            className="group flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-foreground/5"
          >
            <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="size-7" aria-hidden="true" />
            </span>
            <h2 className="text-xl font-bold">{service.title}</h2>
            <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{service.text}</p>
            <a
              href={whatsappLink(t.services.whatsappMessage(service.title))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-whatsapp hover:underline"
            >
              <WhatsAppIcon className="size-4" />
              {t.common.bookWhatsapp}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
