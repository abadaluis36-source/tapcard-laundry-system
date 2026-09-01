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

  const handleFilterSelect = (status: LaundryStatus | 'ALL') => {
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
          <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Operational Queue
          </h2>
          <button
            type="button"
            onClick={() => handleFilterSelect('ALL')}
            className={`text-xs font-mono px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
              ticketStatusFilter === 'ALL'
                ? 'bg-slate-900 text-white font-bold'
                : 'text-slate-500 hover:text-emerald-700 hover:underline'
            }`}
            title="Click to view all jobs"
          >
            {counts.total} Total Jobs
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
          {/* Pending Intake */}
          <button
            type="button"
            onClick={() => handleFilterSelect('RECEIVED')}
            className={`p-2.5 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer active:scale-95 group shadow-2xs ${
              ticketStatusFilter === 'RECEIVED'
                ? 'bg-sky-100 border-sky-400 ring-2 ring-sky-400/20'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300'
            }`}
            title="Filter Tickets by Pending Intake (Received)"
          >
            <div className="flex items-center justify-between text-slate-500 group-hover:text-slate-800 text-[10px] sm:text-[11px]">
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
            onClick={() => handleFilterSelect('WASHING')}
            className={`p-2.5 rounded-xl border text-amber-950 flex flex-col justify-between text-left transition-all cursor-pointer active:scale-95 group shadow-2xs ${
              ticketStatusFilter === 'WASHING'
                ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-400/20'
                : 'bg-amber-50/80 hover:bg-amber-100/90 border-amber-200 hover:border-amber-300'
            }`}
            title="Filter Tickets by Washing"
          >
            <div className="flex items-center justify-between text-amber-700 group-hover:text-amber-900 text-[10px] sm:text-[11px]">
              <span className="font-semibold truncate">Washing</span>
              <RotateCw size={12} className="animate-spin" />
            </div>
            <span className="text-lg sm:text-xl font-extrabold font-mono mt-1">
              {counts.washing}
            </span>
          </button>

          {/* Drying */}
          <button
            type="button"
            onClick={() => handleFilterSelect('DRYING')}
            className={`p-2.5 rounded-xl border text-sky-950 flex flex-col justify-between text-left transition-all cursor-pointer active:scale-95 group shadow-2xs ${
              ticketStatusFilter === 'DRYING'
                ? 'bg-sky-100 border-sky-400 ring-2 ring-sky-400/20'
                : 'bg-sky-50/80 hover:bg-sky-100/90 border-sky-200 hover:border-sky-300'
            }`}
            title="Filter Tickets by Drying"
          >
            <div className="flex items-center justify-between text-sky-700 group-hover:text-sky-900 text-[10px] sm:text-[11px]">
              <span className="font-semibold truncate">Drying</span>
              <Wind size={12} />
            </div>
            <span className="text-lg sm:text-xl font-extrabold font-mono mt-1">
              {counts.drying}
            </span>
          </button>

          {/* Folding */}
          <button
            type="button"
            onClick={() => handleFilterSelect('FOLDING')}
            className={`p-2.5 rounded-xl border text-purple-950 flex flex-col justify-between text-left transition-all cursor-pointer active:scale-95 group shadow-2xs ${
              ticketStatusFilter === 'FOLDING'
                ? 'bg-purple-100 border-purple-400 ring-2 ring-purple-400/20'
                : 'bg-purple-50/80 hover:bg-purple-100/90 border-purple-200 hover:border-purple-300'
            }`}
            title="Filter Tickets by Folding"
          >
            <div className="flex items-center justify-between text-purple-700 group-hover:text-purple-900 text-[10px] sm:text-[11px]">
              <span className="font-semibold truncate">Folding</span>
              <Layers size={12} />
            </div>
            <span className="text-lg sm:text-xl font-extrabold font-mono mt-1">
              {counts.folding}
            </span>
          </button>

          {/* Ready */}
          <button
            type="button"
            onClick={() => handleFilterSelect('READY')}
            className={`p-2.5 rounded-xl border text-emerald-950 flex flex-col justify-between text-left transition-all cursor-pointer active:scale-95 group shadow-2xs ${
              ticketStatusFilter === 'READY'
                ? 'bg-emerald-100 border-emerald-400 ring-2 ring-emerald-400/20'
                : 'bg-emerald-50 hover:bg-emerald-100/90 border-emerald-300 hover:border-emerald-400'
            }`}
            title="Filter Tickets by Ready"
          >
            <div className="flex items-center justify-between text-emerald-700 group-hover:text-emerald-900 text-[10px] sm:text-[11px]">
              <span className="font-semibold truncate">Ready</span>
              <Sparkles size={12} />
            </div>
            <span className="text-lg sm:text-xl font-extrabold font-mono mt-1">
              {counts.ready}
            </span>
          </button>

          {/* Completed */}
          <button
            type="button"
            onClick={() => handleFilterSelect('COMPLETED')}
            className={`p-2.5 rounded-xl border text-teal-950 flex flex-col justify-between text-left transition-all cursor-pointer active:scale-95 group shadow-2xs ${
              ticketStatusFilter === 'COMPLETED'
                ? 'bg-teal-100 border-teal-400 ring-2 ring-teal-400/20'
                : 'bg-teal-50 hover:bg-teal-100/90 border-teal-200 hover:border-teal-300'
            }`}
            title="Filter Tickets by Completed"
          >
            <div className="flex items-center justify-between text-teal-700 group-hover:text-teal-900 text-[10px] sm:text-[11px]">
              <span className="font-semibold truncate">Done</span>
              <CheckCircle2 size={12} />
            </div>
            <span className="text-lg sm:text-xl font-extrabold font-mono mt-1">
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
