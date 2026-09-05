import React, { useState, useRef, useEffect } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { UserRole } from '../../types';
import { 
  PlusCircle, 
  Store, 
  ShieldAlert, 
  TrendingUp, 
  UserCheck, 
  Sparkles,
  Layers,
  Lock,
  LogOut,
  User,
  KeyRound,
  ChevronDown,
  RefreshCw,
  Search
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
    setAuthModalTargetRole,
    storeProfile,
    addToast
  } = useLaundry();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSelect = (targetRole: UserRole) => {
    if (targetRole === 'CUSTOMER') {
      setRole('CUSTOMER');
      return;
    }

    // Role-Based Access Control (RBAC): Switching roles requires authenticating through the login form
    setAuthModalTargetRole(targetRole);
    setIsAuthModalOpen(true);
  };

  return (
    <header 
      id="pera-main-header"
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          
          {/* Brand Logo & Name (Compact for mobile, no horizontal overflow) */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div 
              onClick={() => {
                if (role === 'CUSTOMER') setRole('ADMIN');
              }}
              className="cursor-pointer flex items-center gap-2 group min-w-0"
            >
              <div className="min-w-0">
                <span className="font-extrabold text-sm sm:text-base md:text-lg text-slate-900 tracking-tight leading-none truncate block">
                  {storeProfile?.shopName || 'Wis Laundry System'}
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 hidden sm:inline-block leading-tight">
                  Management & Tracking System
                </span>
              </div>
            </div>

            {/* Branch pill on desktop only */}
            <div className="hidden md:flex items-center gap-1.5 ml-2 pl-3 border-l border-slate-200 text-xs text-slate-500">
              <Store size={13} className="text-slate-400" />
              <span className="font-medium text-slate-700">Taguig</span>
            </div>
          </div>



          {/* Right Area: Profile / Account Button for All Screen Sizes */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Action Button for Admin on large screens */}
            {role === 'ADMIN' && currentUser && (
              <button
                id="header-create-ticket-btn"
                onClick={() => {
                  setAdminTab('create-ticket');
                  setIsCreateTicketOpen(true);
                }}
                className="hidden lg:inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <PlusCircle size={15} />
                <span>New Ticket</span>
              </button>
            )}

            {/* Profile / Account Dropdown Button (Accessible on Mobile & Desktop) */}
            <div className="relative" ref={profileMenuRef}>
              {currentUser ? (
                <div>
                  <button
                    type="button"
                    id="header-profile-menu-btn"
                    onClick={() => setIsProfileMenuOpen(prev => !prev)}
                    className="flex items-center gap-1.5 sm:gap-2 p-1 sm:pl-1.5 sm:pr-2.5 bg-slate-100 hover:bg-slate-200/80 rounded-xl border border-slate-200/90 text-left transition-all cursor-pointer select-none active:scale-95 shadow-2xs"
                    title="Account profile, switch role or log out"
                  >
                    {currentUser.avatarUrl ? (
                      <img 
                        src={currentUser.avatarUrl} 
                        alt={currentUser.name} 
                        className="w-7 h-7 sm:w-7 sm:h-7 rounded-lg object-cover shadow-xs ring-1 ring-slate-200" 
                      />
                    ) : (
                      <div className={`w-7 h-7 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center font-black text-xs text-white shadow-xs ${
                        currentUser.role === 'OWNER' ? 'bg-indigo-600' : 'bg-emerald-600'
                      }`}>
                        {(currentUser.role === 'OWNER' ? (storeProfile.ownerName || currentUser.name) : currentUser.name).charAt(0)}
                      </div>
                    )}
                    <div className="hidden sm:block text-left leading-none">
                      <span className="block text-xs font-bold text-slate-800 leading-tight truncate max-w-[110px]">
                        {currentUser.role === 'OWNER' ? (storeProfile.ownerName || currentUser.name) : currentUser.name.split(' ')[0]}
                      </span>
                      <span className="text-[9px] text-slate-500 font-medium leading-none font-mono">
                        {currentUser.role === 'OWNER' ? 'Owner' : 'Staff'}
                      </span>
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileMenuOpen ? 'rotate-180 text-slate-700' : ''}`} />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div 
                      id="profile-dropdown-menu"
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    >
                      {/* User Identity info */}
                      <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/70">
                        <div className="flex items-center gap-2.5">
                          {currentUser.avatarUrl ? (
                            <img 
                              src={currentUser.avatarUrl} 
                              alt={currentUser.name} 
                              className="w-9 h-9 rounded-xl object-cover shadow-xs ring-1 ring-slate-200" 
                            />
                          ) : (
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm text-white shadow-xs ${
                              currentUser.role === 'OWNER' ? 'bg-indigo-600' : 'bg-emerald-600'
                            }`}>
                              {(currentUser.role === 'OWNER' ? (storeProfile.ownerName || currentUser.name) : currentUser.name).charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {currentUser.role === 'OWNER' ? (storeProfile.ownerName || currentUser.name) : currentUser.name}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">
                              {currentUser.role === 'OWNER' ? 'Owner' : 'Staff'}
                              {currentUser.role !== 'OWNER' && currentUser.staffCode && ` • ${currentUser.staffCode}`}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Switch Account / Role Options for Mobile & Desktop */}
                      <div className="p-1.5 space-y-0.5 border-b border-slate-100">
                        <span className="px-2.5 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                          Switch Role / View
                        </span>

                        <button
                          type="button"
                          id="profile-menu-switch-staff-btn"
                          onClick={() => {
                            handleRoleSelect('ADMIN');
                            setIsProfileMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                            role === 'ADMIN' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <UserCheck size={14} className={role === 'ADMIN' ? 'text-emerald-600' : 'text-slate-400'} />
                            <span>Staff Account</span>
                          </div>
                          {role === 'ADMIN' ? (
                            <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded">Active</span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium">Log in</span>
                          )}
                        </button>

                        {/* Owner Role Option - Requires Owner authentication via login form under RBAC */}
                        <button
                          type="button"
                          id="profile-menu-switch-owner-btn"
                          onClick={() => {
                            handleRoleSelect('OWNER');
                            setIsProfileMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                            role === 'OWNER' ? 'bg-indigo-50 text-indigo-800 font-bold' : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <TrendingUp size={14} className={role === 'OWNER' ? 'text-indigo-600' : 'text-slate-400'} />
                            <span>Owner / Boss</span>
                          </div>
                          {role === 'OWNER' ? (
                            <span className="text-[10px] bg-indigo-600 text-white font-bold px-1.5 py-0.2 rounded">Active</span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-0.5">
                              <Lock size={10} />
                              <span>Log in</span>
                            </span>
                          )}
                        </button>

                        {/* Customer Tracking View option */}
                        <button
                          type="button"
                          id="profile-menu-customer-tracking-btn"
                          onClick={() => {
                            handleRoleSelect('CUSTOMER');
                            setIsProfileMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                            role === 'CUSTOMER' ? 'bg-sky-50 text-sky-800 font-bold' : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Search size={14} className={role === 'CUSTOMER' ? 'text-sky-600' : 'text-slate-400'} />
                            <span>Customer Tracking</span>
                          </div>
                          {role === 'CUSTOMER' && <span className="text-[10px] bg-sky-600 text-white font-bold px-1.5 py-0.2 rounded">Active</span>}
                        </button>
                      </div>

                      {/* Account Management & Log Out */}
                      <div className="p-1.5 space-y-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 text-left transition-colors cursor-pointer"
                        >
                          <LogOut size={14} />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  id="header-login-btn"
                  onClick={() => {
                    setAuthModalTargetRole('ADMIN');
                    setIsAuthModalOpen(true);
                  }}
                  disabled={!currentUser && role !== 'CUSTOMER'}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 sm:py-2 rounded-xl transition-all shadow-xs ${
                    !currentUser && role !== 'CUSTOMER'
                      ? 'bg-slate-900 text-white cursor-not-allowed'
                      : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95 cursor-pointer'
                  }`}
                >
                  <User size={13} className={!currentUser && role !== 'CUSTOMER' ? 'text-emerald-400' : 'text-emerald-400'} />
                  <span>Log In</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

