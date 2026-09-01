import React, { useState } from 'react';
import { 
  X, 
  Banknote, 
  Smartphone, 
  Check, 
  AlertCircle,
  Coins
} from 'lucide-react';
import { useLaundry } from '../../context/LaundryContext';
import { PaymentMethod } from '../../types';

export const PaymentSettlementModal: React.FC = () => {
  const { 
    activeSettlementTicket, 
    setActiveSettlementTicket,
    updateTicketPayment,
    updateTicketStatus,
    addToast
  } = useLaundry();

  const ticket = activeSettlementTicket;
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('CASH');

  if (!ticket) return null;

  const totalAmount = ticket.totalAmount;
  const amountPaidSoFar = ticket.amountPaid || 0;
  const remainingBalance = Math.max(0, totalAmount - amountPaidSoFar);

  const handleClose = () => {
    setActiveSettlementTicket(null);
  };

  // Settle Payment with chosen method (Cash / GCash) and mark Completed
  const handleSettleAndComplete = (method: PaymentMethod) => {
    // 1. Settle in full with chosen method
    updateTicketPayment(ticket.id, 'PAID', totalAmount, method);

    // 2. Mark order completed
    updateTicketStatus(
      ticket.id, 
      'COMPLETED', 
      `Completed & Paid in full (₱${totalAmount.toLocaleString()}) via ${method === 'GCASH' ? 'GCash' : 'Cash'}`
    );

    addToast(
      `✓ Ticket ${ticket.ticketNumber} Completed`,
      `Paid ₱${remainingBalance.toLocaleString()} via ${method === 'GCASH' ? 'GCash' : 'Cash'}. Logged into Payments table.`,
      'success'
    );

    setActiveSettlementTicket(null);
  };

  // Option to keep unpaid if customer is picking up on credit
  const handleKeepUnpaidAndComplete = () => {
    updateTicketStatus(
      ticket.id, 
      'COMPLETED', 
      `Order marked completed. Balance of ₱${remainingBalance.toLocaleString()} left as ${ticket.paymentStatus}.`
    );

    addToast(
      `Ticket ${ticket.ticketNumber} Completed`,
      `Marked completed. Balance ₱${remainingBalance.toLocaleString()} recorded in receivables.`,
      'warning'
    );

    setActiveSettlementTicket(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settle-payment-title"
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div>
            <h3 id="settle-payment-title" className="text-sm font-extrabold text-slate-900">
              Collect Payment
            </h3>
            <p className="text-[11px] text-slate-500">
              Ticket <span className="font-mono font-bold text-slate-800">{ticket.ticketNumber}</span> • {ticket.customerName}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Amount Due Card */}
          <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Balance to Collect
              </span>
              <span className="text-[11px] text-slate-300">
                Total: ₱{totalAmount.toLocaleString()} {amountPaidSoFar > 0 && `(Paid: ₱${amountPaidSoFar.toLocaleString()})`}
              </span>
            </div>
            <div className="text-2xl font-black font-mono text-emerald-400">
              ₱{remainingBalance.toLocaleString()}
            </div>
          </div>

          <p className="text-xs font-semibold text-slate-700 text-center">
            How is the customer paying?
          </p>

          {/* Quick Payment Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* CASH Button */}
            <button
              type="button"
              id="pay-cash-btn"
              onClick={() => handleSettleAndComplete('CASH')}
              className="p-3.5 rounded-xl border-2 border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs group"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                <Banknote size={20} />
              </div>
              <span className="text-sm font-extrabold">Cash</span>
              <span className="text-[10px] font-bold text-emerald-700">₱{remainingBalance.toLocaleString()}</span>
            </button>

            {/* GCASH Button */}
            <button
              type="button"
              id="pay-gcash-btn"
              onClick={() => handleSettleAndComplete('GCASH')}
              className="p-3.5 rounded-xl border-2 border-blue-600 bg-blue-50 hover:bg-blue-100 text-blue-950 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs group"
            >
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                <Smartphone size={20} />
              </div>
              <span className="text-sm font-extrabold">GCash</span>
              <span className="text-[10px] font-bold text-blue-700">₱{remainingBalance.toLocaleString()}</span>
            </button>
          </div>

          {/* Other options */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={handleKeepUnpaidAndComplete}
              className="text-slate-500 hover:text-amber-700 hover:underline cursor-pointer font-medium"
            >
              Keep Unpaid (On Account)
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-700 cursor-pointer font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
