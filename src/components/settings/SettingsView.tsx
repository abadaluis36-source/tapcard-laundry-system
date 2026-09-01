import React, { useState } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { 
  Store, 
  Clock, 
  Users, 
  Sliders, 
  Bell, 
  ShieldCheck, 
  Save, 
  Check, 
  Smartphone,
  Printer,
  Sparkles
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { addToast } = useLaundry();
  const [shopName, setShopName] = useState('TAPCARD LAUNDRY SHOP');
  const [tagline, setTagline] = useState('Professional Wash, Dry & Fold Services');
  const [phone, setPhone] = useState('0917 555 8921');
  const [address, setAddress] = useState('Unit 102 Greenwoods Arcade, Pasig City');
  const [birNumber, setBirNumber] = useState('TIN-009-482-114-000');
  const [ticketPrefix, setTicketPrefix] = useState('LM');
  const [smsReadyAlert, setSmsReadyAlert] = useState(true);
  const [autoPrintStub, setAutoPrintStub] = useState(true);
  const [operatingHours, setOperatingHours] = useState('7:00 AM - 9:00 PM Daily');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      title: 'Shop Configuration Saved',
      message: 'All store parameters, operating hours, and receipt headers updated successfully.',
      type: 'success'
    });
  };

  return (
    <div id="settings-view" className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
            Boss / Owner Configuration
          </span>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <Sparkles size={12} />
            Connected to Thermal Stubs & POS Cashier
          </span>
        </div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Shop & System Settings
        </h1>
        <p className="text-xs text-slate-500">
          Configure business metadata, claim stub thermal printing, tax rates, and SMS ready notifications
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        
        {/* 1. Shop Profile */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Store size={18} className="text-slate-700" />
            <h2 className="font-extrabold text-sm text-slate-900">Shop Profile & Receipt Header</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Laundry Shop Business Name</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Tagline / Slogan</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Official Mobile / Hotline</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Operating Hours</label>
              <input
                type="text"
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Shop Address (Printed on Claim Stub)</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* 2. Automation & Notifications */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Bell size={18} className="text-slate-700" />
            <h2 className="font-extrabold text-sm text-slate-900">Customer Communication & Automation</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block">Instant SMS / Viber "Ready for Pickup" Alert</span>
                <span className="text-[11px] text-slate-500">
                  Automatically send a message with the claim link as soon as status is marked READY
                </span>
              </div>
              <input
                type="checkbox"
                checked={smsReadyAlert}
                onChange={(e) => setSmsReadyAlert(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block">Auto-Prompt Claim Stub Thermal Print</span>
                <span className="text-[11px] text-slate-500">
                  Open receipt dialog immediately upon ticket submission at the counter POS
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoPrintStub}
                onChange={(e) => setAutoPrintStub(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 3. Staff Accounts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Users size={18} className="text-slate-700" />
            <h2 className="font-extrabold text-sm text-slate-900">Staff Accounts & Permissions</h2>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center">
                  ED
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Eduardo Dela Cruz</span>
                  <span className="text-[11px] text-slate-500">Role: Shop Owner / Boss (Full Access)</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px] border border-indigo-200">
                ACTIVE
              </span>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                  AS
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Arlene Santos</span>
                  <span className="text-[11px] text-slate-500">Role: Head Staff / Shift Operator</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                ON SHIFT
              </span>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center">
                  JR
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">John Reyes</span>
                  <span className="text-[11px] text-slate-500">Role: Counter Cashier & Intake</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] border border-slate-200">
                OFF SHIFT
              </span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 active:scale-95"
          >
            <Save size={15} />
            <span>Save All Shop Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
};
