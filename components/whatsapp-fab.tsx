'use client'

import { whatsappLink } from '@/lib/site'
import { useLanguage } from './language-provider'
import { WhatsAppIcon } from './brand-icons'

export function WhatsAppFab() {
  const { t } = useLanguage()
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.common.chatWhatsapp}
      title={t.common.chatWhatsapp}
      className="fixed end-5 bottom-5 z-50 inline-flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 focus-visible:ring-4 focus-visible:ring-whatsapp/40 focus-visible:outline-none"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  )
}
