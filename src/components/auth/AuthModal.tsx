import React from 'react';
import { X } from 'lucide-react';
import { useLaundry } from '../../context/LaundryContext';
import { LoginView } from './LoginView';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authModalTargetRole } = useLaundry();

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute -top-3 -right-3 z-10 p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-full shadow-lg border border-slate-200 transition-transform active:scale-95 cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <LoginView 
          initialRole={authModalTargetRole} 
          isModal={true}
          onSuccess={() => setIsAuthModalOpen(false)}
        />
      </div>
    </div>
  );
};
