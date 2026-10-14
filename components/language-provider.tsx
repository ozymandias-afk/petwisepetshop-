'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { LANG_COOKIE, dictionaries, type Dictionary, type Lang } from '@/lib/i18n'

type LanguageContextValue = {
  lang: Lang
  t: Dictionary
  dir: 'rtl' | 'ltr'
  setLang: (lang: Lang) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ initialLang, children }: { initialLang: Lang; children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  const router = useRouter()
  const pathname = usePathname()

  const setLang = useCallback(
    (next: Lang) => {
      setLangState(next)
      document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`
      document.documentElement.lang = next
      document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
      const segments = pathname.split('/')
      if (segments[1] === 'ar' || segments[1] === 'en') segments[1] = next
      else segments.splice(1, 0, next)
      const nextPath = segments.join('/') || `/${next}`
      router.push(`${nextPath}${window.location.search}`)
      // Refresh server components so page titles and meta descriptions switch language too.
      router.refresh()
    },
    [router, pathname],
  )

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, t: dictionaries[lang], dir: lang === 'ar' ? 'rtl' : 'ltr', setLang }),
    [lang, setLang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
