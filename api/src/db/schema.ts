import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull(),
  passwordHash: text('password_hash').notNull(),
  fullName: text('full_name').notNull(),
  kycBusinessName: text('kyc_business_name'),
  kycIdType: text('kyc_id_type'),
  kycIdNumber: text('kyc_id_number'),
  kycDocR2Key: text('kyc_doc_r2_key'),
  kycStatus: text('kyc_status').default('unverified'),
  createdAt: integer('created_at').notNull(),
})

export const shops = sqliteTable('shops', {
  id: text('id').primaryKey(),
  ownerId: text('owner_id').notNull().unique().references(() => users.id),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  logoR2Key: text('logo_r2_key'),
  whatsappPhone: text('whatsapp_phone').notNull(),
  bankName: text('bank_name').notNull(),
  accountNumber: text('account_number').notNull(),
  accountName: text('account_name').notNull(),
  isActive: integer('is_active').default(1),
  createdAt: integer('created_at').notNull(),
})

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  shopId: text('shop_id').notNull().references(() => shops.id),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category'),
  sellingPrice: integer('selling_price').notNull(),
  landedCost: integer('landed_cost').notNull(),
  costBreakdownJson: text('cost_breakdown_json'),
  stockQty: integer('stock_qty').notNull().default(0),
  lowStockAlert: integer('low_stock_alert').notNull().default(5),
  variantsJson: text('variants_json'),
  imageR2Key: text('image_r2_key'),
  isPublished: integer('is_published').default(1),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
}, (t) => [index('products_shop_idx').on(t.shopId)])

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  orderNumber: text('order_number').notNull(),
  shopId: text('shop_id').notNull().references(() => shops.id),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  deliveryAddress: text('delivery_address').notNull(),
  customerNote: text('customer_note'),
  itemsJson: text('items_json').notNull(),
  totalAmount: integer('total_amount').notNull(),
  totalCogs: integer('total_cogs').notNull(),
  receiptR2Key: text('receipt_r2_key'),
  status: text('status').notNull().default('pending'),
  createdAt: integer('created_at').notNull(),
  paidAt: integer('paid_at'),
}, (t) => [index('orders_shop_idx').on(t.shopId)])

export const inventoryLogs = sqliteTable('inventory_logs', {
  id: text('id').primaryKey(),
  shopId: text('shop_id').notNull().references(() => shops.id),
  productId: text('product_id').notNull().references(() => products.id),
  changeQty: integer('change_qty').notNull(),
  reason: text('reason').notNull(),
  referenceId: text('reference_id'),
  note: text('note'),
  createdAt: integer('created_at').notNull(),
}, (t) => [index('invlogs_shop_idx').on(t.shopId), index('invlogs_product_idx').on(t.productId)])

export const expenses = sqliteTable('expenses', {
  id: text('id').primaryKey(),
  shopId: text('shop_id').notNull().references(() => shops.id),
  title: text('title').notNull(),
  category: text('category').notNull(),
  amount: integer('amount').notNull(),
  expenseDate: integer('expense_date').notNull(),
  createdAt: integer('created_at').notNull(),
}, (t) => [index('expenses_shop_idx').on(t.shopId)])