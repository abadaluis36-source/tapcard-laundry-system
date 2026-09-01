import React, { useState } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { AdminTab, OwnerTab } from '../../types';
import { 
  LayoutDashboard, 
  Ticket as TicketIcon, 
  PlusCircle, 
  Users, 
  MoreHorizontal,
  DollarSign,
  BarChart3,
  Tag,
  Receipt,
  Boxes,
  FileText,
  Settings as SettingsIcon,
  X,
  Smartphone
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { 
    role, 
    adminTab, 
    setAdminTab, 
    ownerTab, 
    setOwnerTab,
    setIsCreateTicketOpen 
  } = useLaundry();

  if (role === 'CUSTOMER') {
    return null;
  }

  return (
    <>
      {/* Bottom Sticky Bar */}
      <div 
        id="pera-mobile-bottom-nav"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/90 py-1.5 px-1 sm:px-2 flex items-center justify-around lg:hidden shadow-lg select-none"
      >
        {role === 'ADMIN' ? (
          <>
            <button
              id="mobile-nav-admin-dashboard"
              onClick={() => setAdminTab('dashboard')}
              className={`flex flex-col items-center gap-0.5 py-1 px-1.5 sm:px-3 rounded-xl transition-colors ${
                adminTab === 'dashboard' ? 'text-emerald-600 font-bold' : 'text-slate-500'
              }`}
            >
              <LayoutDashboard size={18} />
              <span className="text-[10px]">Overview</span>
            </button>

            <button
              id="mobile-nav-admin-payments"
              onClick={() => setAdminTab('payments')}
              className={`flex flex-col items-center gap-0.5 py-1 px-1.5 sm:px-3 rounded-xl transition-colors ${
                adminTab === 'payments' ? 'text-emerald-600 font-bold' : 'text-slate-500'
              }`}
            >
              <DollarSign size={18} />
              <span className="text-[10px]">Payments</span>
            </button>

            {/* Elevated POS Button in Center */}
            <button
              id="mobile-nav-admin-create-ticket"
              onClick={() => {
                setAdminTab('create-ticket');
                setIsCreateTicketOpen(true);
              }}
              className="flex flex-col items-center -mt-5 bg-emerald-600 text-white p-3 rounded-full shadow-lg shadow-emerald-600/30 active:scale-95 transition-transform shrink-0"
            >
              <PlusCircle size={22} />
            </button>

            <button
              id="mobile-nav-admin-expenses"
              onClick={() => setAdminTab('expenses')}
              className={`flex flex-col items-center gap-0.5 py-1 px-1.5 sm:px-3 rounded-xl transition-colors ${
                adminTab === 'expenses' ? 'text-emerald-600 font-bold' : 'text-slate-500'
              }`}
            >
              <Receipt size={18} />
              <span className="text-[10px]">Expenses</span>
            </button>

            <button
              id="mobile-nav-admin-reports"
              onClick={() => setAdminTab('reports')}
              className={`flex flex-col items-center gap-0.5 py-1 px-1.5 sm:px-3 rounded-xl transition-colors ${
                adminTab === 'reports' ? 'text-emerald-600 font-bold' : 'text-slate-500'
              }`}
            >
              <FileText size={18} />
              <span className="text-[10px]">Reports</span>
            </button>
          </>
        ) : (
          <>
            <button
              id="mobile-nav-owner-dashboard"
              onClick={() => setOwnerTab('dashboard')}
              className={`flex flex-col items-center gap-0.5 py-1 px-1.5 sm:px-3 rounded-xl transition-colors ${
                ownerTab === 'dashboard' ? 'text-indigo-600 font-bold' : 'text-slate-500'
              }`}
            >
              <LayoutDashboard size={18} />
              <span className="text-[10px]">Executive</span>
            </button>

            <button
              id="mobile-nav-owner-reports"
              onClick={() => setOwnerTab('reports')}
              className={`flex flex-col items-center gap-0.5 py-1 px-1.5 sm:px-3 rounded-xl transition-colors ${
                ownerTab === 'reports' ? 'text-indigo-600 font-bold' : 'text-slate-500'
              }`}
            >
              <FileText size={18} />
              <span className="text-[10px]">Reports</span>
            </button>

            <button
              id="mobile-nav-owner-settings"
              onClick={() => setOwnerTab('settings')}
              className={`flex flex-col items-center gap-0.5 py-1 px-1.5 sm:px-3 rounded-xl transition-colors ${
                ownerTab === 'settings' ? 'text-indigo-600 font-bold' : 'text-slate-500'
              }`}
            >
              <SettingsIcon size={18} />
              <span className="text-[10px]">Settings</span>
            </button>
          </>
        )}
      </div>
    </>
  );
};
