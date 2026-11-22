import { useMemo, useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { mockShop, mockProducts, type Product } from '../lib/mock'
import { useCart } from '../lib/cart'
import { formatNaira } from '../lib/money'

function stockBadge(p: Product) {
  if (p.stockQty <= 0) return { text: 'Out of stock', cls: 'bg-slate-200 text-slate-600' }
  if (p.stockQty <= p.lowStockAlert) return { text: `Only ${p.stockQty} left`, cls: 'bg-amber-100 text-amber-700' }
  return { text: 'In stock', cls: 'bg-emerald-100 text-emerald-700' }
}

function Sheet({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export default function Storefront() {
  const { slug = 'shop' } = useParams({ strict: false }) as { slug?: string }
  const cart = useCart(slug)
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState<Product | null>(null)
  const [cartOpen, setCartOpen] = useState(false)

  const categories = ['All', ...Array.from(new Set(mockProducts.map((p) => p.category)))]
  const products = useMemo(
    () =>
      mockProducts.filter(
        (p) =>
          (category === 'All' || p.category === category) &&
          p.name.toLowerCase().includes(query.toLowerCase())
      ),
    [query, category]
  )

  return (
    <div className="min-h-screen bg-slate-50 pb-28 text-slate-900">
      {/* Header */}
      <header className="bg-white px-4 pb-4 pt-6 shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-2xl font-bold text-white">
            {mockShop.name[0]}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-bold">{mockShop.name}</h1>
            <p className="line-clamp-2 text-sm text-slate-500">{mockShop.description}</p>
          </div>
          <a
            href={`https://wa.me/${mockShop.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
          >
            WhatsApp
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-4 px-4 pt-4">
        {/* Search + categories */}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500"
        />
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium ${
                category === c ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {products.map((p) => {
            const badge = stockBadge(p)
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className="overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-slate-100"
              >
                <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-emerald-100 to-slate-200 text-4xl font-bold text-emerald-700/60">
                  {p.name[0]}
                </div>
                <div className="space-y-1 p-3">
                  <p className="truncate font-semibold">{p.name}</p>
                  <p className="font-bold text-emerald-700">{formatNaira(p.sellingPrice)}</p>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${badge.cls}`}>
                    {badge.text}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
        {products.length === 0 && <p className="py-10 text-center text-slate-500">No products found.</p>}
      </main>

      {/* Sticky cart bar */}
      {cart.count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 p-4">
          <button
            onClick={() => setCartOpen(true)}
            className="mx-auto flex w-full max-w-lg items-center justify-between rounded-2xl bg-slate-900 px-5 py-4 font-semibold text-white shadow-lg"
          >
            <span>View cart ({cart.count})</span>
            <span>{formatNaira(cart.total)}</span>
          </button>
        </div>
      )}

      {selected && (
        <ProductSheet
          product={selected}
          onClose={() => setSelected(null)}
          onAdd={(variant, qty) => {
            cart.add({ productId: selected.id, name: selected.name, price: selected.sellingPrice, qty, variant })
            setSelected(null)
          }}
        />
      )}

      {cartOpen && (
        <Sheet onClose={() => setCartOpen(false)}>
          <h2 className="mb-4 text-xl font-bold">Your cart</h2>
          {cart.items.length === 0 && <p className="text-slate-500">Your cart is empty.</p>}
          <div className="space-y-3">
            {cart.items.map((i) => (
              <div key={i.productId + i.variant} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{i.name}</p>
                  <p className="text-sm text-slate-500">
                    {i.variant ? `${i.variant} · ` : ''}{formatNaira(i.price)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => cart.setQty(i.productId, i.variant, i.qty - 1)} className="h-8 w-8 rounded-full bg-slate-100 font-bold">−</button>
                  <span className="w-5 text-center font-semibold">{i.qty}</span>
                  <button onClick={() => cart.setQty(i.productId, i.variant, i.qty + 1)} className="h-8 w-8 rounded-full bg-slate-100 font-bold">+</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-between border-t pt-4 text-lg font-bold">
            <span>Total</span>
            <span>{formatNaira(cart.total)}</span>
          </div>
          <button
            disabled={cart.items.length === 0}
            onClick={() => navigate({ to: '/$slug/checkout', params: { slug } })}
            className="mt-4 w-full rounded-xl bg-emerald-600 py-4 font-bold text-white disabled:opacity-40"
          >
            Checkout
          </button>
        </Sheet>
      )}
    </div>
  )
}

function ProductSheet({ product, onClose, onAdd }: {
  product: Product
  onClose: () => void
  onAdd: (variant: string | undefined, qty: number) => void
}) {
  const [variant, setVariant] = useState<string | undefined>(product.variants[0])
  const [qty, setQty] = useState(1)
  const out = product.stockQty <= 0
  const badge = stockBadge(product)

  return (
    <Sheet onClose={onClose}>
      <div className="mb-4 flex aspect-video items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-slate-200 text-6xl font-bold text-emerald-700/60">
        {product.name[0]}
      </div>
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-bold">{product.name}</h2>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge.cls}`}>{badge.text}</span>
      </div>
      <p className="mt-1 text-2xl font-bold text-emerald-700">{formatNaira(product.sellingPrice)}</p>
      <p className="mt-2 text-slate-600">{product.description}</p>

      {product.variants.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-slate-500">Option</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v}
                onClick={() => setVariant(v)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                  variant === v ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        <p className="text-sm font-medium text-slate-500">Quantity</p>
        <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-9 w-9 rounded-full bg-slate-100 font-bold">−</button>
        <span className="w-6 text-center font-semibold">{qty}</span>
        <button onClick={() => setQty((q) => Math.min(product.stockQty, q + 1))} className="h-9 w-9 rounded-full bg-slate-100 font-bold">+</button>
      </div>

      <button
        disabled={out}
        onClick={() => onAdd(variant, qty)}
        className="mt-5 w-full rounded-xl bg-emerald-600 py-4 font-bold text-white disabled:opacity-40"
      >
        {out ? 'Out of stock' : `Add to cart · ${formatNaira(product.sellingPrice * qty)}`}
      </button>
    </Sheet>
  )
}