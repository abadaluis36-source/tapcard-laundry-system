import React, { useState, useMemo } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { 
  Send, 
  Download, 
  Receipt, 
  DollarSign, 
  ChevronDown, 
  ChevronUp, 
  Calendar
} from 'lucide-react';
import { PaymentTransaction, Expense } from '../../types';

export const ReportsView: React.FC = () => {
  const { currentUser, payments, expenses, addToast } = useLaundry();

  // Admin choice between Total Revenue file or Expense file
  const [activeReportChoice, setActiveReportChoice] = useState<'REVENUE' | 'EXPENSES'>('REVENUE');

  // Expanded dates state for the interactive table dropdowns
  const [expandedRevenueDates, setExpandedRevenueDates] = useState<Record<string, boolean>>({
    '2026-08-31': true
  });
  const [expandedExpenseDates, setExpandedExpenseDates] = useState<Record<string, boolean>>({
    '2026-08-31': true
  });

  const toggleRevenueDate = (date: string) => {
    setExpandedRevenueDates(prev => ({ ...prev, [date]: !prev[date] }));
  };

  const toggleExpenseDate = (date: string) => {
    setExpandedExpenseDates(prev => ({ ...prev, [date]: !prev[date] }));
  };

  // Helper date formatter: "Payment Aug 31" or "Expense Aug 31"
  const formatButtonLabel = (prefix: 'Payment' | 'Expense', dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        const mName = monthNames[month - 1] || parts[1];
        return `${prefix} ${mName} ${day}`;
      }
    } catch {
      // fallback
    }
    return `${prefix} ${dateStr}`;
  };

  // 1. Grouped Payments (Total Revenue) by Date
  const groupedRevenue = useMemo(() => {
    const map = new Map<string, PaymentTransaction[]>();
    payments.forEach(p => {
      const dateKey = p.date ? p.date.substring(0, 10) : '2026-08-31';
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(p);
    });

    return Array.from(map.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, items]) => {
        const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
        const cashAmount = items.filter(i => i.paymentMethod === 'CASH').reduce((sum, i) => sum + i.amount, 0);
        const gcashAmount = items.filter(i => i.paymentMethod === 'GCASH').reduce((sum, i) => sum + i.amount, 0);
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
  }, [payments]);

  // 2. Grouped Expenses by Date
  const groupedExpenses = useMemo(() => {
    const map = new Map<string, Expense[]>();
    expenses.forEach(e => {
      const dateKey = e.date ? e.date.substring(0, 10) : '2026-08-31';
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(e);
    });

    return Array.from(map.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, items]) => {
        const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
        const totalPieces = items.reduce((sum, item) => sum + (item.pieces !== undefined ? Number(item.pieces) || 1 : 1), 0);
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

  // CSV Downloader
  const downloadCSV = (type: 'REVENUE' | 'EXPENSES', date?: string) => {
    const csvRows: string[] = [];
    let filename = '';

    if (type === 'REVENUE') {
      const targetPayments = date ? payments.filter(p => p.date === date) : payments;
      filename = date ? `Total_Revenue_${date}.csv` : `Total_Revenue_All.csv`;
      csvRows.push('Date,Ticket Number,Customer Name,Payment Method,Status,Amount (PHP)');
      targetPayments.forEach(p => {
        const cleanCustomer = (p.customerName || '').replace(/,/g, ' ');
        csvRows.push(`${p.date},"${p.ticketNumber}","${cleanCustomer}",${p.paymentMethod},${p.paymentStatus},${p.amount}`);
      });
      const subtotal = targetPayments.reduce((sum, p) => sum + p.amount, 0);
      csvRows.push('');
      csvRows.push(`TOTAL REVENUE,${subtotal}`);
    } else {
      const targetExpenses = date ? expenses.filter(e => e.date === date) : expenses;
      filename = date ? `Shop_Expenses_${date}.csv` : `Shop_Expenses_All.csv`;
      csvRows.push('Date,Category,Description,Amount (PHP),Pieces,Recorded By');
      targetExpenses.forEach(e => {
        const cleanDesc = (e.description || '').replace(/,/g, ' ');
        const pcs = e.pieces !== undefined ? e.pieces : 1;
        csvRows.push(`${e.date},"${e.category}","${cleanDesc}",${e.amount},${pcs},"${e.recordedBy || ''}"`);
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

  // Send to Boss Handler
  const handleSendDateToBoss = (type: 'TOTAL_REVENUE' | 'EXPENSES', date: string, amount: number) => {
    const typeLabel = type === 'TOTAL_REVENUE' ? 'Total Revenue File' : 'Expense File';
    addToast(
      'Sent to Boss Dennis',
      `Transmitted ${typeLabel} for ${date} (₱${amount.toLocaleString()}) to Boss Dennis.`,
      'success'
    );
  };

  return (
    <div id="reports-choice-view" className="space-y-4 max-w-5xl mx-auto">
      
      {/* 1. Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Operational Reports
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Select either the Total Revenue file or Expense file to review and send to Boss Dennis
        </p>
      </div>

      {/* 2. CHOOSE FILE TYPE: TOTAL REVENUE FILE OR EXPENSE FILE */}
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
          <span>Total Revenue Files</span>
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
          <span>Expense Records Files</span>
        </button>
      </div>

      {/* 3. REPORT FILES LIST */}
      {activeReportChoice === 'REVENUE' ? (
        /* TOTAL REVENUE FILES */
        <div className="space-y-2.5">
          {groupedRevenue.map((group) => {
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
                    <div>
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                        {group.buttonLabel}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono ml-2">
                        ({group.count} transactions)
                      </span>
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
                        <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
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
                            <tr key={p.id} className="hover:bg-slate-50/80">
                              <td className="p-2 font-mono font-bold text-slate-900">{p.ticketNumber}</td>
                              <td className="p-2">{p.customerName || 'Walk-in Customer'}</td>
                              <td className="p-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  p.paymentMethod === 'CASH' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {p.paymentMethod}
                                </span>
                              </td>
                              <td className="p-2">
                                <span className="text-emerald-700 font-bold text-[11px]">{p.paymentStatus}</span>
                              </td>
                              <td className="p-2 text-right font-mono font-bold text-slate-900">
                                ₱{p.amount.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Actions for this specific date */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                        <span>Cash: ₱{group.cashAmount.toLocaleString()}</span>
                        <span>GCash: ₱{group.gcashAmount.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => downloadCSV('REVENUE', group.date)}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Download size={13} />
                          <span>Download CSV</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSendDateToBoss('TOTAL_REVENUE', group.date, group.totalAmount)}
                          className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Send size={13} />
                          <span>Send Total Revenue File to Boss</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* EXPENSE RECORDS FILES */
        <div className="space-y-2.5">
          {groupedExpenses.map((group) => {
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
                    <div>
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                        {group.buttonLabel}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono ml-2">
                        ({group.count} items • {group.totalPieces} pcs)
                      </span>
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
                        <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                          <tr>
                            <th className="p-2">Category</th>
                            <th className="p-2">Description</th>
                            <th className="p-2">Qty / Pcs</th>
                            <th className="p-2">Recorded By</th>
                            <th className="p-2 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {group.items.map(e => (
                            <tr key={e.id} className="hover:bg-slate-50/80">
                              <td className="p-2 font-bold text-slate-900">{e.category}</td>
                              <td className="p-2">{e.description}</td>
                              <td className="p-2 font-mono">{e.pieces !== undefined ? e.pieces : 1}</td>
                              <td className="p-2 text-slate-500">{e.recordedBy || 'Staff'}</td>
                              <td className="p-2 text-right font-mono font-bold text-rose-600">
                                ₱{e.amount.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Actions for this specific date */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <div className="text-xs text-slate-500 font-mono">
                        Logged: {group.items.length} items ({group.totalPieces} pcs)
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => downloadCSV('EXPENSES', group.date)}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Download size={13} />
                          <span>Download CSV</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSendDateToBoss('EXPENSES', group.date, group.totalAmount)}
                          className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Send size={13} />
                          <span>Send Expenses File to Boss</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
