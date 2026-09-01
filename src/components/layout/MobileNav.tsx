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
    pendingOrdersCount,
    setIsCreateTicketOpen 
  } = useLaundry();

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  if (role === 'CUSTOMER') {
    return null;
  }

  return (
    <>
      {/* "More" Drawer for Mobile */}
      {isMoreMenuOpen && (
        <div 
          id="mobile-more-drawer-backdrop"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end lg:hidden"
          onClick={() => setIsMoreMenuOpen(false)}
        >
          <div 
            id="mobile-more-drawer-content"
            className="bg-white rounded-t-3xl p-5 space-y-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">More Management Views</h3>
              <button 
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              {role === 'ADMIN' ? (
                <>
                  <button
                    onClick={() => { setAdminTab('services'); setIsMoreMenuOpen(false); }}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left ${
                      adminTab === 'services' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Tag size={16} className="text-emerald-500" />
                    <span>Services & Pricing</span>
                  </button>

                  <button
                    onClick={() => { setAdminTab('payments'); setIsMoreMenuOpen(false); }}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left ${
                      adminTab === 'payments' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <DollarSign size={16} className="text-emerald-500" />
                    <span>Payments / Ledger</span>
                  </button>

                  <button
                    onClick={() => { setAdminTab('expenses'); setIsMoreMenuOpen(false); }}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left ${
                      adminTab === 'expenses' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Boxes size={16} className="text-emerald-500" />
                    <span>Inventory & Stocks</span>
                  </button>

                  <button
                    onClick={() => { setAdminTab('reports'); setIsMoreMenuOpen(false); }}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left ${
                      adminTab === 'reports' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <FileText size={16} className="text-sky-500" />
                    <span>Operational Reports</span>
                  </button>

                  <button
                    onClick={() => { setAdminTab('settings'); setIsMoreMenuOpen(false); }}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left ${
                      adminTab === 'settings' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <SettingsIcon size={16} className="text-slate-500" />
                    <span>Shop Settings</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setOwnerTab('expenses'); setIsMoreMenuOpen(false); }}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left ${
                      ownerTab === 'expenses' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Boxes size={16} className="text-emerald-500" />
                    <span>Inventory & Costs</span>
                  </button>

                  <button
                    onClick={() => { setOwnerTab('reports'); setIsMoreMenuOpen(false); }}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left ${
                      ownerTab === 'reports' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <FileText size={16} className="text-sky-500" />
                    <span>Export Reports</span>
                  </button>

                  <button
                    onClick={() => { setOwnerTab('settings'); setIsMoreMenuOpen(false); }}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left ${
                      ownerTab === 'settings' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <SettingsIcon size={16} className="text-slate-500" />
                    <span>Business Config</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

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
              id="mobile-nav-admin-tickets"
              onClick={() => setAdminTab('tickets')}
              className={`flex flex-col items-center gap-0.5 py-1 px-1.5 sm:px-3 rounded-xl relative transition-colors ${
                adminTab === 'tickets' ? 'text-emerald-600 font-bold' : 'text-slate-500'
              }`}
            >
              <TicketIcon size={18} />
              <span className="text-[10px]">Tickets</span>
              {pendingOrdersCount > 0 && (
                <span className="absolute top-0 right-1 sm:right-2 w-4 h-4 bg-emerald-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {pendingOrdersCount}
                </span>
              )}
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
              id="mobile-nav-admin-customers"
              onClick={() => setAdminTab('customers')}
              className={`flex flex-col items-center gap-0.5 py-1 px-1.5 sm:px-3 rounded-xl transition-colors ${
                adminTab === 'customers' ? 'text-emerald-600 font-bold' : 'text-slate-500'
              }`}
            >
              <Users size={18} />
              <span className="text-[10px]">Customers</span>
            </button>

            <button
              id="mobile-nav-admin-more"
              onClick={() => setIsMoreMenuOpen(true)}
              className="flex flex-col items-center gap-0.5 py-1 px-1.5 sm:px-3 rounded-xl text-slate-500"
            >
              <MoreHorizontal size={18} />
              <span className="text-[10px]">More</span>
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
              id="mobile-nav-owner-tickets"
              onClick={() => setOwnerTab('tickets')}
              className={`flex flex-col items-center gap-0.5 py-1 px-1.5 sm:px-3 rounded-xl transition-colors ${
                ownerTab === 'tickets' ? 'text-indigo-600 font-bold' : 'text-slate-500'
              }`}
            >
              <TicketIcon size={18} />
              <span className="text-[10px]">Orders</span>
            </button>

            <button
              id="mobile-nav-owner-revenue"
              onClick={() => setOwnerTab('revenue')}
              className={`flex flex-col items-center gap-0.5 py-1 px-1.5 sm:px-3 rounded-xl transition-colors ${
                ownerTab === 'revenue' ? 'text-indigo-600 font-bold' : 'text-slate-500'
              }`}
            >
              <DollarSign size={18} />
              <span className="text-[10px]">Revenue</span>
            </button>

            <button
              id="mobile-nav-owner-analytics"
              onClick={() => setOwnerTab('analytics')}
              className={`flex flex-col items-center gap-0.5 py-1 px-1.5 sm:px-3 rounded-xl transition-colors ${
                ownerTab === 'analytics' ? 'text-indigo-600 font-bold' : 'text-slate-500'
              }`}
            >
              <BarChart3 size={18} />
              <span className="text-[10px]">Analytics</span>
            </button>

            <button
              id="mobile-nav-owner-more"
              onClick={() => setIsMoreMenuOpen(true)}
              className="flex flex-col items-center gap-0.5 py-1 px-1.5 sm:px-3 rounded-xl text-slate-500"
            >
              <MoreHorizontal size={18} />
              <span className="text-[10px]">More</span>
            </button>
          </>
        )}
      </div>
    </>
  );
};
