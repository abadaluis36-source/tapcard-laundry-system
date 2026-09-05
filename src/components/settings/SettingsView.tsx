import React, { useState, useEffect } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { ServicesManagement } from '../admin/ServicesManagement';
import { StaffManagement } from '../admin/StaffManagement';
import { 
  Store, 
  Users, 
  Save, 
  Tag,
  ShieldCheck,
  User,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { authUsers, updateStaff, addToast, storeProfile, updateStoreProfile } = useLaundry();
  const [activeSettingsTab, setActiveSettingsTab] = useState<'profile' | 'services' | 'staff'>('profile');

  // Shop Profile state
  const [shopName, setShopName] = useState(storeProfile.shopName);
  const [ownerName, setOwnerName] = useState(storeProfile.ownerName ?? 'Miguel');
  const [tagline, setTagline] = useState(storeProfile.tagline);
  const [phone, setPhone] = useState(storeProfile.phone);
  const [address, setAddress] = useState(storeProfile.address);
  const [operatingHours, setOperatingHours] = useState(storeProfile.operatingHours);

  // Sync if storeProfile properties change
  useEffect(() => {
    setShopName(storeProfile.shopName ?? '');
    setOwnerName(storeProfile.ownerName ?? '');
    setTagline(storeProfile.tagline ?? '');
    setPhone(storeProfile.phone ?? '');
    setAddress(storeProfile.address ?? '');
    setOperatingHours(storeProfile.operatingHours ?? '');
  }, [storeProfile.shopName, storeProfile.ownerName, storeProfile.tagline, storeProfile.phone, storeProfile.address, storeProfile.operatingHours]);

  // Owner Credentials state
  const ownerUser = authUsers.find(u => u.role === 'OWNER') || authUsers[0];
  const [ownerUsername, setOwnerUsername] = useState(ownerUser?.username || 'owner');
  const [ownerPassword, setOwnerPassword] = useState(ownerUser?.password || ownerUser?.pin || '8888');
  const [showOwnerPassword, setShowOwnerPassword] = useState(false);

  // Synchronize when owner user changes
  useEffect(() => {
    if (ownerUser) {
      setOwnerUsername(ownerUser.username || 'owner');
      setOwnerPassword(ownerUser.password || ownerUser.pin || '8888');
    }
  }, [ownerUser?.id, ownerUser?.username, ownerUser?.password, ownerUser?.pin]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Update Owner credentials
    if (ownerUser) {
      const cleanUsername = ownerUsername.trim().toLowerCase().replace(/\s+/g, '') || 'owner';
      const cleanPassword = ownerPassword.trim() || '8888';

      updateStaff(ownerUser.id, {
        username: cleanUsername,
        password: cleanPassword,
        pin: cleanPassword
      });
    }

    addToast(
      'Shop Profile & Owner Credentials Saved',
      'Store information and owner login details have been updated successfully.',
      'success'
    );
  };

  return (
    <div id="settings-view" className="space-y-6 max-w-5xl">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Business Settings
        </h1>
        <p className="text-xs text-slate-500">
          Manage shop profile, owner login, laundry services & pricing, and admin users.
        </p>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSettingsTab('profile')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeSettingsTab === 'profile'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Store size={15} className={activeSettingsTab === 'profile' ? 'text-indigo-300' : 'text-slate-400'} />
          <span>Shop Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSettingsTab('services')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeSettingsTab === 'services'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Tag size={15} className={activeSettingsTab === 'services' ? 'text-indigo-300' : 'text-slate-400'} />
          <span>Services & Pricing</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSettingsTab('staff')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeSettingsTab === 'staff'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users size={15} className={activeSettingsTab === 'staff' ? 'text-indigo-300' : 'text-slate-400'} />
          <span>Admin Users</span>
        </button>
      </div>

      {/* Tab 1: Shop Profile */}
      {activeSettingsTab === 'profile' && (
        <form onSubmit={handleSave} className="space-y-5 max-w-3xl">
          
          {/* Shop Information */}
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
                  onChange={(e) => {
                    setShopName(e.target.value);
                    updateStoreProfile({ shopName: e.target.value });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Shop Owner Name</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => {
                    setOwnerName(e.target.value);
                    updateStoreProfile({ ownerName: e.target.value });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tagline / Slogan</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => {
                    setTagline(e.target.value);
                    updateStoreProfile({ tagline: e.target.value });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Mobile / Hotline</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    updateStoreProfile({ phone: e.target.value });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Operating Hours</label>
                <input
                  type="text"
                  value={operatingHours}
                  onChange={(e) => {
                    setOperatingHours(e.target.value);
                    updateStoreProfile({ operatingHours: e.target.value });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Shop Address (Printed on Claim Stub)</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    updateStoreProfile({ address: e.target.value });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Owner Login Credentials */}
          <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <ShieldCheck size={17} />
                </div>
                <div>
                  <h2 className="font-extrabold text-sm text-slate-900">Owner Login Credentials</h2>
                  <p className="text-[11px] text-slate-500">
                    Change the username and password used to access Owner / Executive view
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-extrabold text-[10px] border border-indigo-200">
                FULL ACCESS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Owner Username */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Owner Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={15} />
                  </div>
                  <input
                    type="text"
                    required
                    value={ownerUsername}
                    onChange={(e) => setOwnerUsername(e.target.value)}
                    placeholder="e.g. owner or boss"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Sign in with this username on the Owner Login screen.
                </span>
              </div>

              {/* Owner Password */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Owner Password / PIN
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={15} />
                  </div>
                  <input
                    type={showOwnerPassword ? "text" : "password"}
                    required
                    value={ownerPassword}
                    onChange={(e) => setOwnerPassword(e.target.value)}
                    placeholder="e.g. 8888 or custom password"
                    className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOwnerPassword(!showOwnerPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showOwnerPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Used for Owner login. Default is 8888.
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <Save size={15} />
              <span>Save Shop Profile & Credentials</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Services & Pricing */}
      {activeSettingsTab === 'services' && (
        <div className="pt-1">
          <ServicesManagement />
        </div>
      )}

      {/* Tab 3: Admin Users */}
      {activeSettingsTab === 'staff' && (
        <div className="pt-1">
          <StaffManagement />
        </div>
      )}

    </div>
  );
};

