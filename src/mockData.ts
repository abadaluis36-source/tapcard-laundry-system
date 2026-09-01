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
    description: 'Hand cleaned, stain extracted, deodorized, and UV sanitized shoe care.',
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

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Luis Miguel',
    phone: '0917 842 9102',
    email: 'luis.miguel@gmail.com',
    address: 'Unit 402, Solaris Tower, Makati City',
    totalOrders: 12,
    totalSpent: 4850,
    lastOrderDate: '2026-08-31',
    activeTicketCount: 1,
    notes: 'Prefers Downy Mystique conditioner. Low heat drying.',
    isVip: true
  },
  {
    id: 'cust-2',
    name: 'Juan Dela Cruz',
    phone: '0918 555 3821',
    email: 'juan.delacruz@yahoo.com',
    address: '14 Kalayaan Ave, Barangay Olympia, Makati',
    totalOrders: 8,
    totalSpent: 3120,
    lastOrderDate: '2026-08-31',
    activeTicketCount: 1,
    notes: 'Regular drop-off every Monday morning.',
    isVip: false
  },
  {
    id: 'cust-3',
    name: 'Maria Santos',
    phone: '0922 713 4901',
    email: 'maria.santos23@gmail.com',
    address: 'Bgy. Poblacion, Makati City',
    totalOrders: 19,
    totalSpent: 8940,
    lastOrderDate: '2026-08-31',
    activeTicketCount: 1,
    notes: 'Always requires separate white wash.',
    isVip: true
  },
  {
    id: 'cust-4',
    name: 'Angela Reyes',
    phone: '0905 628 1144',
    email: 'angela.reyes@outlook.com',
    address: 'San Lorenzo Village, Makati City',
    totalOrders: 5,
    totalSpent: 1650,
    lastOrderDate: '2026-08-31',
    activeTicketCount: 1,
    notes: 'Delicate blouses in mesh bags.',
    isVip: false
  },
  {
    id: 'cust-5',
    name: 'Carlos Mendoza',
    phone: '0998 334 7720',
    email: 'carlos.mendoza@bdo.com.ph',
    address: 'Legaspi Village, Makati City',
    totalOrders: 14,
    totalSpent: 6200,
    lastOrderDate: '2026-08-31',
    activeTicketCount: 1,
    notes: 'Barongs must be on wooden hangers with protective plastic.',
    isVip: true
  },
  {
    id: 'cust-6',
    name: 'Patricia Gomez',
    phone: '0915 901 8832',
    email: 'pat.gomez@gmail.com',
    address: 'Bel-Air Village, Makati City',
    totalOrders: 7,
    totalSpent: 2890,
    lastOrderDate: '2026-08-30',
    activeTicketCount: 1,
    notes: 'Hypoallergenic baby detergent requested.',
    isVip: false
  },
  {
    id: 'cust-7',
    name: 'Joshua Tan',
    phone: '0928 412 0099',
    email: 'joshua.tan@techcorp.io',
    address: 'Salcedo Village, Makati City',
    totalOrders: 11,
    totalSpent: 4400,
    lastOrderDate: '2026-08-28',
    activeTicketCount: 0,
    notes: 'Quick turnaround needed when possible.',
    isVip: false
  },
  {
    id: 'cust-8',
    name: 'Bea Alonzo-Ramos',
    phone: '0917 112 3344',
    email: 'bea.ramos@lifestyle.ph',
    address: 'Rockwell Center, Makati City',
    totalOrders: 24,
    totalSpent: 12500,
    lastOrderDate: '2026-08-26',
    activeTicketCount: 0,
    notes: 'High-end delicates and bedsheets.',
    isVip: true
  },
  {
    id: 'cust-9',
    name: 'Rico Hernandez',
    phone: '0908 777 6622',
    email: 'rico.h@gmail.com',
    address: 'Pio Del Pilar, Makati City',
    totalOrders: 6,
    totalSpent: 2100,
    lastOrderDate: '2026-08-15',
    activeTicketCount: 0,
    notes: 'Breeze power clean preferred.',
    isVip: false
  },
  {
    id: 'cust-10',
    name: 'Grace Villanueva',
    phone: '0919 444 8811',
    email: 'grace.v@yahoo.com',
    address: 'San Antonio Village, Makati City',
    totalOrders: 15,
    totalSpent: 5900,
    lastOrderDate: '2026-08-08',
    activeTicketCount: 0,
    notes: 'Steam press for all work slacks.',
    isVip: true
  },
  {
    id: 'cust-11',
    name: 'Mark Anthony Diaz',
    phone: '0927 333 5599',
    email: 'mark.diaz99@gmail.com',
    address: 'Carmona, Makati City',
    totalOrders: 3,
    totalSpent: 1050,
    lastOrderDate: '2026-07-22',
    activeTicketCount: 0,
    notes: 'Student discount applicant.',
    isVip: false
  },
  {
    id: 'cust-12',
    name: 'Elena Soriano',
    phone: '0916 222 7700',
    email: 'elena.soriano@gmail.com',
    address: 'Palanan, Makati City',
    totalOrders: 9,
    totalSpent: 3400,
    lastOrderDate: '2026-06-18',
    activeTicketCount: 0,
    notes: 'Extra fabric conditioner for blankets.',
    isVip: false
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'tkt-1',
    ticketNumber: 'LM1',
    customerId: 'cust-1',
    customerName: 'Luis Miguel',
    customerPhone: '0917 842 9102',
    items: [
      {
        id: 'item-1',
        serviceId: 'srv-1',
        name: 'Wash & Fold',
        unitPrice: 70,
        unitType: 'kg',
        quantity: 5,
        subtotal: 350,
        specialInstructions: 'Downy Mystique fragrance'
      }
    ],
    totalWeightKg: 5,
    bagCount: 1,
    totalAmount: 350,
    amountPaid: 350,
    paymentStatus: 'PAID',
    paymentMethod: 'CASH',
    status: 'WASHING',
    statusHistory: [
      {
        status: 'WASHING',
        timestamp: '2026-08-31 08:30 AM',
        updatedBy: 'Staff Arlene',
        note: 'Customer dropped off 1 bag (5.0 kg). Paid in full.'
      },
      {
        status: 'WASHING',
        timestamp: '2026-08-31 09:15 AM',
        updatedBy: 'Staff Mark',
        note: 'Loaded in Washer #3 (Cycle: Normal Wash + Double Rinse)'
      }
    ],
    notes: 'Customer requested ready before 5 PM if possible.',
    detergentOption: 'Ariel Professional Powder',
    fragranceOption: 'Downy Mystique',
    createdAt: '2026-08-31 08:30 AM',
    estimatedReadyAt: '2026-08-31 04:00 PM',
    staffName: 'Arlene Santos'
  },
  {
    id: 'tkt-2',
    ticketNumber: 'JD2',
    customerId: 'cust-2',
    customerName: 'Juan Dela Cruz',
    customerPhone: '0918 555 3821',
    items: [
      {
        id: 'item-2',
        serviceId: 'srv-1',
        name: 'Wash & Fold',
        unitPrice: 70,
        unitType: 'kg',
        quantity: 6,
        subtotal: 420
      },
      {
        id: 'item-2b',
        serviceId: 'srv-5',
        name: 'Steam Ironing Only',
        unitPrice: 50,
        unitType: 'item',
        quantity: 3,
        subtotal: 150,
        specialInstructions: '3 polo shirts'
      }
    ],
    totalWeightKg: 6,
    bagCount: 2,
    totalAmount: 570,
    amountPaid: 570,
    paymentStatus: 'PAID',
    paymentMethod: 'GCASH',
    status: 'WASHING',
    statusHistory: [
      {
        status: 'WASHING',
        timestamp: '2026-08-31 07:45 AM',
        updatedBy: 'Staff Arlene',
        note: 'Dropped off 2 bags. Paid via GCash.'
      },
      {
        status: 'WASHING',
        timestamp: '2026-08-31 08:15 AM',
        updatedBy: 'Staff Mark'
      },
      {
        status: 'WASHING',
        timestamp: '2026-08-31 09:30 AM',
        updatedBy: 'Staff Mark',
        note: 'Transfer to Dryer #2 (Medium Heat 45m)'
      }
    ],
    notes: 'Includes 3 collared polo shirts for pressing.',
    detergentOption: 'Breeze Power Clean',
    fragranceOption: 'Downy Floral Breeze',
    createdAt: '2026-08-31 07:45 AM',
    estimatedReadyAt: '2026-08-31 03:00 PM',
    staffName: 'Arlene Santos'
  },
  {
    id: 'tkt-3',
    ticketNumber: 'MS3',
    customerId: 'cust-3',
    customerName: 'Maria Santos',
    customerPhone: '0922 713 4901',
    items: [
      {
        id: 'item-3',
        serviceId: 'srv-1',
        name: 'Wash & Fold',
        unitPrice: 70,
        unitType: 'kg',
        quantity: 4.5,
        subtotal: 315
      },
      {
        id: 'item-3b',
        serviceId: 'srv-6',
        name: 'Heavy Comforter / Blanket',
        unitPrice: 250,
        unitType: 'piece',
        quantity: 1,
        subtotal: 250
      }
    ],
    totalWeightKg: 4.5,
    bagCount: 2,
    totalAmount: 565,
    amountPaid: 565,
    paymentStatus: 'PAID',
    paymentMethod: 'MAYA',
    status: 'READY',
    statusHistory: [
      {
        status: 'WASHING',
        timestamp: '2026-08-30 02:15 PM',
        updatedBy: 'Staff Mark'
      },
      {
        status: 'WASHING',
        timestamp: '2026-08-30 03:00 PM',
        updatedBy: 'Staff Mark'
      },
      {
        status: 'WASHING',
        timestamp: '2026-08-30 04:30 PM',
        updatedBy: 'Staff Arlene'
      },
      {
        status: 'FOLDING',
        timestamp: '2026-08-30 06:00 PM',
        updatedBy: 'Staff Arlene'
      },
      {
        status: 'READY',
        timestamp: '2026-08-31 08:00 AM',
        updatedBy: 'Staff Arlene',
        note: 'Stored on Rack A-12. Notification sent to customer.'
      }
    ],
    notes: 'King-sized duvet and everyday clothes.',
    detergentOption: 'Tide Liquid Concentrated',
    fragranceOption: 'Comfort Ultra Soft',
    createdAt: '2026-08-30 02:15 PM',
    estimatedReadyAt: '2026-08-31 10:00 AM',
    staffName: 'Mark Dizon'
  },
  {
    id: 'tkt-4',
    ticketNumber: 'AR4',
    customerId: 'cust-4',
    customerName: 'Angela Reyes',
    customerPhone: '0905 628 1144',
    items: [
      {
        id: 'item-4',
        serviceId: 'srv-1',
        name: 'Wash & Fold',
        unitPrice: 70,
        unitType: 'kg',
        quantity: 4.5,
        subtotal: 320
      }
    ],
    totalWeightKg: 4.5,
    bagCount: 1,
    totalAmount: 320,
    amountPaid: 320,
    paymentStatus: 'PAID',
    paymentMethod: 'CASH',
    status: 'READY',
    statusHistory: [
      {
        status: 'WASHING',
        timestamp: '2026-08-30 04:30 PM',
        updatedBy: 'Staff Arlene'
      },
      {
        status: 'WASHING',
        timestamp: '2026-08-30 05:15 PM',
        updatedBy: 'Staff Mark'
      },
      {
        status: 'WASHING',
        timestamp: '2026-08-30 06:45 PM',
        updatedBy: 'Staff Mark'
      },
      {
        status: 'FOLDING',
        timestamp: '2026-08-31 07:30 AM',
        updatedBy: 'Staff Arlene'
      },
      {
        status: 'READY',
        timestamp: '2026-08-31 08:45 AM',
        updatedBy: 'Staff Arlene',
        note: 'Bagged with clear garment wrap, Rack B-04.'
      }
    ],
    notes: 'Fragile delicates in wash net.',
    detergentOption: 'Perwoll Delicate Wash',
    createdAt: '2026-08-30 04:30 PM',
    estimatedReadyAt: '2026-08-31 12:00 PM',
    staffName: 'Arlene Santos'
  },
  {
    id: 'tkt-5',
    ticketNumber: 'CM5',
    customerId: 'cust-5',
    customerName: 'Carlos Mendoza',
    customerPhone: '0998 334 7720',
    items: [
      {
        id: 'item-5',
        serviceId: 'srv-3',
        name: 'Dry Cleaning (Barong / Suit)',
        unitPrice: 180,
        unitType: 'item',
        quantity: 2,
        subtotal: 360,
        specialInstructions: 'Piña silk barong and Italian wool suit jacket'
      },
      {
        id: 'item-5b',
        serviceId: 'srv-5',
        name: 'Steam Ironing Only',
        unitPrice: 50,
        unitType: 'item',
        quantity: 2,
        subtotal: 100
      }
    ],
    totalWeightKg: 1.5,
    bagCount: 1,
    totalAmount: 460,
    amountPaid: 0,
    paymentStatus: 'UNPAID',
    paymentMethod: 'CASH',
    status: 'FOLDING',
    statusHistory: [
      {
        status: 'WASHING',
        timestamp: '2026-08-30 11:00 AM',
        updatedBy: 'Staff Arlene'
      },
      {
        status: 'WASHING',
        timestamp: '2026-08-30 01:00 PM',
        updatedBy: 'Specialist Noel'
      },
      {
        status: 'WASHING',
        timestamp: '2026-08-30 04:00 PM',
        updatedBy: 'Specialist Noel'
      },
      {
        status: 'FOLDING',
        timestamp: '2026-08-31 09:00 AM',
        updatedBy: 'Staff Arlene',
        note: 'Finishing steam press and applying garment bag.'
      }
    ],
    notes: 'Collect payment ₱460 upon pickup. Customer will pay in Cash.',
    createdAt: '2026-08-30 11:00 AM',
    estimatedReadyAt: '2026-08-31 02:00 PM',
    staffName: 'Arlene Santos'
  },
  {
    id: 'tkt-6',
    ticketNumber: 'PG6',
    customerId: 'cust-6',
    customerName: 'Patricia Gomez',
    customerPhone: '0915 901 8832',
    items: [
      {
        id: 'item-6',
        serviceId: 'srv-1',
        name: 'Wash & Fold',
        unitPrice: 70,
        unitType: 'kg',
        quantity: 4,
        subtotal: 280
      }
    ],
    totalWeightKg: 4,
    bagCount: 1,
    totalAmount: 280,
    amountPaid: 280,
    paymentStatus: 'PAID',
    paymentMethod: 'GCASH',
    status: 'WASHING',
    statusHistory: [
      {
        status: 'WASHING',
        timestamp: '2026-08-31 09:40 AM',
        updatedBy: 'Staff Arlene',
        note: 'Queued for sorting and spot stain treatment.'
      }
    ],
    notes: 'Baby clothes - use mild allergen-free detergent only.',
    detergentOption: 'Cycles Baby Detergent',
    createdAt: '2026-08-31 09:40 AM',
    estimatedReadyAt: '2026-08-31 06:00 PM',
    staffName: 'Arlene Santos'
  },
  {
    id: 'tkt-7',
    ticketNumber: 'JT7',
    customerId: 'cust-7',
    customerName: 'Joshua Tan',
    customerPhone: '0928 412 0099',
    items: [
      {
        id: 'item-7',
        serviceId: 'srv-1',
        name: 'Wash & Fold',
        unitPrice: 70,
        unitType: 'kg',
        quantity: 5,
        subtotal: 350
      },
      {
        id: 'item-7b',
        serviceId: 'srv-7',
        name: 'Sneaker / Shoe Care',
        unitPrice: 220,
        unitType: 'pair',
        quantity: 1,
        subtotal: 220
      }
    ],
    totalWeightKg: 5,
    bagCount: 2,
    totalAmount: 570,
    amountPaid: 570,
    paymentStatus: 'PAID',
    paymentMethod: 'GCASH',
    status: 'COMPLETED',
    statusHistory: [
      {
        status: 'WASHING',
        timestamp: '2026-08-29 10:00 AM',
        updatedBy: 'Staff Arlene'
      },
      {
        status: 'WASHING',
        timestamp: '2026-08-29 11:30 AM',
        updatedBy: 'Staff Mark'
      },
      {
        status: 'WASHING',
        timestamp: '2026-08-29 01:15 PM',
        updatedBy: 'Staff Mark'
      },
      {
        status: 'FOLDING',
        timestamp: '2026-08-29 03:00 PM',
        updatedBy: 'Staff Arlene'
      },
      {
        status: 'READY',
        timestamp: '2026-08-29 04:30 PM',
        updatedBy: 'Staff Arlene'
      },
      {
        status: 'COMPLETED',
        timestamp: '2026-08-30 01:20 PM',
        updatedBy: 'Staff Arlene',
        note: 'Customer picked up at counter. Customer satisfied.'
      }
    ],
    notes: 'Nike Air Max sneakers cleaned & sanitized.',
    createdAt: '2026-08-29 10:00 AM',
    estimatedReadyAt: '2026-08-29 05:00 PM',
    completedAt: '2026-08-30 01:20 PM',
    staffName: 'Arlene Santos'
  },
  {
    id: 'tkt-8',
    ticketNumber: 'BA8',
    customerId: 'cust-8',
    customerName: 'Bea Alonzo-Ramos',
    customerPhone: '0917 112 3344',
    items: [
      {
        id: 'item-8',
        serviceId: 'srv-2',
        name: 'Premium Wash & Press',
        unitPrice: 95,
        unitType: 'kg',
        quantity: 6,
        subtotal: 570,
        specialInstructions: 'Delicates and linen'
      },
      {
        id: 'item-8b',
        serviceId: 'srv-6',
        name: 'Heavy Comforter / Blanket',
        unitPrice: 250,
        unitType: 'piece',
        quantity: 1,
        subtotal: 250
      }
    ],
    totalWeightKg: 6,
    bagCount: 2,
    totalAmount: 820,
    amountPaid: 0,
    paymentStatus: 'UNPAID',
    paymentMethod: 'CASH',
    status: 'READY',
    statusHistory: [
      {
        status: 'WASHING',
        timestamp: '2026-08-30 09:15 AM',
        updatedBy: 'Staff Arlene'
      },
      {
        status: 'WASHING',
        timestamp: '2026-08-30 10:30 AM',
        updatedBy: 'Staff Mark'
      },
      {
        status: 'WASHING',
        timestamp: '2026-08-30 01:00 PM',
        updatedBy: 'Staff Mark'
      },
      {
        status: 'FOLDING',
        timestamp: '2026-08-30 03:30 PM',
        updatedBy: 'Staff Arlene'
      },
      {
        status: 'READY',
        timestamp: '2026-08-31 08:15 AM',
        updatedBy: 'Staff Arlene',
        note: 'Rack C-02. Outstanding balance ₱820 to collect upon pickup.'
      }
    ],
    notes: 'Pay on pickup at the counter (₱820 Cash/GCash).',
    detergentOption: 'Ariel Professional Powder',
    fragranceOption: 'Downy Mystique',
    createdAt: '2026-08-30 09:15 AM',
    estimatedReadyAt: '2026-08-31 10:00 AM',
    staffName: 'Arlene Santos'
  },
  {
    id: 'tkt-9',
    ticketNumber: 'RH9',
    customerId: 'cust-9',
    customerName: 'Rico Hernandez',
    customerPhone: '0908 777 6622',
    items: [
      {
        id: 'item-9',
        serviceId: 'srv-1',
        name: 'Wash & Fold',
        unitPrice: 70,
        unitType: 'kg',
        quantity: 5,
        subtotal: 350
      },
      {
        id: 'item-9b',
        serviceId: 'srv-4',
        name: 'Curtains & Heavy Linens',
        unitPrice: 120,
        unitType: 'kg',
        quantity: 2,
        subtotal: 240
      }
    ],
    totalWeightKg: 7,
    bagCount: 2,
    totalAmount: 590,
    amountPaid: 300,
    paymentStatus: 'PARTIAL',
    paymentMethod: 'MAYA',
    status: 'READY',
    statusHistory: [
      {
        status: 'WASHING',
        timestamp: '2026-08-30 11:30 AM',
        updatedBy: 'Staff Arlene',
        note: 'Initial deposit ₱300 paid via Maya.'
      },
      {
        status: 'WASHING',
        timestamp: '2026-08-30 01:00 PM',
        updatedBy: 'Staff Mark'
      },
      {
        status: 'WASHING',
        timestamp: '2026-08-30 03:30 PM',
        updatedBy: 'Staff Mark'
      },
      {
        status: 'FOLDING',
        timestamp: '2026-08-30 05:45 PM',
        updatedBy: 'Staff Arlene'
      },
      {
        status: 'READY',
        timestamp: '2026-08-31 09:00 AM',
        updatedBy: 'Staff Arlene',
        note: 'Stored on Rack A-08. Collect remaining ₱290 balance.'
      }
    ],
    notes: 'Partial ₱300 paid. Remaining balance ₱290 upon pickup.',
    detergentOption: 'Breeze Power Clean',
    createdAt: '2026-08-30 11:30 AM',
    estimatedReadyAt: '2026-08-31 11:00 AM',
    staffName: 'Mark Dizon'
  },
  {
    id: 'tkt-10',
    ticketNumber: 'GV10',
    customerId: 'cust-10',
    customerName: 'Grace Villanueva',
    customerPhone: '0919 444 8811',
    items: [
      {
        id: 'item-10',
        serviceId: 'srv-3',
        name: 'Dry Cleaning (Barong / Suit)',
        unitPrice: 180,
        unitType: 'item',
        quantity: 2,
        subtotal: 360
      }
    ],
    totalWeightKg: 1,
    bagCount: 1,
    totalAmount: 360,
    amountPaid: 0,
    paymentStatus: 'UNPAID',
    paymentMethod: 'GCASH',
    status: 'READY',
    statusHistory: [
      {
        status: 'WASHING',
        timestamp: '2026-08-30 08:30 AM',
        updatedBy: 'Staff Arlene'
      },
      {
        status: 'WASHING',
        timestamp: '2026-08-30 10:00 AM',
        updatedBy: 'Specialist Noel'
      },
      {
        status: 'WASHING',
        timestamp: '2026-08-30 02:00 PM',
        updatedBy: 'Specialist Noel'
      },
      {
        status: 'FOLDING',
        timestamp: '2026-08-30 04:30 PM',
        updatedBy: 'Staff Arlene'
      },
      {
        status: 'READY',
        timestamp: '2026-08-31 08:30 AM',
        updatedBy: 'Staff Arlene',
        note: 'Garment bag hung on Rack VIP-01. Payment ₱360 due.'
      }
    ],
    notes: 'Dry cleaned blazers. Collect ₱360 at pickup.',
    createdAt: '2026-08-30 08:30 AM',
    estimatedReadyAt: '2026-08-31 09:30 AM',
    staffName: 'Arlene Santos'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    category: 'Detergent & Chemicals',
    amount: 1200,
    description: 'Ariel Professional Powder (25kg drum)',
    pieces: 1,
    date: '2026-08-31',
    recordedBy: 'Boss Dennis',
    referenceNo: 'INV-7819'
  },
  {
    id: 'exp-2',
    category: 'Electricity',
    amount: 4500,
    description: 'Meralco Commercial Power deposit',
    pieces: 1,
    date: '2026-08-30',
    recordedBy: 'Boss Dennis',
    referenceNo: 'MER-882193'
  },
  {
    id: 'exp-3',
    category: 'Water',
    amount: 2100,
    description: 'Maynilad commercial water utility',
    pieces: 1,
    date: '2026-08-29',
    recordedBy: 'Boss Dennis',
    referenceNo: 'MAY-44019'
  },
  {
    id: 'exp-4',
    category: 'Packaging & Supplies',
    amount: 850,
    description: 'Clear laundry bags & garment tags roll',
    pieces: 5,
    date: '2026-08-31',
    recordedBy: 'Staff Arlene',
    referenceNo: 'OR-55421'
  },
  {
    id: 'exp-5',
    category: 'Detergent & Chemicals',
    amount: 750,
    description: 'Downy Mystique & Floral Fabric Conditioner (5L)',
    pieces: 2,
    date: '2026-08-28',
    recordedBy: 'Staff Mark',
    referenceNo: 'OR-55319'
  },
  {
    id: 'exp-6',
    category: 'Equipment Maintenance',
    amount: 1400,
    description: 'Dryer lint vent exhaust cleaning & belt checkup',
    pieces: 2,
    date: '2026-08-27',
    recordedBy: 'Boss Dennis',
    referenceNo: 'SVC-1029'
  },
  {
    id: 'exp-7',
    category: 'Rent',
    amount: 18000,
    description: 'Commercial shop space monthly lease amortization',
    pieces: 1,
    date: '2026-08-01',
    recordedBy: 'Boss Dennis',
    referenceNo: 'LSE-202608'
  },
  {
    id: 'exp-8',
    category: 'Staff Wages',
    amount: 13700,
    description: 'Bi-monthly staff wages (2 operators + 1 specialist)',
    pieces: 3,
    date: '2026-08-15',
    recordedBy: 'Boss Dennis',
    referenceNo: 'PAY-20260815'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'Ariel Professional Powder',
    category: 'Detergent',
    currentStock: 18.5,
    minThreshold: 10,
    unit: 'kg',
    costPerUnit: 140,
    supplier: 'P&G Wholesale Manila',
    lastRestocked: '2026-08-31',
    status: 'In Stock'
  },
  {
    id: 'inv-2',
    name: 'Breeze Color Care Liquid',
    category: 'Detergent',
    currentStock: 4.0,
    minThreshold: 8,
    unit: 'L',
    costPerUnit: 180,
    supplier: 'Unilever Distro Hub',
    lastRestocked: '2026-08-24',
    status: 'Low Stock'
  },
  {
    id: 'inv-3',
    name: 'Downy Mystique Concentrate',
    category: 'Fabric Conditioner',
    currentStock: 12.0,
    minThreshold: 5,
    unit: 'L',
    costPerUnit: 165,
    supplier: 'P&G Wholesale Manila',
    lastRestocked: '2026-08-28',
    status: 'In Stock'
  },
  {
    id: 'inv-4',
    name: 'Surf Fabric Conditioner Blossom',
    category: 'Fabric Conditioner',
    currentStock: 2.5,
    minThreshold: 5,
    unit: 'L',
    costPerUnit: 120,
    supplier: 'Unilever Distro Hub',
    lastRestocked: '2026-08-18',
    status: 'Low Stock'
  },
  {
    id: 'inv-5',
    name: 'Zonrox Color Safe Bleach',
    category: 'Bleach & Chemicals',
    currentStock: 7.0,
    minThreshold: 4,
    unit: 'L',
    costPerUnit: 95,
    supplier: 'GreenCross Chem Supplies',
    lastRestocked: '2026-08-20',
    status: 'In Stock'
  },
  {
    id: 'inv-6',
    name: 'Heavy Duty Clear Laundry Bags (Large)',
    category: 'Packaging',
    currentStock: 340,
    minThreshold: 100,
    unit: 'pcs',
    costPerUnit: 1.8,
    supplier: 'Makati PolyPack Ind.',
    lastRestocked: '2026-08-31',
    status: 'In Stock'
  },
  {
    id: 'inv-7',
    name: 'Garment Paper Tags & Cable Pins',
    category: 'Packaging',
    currentStock: 45,
    minThreshold: 80,
    unit: 'pcs',
    costPerUnit: 0.75,
    supplier: 'Makati PolyPack Ind.',
    lastRestocked: '2026-08-10',
    status: 'Low Stock'
  },
  {
    id: 'inv-8',
    name: 'Wire & Plastic Hangers (Bulk)',
    category: 'Accessories',
    currentStock: 120,
    minThreshold: 50,
    unit: 'pcs',
    costPerUnit: 6.5,
    supplier: 'Divisoria Commercial Supplies',
    lastRestocked: '2026-08-15',
    status: 'In Stock'
  }
];

