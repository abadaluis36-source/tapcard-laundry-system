import React from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { AdminTab, OwnerTab } from '../../types';
import { 
  LayoutDashboard, 
  Ticket as TicketIcon, 
  PlusCircle, 
  Users, 
  Tag, 
  CreditCard, 
  Receipt, 
  Boxes,
  BarChart3, 
  FileText, 
  Settings as SettingsIcon,
  Sparkles,
  DollarSign,
  LogOut,
  RefreshCw,
  Lock,
  ShieldCheck
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    role, 
    adminTab, 
    setAdminTab, 
    ownerTab, 
    setOwnerTab,
    pendingOrdersCount,
    lowStockItemsCount,
    tickets,
    currentUser,
    logout,
    setIsAuthModalOpen,
    setAuthModalTargetRole
  } = useLaundry();

  // Admin / Staff navigation items (Focused on Counter POS & Shift Operations)
  const adminNavItems = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tickets' as AdminTab, label: 'Laundry Tickets', icon: TicketIcon, badge: pendingOrdersCount },
    { id: 'create-ticket' as AdminTab, label: 'Create Ticket (POS)', icon: PlusCircle, isHighlight: true },
    { id: 'customers' as AdminTab, label: 'Customers', icon: Users },
    { id: 'payments' as AdminTab, label: 'Payments / Ledger', icon: CreditCard },
    { id: 'expenses' as AdminTab, label: 'Expense Tracker', icon: Receipt },
    { id: 'reports' as AdminTab, label: 'Operational Reports', icon: FileText },
  ];

  // Boss / Owner navigation items (Full Executive Management & Store Configuration)
  const ownerNavItems = [
    { id: 'dashboard' as OwnerTab, label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'tickets' as OwnerTab, label: 'All Orders & Tickets', icon: TicketIcon, badge: tickets.length },
    { id: 'customers' as OwnerTab, label: 'Customer Retention', icon: Users },
    { id: 'services' as OwnerTab, label: 'Services & Pricing', icon: Tag },
    { id: 'revenue' as OwnerTab, label: 'Revenue & Ledger', icon: DollarSign },
    { id: 'expenses' as OwnerTab, label: 'Expense Tracker', icon: Receipt },
    { id: 'analytics' as OwnerTab, label: 'Business Analytics', icon: BarChart3 },
    { id: 'reports' as OwnerTab, label: 'Financial Reports', icon: FileText },
    { id: 'settings' as OwnerTab, label: 'Business Settings', icon: SettingsIcon },
  ];

  if (role === 'CUSTOMER') {
    return null;
  }

  return (
    <aside 
      id="pera-desktop-sidebar"
      className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/90 h-[calc(100vh-4rem)] sticky top-16 shrink-0 select-none overflow-y-auto"
    >
      {/* Role Badge Indicator & Authenticated Operator Card */}
      <div className="p-3.5 border-b border-slate-100">
        {currentUser ? (
          <div className="p-3 rounded-2xl bg-slate-900 text-white shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 uppercase tracking-wider">
                {currentUser.role === 'OWNER' ? 'Owner Access' : 'Staff Terminal'}
              </span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-300 font-mono font-medium">Active</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white ${
                currentUser.role === 'OWNER' ? 'bg-indigo-600' : 'bg-emerald-600'
              }`}>
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold truncate leading-tight text-white">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{currentUser.title}</p>
              </div>
            </div>

            {/* Quick Switch / Sign out links */}
            <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-800 text-[10px]">
              <button
                type="button"
                onClick={() => {
                  setAuthModalTargetRole(role as 'ADMIN' | 'OWNER');
                  setIsAuthModalOpen(true);
                }}
                className="text-slate-300 hover:text-white flex items-center gap-1 font-medium transition-colors"
                title="Switch Staff Operator or PIN"
              >
                <RefreshCw size={11} />
                <span>Switch PIN</span>
              </button>
              <button
                type="button"
                onClick={logout}
                className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium transition-colors"
                title="Sign out of register"
              >
                <LogOut size={11} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
            <div className="flex items-center gap-2">
              <Lock size={14} className="text-amber-600" />
              <span className="text-xs font-bold">Unauthenticated Session</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-tight">
              Please sign in to access counter POS and financial registers.
            </p>
            <button
              type="button"
              onClick={() => {
                setAuthModalTargetRole(role as 'ADMIN' | 'OWNER');
                setIsAuthModalOpen(true);
              }}
              className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs"
            >
              Sign In to {role === 'ADMIN' ? 'Staff POS' : 'Owner Hub'}
            </button>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="p-3 space-y-1 flex-1">
        {role === 'ADMIN' ? (
          adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = adminTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-admin-nav-${item.id}`}
                onClick={() => setAdminTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? item.isHighlight
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-900 text-white shadow-xs'
                    : item.isHighlight
                      ? 'text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className={isActive ? 'text-white' : item.isHighlight ? 'text-emerald-600' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })
        ) : (
          ownerNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = ownerTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-owner-nav-${item.id}`}
                onClick={() => setOwnerTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })
        )}
      </nav>

      {/* Footer Quick Summary card */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs text-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <span>Today's Counter Sales</span>
            <span className="font-semibold text-emerald-600">8:30 AM - Now</span>
          </div>
          <div className="text-base font-extrabold text-slate-900 font-mono">
            ₱8,450
          </div>
          <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>47 Orders Received</span>
            <span className="font-semibold text-slate-700">32 Finished</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

