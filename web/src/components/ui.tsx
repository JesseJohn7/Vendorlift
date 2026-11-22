import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'
import { X } from 'lucide-react'

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-lg font-extrabold tracking-tight">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-slate-950">V</span>
      <span className={dark ? 'text-white' : 'text-slate-900'}>VendorLift</span>
    </span>
  )
}

const btn = {
  primary: 'bg-emerald-500 text-slate-950 hover:bg-emerald-400',
  dark: 'bg-slate-900 text-white hover:bg-slate-800',
  ghost: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  danger: 'bg-red-50 text-red-600 hover:bg-red-100',
}

export function Button({
  variant = 'primary',
  className = '',
  ...p
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof btn }) {
  return (
    <button
      {...p}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition disabled:opacity-40 ${btn[variant]} ${className}`}
    />
  )
}

export const inputCls =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  )
}

export function Input({ label, hint, ...p }: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <Field label={label} hint={hint}>
      <input {...p} className={inputCls} />
    </Field>
  )
}

export function Select({ label, children, ...p }: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <Field label={label}>
      <select {...p} className={inputCls}>
        {children}
      </select>
    </Field>
  )
}

const tones = {
  green: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-700',
  slate: 'bg-slate-100 text-slate-600',
  red: 'bg-red-100 text-red-600',
  blue: 'bg-blue-100 text-blue-700',
}

export function Badge({ tone = 'slate', children }: { tone?: keyof typeof tones; children: ReactNode }) {
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>{children}</span>
}

export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="rounded-full bg-slate-100 p-2 text-slate-500">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}