import React from 'react';
import { LaundryStatus, PaymentStatus } from '../../types';
import { 
  PackageCheck, 
  Sparkles, 
  RotateCw, 
  Wind, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  Clock 
} from 'lucide-react';

interface StatusBadgeProps {
  status: LaundryStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className = ''
}) => {
  const getStatusConfig = (st: LaundryStatus) => {
    switch (st) {
      case 'RECEIVED':
        return {
          label: 'Received',
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          dotBg: 'bg-slate-500',
          icon: Clock,
          emoji: '⚪'
        };
      case 'WASHING':
        return {
          label: 'Washing',
          bg: 'bg-amber-50 text-amber-900 border-amber-300',
          dotBg: 'bg-amber-500 animate-pulse',
          icon: RotateCw,
          emoji: '🟡'
        };
      case 'DRYING':
        return {
          label: 'Drying',
          bg: 'bg-sky-50 text-sky-900 border-sky-300',
          dotBg: 'bg-sky-500 animate-pulse',
          icon: Wind,
          emoji: '🔵'
        };
      case 'FOLDING':
        return {
          label: 'Folding & Press',
          bg: 'bg-purple-50 text-purple-900 border-purple-300',
          dotBg: 'bg-purple-500',
          icon: Layers,
          emoji: '🟣'
        };
      case 'READY':
        return {
          label: 'Ready for Pickup',
          bg: 'bg-emerald-100 text-emerald-950 border-emerald-400 font-semibold',
          dotBg: 'bg-emerald-600 ring-2 ring-emerald-300 ring-offset-1',
          icon: Sparkles,
          emoji: '🟢'
        };
      case 'COMPLETED':
        return {
          label: 'Completed',
          bg: 'bg-teal-50 text-teal-800 border-teal-300',
          dotBg: 'bg-teal-600',
          icon: CheckCircle2,
          emoji: '✅'
        };
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          bg: 'bg-rose-50 text-rose-800 border-rose-300',
          dotBg: 'bg-rose-500',
          icon: XCircle,
          emoji: '🔴'
        };
      default:
        return {
          label: st,
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          dotBg: 'bg-slate-500',
          icon: Clock,
          emoji: '⚪'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1 border',
    md: 'text-xs font-medium px-2.5 py-1 gap-1.5 border',
    lg: 'text-sm font-semibold px-3.5 py-1.5 gap-2 border shadow-xs'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  return (
    <span
      id={`status-badge-${status.toLowerCase()}`}
      className={`inline-flex items-center rounded-full transition-colors ${sizeClasses[size]} ${config.bg} ${className}`}
    >
      {showIcon && (
        <Icon 
          size={iconSizes[size]} 
          className={status === 'WASHING' ? 'animate-spin' : ''} 
        />
      )}
      <span>{config.label}</span>
    </span>
  );
};

export const PaymentBadge: React.FC<{ status: PaymentStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md'
}) => {
  const sizeClasses = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5';

  if (status === 'PAID') {
    return (
      <span className={`inline-flex items-center font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}>
        Paid
      </span>
    );
  }
  if (status === 'PARTIAL') {
    return (
      <span className={`inline-flex items-center font-semibold rounded-md bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses}`}>
        Partial
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center font-semibold rounded-md bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses}`}>
      Unpaid
    </span>
  );
};
