import { toKobo } from './money'

export type CostInput = {
  quantity: number
  unitCost: number          // NGN
  packaging: number         // NGN
  packagingPer: 'unit' | 'batch'
  shipping: number          // NGN (whole batch)
  misc: number              // NGN (whole batch)
  mode: 'margin' | 'price'
  marginPct: number
  sellingPrice: number      // NGN
  fixedOverhead: number     // NGN monthly
}

export function calculate(i: CostInput) {
  const qty = Math.max(1, Math.floor(i.quantity || 1))
  const packagingTotal = i.packagingPer === 'unit' ? toKobo(i.packaging) * qty : toKobo(i.packaging)
  const batchCost = toKobo(i.unitCost) * qty + packagingTotal + toKobo(i.shipping) + toKobo(i.misc)
  const landedCost = Math.round(batchCost / qty)

  let price: number
  let marginPct: number
  if (i.mode === 'margin') {
    const m = Math.min(Math.max(i.marginPct, 0), 99.99)
    price = Math.round(landedCost / (1 - m / 100))
    marginPct = m
  } else {
    price = toKobo(i.sellingPrice)
    marginPct = price > 0 ? ((price - landedCost) / price) * 100 : 0
  }

  const profitPerUnit = price - landedCost
  const batchProfit = profitPerUnit * qty
  const fixed = toKobo(i.fixedOverhead)
  const breakEvenUnits = fixed > 0 && profitPerUnit > 0 ? Math.ceil(fixed / profitPerUnit) : null

  return { qty, batchCost, landedCost, price, marginPct, profitPerUnit, batchProfit, breakEvenUnits }
}