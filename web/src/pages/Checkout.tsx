import { useState, type FormEvent } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { ArrowLeft, Check, Copy, MessageCircle, Upload } from 'lucide-react'
import { Button, Input, Field, inputCls } from '../components/ui'
import { useCart, type CartItem } from '../lib/cart'
import { mockShop } from '../lib/mock'
import { formatNaira } from '../lib/money'

type Placed = { number: string; items: CartItem[]; total: number; name: string; phone: string; address: string }

const STEPS = ['Your details', 'Payment', 'Done']

export default function Checkout() {
  const { slug = 'shop' } = useParams({ strict: false }) as { slug?: string }
  const cart = useCart(slug)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '' })
  const [placed, setPlaced] = useState<Placed | null>(null)
  const [copied, setCopied] = useState(false)
  const [receipt, setReceipt] = useState<string | null>(null)

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((p) => ({ ...p, [k]: e.target.value }))

  const copy = async () => {
    try { await navigator.clipboard.writeText(mockShop.bank.number) } catch { /* ignore */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const placeOrder = () => {
    setPlaced({
      number: `VL-${1043 + Math.floor(Math.random() * 50)}`,
      items: cart.items, total: cart.total,
      name: form.name, phone: form.phone, address: form.address,
    })
    cart.clear()
    setStep(2)
  }

  const waLink = placed
    ? `https://wa.me/${mockShop.whatsapp}?text=${encodeURIComponent(
        `Hello ${mockShop.name}, I just placed Order ${placed.number}.\n\n` +
        placed.items.map((i) => `• ${i.qty}x ${i.name}${i.variant ? ` (${i.variant})` : ''} - ${formatNaira(i.price * i.qty)}`).join('\n') +
        `\n\nTotal: ${formatNaira(placed.total)}\nName: ${placed.name}\nDelivery: ${placed.address}`
      )}`
    : '#'

  if (cart.items.length === 0 && !placed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-6 text-center">
        <p className="text-slate-600">Your cart is empty.</p>
        <Link to="/$slug" params={{ slug }} className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white">Back to shop</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <header className="bg-white px-4 py-4 shadow-sm">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          {step < 2 && (
            <Link to="/$slug" params={{ slug }} className="rounded-full bg-slate-100 p-2"><ArrowLeft size={18} /></Link>
          )}
          <h1 className="font-bold text-slate-900">{mockShop.name} · Checkout</h1>
        </div>
      </header>

      <div className="mx-auto max-w-lg space-y-5 px-4 pt-5">
        {/* Stepper */}
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i <= step ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {i < step ? <Check size={14} /> : i + 1}
              </span>
              <span className={`hidden text-xs font-medium sm:block ${i <= step ? 'text-slate-900' : 'text-slate-400'}`}>{s}</span>
              {i < 2 && <span className="h-px flex-1 bg-slate-200" />}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 0 && (
          <form
            onSubmit={(e: FormEvent) => { e.preventDefault(); setStep(1) }}
            className="space-y-4 rounded-2xl bg-white p-5 shadow-sm"
          >
            <Input label="Full name" required value={form.name} onChange={set('name')} />
            <Input label="WhatsApp number" type="tel" required value={form.phone} onChange={set('phone')} placeholder="+234..." />
            <Field label="Delivery address">
              <textarea required rows={3} value={form.address} onChange={set('address')} className={inputCls} />
            </Field>
            <Field label="Order notes (optional)">
              <textarea rows={2} value={form.note} onChange={set('note')} className={inputCls} />
            </Field>
            <Button type="submit" className="w-full">Continue to payment</Button>
          </form>
        )}

        {/* Step 2 */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="mb-3 font-bold">Order summary</h2>
              <div className="space-y-2 text-sm">
                {cart.items.map((i) => (
                  <div key={i.productId + i.variant} className="flex justify-between">
                    <span className="text-slate-600">{i.qty}× {i.name}{i.variant ? ` (${i.variant})` : ''}</span>
                    <span className="font-medium">{formatNaira(i.price * i.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between border-t pt-3 text-lg font-bold">
                <span>Total to pay</span><span className="text-emerald-700">{formatNaira(cart.total)}</span>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900 p-5 text-white shadow-sm">
              <p className="text-sm text-slate-400">Transfer to this account</p>
              <p className="mt-1 font-semibold">{mockShop.bank.name}</p>
              <div className="mt-1 flex items-center justify-between">
                <p className="text-3xl font-extrabold tracking-wider">{mockShop.bank.number}</p>
                <button onClick={copy} className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-bold text-slate-950">
                  {copied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy</>}
                </button>
              </div>
              <p className="mt-1 text-slate-300">{mockShop.bank.accountName}</p>
            </div>

            <Button onClick={placeOrder} className="w-full">I've made the transfer, place order</Button>
            <button onClick={() => setStep(0)} className="w-full text-sm text-slate-500">Back</button>
          </div>
        )}

        {/* Step 3 */}
        {step === 2 && placed && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Check size={28} />
              </div>
              <h2 className="text-xl font-extrabold">Order placed!</h2>
              <p className="mt-1 text-slate-500">Your order number is</p>
              <p className="text-2xl font-extrabold text-emerald-700">{placed.number}</p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="font-bold">Upload your transfer receipt</h3>
              <p className="mb-3 text-sm text-slate-500">This helps the seller confirm your payment faster.</p>
              {receipt ? (
                <img src={receipt} alt="Receipt" className="max-h-60 w-full rounded-xl object-contain ring-1 ring-slate-200" />
              ) : (
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-8 text-slate-500">
                  <Upload size={24} />
                  <span className="text-sm font-medium">Tap to choose an image</span>
                  <input
                    type="file" accept="image/*" className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) setReceipt(URL.createObjectURL(f))
                    }}
                  />
                </label>
              )}
            </div>

            <a
              href={waLink} target="_blank" rel="noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-4 font-bold text-slate-950"
            >
              <MessageCircle size={20} /> Confirm order on WhatsApp
            </a>
            <Link to="/$slug" params={{ slug }} className="block text-center text-sm text-slate-500">Continue shopping</Link>
          </div>
        )}
      </div>
    </div>
  )
}