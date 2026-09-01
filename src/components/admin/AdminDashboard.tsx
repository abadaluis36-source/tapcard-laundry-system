import React, { useState } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { StatusBadge, PaymentBadge } from '../common/StatusBadge';
import { LaundryStatus, Ticket } from '../../types';
import { 
  ShoppingBag, 
  RotateCw, 
  Wind, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  PlusCircle, 
  Eye, 
  ChevronRight,
  Search,
  Filter,
  Layers,
  Store,
  Play
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    tickets, 
    todayRevenue, 
    monthlyRevenue, 
    setAdminTab,
    setIsCreateTicketOpen,
    setActiveDetailTicket,
    setActiveClaimStubTicket,
    updateTicketStatus,
    setTicketStatusFilter
  } = useLaundry();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'WASHING' | 'DRYING' | 'READY'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Status counts matching exact spec: 47 Orders, 15 Pending, 8 Washing, 6 Drying, 9 Ready, 32 Completed
  const stats = {
    todayOrders: 47,
    pending: 15,
    washing: 8,
    drying: 6,
    ready: 9,
    completed: 32
  };

  const navigateToCategory = (status: LaundryStatus | 'ALL') => {
    setTicketStatusFilter(status);
    setAdminTab('tickets');
  };

  // Filter active laundry
  const activeTickets = tickets.filter(t => {
    const isNotDone = t.status !== 'COMPLETED' && t.status !== 'CANCELLED';
    const matchesSearch = 
      t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerPhone.includes(searchQuery);

    if (activeFilter === 'ALL') return isNotDone && matchesSearch;
    if (activeFilter === 'WASHING') return t.status === 'WASHING' && matchesSearch;
    if (activeFilter === 'DRYING') return t.status === 'DRYING' && matchesSearch;
    if (activeFilter === 'READY') return t.status === 'READY' && matchesSearch;
    return isNotDone && matchesSearch;
  });

  // Next status transition map for quick 1-click progression
  const getNextStatus = (current: LaundryStatus): LaundryStatus | null => {
    switch (current) {
      case 'RECEIVED': return 'WASHING';
      case 'WASHING': return 'DRYING';
      case 'DRYING': return 'FOLDING';
      case 'FOLDING': return 'READY';
      case 'READY': return 'COMPLETED';
      default: return null;
    }
  };

  return (
    <div id="admin-dashboard-view" className="space-y-6">
      
      {/* Top Banner with Quick POS Action */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
              Live Counter Operations
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Tapcard Laundry Shop Dashboard
          </h1>
          <p className="text-xs text-slate-300">
            Real-time shop floor intake, washing machines queue, and pickup management.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="dash-create-ticket-btn"
            onClick={() => {
              setAdminTab('create-ticket');
              setIsCreateTicketOpen(true);
            }}
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <PlusCircle size={16} />
            <span>+ CREATE NEW TICKET</span>
          </button>
        </div>
      </div>

      {/* Section 4: Revenue & Overview Top KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Today's Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Today's Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              ₱
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            ₱{todayRevenue.toLocaleString()}
          </div>
        </div>

        {/* This Month's Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">This Month</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
              <TrendingUp size={14} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            ₱{monthlyRevenue.toLocaleString()}
          </div>
        </div>

        {/* Today's Total Orders */}
        <button
          type="button"
          onClick={() => navigateToCategory('ALL')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1 text-left hover:border-sky-300 hover:bg-sky-50/20 transition-all cursor-pointer group"
          title="Click to view all tickets"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider group-hover:text-sky-700">Today's Orders</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <ShoppingBag size={14} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {stats.todayOrders}
          </div>
        </button>

        {/* Ready for Pickup */}
        <button
          type="button"
          onClick={() => navigateToCategory('READY')}
          className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 shadow-2xs space-y-1 text-left hover:border-emerald-400 hover:bg-emerald-100/60 transition-all cursor-pointer group"
          title="Click to view Ready for Pickup tickets"
        >
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-xs font-bold uppercase tracking-wider group-hover:text-emerald-900">Ready for Pickup</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
              <Sparkles size={14} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-950 font-mono">
            {stats.ready}
          </div>
        </button>

      </div>

      {/* Overview Pipeline Chips (Section 4 Overview) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Operational Queue Overview
          </h2>
          <button
            type="button"
            onClick={() => navigateToCategory('ALL')}
            className="text-xs text-slate-500 hover:text-emerald-700 font-mono hover:underline cursor-pointer"
            title="Click to view all jobs in Tickets"
          >
            47 Total Jobs
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          
          {/* Pending Intake */}
          <button
            type="button"
            onClick={() => navigateToCategory('RECEIVED')}
            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 flex flex-col justify-between text-left transition-all cursor-pointer active:scale-95 group shadow-2xs hover:shadow-xs"
            title="Filter Tickets by Pending Intake (Received)"
          >
            <div className="flex items-center justify-between text-slate-500 group-hover:text-slate-800 text-[11px]">
              <span className="font-semibold">Pending Intake</span>
              <Clock size={13} />
            </div>
            <span className="text-xl font-extrabold font-mono text-slate-800 mt-1">15</span>
          </button>

          {/* Washing */}
          <button
            type="button"
            onClick={() => navigateToCategory('WASHING')}
            className="p-3 rounded-xl bg-amber-50/80 hover:bg-amber-100/90 border border-amber-200 hover:border-amber-300 text-amber-950 flex flex-col justify-between text-left transition-all cursor-pointer active:scale-95 group shadow-2xs hover:shadow-xs"
            title="Filter Tickets by Washing"
          >
            <div className="flex items-center justify-between text-amber-700 group-hover:text-amber-900 text-[11px]">
              <span className="font-semibold">Washing</span>
              <RotateCw size={13} className="animate-spin" />
            </div>
            <span className="text-xl font-extrabold font-mono mt-1">{stats.washing}</span>
          </button>

          {/* Drying */}
          <button
            type="button"
            onClick={() => navigateToCategory('DRYING')}
            className="p-3 rounded-xl bg-sky-50/80 hover:bg-sky-100/90 border border-sky-200 hover:border-sky-300 text-sky-950 flex flex-col justify-between text-left transition-all cursor-pointer active:scale-95 group shadow-2xs hover:shadow-xs"
            title="Filter Tickets by Drying"
          >
            <div className="flex items-center justify-between text-sky-700 group-hover:text-sky-900 text-[11px]">
              <span className="font-semibold">Drying</span>
              <Wind size={13} />
            </div>
            <span className="text-xl font-extrabold font-mono mt-1">{stats.drying}</span>
          </button>

          {/* Folding */}
          <button
            type="button"
            onClick={() => navigateToCategory('FOLDING')}
            className="p-3 rounded-xl bg-purple-50/80 hover:bg-purple-100/90 border border-purple-200 hover:border-purple-300 text-purple-950 flex flex-col justify-between text-left transition-all cursor-pointer active:scale-95 group shadow-2xs hover:shadow-xs"
            title="Filter Tickets by Folding"
          >
            <div className="flex items-center justify-between text-purple-700 group-hover:text-purple-900 text-[11px]">
              <span className="font-semibold">Folding</span>
              <Layers size={13} />
            </div>
            <span className="text-xl font-extrabold font-mono mt-1">4</span>
          </button>

          {/* Ready */}
          <button
            type="button"
            onClick={() => navigateToCategory('READY')}
            className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-300 hover:border-emerald-400 text-emerald-950 flex flex-col justify-between text-left transition-all cursor-pointer active:scale-95 group shadow-2xs hover:shadow-xs"
            title="Filter Tickets by Ready"
          >
            <div className="flex items-center justify-between text-emerald-700 group-hover:text-emerald-900 text-[11px]">
              <span className="font-semibold">Ready</span>
              <Sparkles size={13} />
            </div>
            <span className="text-xl font-extrabold font-mono mt-1">{stats.ready}</span>
          </button>

          {/* Completed */}
          <button
            type="button"
            onClick={() => navigateToCategory('COMPLETED')}
            className="p-3 rounded-xl bg-teal-50 hover:bg-teal-100/90 border border-teal-200 hover:border-teal-300 text-teal-950 flex flex-col justify-between text-left transition-all cursor-pointer active:scale-95 group shadow-2xs hover:shadow-xs"
            title="Filter Tickets by Completed"
          >
            <div className="flex items-center justify-between text-teal-700 group-hover:text-teal-900 text-[11px]">
              <span className="font-semibold">Completed</span>
              <CheckCircle2 size={13} />
            </div>
            <span className="text-xl font-extrabold font-mono mt-1">{stats.completed}</span>
          </button>

        </div>
      </div>

      {/* Section 4: Active Laundry List & Quick Status Controller */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        
        {/* Active Laundry Header & Search */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-extrabold text-base text-slate-900 tracking-tight">
              Active Laundry Orders
            </h2>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search ticket, name, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-56"
              />
            </div>

            {/* Quick Filter tabs */}
            <div className="bg-slate-100 p-0.5 rounded-xl border border-slate-200 flex text-xs font-semibold overflow-x-auto scrollbar-none shrink-0">
              {(['ALL', 'WASHING', 'DRYING', 'READY'] as const).map((flt) => (
                <button
                  key={flt}
                  onClick={() => setActiveFilter(flt)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-all whitespace-nowrap ${
                    activeFilter === flt ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500'
                  }`}
                >
                  {flt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Laundry Cards / Table */}
        <div className="divide-y divide-slate-100">
          {activeTickets.length > 0 ? (
            activeTickets.map((ticket) => {
              const nextStatus = getNextStatus(ticket.status);

              return (
                <div 
                  key={ticket.id} 
                  className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  {/* Left: Ticket ID, Customer, Services */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div 
                      onClick={() => setActiveDetailTicket(ticket)}
                      className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono font-extrabold text-sm shrink-0 cursor-pointer hover:bg-slate-800 transition-colors shadow-2xs"
                    >
                      {ticket.ticketNumber}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span 
                          onClick={() => setActiveDetailTicket(ticket)}
                          className="font-bold text-sm text-slate-900 hover:text-emerald-600 cursor-pointer truncate"
                        >
                          {ticket.customerName}
                        </span>
                        <PaymentBadge status={ticket.paymentStatus} size="sm" />
                      </div>

                      <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="font-semibold text-slate-700">
                          {ticket.items.map(i => i.name).join(', ')}
                        </span>
                        <span>•</span>
                        <span className="font-mono">{ticket.totalWeightKg}kg</span>
                        <span>•</span>
                        <span className="font-mono font-bold text-emerald-700">₱{ticket.totalAmount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status badge & Quick Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <StatusBadge status={ticket.status} size="md" />

                    {/* Fast 1-Click Status Increment Button */}
                    {nextStatus && (
                      <button
                        id={`quick-advance-status-${ticket.id}`}
                        onClick={() => updateTicketStatus(ticket.id, nextStatus)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-colors"
                        title={`Advance status to ${nextStatus}`}
                      >
                        <span>→ {nextStatus}</span>
                      </button>
                    )}

                    {/* View Claim Stub Action */}
                    <button
                      onClick={() => setActiveClaimStubTicket(ticket)}
                      className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="View Customer Claim Stub"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="text-sm font-bold text-slate-700">No Active Laundry in Queue</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                All tickets are completed or no results match your current search.
              </p>
            </div>
          )}
        </div>

        {/* View All Tickets Link */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={() => setAdminTab('tickets')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
          >
            <span>View and filter all {tickets.length} tickets in database</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

    </div>
  );
};
