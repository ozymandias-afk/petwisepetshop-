import type { MetadataRoute } from 'next'
export default function robots():MetadataRoute.Robots {
 const base=(process.env.NEXT_PUBLIC_SITE_URL||'https://petwise-jo.netlify.app').replace(/\/$/,'')
 return {rules:{userAgent:'*',allow:'/',disallow:['/admin','/checkout','/api/']},sitemap:`${base}/sitemap.xml`,host:base}
}
