import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { whatsappLink } from '@/lib/site'
export const runtime = 'nodejs'
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export async function POST(req: Request) {
 try {
  const body = await req.json()
  if (body.website) return NextResponse.json({error:'Invalid submission'}, {status:400})
  if (!body.name || String(body.name).trim().length < 2 || !/^\+?[0-9\s()-]{8,20}$/.test(String(body.phone||'')) || !body.city || !body.address || !Array.isArray(body.items) || !body.items.length || body.items.length > 40)
   return NextResponse.json({error:'Please complete all required fields with valid details.'},{status:400})
  if (body.email && !emailRe.test(String(body.email))) return NextResponse.json({error:'Please enter a valid email address.'},{status:400})
  if (!['delivery','pickup'].includes(body.deliveryType) || !['cod','cliq','card'].includes(body.paymentMethod)) return NextResponse.json({error:'Invalid order option.'},{status:400})
  if (body.paymentMethod === 'card') return NextResponse.json({error:'Online card payments are not configured yet. Please choose cash or transfer.'},{status:400})
  const url=process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return NextResponse.json({error:'Online ordering setup is not complete yet. Please contact the shop on WhatsApp.'},{status:503})
  const supabase=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})
  const slugs=[...new Set(body.items.map((i:any)=>String(i.slug)))]
  const {data:rows,error:productsError}=await supabase.from('products').select('slug,name,description,price,images,image,stock,active,category').in('slug',slugs).eq('active',true)
  if(productsError) throw productsError
  if(!rows || rows.length!==slugs.length) return NextResponse.json({error:'One or more products are unavailable.'},{status:400})
  const chosen=rows.map((p:any)=>({...p,image:p.images?.[0]||p.image||'',name:p.name,description:p.description,price:Number(p.price)}))
  const cleanItems=body.items.map((i:any)=>{const p=chosen.find((p:any)=>p.slug===i.slug)!;const quantity=Number(i.quantity);if(!Number.isInteger(quantity)||quantity<1||quantity>99)throw new Error('Invalid item quantity');if(Number(p.stock)<quantity)throw new Error(`Insufficient stock for ${p.name.en}`);return {product:p,quantity}})
  const total=cleanItems.reduce((s,i)=>s+i.product.price*i.quantity,0)
  const {data:customer,error:cErr}=await supabase.from('customers').upsert({name:String(body.name).trim().slice(0,160),phone:String(body.phone).trim().slice(0,30),email:body.email?String(body.email).trim().slice(0,200):null,addresses:[{city:String(body.city).slice(0,100),address:String(body.address).slice(0,500)}]}, {onConflict:'phone'}).select('id').single()
  if(cErr) throw cErr
  const orderNumber=`PW-${new Date().toISOString().slice(2,10).replaceAll('-','')}-${Math.random().toString(36).slice(2,7).toUpperCase()}`
  let proofPath=''
  if(body.transferScreenshot && body.paymentMethod==='cliq'){
    const match=String(body.transferScreenshot).match(/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/)
    if(!match || match[2].length>5_600_000) return NextResponse.json({error:'Invalid or oversized transfer screenshot.'},{status:400})
    const ext=match[1]==='image/png'?'png':match[1]==='image/webp'?'webp':'jpg'
    const bytes=Buffer.from(match[2],'base64')
    const path=`${orderNumber}.${ext}`
    const {error:uploadError}=await supabase.storage.from('payment-proofs').upload(path,bytes,{contentType:match[1],upsert:false})
    if(uploadError) throw uploadError
    proofPath=`Transfer screenshot stored securely: ${path}`
  }
  const {data:order,error:oErr}=await supabase.from('orders').insert({order_number:orderNumber,customer_id:customer.id,status:'New',payment_method:body.paymentMethod,payment_status:'Pending',delivery_type:body.deliveryType,total,notes:[body.notes,body.transferReference?`Transfer reference: ${String(body.transferReference).slice(0,100)}`:'',proofPath].filter(Boolean).join('\n'),delivery_city:String(body.city).slice(0,100),delivery_address:String(body.address).slice(0,500)}).select('id').single()
  if(oErr) throw oErr
  const {error:iErr}=await supabase.from('order_items').insert(cleanItems.map(i=>({order_id:order.id,product_slug:i.product.slug,product_name:i.product.name,quantity:i.quantity,unit_price:i.product.price,line_total:i.product.price*i.quantity,image:i.product.image})))
  if(iErr) throw iErr
  for(const item of cleanItems) {
    const current=Number(item.product.stock)
    await supabase.from('products').update({stock:Math.max(0,current-item.quantity)}).eq('slug',item.product.slug)
  }
  const lang=body.lang==='en'?'en':'ar';const base=(process.env.NEXT_PUBLIC_SITE_URL||'https://petwise-jo.netlify.app').replace(/\/$/,'')
  const summary=cleanItems.map(i=>`• ${i.product.name[lang]} × ${i.quantity} — ${(i.product.price*i.quantity).toFixed(2)} JOD\n${base}/${lang}/shop/${i.product.slug}`).join('\n')
  const adminMessage=`New PetWise order ${orderNumber}\nCustomer: ${body.name}\nPhone: ${body.phone}\nEmail: ${body.email||'-'}\nDelivery: ${body.deliveryType}\nPayment: ${body.paymentMethod}\n${summary}\nTotal: ${total.toFixed(2)} JOD\nAddress: ${body.city}, ${body.address}\nNotes: ${body.notes||'-'}`
  const customerMessage=lang==='ar'?`مرحباً ${body.name}، تم استلام طلبك رقم ${orderNumber} لدى PetWise. المجموع: ${total.toFixed(2)} دينار أردني.`:`Hello ${body.name}, PetWise received order ${orderNumber}. Total: ${total.toFixed(2)} JOD.`
  if(body.email && process.env.RESEND_API_KEY && process.env.ORDER_EMAIL_FROM){
    try { await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.ORDER_EMAIL_FROM,to:[body.email],subject:lang==='ar'?`تأكيد طلب PetWise ${orderNumber}`:`PetWise order confirmation ${orderNumber}`,text:`${customerMessage}\n\n${summary}`})}) } catch (emailError) { console.error('Customer email failed',emailError) }
  }
  if(process.env.RESEND_API_KEY && process.env.ORDER_EMAIL_FROM && process.env.SHOP_NOTIFICATION_EMAIL){
    try { await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.ORDER_EMAIL_FROM,to:[process.env.SHOP_NOTIFICATION_EMAIL],subject:`New PetWise order ${orderNumber}`,text:adminMessage})}) } catch (emailError) { console.error('Shop email failed',emailError) }
  }
  return NextResponse.json({orderNumber,adminWhatsApp:whatsappLink(adminMessage)})
 } catch(e) {
  console.error('Order submission failed',e)
  return NextResponse.json({error:e instanceof Error&&e.message==='Invalid item quantity'?'Invalid item quantity':'Could not save the order. Please try again or contact PetWise on WhatsApp.'},{status:500})
 }
}
