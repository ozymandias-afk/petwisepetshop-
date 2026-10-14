import { createClient } from '@supabase/supabase-js'
import { products as fallback, type Product } from './products'
export async function getPublishedProducts(): Promise<Product[]> {
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
 const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
 if(!url||!key)return fallback
 try{
  const db=createClient(url,key,{auth:{persistSession:false}})
  const {data,error}=await db.from('products').select('*').eq('active',true).order('created_at',{ascending:false})
  if(error||!data?.length)return fallback
  return data.map((p:any)=>({slug:p.slug,category:p.category,price:Number(p.price),image:p.images?.[0]||p.image||'/images/products/cat-food.png',images:p.images||[],stock:p.stock,active:p.active,name:p.name,description:p.description,featured:p.featured}))
 }catch{return fallback}
}
export async function getPublishedProduct(slug:string):Promise<Product|undefined>{
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
 const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
 if(url&&key){
  try{
   const db=createClient(url,key,{auth:{persistSession:false}})
   const {data,error}=await db.from('products').select('*').eq('slug',slug).eq('active',true).maybeSingle()
   if(!error)return data?{slug:data.slug,category:data.category,price:Number(data.price),image:data.images?.[0]||data.image||'/images/products/cat-food.png',images:data.images||[],stock:data.stock,active:data.active,name:data.name,description:data.description,featured:data.featured}:undefined
  }catch{}
 }
 return fallback.find(p=>p.slug===slug)
}
