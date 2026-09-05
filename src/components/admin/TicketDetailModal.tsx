import React, { useState, useEffect } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { LaundryStatus, PaymentMethod, PaymentStatus, Ticket } from '../../types';
import { StatusBadge, PaymentBadge } from '../common/StatusBadge';
import { 
  X, 
  Printer, 
  Inbox,
  RotateCw, 
  Wind, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  User, 
  Phone, 
  CreditCard, 
  FileText, 
  Check,
  ChevronRight,
  Send,
  AlertCircle
} from 'lucide-react';

export const TicketDetailModal: React.FC = () => {
  const { 
    activeDetailTicket, 
    setActiveDetailTicket, 
    updateTicketStatus, 
    updateTicketPayment,
    setActiveClaimStubTicket,
    setActiveSettlementTicket 
  } = useLaundry();

  const [customNote, setCustomNote] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showPaymentEditor, setShowPaymentEditor] = useState(false);
  const [editPaymentStatus, setEditPaymentStatus] = useState<PaymentStatus>(activeDetailTicket?.paymentStatus || 'PAID');
  const [editPaymentMethod, setEditPaymentMethod] = useState<PaymentMethod>(activeDetailTicket?.paymentMethod || 'CASH');

  useEffect(() => {
    if (activeDetailTicket) {
      setEditPaymentStatus(activeDetailTicket.paymentStatus);
      setEditPaymentMethod(activeDetailTicket.paymentMethod);
      setShowPaymentEditor(false);
    }
  }, [activeDetailTicket]);

  if (!activeDetailTicket) return null;

  const ticket = activeDetailTicket;

  const STAGES: { status: LaundryStatus; label: string; icon: any; color: string; desc: string }[] = [
    { status: 'RECEIVED', label: 'ORDER RECEIVED', icon: Inbox, color: 'blue', desc: 'Order logged & queued' },
    { status: 'WASHING', label: 'WASHING & DRYING', icon: RotateCw, color: 'amber', desc: 'In washing & drying machine' },
    { status: 'FOLDING', label: 'FOLDING', icon: Layers, color: 'purple', desc: 'Steam press & folding' },
    { status: 'READY', label: 'READY FOR PICKUP', icon: Sparkles, color: 'emerald', desc: 'Bagged on rack' },
    { status: 'COMPLETED', label: 'COMPLETED', icon: CheckCircle2, color: 'teal', desc: 'Picked up & paid' },
  ];

  const getStageIndex = (st: LaundryStatus) => {
    switch (st) {
      case 'RECEIVED': return 0;
      case 'WASHING': return 1;
      case 'FOLDING': return 2;
      case 'READY': return 3;
      case 'COMPLETED': return 4;
      default: return 0;
    }
  };

  const currentStageIndex = getStageIndex(ticket.status);

  const handleUpdateStatus = (newStatus: LaundryStatus) => {
    if (newStatus === 'COMPLETED' && (ticket.paymentStatus === 'UNPAID' || ticket.paymentStatus === 'PARTIAL')) {
      setActiveSettlementTicket(ticket);
      return;
    }
    setIsUpdatingStatus(true);
    updateTicketStatus(ticket.id, newStatus, customNote || undefined);
    setCustomNote('');
    setTimeout(() => setIsUpdatingStatus(false), 300);
  };

  const handleSavePayment = () => {
    const amountPaid = editPaymentStatus === 'PAID' ? ticket.totalAmount : editPaymentStatus === 'UNPAID' ? 0 : Math.floor(ticket.totalAmount / 2);
    updateTicketPayment(ticket.id, editPaymentStatus, amountPaid, editPaymentMethod);
    setShowPaymentEditor(false);
  };

  return (
    <div 
      id="ticket-detail-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div 
        id="ticket-detail-card"
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-mono font-extrabold text-sm shadow-xs">
              {ticket.ticketNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">Ticket #{ticket.ticketNumber}</h3>
                <StatusBadge status={ticket.status} size="sm" />
              </div>
              <p className="text-xs text-slate-400">Created: {ticket.createdAt}</p>
            </div>
          </div>

          <button
            id="close-ticket-detail-btn"
            onClick={() => setActiveDetailTicket(null)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Top Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] font-medium">Customer</span>
              <span className="font-bold text-slate-900 text-sm block truncate">{ticket.customerName}</span>
              <span className="text-[11px] text-slate-500 font-mono">{ticket.customerPhone}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] font-medium">Weight / Bags</span>
              <span className="font-bold text-slate-900 text-sm block font-mono">{ticket.totalWeightKg} kg</span>
              <span className="text-[11px] text-slate-500">{ticket.bagCount} bag(s)</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] font-medium">Total Price</span>
              <span className="font-extrabold text-emerald-700 text-sm block font-mono">₱{ticket.totalAmount.toLocaleString()}</span>
              <div className="flex items-center gap-1 mt-0.5">
                <PaymentBadge status={ticket.paymentStatus} size="sm" />
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] font-medium">Estimated Ready</span>
              <span className="font-bold text-slate-800 text-xs block">{ticket.estimatedReadyAt}</span>
              <span className="text-[10px] text-slate-500">Staff: {ticket.staffName}</span>
            </div>
          </div>

          {/* Section 7: Current Status & 6-Step Visual Progress Stepper */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Laundry Progress Pipeline
              </label>
              <span className="text-xs font-bold text-slate-600">
                Current: <strong className="text-emerald-700">{ticket.status.replace('_', ' ')}</strong>
              </span>
            </div>

            {/* Step Indicators Bar */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {STAGES.map((stg, idx) => {
                const isPast = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const Icon = stg.icon;

                return (
                  <div
                    key={stg.status}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-between transition-all ${
                      isCurrent
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20 font-bold shadow-xs'
                        : isPast
                          ? 'border-slate-300 bg-slate-100/80 text-slate-700 font-semibold'
                          : 'border-slate-200 bg-white text-slate-400'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-1 text-xs ${
                      isCurrent
                        ? 'bg-emerald-600 text-white'
                        : isPast
                          ? 'bg-slate-700 text-white'
                          : 'bg-slate-100 text-slate-400'
                    }`}>
                      {isPast ? <Check size={14} /> : <Icon size={14} />}
                    </div>
                    <span className="text-[10px] uppercase font-bold leading-tight line-clamp-1">
                      {stg.label.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-slate-500 mt-0.5">
                      {isPast ? 'Done' : isCurrent ? 'Active' : `Step ${idx+1}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 8: Status Update Experience Buttons */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Quick Status Transition (Staff Action)
              </label>
              <span className="text-[11px] text-slate-500">1-click automated notification</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STAGES.map((stg) => {
                const isCurrent = ticket.status === stg.status;
                const IconDeep = stg.icon;

                return (
                  <button
                    key={stg.status}
                    id={`update-status-btn-${stg.status.toLowerCase()}`}
                    type="button"
                    onClick={() => handleUpdateStatus(stg.status)}
                    disabled={isUpdatingStatus}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all text-left ${
                      isCurrent
                        ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-emerald-400'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 hover:border-slate-400 shadow-2xs'
                    }`}
                  >
                    <IconDeep size={15} className={isCurrent ? 'text-emerald-400' : 'text-slate-500'} />
                    <span className="truncate">{stg.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Optional note for status history */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
              <input
                type="text"
                placeholder="Optional remark (e.g. Rack A-12, Washer #2 loaded)..."
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-slate-500 shrink-0">Logged in audit history</span>
            </div>
          </div>

          {/* Service Items & Specs */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Order Breakdown & Services
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-100 px-3.5 py-2 font-bold text-slate-700 flex justify-between">
                <span>Service Description</span>
                <span>Subtotal</span>
              </div>
              <div className="divide-y divide-slate-100 bg-white">
                {(ticket.items || []).map((item, idx) => (
                  <div key={idx} className="px-3.5 py-2.5 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-800 block">{item.name}</span>
                      <span className="text-slate-500 text-[11px]">
                        {item.quantity} {item.unitType} × ₱{item.unitPrice}
                        {item.specialInstructions ? ` · Instructions: ${item.specialInstructions}` : ''}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">₱{item.subtotal.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detergent & Fragrance specs */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[11px]">Detergent</span>
                <span className="font-semibold text-slate-800">{ticket.detergentOption || 'Ariel Professional'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Conditioner Fragrance</span>
                <span className="font-semibold text-slate-800">{ticket.fragranceOption || 'Downy Mystique'}</span>
              </div>
            </div>
          </div>

          {/* Payment & Settlement Panel */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold uppercase text-slate-800 text-xs">Payment Information</span>
              <div className="flex items-center gap-2">
                {ticket.paymentStatus !== 'PAID' && (
                  <button
                    type="button"
                    onClick={() => setActiveSettlementTicket(ticket)}
                    className="px-2.5 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer shadow-2xs"
                  >
                    Settle & Settle Balance
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowPaymentEditor(!showPaymentEditor)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 underline cursor-pointer"
                >
                  {showPaymentEditor ? 'Cancel' : 'Edit Manually'}
                </button>
              </div>
            </div>

            {showPaymentEditor ? (
              <div className="p-3 bg-white rounded-lg border border-slate-300 space-y-3">
                <div className={editPaymentStatus === 'PAID' ? 'grid grid-cols-2 gap-2' : 'space-y-2'}>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Payment Status</label>
                    <select
                      value={editPaymentStatus}
                      onChange={(e) => setEditPaymentStatus(e.target.value as PaymentStatus)}
                      className="w-full px-2 py-1.5 text-xs rounded border border-slate-300"
                    >
                      <option value="PAID">PAID</option>
                      <option value="UNPAID">UNPAID</option>
                    </select>
                  </div>
                  {editPaymentStatus === 'PAID' && (
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Method</label>
                      <select
                        value={editPaymentMethod}
                        onChange={(e) => setEditPaymentMethod(e.target.value as PaymentMethod)}
                        className="w-full px-2 py-1.5 text-xs rounded border border-slate-300"
                      >
                        <option value="CASH">CASH</option>
                        <option value="GCASH">GCASH</option>
                        <option value="MAYA">MAYA</option>
                      </select>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSavePayment}
                  className="w-full py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Save Payment Update
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <PaymentBadge status={ticket.paymentStatus} size="md" />
                  <span className="text-slate-600 font-medium font-mono">Method: {ticket.paymentMethod}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 mr-2">Paid: ₱{ticket.amountPaid} / ₱{ticket.totalAmount}</span>
                </div>
              </div>
            )}
          </div>

          {/* Audit Timestamp History Log */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Status Change History & Staff Logs
            </h4>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {(ticket.statusHistory || []).map((hist, idx) => (
                <div key={idx} className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 uppercase">{hist.status}</span>
                      <span className="text-[10px] text-slate-500">by {hist.updatedBy}</span>
                    </div>
                    {hist.note && <p className="text-[11px] text-slate-600">{hist.note}</p>}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">{hist.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            id="print-ticket-stub-modal-btn"
            onClick={() => {
              setActiveClaimStubTicket(ticket);
              setActiveDetailTicket(null);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl shadow-2xs transition-colors"
          >
            <Printer size={15} />
            <span>Print Claim Stub</span>
          </button>

          <button
            onClick={() => setActiveDetailTicket(null)}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
