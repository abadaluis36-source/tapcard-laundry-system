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
  CheckCircle2
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
    addExpense, 
    deleteExpense,
    todayExpensesTotal, 
    monthlyExpensesTotal,
    currentUser
  } = useLaundry();

  // Modals
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  // New Expense Form State
  const [category, setCategory] = useState<Expense['category']>('Detergent & Chemicals');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState('');
  const [pieces, setPieces] = useState<string>('1');
  const [date, setDate] = useState('2026-08-31');
  const [referenceNo, setReferenceNo] = useState('');
  const [recordedBy, setRecordedBy] = useState(currentUser?.name || 'Staff On Duty');

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

      {/* 3. EXCEL-STYLE SPREADSHEET EXPENSE TABLE */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-2xs overflow-hidden">
        {/* Table Container */}
        <div className="w-full">
          <table className="w-full table-fixed text-left border-collapse text-[10px] sm:text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-semibold select-none">
                <th className="w-[20%] py-1.5 px-1 sm:px-2 text-center border-r border-slate-300 font-semibold whitespace-nowrap">
                  Date
                </th>
                <th className="w-[44%] py-1.5 px-1.5 sm:px-2.5 border-r border-slate-300 font-semibold truncate">
                  Products
                </th>
                <th className="w-[12%] py-1.5 px-0.5 sm:px-1 text-center border-r border-slate-300 font-semibold whitespace-nowrap">
                  Pcs
                </th>
                <th className="w-[24%] py-1.5 px-1 sm:px-2 text-right font-semibold whitespace-nowrap">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {expenses.length > 0 ? (
                expenses.map((exp) => {
                  const pieceCount = exp.pieces !== undefined ? Number(exp.pieces) : 1;
                  return (
                    <tr 
                      key={exp.id} 
                      className="hover:bg-sky-50/60 transition-colors"
                    >
                      {/* Date */}
                      <td className="py-1.5 px-1 sm:px-2 text-center font-mono text-slate-600 border-r border-slate-200 whitespace-nowrap text-[9px] sm:text-xs">
                        <span className="hidden sm:inline">{exp.date}</span>
                        <span className="sm:hidden">{exp.date.length >= 10 ? exp.date.substring(5) : exp.date}</span>
                      </td>

                      {/* Products */}
                      <td className="py-1.5 px-1.5 sm:px-2.5 border-r border-slate-200 text-slate-900 overflow-hidden" title={exp.description || exp.category}>
                        <span className="font-medium text-slate-800 text-[10px] sm:text-xs truncate block leading-tight">
                          {exp.description || exp.category}
                        </span>
                      </td>

                      {/* Pieces */}
                      <td className="py-1.5 px-0.5 sm:px-1 text-center font-mono font-bold text-slate-800 border-r border-slate-200 text-[9px] sm:text-xs whitespace-nowrap">
                        {pieceCount}
                      </td>

                      {/* Amount */}
                      <td className="py-1.5 px-1 sm:px-2 text-right font-mono font-bold text-slate-900 whitespace-nowrap text-[9px] sm:text-xs">
                        ₱{exp.amount.toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-slate-400 text-[10px]">
                    No expense records found.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              {/* Excel Summary Footer */}
              <tr className="bg-slate-50 border-t-2 border-slate-300 font-bold text-slate-900">
                <td className="py-1.5 px-1 sm:px-2 text-center border-r border-slate-300 uppercase tracking-wider text-[8px] sm:text-[10px] text-slate-700">
                  Total
                </td>
                <td className="py-1.5 px-1.5 sm:px-2.5 border-r border-slate-300 text-slate-600 font-medium text-[9px] sm:text-[11px] truncate">
                  {expenses.length} items
                </td>
                <td className="py-1.5 px-0.5 sm:px-1 text-center font-mono font-extrabold text-indigo-700 border-r border-slate-300 text-[9px] sm:text-xs whitespace-nowrap">
                  {totalPieces}
                </td>
                <td className="py-1.5 px-1 sm:px-2 text-right font-mono font-extrabold text-emerald-700 whitespace-nowrap text-[9px] sm:text-xs">
                  ₱{totalAllExpenses.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
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
