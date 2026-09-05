import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Shield, 
  Store,
  Sparkles,
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
  const { login, storeProfile } = useLaundry();
  
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'OWNER'>(initialRole);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state whenever initialRole changes
  useEffect(() => {
    setSelectedRole(initialRole);
    setErrorMessage(null);
    setUsername('');
    setPassword('');
  }, [initialRole]);

  const handleRoleToggle = (role: 'ADMIN' | 'OWNER') => {
    setSelectedRole(role);
    setErrorMessage(null);
    setUsername('');
    setPassword('');
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
    <div className={`w-full ${isModal ? '' : 'flex items-center justify-center p-2 sm:p-3'}`}>
      <div className="w-full max-w-md mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        
        {/* Header Branding */}
        <div className="p-5 sm:p-6 pb-4 text-center border-b border-slate-100 bg-linear-to-b from-slate-50/80 to-white">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">
            Wis Laundry System
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Sign in to access your management dashboard
          </p>

          {/* Simple Role Selector */}
          <div className="mt-4 grid grid-cols-2 gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 text-xs font-bold">
            <button
              type="button"
              id="auth-role-admin-btn"
              onClick={() => handleRoleToggle('ADMIN')}
              className={`py-2 px-3 rounded-xl transition-all cursor-pointer ${
                selectedRole === 'ADMIN'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Staff
            </button>
            <button
              type="button"
              id="auth-role-owner-btn"
              onClick={() => handleRoleToggle('OWNER')}
              className={`py-2 px-3 rounded-xl transition-all cursor-pointer ${
                selectedRole === 'OWNER'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Owner
            </button>
          </div>
        </div>

        {/* Clean Login Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-3.5">
          
          {errorMessage && (
            <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
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
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember me & Secure Session */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
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
            className={`w-full py-2.5 sm:py-3 rounded-xl font-bold text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer ${
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
        </form>
      </div>
    </div>
  );
};
