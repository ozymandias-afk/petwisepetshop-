import { Bath, House, PawPrint, Scissors, Sparkles, Stethoscope, Syringe, type LucideIcon } from 'lucide-react'
import type { Dictionary } from '@/lib/i18n'

export type ServiceId = keyof Dictionary['services']['items']

export const serviceList: { id: ServiceId; Icon: LucideIcon }[] = [
  { id: 'checkup', Icon: Stethoscope },
  { id: 'vaccination', Icon: Syringe },
  { id: 'grooming', Icon: Scissors },
  { id: 'bathing', Icon: Bath },
  { id: 'nails', Icon: PawPrint },
  { id: 'dental', Icon: Sparkles },
  { id: 'boarding', Icon: House },
]