export const INITIAL_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'pay-1',
    date: '2026-08-31 08:30 AM',
    ticketId: 'tkt-1',
    ticketNumber: 'LM1',
    customerName: 'Luis Miguel',
    amount: 350,
    paymentStatus: 'PAID',
    paymentMethod: 'CASH',
    notes: 'Exact cash counter payment'
  },
  {
    id: 'pay-2',
    date: '2026-08-31 07:45 AM',
    ticketId: 'tkt-2',
    ticketNumber: 'JD2',
    customerName: 'Juan Dela Cruz',
    amount: 570,
    paymentStatus: 'PAID',
    paymentMethod: 'GCASH',
    notes: 'GCash Ref: 90281928'
  },
  {
    id: 'pay-3',
    date: '2026-08-30 02:15 PM',
    ticketId: 'tkt-3',
    ticketNumber: 'MS3',
    customerName: 'Maria Santos',
    amount: 565,
    paymentStatus: 'PAID',
    paymentMethod: 'MAYA',
    notes: 'Maya QR scan at counter'
  },
  {
    id: 'pay-4',
    date: '2026-08-30 04:30 PM',
    ticketId: 'tkt-4',
    ticketNumber: 'AR4',
    customerName: 'Angela Reyes',
    amount: 320,
    paymentStatus: 'PAID',
    paymentMethod: 'CASH',
    notes: 'Cash received'
  },
  {
    id: 'pay-5',
    date: '2026-08-31 09:40 AM',
    ticketId: 'tkt-6',
    ticketNumber: 'PG6',
    customerName: 'Patricia Gomez',
    amount: 280,
    paymentStatus: 'PAID',
    paymentMethod: 'GCASH',
    notes: 'GCash mobile transfer'
  },
  {
    id: 'pay-6',
    date: '2026-08-31 10:15 AM',
    ticketId: 'tkt-prev-1',
    ticketNumber: 'RC8',
    customerName: 'Roberto Cruz',
    amount: 720,
    paymentStatus: 'PAID',
    paymentMethod: 'CASH',
    notes: 'Counter payment upon pickup'
  },
  {
    id: 'pay-7',
    date: '2026-08-31 11:00 AM',
    ticketId: 'tkt-prev-2',
    ticketNumber: 'DP9',
    customerName: 'Danica Perez',
    amount: 480,
    paymentStatus: 'PAID',
    paymentMethod: 'GCASH',
    notes: 'GCash reference verified'
  }
];

