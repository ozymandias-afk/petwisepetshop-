import type { MetadataRoute } from 'next'
import { categoryIds } from '@/lib/products'
import { getPublishedProducts } from '@/lib/server-products'
const base=(process.env.NEXT_PUBLIC_SITE_URL||'https://petwise-jo.netlify.app').replace(/\/$/,'')
export default async function sitemap():Promise<MetadataRoute.Sitemap> {
 const pages=['','shop','services','about','contact']
 const routes:MetadataRoute.Sitemap=[]
 for(const page of pages)for(const lang of ['ar','en'] as const)routes.push({url:`${base}/${lang}${page?`/${page}`:''}`,lastModified:new Date(),changeFrequency:page==='shop'?'daily':'monthly',priority:page===''?1:0.7})
 for(const category of categoryIds)for(const lang of ['ar','en'] as const)routes.push({url:`${base}/${lang}/shop/category/${category}`,lastModified:new Date(),changeFrequency:'weekly',priority:0.7})
 const products=await getPublishedProducts()
 for(const p of products)for(const lang of ['ar','en'] as const)routes.push({url:`${base}/${lang}/shop/${p.slug}`,lastModified:new Date(),changeFrequency:'weekly',priority:0.8})
 return routes
}
