import React, { useState } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { OWNER_ANALYTICS } from '../../mockData';
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
  FileSpreadsheet
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
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
  const { setOwnerTab } = useLaundry();
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly'>('weekly');

  const { 
    todayRevenue, 
    monthlyRevenue, 
    ordersCount, 
    completedCount, 
    pendingCount, 
    expensesTotal, 
    netRevenue,
    revenueTrend,
    monthlyTrend,
    popularServices,
    statusBreakdown,
    peakHours
  } = OWNER_ANALYTICS;

  const currentTrendData = (timeRange === 'weekly' ? revenueTrend : monthlyTrend).map(item => ({
    label: 'day' in item ? item.day : item.month,
    revenue: item.revenue,
    expenses: item.expenses,
    net: item.net,
  }));

  const statusData = [
    { name: 'Received', value: statusBreakdown.received, color: '#94a3b8' },
    { name: 'Washing', value: statusBreakdown.washing, color: '#f59e0b' },
    { name: 'Drying', value: statusBreakdown.drying, color: '#0284c7' },
    { name: 'Folding', value: statusBreakdown.folding, color: '#9333ea' },
    { name: 'Ready', value: statusBreakdown.ready, color: '#10b981' },
    { name: 'Completed', value: statusBreakdown.completed, color: '#0d9488' }
  ];

  return (
    <div id="owner-dashboard-view" className="space-y-6">
      
      {/* Executive Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
              Executive Business Intelligence
            </span>
            <span className="text-xs text-slate-400">Tapcard Laundry Shop</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
            Owner Financial & Operations Health
          </h1>
          <p className="text-xs text-slate-300">
            Real-time profit & loss, unit economics, service margins, and customer retention
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOwnerTab('reports')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2"
          >
            <BarChart3 size={15} />
            <span>View Full Financial Reports</span>
          </button>
        </div>
      </div>

      {/* Top Financial Health KPIs (Section 15 Exact Metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Today's Revenue */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Today's Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              ₱
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
            ₱{todayRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 pt-1">
            <ArrowUpRight size={13} />
            <span>47 Orders processed today</span>
          </span>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Monthly Gross Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
              <TrendingUp size={14} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
            ₱{monthlyRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-indigo-600 font-semibold block pt-1">
            August 2026 MTD
          </span>
        </div>

        {/* Monthly Expenses */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Expenses (P&L)</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
              <Receipt size={14} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-700 font-mono tracking-tight">
            ₱{expensesTotal.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 block pt-1">
            22.9% expense-to-revenue ratio
          </span>
        </div>

        {/* Net Revenue / Profit */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/70 p-4 sm:p-5 rounded-2xl border border-emerald-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-xs font-extrabold uppercase tracking-wider">Net Monthly Profit</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              <DollarSign size={14} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-mono tracking-tight">
            ₱{netRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-700 font-bold block pt-1">
            77.1% Net Operating Margin
          </span>
        </div>

      </div>

      {/* Secondary Operational Counters */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Total Orders</span>
            <span className="text-xl font-extrabold font-mono text-slate-900">{ordersCount}</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <ShoppingBag size={16} />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Completed Pickups</span>
            <span className="text-xl font-extrabold font-mono text-emerald-700">{completedCount}</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={16} />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Pending in Pipeline</span>
            <span className="text-xl font-extrabold font-mono text-amber-700">{pendingCount}</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock size={16} />
          </div>
        </div>
      </div>

      {/* Main Charts Row: Revenue & Profit Trend (Section 15) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Revenue Trend Area Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-extrabold text-base text-slate-900 tracking-tight">
                Revenue & Profitability Trend
              </h2>
              <p className="text-xs text-slate-500">
                Gross sales compared with shop expenses and net take-home
              </p>
            </div>

            {/* Time toggle */}
            <div className="bg-slate-100 p-0.5 rounded-xl border border-slate-200 flex text-xs font-semibold self-start sm:self-auto">
              <button
                onClick={() => setTimeRange('weekly')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeRange === 'weekly' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500'
                }`}
              >
                7 Days (Weekly)
              </button>
              <button
                onClick={() => setTimeRange('monthly')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeRange === 'monthly' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500'
                }`}
              >
                6 Months (MTD)
              </button>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
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
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Gross Revenue" 
                  stroke="#10b981" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="net" 
                  name="Net Profit" 
                  stroke="#6366f1" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorNet)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="font-semibold text-slate-700">Gross Sales</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="font-semibold text-slate-700">Net Profit</span>
            </div>
          </div>
        </div>

        {/* Right: Popular Services Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-base text-slate-900 tracking-tight">
                Popular Services
              </h2>
              <PieChartIcon size={16} className="text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Service share and revenue distribution
            </p>
          </div>

          {/* Progress list matching Section 15: Wash & Fold 45%, Dry Clean 25%, Ironing 18%, Other 12% */}
          <div className="space-y-3.5 my-auto">
            {popularServices.map((srv) => (
              <div key={srv.name} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{srv.name}</span>
                  <span className="font-mono font-extrabold text-slate-900">{srv.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${srv.percentage}%`, backgroundColor: srv.color }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{srv.count} orders</span>
                  <span className="font-mono text-emerald-700 font-semibold">₱{srv.revenue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
            <strong className="text-slate-800">Observation:</strong> Wash & Fold provides 45% of orders but Dry Cleaning yields the highest per-ticket margin.
          </div>
        </div>

      </div>

      {/* Secondary Analytics Row: Peak Rush Hours & Laundry Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Peak Rush Hours (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div>
            <h2 className="font-extrabold text-base text-slate-900 tracking-tight">
              Customer Rush Hours (Drop-off & Pickup)
            </h2>
            <p className="text-xs text-slate-500">
              Staff scheduling optimizer based on customer arrival volume
            </p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHours} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '10px', fontSize: '12px' }}
                />
                <Bar dataKey="volume" name="Orders Volume" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Laundry Status Funnel (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div>
            <h2 className="font-extrabold text-base text-slate-900 tracking-tight">
              Laundry Status Distribution
            </h2>
            <p className="text-xs text-slate-500">
              Current operational throughput across all machines
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            {statusData.map((st) => (
              <div 
                key={st.name} 
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: st.color }} />
                  <span className="text-[11px] font-bold text-slate-600 uppercase">{st.name}</span>
                </div>
                <span className="text-2xl font-extrabold font-mono text-slate-900 mt-2">
                  {st.value}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 flex items-center justify-between">
            <span>Machine Utilization: <strong>88% Optimal Capacity</strong></span>
            <span className="font-mono font-bold">No backlogs</span>
          </div>
        </div>

      </div>

    </div>
  );
};
