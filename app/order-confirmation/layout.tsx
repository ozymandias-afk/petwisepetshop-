import type { Metadata } from 'next'
import { getLang } from '@/lib/server-lang'
export async function generateMetadata(): Promise<Metadata> {
 const ar=(await getLang())==='ar'
 return {title:ar?'تأكيد الطلب | PetWise':'Order Confirmation | PetWise',description:ar?'تأكيد طلبك والخطوات التالية مع PetWise.':'Your PetWise order confirmation and next steps.',robots:{index:false,follow:false}}
}
export default function ConfirmationLayout({children}:{children:React.ReactNode}) { return children }
