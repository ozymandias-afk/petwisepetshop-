import type { Metadata } from 'next'
import { getLang } from '@/lib/server-lang'
export async function generateMetadata(): Promise<Metadata> {
 const ar=(await getLang())==='ar'
 return {title:ar?'سلة التسوق | PetWise':'Shopping Cart | PetWise',description:ar?'راجع منتجاتك في سلة PetWise قبل إتمام الطلب.':'Review your PetWise shopping cart and continue to checkout.',robots:{index:false,follow:false}}
}
export default function CartLayout({children}:{children:React.ReactNode}) { return children }
