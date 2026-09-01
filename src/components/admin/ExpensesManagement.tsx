import React, { useState } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { Expense, InventoryItem } from '../../types';
import { 
  Package, 
  Plus, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  RefreshCw, 
  Droplets, 
  Sparkles, 
  Boxes, 
  Receipt, 
  TrendingDown, 
  X, 
  ShieldAlert, 
  Zap, 
  Layers,
  ShoppingBag
} from 'lucide-react';

export const ExpensesManagement: React.FC = () => {
  const { 
    expenses, 
    addExpense, 
    inventory, 
    addInventoryItem, 
    updateInventoryStock, 
    restockInventoryItem,
    todayExpensesTotal, 
    monthlyExpensesTotal,
    lowStockItemsCount,
    currentUser
  } = useLaundry();

  // Active view toggle: 'INVENTORY' (default) or 'EXPENSES'
  const [activeTab, setActiveTab] = useState<'INVENTORY' | 'EXPENSES'>('INVENTORY');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [stockStatusFilter, setStockStatusFilter] = useState<string>('ALL');

  // Modals
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isAddInventoryModalOpen, setIsAddInventoryModalOpen] = useState(false);
  const [restockModalItem, setRestockModalItem] = useState<InventoryItem | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(10);
  const [restockCost, setRestockCost] = useState<number>(0);

  // New Expense Form State
  const [category, setCategory] = useState<Expense['category']>('Detergent & Chemicals');
  const [amount, setAmount] = useState<number>(1200);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('2026-08-31');
  const [referenceNo, setReferenceNo] = useState('');

  // New Inventory Item Form State
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<InventoryItem['category']>('Detergent');
  const [newItemStock, setNewItemStock] = useState<number>(10);
  const [newItemMinThreshold, setNewItemMinThreshold] = useState<number>(5);
  const [newItemUnit, setNewItemUnit] = useState('kg');
  const [newItemCost, setNewItemCost] = useState<number>(120);
  const [newItemSupplier, setNewItemSupplier] = useState('P&G Wholesale Manila');

  // Handlers
  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description.trim()) return;

    addExpense({
      category,
      amount,
      description: description.trim(),
      date,
      recordedBy: currentUser?.name || 'Shift Staff',
      referenceNo: referenceNo.trim() || undefined
    });

    setDescription('');
    setReferenceNo('');
    setIsAddExpenseModalOpen(false);
  };

  const handleAddInventorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || newItemStock < 0) return;

    addInventoryItem({
      name: newItemName.trim(),
      category: newItemCategory,
      currentStock: Number(newItemStock),
      minThreshold: Number(newItemMinThreshold),
      unit: newItemUnit.trim() || 'pcs',
      costPerUnit: Number(newItemCost),
      supplier: newItemSupplier.trim() || 'Local Distributor',
      lastRestocked: '2026-08-31'
    });

    setNewItemName('');
    setIsAddInventoryModalOpen(false);
  };

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockModalItem || restockAmount <= 0) return;

    restockInventoryItem(restockModalItem.id, Number(restockAmount), Number(restockCost));
    setRestockModalItem(null);
  };

  // Filtered lists
  const filteredInventory = inventory.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.supplier.toLowerCase().includes(q);

    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesStatus = stockStatusFilter === 'ALL' || item.status === stockStatusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredExpenses = expenses.filter(exp => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      exp.description.toLowerCase().includes(q) ||
      exp.category.toLowerCase().includes(q) ||
      (exp.referenceNo && exp.referenceNo.toLowerCase().includes(q));

    const matchesCategory = categoryFilter === 'ALL' || exp.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div id="expenses-and-inventory-view" className="space-y-5">
      
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {activeTab === 'INVENTORY' ? 'Shop Supplies & Inventory Stock' : 'Shop Operational Expenses'}
            </h1>
            {lowStockItemsCount > 0 && activeTab === 'INVENTORY' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                <AlertTriangle size={11} className="text-amber-600" />
                {lowStockItemsCount} Low Stock
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            {activeTab === 'INVENTORY' 
              ? 'Real-time inventory levels, detergent drums, fabric conditioner, packaging bags, and restock alerts'
              : 'Log store operations, supply restocking, utilities, and store maintenance costs'}
          </p>
        </div>

        {/* Action Button & View Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center text-xs font-bold">
            <button
              onClick={() => { setActiveTab('INVENTORY'); setSearchQuery(''); setCategoryFilter('ALL'); }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'INVENTORY'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Boxes size={14} />
              <span>Inventory & Stocks</span>
            </button>
            <button
              onClick={() => { setActiveTab('EXPENSES'); setSearchQuery(''); setCategoryFilter('ALL'); }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'EXPENSES'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Receipt size={14} />
              <span>Expense Ledger</span>
            </button>
          </div>

          {activeTab === 'INVENTORY' ? (
            <button
              onClick={() => setIsAddInventoryModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 active:scale-95 shrink-0"
            >
              <Plus size={15} />
              <span>Add Stock Item</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddExpenseModalOpen(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 active:scale-95 shrink-0"
            >
              <Plus size={15} />
              <span>Add Expense</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Overview Cards */}
      {activeTab === 'INVENTORY' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Total Supplies Tracked */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Total Items Tracked</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                <Boxes size={14} />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              {inventory.length} SKUs
            </div>
            <span className="text-[11px] text-slate-400 pt-1 block">
              Detergents, FabCons, Bags & Tags
            </span>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Low Stock Alerts</span>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                lowStockItemsCount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
              }`}>
                <AlertTriangle size={14} />
              </div>
            </div>
            <div className={`text-2xl font-extrabold font-mono ${lowStockItemsCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {lowStockItemsCount} Items
            </div>
            <span className="text-[11px] text-slate-400 pt-1 block">
              Needs restocking from suppliers
            </span>
          </div>

          {/* Liquid Detergent & Fabcon Level */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Detergent Powder/Liquid</span>
              <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs">
                <Droplets size={14} />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              22.5 kg/L
            </div>
            <span className="text-[11px] text-slate-400 pt-1 block">
              Ariel (18.5kg) + Breeze (4.0L)
            </span>
          </div>

          {/* Laundry Packaging Bags */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Packaging Bags Left</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                <Package size={14} />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              340 pcs
            </div>
            <span className="text-[11px] text-slate-400 pt-1 block">
              Heavy-duty clear laundry bags
            </span>
          </div>

        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Today's Expenses */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Today's Expenses</span>
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
                <TrendingDown size={14} />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              ₱{todayExpensesTotal.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400 pt-1 block">
              Detergent restocking & supply bags
            </span>
          </div>

          {/* Monthly Expenses */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Monthly Expenses</span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                ₱
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              ₱{monthlyExpensesTotal.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400 pt-1 block">
              August 2026 total operational burn
            </span>
          </div>

          {/* Utilities Breakdown */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Utilities (Water + Power)</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                <Zap size={14} />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              ₱6,600
            </div>
            <span className="text-[11px] text-slate-400 pt-1 block">
              Electricity: ₱4,500 · Water: ₱2,100
            </span>
          </div>

          {/* Chemical & Detergent Costs */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Chemicals & Wash</span>
              <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs">
                <Droplets size={14} />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              ₱1,950
            </div>
            <span className="text-[11px] text-slate-400 pt-1 block">
              Ariel (₱1,200) + Downy (₱750)
            </span>
          </div>

        </div>
      )}

      {/* Search & Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={activeTab === 'INVENTORY' ? "Search supply name, supplier, or category..." : "Search expense description, category, or receipt ref..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {activeTab === 'INVENTORY' ? (
            <>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 font-medium shrink-0">Category:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="ALL">All Categories</option>
                  <option value="Detergent">Detergent</option>
                  <option value="Fabric Conditioner">Fabric Conditioner</option>
                  <option value="Packaging">Packaging & Bags</option>
                  <option value="Bleach & Chemicals">Bleach & Chemicals</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 font-medium shrink-0">Status:</span>
                <select
                  value={stockStatusFilter}
                  onChange={(e) => setStockStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="ALL">All Stock Levels</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium shrink-0">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="Detergent & Chemicals">Detergent & Chemicals</option>
                <option value="Electricity">Electricity</option>
                <option value="Water">Water</option>
                <option value="Packaging & Supplies">Packaging & Supplies</option>
                <option value="Equipment Maintenance">Maintenance</option>
                <option value="Rent">Rent</option>
                <option value="Staff Wages">Staff Wages</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Table: Inventory vs Expense Ledger */}
      {activeTab === 'INVENTORY' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Supply Item Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Current Stock</th>
                  <th className="py-3 px-4">Min. Threshold</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4">Last Restocked</th>
                  <th className="py-3 px-4 text-right">Stock Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredInventory.map((item) => {
                  const isLow = item.currentStock <= item.minThreshold;
                  const isOut = item.currentStock <= 0;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">₱{item.costPerUnit} / {item.unit}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 font-semibold text-slate-700 text-[11px]">
                          {item.category}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className={`text-sm font-extrabold ${isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-slate-900'}`}>
                            {item.currentStock}
                          </span>
                          <span className="text-slate-500 text-xs font-semibold">{item.unit}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {item.minThreshold} {item.unit}
                      </td>

                      <td className="py-3 px-4">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 size={11} className="text-emerald-600" />
                            In Stock
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-600 text-[11px]">
                        {item.supplier}
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        {item.lastRestocked}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Adjust Buttons */}
                          <button
                            type="button"
                            onClick={() => updateInventoryStock(item.id, item.currentStock - 1)}
                            className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold font-mono text-xs transition-colors"
                            title="Used 1 unit in operations"
                          >
                            -1
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRestockModalItem(item);
                              setRestockAmount(10);
                              setRestockCost(item.costPerUnit * 10);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-[11px] flex items-center gap-1 transition-colors"
                          >
                            <RefreshCw size={11} />
                            <span>Restock</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Logged By</th>
                  <th className="py-3 px-4">Ref / Receipt #</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {exp.date}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 font-bold text-slate-800 text-[11px]">
                        <span>{exp.category}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {exp.description}
                    </td>
                    <td className="py-3 px-4 font-mono font-extrabold text-rose-700 text-sm">
                      ₱{exp.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {exp.recordedBy}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {exp.referenceNo || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Inventory Item Modal */}
      {isAddInventoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Boxes size={18} className="text-emerald-400" />
                <h3 className="font-bold text-sm">Add New Inventory Stock SKU</h3>
              </div>
              <button onClick={() => setIsAddInventoryModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddInventorySubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tide Perfect Clean Detergent Powder"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
                  >
                    <option value="Detergent">Detergent</option>
                    <option value="Fabric Conditioner">Fabric Conditioner</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Bleach & Chemicals">Bleach & Chemicals</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit of Measure *</label>
                  <input
                    type="text"
                    required
                    placeholder="kg, L, pcs, rolls"
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Starting Stock *</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={newItemStock}
                    onChange={(e) => setNewItemStock(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Min. Alert Threshold</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={newItemMinThreshold}
                    onChange={(e) => setNewItemMinThreshold(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cost per Unit (₱)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={newItemCost}
                    onChange={(e) => setNewItemCost(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Supplier Name</label>
                  <input
                    type="text"
                    value={newItemSupplier}
                    onChange={(e) => setNewItemSupplier(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddInventoryModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
                >
                  Save Stock SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restock Item Modal */}
      {restockModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Restock Inventory</h3>
                <p className="text-[11px] text-slate-300">{restockModalItem.name}</p>
              </div>
              <button onClick={() => setRestockModalItem(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-slate-500 font-medium block">Current In-Stock</span>
                  <span className="text-base font-extrabold text-slate-900 font-mono">
                    {restockModalItem.currentStock} {restockModalItem.unit}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 font-medium block">Supplier</span>
                  <span className="text-xs font-bold text-slate-800">
                    {restockModalItem.supplier}
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Additional Amount to Add ({restockModalItem.unit}) *
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  required
                  value={restockAmount}
                  onChange={(e) => {
                    const amt = parseFloat(e.target.value) || 0;
                    setRestockAmount(amt);
                    setRestockCost(amt * restockModalItem.costPerUnit);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-extrabold text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Total Restock Expense Cost (₱) - Auto logs into Expense Ledger
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={restockCost}
                  onChange={(e) => setRestockCost(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Optional: If set &gt; ₱0, this purchase will be automatically recorded in your Operational Expenses.
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-emerald-900">
                <span className="font-bold">New Updated Total Stock:</span>
                <span className="font-extrabold font-mono text-sm">
                  {restockModalItem.currentStock + Number(restockAmount)} {restockModalItem.unit}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRestockModalItem(null)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-xs"
                >
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {isAddExpenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Record Shop Expense</h3>
              <button onClick={() => setIsAddExpenseModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddExpenseSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Expense Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
                >
                  <option value="Detergent & Chemicals">Detergent & Chemicals</option>
                  <option value="Electricity">Electricity (Power)</option>
                  <option value="Water">Water Utility</option>
                  <option value="Packaging & Supplies">Packaging & Plastic Bags</option>
                  <option value="Equipment Maintenance">Equipment Maintenance / Repairs</option>
                  <option value="Rent">Shop Space Rent</option>
                  <option value="Staff Wages">Staff Wages</option>
                  <option value="Other">Other Miscellaneous</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Amount (₱) *</label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="e.g. 1200"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Expense Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ariel Professional Powder (25kg drum bulk restocking)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Invoice / Receipt Ref #</label>
                  <input
                    type="text"
                    placeholder="OR-99128"
                    value={referenceNo}
                    onChange={(e) => setReferenceNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors"
                >
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
