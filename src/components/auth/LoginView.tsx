import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Shield, 
  Store,
  Sparkles,
  Smartphone,
  AlertCircle
} from 'lucide-react';
import { useLaundry } from '../../context/LaundryContext';

interface LoginViewProps {
  initialRole?: 'ADMIN' | 'OWNER';
  onSuccess?: () => void;
  isModal?: boolean;
}

export const LoginView: React.FC<LoginViewProps> = ({ 
  initialRole = 'ADMIN',
  onSuccess,
  isModal = false 
}) => {
  const { login, setRole, setIsAuthModalOpen } = useLaundry();
  
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'OWNER'>(initialRole);
  const [username, setUsername] = useState(initialRole === 'OWNER' ? 'owner' : 'admin');
  const [password, setPassword] = useState(initialRole === 'OWNER' ? '8888' : '1234');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRoleToggle = (role: 'ADMIN' | 'OWNER') => {
    setSelectedRole(role);
    setErrorMessage(null);
    if (role === 'ADMIN') {
      setUsername('admin');
      setPassword('1234');
    } else {
      setUsername('owner');
      setPassword('8888');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMessage('Please enter your username or email.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      const result = login(username, password, selectedRole);
      setIsLoading(false);

      if (result.success) {
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setErrorMessage(result.message || 'Invalid username or password.');
      }
    }, 300);
  };

  return (
    <div className={`w-full ${isModal ? '' : 'min-h-[80vh] flex items-center justify-center p-4 sm:p-6'}`}>
      <div className="w-full max-w-md mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        
        {/* Header Branding */}
        <div className="p-7 sm:p-8 pb-6 text-center border-b border-slate-100 bg-linear-to-b from-slate-50/80 to-white">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 text-white font-extrabold text-2xl shadow-lg shadow-emerald-600/25 mb-3.5 ring-4 ring-emerald-50">
            ₱
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">
            Tapcard Laundry Shop
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Sign in to access your management dashboard
          </p>

          {/* Simple Role Selector */}
          <div className="mt-5 grid grid-cols-2 gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 text-xs font-bold">
            <button
              type="button"
              id="auth-role-admin-btn"
              onClick={() => handleRoleToggle('ADMIN')}
              className={`py-2 px-3 rounded-xl transition-all ${
                selectedRole === 'ADMIN'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Staff / Admin POS
            </button>
            <button
              type="button"
              id="auth-role-owner-btn"
              onClick={() => handleRoleToggle('OWNER')}
              className={`py-2 px-3 rounded-xl transition-all ${
                selectedRole === 'OWNER'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Owner / Executive
            </button>
          </div>
        </div>

        {/* Clean Login Form */}
        <form onSubmit={handleSubmit} className="p-7 sm:p-8 space-y-4">
          
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              <AlertCircle size={15} className="shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Username Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Username or Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User size={17} />
              </div>
              <input
                type="text"
                id="login-username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setErrorMessage(null); }}
                placeholder="e.g. admin or owner"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {selectedRole === 'ADMIN' ? 'Default: 1234' : 'Default: 8888'}
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock size={17} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMessage(null); }}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember me & Demo quick-fill */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <span className="text-xs text-slate-600 font-medium">Keep me signed in</span>
            </label>

            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Shield size={12} className="text-emerald-500" />
              <span>Secure Session</span>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            id="login-submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer ${
              selectedRole === 'ADMIN'
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Quick Demo Credentials Assistant */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 text-center mb-2">
              Quick 1-Click Credentials:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('ADMIN');
                  setUsername('admin');
                  setPassword('1234');
                  setErrorMessage(null);
                }}
                className="p-2 bg-slate-50 hover:bg-emerald-50/80 border border-slate-200 hover:border-emerald-200 rounded-xl text-left transition-all group"
              >
                <span className="block text-[11px] font-bold text-slate-700 group-hover:text-emerald-700">
                  Admin (Staff)
                </span>
                <span className="block text-[10px] text-slate-400 font-mono">
                  admin / 1234
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('OWNER');
                  setUsername('owner');
                  setPassword('8888');
                  setErrorMessage(null);
                }}
                className="p-2 bg-slate-50 hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-200 rounded-xl text-left transition-all group"
              >
                <span className="block text-[11px] font-bold text-slate-700 group-hover:text-indigo-700">
                  Owner (Executive)
                </span>
                <span className="block text-[10px] text-slate-400 font-mono">
                  owner / 8888
                </span>
              </button>
            </div>
          </div>

          {/* Customer tracker link */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setRole('CUSTOMER');
                setIsAuthModalOpen(false);
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600 font-semibold transition-colors"
            >
              <Smartphone size={13} />
              <span>Back to Customer Laundry Tracker</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
