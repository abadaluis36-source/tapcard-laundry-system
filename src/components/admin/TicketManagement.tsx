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

interface TicketManagementProps {
  hideHeader?: boolean;
}

export const TicketManagement: React.FC<TicketManagementProps> = ({ hideHeader = false }) => {
  const { 
    tickets, 
    setIsCreateTicketOpen, 
    setActiveDetailTicket, 
    setActiveClaimStubTicket,
    activeSettlementTicket,
    setActiveSettlementTicket,
    updateTicketStatus,
    setAdminTab,
    ticketStatusFilter,
    setTicketStatusFilter
  } = useLaundry();

  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'ALL' | 'PAID' | 'UNPAID' | 'PARTIAL'>('ALL');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const handleStatusChange = (tkt: Ticket, newStatus: LaundryStatus) => {
    if (newStatus === 'COMPLETED' && (tkt.paymentStatus === 'UNPAID' || tkt.paymentStatus === 'PARTIAL')) {
      setActiveSettlementTicket(tkt);
    } else {
      updateTicketStatus(tkt.id, newStatus);
    }
  };

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

  // Calculate contextual counts based on current status filter
  const stageScopedTickets = ticketStatusFilter === 'ALL'
    ? tickets
    : tickets.filter(t => t.status === ticketStatusFilter);

  const handlePaymentFilterClick = (key: 'ALL' | 'PAID' | 'UNPAID' | 'PARTIAL') => {
    if (paymentFilter === key && key !== 'ALL') {
      setPaymentFilter('ALL');
    } else {
      setPaymentFilter(key);
    }
  };

  const handleStatusFilterClick = (status: LaundryStatus | 'ALL') => {
    if (ticketStatusFilter === status && status !== 'ALL') {
      setTicketStatusFilter('ALL');
    } else {
      setTicketStatusFilter(status);
    }
  };

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
      {!hideHeader && (
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
      )}

      {/* Search and Filters Bar - Compact layout */}
      <div className="bg-white p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
        
        {/* Search Bar + Quick Payment filter in single line / compact stack */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Ticket ID, Customer, Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium transition-all"
            />
          </div>

          {/* Payment quick chips */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl shrink-0 overflow-x-auto">
            {[
              { key: 'ALL', label: 'All', count: stageScopedTickets.length },
              { key: 'PAID', label: 'Paid', dot: 'bg-emerald-500', count: stageScopedTickets.filter(t => t.paymentStatus === 'PAID').length },
              { key: 'UNPAID', label: 'Unpaid', dot: 'bg-rose-500', count: stageScopedTickets.filter(t => t.paymentStatus === 'UNPAID').length },
              { key: 'PARTIAL', label: 'Partial', dot: 'bg-amber-500', count: stageScopedTickets.filter(t => t.paymentStatus === 'PARTIAL').length },
            ].map((p) => {
              const isSelected = paymentFilter === p.key;
              return (
                <button
                  key={p.key}
                  id={`payment-filter-${p.key.toLowerCase()}`}
                  type="button"
                  onClick={() => handlePaymentFilterClick(p.key as any)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-2xs ring-1 ring-slate-300'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title={isSelected ? `Click to clear ${p.label} filter` : `Filter by ${p.label}`}
                >
                  {p.dot && (
                    <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
                  )}
                  <span>{p.label}</span>
                  <span className={`text-[10px] font-mono px-1 rounded ${isSelected ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}>
                    {p.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Workflow Stage Filter (Only when full header mode) */}
        {!hideHeader && (
          <div className="pt-2 border-t border-slate-100 space-y-1">
            <div className="grid grid-cols-4 sm:flex sm:flex-wrap items-center gap-1">
              {statuses.map((st) => {
                const isSelected = ticketStatusFilter === st.key;
                const count = st.key === 'ALL' 
                  ? tickets.length 
                  : tickets.filter(t => t.status === st.key).length;

                return (
                  <button
                    key={st.key}
                    id={`filter-tab-${st.key.toLowerCase()}`}
                    type="button"
                    onClick={() => handleStatusFilterClick(st.key)}
                    className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all flex items-center justify-between gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs ring-1 ring-slate-900'
                        : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span className="truncate">{st.label}</span>
                    <span className="text-[9px] font-mono opacity-80">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Table View (Hidden on Mobile) */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3.5">Ticket ID</th>
                <th className="py-2.5 px-3.5">Customer</th>
                <th className="py-2.5 px-3.5">Services & Weight</th>
                <th className="py-2.5 px-3.5">Amount</th>
                <th className="py-2.5 px-3.5">Payment</th>
                <th className="py-2.5 px-3.5">Status & Quick Update</th>
                <th className="py-2.5 px-3.5">Created</th>
                <th className="py-2.5 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((tkt) => (
                  <tr key={tkt.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Ticket ID */}
                    <td className="py-2.5 px-3.5">
                      <button
                        onClick={() => setActiveDetailTicket(tkt)}
                        className="font-mono font-extrabold text-xs text-slate-900 hover:text-emerald-600 underline underline-offset-2 cursor-pointer"
                      >
                        {tkt.ticketNumber}
                      </button>
                    </td>

                    {/* Customer */}
                    <td className="py-2.5 px-3.5">
                      <div>
                        <span className="font-bold text-slate-900 block">{tkt.customerName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{tkt.customerPhone}</span>
                      </div>
                    </td>

                    {/* Services */}
                    <td className="py-2.5 px-3.5">
                      <div>
                        <span className="font-semibold text-slate-800 block text-[11px]">
                          {tkt.items.map(i => i.name).join(', ')}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {tkt.totalWeightKg} kg · {tkt.bagCount} bag(s)
                        </span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-2.5 px-3.5">
                      <span className="font-extrabold font-mono text-slate-900 text-xs">
                        ₱{tkt.totalAmount.toLocaleString()}
                      </span>
                    </td>

                    {/* Payment */}
                    <td className="py-2.5 px-3.5">
                      <div className="space-y-0.5">
                        <PaymentBadge status={tkt.paymentStatus} size="sm" />
                      </div>
                    </td>

                    {/* Status with inline dropdown */}
                    <td className="py-2.5 px-3.5">
                      <div className="flex items-center gap-1.5">
                        <StatusBadge status={tkt.status} size="sm" />
                        <select
                          value={tkt.status}
                          onChange={(e) => handleStatusChange(tkt, e.target.value as LaundryStatus)}
                          className="text-[10px] py-1 px-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
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
                    <td className="py-2.5 px-3.5 text-[10px] text-slate-500 font-mono">
                      {tkt.createdAt}
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setActiveClaimStubTicket(tkt)}
                          className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="View Customer Claim Stub"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    <p className="font-bold text-xs text-slate-700">No laundry tickets match these filters</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {paymentFilter !== 'ALL' ? `Filtered by ${paymentFilter}. ` : ''}
                      {ticketStatusFilter !== 'ALL' ? `Stage: ${ticketStatusFilter}. ` : ''}
                    </p>
                    <div className="mt-2.5 flex items-center justify-center gap-2">
                      {ticketStatusFilter !== 'ALL' && (
                        <button
                          type="button"
                          onClick={() => setTicketStatusFilter('ALL')}
                          className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors"
                        >
                          Show All Stages
                        </button>
                      )}
                      {paymentFilter !== 'ALL' && (
                        <button
                          type="button"
                          onClick={() => setPaymentFilter('ALL')}
                          className="px-2.5 py-1 text-xs font-bold bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg cursor-pointer transition-colors"
                        >
                          Show All Payment Statuses
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Compact Cards View (Hidden on Desktop) */}
      <div className="md:hidden space-y-2">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((tkt) => (
            <div 
              key={tkt.id}
              className="bg-white rounded-xl p-2.5 border border-slate-200 shadow-2xs space-y-2 hover:border-slate-300 transition-colors"
            >
              {/* Row 1: Ticket No, Badges & Amount */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <button 
                    onClick={() => setActiveClaimStubTicket(tkt)}
                    className="font-mono font-extrabold text-xs text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md cursor-pointer transition-colors shrink-0"
                  >
                    {tkt.ticketNumber}
                  </button>
                  <span className="font-bold text-xs text-slate-800 truncate">{tkt.customerName}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="font-mono font-extrabold text-xs text-emerald-700">
                    ₱{tkt.totalAmount.toLocaleString()}
                  </span>
                  <PaymentBadge status={tkt.paymentStatus} size="sm" />
                </div>
              </div>

              {/* Row 2: Services subtitle & Weight */}
              <div className="text-[11px] text-slate-500 flex items-center justify-between gap-2">
                <span className="truncate">{tkt.items.map(i => i.name).join(', ')}</span>
                <span className="font-mono shrink-0 font-medium">{tkt.totalWeightKg}kg</span>
              </div>

              {/* Row 3: Status controller & Details trigger */}
              <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1 flex-1 min-w-0">
                  <StatusBadge status={tkt.status} size="sm" />
                  <select
                    value={tkt.status}
                    onChange={(e) => handleStatusChange(tkt, e.target.value as LaundryStatus)}
                    className="text-[11px] py-1 px-1.5 rounded-lg border border-slate-200 bg-slate-50 font-bold text-slate-700 flex-1 focus:outline-none cursor-pointer truncate"
                  >
                    <option value="RECEIVED">⚪ Received</option>
                    <option value="WASHING">🟡 Washing</option>
                    <option value="DRYING">🔵 Drying</option>
                    <option value="FOLDING">🟣 Folding</option>
                    <option value="READY">🟢 Ready</option>
                    <option value="COMPLETED">✅ Completed</option>
                  </select>
                </div>

                <button
                  onClick={() => setActiveClaimStubTicket(tkt)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-600 hover:text-slate-900 rounded-lg transition-colors cursor-pointer shrink-0 flex items-center justify-center"
                  title="View Claim Stub"
                  aria-label="View Claim Stub"
                >
                  <Eye size={15} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-slate-500 space-y-2">
            <p className="font-bold text-xs text-slate-700">No laundry tickets match these filters</p>
            <p className="text-[10px] text-slate-400">
              {paymentFilter !== 'ALL' ? `Payment: ${paymentFilter}. ` : ''}
              {ticketStatusFilter !== 'ALL' ? `Stage: ${ticketStatusFilter}. ` : ''}
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setPaymentFilter('ALL');
                  setTicketStatusFilter('ALL');
                }}
                className="px-3 py-1.5 text-xs font-bold bg-slate-900 text-white rounded-lg cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
