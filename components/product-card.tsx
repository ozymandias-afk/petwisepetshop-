'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/lib/products'
import { formatPrice } from '@/lib/i18n'
import { whatsappLink } from '@/lib/site'
import { pillButton } from '@/lib/styles'
import { useLanguage } from './language-provider'
import { WhatsAppIcon } from './brand-icons'
import { ShoppingCart } from 'lucide-react'
import { useCart } from './cart-provider'

export function ProductCard({ product }: { product: Product }) {
  const { lang, t } = useLanguage()
  const { add } = useCart()
  const name = product.name[lang]

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-foreground/5">
      <Link href={`/${lang}/shop/${product.slug}`} className="relative block aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute start-3 top-3 rounded-full bg-card/90 px-3 py-1 text-xs font-bold text-foreground backdrop-blur">
          {t.categories.names[product.category]}
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 text-sm leading-snug font-bold sm:text-base">
          <Link href={`/${lang}/shop/${product.slug}`} className="hover:text-primary">
            {name}
          </Link>
        </h3>
        <p className="text-lg font-extrabold text-primary">{formatPrice(product.price, lang)}</p>
        <a
          href={whatsappLink(`${lang === 'ar' ? 'مرحباً PetWise، أريد طلب المنتج:' : 'Hello PetWise, I would like to order:'} ${name}\n${lang === 'ar' ? 'السعر' : 'Price'}: ${product.price.toFixed(2)} JOD\n${lang === 'ar' ? 'الكمية' : 'Quantity'}: 1\n${lang === 'ar' ? 'رابط المنتج' : 'Product link'}: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://petwise-jo.netlify.app'}/${lang}/shop/${product.slug}\n${lang === 'ar' ? 'صورة المنتج' : 'Product image'}: ${product.image.startsWith('http') ? product.image : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://petwise-jo.netlify.app'}${product.image}`}`)}
          target="_blank"
          rel="noopener noreferrer"
          className={pillButton({
            variant: 'whatsapp',
            size: 'sm',
            className: 'mt-auto h-auto min-h-10 w-full px-3 py-2 text-xs leading-tight whitespace-normal sm:text-sm',
          })}
        >
          <WhatsAppIcon />
          <span className="text-center">{t.common.orderWhatsapp}</span>
        </a>
        <button type="button" disabled={(product.stock ?? 20) <= 0} onClick={() => add(product)} className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-primary/30 px-3 py-2 text-xs font-bold text-primary transition-colors hover:bg-accent sm:text-sm">
          <ShoppingCart className="size-4" /> {lang === 'ar' ? 'أضف إلى السلة' : 'Add to cart'}
        </button>
      </div>
    </article>
  )
}
