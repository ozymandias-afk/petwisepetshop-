import { LocalizedPageHeader } from '@/components/localized-page-header'
import { ServicesGrid } from '@/components/services/services-grid'
import { AppointmentForm } from '@/components/services/appointment-form'
import { pageMetadata } from '@/lib/server-lang'

export const generateMetadata = () => pageMetadata('services')

export default function ServicesPage() {
  return (
    <>
      <LocalizedPageHeader page="services" />
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-12 sm:px-6">
        <ServicesGrid />
        <AppointmentForm />
      </div>
    </>
  )
}
