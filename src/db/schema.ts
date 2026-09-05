import { pgTable, text, integer, boolean, timestamp, jsonb, decimal } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  username: text('username'),
  email: text('email').notNull().unique(),
  role: text('role').notNull(), // 'ADMIN' | 'OWNER'
  staffCode: text('staff_code').notNull(),
  title: text('title').notNull(),
  pin: text('pin').notNull(),
  branch: text('branch').notNull(),
  avatarUrl: text('avatar_url'),
  shift: text('shift'),
  status: text('status').default('ACTIVE'), // 'ACTIVE' | 'INACTIVE'
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const customers = pgTable('customers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  address: text('address'),
  totalOrders: integer('total_orders').notNull().default(0),
  totalSpent: decimal('total_spent', { precision: 10, scale: 2 }).notNull().default('0'),
  lastOrderDate: text('last_order_date').notNull(),
  activeTicketCount: integer('active_ticket_count').notNull().default(0),
  notes: text('notes'),
  isVip: boolean('is_vip').notNull().default(false),
  createdAt: text('created_at').notNull().default(''),
});

export const tickets = pgTable('tickets', {
  id: text('id').primaryKey(),
  ticketNumber: text('ticket_number').notNull(),
  customerId: text('customer_id'),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  items: jsonb('items').notNull().default('[]'),
  totalWeightKg: decimal('total_weight_kg', { precision: 10, scale: 2 }).notNull().default('0'),
  bagCount: integer('bag_count').notNull().default(0),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull().default('0'),
  amountPaid: decimal('amount_paid', { precision: 10, scale: 2 }).notNull().default('0'),
  paymentStatus: text('payment_status').notNull(), 
  paymentMethod: text('payment_method').notNull(), 
  status: text('status').notNull().default('RECEIVED'),
  statusHistory: jsonb('status_history').notNull().default('[]'),
  notes: text('notes'),
  detergentOption: text('detergent_option'),
  fragranceOption: text('fragrance_option'),
  estimatedReadyAt: text('estimated_ready_at').notNull(),
  completedAt: text('completed_at'),
  staffName: text('staff_name').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull().default(''),
});

export const services = pgTable('services', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  unitType: text('unit_type').notNull(),
  turnaroundHours: integer('turnaround_hours').notNull(),
  description: text('description').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  minQuantity: integer('min_quantity'),
  popular: boolean('popular').notNull().default(false),
});

export const expenses = pgTable('expenses', {
  id: text('id').primaryKey(),
  category: text('category').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  description: text('description').notNull(),
  date: text('date').notNull(),
  recordedBy: text('recorded_by').notNull(),
  referenceNo: text('reference_no'),
  pieces: integer('pieces'),
});

export const payments = pgTable('payments', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  ticketId: text('ticket_id'),
  ticketNumber: text('ticket_number').notNull(),
  customerName: text('customer_name').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  paymentStatus: text('payment_status').notNull(),
  paymentMethod: text('payment_method').notNull(),
  notes: text('notes'),
});

export const inventory = pgTable('inventory', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  currentStock: integer('current_stock').notNull().default(0),
  minThreshold: integer('min_threshold').notNull().default(0),
  unit: text('unit').notNull(),
  costPerUnit: decimal('cost_per_unit', { precision: 10, scale: 2 }).notNull().default('0'),
  supplier: text('supplier').notNull(),
  lastRestocked: text('last_restocked').notNull(),
  status: text('status').notNull(),
});

export const settings = pgTable('settings', {
  id: text('id').primaryKey(), 
  data: jsonb('data').notNull(), 
});

