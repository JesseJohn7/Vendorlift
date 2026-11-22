import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AlertTriangle, BarChart3, ExternalLink, LayoutDashboard, Package, Plus, ShoppingBag, Trash2, Wallet } from 'lucide-react'
import { Badge, Button, Input, Logo, Select, Sheet } from '../components/ui'
import {
  EXPENSE_CATEGORIES, initialExpenses, initialOrders, initialProducts,
  type DProduct, type Expense, type Order, type OrderStatus,
} from '../lib/mockDashboard'
import { formatNaira, toKobo } from '../lib/money'

type Tab = 'overview' | 'orders' | 'products' | 'expenses' | 'pnl'

const NAV: { key: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'overview', label: 'Home', icon: LayoutDashboard },
  { key: 'orders', label: 'Orders', icon: ShoppingBag },
  { key: 'products', label: 'Products', icon: Package },
  { key: 'expenses', label: 'Expenses', icon: Wallet },
  { key: 'pnl', label: 'Profit', icon: BarChart3 },
]

const DAY = 86400000
const RANGES = [
  { label: 'Today', days: 1 },
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: 'All time', days: 0 },
]

function pnl(orders: Order[], expenses: Expense[], products: DProduct[], days: number) {
  const start = days === 0 ? 0 : days === 1 ? new Date().setHours(0, 0, 0, 0) : Date.now() - days * DAY
  const done = orders.filter((o) => (o.status === 'paid' || o.status === 'delivered') && o.createdAt >= start)
  const revenue = done.reduce((s, o) => s + o.total, 0)
  const cogs = done.reduce((s, o) => s + o.cogs, 0)
  const gross = revenue - cogs
  const opex = expenses.filter((e) => e.date >= start).reduce((s, e) => s + e.amount, 0)
  const retail = products.reduce((s, p) => s + p.stockQty * p.sellingPrice, 0)
  const cost = products.reduce((s, p) => s + p.stockQty * p.landedCost, 0)
  return { revenue, cogs, gross, margin: revenue ? (gross / revenue) * 100 : 0, opex, net: gross - opex, retail, cost, projected: retail - cost }
}

const statusTone: Record<OrderStatus, 'amber' | 'green' | 'blue' | 'red'> = {
  pending: 'amber', paid: 'green', delivered: 'blue', cancelled: 'red',
}
const statusLabel: Record<OrderStatus, string> = {
  pending: 'Pending payment', paid: 'Paid', delivered: 'Delivered', cancelled: 'Cancelled',
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'good' | 'bad' }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={`mt-1 text-xl font-extrabold ${tone === 'good' ? 'text-emerald-600' : tone === 'bad' ? 'text-red-600' : 'text-slate-900'}`}>{value}</p>
    </div>
  )
}

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>('overview')
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [products, setProducts] = useState<DProduct[]>(initialProducts)
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)

  const adjustStock = (o: Order, dir: 1 | -1) =>
    setProducts((ps) =>
      ps.map((p) => {
        const item = o.items.find((i) => i.name === p.name)
        return item ? { ...p, stockQty: Math.max(0, p.stockQty + dir * item.qty) } : p
      })
    )

  const markPaid = (o: Order) => {
    setOrders((os) => os.map((x) => (x.id === o.id ? { ...x, status: 'paid' } : x)))
    adjustStock(o, -1)
  }
  const markDelivered = (o: Order) =>
    setOrders((os) => os.map((x) => (x.id === o.id ? { ...x, status: 'delivered' } : x)))
  const cancel = (o: Order) => {
    const wasPaid = o.status === 'paid' || o.status === 'delivered'
    if (wasPaid && window.confirm('Put the items back in stock?')) adjustStock(o, 1)
    setOrders((os) => os.map((x) => (x.id === o.id ? { ...x, status: 'cancelled' } : x)))
  }

  const pending = orders.filter((o) => o.status === 'pending').length

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white p-5 md:flex">
        <Logo />
        <nav className="mt-8 space-y-1">
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => setTab(n.key)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${tab === n.key ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <n.icon size={18} /> {n.label}
              {n.key === 'orders' && pending > 0 && (
                <span className="ml-auto rounded-full bg-amber-500 px-2 text-xs text-white">{pending}</span>
              )}
            </button>
          ))}
        </nav>
        <Link to="/" className="mt-auto text-sm text-slate-500">Log out</Link>
      </aside>

      <div className="min-w-0 flex-1 pb-24 md:pb-8">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <p className="text-xs text-slate-500">Welcome back</p>
            <h1 className="font-extrabold text-slate-900">Amina Perfumes</h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge tone="amber">KYC: unverified</Badge>
            <Link to="/$slug" params={{ slug: 'amina-perfumes' }} className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
              View shop <ExternalLink size={14} />
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-4xl p-5">
          {tab === 'overview' && <Overview orders={orders} products={products} expenses={expenses} go={setTab} />}
          {tab === 'orders' && <Orders orders={orders} onPaid={markPaid} onDelivered={markDelivered} onCancel={cancel} />}
          {tab === 'products' && <Products products={products} setProducts={setProducts} />}
          {tab === 'expenses' && <Expenses expenses={expenses} setExpenses={setExpenses} />}
          {tab === 'pnl' && <Pnl orders={orders} expenses={expenses} products={products} />}
        </main>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-slate-200 bg-white md:hidden">
        {NAV.map((n) => (
          <button key={n.key} onClick={() => setTab(n.key)} className={`relative flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold ${tab === n.key ? 'text-emerald-600' : 'text-slate-500'}`}>
            <n.icon size={20} /> {n.label}
            {n.key === 'orders' && pending > 0 && <span className="absolute right-5 top-1.5 h-2.5 w-2.5 rounded-full bg-amber-500" />}
          </button>
        ))}
      </nav>
    </div>
  )
}

