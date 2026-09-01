import React, { useState, useRef } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { PaymentMethod, PaymentStatus, ServiceItem, Ticket } from '../../types';
import { 
  X, 
  Plus, 
  User, 
  Phone, 
  Scale, 
  CreditCard, 
  Check, 
  Sparkles, 
  Search, 
  DollarSign, 
  FileText,
  Clock,
  Shirt,
  Layers,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface CreateTicketProps {
  isModal?: boolean;
  onClose?: () => void;
}

export const CreateTicketView: React.FC<CreateTicketProps> = ({ isModal = false, onClose }) => {
  const { 
    customers, 
    services, 
    createTicket, 
    setActiveClaimStubTicket, 
    setAdminTab 
  } = useLaundry();

  const weightInputRef = useRef<HTMLInputElement>(null);
  const weightSectionRef = useRef<HTMLDivElement>(null);

  // Form states
  const [customerMode, setCustomerMode] = useState<'existing' | 'new'>('existing');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');

  // Selected services cart (initially empty so no automatic ₱350 computation until selected)
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(5);
  const [specialNote, setSpecialNote] = useState<string>('');
  
  // Multi-item cart
  const [cartItems, setCartItems] = useState<ServiceItem[]>([]);

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('PAID');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [amountPaidCustom, setAmountPaidCustom] = useState<number | null>(null);
  const [detergent, setDetergent] = useState('Ariel Professional Powder');
  const [fragrance, setFragrance] = useState('Downy Mystique');
  const [generalNotes, setGeneralNotes] = useState('');
  const [extraDetergentScoops, setExtraDetergentScoops] = useState<number>(0);
  const [extraFabConPacks, setExtraFabConPacks] = useState<number>(0);

  // Generate a mock ticket prefix based on customer name initials
  const getInitialsTicketNumber = (name: string) => {
    const parts = name.trim().split(/\s+/);
    const initials = parts.map(p => p[0]?.toUpperCase() || '').slice(0, 2).join('');
    const randomNum = Math.floor(Math.random() * 90) + 10;
    return `${initials || 'TK'}${randomNum}`;
  };

  // Add-on pricing constants (₱15 per extra scoop / sachet)
  const EXTRA_DETERGENT_PRICE = 15;
  const EXTRA_FABCON_PRICE = 15;
  const addOnsTotal = (extraDetergentScoops * EXTRA_DETERGENT_PRICE) + (extraFabConPacks * EXTRA_FABCON_PRICE);

  // Calculate totals
  const totalAmount = cartItems.reduce((sum, item) => sum + item.subtotal, 0) + (cartItems.length > 0 ? addOnsTotal : 0);
  const totalWeightKg = cartItems
    .filter(i => i.unitType === 'kg')
    .reduce((sum, item) => sum + item.quantity, 0) || (quantity > 0 ? quantity : 0);

  const handleAddDetergentScoop = () => setExtraDetergentScoops(prev => prev + 1);
  const handleRemoveDetergentScoop = () => setExtraDetergentScoops(prev => Math.max(0, prev - 1));
  const handleAddFabConPack = () => setExtraFabConPacks(prev => prev + 1);
  const handleRemoveFabConPack = () => setExtraFabConPacks(prev => Math.max(0, prev - 1));

  const currentAmountPaid = paymentStatus === 'PAID' 
    ? totalAmount 
    : paymentStatus === 'UNPAID' 
      ? 0 
      : (amountPaidCustom !== null ? amountPaidCustom : Math.floor(totalAmount / 2));

  // Handler when a service is clicked: Select service, auto-populate cart, and auto-focus Weight/Quantity
  const handleSelectService = (srv: typeof services[0]) => {
    setSelectedServiceId(srv.id);
    const defaultQty = srv.unitType === 'kg' ? (quantity > 0 ? quantity : 5) : (quantity > 0 ? quantity : 1);
    setQuantity(defaultQty);

    const newItem: ServiceItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      serviceId: srv.id,
      name: srv.name,
      unitPrice: srv.price,
      unitType: srv.unitType,
      quantity: defaultQty,
      subtotal: srv.price * defaultQty,
      specialInstructions: specialNote
    };

    // If no items yet, set this as primary item; otherwise replace first or add
    setCartItems([newItem]);

    // Automatically navigate / focus to the Weight / Quantity input
    setTimeout(() => {
      if (weightInputRef.current) {
        weightInputRef.current.focus();
        weightInputRef.current.select();
      }
      if (weightSectionRef.current) {
        weightSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 50);
  };

  // Handler when quantity changes
  const handleQuantityUpdate = (newQty: number) => {
    const validQty = Math.max(0.5, newQty);
    setQuantity(validQty);

    if (selectedServiceId && cartItems.length > 0) {
      setCartItems(prev => prev.map((item, idx) => {
        if (idx === 0) {
          return {
            ...item,
            quantity: validQty,
            subtotal: item.unitPrice * validQty
          };
        }
        return item;
      }));
    }
  };

  // Add additional service item to cart
  const handleAddServiceItem = () => {
    const srv = services.find(s => s.id === selectedServiceId);
    if (!srv) return;

    const newItem: ServiceItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      serviceId: srv.id,
      name: srv.name,
      unitPrice: srv.price,
      unitType: srv.unitType,
      quantity: quantity,
      subtotal: srv.price * quantity,
      specialInstructions: specialNote
    };

    setCartItems([...cartItems, newItem]);
    setSpecialNote('');
  };

  const handleRemoveCartItem = (index: number) => {
    const updated = cartItems.filter((_, idx) => idx !== index);
    setCartItems(updated);
    if (updated.length === 0) {
      setSelectedServiceId('');
    }
  };

  // Submit and Create
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert('Please select a laundry service and specify weight/quantity first.');
      return;
    }

    let customerName = '';
    let customerPhone = '';
    let customerId = '';

    if (customerMode === 'existing') {
      const cust = customers.find(c => c.id === selectedCustomerId) || customers[0];
      customerName = cust?.name || 'Walk-in Customer';
      customerPhone = cust?.phone || '0917-000-0000';
      customerId = cust?.id || `cust-${Date.now()}`;
    } else {
      customerName = newCustomerName.trim() || 'Walk-in Customer';
      customerPhone = newCustomerPhone.trim() || '0917-000-0000';
      customerId = `cust-${Date.now()}`;
    }

    const ticketNumber = getInitialsTicketNumber(customerName);

    const newTicket = createTicket({
      ticketNumber,
      customerId,
      customerName,
      customerPhone,
      items: cartItems,
      totalWeightKg,
      bagCount: 1,
      totalAmount,
      amountPaid: currentAmountPaid,
      paymentStatus,
      paymentMethod,
      status: 'RECEIVED',
      notes: [
        generalNotes,
        extraDetergentScoops > 0 ? `+${extraDetergentScoops} Extra Detergent Scoop` : '',
        extraFabConPacks > 0 ? `+${extraFabConPacks} Extra FabCon Sachet` : ''
      ].filter(Boolean).join(' | '),
      detergentOption: extraDetergentScoops > 0 ? `${detergent} (+${extraDetergentScoops} scoop)` : detergent,
      fragranceOption: extraFabConPacks > 0 ? `${fragrance} (+${extraFabConPacks} sachet)` : fragrance,
      estimatedReadyAt: 'Today, 5:00 PM',
      staffName: 'Arlene Santos'
    });

    // Open confirmation Claim Stub immediately
    setActiveClaimStubTicket(newTicket);

    if (onClose) onClose();
    setAdminTab('tickets');
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) || 
    c.phone.includes(customerSearch)
  );

  return (
    <div 
      id="create-ticket-container" 
      className={`bg-white ${isModal ? 'p-6 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto' : 'p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs max-w-4xl mx-auto my-4'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Plus size={20} />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Create Laundry Ticket
            </h2>
            <p className="text-xs text-slate-500">
              Fast counter ticketing & automated price computation
            </p>
          </div>
        </div>

        {isModal && onClose && (
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <form onSubmit={handleCreateSubmit} className="mt-6 space-y-6">
        
        {/* 1. Customer Information */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <User size={14} className="text-emerald-600" />
              1. Customer Information
            </label>

            {/* Toggle Customer Mode */}
            <div className="bg-slate-100 p-0.5 rounded-lg border border-slate-200 flex text-xs font-semibold">
              <button
                type="button"
                id="select-existing-cust-btn"
                onClick={() => setCustomerMode('existing')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  customerMode === 'existing' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500'
                }`}
              >
                Search Existing
              </button>
              <button
                type="button"
                id="select-new-cust-btn"
                onClick={() => setCustomerMode('new')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  customerMode === 'new' ? 'bg-white text-emerald-700 shadow-2xs font-bold' : 'text-slate-500'
                }`}
              >
                + New Customer
              </button>
            </div>
          </div>

          {customerMode === 'existing' ? (
            <div className="space-y-2">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter existing customer by name or phone..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1">
                {filteredCustomers.map((cust) => (
                  <div
                    key={cust.id}
                    onClick={() => setSelectedCustomerId(cust.id)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      selectedCustomerId === cust.id
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div>
                      <span className="block font-bold">{cust.name}</span>
                      <span className="text-[11px] text-slate-500">{cust.phone}</span>
                    </div>
                    {selectedCustomerId === cust.id && (
                      <Check size={16} className="text-emerald-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Luis Miguel"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Mobile Phone (for SMS notifications) *</label>
                <input
                  type="text"
                  required
                  placeholder="0917 XXX XXXX"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* 2. Services & Weight/Quantity */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Shirt size={14} className="text-emerald-600" />
              2. Services & Weight / Quantity
            </label>
            {!selectedServiceId && (
              <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
                <AlertCircle size={13} /> Select a service below to compute total
              </span>
            )}
          </div>

          {/* Quick Service Cards Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {services.map((srv) => {
              const isSelected = selectedServiceId === srv.id;
              return (
                <div
                  key={srv.id}
                  onClick={() => handleSelectService(srv)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 shadow-sm font-bold ring-2 ring-emerald-500/30'
                      : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20 bg-white text-slate-700'
                  }`}
                >
                  <span className="font-bold text-xs">{srv.name}</span>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-extrabold text-emerald-700 font-mono">
                      ₱{srv.price} <span className="text-[10px] font-normal text-slate-500">/{srv.unitType}</span>
                    </span>
                    {isSelected ? (
                      <span className="bg-emerald-600 text-white rounded-full p-0.5">
                        <Check size={12} />
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400">Select</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quantity & Weight Adjuster */}
          <div 
            ref={weightSectionRef}
            className={`p-3.5 rounded-xl border transition-all flex flex-wrap items-center justify-between gap-3 ${
              selectedServiceId 
                ? 'bg-emerald-50/40 border-emerald-200 ring-1 ring-emerald-400/30' 
                : 'bg-slate-50 border-slate-200 opacity-80'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Scale size={14} className={selectedServiceId ? "text-emerald-600" : "text-slate-400"} /> 
                Weight / Quantity:
              </span>
              <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => handleQuantityUpdate(Math.max(1, quantity - 1))}
                  className="w-7 h-7 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer active:scale-95"
                >
                  -
                </button>
                <input
                  ref={weightInputRef}
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={quantity}
                  onChange={(e) => handleQuantityUpdate(parseFloat(e.target.value) || 0)}
                  className="w-14 text-center font-mono font-bold text-xs py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
                />
                <button
                  type="button"
                  onClick={() => handleQuantityUpdate(quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer active:scale-95"
                >
                  +
                </button>
              </div>

              {/* Quick weight pills */}
              <div className="hidden sm:flex items-center gap-1">
                {[4, 5, 6, 8, 10].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => handleQuantityUpdate(w)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                      quantity === w && selectedServiceId
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {w}kg
                  </button>
                ))}
              </div>
            </div>

            {selectedServiceId && (
              <span className="text-xs font-mono font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                {quantity} {services.find(s => s.id === selectedServiceId)?.unitType || 'kg'} selected
              </span>
            )}
          </div>

          {/* Current Order Cart Items */}
          {cartItems.length > 0 && (
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-100 px-3.5 py-2 font-bold text-slate-700 flex justify-between">
                <span>Selected Service Items</span>
                <span>Subtotal</span>
              </div>
              <div className="divide-y divide-slate-100 bg-white">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="px-3.5 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveCartItem(idx)}
                        className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer"
                        title="Remove item"
                      >
                        <X size={14} />
                      </button>
                      <div>
                        <span className="font-bold text-slate-800">{item.name}</span>
                        <span className="text-slate-500 text-[11px] block">
                          {item.quantity} {item.unitType} × ₱{item.unitPrice}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-extrabold text-slate-900">
                      ₱{item.subtotal.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. Detergent, Fragrance & Add-on Supplies */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Detergent Choice</label>
              <select
                value={detergent}
                onChange={(e) => setDetergent(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none font-medium"
              >
                <option value="Ariel Professional Powder">Ariel Professional Powder</option>
                <option value="Breeze Power Clean">Breeze Power Clean</option>
                <option value="Tide Concentrated Liquid">Tide Concentrated Liquid</option>
                <option value="Perwoll Delicate Care">Perwoll Delicate Care</option>
                <option value="Cycles Baby Safe Mild">Cycles Baby Safe (Hypoallergenic)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Fabric Conditioner</label>
              <select
                value={fragrance}
                onChange={(e) => setFragrance(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none font-medium"
              >
                <option value="Downy Mystique">Downy Mystique (Black)</option>
                <option value="Downy Floral Breeze">Downy Floral Breeze</option>
                <option value="Downy Sunrise Fresh">Downy Sunrise Fresh (Blue)</option>
                <option value="Comfort Ultra Soft">Comfort Ultra Soft</option>
                <option value="No Conditioner (Unscented)">No Conditioner (Unscented)</option>
              </select>
            </div>
          </div>

          {/* Add-ons Buttons for Detergent & Fabric Conditioner */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={13} className="text-emerald-600" />
                Add-on Supplies
              </span>
              {addOnsTotal > 0 && cartItems.length > 0 && (
                <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  +₱{addOnsTotal} add-ons
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Extra Detergent Scoop Button/Counter */}
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Extra Detergent Scoop</span>
                  <span className="text-[11px] text-slate-500 font-mono">+₱{EXTRA_DETERGENT_PRICE} / scoop</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={handleRemoveDetergentScoop}
                    disabled={extraDetergentScoops <= 0}
                    className="w-6 h-6 flex items-center justify-center font-bold text-xs text-slate-600 hover:bg-slate-200 rounded disabled:opacity-30 transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-mono font-bold text-xs text-slate-900">
                    {extraDetergentScoops}
                  </span>
                  <button
                    type="button"
                    onClick={handleAddDetergentScoop}
                    className="w-6 h-6 flex items-center justify-center font-bold text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Extra FabCon Sachet Button/Counter */}
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Extra FabCon Sachet</span>
                  <span className="text-[11px] text-slate-500 font-mono">+₱{EXTRA_FABCON_PRICE} / sachet</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={handleRemoveFabConPack}
                    disabled={extraFabConPacks <= 0}
                    className="w-6 h-6 flex items-center justify-center font-bold text-xs text-slate-600 hover:bg-slate-200 rounded disabled:opacity-30 transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-mono font-bold text-xs text-slate-900">
                    {extraFabConPacks}
                  </span>
                  <button
                    type="button"
                    onClick={handleAddFabConPack}
                    className="w-6 h-6 flex items-center justify-center font-bold text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Payment & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
          <div>
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <CreditCard size={14} className="text-emerald-600" />
              Payment Status
            </label>
            
            <div className="grid grid-cols-3 gap-2">
              {(['PAID', 'UNPAID', 'PARTIAL'] as PaymentStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setPaymentStatus(st)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    paymentStatus === st
                      ? st === 'PAID'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : st === 'UNPAID'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Payment Method Selector */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500">Method:</span>
              {(['CASH', 'GCASH', 'MAYA'] as PaymentMethod[]).map((pm) => (
                <button
                  key={pm}
                  type="button"
                  onClick={() => setPaymentMethod(pm)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    paymentMethod === pm
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <FileText size={14} className="text-slate-400" />
              Customer / Staff Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Customer requested ready before 5 PM. Low heat dry."
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Total Summary Banner & Submit Button */}
        <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Computed Order Total:</span>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono tracking-tight flex items-baseline gap-2">
              <span>₱{totalAmount.toLocaleString()}</span>
              {cartItems.length === 0 && (
                <span className="text-xs font-sans font-normal text-amber-400">
                  (Select service & weight above)
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-300">
              {cartItems.length > 0 
                ? `Payment: ${paymentStatus} (${paymentMethod}) · ${totalWeightKg}kg total`
                : 'No service selected yet'
              }
            </span>
          </div>

          <button
            id="submit-create-ticket-btn"
            type="submit"
            disabled={cartItems.length === 0}
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>CREATE TICKET</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </form>
    </div>
  );
};

