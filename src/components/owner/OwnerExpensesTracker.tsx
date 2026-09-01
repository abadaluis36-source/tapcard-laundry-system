import React, { useState, useMemo } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { Expense, ExpenseSubmission } from '../../types';
import { 
  Receipt, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ChevronDown, 
  Search, 
  Calendar, 
  DollarSign, 
  Check, 
  Plus, 
  Trash2, 
  X,
  Building2,
  FileCheck,
  Send,
  Droplets,
  Zap,
  Package,
  Wrench,
  Home,
  Users,
  Layers
} from 'lucide-react';

const EXPENSE_CATEGORIES: {
  key: Expense['category'];
  label: string;
}[] = [
  { key: 'Detergent & Chemicals', label: 'Detergent & Chemicals' },
  { key: 'Electricity', label: 'Electricity' },
  { key: 'Water', label: 'Water Utility' },
  { key: 'Packaging & Supplies', label: 'Packaging & Supplies' },
  { key: 'Equipment Maintenance', label: 'Maintenance & Repairs' },
  { key: 'Rent', label: 'Store Lease & Rent' },
  { key: 'Staff Wages', label: 'Staff Wages' },
  { key: 'Other', label: 'Other Operational Costs' },
];

export const OwnerExpensesTracker: React.FC = () => {
  const { 
    expenses, 
    expenseSubmissions, 
    reviewExpenseReport, 
    addExpense, 
    deleteExpense,
    monthlyExpensesTotal,
    currentUser 
  } = useLaundry();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({
    '2026-09-01': true,
    '2026-08-31': true
  });

  // Modal for Boss to add direct executive overhead
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [category, setCategory] = useState<Expense['category']>('Rent');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState('');
  const [pieces, setPieces] = useState<string>('1');
  const [date, setDate] = useState('2026-09-01');
  const [referenceNo, setReferenceNo] = useState('');

  const toggleDate = (d: string) => {
    setExpandedDates(prev => ({
      ...prev,
      [d]: !prev[d]
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    groupedExpensesByDate.forEach(g => {
      all[g.date] = true;
    });
    setExpandedDates(all);
  };

  const collapseAll = () => {
    const all: Record<string, boolean> = {};
    groupedExpensesByDate.forEach(g => {
      all[g.date] = false;
    });
    setExpandedDates(all);
  };

  // Group all expenses by date descending
  const groupedExpensesByDate = useMemo(() => {
    const filtered = expenses.filter(exp => {
      const matchesCategory = selectedCategory === 'ALL' || exp.category === selectedCategory;
      const matchesSearch = 
        exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (exp.referenceNo && exp.referenceNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
        exp.date.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });

    const groupsMap = new Map<string, Expense[]>();
    filtered.forEach(exp => {
      const list = groupsMap.get(exp.date) || [];
      list.push(exp);
      groupsMap.set(exp.date, list);
    });

    // Sort dates descending (newest first)
    const sortedDates = Array.from(groupsMap.keys()).sort((a, b) => b.localeCompare(a));

    return sortedDates.map(dateKey => {
      const items = groupsMap.get(dateKey) || [];
      const subtotalAmount = items.reduce((sum, item) => sum + item.amount, 0);
      const subtotalPieces = items.reduce((sum, item) => {
        const p = item.pieces !== undefined ? Number(item.pieces) : 1;
        return sum + (isNaN(p) ? 1 : p);
      }, 0);

      // Create human readable label (e.g., "Expense Sept 1", "Expense Aug 31")
      let dateLabel = dateKey;
      let fullDateStr = dateKey;
      try {
        const parts = dateKey.split('-');
        if (parts.length === 3) {
          const dObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
          const monthShort = dObj.toLocaleDateString('en-US', { month: 'short' });
          const dayNum = dObj.getDate();
          dateLabel = `Expense ${monthShort} ${dayNum}`;
          fullDateStr = dObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        }
      } catch {
        dateLabel = `Expense ${dateKey}`;
      }

      return {
        date: dateKey,
        buttonLabel: dateLabel,
        fullDateLabel: fullDateStr,
        items,
        subtotalAmount,
        subtotalPieces,
        itemCount: items.length
      };
    });
  }, [expenses, selectedCategory, searchQuery]);

  // Executive metrics
  const totalAllAmount = useMemo(() => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const pendingSubmissionsCount = useMemo(() => {
    return Object.values(expenseSubmissions || {}).filter((s: ExpenseSubmission) => s.status === 'PENDING_REVIEW').length;
  }, [expenseSubmissions]);

  const approvedSubmissionsCount = useMemo(() => {
    return Object.values(expenseSubmissions || {}).filter((s: ExpenseSubmission) => s.status === 'APPROVED').length;
  }, [expenseSubmissions]);

  const handleAddOverhead = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    addExpense({
      category,
      amount: parsedAmount,
      description: description.trim() || category,
      pieces: parseInt(pieces) || 1,
      date,
      recordedBy: currentUser?.name ? `Boss ${currentUser.name}` : 'Boss Dennis',
      referenceNo: referenceNo.trim() || undefined
    });

    setAmount('');
    setDescription('');
    setPieces('1');
    setReferenceNo('');
    setIsAddExpenseModalOpen(false);
  };

  return (
    <div id="boss-expense-tracker-view" className="space-y-4 pb-12">
      {/* 1. TOP HEADER & EXECUTIVE OVERVIEW */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[10px] uppercase tracking-wider border border-indigo-100">
                Boss Executive Portal
              </span>
              {pendingSubmissionsCount > 0 && (
                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold text-[10px] flex items-center gap-1 border border-amber-200">
                  <Clock size={11} />
                  {pendingSubmissionsCount} Pending Audit
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Expense Tracker
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review daily staff expense table transmissions, audit store disbursements, and track overhead.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="boss-add-overhead-btn"
              onClick={() => setIsAddExpenseModalOpen(true)}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} />
              <span>Record Overhead</span>
            </button>
          </div>
        </div>

        {/* Executive Summary Metric Card */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 max-w-sm">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Expenses (Month-to-Date)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-extrabold text-slate-900 font-mono">
                ₱{totalAllAmount.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                ({expenses.length} records)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SEARCH & FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            id="boss-expense-search"
            placeholder="Search by product, category, receipt #, or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            id="boss-expense-category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {EXPENSE_CATEGORIES.map(c => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={expandAll}
              className="px-2.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs font-medium shadow-2xs cursor-pointer"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="px-2.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs font-medium shadow-2xs cursor-pointer"
            >
              Collapse
            </button>
          </div>
        </div>
      </div>

      {/* 3. TRANSMITTED EXPENSE TABLES LIST */}
      <div className="space-y-3">
        {groupedExpensesByDate.length > 0 ? (
          groupedExpensesByDate.map((group) => {
            const isOpen = expandedDates[group.date] ?? false;
            const submission = expenseSubmissions[group.date];
            const isApproved = submission?.status === 'APPROVED';
            const isSent = !!submission;

            return (
              <div 
                key={group.date}
                id={`boss-expense-card-${group.date}`}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all"
              >
                {/* Header Card */}
                <div className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isOpen ? 'bg-slate-50/80 border-b border-slate-200' : 'bg-white'
                }`}>
                  {/* Left info */}
                  <div 
                    onClick={() => toggleDate(group.date)}
                    className="flex items-center gap-3 cursor-pointer select-none min-w-0 flex-1"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isApproved 
                        ? 'bg-emerald-600 text-white' 
                        : isSent 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Receipt size={16} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm sm:text-base text-slate-900">
                          {group.buttonLabel}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          • {group.fullDateLabel}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                        {submission?.sentBy && (
                          <span>Sent by <strong className="text-slate-700 font-semibold">{submission.sentBy}</strong> •</span>
                        )}
                        <span>{group.itemCount} items</span>
                        <span>•</span>
                        <span>{group.subtotalPieces} pcs</span>
                        {submission?.reviewedAt && (
                          <span className="text-[10px] text-emerald-700 font-mono hidden md:inline">
                            (Audited: {submission.reviewedAt})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions & Amount */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                        Total Amount
                      </span>
                      <span className="font-mono font-extrabold text-base text-rose-700">
                        ₱{group.subtotalAmount.toLocaleString()}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleDate(group.date)}
                      className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition-transform ${isOpen ? 'rotate-180 bg-slate-200' : 'bg-slate-100'}`}
                      aria-label="Toggle details"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                </div>

                {/* Spreadsheet Table */}
                {isOpen && (
                  <div className="w-full overflow-x-auto">
                    <table className="w-full table-fixed text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold select-none">
                          <th className="w-[18%] py-2 px-3 text-center border-r border-slate-200 font-semibold whitespace-nowrap">
                            Date
                          </th>
                          <th className="w-[44%] py-2 px-3 border-r border-slate-200 font-semibold">
                            Products / Description
                          </th>
                          <th className="w-[12%] py-2 px-2 text-center border-r border-slate-200 font-semibold whitespace-nowrap">
                            Pcs
                          </th>
                          <th className="w-[18%] py-2 px-3 text-right border-r border-slate-200 font-semibold whitespace-nowrap">
                            Amount
                          </th>
                          <th className="w-[8%] py-2 px-2 text-center font-semibold whitespace-nowrap">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {group.items.map((exp) => {
                          const pieceCount = exp.pieces !== undefined ? Number(exp.pieces) : 1;
                          return (
                            <tr 
                              key={exp.id} 
                              className="hover:bg-indigo-50/40 transition-colors"
                            >
                              {/* Date */}
                              <td className="py-2 px-3 text-center font-mono text-slate-600 border-r border-slate-100 whitespace-nowrap">
                                {exp.date}
                              </td>

                              {/* Products / Description */}
                              <td className="py-2 px-3 border-r border-slate-100 text-slate-900">
                                <div className="flex items-center justify-between gap-1">
                                  <div>
                                    <span className="font-semibold text-slate-800 block">
                                      {exp.description || exp.category}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block font-normal">
                                      Recorded by: {exp.recordedBy}
                                    </span>
                                  </div>
                                  {exp.referenceNo && (
                                    <span className="text-[9px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                                      {exp.referenceNo}
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Pieces */}
                              <td className="py-2 px-2 text-center font-mono font-bold text-slate-700 border-r border-slate-100">
                                {pieceCount}
                              </td>

                              {/* Amount */}
                              <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 border-r border-slate-100">
                                ₱{exp.amount.toLocaleString()}
                              </td>

                              {/* Delete option for Boss */}
                              <td className="py-2 px-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => deleteExpense(exp.id)}
                                  className="p-1 text-slate-300 hover:text-rose-600 rounded transition-colors cursor-pointer"
                                  title="Delete item"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>

                      {/* Subtotal footer row */}
                      <tfoot>
                        <tr className="bg-slate-50 font-bold border-t border-slate-200 text-slate-900">
                          <td colSpan={2} className="py-2 px-3 border-r border-slate-200 text-right uppercase tracking-wider text-[11px] text-slate-600">
                            Subtotal for {group.buttonLabel}:
                          </td>
                          <td className="py-2 px-2 text-center font-mono border-r border-slate-200 text-slate-800">
                            {group.subtotalPieces} pcs
                          </td>
                          <td className="py-2 px-3 text-right font-mono text-rose-700 font-extrabold border-r border-slate-200">
                            ₱{group.subtotalAmount.toLocaleString()}
                          </td>
                          <td className="py-2 px-2 bg-slate-50" />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
            No expense reports matching the selected filters.
          </div>
        )}
      </div>

      {/* 4. MODAL: BOSS RECORD OVERHEAD / LEASE / EXPENSE */}
      {isAddExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-indigo-400" />
                <h3 className="font-extrabold text-sm sm:text-base">Record Boss / Overhead Expense</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddExpenseModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddOverhead} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Expense Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Expense['category'])}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Amount (₱) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pieces / Quantity (Pcs)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={pieces}
                    onChange={(e) => setPieces(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description / Vendor Details
                </label>
                <input
                  type="text"
                  placeholder="e.g. Meralco electric bill payment, Shop lease"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Reference / Receipt #
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. OR-8910"
                    value={referenceNo}
                    onChange={(e) => setReferenceNo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Overhead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
