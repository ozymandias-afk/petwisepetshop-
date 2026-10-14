import type { Metadata } from 'next'
import { getLang } from '@/lib/server-lang'
export async function generateMetadata(): Promise<Metadata> {
 const ar=(await getLang())==='ar'
 return {title:ar?'إتمام الطلب | PetWise':'Checkout | PetWise',description:ar?'أكمل بيانات التوصيل والدفع لطلب PetWise.':'Complete delivery and payment details for your PetWise order.',robots:{index:false,follow:false}}
}
export default function CheckoutLayout({children}:{children:React.ReactNode}) { return children }
