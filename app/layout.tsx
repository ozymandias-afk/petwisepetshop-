import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cairo, Nunito } from 'next/font/google'
import { LanguageProvider } from '@/components/language-provider'
import { CartProvider } from '@/components/cart-provider'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppFab } from '@/components/whatsapp-fab'
import { getLang, pageMetadata } from '@/lib/server-lang'
import './globals.css'

const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo', display: 'swap' })
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito', display: 'swap' })

export async function generateMetadata(): Promise<Metadata> {
  const base = await pageMetadata('home')
  return {
    ...base,
    title: { default: base.title as string, template: '%s' },
    icons: { icon: '/images/petwise-logo.jpg', apple: '/images/petwise-logo.jpg' },
  }
}

export const viewport: Viewport = {
  themeColor: '#e2141c',
  colorScheme: 'light',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const lang = await getLang()

  return (
    <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} className={`${cairo.variable} ${nunito.variable}`}>
      <body className="min-h-dvh antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({
          '@context':'https://schema.org','@type':'PetStore','name':'PetWise',
          'url':process.env.NEXT_PUBLIC_SITE_URL || 'https://petwise-jo.netlify.app',
          'image':`${process.env.NEXT_PUBLIC_SITE_URL || 'https://petwise-jo.netlify.app'}/images/petwise-shop.webp`,
          'telephone':'+962795606749','priceRange':'JOD',
          'address':{'@type':'PostalAddress','streetAddress':'Rafaa Shammout Street','addressLocality':'Amman','addressCountry':'JO'},
          'openingHoursSpecification':[{'@type':'OpeningHoursSpecification','dayOfWeek':['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],'opens':'10:00','closes':'23:59'}],
          'sameAs':['https://www.instagram.com/petwise.jo','https://web.facebook.com/people/Petwise/61594722458695/']
        }).replace(/</g,'\\u003c')}} />
        <LanguageProvider initialLang={lang}>
          <CartProvider>
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
            <WhatsAppFab />
          </CartProvider>
        </LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
