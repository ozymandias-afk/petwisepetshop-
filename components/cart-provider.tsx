'use client'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { products as fallbackProducts, type Product } from '@/lib/products'
import type { CartProduct } from '@/lib/cart-types'

type CartContextType = {
  items: CartProduct[]
  count: number
  subtotal: number
  add: (product: Product | string, quantity?: number) => void
  setQuantity: (slug: string, quantity: number) => void
  remove: (slug: string) => void
  clear: () => void
  open: () => void
  close: () => void
  isOpen: boolean
}

const CartContext = createContext<CartContextType | null>(null)
const KEY = 'petwise-cart-v2'

export function CartProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<Record<string, CartProduct>>({})
  const [ready, setReady] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) {
        const value = JSON.parse(raw)
        if (Array.isArray(value)) {
          setStored(Object.fromEntries(
            value
              .filter((p: any) => p && typeof p.slug === 'string' && Number(p.quantity) > 0)
              .map((p: CartProduct) => [p.slug, p])
          ))
        } else if (value && typeof value === 'object') {
          setStored(value)
        }
      }
    } catch {}
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(Object.values(stored)))
  }, [stored, ready])

  const add = useCallback((productOrSlug: Product | string, quantity = 1) => {
    const product = typeof productOrSlug === 'string'
      ? fallbackProducts.find(p => p.slug === productOrSlug)
      : productOrSlug
    if (!product) return
    setStored(v => ({
      ...v,
      [product.slug]: {
        ...(v[product.slug] || {}),
        ...product,
        quantity: Math.min(99, Math.max(1, (v[product.slug]?.quantity || 0) + quantity))
      }
    }))
  }, [])

  const setQuantity = useCallback((slug: string, quantity: number) => setStored(v => {
    const next = { ...v }
    if (quantity <= 0) delete next[slug]
    else if (next[slug]) next[slug] = { ...next[slug], quantity: Math.min(99, Math.floor(quantity)) }
    return next
  }), [])

  const remove = useCallback((slug: string) => setStored(v => {
    const n = { ...v }
    delete n[slug]
    return n
  }), [])

  const clear = useCallback(() => setStored({}), [])

  const items = useMemo(() => Object.values(stored), [stored])
  const count = items.reduce((n, p) => n + p.quantity, 0)
  const subtotal = items.reduce((n, p) => n + p.price * p.quantity, 0)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return (
    <CartContext.Provider value={{ items, count, subtotal, add, setQuantity, remove, clear, open, close, isOpen }}>
      {children}

      {/* Cart Drawer */}
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={close}></div>

          {/* Drawer panel */}
          <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl p-6 z-50">
            <h2 className="text-xl font-bold mb-4">Shopping Cart ({count})</h2>
            {items.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item.slug} className="flex justify-between">
                    <span>{item.name.en} × {item.quantity}</span>
                    <span>{item.price * item.quantity} JOD</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-4 font-bold">Subtotal: {subtotal} JOD</p>
            <button onClick={close} className="mt-6 rounded bg-red-600 text-white px-4 py-2 font-bold">
              Close
            </button>
          </div>
        </>
      )}
    </CartContext.Provider>
  )
}

export function useCart() {
  const value = useContext(CartContext)
  if (!value) throw new Error('useCart must be used within CartProvider')
  return value
}
