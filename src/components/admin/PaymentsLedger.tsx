import React from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { PaymentBadge } from '../common/StatusBadge';
import { 
  CheckCircle2, 
  AlertCircle,
  Download
} from 'lucide-react';

export const PaymentsLedger: React.FC = () => {
  const { payments } = useLaundry();

  // Exact figures from Section 13
  const todaySales = 8450;
  const paidTotal = 7850;
  const outstandingTotal = 600;

  return (
    <div id="payments-ledger-view" className="space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Payments & Counter Ledger
          </h1>
          <p className="text-xs text-slate-500">
            Real-time cash reconciliation, digital wallet transactions, and receivables
          </p>
        </div>

        <button
          onClick={() => alert('Exporting Payment Ledger CSV (Mock)')}
          className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl border border-slate-300 transition-all shadow-2xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download size={14} />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      {/* Financial Summary Cards (Section 13) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        
        {/* Today's Sales */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Today's Total Sales
          </span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            ₱{todaySales.toLocaleString()}
          </div>
        </div>

        {/* Paid Collected */}
        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center justify-between">
            <span>Paid & Collected</span>
            <CheckCircle2 size={14} className="text-emerald-600" />
          </span>
          <div className="text-2xl font-extrabold text-emerald-950 font-mono">
            ₱{paidTotal.toLocaleString()}
          </div>
        </div>

        {/* Outstanding Receivables */}
        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center justify-between">
            <span>Outstanding (Upon Pickup)</span>
            <AlertCircle size={14} className="text-amber-600" />
          </span>
          <div className="text-2xl font-extrabold text-amber-950 font-mono">
            ₱{outstandingTotal.toLocaleString()}
          </div>
        </div>

      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Ticket</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {payments.length > 0 ? (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {p.date}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {p.ticketNumber}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {p.customerName}
                    </td>
                    <td className="py-3 px-4 font-mono font-extrabold text-emerald-700 text-sm">
                      ₱{p.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <PaymentBadge status={p.paymentStatus} size="sm" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No payment entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
