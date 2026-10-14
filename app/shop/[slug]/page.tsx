import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductDetail } from '@/components/shop/product-detail'
import { getPublishedProduct, getPublishedProducts } from '@/lib/server-products'
import { getLang } from '@/lib/server-lang'
type Props = { params: Promise<{ slug: string }> }
const baseUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || 'https://petwise-jo.netlify.app').replace(/\/$/,'')
export async function generateMetadata({ params }: Props): Promise<Metadata> {
 const {slug}=await params;const product=await getPublishedProduct(slug);if(!product)return {}
 const lang=await getLang();const title=`${product.name[lang]} | PetWise`;const localizedUrl=`${baseUrl()}/${lang}/shop/${slug}`;const image=product.image.startsWith('http')?product.image:`${baseUrl()}${product.image}`
 return {title,description:product.description[lang],alternates:{canonical:localizedUrl,languages:{'ar-JO':`${baseUrl()}/ar/shop/${slug}`,'en-JO':`${baseUrl()}/en/shop/${slug}`}},openGraph:{type:'website',title,description:product.description[lang],url:localizedUrl,images:[{url:image,alt:product.name[lang]}],locale:lang==='ar'?'ar_JO':'en_JO'},twitter:{card:'summary_large_image',title,description:product.description[lang],images:[image]},other:{'product:price:amount':String(product.price),'product:price:currency':'JOD'}}
}
export default async function ProductPage({params}:Props){
 const {slug}=await params;const product=await getPublishedProduct(slug);if(!product)notFound()
 const allProducts=await getPublishedProducts();const lang=await getLang();const image=product.images?.length?product.images.map(i=>i.startsWith('http')?i:`${baseUrl()}${i}`):[product.image.startsWith('http')?product.image:`${baseUrl()}${product.image}`]
 const jsonLd={'@context':'https://schema.org','@type':'Product',name:product.name[lang],description:product.description[lang],image,sku:product.slug,offers:{'@type':'Offer',priceCurrency:'JOD',price:product.price,availability:(product.stock??20)>0?'https://schema.org/InStock':'https://schema.org/OutOfStock',url:`${baseUrl()}/shop/${slug}`}}
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd).replace(/</g,'\\u003c')}}/><ProductDetail slug={slug} product={product} allProducts={allProducts}/></>
}
