import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LocalizedPageHeader } from '@/components/localized-page-header'
import { ShopBrowser } from '@/components/shop/shop-browser'
import { categoryIds, type CategoryId } from '@/lib/products'
import { getPublishedProducts } from '@/lib/server-products'
import { getLang } from '@/lib/server-lang'
const base=(process.env.NEXT_PUBLIC_SITE_URL||'https://petwise-jo.netlify.app').replace(/\/$/,'')
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;if(!categoryIds.includes(slug as CategoryId))return {}
 const lang=await getLang();const names={dog:{ar:'الكلاب',en:'Dogs'},cat:{ar:'القطط',en:'Cats'},birds:{ar:'الطيور',en:'Birds'},fish:{ar:'الأسماك',en:'Fish'},'small-pets':{ar:'الحيوانات الصغيرة',en:'Small Pets'},accessories:{ar:'الإكسسوارات',en:'Accessories'}} as const
 const name=names[slug as CategoryId][lang];const title=lang==='ar'?`${name} | متجر PetWise`:`${name} | PetWise Shop`;const description=lang==='ar'?`تسوق منتجات ${name} من PetWise في عمّان، الأردن.`:`Shop ${name.toLowerCase()} products at PetWise in Amman, Jordan.`
 return {title,description,alternates:{canonical:`${base}/${lang}/shop/category/${slug}`,languages:{'ar-JO':`${base}/ar/shop/category/${slug}`,'en-JO':`${base}/en/shop/category/${slug}`}}}
}
export default async function CategoryPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;if(!categoryIds.includes(slug as CategoryId))notFound()
 const products=await getPublishedProducts()
 return <><LocalizedPageHeader page="shop"/><ShopBrowser key={slug} initialCategory={slug as CategoryId} products={products}/></>
}
