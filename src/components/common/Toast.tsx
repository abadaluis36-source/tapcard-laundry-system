import React from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { CheckCircle2, AlertCircle, Info, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useLaundry();

  return (
    <div 
      id="pera-toast-container"
      className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 max-w-sm w-full px-4 pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="pointer-events-auto w-full bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3.5 shadow-2xl border border-slate-700/80 flex items-start gap-3"
            >
              <div className="mt-0.5 shrink-0">
                {toast.type === 'success' && <CheckCircle2 className="text-emerald-400" size={18} />}
                {toast.type === 'info' && <Sparkles className="text-sky-400" size={18} />}
                {toast.type === 'warning' && <AlertCircle className="text-amber-400" size={18} />}
                {toast.type === 'error' && <AlertCircle className="text-rose-400" size={18} />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-slate-100">{toast.title}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{toast.timestamp}</span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed break-words">{toast.message}</p>
              </div>

              <button
                id={`toast-dismiss-${toast.id}`}
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
