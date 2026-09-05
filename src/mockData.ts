import { Customer, ServicePricing, Ticket, Expense, InventoryItem, PaymentTransaction, AuthUser } from './types';

export const INITIAL_SERVICES: ServicePricing[] = [
  {
    id: 'srv-1',
    name: 'Wash & Fold',
    category: 'Wash',
    price: 70,
    unitType: 'kg',
    turnaroundHours: 24,
    description: 'Machine washed, tumble dried, neatly folded, and bagged with premium fabric conditioner.',
    isActive: true,
    minQuantity: 4,
    popular: true
  },
  {
    id: 'srv-2',
    name: 'Wash & Iron / Press',
    category: 'Pressing',
    price: 95,
    unitType: 'kg',
    turnaroundHours: 36,
    description: 'Full wash, tumble dry, and professional steam press on hangers or folded.',
    isActive: true,
    minQuantity: 4,
    popular: true
  },
  {
    id: 'srv-3',
    name: 'Dry Cleaning (Barong / Suit)',
    category: 'Dry Clean',
    price: 180,
    unitType: 'item',
    turnaroundHours: 48,
    description: 'Eco-solvent dry cleaning for delicate formalwear, barongs, suits, and gowns.',
    isActive: true,
    popular: true
  },
  {
    id: 'srv-4',
    name: 'Dry Cleaning (Standard Item)',
    category: 'Dry Clean',
    price: 150,
    unitType: 'item',
    turnaroundHours: 48,
    description: 'Specialized chemical dry cleaning for coats, blazers, and delicate fabrics.',
    isActive: true
  },
  {
    id: 'srv-5',
    name: 'Steam Ironing Only',
    category: 'Pressing',
    price: 50,
    unitType: 'item',
    turnaroundHours: 12,
    description: 'Wrinkle-free heavy steam press and hanger service for clean clothes.',
    isActive: true
  },
  {
    id: 'srv-6',
    name: 'Heavy Comforter / Blanket',
    category: 'Specialty',
    price: 250,
    unitType: 'piece',
    turnaroundHours: 24,
    description: 'Deep sanitary sanitize wash and anti-bacterial drying for thick bedding.',
    isActive: true,
    popular: true
  },
  {
    id: 'srv-7',
    name: 'Sneaker / Shoe Care',
    category: 'Specialty',
    price: 220,
    unitType: 'pair',
    turnaroundHours: 48,
    description: 'Specialty hand sneaker wash, stain removal, and ozone deodorization.',
    isActive: true
  },
  {
    id: 'srv-8',
    name: 'Curtains & Drapery',
    category: 'Specialty',
    price: 90,
    unitType: 'kg',
    turnaroundHours: 48,
    description: 'Dust mite extraction, gentle wash, and anti-static steam finish.',
    isActive: true
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [];

export const INITIAL_TICKETS: Ticket[] = [];

export const INITIAL_EXPENSES: Expense[] = [];

export const INITIAL_INVENTORY: InventoryItem[] = [];

export const INITIAL_PAYMENTS: PaymentTransaction[] = [];

export const OWNER_ANALYTICS = {
  todayRevenue: 0,
  monthlyRevenue: 0,
  ordersCount: 0,
  completedCount: 0,
  pendingCount: 0,
  expensesTotal: 0,
  profitMargin: 0,
  averageOrderValue: 0,
  pipelineStatus: {
    received: 0,
    washing: 0,
    folding: 0,
    ready: 0,
    completed: 0
  },
  peakHours: []
};

export const AUTH_USERS: AuthUser[] = [
  {
    id: 'user-admin-1',
    name: 'Arlene Santos',
    username: 'admin',
    email: 'admin@tapcard.ph',
    role: 'ADMIN',
    staffCode: 'STF-04',
    title: 'Lead Counter Cashier',
    pin: '1234',
    password: '1234',
    branch: 'Makati Central Branch',
    shift: 'Morning Shift (7:00 AM - 3:00 PM)',
    status: 'ACTIVE'
  },
  {
    id: 'user-admin-2',
    name: 'Luis Miguel',
    username: 'staff',
    email: 'staff@tapcard.ph',
    role: 'ADMIN',
    staffCode: 'STF-02',
    title: 'Senior Laundry Operator',
    pin: '5678',
    password: '5678',
    branch: 'Makati Central Branch',
    shift: 'Afternoon Shift (1:00 PM - 9:00 PM)',
    status: 'ACTIVE'
  },
  {
    id: 'user-owner-1',
    name: 'Alex Morgan',
    username: 'owner',
    email: 'owner@tapcard.ph',
    role: 'OWNER',
    staffCode: 'OWN-01',
    title: 'Shop Owner & Managing Director',
    pin: '8888',
    password: '8888',
    branch: 'Tapcard Headquarters / All Branches',
    shift: 'Executive Access (Full Privileges)',
    status: 'ACTIVE'
  }
];
