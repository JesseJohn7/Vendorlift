import { Link } from '@tanstack/react-router'
import { Calculator, ClipboardList, MessageCircle, TrendingUp, Zap } from 'lucide-react'
import { Logo } from '../components/ui'

const features = [
  { icon: Zap, title: 'One link, zero repeating yourself', text: 'Put your shop link on WhatsApp Status and your bio. Prices, photos, stock and bank details are all there, so buyers stop asking.' },
  { icon: MessageCircle, title: 'Transfer, upload, confirm', text: 'Buyers copy your account number, upload their receipt, and send the order straight to your WhatsApp.' },
  { icon: ClipboardList, title: 'Stock that updates itself', text: 'Mark an order as paid and your stock drops automatically. Every movement is logged.' },
  { icon: TrendingUp, title: 'Know your real profit', text: 'Track cost, expenses and sales in one place. See your net profit today, this week or this month.' },
]

const steps = [
  { n: '1', title: 'Work out your cost', text: 'Use the free calculator to find your true landed cost and the right price.' },
  { n: '2', title: 'Open your shop', text: 'Add your bank details and products. Your store goes live instantly.' },
  { n: '3', title: 'Share and sell', text: 'Send your link. Customers order, you verify payment, done.' },
]

function PhoneMock() {
  return (
    <div className="mx-auto w-64 rounded-[2.2rem] border-8 border-slate-800 bg-white p-3 shadow-2xl shadow-emerald-500/20">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">A</div>
        <div>
          <p className="text-xs font-bold text-slate-900">Amina Perfumes</p>
          <p className="text-[10px] text-slate-500">Luxury oils, Lagos</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {['Oud Royal', 'Rose Musk', 'Amber Nights', 'Bakhoor'].map((n, i) => (
          <div key={n} className="overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-100">
            <div className="flex h-16 items-center justify-center bg-gradient-to-br from-emerald-100 to-slate-200 text-xl font-bold text-emerald-700/60">{n[0]}</div>
            <div className="p-2">
              <p className="truncate text-[10px] font-semibold text-slate-800">{n}</p>
              <p className="text-[10px] font-bold text-emerald-700">₦{(i + 2) * 3},500</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-xl bg-emerald-600 py-2 text-center text-xs font-bold text-white">Confirm on WhatsApp</div>
    </div>
  )
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
        <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Logo dark />
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white">Log in</Link>
            <Link to="/register" className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-400">Get started</Link>
          </div>
        </nav>

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-10 lg:grid-cols-2 lg:pt-20">
          <div>
            <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              Built for Nigerian social sellers
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
              Your customers shouldn't message you five times before they can buy.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-slate-300">
              Get a free online shop in minutes. Share one link, get paid by bank transfer, and see your real profit, all from your phone.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="rounded-xl bg-emerald-500 px-6 py-3.5 font-bold text-slate-950 hover:bg-emerald-400">
                Create your free shop
              </Link>
              <Link to="/tools/cost-calculator" className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-6 py-3.5 font-semibold text-white hover:bg-slate-900">
                <Calculator size={18} /> Try the cost calculator
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-400">No card needed. Customers pay you directly.</p>
          </div>
          <PhoneMock />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-center text-3xl font-extrabold">Everything a small shop needs</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-slate-500">Stop juggling notebooks, screenshots and endless DMs.</p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <f.icon size={22} />
              </div>
              <h3 className="text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-slate-600">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Profit preview */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold">See the profit, not just the sales</h2>
            <p className="mt-4 text-slate-600">
              Most sellers know what came in, but not what is left after cost of goods, delivery and ads. VendorLift shows your real net profit every day.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100">
            <p className="text-sm text-slate-500">Net profit · last 30 days</p>
            <p className="mt-1 text-4xl font-extrabold text-emerald-600">₦48,000</p>
            <div className="mt-5 space-y-3 text-sm">
              {[['Revenue', '₦150,000'], ['Cost of goods', '−₦90,000'], ['Expenses', '−₦12,000']].map(([a, b]) => (
                <div key={a} className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">{a}</span>
                  <span className="font-semibold">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-center text-3xl font-extrabold">Live in three steps</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">{s.n}</div>
              <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-slate-600">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-slate-950 p-10 text-center text-white">
          <h2 className="text-3xl font-extrabold">Not sure what to charge?</h2>
          <p className="mx-auto mt-3 max-w-md text-slate-300">Use our free calculator to find your true cost and the price that gives you the profit you want.</p>
          <Link to="/tools/cost-calculator" className="mt-6 inline-block rounded-xl bg-emerald-500 px-6 py-3.5 font-bold text-slate-950 hover:bg-emerald-400">
            Calculate my product cost
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} VendorLift Shops. Made in Nigeria.
      </footer>
    </div>
  )
}