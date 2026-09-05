import React, { useState, useEffect } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { LaundryStatus } from '../../types';
import { StatusBadge, PaymentBadge } from '../common/StatusBadge';
import { 
  Search, 
  ArrowLeft,
  ArrowRight,
  Clock, 
  CheckCircle2, 
  Store, 
  Phone, 
  Receipt, 
  RefreshCw,
  AlertCircle,
  PartyPopper,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CustomerTracker: React.FC = () => {
  const { 
    tickets, 
    customerSearchQuery, 
    setCustomerSearchQuery,
    selectedCustomerTicket,
    setSelectedCustomerTicket,
    setActiveClaimStubTicket
  } = useLaundry();

  const [inputVal, setInputVal] = useState(customerSearchQuery || '');
  // Start on initial screen if no ticket selected, or if user is searching
  const [viewState, setViewState] = useState<'ENTRY' | 'STATUS'>(
    selectedCustomerTicket ? 'STATUS' : 'ENTRY'
  );
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState('Just now');
  const [prevStatus, setPrevStatus] = useState<LaundryStatus | null>(selectedCustomerTicket?.status || null);

  // Quick sample ticket suggestions for fast demonstration
  const quickSampleTickets = ['LM1', 'JD2', 'MS3', 'AR4', 'CM5'];

  // Handle celebratory effect if status turns to READY
  useEffect(() => {
    if (selectedCustomerTicket) {
      if (prevStatus && prevStatus !== selectedCustomerTicket.status) {
        if (selectedCustomerTicket.status === 'READY') {
          try {
            confetti({
              particleCount: 70,
              spread: 60,
              origin: { y: 0.6 }
            });
          } catch (e) {
            // ignore
          }
        }
      }
      setPrevStatus(selectedCustomerTicket.status);
    }
  }, [selectedCustomerTicket?.status]);

  // Keep viewState synced if customerSearchQuery or selectedCustomerTicket changes externally
  useEffect(() => {
    if (selectedCustomerTicket) {
      setViewState('STATUS');
      setInputVal(selectedCustomerTicket.ticketNumber);
    }
  }, [selectedCustomerTicket]);

  const handleProceed = (e?: React.FormEvent, customTicketId?: string) => {
    if (e) e.preventDefault();
    const query = (customTicketId || inputVal).trim().toUpperCase();
    
    if (!query) {
      setErrorMessage('Please enter your Ticket ID to proceed.');
      return;
    }

    setErrorMessage(null);
    setIsSearching(true);

    setTimeout(() => {
      const found = tickets.find(
        (t) => t.ticketNumber.toUpperCase() === query || t.customerPhone.replace(/\s+/g, '').includes(query.replace(/\s+/g, ''))
      );

      if (found) {
        setSelectedCustomerTicket(found);
        setCustomerSearchQuery(query);
        setInputVal(query);
        setViewState('STATUS');
        setLastRefreshed('Just now');
        setErrorMessage(null);
      } else {
        setErrorMessage(`No active laundry order found for "${query}". Please verify the Ticket ID on your claim stub.`);
      }
      setIsSearching(false);
    }, 300);
  };

  const handleBackToEntry = () => {
    setViewState('ENTRY');
    setErrorMessage(null);
  };

  // Progress pipeline definition
  const STAGES: { status: LaundryStatus; label: string; desc: string }[] = [
    { status: 'RECEIVED', label: 'Order Received', desc: 'Logged & queued for laundry' },
    { status: 'WASHING', label: 'Washing & Drying', desc: 'Sanitary deep wash, dry & conditioning' },
    { status: 'FOLDING', label: 'Folding & Press', desc: 'Neat fold & steam press' },
    { status: 'READY', label: 'Ready for Pickup', desc: 'Bagged & stored on rack' },
    { status: 'COMPLETED', label: 'Completed', desc: 'Picked up by customer' },
  ];

  const getStageIndex = (status: LaundryStatus) => {
    switch (status) {
      case 'RECEIVED': return 0;
      case 'WASHING': return 1;
      case 'FOLDING': return 2;
      case 'READY': return 3;
      case 'COMPLETED': return 4;
      default: return 0;
    }
  };

  const currentStageIndex = selectedCustomerTicket ? getStageIndex(selectedCustomerTicket.status) : 0;

  // ==========================================
  // VIEW 1: INITIAL CUSTOMER ENTRY SCREEN
  // ==========================================
  if (viewState === 'ENTRY') {
    return (
      <div 
        id="customer-entry-screen"
        className="min-h-[calc(100vh-4.5rem)] bg-slate-50 flex flex-col items-center justify-center px-4 py-8 sm:py-12"
      >
        <div className="w-full max-w-sm space-y-6">
          
          {/* 1. TAPCARD LAUNDRY SHOP Branding */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl mx-auto flex items-center justify-center font-black text-2xl shadow-md shadow-emerald-600/20 ring-4 ring-emerald-100">
              ₱
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                TAPCARD LAUNDRY SHOP
              </h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Customer Laundry Status Tracker
              </p>
            </div>
          </div>

          {/* 2. Ticket ID Input & Proceed Form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/90 space-y-5">
            <form onSubmit={handleProceed} className="space-y-4">
              <div>
                <label 
                  htmlFor="customer-ticket-id-input"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
                >
                  Enter Ticket ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search size={18} />
                  </div>
                  <input
                    id="customer-ticket-id-input"
                    type="text"
                    autoFocus
                    value={inputVal}
                    onChange={(e) => {
                      setInputVal(e.target.value.toUpperCase());
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="e.g. LM1"
                    className="w-full pl-10 pr-4 py-3 text-base font-mono font-extrabold text-slate-900 bg-slate-50/80 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-400 placeholder:font-normal uppercase tracking-wider transition-all"
                  />
                </div>
                {errorMessage && (
                  <div className="mt-2.5 flex items-start gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-lg">
                    <AlertCircle size={15} className="shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>

              {/* 3. Proceed Button */}
              <button
                id="customer-proceed-btn"
                type="submit"
                disabled={isSearching}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm uppercase tracking-wider py-3.5 px-4 rounded-xl transition-all shadow-sm shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isSearching ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Checking Status...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Sample Tickets */}
            <div className="pt-4 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2 text-center">
                Demo sample tickets:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {quickSampleTickets.map((tid) => (
                  <button
                    key={tid}
                    id={`demo-sample-ticket-${tid}`}
                    type="button"
                    onClick={() => {
                      setInputVal(tid);
                      handleProceed(undefined, tid);
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 transition-colors"
                  >
                    {tid}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Simple Store Footer Info */}
          <div className="text-center text-xs text-slate-400 space-y-1">
            <p className="font-medium text-slate-500">Open 7:00 AM – 9:00 PM Daily</p>
            <p>Hotline: 0917 555 8921</p>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: LAUNDRY STATUS PAGE (After Proceed)
  // ==========================================
  return (
    <div 
      id="customer-tracking-screen"
      className="min-h-[calc(100vh-4.5rem)] bg-slate-100/70 py-6 px-4 sm:px-6 flex flex-col items-center justify-start"
    >
      <div className="w-full max-w-md space-y-4">
        
        {/* Navigation & Ticket ID Input Bar */}
        <div className="flex items-center justify-between gap-2 pb-1">
          <button
            id="back-to-ticket-entry-btn"
            onClick={handleBackToEntry}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Enter Another Ticket ID</span>
          </button>

          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            TAPCARD LAUNDRY
          </span>
        </div>

        {selectedCustomerTicket ? (
          <div 
            id="customer-ticket-result-card"
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all"
          >
            {/* Ready Status Special Alert Banner if READY */}
            {selectedCustomerTicket.status === 'READY' && (
              <div 
                id="ready-pickup-banner"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-3.5 flex items-center gap-3 animate-pulse"
              >
                <PartyPopper size={24} className="shrink-0" />
                <div>
                  <h4 className="font-extrabold text-sm leading-tight">Your Laundry is Ready for Pickup!</h4>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    Freshly cleaned & neatly packaged. Available at counter.
                  </p>
                </div>
              </div>
            )}

            {/* Ticket Header & Status */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Ticket ID
                  </span>
                  <div className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
                    {selectedCustomerTicket.ticketNumber}
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Current Status
                  </span>
                  <StatusBadge status={selectedCustomerTicket.status} size="lg" />
                </div>
              </div>

              {/* Customer and Total pill */}
              <div className="mt-4 pt-3 border-t border-slate-200/70 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Customer</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedCustomerTicket.customerName}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[11px]">Order Total</span>
                  <span className="font-extrabold text-emerald-700 text-base font-mono">
                    ₱{selectedCustomerTicket.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 6-Step Visual Progress Tracker */}
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Laundry Processing Steps
                </h3>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  <Clock size={11} /> Last updated: {lastRefreshed}
                </span>
              </div>

              <div className="space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {STAGES.map((stage, idx) => {
                  const isPast = idx < currentStageIndex;
                  const isCurrent = idx === currentStageIndex;

                  return (
                    <div key={stage.status} className="flex items-start gap-3.5 relative">
                      {/* Step Circle Marker */}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all z-10 ${
                        isPast
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-xs'
                          : isCurrent
                            ? selectedCustomerTicket.status === 'READY'
                              ? 'bg-emerald-600 text-white ring-4 ring-emerald-200 animate-bounce'
                              : 'bg-slate-900 text-white ring-4 ring-slate-200 animate-pulse'
                            : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}>
                        {isPast ? (
                          <CheckCircle2 size={15} />
                        ) : isCurrent ? (
                          <span className="text-xs">●</span>
                        ) : (
                          <span className="text-xs">○</span>
                        )}
                      </div>

                      {/* Step Text Info */}
                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${
                            isCurrent
                              ? 'text-slate-900 text-sm font-extrabold'
                              : isPast
                                ? 'text-slate-700 font-semibold'
                                : 'text-slate-400 font-medium'
                          }`}>
                            {stage.label}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900 text-white">
                              Current Step
                            </span>
                          )}
                          {isPast && (
                            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                              Done ✓
                            </span>
                          )}
                        </div>
                        <p className={`text-[11px] mt-0.5 ${isCurrent ? 'text-slate-600' : 'text-slate-400'}`}>
                          {stage.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items Breakdown */}
            <div className="px-5 pb-5">
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-800 pb-1.5 border-b border-slate-200">
                  <span>Selected Services</span>
                  <span>Weight / Quantity</span>
                </div>
                {selectedCustomerTicket.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-slate-600">
                    <span className="font-medium">{item.name}</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {item.quantity} {item.unitType} (₱{item.subtotal})
                    </span>
                  </div>
                ))}

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-slate-700">
                  <span>Payment Status</span>
                  <PaymentBadge status={selectedCustomerTicket.paymentStatus} size="sm" />
                </div>
              </div>
            </div>

            {/* Store Information Footer */}
            <div className="p-4 bg-slate-900 text-white text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-200">
                <Store size={14} className="text-emerald-400" />
                <span>TAPCARD LAUNDRY SHOP</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="flex items-center gap-1">
                  <Phone size={11} /> 0917 555 8921
                </span>
                <span>Open 7:00 AM – 9:00 PM Daily</span>
              </div>
            </div>
          </div>
        ) : null}

      </div>
    </div>
  );
};

