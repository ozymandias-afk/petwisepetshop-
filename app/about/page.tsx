import { LocalizedPageHeader } from '@/components/localized-page-header'
import { AboutContent } from '@/components/about/about-content'
import { pageMetadata } from '@/lib/server-lang'

export const generateMetadata = () => pageMetadata('about')

export default function AboutPage() {
  return (
    <>
      <LocalizedPageHeader page="about" />
      <AboutContent />
    </>
  )
}
