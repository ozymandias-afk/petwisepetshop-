'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Clock, MapPin, Phone } from 'lucide-react'
import { navLinks } from '@/lib/nav'
import { site, whatsappLink } from '@/lib/site'
import { useLanguage } from './language-provider'
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from './brand-icons'

export function SocialLinks({ className = '' }: { className?: string }) {
  const { t, lang } = useLanguage()
  const items = [
    { href: site.instagram, label: t.contact.instagram, Icon: InstagramIcon },
    { href: site.facebook, label: t.contact.facebook, Icon: FacebookIcon },
    { href: whatsappLink(), label: t.contact.whatsapp, Icon: WhatsAppIcon },
  ]
  return (
    <ul className={`flex items-center gap-3 ${className}`}>
      {items.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-primary"
          >
            <Icon className="size-5" />
          </a>
        </li>
      ))}
    </ul>
  )
}

export function SiteFooter() {
  const { t, lang } = useLanguage()

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Image src="/images/petwise-logo.jpg" alt="PetWise" width={88} height={88} className="size-22 rounded-full" />
          <p className="text-sm leading-relaxed text-white/70">{t.footer.about}</p>
          <SocialLinks />
        </div>

        <div>
          <h2 className="mb-4 text-base font-bold">{t.footer.quickLinks}</h2>
          <ul className="flex flex-col gap-2.5 text-sm text-white/70">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={`/${lang}${link.href === '/' ? '' : link.href}`} className="transition-colors hover:text-white">
                  {t.nav[link.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-base font-bold">{t.footer.contact}</h2>
          <ul className="flex flex-col gap-3 text-sm text-white/70">
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" dir="ltr" className="hover:text-white">
                {site.phoneDisplay}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <a href={site.mapLink} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                {t.contact.address}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-base font-bold">{t.footer.hours}</h2>
          <p className="flex items-start gap-2.5 text-sm text-white/70">
            <Clock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            {t.footer.hoursValue}
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-center text-xs text-white/50 sm:px-6">
          {'© '}
          {new Date().getFullYear()} PetWise. {t.footer.rights}
        </p>
      </div>
    </footer>
  )
}
