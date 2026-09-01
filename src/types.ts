export type LaundryStatus = 
  | 'RECEIVED'
  | 'WASHING'
  | 'DRYING'
  | 'FOLDING'
  | 'READY'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentStatus = 'PAID' | 'PARTIAL' | 'UNPAID';

export type PaymentMethod = 'CASH' | 'GCASH' | 'MAYA' | 'BANK_TRANSFER';

export interface ServiceItem {
  id: string;
  serviceId: string;
  name: string;
  unitPrice: number;
  unitType: 'kg' | 'item' | 'piece' | 'pair' | 'load';
  quantity: number;
  subtotal: number;
  specialInstructions?: string;
}

export interface StatusHistoryEntry {
  status: LaundryStatus;
  timestamp: string;
  updatedBy: string;
  note?: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string; // e.g. "LM1", "JD2"
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: ServiceItem[];
  totalWeightKg: number;
  bagCount: number;
  totalAmount: number;
  amountPaid: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  status: LaundryStatus;
  statusHistory: StatusHistoryEntry[];
  notes?: string;
  detergentOption?: string;
  fragranceOption?: string;
  createdAt: string;
  estimatedReadyAt: string;
  completedAt?: string;
  staffName: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  activeTicketCount: number;
  notes?: string;
  isVip?: boolean;
}

export interface ServicePricing {
  id: string;
  name: string;
  category: 'Wash' | 'Dry Clean' | 'Pressing' | 'Specialty' | 'Add-on';
  price: number;
  unitType: 'kg' | 'item' | 'piece' | 'pair' | 'load';
  turnaroundHours: number;
  description: string;
  isActive: boolean;
  minQuantity?: number;
  popular?: boolean;
}

export interface Expense {
  id: string;
  category: 
    | 'Detergent & Chemicals'
    | 'Electricity'
    | 'Water'
    | 'Packaging & Supplies'
    | 'Equipment Maintenance'
    | 'Rent'
    | 'Staff Wages'
    | 'Other';
  amount: number;
  description: string;
  date: string;
  recordedBy: string;
  referenceNo?: string;
  pieces?: number;
}

export interface ExpenseSubmission {
  date: string;
  sentAt: string;
  sentBy: string;
  totalAmount: number;
  totalPieces: number;
  itemCount: number;
  status: 'PENDING_REVIEW' | 'APPROVED';
  reviewedAt?: string;
  reviewedBy?: string;
  bossNote?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Detergent' | 'Fabric Conditioner' | 'Packaging' | 'Bleach & Chemicals' | 'Accessories';
  currentStock: number;
  minThreshold: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  lastRestocked: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface PaymentTransaction {
  id: string;
  date: string;
  ticketId: string;
  ticketNumber: string;
  customerName: string;
  amount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export type UserRole = 'ADMIN' | 'OWNER' | 'CUSTOMER';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'OWNER';
  staffCode: string;
  title: string;
  pin: string;
  passwordHash?: string;
  branch: string;
  avatarUrl?: string;
  shift?: string;
}

export type AdminTab = 
  | 'dashboard'
  | 'tickets'
  | 'create-ticket'
  | 'customers'
  | 'payments'
  | 'expenses'
  | 'reports';

export type OwnerTab = 
  | 'dashboard'
  | 'tickets'
  | 'customers'
  | 'services'
  | 'revenue'
  | 'expenses'
  | 'analytics'
  | 'reports'
  | 'settings';

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: string;
}
