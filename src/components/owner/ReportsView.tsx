import React, { useState, useMemo } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { 
  Download, 
  Receipt, 
  DollarSign, 
  ChevronDown, 
  ChevronUp, 
  Calendar,
  Sparkles,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Banknote,
  Package,
  Layers,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { Expense } from '../../types';

interface DisplayRevenueItem {
  id: string;
  date: string;
  dateKey: string;
  ticketNumber: string;
  customerName: string;
  amount: number;
  paymentStatus: string;
  paymentMethod: string;
  notes?: string;
  isReceivable?: boolean;
}

export const ReportsView: React.FC = () => {
  const { 
    payments, 
    tickets, 
    expenses, 
    addToast,
    expenseSubmissions,
    revenueSubmissions,
    sendExpenseReportToBoss,
    sendRevenueReportToBoss
  } = useLaundry();

  // Admin choice between Total Revenue file or Expense file
  const [activeReportChoice, setActiveReportChoice] = useState<'REVENUE' | 'EXPENSES'>('REVENUE');

  // Expanded dates state for the interactive table dropdowns
  const [expandedRevenueDates, setExpandedRevenueDates] = useState<Record<string, boolean>>({});
  const [expandedExpenseDates, setExpandedExpenseDates] = useState<Record<string, boolean>>({});

  const toggleRevenueDate = (date: string) => {
    setExpandedRevenueDates(prev => ({ ...prev, [date]: !prev[date] }));
  };

  const toggleExpenseDate = (date: string) => {
    setExpandedExpenseDates(prev => ({ ...prev, [date]: !prev[date] }));
  };

  // Helper to extract YYYY-MM-DD reliably from any date string
  const extractDateKey = (dateStr: string): string => {
    if (!dateStr) return '2026-08-31';
    const match = dateStr.match(/\d{4}-\d{2}-\d{2}/);
    if (match) return match[0];
    
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

  // Helper date formatter: "Payment Aug 31" or "Expense Aug 31"
  const formatButtonLabel = (prefix: 'Payment' | 'Expense', dateStr: string) => {
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
        return `${prefix} ${mName} ${day}`;
      }
    } catch {
      // fallback
    }
    return `${prefix} ${dateStr}`;
  };

  // 1. Fully Unified Payment Records (All payments + completed ticket receivables)
  const allRevenueItems = useMemo<DisplayRevenueItem[]>(() => {
    const list: DisplayRevenueItem[] = [];

    // All recorded payments
    payments.forEach(p => {
      list.push({
        id: p.id,
        date: p.date,
        dateKey: extractDateKey(p.date),
        ticketNumber: p.ticketNumber,
        customerName: p.customerName || 'Walk-in Customer',
        amount: p.amount,
        paymentStatus: p.paymentStatus,
        paymentMethod: p.paymentMethod,
        notes: p.notes,
        isReceivable: false
      });
    });

    // Completed ticket receivables (unpaid balance settled on pickup)
    tickets.forEach(t => {
      if (t.status === 'COMPLETED') {
        const totalPaidForTicket = payments.filter(p => p.ticketId === t.id).reduce((s, p) => s + p.amount, 0);
        const unpaidBalance = Math.max(0, t.totalAmount - Math.max(t.amountPaid || 0, totalPaidForTicket));
        if (unpaidBalance > 0 && t.paymentStatus !== 'PAID') {
          if (totalPaidForTicket < t.totalAmount) {
            const d = t.completedAt || t.createdAt;
            list.push({
              id: `unpaid-${t.id}`,
              date: d,
              dateKey: extractDateKey(d),
              ticketNumber: t.ticketNumber,
              customerName: t.customerName || 'Walk-in Customer',
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

  // Group Revenue by Date (Sorted newest first)
  const groupedRevenue = useMemo(() => {
    const map = new Map<string, DisplayRevenueItem[]>();
    allRevenueItems.forEach(item => {
      if (!map.has(item.dateKey)) map.set(item.dateKey, []);
      map.get(item.dateKey)!.push(item);
    });

    return Array.from(map.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, items]) => {
        const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
        const cashAmount = items.filter(i => !i.isReceivable && i.paymentMethod === 'CASH').reduce((sum, i) => sum + i.amount, 0);
        const gcashAmount = items.filter(i => !i.isReceivable && i.paymentMethod === 'GCASH').reduce((sum, i) => sum + i.amount, 0);
        return {
          date,
          buttonLabel: formatButtonLabel('Payment', date),
          items,
          totalAmount,
          cashAmount,
          gcashAmount,
          count: items.length
        };
      });
  }, [allRevenueItems]);

  // 2. Fully Unified Expense Records (Grouped by normalized date, sorted newest first)
  const groupedExpenses = useMemo(() => {
    const map = new Map<string, Expense[]>();
    expenses.forEach(e => {
      const dateKey = extractDateKey(e.date);
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(e);
    });

    return Array.from(map.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, items]) => {
        const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
        const totalPieces = items.reduce((sum, item) => sum + (item.pieces !== undefined ? (Number(item.pieces) || 1) : 1), 0);
        return {
          date,
          buttonLabel: formatButtonLabel('Expense', date),
          items,
          totalAmount,
          totalPieces,
          count: items.length
        };
      });
  }, [expenses]);

  // Summary Metrics
  const totalRevenueAmount = useMemo(() => {
    return allRevenueItems.reduce((sum, item) => sum + item.amount, 0);
  }, [allRevenueItems]);

  const totalExpenseAmount = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  }, [expenses]);

  const netOperatingProfit = totalRevenueAmount - totalExpenseAmount;

  // CSV Downloader
  const downloadCSV = (type: 'REVENUE' | 'EXPENSES', date?: string) => {
    const csvRows: string[] = [];
    let filename = '';

    if (type === 'REVENUE') {
      const targetPayments = date 
        ? allRevenueItems.filter(p => p.dateKey === date) 
        : allRevenueItems;
      filename = date ? `Total_Revenue_${date}.csv` : `Total_Revenue_All.csv`;
      csvRows.push('Date,Ticket Number,Customer Name,Payment Method,Status,Amount (PHP),Notes');
      targetPayments.forEach(p => {
        const cleanCustomer = (p.customerName || '').replace(/,/g, ' ');
        const cleanNotes = (p.notes || '').replace(/,/g, ' ');
        csvRows.push(`${p.dateKey},"${p.ticketNumber}","${cleanCustomer}",${p.paymentMethod},${p.paymentStatus},${p.amount},"${cleanNotes}"`);
      });
      const subtotal = targetPayments.reduce((sum, p) => sum + p.amount, 0);
      csvRows.push('');
      csvRows.push(`TOTAL REVENUE,${subtotal}`);
    } else {
      const targetExpenses = date 
        ? expenses.filter(e => extractDateKey(e.date) === date) 
        : expenses;
      filename = date ? `Shop_Expenses_${date}.csv` : `Shop_Expenses_All.csv`;
      csvRows.push('Date,Category,Description,Amount (PHP),Pieces,Recorded By');
      targetExpenses.forEach(e => {
        const cleanDesc = (e.description || '').replace(/,/g, ' ');
        const pcs = e.pieces !== undefined ? e.pieces : 1;
        csvRows.push(`${extractDateKey(e.date)},"${e.category}","${cleanDesc}",${e.amount},${pcs},"${e.recordedBy || 'Staff'}"`);
      });
      const subtotal = targetExpenses.reduce((sum, e) => sum + e.amount, 0);
      csvRows.push('');
      csvRows.push(`TOTAL EXPENSES,${subtotal}`);
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addToast('Downloaded', `Saved ${filename}`, 'success');
  };

  return (
    <div id="reports-choice-view" className="space-y-4 max-w-5xl mx-auto">
      
      {/* 1. Header & Automatic Real-Time Sync Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Operational Reports</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Auto-Sync Live
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Everything logged in Payment Records and Expense Records automatically flows here in real-time.
          </p>
        </div>

        {/* Global Export All */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => downloadCSV(activeReportChoice)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
          >
            <Download size={13} className="text-slate-500" />
            <span>Export All {activeReportChoice === 'REVENUE' ? 'Revenue' : 'Expenses'} CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Live Financial Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <DollarSign size={14} className="text-emerald-600" />
              <span>Total Revenue</span>
            </span>
            <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
              {allRevenueItems.length} records
            </span>
          </div>
          <div className="mt-1.5 text-lg sm:text-xl font-extrabold font-mono text-emerald-700">
            ₱{totalRevenueAmount.toLocaleString()}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Receipt size={14} className="text-rose-600" />
              <span>Total Expenses</span>
            </span>
            <span className="text-[10px] text-rose-700 font-mono font-bold bg-rose-50 px-1.5 py-0.5 rounded">
              {expenses.length} records
            </span>
          </div>
          <div className="mt-1.5 text-lg sm:text-xl font-extrabold font-mono text-rose-700">
            ₱{totalExpenseAmount.toLocaleString()}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <TrendingUp size={14} className="text-indigo-600" />
              <span>Net Operating Balance</span>
            </span>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
              netOperatingProfit >= 0 ? 'bg-indigo-50 text-indigo-700' : 'bg-rose-50 text-rose-700'
            }`}>
              {netOperatingProfit >= 0 ? 'Surplus' : 'Deficit'}
            </span>
          </div>
          <div className={`mt-1.5 text-lg sm:text-xl font-extrabold font-mono ${
            netOperatingProfit >= 0 ? 'text-indigo-700' : 'text-rose-700'
          }`}>
            ₱{netOperatingProfit.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 3. CHOOSE FILE TYPE: TOTAL REVENUE FILE OR EXPENSE FILE */}
      <div className="bg-slate-200/80 p-1.5 rounded-2xl flex items-center gap-1.5 border border-slate-300/60 shadow-2xs">
        <button
          type="button"
          id="report-tab-revenue"
          onClick={() => setActiveReportChoice('REVENUE')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer select-none ${
            activeReportChoice === 'REVENUE'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <DollarSign size={16} className={activeReportChoice === 'REVENUE' ? 'text-emerald-600' : 'text-slate-400'} />
          <span>Total Revenue Files ({groupedRevenue.length})</span>
        </button>

        <button
          type="button"
          id="report-tab-expenses"
          onClick={() => setActiveReportChoice('EXPENSES')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer select-none ${
            activeReportChoice === 'EXPENSES'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Receipt size={16} className={activeReportChoice === 'EXPENSES' ? 'text-rose-600' : 'text-slate-400'} />
          <span>Expense Records Files ({groupedExpenses.length})</span>
        </button>
      </div>

      {/* 4. REPORT FILES LIST */}
      {activeReportChoice === 'REVENUE' ? (
        /* TOTAL REVENUE FILES */
        <div className="space-y-2.5">
          {groupedRevenue.length > 0 ? (
            groupedRevenue.map((group) => {
              const isOpen = expandedRevenueDates[group.date] ?? false;

              return (
                <div
                  key={group.date}
                  id={`revenue-report-card-${group.date}`}
                  className="bg-white rounded-xl border border-slate-300 shadow-2xs overflow-hidden transition-all"
                >
                  {/* Header Button */}
                  <button
                    type="button"
                    id={`revenue-btn-${group.date}`}
                    onClick={() => toggleRevenueDate(group.date)}
                    className={`w-full px-3.5 py-3 flex items-center justify-between text-left transition-colors cursor-pointer select-none ${
                      isOpen ? 'bg-slate-100 border-b border-slate-300' : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isOpen ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Calendar size={14} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                            {group.buttonLabel}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="font-mono font-extrabold text-xs sm:text-sm text-slate-900">
                          ₱{group.totalAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-slate-400">
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content Table */}
                  {isOpen && (
                    <div className="p-3.5 space-y-3 bg-white">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border border-slate-200">
                          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                            <tr>
                              <th className="p-2">Ticket #</th>
                              <th className="p-2">Customer</th>
                              <th className="p-2">Method</th>
                              <th className="p-2">Status</th>
                              <th className="p-2 text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {group.items.map(p => (
                              <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="p-2 font-mono font-bold text-slate-900">{p.ticketNumber}</td>
                                <td className="p-2 text-slate-800">{p.customerName}</td>
                                <td className="p-2">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    p.paymentMethod === 'CASH' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {p.paymentMethod}
                                  </span>
                                </td>
                                <td className="p-2">
                                  <span className={`font-bold text-[11px] ${
                                    p.paymentStatus === 'PAID' ? 'text-emerald-700' : 'text-amber-700'
                                  }`}>
                                    {p.paymentStatus}
                                  </span>
                                </td>
                                <td className="p-2 text-right font-mono font-bold text-slate-900">
                                  ₱{p.amount.toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-slate-50 border-t-2 border-slate-300 font-bold text-slate-900">
                            <tr>
                              <td className="p-2 uppercase text-[10px] text-slate-600" colSpan={2}>
                                Subtotal
                              </td>
                              <td className="p-2 text-slate-600 text-[10px]" colSpan={2}>
                                Cash: ₱{group.cashAmount.toLocaleString()} • GCash: ₱{group.gcashAmount.toLocaleString()}
                              </td>
                              <td className="p-2 text-right font-mono text-emerald-700">
                                ₱{group.totalAmount.toLocaleString()}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      {/* Actions for this specific date */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                          {/* Replaced synced note with an empty div for spacing or you could remove it, but flex-between needs left side if we want buttons on right. We'll leave it empty. */}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => downloadCSV('REVENUE', group.date)}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Download size={13} />
                            <span>Download CSV</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-xl border border-slate-300 p-8 text-center text-slate-400 text-xs">
              No revenue or payment records found. As soon as payments are logged in counter POS, they will automatically appear here.
            </div>
          )}
        </div>
      ) : (
        /* EXPENSE RECORDS FILES */
        <div className="space-y-2.5">
          {groupedExpenses.length > 0 ? (
            groupedExpenses.map((group) => {
              const isOpen = expandedExpenseDates[group.date] ?? false;

              return (
                <div
                  key={group.date}
                  id={`expense-report-card-${group.date}`}
                  className="bg-white rounded-xl border border-slate-300 shadow-2xs overflow-hidden transition-all"
                >
                  {/* Header Button */}
                  <button
                    type="button"
                    id={`expense-btn-${group.date}`}
                    onClick={() => toggleExpenseDate(group.date)}
                    className={`w-full px-3.5 py-3 flex items-center justify-between text-left transition-colors cursor-pointer select-none ${
                      isOpen ? 'bg-slate-100 border-b border-slate-300' : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isOpen ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Calendar size={14} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                            {group.buttonLabel}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="font-mono font-extrabold text-xs sm:text-sm text-rose-700">
                          ₱{group.totalAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-slate-400">
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content Table */}
                  {isOpen && (
                    <div className="p-3.5 space-y-3 bg-white">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border border-slate-200">
                          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                            <tr>
                              <th className="p-2">Date</th>
                              <th className="p-2">Category</th>
                              <th className="p-2">Description</th>
                              <th className="p-2 text-center">Pcs</th>
                              <th className="p-2">Recorded By</th>
                              <th className="p-2 text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {group.items.map(e => (
                              <tr key={e.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="p-2 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                                  {extractDateKey(e.date)}
                                </td>
                                <td className="p-2 font-semibold text-slate-900">{e.category}</td>
                                <td className="p-2 text-slate-800">{e.description}</td>
                                <td className="p-2 text-center font-mono font-bold text-slate-800">
                                  {e.pieces !== undefined ? e.pieces : 1}
                                </td>
                                <td className="p-2 text-slate-500 text-[11px]">{e.recordedBy || 'Staff'}</td>
                                <td className="p-2 text-right font-mono font-bold text-rose-600">
                                  ₱{e.amount.toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-slate-50 border-t-2 border-slate-300 font-bold text-slate-900">
                            <tr>
                              <td className="p-2 uppercase text-[10px] text-slate-600" colSpan={3}>
                                Subtotal
                              </td>
                              <td className="p-2 text-center font-mono text-indigo-700">
                                {group.totalPieces} pcs
                              </td>
                              <td className="p-2"></td>
                              <td className="p-2 text-right font-mono text-rose-700">
                                ₱{group.totalAmount.toLocaleString()}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      {/* Actions for this specific date */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                          {/* Replaced synced note with empty div */}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => downloadCSV('EXPENSES', group.date)}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Download size={13} />
                            <span>Download CSV</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-xl border border-slate-300 p-8 text-center text-slate-400 text-xs">
              No expense records found. As soon as expenses are entered in Expense Records, they will automatically appear here.
            </div>
          )}
        </div>
      )}

    </div>
  );
};
