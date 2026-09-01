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

const AppContent: React.FC = () => {
  const { role, adminTab, ownerTab, currentUser } = useLaundry();

  const renderContent = () => {
    // 1. Customer Tracking Interface (Public access)
    if (role === 'CUSTOMER') {
      return <CustomerTracker />;
    }

    // 2. If unauthenticated on Admin or Owner, show the Login View
    if (!currentUser) {
      return <LoginView initialRole={role} />;
    }

    // 3. Boss / Owner Executive Interface (Requires OWNER role)
    if (role === 'OWNER') {
      if (currentUser.role !== 'OWNER') {
        return <LoginView initialRole="OWNER" />;
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
    <div className="min-h-screen bg-slate-100/60 flex flex-col font-sans text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Universal Top Header with 3-Role Switcher */}
      <Header />

      {/* Main Body Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar (Only for Admin / Owner when authenticated) */}
        {currentUser && <Sidebar />}

        {/* Dynamic Viewport Area */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 min-w-0 pb-24 lg:pb-10 ${role === 'CUSTOMER' ? 'p-0 sm:p-0 lg:p-0' : ''}`}>
          {renderContent()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      {currentUser && <MobileNav />}

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
