import { cookies } from 'next/headers'
import type { Metadata } from 'next'
import { LANG_COOKIE, dictionaries, resolveLang, type Dictionary } from './i18n'

export async function getLang() {
  const store = await cookies()
  return resolveLang(store.get(LANG_COOKIE)?.value)
}

export async function pageMetadata(page: keyof Dictionary['meta']): Promise<Metadata> {
  const lang = await getLang()
  const meta = dictionaries[lang].meta[page]
  const paths: Record<keyof Dictionary['meta'], string> = { home: '', shop: 'shop', services: 'services', about: 'about', contact: 'contact' }
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://petwise-jo.netlify.app').replace(/\/$/, '')
  const path = paths[page]
  const localized = (locale: 'ar' | 'en') => `${base}/${locale}${path ? `/${path}` : ''}`
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: localized(lang), languages: { 'ar-JO': localized('ar'), 'en-JO': localized('en') } },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: localized(lang),
      locale: lang === 'ar' ? 'ar_JO' : 'en_JO',
      images: [`${base}/images/petwise-shop.webp`],
    },
  }
}
