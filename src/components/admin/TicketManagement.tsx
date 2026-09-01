import React, { useState } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { LaundryStatus, Ticket } from '../../types';
import { StatusBadge, PaymentBadge } from '../common/StatusBadge';
import { 
  Search, 
  Filter, 
  PlusCircle, 
  Eye, 
  ChevronDown, 
  ArrowUpDown,
  Phone,
  Calendar,
  Layers,
  Sparkles,
  RotateCw,
  XCircle,
  FileSpreadsheet
} from 'lucide-react';

export const TicketManagement: React.FC = () => {
  const { 
    tickets, 
    setIsCreateTicketOpen, 
    setActiveDetailTicket, 
    setActiveClaimStubTicket,
    updateTicketStatus,
    setAdminTab,
    ticketStatusFilter,
    setTicketStatusFilter
  } = useLaundry();

  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'ALL' | 'PAID' | 'UNPAID' | 'PARTIAL'>('ALL');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Filter and sort tickets
  const filteredTickets = tickets.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      t.ticketNumber.toLowerCase().includes(q) ||
      t.customerName.toLowerCase().includes(q) ||
      t.customerPhone.replace(/\s+/g, '').includes(q.replace(/\s+/g, '')) ||
      t.items.some(i => i.name.toLowerCase().includes(q));

    const matchesStatus = ticketStatusFilter === 'ALL' || t.status === ticketStatusFilter;
    const matchesPayment = paymentFilter === 'ALL' || t.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const statuses: { key: LaundryStatus | 'ALL'; label: string }[] = [
    { key: 'ALL', label: 'All Tickets' },
    { key: 'RECEIVED', label: 'Received' },
    { key: 'WASHING', label: 'Washing' },
    { key: 'DRYING', label: 'Drying' },
    { key: 'FOLDING', label: 'Folding' },
    { key: 'READY', label: 'Ready' },
    { key: 'COMPLETED', label: 'Completed' },
    { key: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <div id="ticket-management-view" className="space-y-5">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Laundry Tickets Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track customer laundry orders, update processing stages, and monitor settlement status.
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
        
        {/* 1. Search Bar */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Ticket ID (e.g. LM1), Customer Name, or Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium transition-all"
          />
        </div>

        <div className="border-t border-slate-100 pt-3 space-y-3">
          {/* 2. Workflow Stage Filter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Laundry Workflow Stage
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {ticketStatusFilter === 'ALL' ? 'Showing all stages' : `Filtered by ${ticketStatusFilter.toLowerCase()}`}
              </span>
            </div>
            
            <div className="grid grid-cols-4 sm:flex sm:flex-wrap items-center gap-1.5">
              {statuses.map((st) => {
                const isSelected = ticketStatusFilter === st.key;
                const count = st.key === 'ALL' 
                  ? tickets.length 
                  : tickets.filter(t => t.status === st.key).length;

                const getDotColor = (key: string) => {
                  switch (key) {
                    case 'RECEIVED': return 'bg-sky-500';
                    case 'WASHING': return 'bg-blue-500';
                    case 'DRYING': return 'bg-amber-500';
                    case 'FOLDING': return 'bg-purple-500';
                    case 'READY': return 'bg-emerald-500';
                    case 'COMPLETED': return 'bg-slate-400';
                    case 'CANCELLED': return 'bg-rose-500';
                    default: return 'bg-slate-400';
                  }
                };

                return (
                  <button
                    key={st.key}
                    id={`filter-tab-${st.key.toLowerCase()}`}
                    onClick={() => setTicketStatusFilter(st.key)}
                    className={`w-full sm:w-auto px-1.5 sm:px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-0.5 sm:gap-1.5 text-center sm:text-left cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs ring-2 ring-slate-900/10'
                        : 'bg-slate-100/90 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {st.key !== 'ALL' && (
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-white' : getDotColor(st.key)}`} />
                      )}
                      <span className="truncate">{st.label}</span>
                    </div>
                    <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full font-mono transition-colors ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/90 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Payment Status Filter */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Payment Status
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {paymentFilter === 'ALL' ? 'All payment states' : `${paymentFilter.toLowerCase()} only`}
              </span>
            </div>

            <div className="grid grid-cols-4 sm:flex items-center gap-1.5">
              {[
                { key: 'ALL', label: 'All Payments' },
                { key: 'PAID', label: 'Paid', dot: 'bg-emerald-500' },
                { key: 'UNPAID', label: 'Unpaid', dot: 'bg-rose-500' },
                { key: 'PARTIAL', label: 'Partial', dot: 'bg-amber-500' },
              ].map((p) => {
                const isSelected = paymentFilter === p.key;
                return (
                  <button
                    key={p.key}
                    id={`payment-filter-${p.key.toLowerCase()}`}
                    onClick={() => setPaymentFilter(p.key as any)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {p.dot && (
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : p.dot}`} />
                    )}
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Desktop Table View (Hidden on Mobile) */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Services & Weight</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status & Quick Update</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((tkt) => (
                  <tr key={tkt.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Ticket ID */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setActiveDetailTicket(tkt)}
                        className="font-mono font-extrabold text-sm text-slate-900 hover:text-emerald-600 underline underline-offset-2"
                      >
                        {tkt.ticketNumber}
                      </button>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-bold text-slate-900 block">{tkt.customerName}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{tkt.customerPhone}</span>
                      </div>
                    </td>

                    {/* Services */}
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-semibold text-slate-800 block">
                          {tkt.items.map(i => i.name).join(', ')}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {tkt.totalWeightKg} kg · {tkt.bagCount} bag(s)
                        </span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4">
                      <span className="font-extrabold font-mono text-slate-900 text-sm">
                        ₱{tkt.totalAmount.toLocaleString()}
                      </span>
                    </td>

                    {/* Payment */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <PaymentBadge status={tkt.paymentStatus} size="sm" />
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {tkt.paymentMethod}
                        </span>
                      </div>
                    </td>

                    {/* Status with inline dropdown */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={tkt.status} size="sm" />
                        <select
                          value={tkt.status}
                          onChange={(e) => updateTicketStatus(tkt.id, e.target.value as LaundryStatus)}
                          className="text-[11px] py-1 px-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                        >
                          <option value="RECEIVED">⚪ RECEIVED</option>
                          <option value="WASHING">🟡 WASHING</option>
                          <option value="DRYING">🔵 DRYING</option>
                          <option value="FOLDING">🟣 FOLDING</option>
                          <option value="READY">🟢 READY</option>
                          <option value="COMPLETED">✅ COMPLETED</option>
                          <option value="CANCELLED">🔴 CANCELLED</option>
                        </select>
                      </div>
                    </td>

                    {/* Created */}
                    <td className="py-3 px-4 text-[11px] text-slate-500 font-mono">
                      {tkt.createdAt}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setActiveClaimStubTicket(tkt)}
                          className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Customer Claim Stub"
                        >
                          <Eye size={15} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500">
                    <p className="font-semibold text-sm">No laundry tickets found</p>
                    <p className="text-xs text-slate-400 mt-1">Try clearing filters or search criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards View (Hidden on Desktop) */}
      <div className="md:hidden space-y-3">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((tkt) => (
            <div 
              key={tkt.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3"
            >
              {/* Card Header: Ticket ID & Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span 
                    onClick={() => setActiveClaimStubTicket(tkt)}
                    className="font-mono font-extrabold text-base text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                  >
                    {tkt.ticketNumber}
                  </span>
                  <PaymentBadge status={tkt.paymentStatus} size="sm" />
                </div>
                <StatusBadge status={tkt.status} size="sm" />
              </div>

              {/* Customer and Services */}
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{tkt.customerName}</span>
                  <span className="font-mono font-extrabold text-emerald-700 text-sm">
                    ₱{tkt.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="text-slate-500 flex items-center justify-between">
                  <span>{tkt.items.map(i => i.name).join(', ')}</span>
                  <span className="font-mono">{tkt.totalWeightKg}kg</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <select
                  value={tkt.status}
                  onChange={(e) => updateTicketStatus(tkt.id, e.target.value as LaundryStatus)}
                  className="text-xs py-1.5 px-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700 flex-1 focus:outline-none"
                >
                  <option value="RECEIVED">⚪ RECEIVED</option>
                  <option value="WASHING">🟡 WASHING</option>
                  <option value="DRYING">🔵 DRYING</option>
                  <option value="FOLDING">🟣 FOLDING</option>
                  <option value="READY">🟢 READY</option>
                  <option value="COMPLETED">✅ COMPLETED</option>
                </select>

                <button
                  onClick={() => setActiveClaimStubTicket(tkt)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
            <p className="font-bold text-sm">No laundry tickets found</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the status filter.</p>
          </div>
        )}
      </div>

    </div>
  );
};
