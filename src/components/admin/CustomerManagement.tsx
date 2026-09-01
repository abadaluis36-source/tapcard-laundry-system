import React, { useState } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Crown, 
  X,
  FileText,
  Calendar,
  CalendarDays,
  CalendarRange,
  Clock,
  Sparkles
} from 'lucide-react';

type TimeFilter = 'ALL' | 'TODAY' | 'WEEKLY' | 'MONTHLY';

export const CustomerManagement: React.FC = () => {
  const { customers, addCustomer } = useLaundry();
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Customer Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isVip, setIsVip] = useState(false);

  // Time filter check helpers (Current reference date: 2026-08-31)
  const isTodayCustomer = (c: typeof customers[0]) => {
    return c.lastOrderDate === '2026-08-31' || c.lastOrderDate === 'New Customer';
  };

  const isWeeklyCustomer = (c: typeof customers[0]) => {
    if (c.lastOrderDate === 'New Customer') return true;
    // Within past 7 days (2026-08-25 to 2026-08-31)
    return c.lastOrderDate >= '2026-08-25' && c.lastOrderDate <= '2026-08-31';
  };

  const isMonthlyCustomer = (c: typeof customers[0]) => {
    if (c.lastOrderDate === 'New Customer') return true;
    // Current month (August 2026)
    return c.lastOrderDate.startsWith('2026-08');
  };

  // Counts for each period
  const totalCount = customers.length;
  const todayCount = customers.filter(isTodayCustomer).length;
  const weeklyCount = customers.filter(isWeeklyCustomer).length;
  const monthlyCount = customers.filter(isMonthlyCustomer).length;

  const matchesTime = (c: typeof customers[0]) => {
    if (timeFilter === 'TODAY') return isTodayCustomer(c);
    if (timeFilter === 'WEEKLY') return isWeeklyCustomer(c);
    if (timeFilter === 'MONTHLY') return isMonthlyCustomer(c);
    return true;
  };

  const filteredCustomers = customers
    .filter(matchesTime)
    .filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    addCustomer({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      notes: notes.trim() || undefined,
      isVip
    });

    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setNotes('');
    setIsVip(false);
    setIsAddModalOpen(false);
  };

  return (
    <div id="customer-management-view" className="space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Customers
            </h1>
            <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Total Customers: {customers.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage customer directories, track order activities, and filter by period
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 active:scale-95 self-start sm:self-auto cursor-pointer"
        >
          <Plus size={15} />
          <span>+ Add Customer</span>
        </button>
      </div>

      {/* Period Filter Buttons (All, Today, Weekly, Monthly) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* All Customers */}
        <button
          type="button"
          onClick={() => setTimeFilter('ALL')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            timeFilter === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              timeFilter === 'ALL' ? 'text-slate-300' : 'text-slate-500'
            }`}>
              <Users size={14} />
              All Customers
            </span>
            <span className={`text-[11px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
              timeFilter === 'ALL'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                : 'bg-slate-100 text-slate-700'
            }`}>
              {totalCount}
            </span>
          </div>
          <span className={`text-xs font-semibold ${timeFilter === 'ALL' ? 'text-slate-200' : 'text-slate-900'}`}>
            Lifetime Registered
          </span>
        </button>

        {/* Today */}
        <button
          type="button"
          onClick={() => setTimeFilter('TODAY')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            timeFilter === 'TODAY'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-600/20'
              : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              timeFilter === 'TODAY' ? 'text-emerald-100' : 'text-slate-500'
            }`}>
              <Clock size={14} />
              Today
            </span>
            <span className={`text-[11px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
              timeFilter === 'TODAY'
                ? 'bg-emerald-800 text-white border border-emerald-600'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}>
              {todayCount}
            </span>
          </div>
          <span className={`text-xs font-semibold ${timeFilter === 'TODAY' ? 'text-emerald-50' : 'text-slate-900'}`}>
            Active Today
          </span>
        </button>

        {/* Weekly */}
        <button
          type="button"
          onClick={() => setTimeFilter('WEEKLY')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            timeFilter === 'WEEKLY'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-600/20'
              : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              timeFilter === 'WEEKLY' ? 'text-emerald-100' : 'text-slate-500'
            }`}>
              <CalendarDays size={14} />
              Weekly
            </span>
            <span className={`text-[11px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
              timeFilter === 'WEEKLY'
                ? 'bg-emerald-800 text-white border border-emerald-600'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}>
              {weeklyCount}
            </span>
          </div>
          <span className={`text-xs font-semibold ${timeFilter === 'WEEKLY' ? 'text-emerald-50' : 'text-slate-900'}`}>
            This Week
          </span>
        </button>

        {/* Monthly */}
        <button
          type="button"
          onClick={() => setTimeFilter('MONTHLY')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            timeFilter === 'MONTHLY'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-600/20'
              : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              timeFilter === 'MONTHLY' ? 'text-emerald-100' : 'text-slate-500'
            }`}>
              <CalendarRange size={14} />
              Monthly
            </span>
            <span className={`text-[11px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
              timeFilter === 'MONTHLY'
                ? 'bg-emerald-800 text-white border border-emerald-600'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}>
              {monthlyCount}
            </span>
          </div>
          <span className={`text-xs font-semibold ${timeFilter === 'MONTHLY' ? 'text-emerald-50' : 'text-slate-900'}`}>
            This Month
          </span>
        </button>
      </div>

      {/* Customer List Full Width */}
      <div className="space-y-3">
        
        {/* Search bar & Active filter badge */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search size={15} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer name, mobile phone, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-slate-500 font-medium shrink-0">
            <span>Showing:</span>
            <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
              {timeFilter === 'ALL' ? 'All Customers' : timeFilter === 'TODAY' ? 'Today\'s Customers' : timeFilter === 'WEEKLY' ? 'This Week\'s Customers' : 'This Month\'s Customers'} ({filteredCustomers.length})
            </span>
          </div>
        </div>

        {/* Customer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((cust) => {
              return (
                <div
                  key={cust.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-2xs transition-all bg-white flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs uppercase ${
                        cust.isVip ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {cust.name.substring(0, 2)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900">{cust.name}</span>
                          {cust.isVip && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                              <Crown size={10} /> VIP
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 font-mono">{cust.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="text-[11px] text-slate-500">
                      <span>{cust.totalOrders} total orders</span>
                      <span className="text-slate-300 mx-1.5">•</span>
                      <span className="font-mono text-slate-400">{cust.lastOrderDate}</span>
                    </div>
                    <span className="font-mono font-extrabold text-emerald-700">
                      ₱{cust.totalSpent.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
              <p className="font-bold text-sm">No customers found</p>
              <p className="text-xs text-slate-400 mt-1">No customer records match the selected {timeFilter.toLowerCase()} period or search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Add New Customer</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria Santos"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mobile Phone *</label>
                <input
                  type="text"
                  required
                  placeholder="09XX XXX XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Delivery / Residence Address</label>
                <input
                  type="text"
                  placeholder="Condo Unit / Street / Barangay"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Wash Preferences / Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Hypoallergenic detergent, low heat dry, separate whites..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="vip-check"
                  checked={isVip}
                  onChange={(e) => setIsVip(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="vip-check" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Mark as VIP Customer (Priority Processing)
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
