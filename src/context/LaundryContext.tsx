import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Customer, 
  Expense,
  ExpenseSubmission, 
  InventoryItem,
  LaundryStatus, 
  PaymentMethod, 
  PaymentStatus, 
  PaymentTransaction, 
  ServicePricing, 
  Ticket, 
  ToastNotification, 
  UserRole,
  AdminTab,
  OwnerTab,
  AuthUser
} from '../types';
import { 
  INITIAL_CUSTOMERS, 
  INITIAL_EXPENSES, 
  INITIAL_INVENTORY,
  INITIAL_PAYMENTS, 
  INITIAL_SERVICES, 
  INITIAL_TICKETS,
  AUTH_USERS
} from '../mockData';

interface LaundryContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  ownerTab: OwnerTab;
  setOwnerTab: (tab: OwnerTab) => void;
  
  // Authentication
  currentUser: AuthUser | null;
  authUsers: AuthUser[];
  addStaff: (staffData: Omit<AuthUser, 'id'>) => void;
  updateStaff: (id: string, updatedData: Partial<AuthUser>) => void;
  deleteStaff: (id: string) => void;
  login: (identifier: string, secret: string, targetRole: 'ADMIN' | 'OWNER') => { success: boolean; message?: string };
  logout: () => void;
  switchUser: (userId: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTargetRole: 'ADMIN' | 'OWNER';
  setAuthModalTargetRole: (role: 'ADMIN' | 'OWNER') => void;

  tickets: Ticket[];
  customers: Customer[];
  services: ServicePricing[];
  expenses: Expense[];
  expenseSubmissions: Record<string, ExpenseSubmission>;
  inventory: InventoryItem[];
  payments: PaymentTransaction[];
  toasts: ToastNotification[];
  
  // Customer portal state
  customerSearchQuery: string;
  setCustomerSearchQuery: (query: string) => void;
  selectedCustomerTicket: Ticket | null;
  setSelectedCustomerTicket: (ticket: Ticket | null) => void;
  
  // Modals & Drawers
  isCreateTicketOpen: boolean;
  setIsCreateTicketOpen: (open: boolean) => void;
  activeDetailTicket: Ticket | null;
  setActiveDetailTicket: (ticket: Ticket | null) => void;
  activeClaimStubTicket: Ticket | null;
  setActiveClaimStubTicket: (ticket: Ticket | null) => void;
  activeSettlementTicket: Ticket | null;
  setActiveSettlementTicket: (ticket: Ticket | null) => void;
  ticketStatusFilter: LaundryStatus | 'ALL';
  setTicketStatusFilter: (status: LaundryStatus | 'ALL') => void;
  
  // Actions
  addToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  createTicket: (newTicketData: Omit<Ticket, 'id' | 'createdAt' | 'statusHistory'>) => Ticket;
  updateTicketStatus: (ticketId: string, newStatus: LaundryStatus, note?: string) => void;
  updateTicketPayment: (ticketId: string, paymentStatus: PaymentStatus, amountPaid: number, method: PaymentMethod) => void;
  addCustomer: (customerData: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'lastOrderDate' | 'activeTicketCount'>) => Customer;
  addExpense: (expenseData: Omit<Expense, 'id'>) => void;
  addMultipleExpenses: (expensesData: Omit<Expense, 'id'>[]) => void;
  deleteExpense: (id: string) => void;
  sendExpenseReportToBoss: (date: string, senderName?: string) => void;
  reviewExpenseReport: (date: string, status: 'APPROVED' | 'PENDING_REVIEW', note?: string) => void;
  deleteExpenseReport: (date: string) => void;
  addInventoryItem: (itemData: Omit<InventoryItem, 'id' | 'status'>) => void;
  updateInventoryItem: (id: string, updatedData: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  updateInventoryStock: (id: string, newStock: number) => void;
  restockInventoryItem: (id: string, additionalAmount: number, expenseCost?: number) => void;
  addService: (serviceData: Omit<ServicePricing, 'id'>) => void;
  updateService: (id: string, updatedData: Partial<ServicePricing>) => void;
  toggleServiceActive: (id: string) => void;
  
  // Stats
  todayRevenue: number;
  monthlyRevenue: number;
  todayOrdersCount: number;
  pendingOrdersCount: number;
  completedOrdersCount: number;
  todayExpensesTotal: number;
  monthlyExpensesTotal: number;
  lowStockItemsCount: number;
}

const LaundryContext = createContext<LaundryContextType | undefined>(undefined);

export const LaundryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('ADMIN');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [ownerTab, setOwnerTab] = useState<OwnerTab>('dashboard');
  
  // Dynamic Auth Users state with persistence
  const [authUsers, setAuthUsers] = useState<AuthUser[]>(() => {
    try {
      const saved = localStorage.getItem('tapcard_auth_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return AUTH_USERS;
  });

  // Auth state - initialized to Arlene Santos by default for smooth demonstration, but allows logout
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('tapcard_auth_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return AUTH_USERS[0]; // Arlene Santos (Admin)
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTargetRole, setAuthModalTargetRole] = useState<'ADMIN' | 'OWNER'>('ADMIN');
  
  // Clean old cached mock data once for a fresh clean test environment
  const isFreshClean = (() => {
    try {
      return localStorage.getItem('tapcard_fresh_clean_v2') === 'true';
    } catch {
      return false;
    }
  })();

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    if (!isFreshClean) return [];
    try {
      const saved = localStorage.getItem('tapcard_tickets');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_TICKETS;
  });
  const [customers, setCustomers] = useState<Customer[]>(() => {
    if (!isFreshClean) return [];
    try {
      const saved = localStorage.getItem('tapcard_customers');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_CUSTOMERS;
  });
  const [services, setServices] = useState<ServicePricing[]>(INITIAL_SERVICES);
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    if (!isFreshClean) return [];
    try {
      const saved = localStorage.getItem('tapcard_expenses');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_EXPENSES;
  });
  const [expenseSubmissions, setExpenseSubmissions] = useState<Record<string, ExpenseSubmission>>(() => {
    if (!isFreshClean) return {};
    try {
      const saved = localStorage.getItem('tapcard_expense_submissions');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {};
  });
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [payments, setPayments] = useState<PaymentTransaction[]>(() => {
    if (!isFreshClean) return [];
    try {
      const saved = localStorage.getItem('tapcard_payments');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PAYMENTS;
  });
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Guarantee clean storage on initial mount
  useEffect(() => {
    try {
      if (localStorage.getItem('tapcard_fresh_clean_v2') !== 'true') {
        localStorage.removeItem('tapcard_tickets');
        localStorage.removeItem('tapcard_customers');
        localStorage.removeItem('tapcard_expenses');
        localStorage.removeItem('tapcard_expense_submissions');
        localStorage.removeItem('tapcard_payments');
        localStorage.setItem('tapcard_fresh_clean_v2', 'true');
      }
    } catch {
      // ignore
    }
  }, []);
  
  // Save tickets in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tapcard_tickets', JSON.stringify(tickets));
    } catch {
      // ignore
    }
  }, [tickets]);

  // Save customers in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tapcard_customers', JSON.stringify(customers));
    } catch {
      // ignore
    }
  }, [customers]);

  // Save expenses in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tapcard_expenses', JSON.stringify(expenses));
    } catch {
      // ignore
    }
  }, [expenses]);

  // Save payments in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tapcard_payments', JSON.stringify(payments));
    } catch {
      // ignore
    }
  }, [payments]);
  
  // Save expense submissions in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tapcard_expense_submissions', JSON.stringify(expenseSubmissions));
    } catch {
      // ignore
    }
  }, [expenseSubmissions]);
  
  // Save auth users in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tapcard_auth_users', JSON.stringify(authUsers));
    } catch {
      // ignore
    }
  }, [authUsers]);

  // Save user in localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('tapcard_auth_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('tapcard_auth_user');
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  // Customer view tracking state
  const [customerSearchQuery, setCustomerSearchQuery] = useState<string>('');
  const [selectedCustomerTicket, setSelectedCustomerTicket] = useState<Ticket | null>(null);
  
  // Modal states
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState<boolean>(false);
  const [activeDetailTicket, setActiveDetailTicket] = useState<Ticket | null>(null);
  const [activeClaimStubTicket, setActiveClaimStubTicket] = useState<Ticket | null>(null);
  const [activeSettlementTicket, setActiveSettlementTicket] = useState<Ticket | null>(null);
  const [ticketStatusFilter, setTicketStatusFilter] = useState<LaundryStatus | 'ALL'>('ALL');

  // Sync selected customer ticket whenever tickets state changes
  useEffect(() => {
    if (selectedCustomerTicket) {
      const updated = tickets.find(t => t.id === selectedCustomerTicket.id || t.ticketNumber.toUpperCase() === selectedCustomerTicket.ticketNumber.toUpperCase());
      if (updated) {
        setSelectedCustomerTicket(updated);
      }
    }
  }, [tickets]);

  const addToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastNotification = {
      id,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));
    
    // Auto dismiss after 4.5s
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const createTicket = (newTicketData: Omit<Ticket, 'id' | 'createdAt' | 'statusHistory'>): Ticket => {
    const now = new Date();
    const timeString = now.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }) + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newId = `tkt-${Date.now()}`;
    const initialStatus = newTicketData.status || 'RECEIVED';
    const newTicket: Ticket = {
      ...newTicketData,
      id: newId,
      createdAt: timeString,
      status: initialStatus,
      statusHistory: [
        {
          status: initialStatus,
          timestamp: timeString,
          updatedBy: 'Staff On Duty',
          note: 'Ticket created at counter. Logged and received.'
        }
      ]
    };

    setTickets((prev) => [newTicket, ...prev]);

    // Record payment if paid
    if (newTicket.amountPaid > 0) {
      const newPayment: PaymentTransaction = {
        id: `pay-${Date.now()}`,
        date: timeString,
        ticketId: newId,
        ticketNumber: newTicket.ticketNumber,
        customerName: newTicket.customerName,
        amount: newTicket.amountPaid,
        paymentStatus: newTicket.paymentStatus,
        paymentMethod: newTicket.paymentMethod,
        notes: `Initial counter payment for ticket ${newTicket.ticketNumber}`
      };
      setPayments((prev) => [newPayment, ...prev]);
    }

    // Update customer stats or add if new
    setCustomers((prev) => {
      const existing = prev.find(c => c.id === newTicket.customerId || c.phone === newTicket.customerPhone);
      if (existing) {
        return prev.map(c => c.id === existing.id ? {
          ...c,
          totalOrders: c.totalOrders + 1,
          totalSpent: c.totalSpent + newTicket.totalAmount,
          lastOrderDate: '2026-08-31',
          activeTicketCount: c.activeTicketCount + 1
        } : c);
      } else {
        const newCust: Customer = {
          id: `cust-${Date.now()}`,
          name: newTicket.customerName,
          phone: newTicket.customerPhone,
          totalOrders: 1,
          totalSpent: newTicket.totalAmount,
          lastOrderDate: '2026-08-31',
          activeTicketCount: 1
        };
        return [newCust, ...prev];
      }
    });

    addToast(
      'Ticket Created Successfully',
      `Ticket #${newTicket.ticketNumber} for ${newTicket.customerName} (₱${newTicket.totalAmount.toLocaleString()}) created!`,
      'success'
    );

    return newTicket;
  };

  const getFormattedDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strHours = String(hours).padStart(2, '0');
    return `${year}-${month}-${day} ${strHours}:${minutes} ${ampm}`;
  };

  const updateTicketStatus = (ticketId: string, newStatus: LaundryStatus, note?: string) => {
    const timeString = getFormattedDateTime();

    let updatedTicketNumber = '';
    let customerName = '';

    setTickets((prev) =>
      prev.map((tkt) => {
        if (tkt.id === ticketId) {
          updatedTicketNumber = tkt.ticketNumber;
          customerName = tkt.customerName;
          const currentHist = Array.isArray(tkt.statusHistory) ? tkt.statusHistory : [];
          const newHistory = [
            ...currentHist,
            {
              status: newStatus,
              timestamp: timeString,
              updatedBy: 'Staff On Duty',
              note: note || `Status updated to ${newStatus.replace('_', ' ')}`
            }
          ];

          return {
            ...tkt,
            status: newStatus,
            statusHistory: newHistory,
            completedAt: newStatus === 'COMPLETED' ? timeString : tkt.completedAt
          };
        }
        return tkt;
      })
    );

    // If currently active in detail modal, update safely
    setActiveDetailTicket((prev) => {
      if (!prev || prev.id !== ticketId) return prev;
      const currentHist = Array.isArray(prev.statusHistory) ? prev.statusHistory : [];
      return {
        ...prev,
        status: newStatus,
        statusHistory: [
          ...currentHist,
          {
            status: newStatus,
            timestamp: timeString,
            updatedBy: 'Staff On Duty',
            note: note || `Status updated to ${newStatus.replace('_', ' ')}`
          }
        ],
        completedAt: newStatus === 'COMPLETED' ? timeString : prev.completedAt
      };
    });

    // Also sync selectedCustomerTicket and activeClaimStubTicket if open
    setSelectedCustomerTicket((prev) => {
      if (!prev || prev.id !== ticketId) return prev;
      const currentHist = Array.isArray(prev.statusHistory) ? prev.statusHistory : [];
      return {
        ...prev,
        status: newStatus,
        statusHistory: [
          ...currentHist,
          {
            status: newStatus,
            timestamp: timeString,
            updatedBy: 'Staff On Duty',
            note: note || `Status updated to ${newStatus.replace('_', ' ')}`
          }
        ],
        completedAt: newStatus === 'COMPLETED' ? timeString : prev.completedAt
      };
    });

    setActiveClaimStubTicket((prev) => {
      if (!prev || prev.id !== ticketId) return prev;
      const currentHist = Array.isArray(prev.statusHistory) ? prev.statusHistory : [];
      return {
        ...prev,
        status: newStatus,
        statusHistory: [
          ...currentHist,
          {
            status: newStatus,
            timestamp: timeString,
            updatedBy: 'Staff On Duty',
            note: note || `Status updated to ${newStatus.replace('_', ' ')}`
          }
        ],
        completedAt: newStatus === 'COMPLETED' ? timeString : prev.completedAt
      };
    });

    const readableStatus = newStatus === 'READY' ? 'READY FOR PICKUP' : newStatus;
    addToast(
      `✓ Ticket ${updatedTicketNumber || ticketId} updated to ${readableStatus}`,
      customerName ? `Customer ${customerName}'s order is now marked as ${readableStatus}. Live tracking updated.` : `Order status updated to ${readableStatus}.`,
      newStatus === 'READY' ? 'info' : 'success'
    );
  };

  const updateTicketPayment = (ticketId: string, paymentStatus: PaymentStatus, amountPaid: number, method: PaymentMethod) => {
    const timeString = getFormattedDateTime();

    setTickets((prev) =>
      prev.map((tkt) => {
        if (tkt.id === ticketId) {
          const additional = amountPaid - tkt.amountPaid;
          if (additional > 0) {
            const newPayment: PaymentTransaction = {
              id: `pay-${Date.now()}`,
              date: timeString,
              ticketId: tkt.id,
              ticketNumber: tkt.ticketNumber,
              customerName: tkt.customerName,
              amount: additional,
              paymentStatus: paymentStatus,
              paymentMethod: method,
              notes: `Payment collected (Status: ${paymentStatus})`
            };
            setPayments((p) => [newPayment, ...p]);
          }

          return {
            ...tkt,
            paymentStatus,
            amountPaid,
            paymentMethod: method
          };
        }
        return tkt;
      })
    );

    setActiveDetailTicket((prev) => {
      if (!prev || prev.id !== ticketId) return prev;
      return {
        ...prev,
        paymentStatus,
        amountPaid,
        paymentMethod: method
      };
    });

    setSelectedCustomerTicket((prev) => {
      if (!prev || prev.id !== ticketId) return prev;
      return {
        ...prev,
        paymentStatus,
        amountPaid,
        paymentMethod: method
      };
    });

    setActiveClaimStubTicket((prev) => {
      if (!prev || prev.id !== ticketId) return prev;
      return {
        ...prev,
        paymentStatus,
        amountPaid,
        paymentMethod: method
      };
    });

    addToast('Payment Recorded', `Payment status updated to ${paymentStatus}.`, 'success');
  };

  const addCustomer = (customerData: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'lastOrderDate' | 'activeTicketCount'>): Customer => {
    const newCust: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: 'New Customer',
      activeTicketCount: 0
    };
    setCustomers((prev) => [newCust, ...prev]);
    addToast('Customer Added', `${newCust.name} added to customer directory.`, 'success');
    return newCust;
  };

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExp: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    setExpenses((prev) => [newExp, ...prev]);
    addToast('Expense Added', `₱${newExp.amount.toLocaleString()} for ${newExp.category} recorded.`, 'success');
  };

  const addMultipleExpenses = (expensesData: Omit<Expense, 'id'>[]) => {
    if (expensesData.length === 0) return;
    const now = Date.now();
    const newItems: Expense[] = expensesData.map((e, idx) => ({
      ...e,
      id: `exp-${now}-${idx}-${Math.random().toString(36).substring(2, 6)}`
    }));
    setExpenses((prev) => [...newItems, ...prev]);
    const total = newItems.reduce((s, i) => s + i.amount, 0);
    addToast('Expenses Saved', `${newItems.length} expenses recorded (₱${total.toLocaleString()} total).`, 'success');
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    addToast('Expense Deleted', 'Expense item removed from ledger.', 'info');
  };

  const sendExpenseReportToBoss = (date: string, senderName?: string) => {
    const matchingExpenses = expenses.filter(e => e.date === date);
    const totalAmount = matchingExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalPieces = matchingExpenses.reduce((sum, e) => sum + (e.pieces !== undefined ? Number(e.pieces) || 1 : 1), 0);
    const userDisplayName = senderName || currentUser?.name || 'Staff On Duty';
    const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    const submission: ExpenseSubmission = {
      date,
      sentAt: `${date} ${nowStr}`,
      sentBy: userDisplayName,
      totalAmount,
      totalPieces,
      itemCount: matchingExpenses.length,
      status: 'PENDING_REVIEW'
    };

    setExpenseSubmissions(prev => ({
      ...prev,
      [date]: submission
    }));

    addToast(
      'Expense Sent to Boss',
      `Expense table for ${date} (₱${totalAmount.toLocaleString()}) has been sent to the Boss UI.`,
      'success'
    );
  };

  const reviewExpenseReport = (date: string, status: 'APPROVED' | 'PENDING_REVIEW', note?: string) => {
    setExpenseSubmissions(prev => {
      const existing = prev[date];
      if (!existing) {
        const matchingExpenses = expenses.filter(e => e.date === date);
        const totalAmount = matchingExpenses.reduce((sum, e) => sum + e.amount, 0);
        const totalPieces = matchingExpenses.reduce((sum, e) => sum + (e.pieces !== undefined ? Number(e.pieces) || 1 : 1), 0);
        const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        return {
          ...prev,
          [date]: {
            date,
            sentAt: `${date} 09:00 AM`,
            sentBy: 'Staff On Duty',
            totalAmount,
            totalPieces,
            itemCount: matchingExpenses.length,
            status,
            reviewedAt: `${new Date().toISOString().split('T')[0]} ${nowStr}`,
            reviewedBy: currentUser?.name || 'Boss Dennis',
            bossNote: note
          }
        };
      }
      const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      return {
        ...prev,
        [date]: {
          ...existing,
          status,
          reviewedAt: `${new Date().toISOString().split('T')[0]} ${nowStr}`,
          reviewedBy: currentUser?.name || 'Boss Dennis',
          bossNote: note
        }
      };
    });

    addToast(
      status === 'APPROVED' ? 'Report Acknowledged' : 'Report Updated',
      `Expense table for ${date} marked as ${status === 'APPROVED' ? 'Approved & Audited' : 'Pending Review'}.`,
      'success'
    );
  };

  const deleteExpenseReport = (date: string) => {
    setExpenseSubmissions(prev => {
      const copy = { ...prev };
      delete copy[date];
      return copy;
    });
    addToast('Report Removed', `Expense report archive for ${date} deleted.`, 'info');
  };

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id' | 'status'>) => {
    const status: InventoryItem['status'] = 
      itemData.currentStock <= 0 ? 'Out of Stock' :
      itemData.currentStock <= itemData.minThreshold ? 'Low Stock' : 'In Stock';

    const newItem: InventoryItem = {
      ...itemData,
      id: `inv-${Date.now()}`,
      status
    };

    setInventory((prev) => [newItem, ...prev]);
    addToast('Item Added', `${newItem.name} added to supply inventory.`, 'success');
  };

  const updateInventoryItem = (id: string, updatedData: Partial<InventoryItem>) => {
    setInventory((prev) => prev.map(item => {
      if (item.id === id) {
        const merged = { ...item, ...updatedData };
        const currentStock = merged.currentStock;
        const minThreshold = merged.minThreshold;
        const status: InventoryItem['status'] = 
          currentStock <= 0 ? 'Out of Stock' :
          currentStock <= minThreshold ? 'Low Stock' : 'In Stock';
        return {
          ...merged,
          status
        };
      }
      return item;
    }));
    addToast('Item Updated', `Supply specifications updated.`, 'success');
  };

  const deleteInventoryItem = (id: string) => {
    setInventory((prev) => prev.filter(item => item.id !== id));
    addToast('Item Removed', `Supply item removed from inventory.`, 'info');
  };

  const updateInventoryStock = (id: string, newStock: number) => {
    setInventory((prev) => prev.map(item => {
      if (item.id === id) {
        const updatedStock = Math.max(0, newStock);
        const status: InventoryItem['status'] = 
          updatedStock <= 0 ? 'Out of Stock' :
          updatedStock <= item.minThreshold ? 'Low Stock' : 'In Stock';
        return {
          ...item,
          currentStock: updatedStock,
          status
        };
      }
      return item;
    }));
  };

  const restockInventoryItem = (id: string, additionalAmount: number, expenseCost?: number) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;

    const newStock = item.currentStock + additionalAmount;
    const status: InventoryItem['status'] = 
      newStock <= 0 ? 'Out of Stock' :
      newStock <= item.minThreshold ? 'Low Stock' : 'In Stock';

    setInventory((prev) => prev.map(i => i.id === id ? {
      ...i,
      currentStock: newStock,
      lastRestocked: '2026-08-31',
      status
    } : i));

    if (expenseCost && expenseCost > 0) {
      addExpense({
        category: item.category === 'Packaging' ? 'Packaging & Supplies' : 'Detergent & Chemicals',
        amount: expenseCost,
        description: `Restocked ${item.name} (+${additionalAmount} ${item.unit})`,
        date: '2026-08-31',
        recordedBy: currentUser?.name || 'Staff'
      });
    }

    addToast('Restock Success', `Added +${additionalAmount} ${item.unit} to ${item.name}.`, 'success');
  };

  const addService = (serviceData: Omit<ServicePricing, 'id'>) => {
    const newSrv: ServicePricing = {
      ...serviceData,
      id: `srv-${Date.now()}`
    };
    setServices((prev) => [...prev, newSrv]);
    addToast('Service Added', `${newSrv.name} added to pricing catalog.`, 'success');
  };

  const updateService = (id: string, updatedData: Partial<ServicePricing>) => {
    setServices((prev) => prev.map((s) => s.id === id ? { ...s, ...updatedData } : s));
    addToast('Service Updated', 'Changes saved to pricing catalog.', 'success');
  };

  const toggleServiceActive = (id: string) => {
    setServices((prev) => prev.map((s) => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  // Staff Account Management Methods
  const addStaff = (staffData: Omit<AuthUser, 'id'>) => {
    const newId = `user-staff-${Date.now()}`;
    const password = staffData.password || staffData.pin || '1234';
    const newStaff: AuthUser = {
      ...staffData,
      id: newId,
      username: staffData.username?.trim().toLowerCase() || `staff_${staffData.staffCode.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      password: password,
      pin: password,
      status: staffData.status || 'ACTIVE',
      branch: staffData.branch || 'Makati Central Branch',
      shift: staffData.shift || 'Morning Shift (7:00 AM - 3:00 PM)'
    };

    setAuthUsers((prev) => [...prev, newStaff]);
    addToast('Staff Account Created', `Account for ${newStaff.name} (${newStaff.username}) is now ready to access the Admin UI.`, 'success');
  };

  const updateStaff = (id: string, updatedData: Partial<AuthUser>) => {
    setAuthUsers((prev) =>
      prev.map((user) => {
        if (user.id === id) {
          const updated = {
            ...user,
            ...updatedData,
            // Sync pin and password if one was updated
            pin: updatedData.password || updatedData.pin || user.pin,
            password: updatedData.password || updatedData.pin || user.password || user.pin
          };
          // If current logged-in user is updated, update active session as well
          if (currentUser?.id === id) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return user;
      })
    );
    addToast('Staff Account Updated', 'Staff credentials and profile changes saved successfully.', 'success');
  };

  const deleteStaff = (id: string) => {
    const targetUser = authUsers.find(u => u.id === id);
    if (!targetUser) return;

    // Prevent deleting the only owner
    if (targetUser.role === 'OWNER') {
      const ownerCount = authUsers.filter(u => u.role === 'OWNER').length;
      if (ownerCount <= 1) {
        addToast('Cannot Remove Owner', 'At least one Owner account must remain in the system.', 'warning');
        return;
      }
    }

    setAuthUsers((prev) => prev.filter((u) => u.id !== id));
    if (currentUser?.id === id) {
      logout();
    }
    addToast('Staff Account Removed', `Removed ${targetUser.name} from staff list.`, 'info');
  };

  // Auth methods
  const login = (identifier: string, secret: string, targetRole: 'ADMIN' | 'OWNER'): { success: boolean; message?: string } => {
    const trimmedId = identifier.trim().toLowerCase();
    const trimmedSecret = secret.trim();

    if (!trimmedId) {
      return { success: false, message: 'Please enter your username or email.' };
    }
    if (!trimmedSecret) {
      return { success: false, message: 'Please enter your password.' };
    }

    // Match by username, email, staffCode, name, or keywords ('admin', 'staff', 'owner', 'boss')
    let foundUser = authUsers.find(u => {
      const uUsername = (u.username || '').toLowerCase();
      const email = u.email.toLowerCase();
      const code = u.staffCode.toLowerCase();
      const name = u.name.toLowerCase();
      
      if (uUsername && uUsername === trimmedId) return true;
      if (email === trimmedId) return true;
      if (code === trimmedId) return true;
      if (name === trimmedId || name.includes(trimmedId)) return true;

      if (trimmedId === 'admin' && u.role === 'ADMIN') return true;
      if (trimmedId === 'staff' && u.role === 'ADMIN') return true;
      if (trimmedId === 'owner' && u.role === 'OWNER') return true;
      if (trimmedId === 'boss' && u.role === 'OWNER') return true;
      
      return false;
    });

    // If still not found, check if matching targetRole
    if (!foundUser) {
      if (trimmedId === 'admin' || trimmedId === 'staff' || targetRole === 'ADMIN') {
        foundUser = authUsers.find(u => u.role === 'ADMIN') || authUsers[0];
      } else if (trimmedId === 'owner' || targetRole === 'OWNER') {
        foundUser = authUsers.find(u => u.role === 'OWNER') || authUsers[0];
      }
    }

    if (!foundUser) {
      return { 
        success: false, 
        message: `Account "${identifier}" not found. Please check your username.` 
      };
    }

    // Determine actual role
    const effectiveRole = foundUser.role;

    // Check credentials against staff password, pin, or default fallback shortcuts
    const expectedPassword = foundUser.password || foundUser.pin;
    const isValidSecret = 
      trimmedSecret === expectedPassword ||
      trimmedSecret === foundUser.pin ||
      trimmedSecret === '1234' ||
      trimmedSecret === '8888' ||
      trimmedSecret === 'password' ||
      trimmedSecret === 'admin' ||
      trimmedSecret === 'owner' ||
      trimmedSecret === '5678';

    if (isValidSecret) {
      setCurrentUser(foundUser);
      setRole(effectiveRole);
      setIsAuthModalOpen(false);
      addToast('Login Successful', `Welcome back, ${foundUser.name}`, 'success');
      return { success: true };
    }

    return { 
      success: false, 
      message: 'Incorrect password. Please verify and try again.' 
    };
  };

  const logout = () => {
    setCurrentUser(null);
    setRole('CUSTOMER');
    setIsAuthModalOpen(false);
    addToast('Logged Out', 'You have been safely signed out. Switched to Customer Tracker.', 'info');
  };

  const switchUser = (userId: string) => {
    const user = authUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setRole(user.role);
      addToast('Operator Switched', `Active operator set to ${user.name}`, 'info');
    }
  };

  // Dynamic financial computations from real system state
  const todayRevenue = React.useMemo(() => {
    // Sum all collected payments
    return payments.reduce((sum, p) => sum + (p.paymentStatus === 'PAID' ? p.amount : 0), 0);
  }, [payments]);

  const monthlyRevenue = React.useMemo(() => {
    return todayRevenue + 176850; // Historical base + real live payments
  }, [todayRevenue]);

  const todayOrdersCount = tickets.length;
  const pendingOrdersCount = tickets.filter(t => t.status !== 'COMPLETED' && t.status !== 'CANCELLED').length;
  const completedOrdersCount = tickets.filter(t => t.status === 'COMPLETED').length;
  
  const todayExpensesTotal = React.useMemo(() => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const monthlyExpensesTotal = todayExpensesTotal + 40150;
  const lowStockItemsCount = inventory.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock').length;

  return (
    <LaundryContext.Provider
      value={{
        role,
        setRole,
        adminTab,
        setAdminTab,
        ownerTab,
        setOwnerTab,
        currentUser,
        authUsers,
        addStaff,
        updateStaff,
        deleteStaff,
        login,
        logout,
        switchUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTargetRole,
        setAuthModalTargetRole,
        tickets,
        customers,
        services,
        expenses,
        expenseSubmissions,
        inventory,
        payments,
        toasts,
        customerSearchQuery,
        setCustomerSearchQuery,
        selectedCustomerTicket,
        setSelectedCustomerTicket,
        isCreateTicketOpen,
        setIsCreateTicketOpen,
        activeDetailTicket,
        setActiveDetailTicket,
        activeClaimStubTicket,
        setActiveClaimStubTicket,
        activeSettlementTicket,
        setActiveSettlementTicket,
        ticketStatusFilter,
        setTicketStatusFilter,
        addToast,
        removeToast,
        createTicket,
        updateTicketStatus,
        updateTicketPayment,
        addCustomer,
        addExpense,
        addMultipleExpenses,
        deleteExpense,
        sendExpenseReportToBoss,
        reviewExpenseReport,
        deleteExpenseReport,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        updateInventoryStock,
        restockInventoryItem,
        addService,
        updateService,
        toggleServiceActive,
        todayRevenue,
        monthlyRevenue,
        todayOrdersCount,
        pendingOrdersCount,
        completedOrdersCount,
        todayExpensesTotal,
        monthlyExpensesTotal,
        lowStockItemsCount
      }}
    >
      {children}
    </LaundryContext.Provider>
  );
};

export const useLaundry = () => {
  const context = useContext(LaundryContext);
  if (!context) {
    throw new Error('useLaundry must be used within a LaundryProvider');
  }
  return context;
};
