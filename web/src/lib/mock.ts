export type Product = {
  id: string
  name: string
  description: string
  category: string
  sellingPrice: number // Kobo
  stockQty: number
  lowStockAlert: number
  variants: string[]
}

export const mockShop = {
  name: 'Amina Perfumes',
  description: 'Authentic luxury perfumes and oils in Lagos.',
  whatsapp: '2348012345678',
  bank: { name: 'GTBank', number: '0123456789', accountName: 'Amina Bello Enterprises' },
}

export const mockProducts: Product[] = [
  { id: 'p1', name: 'Oud Royal', description: 'Long lasting woody fragrance.', category: 'Fragrance', sellingPrice: 2500000, stockQty: 12, lowStockAlert: 5, variants: ['50ml', '100ml'] },
  { id: 'p2', name: 'Rose Musk Oil', description: 'Soft floral roll-on oil.', category: 'Oils', sellingPrice: 850000, stockQty: 3, lowStockAlert: 5, variants: [] },
  { id: 'p3', name: 'Amber Nights', description: 'Warm amber and vanilla.', category: 'Fragrance', sellingPrice: 1800000, stockQty: 0, lowStockAlert: 5, variants: ['50ml'] },
  { id: 'p4', name: 'Bakhoor Incense', description: 'Premium home incense chips.', category: 'Home', sellingPrice: 600000, stockQty: 20, lowStockAlert: 5, variants: [] },
  { id: 'p5', name: 'Gift Set Deluxe', description: 'Three mini perfumes in a gift box.', category: 'Gifts', sellingPrice: 3200000, stockQty: 8, lowStockAlert: 5, variants: ['Men', 'Women'] },
]