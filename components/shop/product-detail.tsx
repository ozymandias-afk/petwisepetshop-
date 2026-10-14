'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Clock, MapPin, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/components/cart-provider'
import { getProduct, products as fallbackProducts, type Product } from '@/lib/products'
import { formatPrice } from '@/lib/i18n'
import { whatsappLink } from '@/lib/site'
import { pillButton } from '@/lib/styles'
import { useLanguage } from '../language-provider'
import { ProductCard } from '../product-card'
import { WhatsAppIcon } from '../brand-icons'

export function ProductDetail({ slug, product: suppliedProduct, allProducts = fallbackProducts }: { slug: string; product?: Product; allProducts?: Product[] }) {
  const { lang, t } = useLanguage()
  const { add } = useCart()
  const product = suppliedProduct || getProduct(slug)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(product?.image || '')
  if (!product) return null

  const name = product.name[lang]
  const related = allProducts.filter((p) => p.category === product.category && p.slug !== product.slug)
  const more = related.length ? related : allProducts.filter((p) => p.slug !== product.slug).slice(0, 4)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link href={`/${lang}/shop`} className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary">
        <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
        {t.shop.back}
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-border bg-card">
            <Image src={selectedImage || product.image} alt={name} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          {(product.images?.length || 0) > 1 && <div className="mt-3 flex gap-3 overflow-x-auto">{product.images!.map((img) => <button type="button" key={img} onClick={() => setSelectedImage(img)} aria-label={lang === 'ar' ? 'عرض صورة المنتج' : 'View product image'} className={`relative size-20 shrink-0 overflow-hidden rounded-xl border-2 ${selectedImage===img?'border-primary':'border-border'}`}><Image src={img} alt={name} fill sizes="80px" className="object-cover"/></button>)}</div>}
        </div>

        <div className="flex flex-col items-start gap-5">
          <Link
            href={`/${lang}/shop/category/${product.category}`}
            className="rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-accent-foreground"
          >
            {t.categories.names[product.category]}
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">{name}</h1>
          <p className="text-3xl font-extrabold text-primary">{formatPrice(product.price, lang)}</p>
          <p className="text-base leading-relaxed text-muted-foreground">{product.description[lang]}</p>
          <p className="text-sm font-semibold">{(product.stock ?? 20) > 0 ? (lang === 'ar' ? `متوفر (${product.stock ?? 20})` : `In stock (${product.stock ?? 20})`) : (lang === 'ar' ? 'غير متوفر حالياً' : 'Out of stock')}</p>
          <div className="flex items-center gap-3">
            <label htmlFor="product-quantity" className="text-sm font-bold">{lang === 'ar' ? 'الكمية' : 'Quantity'}</label>
            <input id="product-quantity" type="number" min={1} max={(product.stock ?? 99) > 0 ? product.stock ?? 99 : 1} value={quantity} onChange={e => setQuantity(Math.max(1, Math.min((product.stock ?? 99) > 0 ? product.stock ?? 99 : 1, Number(e.target.value) || 1)))} className="w-20 rounded-xl border border-input bg-card p-2 text-center" />
            <button type="button" disabled={(product.stock ?? 20) <= 0} onClick={() => add(product, quantity)} className={pillButton({variant:'outline',size:'lg'})}><ShoppingCart className="size-4" />{lang === 'ar' ? 'أضف إلى السلة' : 'Add to cart'}</button>
          </div>
          <a
            href={whatsappLink([
              `${lang === 'ar' ? 'مرحباً PetWise، أريد طلب المنتج:' : 'Hello PetWise, I would like to order:'} ${name}`,
              `${lang === 'ar' ? 'السعر' : 'Price'}: ${product.price.toFixed(2)} JOD`,
              `${lang === 'ar' ? 'الكمية' : 'Quantity'}: ${quantity}`,
              `${lang === 'ar' ? 'رابط المنتج' : 'Product link'}: ${(process.env.NEXT_PUBLIC_SITE_URL || 'https://petwise-jo.netlify.app')}/${lang}/shop/${product.slug}`,
              `${lang === 'ar' ? 'صورة المنتج' : 'Product image'}: ${product.image.startsWith('http') ? product.image : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://petwise-jo.netlify.app'}${product.image}`}`,
            ].join('\n'))}
            target="_blank"
            rel="noopener noreferrer"
            className={pillButton({ variant: 'whatsapp', size: 'lg', className: 'w-full sm:w-auto' })}
          >
            <WhatsAppIcon />
            {t.common.orderWhatsapp}
          </a>
          <ul className="mt-2 flex w-full flex-col gap-3 rounded-2xl bg-card p-5 text-sm">
            <li className="flex items-center gap-3">
              <Clock className="size-5 shrink-0 text-primary" aria-hidden="true" />
              {t.footer.hoursValue}
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="size-5 shrink-0 text-primary" aria-hidden="true" />
              {t.contact.address}
            </li>
          </ul>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-extrabold">{t.shop.related}</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {more.slice(0, 4).map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </div>
  )
}
