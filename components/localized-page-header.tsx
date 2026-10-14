'use client'

import type { Dictionary } from '@/lib/i18n'
import { useLanguage } from './language-provider'
import { PageHeader } from './section-heading'

type PageKey = 'shop' | 'services' | 'about' | 'contact'

export function LocalizedPageHeader({ page }: { page: PageKey }) {
  const { t } = useLanguage()
  const section = t[page] as Dictionary[PageKey]
  return <PageHeader title={section.title} subtitle={section.subtitle} />
}
