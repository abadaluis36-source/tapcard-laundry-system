import React from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { UserRole } from '../../types';
import { 
  PlusCircle, 
  Store, 
  Smartphone, 
  ShieldAlert, 
  TrendingUp, 
  UserCheck, 
  Sparkles,
  Layers,
  Lock,
  LogOut,
  User,
  KeyRound
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    role, 
    setRole, 
    setIsCreateTicketOpen,
    setAdminTab,
    currentUser,
    logout,
    setIsAuthModalOpen,
    setAuthModalTargetRole
  } = useLaundry();

  const handleRoleSelect = (targetRole: UserRole) => {
    if (targetRole === 'CUSTOMER') {
      setRole('CUSTOMER');
      return;
    }

    if (!currentUser) {
      setAuthModalTargetRole(targetRole);
      setIsAuthModalOpen(true);
      setRole(targetRole);
      return;
    }

    // If logged in as ADMIN trying to open OWNER, or vice versa
    if (targetRole === 'OWNER' && currentUser.role !== 'OWNER') {
      setAuthModalTargetRole('OWNER');
      setIsAuthModalOpen(true);
      return;
    }

    setRole(targetRole);
  };

  return (
    <header 
      id="pera-main-header"
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => {
                if (role === 'CUSTOMER') setRole('ADMIN');
              }}
              className="cursor-pointer flex items-center gap-2.5 group"
            >
              {/* Logo Coin / Washing Machine mark */}
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs font-black text-lg border border-slate-700 relative overflow-hidden group-hover:bg-slate-800 transition-colors">
                <span className="text-emerald-400 font-extrabold text-lg">₱</span>
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm sm:text-base md:text-lg text-slate-900 tracking-tight leading-none whitespace-nowrap">
                    TAPCARD LAUNDRY SHOP
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 hidden sm:inline-block leading-tight">
                  Management & Tracking System
                </span>
              </div>
            </div>

            {/* Branch pill on tablet/desktop */}
            <div className="hidden md:flex items-center gap-1.5 ml-2 pl-3 border-l border-slate-200 text-xs text-slate-500">
              <Store size={13} className="text-slate-400" />
              <span className="font-medium text-slate-700">Makati Central Branch</span>
            </div>
          </div>

          {/* Center / Right: 3-Way Role Switcher Bar & Auth Status */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Live Role Switcher */}
            <div 
              id="role-switcher-container"
              className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center shadow-xs"
            >
              <button
                id="role-switch-admin-btn"
                onClick={() => handleRoleSelect('ADMIN')}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  role === 'ADMIN'
                    ? 'bg-white text-slate-900 shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
                title="Operational interface for staff counter, ticketing, and laundry wash workflows"
              >
                <UserCheck size={14} className={role === 'ADMIN' ? 'text-emerald-600' : 'text-slate-400'} />
                <span className="hidden sm:inline">Staff / Admin</span>
                <span className="sm:hidden">Staff</span>
              </button>

              <button
                id="role-switch-owner-btn"
                onClick={() => handleRoleSelect('OWNER')}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  role === 'OWNER'
                    ? 'bg-white text-slate-900 shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
                title="Executive business overview, revenue, expenses, and analytics"
              >
                <TrendingUp size={14} className={role === 'OWNER' ? 'text-indigo-600' : 'text-slate-400'} />
                <span className="hidden sm:inline">Boss / Owner</span>
                <span className="sm:hidden">Owner</span>
              </button>

              <button
                id="role-switch-customer-btn"
                onClick={() => handleRoleSelect('CUSTOMER')}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  role === 'CUSTOMER'
                    ? 'bg-emerald-600 text-white shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
                title="Simplified mobile-first tracking view for end customers"
              >
                <Smartphone size={14} className={role === 'CUSTOMER' ? 'text-white' : 'text-slate-400'} />
                <span className="hidden sm:inline">Customer View</span>
                <span className="sm:hidden">Track</span>
              </button>
            </div>

            {/* Auth Profile / Login Button */}
            {currentUser ? (
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
                <button
                  type="button"
                  id="header-user-profile-btn"
                  onClick={() => {
                    setAuthModalTargetRole(currentUser.role);
                    setIsAuthModalOpen(true);
                  }}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 bg-slate-100 hover:bg-slate-200/80 rounded-xl border border-slate-200 text-left transition-all"
                  title="Click to switch operator or view profile"
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] text-white ${
                    currentUser.role === 'OWNER' ? 'bg-indigo-600' : 'bg-emerald-600'
                  }`}>
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="text-left leading-none">
                    <span className="block text-xs font-bold text-slate-800 leading-tight truncate max-w-[100px]">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium leading-none">
                      {currentUser.staffCode}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  id="header-logout-btn"
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                  title="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                id="header-login-btn"
                onClick={() => {
                  setAuthModalTargetRole('ADMIN');
                  setIsAuthModalOpen(true);
                }}
                className="hidden sm:inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-xs"
              >
                <Lock size={13} className="text-emerald-400" />
                <span>Log In</span>
              </button>
            )}

            {/* Quick Action Button for Admin */}
            {role === 'ADMIN' && currentUser && (
              <button
                id="header-create-ticket-btn"
                onClick={() => {
                  setAdminTab('create-ticket');
                  setIsCreateTicketOpen(true);
                }}
                className="hidden md:inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-xs active:scale-95"
              >
                <PlusCircle size={15} />
                <span>New Ticket</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

