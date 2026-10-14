'use client'

import { Clock, MapPin, Navigation } from 'lucide-react'
import { site, whatsappLink } from '@/lib/site'
import { pillButton } from '@/lib/styles'
import { useLanguage } from '../language-provider'
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from '../brand-icons'
import { Field, fieldClass } from '../form-field'

export function ContactContent() {
  const { t } = useLanguage()
  const c = t.contact

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    if (String(data.get('website') ?? '').trim()) return
    const message = c.composed({
      name: String(data.get('name') ?? '').trim(),
      phone: String(data.get('phone') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
    })
    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer')
  }

  const channels = [
    { href: whatsappLink(), label: c.whatsapp, value: site.phoneDisplay, Icon: WhatsAppIcon, tone: 'bg-whatsapp/10 text-whatsapp', ltr: true },
    { href: site.instagram, label: c.instagram, value: '@petwise.jo', Icon: InstagramIcon, tone: 'bg-accent text-primary', ltr: true },
    { href: site.facebook, label: c.facebook, value: 'Petwise', Icon: FacebookIcon, tone: 'bg-secondary/10 text-secondary', ltr: true },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <ul className="grid gap-4 sm:grid-cols-3">
        {channels.map(({ href, label, value, Icon, tone, ltr }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${tone}`}>
                <Icon className="size-6" />
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-muted-foreground">{label}</span>
                <span className="font-bold" dir={ltr ? 'ltr' : undefined}>
                  {value}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2 rounded-3xl bg-card p-6 shadow-sm">
              <Clock className="size-6 text-primary" aria-hidden="true" />
              <h2 className="font-bold">{c.hoursTitle}</h2>
              <p className="text-sm text-muted-foreground">{c.hours}</p>
            </div>
            <div className="flex flex-col gap-2 rounded-3xl bg-card p-6 shadow-sm">
              <MapPin className="size-6 text-primary" aria-hidden="true" />
              <h2 className="font-bold">{c.addressTitle}</h2>
              <p className="text-sm text-muted-foreground">{c.address}</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <iframe
              title={c.mapTitle}
              src={site.mapEmbed}
              className="h-72 w-full border-0 sm:h-80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="p-4">
              <a href={site.mapLink} target="_blank" rel="noopener noreferrer" className={pillButton({ variant: 'soft', size: 'sm' })}>
                <Navigation aria-hidden="true" />
                {c.directions}
              </a>
            </div>
          </div>
        </div>

        <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-extrabold">{c.formTitle}</h2>
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
            <div className="absolute -left-[10000px]" aria-hidden="true">
              <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
            </div>
            <Field id="contact-name" label={c.name}>
              <input id="contact-name" name="name" required maxLength={80} autoComplete="name" placeholder={c.namePlaceholder} className={fieldClass} />
            </Field>
            <Field id="contact-phone" label={c.phone}>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                required
                inputMode="tel"
                pattern="[0-9+\s\-]{7,20}"
                autoComplete="tel"
                dir="ltr"
                placeholder={c.phonePlaceholder}
                className={`${fieldClass} rtl:text-end`}
              />
            </Field>
            <Field id="contact-message" label={c.messageLabel}>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                maxLength={1000}
                placeholder={c.messagePlaceholder}
                className={`${fieldClass} resize-y`}
              />
            </Field>
            <button type="submit" className={pillButton({ variant: 'whatsapp', size: 'lg' })}>
              <WhatsAppIcon />
              {c.submit}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}
