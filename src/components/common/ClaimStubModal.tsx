import React, { useState } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { StatusBadge, PaymentBadge } from './StatusBadge';
import { 
  X, 
  Copy, 
  Check, 
  Clock 
} from 'lucide-react';

export const ClaimStubModal: React.FC = () => {
  const { activeClaimStubTicket, setActiveClaimStubTicket } = useLaundry();
  const [copied, setCopied] = useState(false);

  if (!activeClaimStubTicket) return null;

  const ticket = activeClaimStubTicket;

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(ticket.ticketNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      id="claim-stub-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div 
        id="claim-stub-modal-card"
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
      >
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-slate-900 text-sm">
              ₱
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight text-white">TAPCARD Claim Stub</h3>
              <p className="text-[11px] text-slate-400">Official Customer Laundry Receipt</p>
            </div>
          </div>
          <button
            id="close-claim-stub-btn"
            onClick={() => setActiveClaimStubTicket(null)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Thermal Stub Content */}
        <div className="p-6 space-y-5 bg-gradient-to-b from-slate-50 to-white">
          {/* Highlighted Ticket ID banner */}
          <div className="bg-emerald-50 border-2 border-dashed border-emerald-400 rounded-xl p-4 text-center relative">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Give Ticket ID to Customer
            </span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
                {ticket.ticketNumber}
              </span>
              <button
                id="copy-ticket-id-btn"
                onClick={handleCopyTicket}
                className="p-2 rounded-lg bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-100 transition-colors"
                title="Copy Ticket ID"
              >
                {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
              </button>
            </div>
            <p className="text-xs text-emerald-700 mt-1 font-medium">
              Customer can enter <span className="font-bold font-mono">{ticket.ticketNumber}</span> on their phone to track live status!
            </p>
          </div>

          {/* Customer & Ticket Info */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 block text-[11px]">Customer Name</span>
              <span className="font-bold text-slate-800 text-sm">{ticket.customerName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Mobile Number</span>
              <span className="font-mono text-slate-700">{ticket.customerPhone}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Date & Time</span>
              <span className="text-slate-700">{ticket.createdAt}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Target Pickup</span>
              <span className="text-slate-800 font-semibold flex items-center gap-1">
                <Clock size={12} className="text-emerald-600" /> {ticket.estimatedReadyAt}
              </span>
            </div>
          </div>

          {/* Order Items Breakdown */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-100 px-3 py-2 font-semibold text-slate-700 flex justify-between border-b border-slate-200">
              <span>Service Details</span>
              <span>Amount</span>
            </div>
            <div className="divide-y divide-slate-100 bg-white">
              {ticket.items.map((item, idx) => (
                <div key={idx} className="px-3 py-2 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-slate-800 block">{item.name}</span>
                    <span className="text-slate-500 text-[11px]">
                      {item.quantity} {item.unitType} × ₱{item.unitPrice}
                      {item.specialInstructions ? ` (${item.specialInstructions})` : ''}
                    </span>
                  </div>
                  <span className="font-bold text-slate-900">₱{item.subtotal.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 px-3 py-2.5 border-t border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">Total</span>
                <PaymentBadge status={ticket.paymentStatus} size="sm" />
              </div>
              <span className="text-base font-extrabold text-emerald-700 font-mono">
                ₱{ticket.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Current Status */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-600 font-medium">Current Laundry Status:</span>
            <StatusBadge status={ticket.status} size="md" />
          </div>

          {/* Shop Notes */}
          <div className="text-[11px] text-slate-500 text-center space-y-0.5">
            <p className="font-medium text-slate-700">TAPCARD LAUNDRY SHOP</p>
            <p>0917-555-8921 · Open Daily 7:00 AM - 9:00 PM</p>
            <p className="text-[10px] text-slate-400">Please present this Ticket ID or Claim Stub upon collection.</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            id="close-claim-stub-footer-btn"
            onClick={() => setActiveClaimStubTicket(null)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 py-2.5 px-5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
          >
            Close Claim Stub
          </button>
        </div>
      </div>
    </div>
  );
};
