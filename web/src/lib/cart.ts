import { useEffect, useState } from 'react'

export type CartItem = {
  productId: string
  name: string
  price: number // Kobo
  qty: number
  variant?: string
}

export function useCart(slug: string) {
  const key = `vl_cart_${slug}`
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
  })

  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(items)) } catch { /* ignore */ }
  }, [key, items])

  const add = (item: CartItem) =>
    setItems((prev) => {
      const i = prev.findIndex((p) => p.productId === item.productId && p.variant === item.variant)
      if (i < 0) return [...prev, item]
      const copy = [...prev]
      copy[i] = { ...copy[i], qty: copy[i].qty + item.qty }
      return copy
    })

  const setQty = (productId: string, variant: string | undefined, qty: number) =>
    setItems((prev) =>
      prev
        .map((p) => (p.productId === productId && p.variant === variant ? { ...p, qty } : p))
        .filter((p) => p.qty > 0)
    )

  const clear = () => setItems([])
  const total = items.reduce((s, i) => s + i.price * i.qty, 0)
  const count = items.reduce((s, i) => s + i.qty, 0)

  return { items, add, setQty, clear, total, count }
}