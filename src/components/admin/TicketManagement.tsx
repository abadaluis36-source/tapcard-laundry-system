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
    setAdminTab 
  } = useLaundry();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LaundryStatus | 'ALL'>('ALL');
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

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
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
      
      {/* Top Header & New Ticket Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Laundry Tickets Management
          </h1>
          <p className="text-xs text-slate-500">
            Search, filter, update live status, and manage all counter laundry jobs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="ticket-list-create-btn"
            onClick={() => {
              setAdminTab('create-ticket');
              setIsCreateTicketOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 active:scale-95"
          >
            <PlusCircle size={15} />
            <span>+ Create Ticket</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        
        {/* Search Bar & Payment Status filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Ticket ID (e.g. LM1), Customer Name, or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium shrink-0">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value as any)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Payments</option>
              <option value="PAID">Paid Only</option>
              <option value="UNPAID">Unpaid Only</option>
              <option value="PARTIAL">Partial Only</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs (Wraps into multiple rows on mobile) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {statuses.map((st) => {
            const isSelected = statusFilter === st.key;
            const count = st.key === 'ALL' 
              ? tickets.length 
              : tickets.filter(t => t.status === st.key).length;

            return (
              <button
                key={st.key}
                id={`filter-tab-${st.key.toLowerCase()}`}
                onClick={() => setStatusFilter(st.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
                }`}
              >
                <span>{st.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
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
                <div className="text-[11px] text-slate-400 font-mono">
                  {tkt.createdAt}
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
