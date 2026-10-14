'use client'

import { cn } from '@/lib/utils'
import type { Lang } from '@/lib/i18n'
import { useLanguage } from './language-provider'

const options: { value: Lang; label: string; full: string }[] = [
  { value: 'ar', label: 'AR', full: 'العربية' },
  { value: 'en', label: 'EN', full: 'English' },
]

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang, t } = useLanguage()

  return (
    <div
      role="group"
      aria-label={t.nav.switchLang}
      dir="ltr"
      className={cn('inline-flex items-center rounded-full border border-border bg-card p-1 text-xs font-bold', className)}
    >
      {options.map((option) => {
        const active = option.value === lang
        return (
          <button
            key={option.value}
            type="button"
            lang={option.value}
            aria-pressed={active}
            aria-label={option.full}
            onClick={() => !active && setLang(option.value)}
            className={cn(
              'rounded-full px-3 py-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              active ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
