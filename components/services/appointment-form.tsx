'use client'

import { whatsappLink } from '@/lib/site'
import { pillButton } from '@/lib/styles'
import { useLanguage } from '../language-provider'
import { WhatsAppIcon } from '../brand-icons'
import { Field, fieldClass } from '../form-field'
import { serviceList } from './service-list'

export function AppointmentForm() {
  const { t } = useLanguage()
  const a = t.appointment
  const today = new Date().toISOString().split('T')[0]

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    if (String(data.get('website') ?? '').trim()) return
    const message = a.message({
      name: String(data.get('name') ?? '').trim(),
      phone: String(data.get('phone') ?? '').trim(),
      pet: String(data.get('pet') ?? ''),
      service: String(data.get('service') ?? ''),
      date: String(data.get('date') ?? ''),
    })
    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="book" className="scroll-mt-24 rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-10">
      <h2 className="text-2xl font-extrabold sm:text-3xl">{a.title}</h2>
      <p className="mt-2 text-muted-foreground">{a.subtitle}</p>
      <form onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="absolute -left-[10000px]" aria-hidden="true">
              <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
            </div>
        <Field id="appt-name" label={a.name}>
          <input id="appt-name" name="name" required maxLength={80} autoComplete="name" placeholder={a.namePlaceholder} className={fieldClass} />
        </Field>
        <Field id="appt-phone" label={a.phone}>
          <input
            id="appt-phone"
            name="phone"
            type="tel"
            required
            inputMode="tel"
            pattern="[0-9+\s\-]{7,20}"
            autoComplete="tel"
            dir="ltr"
            placeholder={a.phonePlaceholder}
            className={`${fieldClass} rtl:text-end`}
          />
        </Field>
        <Field id="appt-pet" label={a.petType}>
          <select id="appt-pet" name="pet" required defaultValue="" className={fieldClass}>
            <option value="" disabled>
              {a.petTypePlaceholder}
            </option>
            {a.petTypes.map((pet) => (
              <option key={pet} value={pet}>
                {pet}
              </option>
            ))}
          </select>
        </Field>
        <Field id="appt-service" label={a.service}>
          <select id="appt-service" name="service" required defaultValue="" className={fieldClass}>
            <option value="" disabled>
              {a.servicePlaceholder}
            </option>
            {serviceList.map(({ id }) => (
              <option key={id} value={t.services.items[id].title}>
                {t.services.items[id].title}
              </option>
            ))}
          </select>
        </Field>
        <Field id="appt-date" label={a.date}>
          <input id="appt-date" name="date" type="date" required min={today} className={fieldClass} />
        </Field>
        <div className="flex items-end">
          <button type="submit" className={pillButton({ variant: 'whatsapp', size: 'lg', className: 'w-full' })}>
            <WhatsAppIcon />
            {a.submit}
          </button>
        </div>
      </form>
    </section>
  )
}
