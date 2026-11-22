import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import { Button, Input, Logo, Select } from '../components/ui'
import { isValidSlug, slugify } from '../lib/reserved'

function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <Link to="/"><Logo dark /></Link>
        <div className="relative space-y-5">
          <h2 className="text-4xl font-extrabold leading-tight">Your shop, live in minutes.</h2>
          {['One link for all your customers', 'Get paid straight to your bank', 'See your real profit daily'].map((t) => (
            <p key={t} className="flex items-center gap-3 text-slate-300">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <Check size={14} />
              </span>
              {t}
            </p>
          ))}
        </div>
        <p className="relative text-sm text-slate-500">© VendorLift Shops</p>
      </div>

      <div className="flex items-center justify-center bg-white px-5 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden"><Link to="/"><Logo /></Link></div>
          <h1 className="text-3xl font-extrabold text-slate-900">{title}</h1>
          <p className="mb-8 mt-2 text-slate-500">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  )
}

export function Login() {
  const navigate = useNavigate()
  const submit = (e: FormEvent) => {
    e.preventDefault()
    navigate({ to: '/dashboard' })
  }
  return (
    <AuthShell title="Welcome back" subtitle="Log in to manage your shop.">
      <form onSubmit={submit} className="space-y-4">
        <Input label="Email" type="email" required placeholder="you@example.com" />
        <Input label="Password" type="password" required placeholder="Your password" />
        <Button type="submit" className="w-full">Log in</Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        New here? <Link to="/register" className="font-semibold text-emerald-600">Create a free shop</Link>
      </p>
    </AuthShell>
  )
}

export function Register() {
  const navigate = useNavigate()
  const hasCalc = typeof window !== 'undefined' && !!sessionStorage.getItem('vl_calc')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    navigate({ to: '/setup' })
  }
  return (
    <AuthShell title="Create your free shop" subtitle="It takes about two minutes.">
      {hasCalc && (
        <div className="mb-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
          Your calculated product will be waiting in your dashboard.
        </div>
      )}
      <form onSubmit={submit} className="space-y-4">
        <Input label="Full name" required placeholder="Amina Bello" />
        <Input label="Email" type="email" required placeholder="you@example.com" />
        <Input label="WhatsApp number" type="tel" required placeholder="+234 801 234 5678" />
        <Input label="Password" type="password" required minLength={8} placeholder="At least 8 characters" />
        <Button type="submit" className="w-full">Continue</Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        Already have a shop? <Link to="/login" className="font-semibold text-emerald-600">Log in</Link>
      </p>
    </AuthShell>
  )
}

const BANKS = ['Access Bank', 'GTBank', 'First Bank', 'UBA', 'Zenith Bank', 'Opay', 'Kuda', 'Moniepoint', 'PalmPay', 'Wema Bank', 'Sterling Bank', 'Fidelity Bank']

export function Setup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [touched, setTouched] = useState(false)
  const [acct, setAcct] = useState('')

  const onName = (v: string) => {
    setName(v)
    if (!touched) setSlug(slugify(v))
  }
  const slugOk = slug === '' || isValidSlug(slug)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!isValidSlug(slug)) return
    navigate({ to: '/dashboard' })
  }

  return (
    <AuthShell title="Set up your shop" subtitle="Customers will pay into this account directly.">
      <form onSubmit={submit} className="space-y-4">
        <Input label="Shop name" required value={name} onChange={(e) => onName(e.target.value)} placeholder="Amina Perfumes" />
        <div>
          <Input
            label="Shop link"
            required
            value={slug}
            onChange={(e) => { setTouched(true); setSlug(slugify(e.target.value)) }}
            placeholder="amina-perfumes"
          />
          <p className={`mt-1 text-xs ${slugOk ? 'text-slate-500' : 'text-red-600'}`}>
            {slugOk ? `shops.vendorlift.com.ng/${slug || 'your-shop'}` : 'This link is not allowed or is too short. Try another.'}
          </p>
        </div>
        <Input label="Shop WhatsApp number" type="tel" required placeholder="+234 801 234 5678" />
        <Select label="Bank" required defaultValue="">
          <option value="" disabled>Select bank</option>
          {BANKS.map((b) => <option key={b}>{b}</option>)}
        </Select>
        <Input
          label="Account number"
          required
          inputMode="numeric"
          maxLength={10}
          value={acct}
          onChange={(e) => setAcct(e.target.value.replace(/\D/g, ''))}
          placeholder="10 digits"
        />
        <Input label="Account name" required placeholder="As it appears on your account" />
        <Button type="submit" className="w-full" disabled={acct.length !== 10 || !isValidSlug(slug)}>
          Launch my shop
        </Button>
      </form>
    </AuthShell>
  )
}