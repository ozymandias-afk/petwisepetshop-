import { Bath, Bug, PawPrint, Salad, Scissors, Sparkles, type LucideIcon } from 'lucide-react'
import type { Dictionary } from '@/lib/i18n'

export type ServiceId = keyof Dictionary['services']['items']

export const serviceList: { id: ServiceId; Icon: LucideIcon }[] = [
  { id: 'grooming', Icon: Sparkles },
  { id: 'bathing', Icon: Bath },
  { id: 'haircut', Icon: Scissors },
  { id: 'nails', Icon: PawPrint },
  { id: 'deworming', Icon: Bug },
  { id: 'diet', Icon: Salad },
]
