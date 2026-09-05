import React from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { AdminTab, OwnerTab, ExpenseSubmission } from '../../types';
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
    setRole,
    adminTab, 
    setAdminTab, 
    ownerTab, 
    setOwnerTab,
    pendingOrdersCount,
    lowStockItemsCount,
    tickets,
    expenseSubmissions,
    currentUser,
    logout,
    setIsAuthModalOpen,
    setAuthModalTargetRole
  } = useLaundry();

  const handleToggleRole = () => {
    if (role === 'ADMIN') {
      if (!currentUser || currentUser.role !== 'OWNER') {
        setAuthModalTargetRole('OWNER');
        setIsAuthModalOpen(true);
      } else {
        setRole('OWNER');
      }
    } else {
      setRole('ADMIN');
    }
  };

  const pendingAuditsCount = Object.values(expenseSubmissions || {}).filter((s: ExpenseSubmission) => s.status === 'PENDING_REVIEW').length;

  // Admin / Staff navigation items (Focused on Counter POS & Shift Operations)
  const adminNavItems: Array<{ id: AdminTab; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; badge?: number; isHighlight?: boolean }> = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create-ticket' as AdminTab, label: 'Create Ticket (POS)', icon: PlusCircle, isHighlight: true },
    { id: 'expenses' as AdminTab, label: 'Expense Tracker', icon: Receipt },
    { id: 'reports' as AdminTab, label: 'Operational Reports', icon: FileText },
  ];

  // Boss / Owner navigation items (Streamlined Management & Store Configuration)
  const ownerNavItems: Array<{ id: OwnerTab; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; badge?: number }> = [
    { id: 'dashboard' as OwnerTab, label: 'Executive Dashboard', icon: LayoutDashboard },
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
    </aside>
  );
};