export const OWNER_ANALYTICS = {
  todayRevenue: 8450,
  monthlyRevenue: 185300,
  ordersCount: 47,
  completedCount: 32,
  pendingCount: 15,
  expensesTotal: 42500,
  netRevenue: 142800,
  revenueTrend: [
    { day: 'Mon', revenue: 7800, expenses: 1400, net: 6400, orders: 42 },
    { day: 'Tue', revenue: 6400, expenses: 900, net: 5500, orders: 36 },
    { day: 'Wed', revenue: 8900, expenses: 2200, net: 6700, orders: 48 },
    { day: 'Thu', revenue: 7100, expenses: 1100, net: 6000, orders: 39 },
    { day: 'Fri', revenue: 9400, expenses: 1800, net: 7600, orders: 53 },
    { day: 'Sat', revenue: 12500, expenses: 3100, net: 9400, orders: 68 },
    { day: 'Sun', revenue: 11200, expenses: 2400, net: 8800, orders: 61 }
  ],
  monthlyTrend: [
    { month: 'Mar', revenue: 142000, expenses: 38000, net: 104000 },
    { month: 'Apr', revenue: 156000, expenses: 40500, net: 115500 },
    { month: 'May', revenue: 168000, expenses: 41200, net: 126800 },
    { month: 'Jun', revenue: 174000, expenses: 39800, net: 134200 },
    { month: 'Jul', revenue: 179500, expenses: 43100, net: 136400 },
    { month: 'Aug', revenue: 185300, expenses: 42500, net: 142800 }
  ],
  popularServices: [
    { name: 'Wash & Fold', percentage: 45, count: 184, revenue: 83385, color: '#0ea5e9' },
    { name: 'Dry Cleaning', percentage: 25, count: 68, revenue: 46325, color: '#6366f1' },
    { name: 'Ironing Only', percentage: 18, count: 92, revenue: 33354, color: '#10b981' },
    { name: 'Comforters & Other', percentage: 12, count: 41, revenue: 22236, color: '#f59e0b' }
  ],
  statusBreakdown: {
    received: 8,
    washing: 8,
    drying: 6,
    folding: 4,
    ready: 9,
    completed: 32
  },
  peakHours: [
    { hour: '7 AM - 9 AM', label: 'Morning Drop-offs', volume: 38 },
    { hour: '9 AM - 12 PM', label: 'Mid-Morning', volume: 22 },
    { hour: '12 PM - 3 PM', label: 'Afternoon Processing', volume: 15 },
    { hour: '3 PM - 6 PM', label: 'Afternoon Drop-offs', volume: 44 },
    { hour: '6 PM - 8 PM', label: 'Evening Pickups', volume: 56 }
  ]
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
