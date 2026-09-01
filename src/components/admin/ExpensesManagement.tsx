import React, { useState, useMemo } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { Expense } from '../../types';
import { 
  Receipt, 
  Plus, 
  Droplets, 
  Trash2, 
  X, 
  Calendar,
  Layers,
  Wrench,
  Home,
  Users,
  Package,
  TrendingDown,
  Zap,
  CheckCircle2,
  ChevronDown,
  Send,
  Clock,
  ShieldCheck,
  Check,
  Eye,
  EyeOff,
  Table
} from 'lucide-react';

const EXPENSE_CATEGORIES: {
  key: Expense['category'];
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
}[] = [
  { key: 'Detergent & Chemicals', label: 'Detergent & Chemicals', icon: Droplets, color: 'text-sky-600', bgColor: 'bg-sky-50', borderColor: 'border-sky-200' },
  { key: 'Electricity', label: 'Electricity (Power)', icon: Zap, color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
  { key: 'Water', label: 'Water Utility', icon: Droplets, color: 'text-cyan-600', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200' },
  { key: 'Packaging & Supplies', label: 'Packaging & Bags', icon: Package, color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  { key: 'Equipment Maintenance', label: 'Maintenance & Repairs', icon: Wrench, color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
  { key: 'Rent', label: 'Shop Rent & Lease', icon: Home, color: 'text-indigo-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' },
  { key: 'Staff Wages', label: 'Staff Wages & Payroll', icon: Users, color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
  { key: 'Other', label: 'Other Sundry Costs', icon: Layers, color: 'text-slate-600', bgColor: 'bg-slate-50', borderColor: 'border-slate-200' },
];

export const ExpensesManagement: React.FC = () => {
  const { 
    expenses, 
    expenseSubmissions,
    sendExpenseReportToBoss,
    addExpense, 
    deleteExpense,
    todayExpensesTotal, 
    monthlyExpensesTotal,
    currentUser
  } = useLaundry();

  // Modals & View State
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [isTableVisible, setIsTableVisible] = useState(false);

  // New Expense Form State
  const [category, setCategory] = useState<Expense['category']>('Detergent & Chemicals');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState('');
  const [pieces, setPieces] = useState<string>('1');
  const [date, setDate] = useState('2026-08-31');
  const [referenceNo, setReferenceNo] = useState('');
  const [recordedBy, setRecordedBy] = useState(currentUser?.name || 'Staff On Duty');

  // Formatted date label helpers
  const formatExpenseDateButtonLabel = (dateStr: string) => {
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
        return `Expense ${mName} ${day}`;
      }
    } catch {
      // fallback
    }
    return `Expense ${dateStr}`;
  };

  const formatFullDateLabel = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parts[0];
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        const fullMonths = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const mName = fullMonths[month - 1] || parts[1];
        return `${mName} ${day}, ${year}`;
      }
    } catch {
      // fallback
    }
    return dateStr;
  };

  // Group expenses by date (sorted newest first)
  const groupedExpensesByDate = useMemo(() => {
    const groups: Record<string, Expense[]> = {};
    expenses.forEach(exp => {
      const d = exp.date || '2026-08-31';
      if (!groups[d]) {
        groups[d] = [];
      }
      groups[d].push(exp);
    });

    const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

    return sortedDates.map(dateKey => {
      const items = groups[dateKey];
      const subtotalAmount = items.reduce((sum, item) => sum + item.amount, 0);
      const subtotalPieces = items.reduce((sum, item) => sum + (item.pieces !== undefined ? (Number(item.pieces) || 1) : 1), 0);
      return {
        date: dateKey,
        buttonLabel: formatExpenseDateButtonLabel(dateKey),
        fullDateLabel: formatFullDateLabel(dateKey),
        items,
        subtotalAmount,
        subtotalPieces,
        itemCount: items.length
      };
    });
  }, [expenses]);

  // Collapsible date state - default all dates collapsed so user must click to view
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

  // Calculations for Totals Table and Metric Cards
  const totalAllExpenses = useMemo(() => {
    return expenses.reduce((acc, exp) => acc + exp.amount, 0);
  }, [expenses]);

  const totalPieces = useMemo(() => {
    return expenses.reduce((acc, exp) => acc + (exp.pieces !== undefined ? (Number(exp.pieces) || 1) : 1), 0);
  }, [expenses]);

  const categoryTotals = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {};
    
    // Initialize all categories with 0
    EXPENSE_CATEGORIES.forEach(cat => {
      map[cat.key] = { count: 0, total: 0 };
    });

    expenses.forEach(exp => {
      if (!map[exp.category]) {
        map[exp.category] = { count: 0, total: 0 };
      }
      map[exp.category].count += 1;
      map[exp.category].total += exp.amount;
    });

    return Object.entries(map).map(([catKey, data]) => {
      const catConfig = EXPENSE_CATEGORIES.find(c => c.key === catKey) || {
        key: catKey as Expense['category'],
        label: catKey,
        icon: Layers,
        color: 'text-slate-600',
        bgColor: 'bg-slate-50',
        borderColor: 'border-slate-200'
      };
      const percentage = totalAllExpenses > 0 ? (data.total / totalAllExpenses) * 100 : 0;
      const average = data.count > 0 ? data.total / data.count : 0;

      return {
        key: catKey,
        config: catConfig,
        count: data.count,
        total: data.total,
        percentage,
        average
      };
    }).sort((a, b) => b.total - a.total); // Sort highest spent first
  }, [expenses, totalAllExpenses]);

  // Handlers
  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0 || !description.trim()) {
      return;
    }

    const parsedPieces = parseInt(pieces, 10);

    addExpense({
      category,
      amount: parsedAmount,
      description: description.trim(),
      pieces: isNaN(parsedPieces) || parsedPieces < 1 ? 1 : parsedPieces,
      date,
      recordedBy: recordedBy.trim() || currentUser?.name || 'Staff',
      referenceNo: referenceNo.trim() || undefined
    });

    // Reset Form
    setDescription('');
    setPieces('1');
    setAmount('');
    setReferenceNo('');
    setIsAddExpenseModalOpen(false);
    // Ensure tables remain collapsed when creating new expense until user explicitly clicks the date button
    setExpandedDates({});
  };

  const handleSendExpense = (targetDate?: string) => {
    const d = targetDate || expenses[0]?.date || date || '2026-09-01';
    sendExpenseReportToBoss(d);
    // Once sent, drop / collapse the table for that date
    setExpandedDates(prev => ({
      ...prev,
      [d]: false
    }));
  };

  const confirmDeleteExpense = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete.id);
      setExpenseToDelete(null);
    }
  };

  return (
    <div id="expenses-and-inventory-view" className="space-y-5">
      
      {/* 1. Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Shop Expense Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log and monitor operational costs, utility bills, inventory restocking, and store overheads
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            id="add-expense-btn"
            onClick={() => setIsAddExpenseModalOpen(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Plus size={15} />
            <span>Record New Expense</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Today's Expenses */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Today's Expenses</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              <TrendingDown size={14} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono">
            ₱{todayExpensesTotal.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 block">
            August 31, 2026 shift disbursements
          </span>
        </div>

        {/* Monthly Expenses */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">August 2026 Monthly</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
              <Calendar size={14} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            ₱{monthlyExpensesTotal.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 block">
            Includes rent, payroll, supplies & bills
          </span>
        </div>
      </div>

      {/* 3. DATE BUTTONS & SPREADSHEET EXPENSE TABLE */}
      <div className="space-y-3">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-2 px-1">
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
              Expense Records
            </h2>
            <span className="text-[11px] text-slate-400">
              Click a date button below to view or drop its table
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
            Total: ₱{totalAllExpenses.toLocaleString()}
          </span>
        </div>

        {/* Simple Date Buttons */}
        {groupedExpensesByDate.length > 0 ? (
          <div className="space-y-2.5">
            {groupedExpensesByDate.map((group) => {
              const isOpen = expandedDates[group.date] ?? false;

              return (
                <div 
                  key={group.date}
                  id={`expense-card-${group.date}`}
                  className="bg-white rounded-xl border border-slate-300 shadow-2xs overflow-hidden transition-all"
                >
                  {/* Simple Date Button - e.g. "Expense Sept 1", "Expense Aug 31" */}
                  <button
                    type="button"
                    id={`expense-btn-${group.date}`}
                    onClick={() => toggleDate(group.date)}
                    className={`w-full px-3.5 py-2.5 sm:py-3 flex items-center justify-between text-left transition-colors cursor-pointer select-none ${
                      isOpen ? 'bg-slate-100 border-b border-slate-300' : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        isOpen ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Calendar size={14} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                            {group.buttonLabel}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                            ({group.itemCount} items • {group.subtotalPieces} pcs)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      {/* Send Button */}
                      <button
                        type="button"
                        id={`send-btn-${group.date}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendExpense(group.date);
                        }}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95"
                        title="Send this table to the Boss UI and drop the table"
                      >
                        <Send size={12} />
                        <span>Send</span>
                      </button>

                      <div className="text-right pl-1">
                        <span className="font-mono font-extrabold text-xs sm:text-sm text-rose-700">
                          ₱{group.subtotalAmount.toLocaleString()}
                        </span>
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
                            <th className="w-[18%] py-2 px-1.5 sm:px-3 text-center border-r border-slate-300 font-semibold whitespace-nowrap">
                              Date
                            </th>
                            <th className="w-[44%] py-2 px-2 sm:px-3 border-r border-slate-300 font-semibold truncate">
                              Products / Description
                            </th>
                            <th className="w-[12%] py-2 px-1 text-center border-r border-slate-300 font-semibold whitespace-nowrap">
                              Pcs
                            </th>
                            <th className="w-[26%] py-2 px-2 sm:px-3 text-right font-semibold whitespace-nowrap">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {group.items.map((exp) => {
                            const pieceCount = exp.pieces !== undefined ? Number(exp.pieces) : 1;
                            return (
                              <tr 
                                key={exp.id} 
                                className="hover:bg-sky-50/60 transition-colors group"
                              >
                                {/* Date */}
                                <td className="py-2 px-1.5 sm:px-3 text-center font-mono text-slate-600 border-r border-slate-200 whitespace-nowrap text-[9px] sm:text-xs">
                                  <span className="hidden sm:inline">{exp.date}</span>
                                  <span className="sm:hidden">{exp.date.length >= 10 ? exp.date.substring(5) : exp.date}</span>
                                </td>

                                {/* Products / Description */}
                                <td className="py-2 px-2 sm:px-3 border-r border-slate-200 text-slate-900 overflow-hidden" title={exp.description || exp.category}>
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="font-medium text-slate-800 text-[10px] sm:text-xs truncate block leading-tight">
                                      {exp.description || exp.category}
                                    </span>
                                    {exp.referenceNo && (
                                      <span className="hidden md:inline-block text-[9px] font-mono text-slate-400 bg-slate-100 px-1 py-0.5 rounded">
                                        {exp.referenceNo}
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* Pieces */}
                                <td className="py-2 px-1 text-center font-mono font-bold text-slate-800 border-r border-slate-200 text-[9px] sm:text-xs whitespace-nowrap">
                                  {pieceCount}
                                </td>

                                {/* Amount */}
                                <td className="py-2 px-2 sm:px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap text-[9px] sm:text-xs">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <span>₱{exp.amount.toLocaleString()}</span>
                                    <button
                                      type="button"
                                      title="Delete record"
                                      onClick={() => setExpenseToDelete(exp)}
                                      className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-600 p-0.5 rounded transition-opacity cursor-pointer"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>

                        {/* Subtotal Footer */}
                        <tfoot>
                          <tr className="bg-slate-50 border-t-2 border-slate-300 font-bold text-slate-900">
                            <td className="py-2 px-1.5 sm:px-3 text-center border-r border-slate-300 uppercase tracking-wider text-[8px] sm:text-[10px] text-slate-600">
                              Subtotal
                            </td>
                            <td className="py-2 px-2 sm:px-3 border-r border-slate-300 text-slate-600 font-medium text-[9px] sm:text-[11px] truncate">
                              {group.itemCount} {group.itemCount === 1 ? 'item' : 'items'}
                            </td>
                            <td className="py-2 px-1 text-center font-mono font-extrabold text-indigo-700 border-r border-slate-300 text-[9px] sm:text-xs whitespace-nowrap">
                              {group.subtotalPieces}
                            </td>
                            <td className="py-2 px-2 sm:px-3 text-right font-mono font-extrabold text-rose-700 whitespace-nowrap text-[9px] sm:text-xs">
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
          <div className="bg-white rounded-xl border border-slate-300 p-8 text-center text-slate-400 text-xs">
            No expense records logged yet. Click "Record New Expense" above to add one.
          </div>
        )}
      </div>

      {/* 5. ADD EXPENSE MODAL */}
      {isAddExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <Receipt size={16} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Record Operational Expense</h3>
                  <p className="text-[11px] text-slate-500">Log cost disbursement to the store ledger</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddExpenseModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddExpenseSubmit} className="p-4 space-y-3.5 overflow-y-auto">
              
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Expense Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-semibold text-slate-800"
                >
                  {EXPENSE_CATEGORIES.map(cat => (
                    <option key={cat.key} value={cat.key}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Expense Description / Purpose <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ariel Powder drum restock, Meralco power bill, dryer repair"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                />
              </div>

              {/* Pieces and Amount Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Pieces */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pieces (Quantity) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="1"
                    value={pieces}
                    onChange={(e) => setPieces(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono font-bold text-slate-900"
                  />
                </div>

                {/* Amount (PHP) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Amount (₱) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-mono font-bold text-slate-400">₱</span>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date of Expense
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono font-medium"
                  />
                </div>

                {/* Reference Receipt No */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Receipt / Voucher #
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. OR-88192"
                    value={referenceNo}
                    onChange={(e) => setReferenceNo(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono font-medium"
                  />
                </div>
              </div>

              {/* Recorded By */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recorded By (Operator / Staff)
                </label>
                <input
                  type="text"
                  value={recordedBy}
                  onChange={(e) => setRecordedBy(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
                >
                  <CheckCircle2 size={14} />
                  <span>Save to Ledger</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 6. DELETE EXPENSE CONFIRMATION MODAL */}
      {expenseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center gap-2 text-rose-600">
              <Trash2 size={18} />
              <h3 className="font-extrabold text-sm text-slate-900">Delete Expense Record?</h3>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to remove <span className="font-bold text-slate-900">"{expenseToDelete.description}"</span> (₱{expenseToDelete.amount.toLocaleString()}) from the expense ledger? This action cannot be undone.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setExpenseToDelete(null)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Keep Record
              </button>
              <button
                type="button"
                onClick={confirmDeleteExpense}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-xs active:scale-95"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
