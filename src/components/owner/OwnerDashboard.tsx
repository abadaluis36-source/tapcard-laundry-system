import React, { useState, useMemo } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  Receipt, 
  BarChart3, 
  PieChart as PieChartIcon, 
  ArrowUpRight, 
  Calendar,
  Layers,
  Sparkles,
  Download,
  FileSpreadsheet,
  Wallet,
  Banknote,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  Building2,
  Zap,
  Droplets,
  Package
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  Cell, 
  PieChart, 
  Pie, 
  Legend 
} from 'recharts';

export const OwnerDashboard: React.FC = () => {
  const { 
    setOwnerTab, 
    payments, 
    expenses, 
    tickets, 
    services, 
    customers, 
    addToast 
  } = useLaundry();

  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const yAxisDomain = useMemo(() => timeRange === 'weekly' ? [0, 8000] : [1000, 30000], [timeRange]);

  const revenueOnSelectedDate = useMemo(() => {
    return payments
      .filter(p => p.date && p.date.substring(0, 10) === selectedDate)
      .reduce((sum, p) => sum + p.amount, 0);
  }, [payments, selectedDate]);

  // ==========================================
  // 1. FINANCIAL REPORTS DATA AGGREGATION
  // ==========================================

  // Date helpers
  const todayDate = new Date();
  const todayStr = todayDate.toISOString().substring(0, 10);
  
  const d7DaysAgoDate = new Date();
  d7DaysAgoDate.setDate(todayDate.getDate() - 6);
  const d7DaysAgoStr = d7DaysAgoDate.toISOString().substring(0, 10);
  
  const d30DaysAgoDate = new Date();
  d30DaysAgoDate.setDate(todayDate.getDate() - 29);
  const d30DaysAgoStr = d30DaysAgoDate.toISOString().substring(0, 10);

  // KPIs Aggregation
  const totalRevenue = useMemo(() => {
    return payments.reduce((sum, p) => sum + (p.paymentStatus === 'PAID' ? p.amount : p.amount), 0);
  }, [payments]);

  const revenueToday = useMemo(() => {
    return payments
      .filter(p => p.date && p.date.substring(0, 10) === todayStr)
      .reduce((sum, p) => sum + p.amount, 0);
  }, [payments, todayStr]);

  const revenueWeekly = useMemo(() => {
    return payments
      .filter(p => p.date && p.date.substring(0, 10) >= d7DaysAgoStr && p.date.substring(0, 10) <= todayStr)
      .reduce((sum, p) => sum + p.amount, 0);
  }, [payments, d7DaysAgoStr, todayStr]);

  const revenueMonthly = useMemo(() => {
    return payments
      .filter(p => p.date && p.date.substring(0, 10) >= d30DaysAgoStr && p.date.substring(0, 10) <= todayStr)
      .reduce((sum, p) => sum + p.amount, 0);
  }, [payments, d30DaysAgoStr, todayStr]);

  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  // Payment Method Breakdown from Financial Reports
  const paymentMethodStats = useMemo(() => {
    let cash = 0;
    let gcash = 0;
    let maya = 0;

    payments.forEach(p => {
      if (p.paymentMethod === 'CASH') cash += p.amount;
      else if (p.paymentMethod === 'GCASH') gcash += p.amount;
      else if (p.paymentMethod === 'MAYA') maya += p.amount;
      else cash += p.amount;
    });

    const total = cash + gcash + maya || 1;
    return {
      cash,
      cashPct: Math.round((cash / total) * 100),
      gcash,
      gcashPct: Math.round((gcash / total) * 100),
      maya,
      mayaPct: Math.round((maya / total) * 100),
      total
    };
  }, [payments]);

  // Expense Categories Breakdown from Financial Reports
  const expenseCategoryStats = useMemo(() => {
    const map = new Map<string, number>();
    expenses.forEach(e => {
      const cat = e.category || 'General';
      map.set(cat, (map.get(cat) || 0) + e.amount);
    });

    return Array.from(map.entries())
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses, totalExpenses]);

  // ==========================================
  // 2. DYNAMIC REVENUE & PROFIT TRENDS
  // ==========================================
  const trendData = useMemo(() => {
    if (timeRange === 'weekly') {
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 is Sun, 1 is Mon, ... 6 is Sat
      const distToMonday = (dayOfWeek + 6) % 7;

      const monday = new Date(today);
      monday.setDate(today.getDate() - distToMonday);

      const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return d.toISOString().substring(0, 10);
      });

      const dateMap = new Map<string, { revenue: number; expenses: number }>();
      weekDays.forEach(d => dateMap.set(d, { revenue: 0, expenses: 0 }));

      payments.forEach(p => {
        const d = p.date ? p.date.substring(0, 10) : '';
        if (dateMap.has(d)) {
          dateMap.get(d)!.revenue += p.amount;
        }
      });

      expenses.forEach(e => {
        const d = e.date ? e.date.substring(0, 10) : '';
        if (dateMap.has(d)) {
          dateMap.get(d)!.expenses += e.amount;
        }
      });

      return weekDays.map(dateKey => {
        const values = dateMap.get(dateKey)!;
        const dObj = new Date(dateKey + 'T00:00:00');
        // Format label as Mon, Tue, Wed, Thu, Fri, Sat, Sun
        const label = dObj.toLocaleDateString('en-US', { weekday: 'short' });

        return {
          label,
          fullDate: dateKey,
          revenue: values.revenue,
          expenses: values.expenses,
          net: values.revenue - values.expenses
        };
      });
    } else {
      // Monthly aggregation
      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        return `${y}-${m}`;
      });

      const monthMap = new Map<string, { revenue: number; expenses: number }>();
      last6Months.forEach(m => monthMap.set(m, { revenue: 0, expenses: 0 }));

      payments.forEach(p => {
        const dateStr = p.date || '';
        let mKey = '';
        if (dateStr.length >= 7 && dateStr.includes('-')) {
          mKey = dateStr.substring(0, 7);
        } else {
          const parsed = new Date(dateStr);
          if (!isNaN(parsed.getTime())) {
            const y = parsed.getFullYear();
            const m = String(parsed.getMonth() + 1).padStart(2, '0');
            mKey = `${y}-${m}`;
          }
        }
        if (mKey) {
          if (!monthMap.has(mKey)) {
            monthMap.set(mKey, { revenue: 0, expenses: 0 });
          }
          const curr = monthMap.get(mKey)!;
          curr.revenue += p.amount;
        }
      });

      expenses.forEach(e => {
        const dateStr = e.date || '';
        let mKey = '';
        if (dateStr.length >= 7 && dateStr.includes('-')) {
          mKey = dateStr.substring(0, 7);
        } else {
          const parsed = new Date(dateStr);
          if (!isNaN(parsed.getTime())) {
            const y = parsed.getFullYear();
            const m = String(parsed.getMonth() + 1).padStart(2, '0');
            mKey = `${y}-${m}`;
          }
        }
        if (mKey) {
          if (!monthMap.has(mKey)) {
            monthMap.set(mKey, { revenue: 0, expenses: 0 });
          }
          const curr = monthMap.get(mKey)!;
          curr.expenses += e.amount;
        }
      });

      const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      return last6Months.map(mKey => {
        const values = monthMap.get(mKey) || { revenue: 0, expenses: 0 };
        const [year, month] = mKey.split('-');
        const label = `${monthNamesShort[parseInt(month, 10) - 1]} ${year}`;
        
        return {
          label,
          fullDate: mKey,
          revenue: values.revenue,
          expenses: values.expenses,
          net: values.revenue - values.expenses
        };
      });
    }
  }, [timeRange, payments, expenses]);

  // ==========================================
  // 3. SERVICE REVENUE BREAKDOWN FROM TICKETS
  // ==========================================
  const serviceStats = useMemo(() => {
    const map = new Map<string, { count: number; revenue: number }>();

    tickets.forEach(t => {
      const sName = t.serviceName || 'Wash & Fold';
      if (!map.has(sName)) map.set(sName, { count: 0, revenue: 0 });
      const entry = map.get(sName)!;
      entry.count += 1;
      entry.revenue += t.totalAmount || 0;
    });

    const colors = ['#0ea5e9', '#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
    const totalTicketRev = Array.from(map.values()).reduce((sum, v) => sum + v.revenue, 0) || 1;

    return Array.from(map.entries())
      .map(([name, data], idx) => ({
        name,
        count: data.count,
        revenue: data.revenue,
        percentage: Math.round((data.revenue / totalTicketRev) * 100),
        color: colors[idx % colors.length]
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [tickets]);

  // ==========================================
  // 4. OPERATIONAL TICKETS & STATUS FUNNEL
  // ==========================================
  const totalOrders = tickets.length;
  const completedOrders = tickets.filter(t => t.status === 'COMPLETED').length;
  const pendingOrders = tickets.filter(t => t.status !== 'COMPLETED' && t.status !== 'CANCELLED').length;

  const statusBreakdown = useMemo(() => {
    return [
      { name: 'Received', count: tickets.filter(t => t.status === 'RECEIVED').length, color: '#94a3b8' },
      { name: 'Washing', count: tickets.filter(t => t.status === 'WASHING').length, color: '#f59e0b' },
      { name: 'Drying', count: tickets.filter(t => t.status === 'DRYING').length, color: '#0284c7' },
      { name: 'Folding', count: tickets.filter(t => t.status === 'FOLDING').length, color: '#9333ea' },
      { name: 'Ready', count: tickets.filter(t => t.status === 'READY').length, color: '#10b981' },
      { name: 'Completed', count: tickets.filter(t => t.status === 'COMPLETED').length, color: '#0d9488' }
    ];
  }, [tickets]);

  return (
    <div id="owner-dashboard-view" className="space-y-6">
      
      {/* Executive Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Financial Reports Sync
            </span>
            <span className="text-xs text-slate-400 font-medium">Tapcard Laundry Shop</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
            Executive Financial & Operations Dashboard
          </h1>
          <p className="text-xs text-slate-300">
            Real-time data sourced directly from your Total Revenue files, Expense logs, and POS records
          </p>
        </div>

        <div className="flex items-center gap-2">
        </div>
      </div>

      {/* Top Financial Health KPIs - Fed from Financial Reports */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Revenue Today */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Today's Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              ₱
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
            ₱{revenueToday.toLocaleString()}
          </div>
        </div>

        {/* Revenue Weekly */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">This Week's Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
              <Calendar size={14} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
            ₱{revenueWeekly.toLocaleString()}
          </div>
        </div>

        {/* Revenue Monthly */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">This Month's Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
              <BarChart3 size={14} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
            ₱{revenueMonthly.toLocaleString()}
          </div>
        </div>

        {/* Total Expense */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Overall Expenses</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
              <Receipt size={14} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-700 font-mono tracking-tight">
            ₱{totalExpenses.toLocaleString()}
          </div>
        </div>

      </div>


      {/* Main Charts Row: Revenue & Profit Trend from Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Revenue Trend Area Chart (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-extrabold text-base text-slate-900 tracking-tight">
                Performance Overview
              </h2>
              <p className="text-xs text-slate-500">
                Comparing gross sales with net profit over selected periods
              </p>
            </div>
            
            {/* Time toggle */}
            <div className="bg-slate-100 p-0.5 rounded-xl border border-slate-200 flex text-xs font-semibold self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setTimeRange('weekly')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  timeRange === 'weekly' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500'
                }`}
              >
                Weekly
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('monthly')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  timeRange === 'monthly' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="label" 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  domain={yAxisDomain}
                  ticks={timeRange === 'weekly' ? [0, 2000, 4000, 6000, 8000] : undefined}
                  tickFormatter={(val) => `₱${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}`}
                />
                <Tooltip 
                  formatter={(val: any) => [`₱${Number(val).toLocaleString()}`, '']}
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    color: '#fff', 
                    borderRadius: '12px', 
                    fontSize: '12px', 
                    border: 'none',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Gross Sales" 
                  stroke="#10b981" 
                  strokeWidth={2.5} 
                />
                <Line 
                  type="monotone" 
                  dataKey="net" 
                  name="Net Profit" 
                  stroke="#6366f1" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="font-semibold text-slate-700">Gross Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="font-semibold text-slate-700">Net Profit</span>
            </div>
          </div>
        </div>

        {/* Right: Total Expense Trend (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-extrabold text-base text-slate-900 tracking-tight">
                Total Expense Trend
              </h2>
              <p className="text-xs text-slate-500">
                Expense tracking over selected periods
              </p>
            </div>
            
            {/* Time toggle */}
            <div className="bg-slate-100 p-0.5 rounded-xl border border-slate-200 flex text-xs font-semibold self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setTimeRange('weekly')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  timeRange === 'weekly' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500'
                }`}
              >
                Weekly
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('monthly')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  timeRange === 'monthly' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          {/* Expense trend line chart */}
          <div className="h-[310px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="label" 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  domain={yAxisDomain}
                  ticks={timeRange === 'weekly' ? [0, 2000, 4000, 6000, 8000] : undefined}
                  tickFormatter={(val) => `₱${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}`}
                />
                <Tooltip 
                  formatter={(val: any) => [`₱${Number(val).toLocaleString()}`, '']}
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    color: '#fff', 
                    borderRadius: '12px', 
                    fontSize: '12px', 
                    border: 'none',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  name="Expenses" 
                  stroke="#e11d48" 
                  strokeWidth={2.5} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-600" />
              <span className="font-semibold text-slate-700">Total Expenses</span>
            </div>
          </div>
        </div>

      </div>

      {/* Date Revenue Calendar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-base text-slate-900 tracking-tight">
              Revenue Calendar
            </h2>
            <p className="text-xs text-slate-500">
              Select a date to view total revenue
            </p>
          </div>

        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-[10px] font-bold text-slate-400 text-center py-1">{d}</div>
          ))}
          {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() }).map((_, i) => {
            const day = i + 1;
            const year = new Date().getFullYear();
            const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
            const dateStr = `${year}-${month}-${day.toString().padStart(2, '0')}`;
            const isSelected = dateStr === selectedDate;
            return (
              <button
                key={day}
                onClick={() => setSelectedDate(dateStr)}
                className={`py-2 text-xs font-semibold rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
