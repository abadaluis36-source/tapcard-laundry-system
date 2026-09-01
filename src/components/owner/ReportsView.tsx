import React, { useState } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  Filter, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Receipt, 
  CheckCircle2, 
  FileSpreadsheet,
  Layers,
  Sparkles
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { tickets, expenses, payments, todayRevenue, monthlyRevenue } = useLaundry();
  const [reportRange, setReportRange] = useState<'today' | 'week' | 'month' | 'custom'>('month');
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-08-31');

  const handleExportCSV = (reportType: string) => {
    alert(`Generating ${reportType} CSV export file... Download started.`);
  };

  const handleExportPDF = (reportType: string) => {
    alert(`Compiling official ${reportType} PDF report document... Print preview ready.`);
  };

  return (
    <div id="reports-view" className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Financial & Operational Reports
          </h1>
          <p className="text-xs text-slate-500">
            Generate auditable income statements, expense summaries, and machine reports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportCSV('Comprehensive_August_2026')}
            className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl border border-slate-300 transition-all shadow-2xs flex items-center gap-1.5"
          >
            <FileSpreadsheet size={14} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => handleExportPDF('Executive_Financial_Summary')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
          >
            <Download size={14} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Date Filter Bar (Section 16) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['today', 'week', 'month', 'custom'] as const).map((rng) => (
            <button
              key={rng}
              onClick={() => setReportRange(rng)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                reportRange === rng
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {rng === 'today' ? 'Today' : rng === 'week' ? 'This Week' : rng === 'month' ? 'This Month (August)' : 'Custom Date Range'}
            </button>
          ))}
        </div>

        {reportRange === 'custom' && (
          <div className="flex items-center gap-2 text-xs">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-300 font-mono text-xs"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-300 font-mono text-xs"
            />
          </div>
        )}
      </div>

      {/* Report Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* 1. Revenue & Sales Report Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                Income Statement
              </span>
              <DollarSign size={16} className="text-emerald-600" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 mt-2">
              Gross Revenue & Sales Report
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Complete breakdown of cash intake, digital wallet settlements, and accounts receivable.
            </p>

            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 text-[11px] block">Period Total</span>
                <span className="font-mono font-extrabold text-slate-900 text-base">₱185,300</span>
              </div>
              <div className="bg-emerald-50/70 p-3 rounded-xl">
                <span className="text-emerald-800 text-[11px] block">Collected Cash</span>
                <span className="font-mono font-extrabold text-emerald-950 text-base">₱184,700</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => handleExportCSV('Revenue_Report')}
              className="text-xs font-bold text-slate-700 hover:text-indigo-600 flex items-center gap-1"
            >
              <Download size={13} />
              <span>Download CSV</span>
            </button>
            <button
              onClick={() => handleExportPDF('Revenue_Report')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              Generate PDF →
            </button>
          </div>
        </div>

        {/* 2. Expenses & Cost of Goods Sold */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200">
                Cost Accounting
              </span>
              <Receipt size={16} className="text-rose-600" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 mt-2">
              Expenses & Utilities Report
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Detailed tracking of chemical restocking, water/power utilities, maintenance, and staff wages.
            </p>

            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 text-[11px] block">Total Operational Cost</span>
                <span className="font-mono font-extrabold text-rose-700 text-base">₱42,500</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 text-[11px] block">Net Operating Profit</span>
                <span className="font-mono font-extrabold text-emerald-700 text-base">₱142,800</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => handleExportCSV('Expenses_Report')}
              className="text-xs font-bold text-slate-700 hover:text-indigo-600 flex items-center gap-1"
            >
              <Download size={13} />
              <span>Download CSV</span>
            </button>
            <button
              onClick={() => handleExportPDF('Expenses_Report')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              Generate PDF →
            </button>
          </div>
        </div>

        {/* 3. Orders & Turnaround Velocity Report */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200">
                Operations
              </span>
              <ShoppingBag size={16} className="text-sky-600" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 mt-2">
              Ticket Velocity & Turnaround SLA
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Average wash duration, machine cycle efficiency, and on-time ready SLA fulfillment.
            </p>

            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 text-[11px] block">Avg Turnaround</span>
                <span className="font-mono font-extrabold text-slate-900 text-base">18.4 Hours</span>
              </div>
              <div className="bg-sky-50/70 p-3 rounded-xl">
                <span className="text-sky-800 text-[11px] block">On-Time SLA Rate</span>
                <span className="font-mono font-extrabold text-sky-950 text-base">98.2%</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => handleExportCSV('Orders_Velocity_Report')}
              className="text-xs font-bold text-slate-700 hover:text-indigo-600 flex items-center gap-1"
            >
              <Download size={13} />
              <span>Download CSV</span>
            </button>
            <button
              onClick={() => handleExportPDF('Orders_Velocity_Report')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              Generate PDF →
            </button>
          </div>
        </div>

        {/* 4. Customer Retention & LTV Report */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200">
                Customers
              </span>
              <Sparkles size={16} className="text-purple-600" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 mt-2">
              Customer Retention & Repeat Visits
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              VIP customer metrics, recurring neighborhood dropoffs, and average bag weight.
            </p>

            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 text-[11px] block">Repeat Rate</span>
                <span className="font-mono font-extrabold text-slate-900 text-base">74.5%</span>
              </div>
              <div className="bg-purple-50/70 p-3 rounded-xl">
                <span className="text-purple-800 text-[11px] block">Avg Order Value</span>
                <span className="font-mono font-extrabold text-purple-950 text-base">₱395.00</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => handleExportCSV('Customer_Retention_Report')}
              className="text-xs font-bold text-slate-700 hover:text-indigo-600 flex items-center gap-1"
            >
              <Download size={13} />
              <span>Download CSV</span>
            </button>
            <button
              onClick={() => handleExportPDF('Customer_Retention_Report')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              Generate PDF →
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
