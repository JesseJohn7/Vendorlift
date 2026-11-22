import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { calculate, type CostInput } from '../lib/costing'
import { formatNaira } from '../lib/money'

const num = (v: string) => (v === '' ? 0 : Number(v))

function Field({ label, value, onChange, placeholder = '0' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-slate-300">{label}</span>
      <input
        inputMode="decimal"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-emerald-500"
      />
    </label>
  )
}

export default function CostCalculator() {
  const navigate = useNavigate()
  const [productName, setProductName] = useState('')
  const [f, setF] = useState({
    quantity: '1', unitCost: '', packaging: '', shipping: '', misc: '',
    marginPct: '30', sellingPrice: '', fixedOverhead: '',
  })
  const [packagingPer, setPackagingPer] = useState<'unit' | 'batch'>('unit')
  const [mode, setMode] = useState<'margin' | 'price'>('margin')
  const set = (k: keyof typeof f) => (v: string) => setF((p) => ({ ...p, [k]: v }))

  const input: CostInput = {
    quantity: num(f.quantity), unitCost: num(f.unitCost), packaging: num(f.packaging), packagingPer,
    shipping: num(f.shipping), misc: num(f.misc), mode,
    marginPct: num(f.marginPct), sellingPrice: num(f.sellingPrice), fixedOverhead: num(f.fixedOverhead),
  }
  const r = useMemo(() => calculate(input), [JSON.stringify(input)])

  const saveToShop = () => {
    sessionStorage.setItem('vl_calc', JSON.stringify({ productName, input, result: r }))
    navigate({ to: '/register' })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-xl space-y-6 p-4 pb-16">
        <header className="pt-4">
          <h1 className="text-2xl font-bold">Product Cost Calculator</h1>
          <p className="text-slate-400">Know your real cost and profit before you sell.</p>
        </header>

        <section className="space-y-3 rounded-2xl bg-slate-900/60 p-4">
          <Field label="Product name (optional)" value={productName} onChange={setProductName} placeholder="e.g. Oud Royal 50ml" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Batch quantity" value={f.quantity} onChange={set('quantity')} placeholder="1" />
            <Field label="Cost per unit (₦)" value={f.unitCost} onChange={set('unitCost')} />
            <Field label="Packaging (₦)" value={f.packaging} onChange={set('packaging')} />
            <label className="block">
              <span className="mb-1 block text-sm text-slate-300">Packaging is per</span>
              <select
                value={packagingPer}
                onChange={(e) => setPackagingPer(e.target.value as 'unit' | 'batch')}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5"
              >
                <option value="unit">Unit</option>
                <option value="batch">Whole batch</option>
              </select>
            </label>
            <Field label="Shipping / clearing (₦)" value={f.shipping} onChange={set('shipping')} />
            <Field label="Marketing / fees (₦)" value={f.misc} onChange={set('misc')} />
          </div>
        </section>

        <section className="space-y-3 rounded-2xl bg-slate-900/60 p-4">
          <div className="flex gap-2">
            {(['margin', 'price'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
                  mode === m ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {m === 'margin' ? 'Target margin %' : 'Desired price ₦'}
              </button>
            ))}
          </div>
          {mode === 'margin'
            ? <Field label="Target profit margin (%)" value={f.marginPct} onChange={set('marginPct')} />
            : <Field label="Desired selling price (₦)" value={f.sellingPrice} onChange={set('sellingPrice')} />}
          <Field label="Monthly fixed overhead (₦, optional)" value={f.fixedOverhead} onChange={set('fixedOverhead')} />
        </section>

        <section className="space-y-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <Row label="Landed cost / unit" value={formatNaira(r.landedCost)} />
          <Row label="Selling price" value={formatNaira(r.price)} strong />
          <Row label="Profit margin" value={`${r.marginPct.toFixed(1)}%`} />
          <Row label="Profit / unit" value={formatNaira(r.profitPerUnit)} />
          <Row label="Total batch profit" value={formatNaira(r.batchProfit)} />
          {r.breakEvenUnits !== null && <Row label="Break-even volume" value={`${r.breakEvenUnits} units`} />}
        </section>

        <button onClick={saveToShop} className="w-full rounded-xl bg-emerald-500 py-4 text-lg font-bold text-slate-950">
          Save this product to your free online shop
        </button>
      </div>
    </div>
  )
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-300">{label}</span>
      <span className={strong ? 'text-xl font-bold text-emerald-400' : 'font-semibold'}>{value}</span>
    </div>
  )
}