import type { Metadata } from 'next'
import { getLang } from '@/lib/server-lang'
export async function generateMetadata(): Promise<Metadata> {
 const ar=(await getLang())==='ar'
 return {title:ar?'لوحة تحكم PetWise':'PetWise Admin',description:ar?'لوحة إدارة محمية لمتجر PetWise.':'Protected PetWise shop administration.',robots:{index:false,follow:false}}
}
export default function AdminLayout({children}:{children:React.ReactNode}) { return children }
