import { LocalizedPageHeader } from '@/components/localized-page-header'
import { ContactContent } from '@/components/contact/contact-content'
import { pageMetadata } from '@/lib/server-lang'

export const generateMetadata = () => pageMetadata('contact')

export default function ContactPage() {
  return (
    <>
      <LocalizedPageHeader page="contact" />
      <ContactContent />
    </>
  )
}
