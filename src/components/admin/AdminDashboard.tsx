import React from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { LaundryStatus } from '../../types';
import { 
  RotateCw, 
  Wind, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Layers
} from 'lucide-react';
import { TicketManagement } from './TicketManagement';

export const AdminDashboard: React.FC = () => {
  const { 
    tickets, 
    ticketStatusFilter, 
    setTicketStatusFilter 
  } = useLaundry();

  const counts = React.useMemo(() => {
    return {
      total: tickets.length,
      pending: tickets.filter(t => t.status === 'RECEIVED').length,
      washing: tickets.filter(t => t.status === 'WASHING').length,
      drying: tickets.filter(t => t.status === 'DRYING').length,
      folding: tickets.filter(t => t.status === 'FOLDING').length,
      ready: tickets.filter(t => t.status === 'READY').length,
      completed: tickets.filter(t => t.status === 'COMPLETED').length,
    };
  }, [tickets]);

  const handleToggleFilter = (status: LaundryStatus | 'ALL') => {
    if (ticketStatusFilter === status) {
      setTicketStatusFilter('ALL');
    } else {
      setTicketStatusFilter(status);
    }
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

      {/* Operational Queue Overview */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Operational Queue
            </h2>
            {ticketStatusFilter !== 'ALL' && (
              <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Filtered: {ticketStatusFilter} (click card again to unfilter)
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setTicketStatusFilter('ALL')}
            className={`text-xs font-mono px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              ticketStatusFilter === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title="Show all jobs"
          >
            {counts.total} Total Jobs
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
          {/* Pending Intake */}
          <button
            type="button"
            onClick={() => handleToggleFilter('RECEIVED')}
            className={`p-2.5 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer active:scale-95 shadow-2xs ${
              ticketStatusFilter === 'RECEIVED'
                ? 'bg-sky-100/90 border-sky-500 ring-2 ring-sky-500/30'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
            }`}
            title={ticketStatusFilter === 'RECEIVED' ? 'Click to unselect' : 'Filter by Pending'}
          >
            <div className="flex items-center justify-between text-slate-600 text-[10px] sm:text-[11px]">
              <span className="font-semibold truncate">Pending</span>
              <Clock size={12} />
            </div>
            <span className="text-lg sm:text-xl font-extrabold font-mono text-slate-800 mt-1">
              {counts.pending}
            </span>
          </button>

          {/* Washing */}
          <button
            type="button"
            onClick={() => handleToggleFilter('WASHING')}
            className={`p-2.5 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer active:scale-95 shadow-2xs ${
              ticketStatusFilter === 'WASHING'
                ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-500/30 text-amber-950'
                : 'border-amber-200 bg-amber-50/80 hover:bg-amber-100/80 text-amber-950'
            }`}
            title={ticketStatusFilter === 'WASHING' ? 'Click to unselect' : 'Filter by Washing'}
          >
            <div className="flex items-center justify-between text-amber-700 text-[10px] sm:text-[11px]">
              <span className="font-semibold truncate">Washing</span>
              <RotateCw size={12} className="animate-spin" />
            </div>
            <span className="text-lg sm:text-xl font-extrabold font-mono text-amber-900 mt-1">
              {counts.washing}
            </span>
          </button>

          {/* Drying */}
          <button
            type="button"
            onClick={() => handleToggleFilter('DRYING')}
            className={`p-2.5 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer active:scale-95 shadow-2xs ${
              ticketStatusFilter === 'DRYING'
                ? 'bg-sky-100 border-sky-500 ring-2 ring-sky-500/30 text-sky-950'
                : 'border-sky-200 bg-sky-50/80 hover:bg-sky-100/80 text-sky-950'
            }`}
            title={ticketStatusFilter === 'DRYING' ? 'Click to unselect' : 'Filter by Drying'}
          >
            <div className="flex items-center justify-between text-sky-700 text-[10px] sm:text-[11px]">
              <span className="font-semibold truncate">Drying</span>
              <Wind size={12} />
            </div>
            <span className="text-lg sm:text-xl font-extrabold font-mono text-sky-900 mt-1">
              {counts.drying}
            </span>
          </button>

          {/* Folding */}
          <button
            type="button"
            onClick={() => handleToggleFilter('FOLDING')}
            className={`p-2.5 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer active:scale-95 shadow-2xs ${
              ticketStatusFilter === 'FOLDING'
                ? 'bg-purple-100 border-purple-500 ring-2 ring-purple-500/30 text-purple-950'
                : 'border-purple-200 bg-purple-50/80 hover:bg-purple-100/80 text-purple-950'
            }`}
            title={ticketStatusFilter === 'FOLDING' ? 'Click to unselect' : 'Filter by Folding'}
          >
            <div className="flex items-center justify-between text-purple-700 text-[10px] sm:text-[11px]">
              <span className="font-semibold truncate">Folding</span>
              <Layers size={12} />
            </div>
            <span className="text-lg sm:text-xl font-extrabold font-mono text-purple-900 mt-1">
              {counts.folding}
            </span>
          </button>

          {/* Ready */}
          <button
            type="button"
            onClick={() => handleToggleFilter('READY')}
            className={`p-2.5 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer active:scale-95 shadow-2xs ${
              ticketStatusFilter === 'READY'
                ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-500/30 text-emerald-950'
                : 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-950'
            }`}
            title={ticketStatusFilter === 'READY' ? 'Click to unselect' : 'Filter by Ready'}
          >
            <div className="flex items-center justify-between text-emerald-700 text-[10px] sm:text-[11px]">
              <span className="font-semibold truncate">Ready</span>
              <Sparkles size={12} />
            </div>
            <span className="text-lg sm:text-xl font-extrabold font-mono text-emerald-900 mt-1">
              {counts.ready}
            </span>
          </button>

          {/* Completed */}
          <button
            type="button"
            onClick={() => handleToggleFilter('COMPLETED')}
            className={`p-2.5 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer active:scale-95 shadow-2xs ${
              ticketStatusFilter === 'COMPLETED'
                ? 'bg-teal-100 border-teal-500 ring-2 ring-teal-500/30 text-teal-950'
                : 'border-teal-200 bg-teal-50 hover:bg-teal-100/80 text-teal-950'
            }`}
            title={ticketStatusFilter === 'COMPLETED' ? 'Click to unselect' : 'Filter by Done'}
          >
            <div className="flex items-center justify-between text-teal-700 text-[10px] sm:text-[11px]">
              <span className="font-semibold truncate">Done</span>
              <CheckCircle2 size={12} />
            </div>
            <span className="text-lg sm:text-xl font-extrabold font-mono text-teal-900 mt-1">
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

