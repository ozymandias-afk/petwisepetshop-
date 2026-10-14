'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { useCart } from './cart-provider'
import { formatPrice } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { navLinks } from '@/lib/nav'
import { useLanguage } from './language-provider'
import { LanguageSwitcher } from './language-switcher'

function isActive(pathname: string, href: string) {
  const normalized = pathname.replace(/^\/(ar|en)(?=\/|$)/, '') || '/'
  return href === '/' ? normalized === '/' : normalized.startsWith(href)
}

export function SiteHeader() {
  const { t, lang } = useLanguage()
  const { count, items, subtotal, setQuantity, remove } = useCart()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center" onClick={() => setOpen(false)}>
          <Image
            src="/images/petwise-logo.jpg"
            alt="PetWise"
            width={56}
            height={56}
            priority
            className="size-14 rounded-full"
          />
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(pathname, link.href)
              return (
                <li key={link.href}>
                  <Link
                    href={`/${lang}${link.href === '/' ? '' : link.href}`}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                      active ? 'bg-accent text-accent-foreground' : 'text-foreground/80 hover:text-primary',
                    )}
                  >
                    {t.nav[link.key]}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setCartOpen(true)} aria-label={lang === 'ar' ? `السلة ${count}` : `Cart ${count}`} className="relative inline-flex size-10 items-center justify-center rounded-full border border-border bg-card">
            <ShoppingCart className="size-5" />
            {count > 0 && <span className="absolute -end-1 -top-1 flex min-w-5 h-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">{count}</span>}
          </button>
          <LanguageSwitcher />
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.nav.close : t.nav.menu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-border bg-background md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {navLinks.map((link) => {
              const active = isActive(pathname, link.href)
              return (
                <li key={link.href}>
                  <Link
                    href={`/${lang}${link.href === '/' ? '' : link.href}`}
                    onClick={() => setOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'block rounded-xl px-4 py-3 text-base font-semibold',
                      active ? 'bg-accent text-accent-foreground' : 'hover:bg-muted',
                    )}
                  >
                    {t.nav[link.key]}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
      {cartOpen && <div className="fixed inset-0 z-[70] flex justify-end bg-black/40" onClick={() => setCartOpen(false)}>
        <aside role="dialog" aria-modal="true" aria-label={lang === 'ar' ? 'سلة التسوق' : 'Shopping cart'} onClick={e => e.stopPropagation()} className="flex h-full w-full max-w-md flex-col bg-background p-5 shadow-2xl">
          <div className="flex items-center justify-between"><h2 className="text-xl font-extrabold">{lang === 'ar' ? 'سلة التسوق' : 'Shopping cart'} ({count})</h2><button onClick={() => setCartOpen(false)} aria-label={lang === 'ar' ? 'إغلاق السلة' : 'Close cart'} className="rounded-full border p-2"><X className="size-5"/></button></div>
          <div className="mt-5 flex-1 space-y-3 overflow-y-auto">{items.length===0?<p className="py-10 text-center text-muted-foreground">{lang==='ar'?'سلتك فارغة':'Your cart is empty'}</p>:items.map(item=><div key={item.slug} className="rounded-xl border bg-card p-3"><Link onClick={()=>setCartOpen(false)} href={`/shop/${item.slug}`} className="font-bold">{item.name[lang]}</Link><p className="mt-1 text-sm font-bold text-primary">{formatPrice(item.price,lang)}</p><div className="mt-2 flex items-center gap-3"><button onClick={()=>setQuantity(item.slug,item.quantity-1)} className="rounded-full border px-3 py-1">−</button><span>{item.quantity}</span><button onClick={()=>setQuantity(item.slug,item.quantity+1)} className="rounded-full border px-3 py-1">+</button><button onClick={()=>remove(item.slug)} className="ms-auto text-sm text-red-600">{lang==='ar'?'إزالة':'Remove'}</button></div></div>)}</div>
          <div className="border-t pt-4"><div className="flex justify-between font-extrabold"><span>{lang==='ar'?'المجموع الفرعي':'Subtotal'}</span><span>{formatPrice(subtotal,lang)}</span></div><Link href="/cart" onClick={()=>setCartOpen(false)} className="mt-3 block rounded-full border border-primary px-5 py-3 text-center font-bold text-primary">{lang==='ar'?'عرض السلة':'View cart'}</Link><Link href="/checkout" onClick={()=>setCartOpen(false)} className="mt-2 block rounded-full bg-primary px-5 py-3 text-center font-bold text-white">{lang==='ar'?'إتمام الطلب':'Checkout'}</Link></div>
        </aside>
      </div>}
    </header>
  )
}
