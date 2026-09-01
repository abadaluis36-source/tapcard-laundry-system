import React from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { LaundryStatus } from '../../types';
import { 
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
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Washing & Drying */}
          <button
            type="button"
            onClick={() => handleSelectStatus('WASHING')}
            className={`p-3.5 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer active:scale-95 shadow-2xs ${
              ticketStatusFilter === 'WASHING'
                ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-500/30 text-amber-950 font-semibold'
                : 'border-amber-200 bg-amber-50/80 hover:bg-amber-100/80 text-amber-950'
            }`}
            title="Show Washing & Drying tickets"
          >
            <div className="flex items-center justify-between text-amber-700 text-[11px]">
              <span className="font-semibold truncate">Washing &amp; Drying</span>
              <RotateCw size={14} className="animate-spin" />
            </div>
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-amber-900 mt-2">
              {counts.washing}
            </span>
          </button>

          {/* Folding */}
          <button
            type="button"
            onClick={() => handleSelectStatus('FOLDING')}
            className={`p-3.5 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer active:scale-95 shadow-2xs ${
              ticketStatusFilter === 'FOLDING'
                ? 'bg-purple-100 border-purple-500 ring-2 ring-purple-500/30 text-purple-950 font-semibold'
                : 'border-purple-200 bg-purple-50/80 hover:bg-purple-100/80 text-purple-950'
            }`}
            title="Show Folding tickets"
          >
            <div className="flex items-center justify-between text-purple-700 text-[11px]">
              <span className="font-semibold truncate">Folding</span>
              <Layers size={14} />
            </div>
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-purple-900 mt-2">
              {counts.folding}
            </span>
          </button>

          {/* Ready */}
          <button
            type="button"
            onClick={() => handleSelectStatus('READY')}
            className={`p-3.5 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer active:scale-95 shadow-2xs ${
              ticketStatusFilter === 'READY'
                ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-500/30 text-emerald-950 font-semibold'
                : 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-950'
            }`}
            title="Show Ready tickets"
          >
            <div className="flex items-center justify-between text-emerald-700 text-[11px]">
              <span className="font-semibold truncate">Ready</span>
              <Sparkles size={14} />
            </div>
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-900 mt-2">
              {counts.ready}
            </span>
          </button>

          {/* Completed */}
          <button
            type="button"
            onClick={() => handleSelectStatus('COMPLETED')}
            className={`p-3.5 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer active:scale-95 shadow-2xs ${
              ticketStatusFilter === 'COMPLETED'
                ? 'bg-teal-100 border-teal-500 ring-2 ring-teal-500/30 text-teal-950 font-semibold'
                : 'border-teal-200 bg-teal-50 hover:bg-teal-100/80 text-teal-950'
            }`}
            title="Show Done tickets"
          >
            <div className="flex items-center justify-between text-teal-700 text-[11px]">
              <span className="font-semibold truncate">Done</span>
              <CheckCircle2 size={14} />
            </div>
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-teal-900 mt-2">
              {counts.completed}
            </span>
          </button>
        </div>
      </div>

      {/* Integrated Tickets Management UI */}
      <TicketManagement hideHeader={true} />
    </div>
  );
};