/* ---------- Overview ---------- */
function Overview({ orders, products, expenses, go }: { orders: Order[]; products: DProduct[]; expenses: Expense[]; go: (t: Tab) => void }) {
  const m = pnl(orders, expenses, products, 30)
  const low = products.filter((p) => p.stockQty <= p.lowStockAlert)
  const recent = orders.slice(0, 4)
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Net profit (30d)" value={formatNaira(m.net)} tone={m.net >= 0 ? 'good' : 'bad'} />
        <Stat label="Revenue (30d)" value={formatNaira(m.revenue)} />
        <Stat label="Pending orders" value={String(orders.filter((o) => o.status === 'pending').length)} />
        <Stat label="Low stock items" value={String(low.length)} />
      </div>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-bold">Recent orders</h2>
          <button onClick={() => go('orders')} className="text-sm font-semibold text-emerald-600">See all</button>
        </div>
        <div className="divide-y divide-slate-100 rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
          {recent.map((o) => (
            <div key={o.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold">{o.number} · {o.customer}</p>
                <p className="text-sm text-slate-500">{formatNaira(o.total)}</p>
              </div>
              <Badge tone={statusTone[o.status]}>{statusLabel[o.status]}</Badge>
            </div>
          ))}
        </div>
      </section>

      {low.length > 0 && (
        <section>
          <h2 className="mb-2 flex items-center gap-2 font-bold"><AlertTriangle size={18} className="text-amber-500" /> Needs restocking</h2>
          <div className="divide-y divide-slate-100 rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
            {low.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4">
                <p className="font-semibold">{p.name}</p>
                <Badge tone={p.stockQty === 0 ? 'red' : 'amber'}>{p.stockQty === 0 ? 'Out of stock' : `${p.stockQty} left`}</Badge>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

/* ---------- Orders ---------- */
const ORDER_TABS: { key: 'all' | OrderStatus; label: string }[] = [
  { key: 'all', label: 'All' }, { key: 'pending', label: 'Pending' },
  { key: 'paid', label: 'Paid' }, { key: 'delivered', label: 'Delivered' }, { key: 'cancelled', label: 'Cancelled' },
]

function Orders({ orders, onPaid, onDelivered, onCancel }: {
  orders: Order[]; onPaid: (o: Order) => void; onDelivered: (o: Order) => void; onCancel: (o: Order) => void
}) {
  const [filter, setFilter] = useState<'all' | OrderStatus>('all')
  const [openId, setOpenId] = useState<string | null>(null)
  const list = orders.filter((o) => filter === 'all' || o.status === filter)
  const open = orders.find((o) => o.id === openId) ?? null

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-extrabold">Orders</h2>
      <div className="flex gap-2 overflow-x-auto">
        {ORDER_TABS.map((t) => (
          <button key={t.key} onClick={() => setFilter(t.key)} className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold ${filter === t.key ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="divide-y divide-slate-100 rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        {list.length === 0 && <p className="p-8 text-center text-slate-500">No orders here yet.</p>}
        {list.map((o) => (
          <button key={o.id} onClick={() => setOpenId(o.id)} className="flex w-full items-center justify-between gap-3 p-4 text-left hover:bg-slate-50">
            <div className="min-w-0">
              <p className="font-semibold">{o.number} · {o.customer}</p>
              <p className="truncate text-sm text-slate-500">{o.items.map((i) => `${i.qty}× ${i.name}`).join(', ')}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-bold">{formatNaira(o.total)}</p>
              <Badge tone={statusTone[o.status]}>{statusLabel[o.status]}</Badge>
            </div>
          </button>
        ))}
      </div>

      {open && (
        <Sheet title={open.number} onClose={() => setOpenId(null)}>
          <div className="space-y-4 text-sm">
            <Badge tone={statusTone[open.status]}>{statusLabel[open.status]}</Badge>
            <div>
              <p className="font-semibold">{open.customer}</p>
              <p className="text-slate-500">{open.phone}</p>
              <p className="text-slate-500">{open.address}</p>
            </div>
            <div className="space-y-1.5 rounded-xl bg-slate-50 p-3">
              {open.items.map((i, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{i.qty}× {i.name}{i.variant ? ` (${i.variant})` : ''}</span>
                  <span className="font-medium">{formatNaira(i.price * i.qty)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                <span>Total</span><span>{formatNaira(open.total)}</span>
              </div>
            </div>
            <div className={`flex h-28 items-center justify-center rounded-xl border-2 border-dashed text-sm ${open.hasReceipt ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-400'}`}>
              {open.hasReceipt ? 'Receipt uploaded by customer' : 'No receipt uploaded yet'}
            </div>
            <div className="flex flex-col gap-2">
              {open.status === 'pending' && (
                <Button onClick={() => { onPaid(open); setOpenId(null) }}>Confirm payment (mark as paid)</Button>
              )}
              {open.status === 'paid' && (
                <Button variant="dark" onClick={() => { onDelivered(open); setOpenId(null) }}>Mark as delivered</Button>
              )}
              {open.status !== 'cancelled' && (
                <Button variant="danger" onClick={() => { onCancel(open); setOpenId(null) }}>Cancel order</Button>
              )}
            </div>
          </div>
        </Sheet>
      )}
    </div>
  )
}

/* ---------- Products ---------- */
function Products({ products, setProducts }: { products: DProduct[]; setProducts: React.Dispatch<React.SetStateAction<DProduct[]>> }) {
  const [adding, setAdding] = useState(false)
  const [prefill, setPrefill] = useState<Record<string, string> | null>(null)
  const [restock, setRestock] = useState<DProduct | null>(null)
  const [qty, setQty] = useState('10')

  // Pre-fill from the public cost calculator
  useEffect(() => {
    const raw = sessionStorage.getItem('vl_calc')
    if (!raw) return
    try {
      const c = JSON.parse(raw)
      const q = c.input.quantity || 1
      setPrefill({
        name: c.productName || '',
        stock: String(q),
        purchase: String(c.input.unitCost || ''),
        packaging: String(c.input.packagingPer === 'unit' ? c.input.packaging : Math.round((c.input.packaging || 0) / q)),
        shipping: String(Math.round((c.input.shipping || 0) / q)),
        misc: String(Math.round((c.input.misc || 0) / q)),
        price: String(Math.round((c.result.price || 0) / 100)),
      })
      setAdding(true)
    } catch { /* ignore */ }
  }, [])

  const closeAdd = () => {
    sessionStorage.removeItem('vl_calc')
    setAdding(false)
    setPrefill(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold">Products</h2>
        <Button onClick={() => setAdding(true)} className="!px-4 !py-2.5"><Plus size={18} /> Add</Button>
      </div>

      <div className="divide-y divide-slate-100 rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        {products.map((p) => {
          const margin = p.sellingPrice ? ((p.sellingPrice - p.landedCost) / p.sellingPrice) * 100 : 0
          return (
            <div key={p.id} className="flex items-center gap-3 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-slate-200 font-bold text-emerald-700/60">{p.name[0]}</div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{p.name}</p>
                <p className="text-sm text-slate-500">{formatNaira(p.sellingPrice)} · cost {formatNaira(p.landedCost)} · {margin.toFixed(0)}% margin</p>
              </div>
              <div className="shrink-0 space-y-1 text-right">
                <Badge tone={p.stockQty === 0 ? 'red' : p.stockQty <= p.lowStockAlert ? 'amber' : 'green'}>{p.stockQty} in stock</Badge>
                <button onClick={() => { setRestock(p); setQty('10') }} className="block w-full text-xs font-semibold text-emerald-600">Restock</button>
              </div>
            </div>
          )
        })}
      </div>

      {adding && (
        <AddProduct
          prefill={prefill}
          onClose={closeAdd}
          onSave={(p) => { setProducts((ps) => [p, ...ps]); closeAdd() }}
        />
      )}

      {restock && (
        <Sheet title={`Restock ${restock.name}`} onClose={() => setRestock(null)}>
          <div className="space-y-4">
            <Input label="Quantity to add" type="number" min={1} value={qty} onChange={(e) => setQty(e.target.value)} />
            <Button
              className="w-full"
              onClick={() => {
                const n = Math.max(0, Math.floor(Number(qty) || 0))
                setProducts((ps) => ps.map((p) => (p.id === restock.id ? { ...p, stockQty: p.stockQty + n } : p)))
                setRestock(null)
              }}
            >
              Add to stock
            </Button>
          </div>
        </Sheet>
      )}
    </div>
  )
}

function AddProduct({ prefill, onClose, onSave }: { prefill: Record<string, string> | null; onClose: () => void; onSave: (p: DProduct) => void }) {
  const [f, setF] = useState({
    name: '', category: '', stock: '0', purchase: '', packaging: '', shipping: '', misc: '', price: '', alert: '5',
    ...(prefill ?? {}),
  })
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }))
  const landed = toKobo(Number(f.purchase)) + toKobo(Number(f.packaging)) + toKobo(Number(f.shipping)) + toKobo(Number(f.misc))
  const price = toKobo(Number(f.price))
  const profit = price - landed

  return (
    <Sheet title="Add product" onClose={onClose}>
      {prefill && <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">Pre-filled from your cost calculator.</div>}
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault()
          onSave({
            id: `p${Date.now()}`, name: f.name, category: f.category || 'General',
            sellingPrice: price, landedCost: landed, stockQty: Math.max(0, Math.floor(Number(f.stock) || 0)),
            lowStockAlert: Math.floor(Number(f.alert) || 5), variants: [],
          })
        }}
      >
        <Input label="Product name" required value={f.name} onChange={set('name')} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Category" value={f.category} onChange={set('category')} placeholder="e.g. Fragrance" />
          <Input label="Stock quantity" type="number" min={0} value={f.stock} onChange={set('stock')} />
          <Input label="Purchase cost (₦)" type="number" min={0} value={f.purchase} onChange={set('purchase')} />
          <Input label="Packaging (₦)" type="number" min={0} value={f.packaging} onChange={set('packaging')} />
          <Input label="Shipping (₦)" type="number" min={0} value={f.shipping} onChange={set('shipping')} />
          <Input label="Misc cost (₦)" type="number" min={0} value={f.misc} onChange={set('misc')} />
          <Input label="Selling price (₦)" type="number" min={0} required value={f.price} onChange={set('price')} />
          <Input label="Low stock alert" type="number" min={0} value={f.alert} onChange={set('alert')} />
        </div>
        <div className="flex justify-between rounded-xl bg-slate-50 p-3 text-sm">
          <span>Landed cost: <b>{formatNaira(landed)}</b></span>
          <span className={profit >= 0 ? 'text-emerald-700' : 'text-red-600'}>Profit: <b>{formatNaira(profit)}</b></span>
        </div>
        <Button type="submit" className="w-full">Save product</Button>
      </form>
    </Sheet>
  )
}

/* ---------- Expenses ---------- */
function Expenses({ expenses, setExpenses }: { expenses: Expense[]; setExpenses: React.Dispatch<React.SetStateAction<Expense[]>> }) {
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0])
  const [amount, setAmount] = useState('')
  const total = expenses.reduce((s, e) => s + e.amount, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold">Expenses</h2>
        <Button onClick={() => setAdding(true)} className="!px-4 !py-2.5"><Plus size={18} /> Log</Button>
      </div>
      <Stat label="Total logged" value={formatNaira(total)} />
      <div className="divide-y divide-slate-100 rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        {expenses.map((e) => (
          <div key={e.id} className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="truncate font-semibold">{e.title}</p>
              <p className="text-sm text-slate-500">{e.category} · {new Date(e.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-bold">{formatNaira(e.amount)}</p>
              <button onClick={() => setExpenses((xs) => xs.filter((x) => x.id !== e.id))} className="text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {adding && (
        <Sheet title="Log expense" onClose={() => setAdding(false)}>
          <form
            className="space-y-3"
            onSubmit={(ev) => {
              ev.preventDefault()
              setExpenses((xs) => [{ id: `e${Date.now()}`, title, category, amount: toKobo(Number(amount)), date: Date.now() }, ...xs])
              setTitle(''); setAmount(''); setAdding(false)
            }}
          >
            <Input label="What was it for?" required value={title} onChange={(e) => setTitle(e.target.value)} />
            <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {EXPENSE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </Select>
            <Input label="Amount (₦)" type="number" min={1} required value={amount} onChange={(e) => setAmount(e.target.value)} />
            <Button type="submit" className="w-full">Save expense</Button>
          </form>
        </Sheet>
      )}
    </div>
  )
}

/* ---------- P&L ---------- */
function Pnl({ orders, expenses, products }: { orders: Order[]; expenses: Expense[]; products: DProduct[] }) {
  const [days, setDays] = useState(30)
  const m = pnl(orders, expenses, products, days)
  const Row = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
    <div className={`flex justify-between py-2.5 ${bold ? 'font-extrabold' : ''}`}>
      <span className={bold ? '' : 'text-slate-500'}>{label}</span><span>{value}</span>
    </div>
  )

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-extrabold">Profit &amp; Loss</h2>
      <div className="flex gap-2 overflow-x-auto">
        {RANGES.map((r) => (
          <button key={r.label} onClick={() => setDays(r.days)} className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold ${days === r.days ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'}`}>
            {r.label}
          </button>
        ))}
      </div>

      <div className="rounded-3xl bg-slate-950 p-6 text-white">
        <p className="text-sm text-slate-400">Net profit</p>
        <p className={`mt-1 text-4xl font-extrabold ${m.net >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatNaira(m.net)}</p>
      </div>

      <div className="divide-y divide-slate-100 rounded-2xl bg-white px-5 shadow-sm ring-1 ring-slate-100">
        <Row label="Total revenue" value={formatNaira(m.revenue)} />
        <Row label="Cost of goods sold" value={`−${formatNaira(m.cogs)}`} />
        <Row label="Gross profit" value={formatNaira(m.gross)} bold />
        <Row label="Gross margin" value={`${m.margin.toFixed(1)}%`} />
        <Row label="Operating expenses" value={`−${formatNaira(m.opex)}`} />
        <Row label="Net profit" value={formatNaira(m.net)} bold />
      </div>

      <div>
        <h3 className="mb-2 font-bold">Stock value &amp; projection</h3>
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Retail value" value={formatNaira(m.retail)} />
          <Stat label="Cost value" value={formatNaira(m.cost)} />
          <Stat label="Projected profit" value={formatNaira(m.projected)} tone="good" />
        </div>
      </div>
    </div>
  )
}