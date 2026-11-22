const DAY = 86400000
const ago = (d: number) => Date.now() - d * DAY

export type OrderStatus = 'pending' | 'paid' | 'delivered' | 'cancelled'
export type OrderItem = { name: string; variant?: string; qty: number; price: number }
export type Order = {
  id: string
  number: string
  customer: string
  phone: string
  address: string
  items: OrderItem[]
  total: number
  cogs: number
  status: OrderStatus
  createdAt: number
  hasReceipt: boolean
}

export const initialOrders: Order[] = [
  { id: 'o1', number: 'VL-1042', customer: 'Chidimma Okeke', phone: '+2348098765432', address: '15 Admiralty Way, Lekki Phase 1, Lagos', items: [{ name: 'Oud Royal', variant: '50ml', qty: 1, price: 2500000 }], total: 2500000, cogs: 1500000, status: 'pending', createdAt: ago(0), hasReceipt: true },
  { id: 'o2', number: 'VL-1041', customer: 'Tunde Bakare', phone: '+2348055501122', address: '4 Allen Avenue, Ikeja, Lagos', items: [{ name: 'Rose Musk Oil', qty: 2, price: 850000 }], total: 1700000, cogs: 900000, status: 'pending', createdAt: ago(0), hasReceipt: false },
  { id: 'o3', number: 'VL-1040', customer: 'Ngozi Eze', phone: '+2348033311122', address: '22 Wuse II, Abuja', items: [{ name: 'Gift Set Deluxe', variant: 'Women', qty: 1, price: 3200000 }], total: 3200000, cogs: 2000000, status: 'paid', createdAt: ago(1), hasReceipt: true },
  { id: 'o4', number: 'VL-1039', customer: 'Ibrahim Musa', phone: '+2348077788899', address: '9 Sabon Gari, Kano', items: [{ name: 'Bakhoor Incense', qty: 3, price: 600000 }], total: 1800000, cogs: 900000, status: 'delivered', createdAt: ago(2), hasReceipt: true },
  { id: 'o5', number: 'VL-1038', customer: 'Sarah Johnson', phone: '+2348022233344', address: '7 Ozumba Mbadiwe, Victoria Island', items: [{ name: 'Oud Royal', variant: '100ml', qty: 1, price: 2500000 }, { name: 'Amber Nights', variant: '50ml', qty: 1, price: 1800000 }], total: 4300000, cogs: 2500000, status: 'delivered', createdAt: ago(4), hasReceipt: true },
  { id: 'o6', number: 'VL-1037', customer: 'Kemi Adeyemi', phone: '+2348011100099', address: '31 Bode Thomas, Surulere', items: [{ name: 'Amber Nights', variant: '50ml', qty: 1, price: 1800000 }], total: 1800000, cogs: 1000000, status: 'cancelled', createdAt: ago(5), hasReceipt: false },
  { id: 'o7', number: 'VL-1036', customer: 'Emeka Obi', phone: '+2348066677788', address: '12 Aba Road, Port Harcourt', items: [{ name: 'Rose Musk Oil', qty: 1, price: 850000 }], total: 850000, cogs: 450000, status: 'paid', createdAt: ago(6), hasReceipt: true },
  { id: 'o8', number: 'VL-1035', customer: 'Zainab Yusuf', phone: '+2348099900011', address: '3 Ahmadu Bello Way, Kaduna', items: [{ name: 'Gift Set Deluxe', variant: 'Men', qty: 2, price: 3200000 }], total: 6400000, cogs: 4000000, status: 'delivered', createdAt: ago(12), hasReceipt: true },
]

export type DProduct = {
  id: string
  name: string
  category: string
  sellingPrice: number
  landedCost: number
  stockQty: number
  lowStockAlert: number
  variants: string[]
}

export const initialProducts: DProduct[] = [
  { id: 'p1', name: 'Oud Royal', category: 'Fragrance', sellingPrice: 2500000, landedCost: 1500000, stockQty: 12, lowStockAlert: 5, variants: ['50ml', '100ml'] },
  { id: 'p2', name: 'Rose Musk Oil', category: 'Oils', sellingPrice: 850000, landedCost: 450000, stockQty: 3, lowStockAlert: 5, variants: [] },
  { id: 'p3', name: 'Amber Nights', category: 'Fragrance', sellingPrice: 1800000, landedCost: 1000000, stockQty: 0, lowStockAlert: 5, variants: ['50ml'] },
  { id: 'p4', name: 'Bakhoor Incense', category: 'Home', sellingPrice: 600000, landedCost: 300000, stockQty: 20, lowStockAlert: 5, variants: [] },
  { id: 'p5', name: 'Gift Set Deluxe', category: 'Gifts', sellingPrice: 3200000, landedCost: 2000000, stockQty: 8, lowStockAlert: 5, variants: ['Men', 'Women'] },
]

export type Expense = { id: string; title: string; category: string; amount: number; date: number }

export const EXPENSE_CATEGORIES = [
  'Logistics / Delivery', 'Marketing / Ads', 'Rent / Utilities',
  'Packaging / Supplies', 'Data / Airtime', 'Other',
]

export const initialExpenses: Expense[] = [
  { id: 'e1', title: 'Dispatch rider (Lekki)', category: 'Logistics / Delivery', amount: 250000, date: ago(1) },
  { id: 'e2', title: 'Instagram ads', category: 'Marketing / Ads', amount: 500000, date: ago(3) },
  { id: 'e3', title: 'Gift boxes & ribbons', category: 'Packaging / Supplies', amount: 320000, date: ago(6) },
  { id: 'e4', title: 'MTN data', category: 'Data / Airtime', amount: 100000, date: ago(9) },
  { id: 'e5', title: 'Shop rent contribution', category: 'Rent / Utilities', amount: 2000000, date: ago(15) },
]