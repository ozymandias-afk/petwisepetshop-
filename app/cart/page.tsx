'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/components/cart-provider'
import { useLanguage } from '@/components/language-provider'
import { formatPrice } from '@/lib/i18n'
import { whatsappLink } from '@/lib/site'
import { Minus, Plus, Trash2 } from 'lucide-react'
export default function CartPage() {
  const {items,subtotal,setQuantity,remove}=useCart()
  const {lang}=useLanguage()
  const ar=lang==='ar'
  const message=[ar?'مرحباً PetWise، أريد طلب هذه المنتجات:':'Hello PetWise, I would like to order these products:',...items.map(p=>`• ${p.name[lang]} × ${p.quantity} — ${(p.price*p.quantity).toFixed(2)} JOD\n${process.env.NEXT_PUBLIC_SITE_URL || 'https://petwise-jo.netlify.app'}/${lang}/shop/${p.slug}`),`${ar?'المجموع الفرعي':'Subtotal'}: ${subtotal.toFixed(2)} JOD`].join('\n')
  return <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6"><h1 className="text-3xl font-extrabold">{ar?'سلة التسوق':'Shopping cart'}</h1>
    {items.length===0?<div className="mt-8 rounded-3xl border border-dashed p-10 text-center"><p>{ar?'سلتك فارغة':'Your cart is empty'}</p><Link className="mt-4 inline-flex rounded-full bg-primary px-6 py-3 font-bold text-white" href={`/${lang}/shop`}>{ar?'تصفح المنتجات':'Browse products'}</Link></div>:
    <><div className="mt-6 space-y-4">{items.map(p=><article key={p.slug} className="flex gap-4 rounded-2xl border border-border bg-card p-3 sm:p-4"><Image src={p.image} alt={p.name[lang]} width={100} height={100} className="size-24 rounded-xl object-cover"/><div className="min-w-0 flex-1"><Link href={`/${lang}/shop/${p.slug}`} className="font-bold hover:text-primary">{p.name[lang]}</Link><p className="mt-1 font-extrabold text-primary">{formatPrice(p.price,lang)}</p><div className="mt-3 flex items-center gap-2"><button aria-label="Decrease quantity" onClick={()=>setQuantity(p.slug,p.quantity-1)} className="rounded-full border p-2"><Minus className="size-4"/></button><span className="min-w-6 text-center">{p.quantity}</span><button aria-label="Increase quantity" onClick={()=>setQuantity(p.slug,p.quantity+1)} className="rounded-full border p-2"><Plus className="size-4"/></button><button onClick={()=>remove(p.slug)} className="ms-auto inline-flex items-center gap-1 text-sm text-red-600"><Trash2 className="size-4"/>{ar?'إزالة':'Remove'}</button></div></div></article>)}</div>
    <div className="mt-6 rounded-2xl bg-card p-5"><div className="flex justify-between text-lg font-extrabold"><span>{ar?'المجموع الفرعي':'Subtotal'}</span><span>{formatPrice(subtotal,lang)}</span></div><p className="mt-1 text-sm text-muted-foreground">{ar?'تكلفة التوصيل تحدد عند تأكيد الطلب.':'Delivery fees are confirmed with your order.'}</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><a href={whatsappLink(message)} target="_blank" rel="noreferrer" className="rounded-full bg-[#1fa855] px-5 py-3 text-center font-bold text-white">{ar?'إرسال السلة عبر واتساب':'Send cart on WhatsApp'}</a><Link href="/checkout" className="rounded-full bg-primary px-5 py-3 text-center font-bold text-white">{ar?'متابعة الدفع':'Proceed to checkout'}</Link></div></div></>}
  </div>
}
