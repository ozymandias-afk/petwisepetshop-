import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './utils'

const pillButtonBase = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-bold whitespace-nowrap transition-all duration-200 focus-visible:ring-4 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:ring-primary/30',
        outline:
          'border-2 border-foreground/15 bg-card text-foreground hover:-translate-y-0.5 hover:border-primary hover:text-primary focus-visible:ring-primary/20',
        whatsapp:
          'bg-whatsapp text-white hover:-translate-y-0.5 hover:bg-whatsapp/90 focus-visible:ring-whatsapp/30',
        soft: 'bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground focus-visible:ring-primary/20',
      },
      size: {
        sm: 'h-10 px-4 text-sm [&_svg]:size-4',
        md: 'h-12 px-6 text-sm [&_svg]:size-4',
        lg: 'h-14 px-7 text-base [&_svg]:size-5',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export function pillButton({ className, ...variants }: VariantProps<typeof pillButtonBase> & { className?: string } = {}) {
  return cn(pillButtonBase(variants), className)
}
