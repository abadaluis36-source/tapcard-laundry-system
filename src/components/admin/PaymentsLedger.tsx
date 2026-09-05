import React, { useState, useMemo, useEffect } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { PaymentBadge } from '../common/StatusBadge';
import { PaymentTransaction, Ticket } from '../../types';
import { 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  ChevronDown,
  Search,
  CreditCard,
  Layers,
  ArrowUpDown,
  Filter,
  Banknote,
  Smartphone,
  Wallet
} from 'lucide-react';

interface DisplayLedgerItem {
  id: string;
  date: string;
  ticketId: string;
  ticketNumber: string;
  customerName: string;
  amount: number;
  paymentStatus: 'PAID' | 'UNPAID' | 'PARTIAL';
  paymentMethod: string;
  notes?: string;
  isReceivable?: boolean;
}

export const PaymentsLedger: React.FC = () => {
  const { payments, tickets, setActiveDetailTicket } = useLaundry();

  const [paymentFilter, setPaymentFilter] = useState<'ALL' | 'PAID' | 'UNPAID' | 'PARTIAL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});

  const toggleDate = (dateKey: string) => {
    setExpandedDates(prev => {
      const current = prev[dateKey] ?? false;
      return {
        ...prev,
        [dateKey]: !current
      };
    });
  };

  // Helper to extract YYYY-MM-DD reliably from any date string
  const extractDateKey = (dateStr: string) => {
    if (!dateStr) return '2026-08-31';
    const match = dateStr.match(/\d{4}-\d{2}-\d{2}/);
    if (match) return match[0];
    
    // Check if month name like "Aug 31, 2026"
    try {
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        const y = parsed.getFullYear();
        const m = String(parsed.getMonth() + 1).padStart(2, '0');
        const d = String(parsed.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      }
    } catch {
      // fallback
    }

    return dateStr.trim().substring(0, 10);
  };

  // Helper to extract hour and minute from date string
  const extractHourAndMinute = (dateStr: string): { hour: number; minute: number } | null => {
    if (!dateStr) return null;
    const timeMatch = dateStr.match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?/i);
    if (timeMatch) {
      let hour = parseInt(timeMatch[1], 10);
      const minute = parseInt(timeMatch[2], 10);
      const ampm = timeMatch[3] ? timeMatch[3].toUpperCase() : null;
      if (ampm === 'PM' && hour < 12) hour += 12;
      if (ampm === 'AM' && hour === 12) hour = 0;
      return { hour, minute };
    }
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      return { hour: parsed.getHours(), minute: parsed.getMinutes() };
    }
    return null;
  };

  // Check if transaction was recorded during daily operational shift (7:00 AM to 10:00 PM)
  const isWithin7AmTo10Pm = (dateStr: string): boolean => {
    const time = extractHourAndMinute(dateStr);
    if (!time) return true; // default to true if timestamp has no explicit time
    const totalMinutes = time.hour * 60 + time.minute;
    return totalMinutes >= 7 * 60 && totalMinutes <= 22 * 60;
  };

  // Helper to format button label e.g. "Payment Aug 31"
  const formatPaymentDateButtonLabel = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        const monthNames = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
        ];
        const mName = monthNames[month - 1] || parts[1];
        return `Payment ${mName} ${day}`;
      }
    } catch {
      // fallback
    }
    return `Payment ${dateStr}`;
  };

  // Calculate live financial summary dynamically from all real tickets and payment records
  const summary = useMemo(() => {
    let paidTotal = 0;
    let outstandingTotal = 0;
    let totalSales = 0;

    // Tickets summary: in-progress orders only count paid amounts;
    // completed orders count toward total sales and outstanding receivables if unpaid.
    tickets.forEach(t => {
      paidTotal += (t.amountPaid || 0);
      if (t.status === 'COMPLETED') {
        totalSales += (t.totalAmount || 0);
        if (t.totalAmount > (t.amountPaid || 0)) {
          outstandingTotal += (t.totalAmount - (t.amountPaid || 0));
        }
      } else {
        totalSales += (t.amountPaid || 0);
      }
    });

    return {
      totalSales,
      paidTotal,
      outstandingTotal
    };
  }, [tickets]);

  // Combine payments and completed unpaid ticket receivables
  const allLedgerItems = useMemo<DisplayLedgerItem[]>(() => {
    const list: DisplayLedgerItem[] = [];

    // 1. Add all actual payments
    payments.forEach(p => {
      list.push({
        id: p.id,
        date: p.date,
        ticketId: p.ticketId,
        ticketNumber: p.ticketNumber,
        customerName: p.customerName,
        amount: p.amount,
        paymentStatus: p.paymentStatus,
        paymentMethod: p.paymentMethod,
        notes: p.notes,
        isReceivable: false
      });
    });

    // 2. Unpaid tickets will NOT go to payments automatically — they ONLY go when the order is COMPLETED!
    tickets.forEach(t => {
      if (t.status === 'COMPLETED') {
        const unpaidBalance = t.totalAmount - (t.amountPaid || 0);
        if (t.paymentStatus === 'UNPAID' || (t.paymentStatus === 'PARTIAL' && unpaidBalance > 0)) {
          // Check if there is already a full payment recorded for this ticket
          const hasFullPayment = payments.some(p => p.ticketId === t.id && p.amount >= t.totalAmount);
          if (!hasFullPayment) {
            list.push({
              id: `unpaid-${t.id}`,
              date: t.completedAt || t.createdAt,
              ticketId: t.id,
              ticketNumber: t.ticketNumber,
              customerName: t.customerName,
              amount: unpaidBalance,
              paymentStatus: t.paymentStatus,
              paymentMethod: t.paymentMethod || 'CASH',
              notes: `Completed order balance (${t.paymentStatus.toLowerCase()} upon pickup)`,
              isReceivable: true
            });
          }
        }
      }
    });

    return list;
  }, [payments, tickets]);

  // Filter items based on user selection & search
  const filteredLedgerItems = useMemo(() => {
    return allLedgerItems.filter(item => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        item.ticketNumber.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        item.paymentMethod.toLowerCase().includes(q) ||
        (item.notes && item.notes.toLowerCase().includes(q));

      const matchesPayment = 
        paymentFilter === 'ALL' || 
        item.paymentStatus === paymentFilter;

      return matchesSearch && matchesPayment;
    });
  }, [allLedgerItems, paymentFilter, searchQuery]);

  // Group filtered items by date (sorted newest first)
  const groupedPaymentsByDate = useMemo(() => {
    const groups: Record<string, DisplayLedgerItem[]> = {};
    
    filteredLedgerItems.forEach(p => {
      const d = extractDateKey(p.date);
      if (!groups[d]) {
        groups[d] = [];
      }
      groups[d].push(p);
    });

    const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

    return sortedDates.map(dateKey => {
      const items = groups[dateKey];
      const subtotalAmount = items.reduce((sum, item) => sum + item.amount, 0);
      const paidCount = items.filter(i => i.paymentStatus === 'PAID').length;
      const unpaidCount = items.filter(i => i.paymentStatus === 'UNPAID' || i.paymentStatus === 'PARTIAL').length;

      return {
        date: dateKey,
        buttonLabel: formatPaymentDateButtonLabel(dateKey),
        items,
        subtotalAmount,
        paidCount,
        unpaidCount,
        itemCount: items.length
      };
    });
  }, [filteredLedgerItems]);

  // Real-time clock state to support automatic reset after 11:00 PM
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const currentHour = currentTime.getHours();
  // Automatic reset after 11:00 PM (23:00) until 6:59 AM next morning
  const isResetToZero = currentHour >= 23 || currentHour < 7;

  // Determine current active operating date:
  // Use today's date if transactions exist for today, else fallback to latest date in ledger
  const todayKey = extractDateKey(currentTime.toISOString());
  const hasTodayTransactions = allLedgerItems.some(item => extractDateKey(item.date) === todayKey);
  const activeDailyDateKey = hasTodayTransactions 
    ? todayKey 
    : (groupedPaymentsByDate[0]?.date || todayKey);

  // Filter transactions belonging to the active day within 7:00 AM – 10:00 PM (actual collections only)
  const dailyShiftTransactions = useMemo(() => {
    return allLedgerItems.filter(item => {
      // Exclude unpaid balances from collected cash metrics
      if (item.isReceivable && item.paymentStatus === 'UNPAID') return false;
      const itemDateKey = extractDateKey(item.date);
      if (itemDateKey !== activeDailyDateKey) return false;
      return isWithin7AmTo10Pm(item.date);
    });
  }, [allLedgerItems, activeDailyDateKey]);

  // Daily KPI Metrics (7 AM to 10 PM, auto reset to 0 after 11 PM)
  const dailyTotalCollections = useMemo(() => {
    if (isResetToZero) return 0;
    return dailyShiftTransactions.reduce((acc, p) => acc + p.amount, 0);
  }, [isResetToZero, dailyShiftTransactions]);

  const dailyCashOnHand = useMemo(() => {
    if (isResetToZero) return 0;
    return dailyShiftTransactions
      .filter(p => p.paymentMethod === 'CASH')
      .reduce((acc, p) => acc + p.amount, 0);
  }, [isResetToZero, dailyShiftTransactions]);

  const dailyGCashRevenue = useMemo(() => {
    if (isResetToZero) return 0;
    return dailyShiftTransactions
      .filter(p => p.paymentMethod === 'GCASH')
      .reduce((acc, p) => acc + p.amount, 0);
  }, [isResetToZero, dailyShiftTransactions]);

  const totalOtherDigital = useMemo(() => {
    if (isResetToZero) return 0;
    return dailyShiftTransactions
      .filter(p => p.paymentMethod !== 'CASH' && p.paymentMethod !== 'GCASH')
      .reduce((acc, p) => acc + p.amount, 0);
  }, [isResetToZero, dailyShiftTransactions]);

  return (
    <div id="payments-ledger-view" className="space-y-4">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Total Revenue
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Daily payment and transaction records
        </p>
      </div>

      {/* KPI METRIC CARDS */}
      <div id="payments-kpi-summary" className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Total Collections */}
        <div id="kpi-total-collections" className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Collections
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Wallet size={15} />
            </div>
          </div>
          <div className="mt-1">
            <span className={`text-xl sm:text-2xl font-black font-mono ${isResetToZero ? 'text-slate-400' : 'text-slate-900'}`}>
              ₱{dailyTotalCollections.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Total Cash On-Hand */}
        <div id="kpi-cash-onhand" className="bg-white border border-emerald-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              Cash On-Hand
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Banknote size={15} />
            </div>
          </div>
          <div className="mt-1">
            <span className={`text-xl sm:text-2xl font-black font-mono ${isResetToZero ? 'text-slate-400' : 'text-emerald-700'}`}>
              ₱{dailyCashOnHand.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Total GCash Revenue */}
        <div id="kpi-gcash-revenue" className="bg-white border border-blue-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">
              GCash Revenue
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Smartphone size={15} />
            </div>
          </div>
          <div className="mt-1">
            <span className={`text-xl sm:text-2xl font-black font-mono ${isResetToZero ? 'text-slate-400' : 'text-blue-700'}`}>
              ₱{dailyGCashRevenue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* DATE BUTTONS & SPREADSHEET PAYMENT TABLES */}
      <div className="space-y-3">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-2 px-1">
          <h2 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
            {paymentFilter === 'ALL' ? 'Daily Payment Records' : `${paymentFilter} Records`}
          </h2>
        </div>

        {/* Clickable Date Buttons */}
        {groupedPaymentsByDate.length > 0 ? (
          <div className="space-y-2.5">
            {groupedPaymentsByDate.map((group) => {
              const isOpen = expandedDates[group.date] ?? false;

              return (
                <div 
                  key={group.date}
                  id={`payment-card-${group.date}`}
                  className="bg-white rounded-xl border border-slate-300 shadow-2xs overflow-hidden transition-all"
                >
                  {/* Clickable Date Button - e.g. "Payment Aug 31", "Payment Aug 30" */}
                  <button
                    type="button"
                    id={`payment-btn-${group.date}`}
                    onClick={() => toggleDate(group.date)}
                    className={`w-full px-3.5 py-2.5 sm:py-3 flex items-center justify-between text-left transition-colors cursor-pointer select-none ${
                      isOpen ? 'bg-slate-100 border-b border-slate-300' : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        isOpen ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        <Calendar size={15} />
                      </div>
                      <div className="min-w-0">
                        <span className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                          {group.buttonLabel}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      <div className="text-right pl-1">
                        <span className="font-mono font-extrabold text-xs sm:text-base text-emerald-700">
                          ₱{group.subtotalAmount.toLocaleString()}
                        </span>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {isOpen ? 'Click to collapse' : 'Click to show table'}
                        </div>
                      </div>

                      <div className={`p-1.5 rounded-lg text-slate-400 transition-transform ${isOpen ? 'bg-slate-200 text-slate-800 rotate-180' : 'bg-slate-100 text-slate-600'}`}>
                        <ChevronDown size={14} />
                      </div>
                    </div>
                  </button>

                  {/* Opened Excel-Style Spreadsheet Table for this Date */}
                  {isOpen && (
                    <div className="w-full overflow-x-auto">
                      <table className="w-full table-fixed text-left border-collapse text-[10px] sm:text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-300 text-slate-700 font-semibold select-none">
                            <th className="w-[20%] py-2 px-1.5 sm:px-3 text-center border-r border-slate-300 font-semibold whitespace-nowrap">
                              Time / Date
                            </th>
                            <th className="w-[15%] py-2 px-2 sm:px-3 text-center border-r border-slate-300 font-semibold whitespace-nowrap">
                              Ticket
                            </th>
                            <th className="w-[33%] py-2 px-2 sm:px-3 border-r border-slate-300 font-semibold truncate">
                              Customer
                            </th>
                            <th className="w-[14%] py-2 px-1 text-center border-r border-slate-300 font-semibold whitespace-nowrap">
                              Method
                            </th>
                            <th className="w-[18%] py-2 px-2 sm:px-3 text-right font-semibold whitespace-nowrap">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {group.items.map((p) => {
                            const relatedTicket = tickets.find(t => t.id === p.ticketId || t.ticketNumber === p.ticketNumber);
                            const timeStr = p.date.includes(' ') ? p.date.split(' ').slice(1).join(' ') : p.date;

                            return (
                              <tr 
                                key={p.id} 
                                className={`transition-colors group ${
                                  p.paymentStatus === 'UNPAID' ? 'bg-rose-50/30 hover:bg-rose-50/70' : 'hover:bg-sky-50/60'
                                }`}
                              >
                                {/* Date & Time */}
                                <td className="py-2 px-1.5 sm:px-3 text-center font-mono text-slate-600 border-r border-slate-200 whitespace-nowrap text-[9px] sm:text-xs">
                                  <span className="hidden sm:inline">{p.date}</span>
                                  <span className="sm:hidden">{timeStr || p.date}</span>
                                </td>

                                {/* Ticket Number */}
                                <td className="py-2 px-2 sm:px-3 text-center border-r border-slate-200">
                                  {relatedTicket ? (
                                    <button
                                      type="button"
                                      onClick={() => setActiveDetailTicket(relatedTicket)}
                                      className="font-mono font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded border border-slate-300 text-[10px] sm:text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                                      title="Click to view ticket and manage settlement"
                                    >
                                      <span>{p.ticketNumber}</span>
                                    </button>
                                  ) : (
                                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[10px] sm:text-xs">
                                      {p.ticketNumber}
                                    </span>
                                  )}
                                </td>

                                {/* Customer & Details */}
                                <td className="py-2 px-2 sm:px-3 border-r border-slate-200 text-slate-900 overflow-hidden" title={p.customerName}>
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="font-bold text-slate-800 text-[10px] sm:text-xs truncate block leading-tight">
                                      {p.customerName}
                                    </span>
                                    {p.notes && (
                                      <span className="hidden md:inline-block text-[9px] font-mono px-1 py-0.5 rounded border truncate max-w-[140px] bg-slate-50 text-slate-500 border-slate-200" title={p.notes}>
                                        {p.notes}
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* Method */}
                                <td className="py-2 px-1 text-center font-mono font-bold text-slate-800 border-r border-slate-200 text-[9px] sm:text-xs whitespace-nowrap">
                                  <div className="flex items-center justify-center">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      p.paymentMethod === 'GCASH' 
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                                        : p.paymentMethod === 'MAYA'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                                    }`}>
                                      {p.paymentMethod}
                                    </span>
                                  </div>
                                </td>

                                {/* Amount */}
                                <td className="py-2 px-2 sm:px-3 text-right font-mono font-bold whitespace-nowrap text-[9px] sm:text-xs">
                                  <span className="text-emerald-700 font-extrabold">
                                    ₱{p.amount.toLocaleString()}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>

                        {/* Subtotal Footer */}
                        <tfoot>
                          <tr className="bg-slate-50 border-t-2 border-slate-300 font-bold text-slate-900">
                            <td colSpan={4} className="py-2.5 px-3 text-right border-r border-slate-300 font-extrabold uppercase tracking-wider text-[10px] sm:text-xs text-slate-700">
                              Subtotal
                            </td>
                            <td className="py-2.5 px-2 sm:px-3 text-right font-mono font-extrabold text-emerald-700 whitespace-nowrap text-[10px] sm:text-xs">
                              ₱{group.subtotalAmount.toLocaleString()}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 space-y-2">
            <p className="font-bold text-xs text-slate-700">
              {allLedgerItems.length === 0 ? 'No payment transactions recorded yet' : `No payment records found for "${paymentFilter}"`}
            </p>
            <p className="text-[11px] text-slate-400">
              {allLedgerItems.length === 0 
                ? 'Payments recorded during ticket creation or customer claim settlement will appear here.' 
                : 'Try resetting the filter to All Records or adjusting your search.'}
            </p>
            {allLedgerItems.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setPaymentFilter('ALL');
                  setSearchQuery('');
                }}
                className="px-3 py-1.5 text-xs font-bold bg-slate-900 text-white rounded-lg cursor-pointer mt-2"
              >
                Reset to All Records
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
