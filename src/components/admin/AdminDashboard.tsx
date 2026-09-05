import React from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { LaundryStatus } from '../../types';
import { 
  Inbox,
  RotateCw, 
  Sparkles, 
  CheckCircle2, 
  Layers
} from 'lucide-react';
import { TicketManagement } from './TicketManagement';

export const AdminDashboard: React.FC = () => {
  const { 
    tickets, 
    ticketStatusFilter,
    setTicketStatusFilter,
    setAdminTab 
  } = useLaundry();

  const counts = React.useMemo(() => {
    return {
      total: tickets.length,
      received: tickets.filter(t => t.status === 'RECEIVED').length,
      washing: tickets.filter(t => t.status === 'WASHING').length,
      folding: tickets.filter(t => t.status === 'FOLDING').length,
      ready: tickets.filter(t => t.status === 'READY').length,
      completed: tickets.filter(t => t.status === 'COMPLETED').length,
    };
  }, [tickets]);

  const handleSelectStatus = (status: LaundryStatus | 'ALL') => {
    setTicketStatusFilter(status);
  };

  return (
    <div id="admin-dashboard-view" className="space-y-4">
      {/* Header matching Payments Ledger style */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Admin Dashboard Overview
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time workflow pipeline, operational queues, and live laundry ticket processing
        </p>
      </div>

      {/* Operational Queue Overview KPI Cards */}
      <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Operational Queue
          </h2>
          <button
            type="button"
            onClick={() => handleSelectStatus('ALL')}
            className={`text-xs font-mono px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              ticketStatusFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title="Show all jobs"
          >
            {counts.total} Total Jobs
          </button>
        </div>

        {/* On Top: Completed Big KPI (Summary Only / Non-Clickable) */}
        <div
          className="w-full p-3.5 sm:p-4 rounded-xl border border-teal-200/70 bg-teal-50/40 flex items-center justify-between shadow-2xs select-none"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border bg-teal-100/80 text-teal-700 border-teal-200">
              <CheckCircle2 size={22} className="text-teal-700" />
            </div>
            <div className="text-left">
              <div className="text-sm sm:text-base font-extrabold text-teal-950">
                Completed
              </div>
              <div className="text-xs text-teal-700/80 font-medium">
                Finished
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-teal-900">
              {counts.completed}
            </span>
          </div>
        </div>

        {/* The Four Big Operational Stage Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {/* 1. Received */}
          <button
            type="button"
            onClick={() => handleSelectStatus('RECEIVED')}
            className={`p-3.5 sm:p-4 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer active:scale-95 shadow-2xs ${
              ticketStatusFilter === 'RECEIVED'
                ? 'bg-sky-100 border-sky-500 ring-2 ring-sky-500/30 text-sky-950 font-semibold shadow-xs'
                : 'bg-sky-50/30 border-sky-200/70 hover:bg-sky-50/70 hover:border-sky-300 text-slate-800'
            }`}
            title="Filter Received tickets"
          >
            <div className="flex items-center justify-between text-sky-800">
              <span className="font-bold text-xs sm:text-sm truncate">Received</span>
              <Inbox size={18} className={`shrink-0 transition-transform ${
                ticketStatusFilter === 'RECEIVED' ? 'text-sky-700 scale-110' : 'text-sky-500'
              }`} />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${
                ticketStatusFilter === 'RECEIVED' ? 'text-sky-950' : 'text-sky-900'
              }`}>
                {counts.received}
              </span>
              <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded transition-colors ${
                ticketStatusFilter === 'RECEIVED' ? 'bg-sky-200 text-sky-900 font-bold' : 'bg-sky-100/70 text-sky-700'
              }`}>Pending</span>
            </div>
          </button>

          {/* 2. Washing & Drying */}
          <button
            type="button"
            onClick={() => handleSelectStatus('WASHING')}
            className={`p-3.5 sm:p-4 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer active:scale-95 shadow-2xs ${
              ticketStatusFilter === 'WASHING'
                ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-500/30 text-amber-950 font-semibold shadow-xs'
                : 'bg-amber-50/30 border-amber-200/70 hover:bg-amber-50/70 hover:border-amber-300 text-slate-800'
            }`}
            title="Filter Washing & Drying tickets"
          >
            <div className="flex items-center justify-between text-amber-800">
              <span className="font-bold text-xs sm:text-sm truncate sm:hidden">W &amp; Drying</span>
              <span className="font-bold text-xs sm:text-sm truncate hidden sm:inline">Washing &amp; Drying</span>
              <RotateCw size={18} className={`shrink-0 transition-all ${
                ticketStatusFilter === 'WASHING' ? 'text-amber-700 animate-spin' : 'text-amber-500'
              }`} />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${
                ticketStatusFilter === 'WASHING' ? 'text-amber-950' : 'text-amber-900'
              }`}>
                {counts.washing}
              </span>
              <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded transition-colors ${
                ticketStatusFilter === 'WASHING' ? 'bg-amber-200 text-amber-900 font-bold' : 'bg-amber-100/70 text-amber-700'
              }`}>Active</span>
            </div>
          </button>

          {/* 3. Folding */}
          <button
            type="button"
            onClick={() => handleSelectStatus('FOLDING')}
            className={`p-3.5 sm:p-4 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer active:scale-95 shadow-2xs ${
              ticketStatusFilter === 'FOLDING'
                ? 'bg-purple-100 border-purple-500 ring-2 ring-purple-500/30 text-purple-950 font-semibold shadow-xs'
                : 'bg-purple-50/30 border-purple-200/70 hover:bg-purple-50/70 hover:border-purple-300 text-slate-800'
            }`}
            title="Filter Folding tickets"
          >
            <div className="flex items-center justify-between text-purple-800">
              <span className="font-bold text-xs sm:text-sm truncate">Folding</span>
              <Layers size={18} className={`shrink-0 transition-transform ${
                ticketStatusFilter === 'FOLDING' ? 'text-purple-700 scale-110' : 'text-purple-500'
              }`} />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${
                ticketStatusFilter === 'FOLDING' ? 'text-purple-950' : 'text-purple-900'
              }`}>
                {counts.folding}
              </span>
              <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded transition-colors ${
                ticketStatusFilter === 'FOLDING' ? 'bg-purple-200 text-purple-900 font-bold' : 'bg-purple-100/70 text-purple-700'
              }`}>Press</span>
            </div>
          </button>

          {/* 4. Ready */}
          <button
            type="button"
            onClick={() => handleSelectStatus('READY')}
            className={`p-3.5 sm:p-4 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer active:scale-95 shadow-2xs ${
              ticketStatusFilter === 'READY'
                ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-500/30 text-emerald-950 font-semibold shadow-xs'
                : 'bg-emerald-50/30 border-emerald-200/70 hover:bg-emerald-50/70 hover:border-emerald-300 text-slate-800'
            }`}
            title="Filter Ready tickets"
          >
            <div className="flex items-center justify-between text-emerald-800">
              <span className="font-bold text-xs sm:text-sm truncate">Ready</span>
              <Sparkles size={18} className={`shrink-0 transition-transform ${
                ticketStatusFilter === 'READY' ? 'text-emerald-700 scale-110 animate-pulse' : 'text-emerald-500'
              }`} />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${
                ticketStatusFilter === 'READY' ? 'text-emerald-950' : 'text-emerald-900'
              }`}>
                {counts.ready}
              </span>
              <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded transition-colors ${
                ticketStatusFilter === 'READY' ? 'bg-emerald-200 text-emerald-900 font-bold' : 'bg-emerald-100/70 text-emerald-700'
              }`}>Waiting</span>
            </div>
          </button>
        </div>
      </div>

      {/* Integrated Tickets Management UI */}
      <TicketManagement hideHeader={true} />
    </div>
  );
};



