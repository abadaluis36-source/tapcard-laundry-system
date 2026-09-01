import React, { useState } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Crown, 
  X,
  FileText,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const CustomerManagement: React.FC = () => {
  const { customers, addCustomer } = useLaundry();
  const [searchQuery, setSearchQuery] = useState('');
  const [displayLimit, setDisplayLimit] = useState<number>(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Customer Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isVip, setIsVip] = useState(false);

  const filteredCustomers = customers
    .filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const visibleCustomers = filteredCustomers.slice(0, displayLimit);
  const hasMore = filteredCustomers.length > displayLimit;

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

      {/* Customer List Full Width */}
      <div className="space-y-3">
        
        {/* Search bar */}
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
            <span>Total:</span>
            <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
              {filteredCustomers.length} Customers
            </span>
          </div>
        </div>

        {/* Customer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {visibleCustomers.length > 0 ? (
            visibleCustomers.map((cust) => {
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
              <p className="text-xs text-slate-400 mt-1">No customer records match your search criteria.</p>
            </div>
          )}
        </div>

        {/* View More / Pagination Controls when customer count reaches 10+ */}
        {filteredCustomers.length > 10 && (
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <span>Showing</span>
              <span className="font-bold text-slate-900 font-mono">
                {visibleCustomers.length}
              </span>
              <span>of</span>
              <span className="font-bold text-slate-900 font-mono">
                {filteredCustomers.length}
              </span>
              <span>customers</span>
            </div>

            <div className="flex items-center gap-2">
              {hasMore ? (
                <>
                  <button
                    type="button"
                    onClick={() => setDisplayLimit((prev) => prev + 10)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <span>View More</span>
                    <ChevronDown size={14} />
                    <span className="text-[11px] bg-slate-800 px-1.5 py-0.5 rounded-md text-emerald-400 font-mono ml-0.5">
                      +{Math.min(10, filteredCustomers.length - visibleCustomers.length)}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDisplayLimit(filteredCustomers.length)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  >
                    View All ({filteredCustomers.length})
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setDisplayLimit(10)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronUp size={14} />
                  <span>Show Less (First 10)</span>
                </button>
              )}
            </div>
          </div>
        )}
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
