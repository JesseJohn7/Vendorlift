export const toKobo = (naira: number) => Math.round((naira || 0) * 100)
export const toNaira = (kobo: number) => kobo / 100
export const formatNaira = (kobo: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 2 }).format(kobo / 100)