import type { Dictionary } from './i18n'

export const navLinks: { href: string; key: keyof Omit<Dictionary['nav'], 'menu' | 'close' | 'switchLang'> }[] = [
  { href: '/', key: 'home' },
  { href: '/shop', key: 'shop' },
  { href: '/services', key: 'services' },
  { href: '/about', key: 'about' },
  { href: '/contact', key: 'contact' },
]
