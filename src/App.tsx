import React from 'react';
import { LaundryProvider, useLaundry } from './context/LaundryContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';

// Customer Components
import { CustomerTracker } from './components/customer/CustomerTracker';

// Auth Components
import { LoginView } from './components/auth/LoginView';
import { AuthModal } from './components/auth/AuthModal';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TicketManagement } from './components/admin/TicketManagement';
import { CreateTicketView } from './components/admin/CreateTicketView';
import { CustomerManagement } from './components/admin/CustomerManagement';
import { ServicesManagement } from './components/admin/ServicesManagement';
import { PaymentsLedger } from './components/admin/PaymentsLedger';
import { ExpensesManagement } from './components/admin/ExpensesManagement';

// Owner Components
import { OwnerDashboard } from './components/owner/OwnerDashboard';
import { ReportsView } from './components/owner/ReportsView';
import { OwnerExpensesTracker } from './components/owner/OwnerExpensesTracker';

// Settings Component
import { SettingsView } from './components/settings/SettingsView';

// Global Modals & Notifications
import { ClaimStubModal } from './components/common/ClaimStubModal';
import { TicketDetailModal } from './components/admin/TicketDetailModal';
import { PaymentSettlementModal } from './components/common/PaymentSettlementModal';
import { ToastContainer } from './components/common/Toast';
import { Lock, LogOut, ShieldAlert } from 'lucide-react';

const AppContent: React.FC = () => {
  const { role, setRole, adminTab, ownerTab, currentUser, logout, setIsAuthModalOpen, setAuthModalTargetRole } = useLaundry();

  const isFixedLogin = !currentUser && role !== 'CUSTOMER';

  const renderContent = () => {
    // 1. Customer Tracking Interface (Public access or selected from profile menu)
    if (role === 'CUSTOMER') {
      return <CustomerTracker />;
    }

    // 2. If unauthenticated, show the Login View page
    if (!currentUser) {
      return <LoginView initialRole={role === 'OWNER' ? 'OWNER' : 'ADMIN'} />;
    }

    // 3. Boss / Owner Executive Interface (Requires OWNER role)
    if (role === 'OWNER') {
      if (currentUser.role !== 'OWNER') {
        return (
          <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-xs">
              <Lock size={28} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Boss UI Access Restricted</h2>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                You are currently signed in as Staff member <strong className="text-slate-900">{currentUser.name}</strong>. Per strict security rules, staff accounts cannot enter the Boss / Owner UI.
              </p>
            </div>
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs text-amber-900 text-left space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-amber-600 shrink-0" />
                <span>Logout Required</span>
              </p>
              <p className="text-[11px] text-amber-800">
                You must log out of your staff account first to enter the Boss / Owner UI.
              </p>
            </div>
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => {
                  logout();
                  setAuthModalTargetRole('OWNER');
                  setIsAuthModalOpen(true);
                }}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <LogOut size={15} />
                <span>Log Out & Sign in as Boss</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('ADMIN')}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Return to Staff Dashboard
              </button>
            </div>
          </div>
        );
      }

      switch (ownerTab) {
        case 'dashboard':
          return <OwnerDashboard />;
        case 'tickets':
          return <TicketManagement />;
        case 'customers':
          return <CustomerManagement />;
        case 'services':
          return <ServicesManagement />;
        case 'revenue':
          return <PaymentsLedger />;
        case 'expenses':
          return <OwnerExpensesTracker />;
        case 'analytics':
          return <OwnerDashboard />;
        case 'reports':
          return <ReportsView />;
        case 'settings':
          return <SettingsView />;
        default:
          return <OwnerDashboard />;
      }
    }

    // 4. Staff / Admin Operations Interface (Focused POS & Shift Floor)
    switch (adminTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'tickets':
        return <TicketManagement />;
      case 'create-ticket':
        return <CreateTicketView />;
      case 'customers':
        return <CustomerManagement />;
      case 'payments':
        return <PaymentsLedger />;
      case 'expenses':
        return <ExpensesManagement />;
      case 'reports':
        return <ReportsView />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className={`${isFixedLogin ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-slate-100/60 flex flex-col font-sans text-slate-900 selection:bg-emerald-500 selection:text-white`}>
      {/* Universal Top Header with 3-Role Switcher */}
      <Header />

      {/* Main Body Layout */}
      <div className={`flex-1 flex max-w-7xl w-full mx-auto ${isFixedLogin ? 'overflow-hidden' : ''}`}>
        {/* Desktop Sidebar (Only for Admin / Owner when authenticated) */}
        {currentUser && <Sidebar />}

        {/* Dynamic Viewport Area */}
        <main className={`flex-1 min-w-0 ${isFixedLogin ? 'flex items-center justify-center p-2 sm:p-4 overflow-hidden' : `p-4 sm:p-6 lg:p-8 pb-24 lg:pb-10 ${role === 'CUSTOMER' ? 'p-0 sm:p-0 lg:p-0' : ''}`}`}>
          {renderContent()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      {currentUser && <MobileNav />}

      {/* Footer */}
      <footer className={`${isFixedLogin ? 'py-2.5 sm:py-3 shrink-0' : 'py-4'} text-center text-xs text-slate-500 border-t border-slate-200 bg-white/50`}>
        Developed by Luis Miguel Antonio T. Abada
      </footer>

      {/* Global Modals */}
      <ClaimStubModal />
      <TicketDetailModal />
      <PaymentSettlementModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <LaundryProvider>
      <AppContent />
    </LaundryProvider>
  );
}
