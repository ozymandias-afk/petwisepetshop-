import { PawPrint } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SectionHeading({
  title,
  subtitle,
  align = 'start',
  as: Tag = 'h2',
  className,
}: {
  title: string
  subtitle?: string
  align?: 'start' | 'center'
  as?: 'h1' | 'h2'
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-3', align === 'center' && 'items-center text-center', className)}>
      <PawPrint className="size-6 text-primary" aria-hidden="true" />
      <Tag className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">{title}</Tag>
      {subtitle && <p className="max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">{subtitle}</p>}
    </div>
  )
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading as="h1" title={title} subtitle={subtitle} />
      </div>
    </section>
  )
}
