import type { Product } from './products'
export type CartItem = { slug: string; quantity: number }
export type CartProduct = Product & { quantity: number }
