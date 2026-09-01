import React, { useState, useRef } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { AuthUser } from '../../types';
import { 
  Users, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  User, 
  Lock, 
  Copy, 
  ShieldCheck,
  AlertCircle,
  Camera,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

export const StaffManagement: React.FC = () => {
  const { 
    authUsers, 
    currentUser, 
    addStaff, 
    updateStaff, 
    deleteStaff, 
    addToast 
  } = useLaundry();

  // Filter only Admin / Staff accounts
  const adminUsers = authUsers.filter(u => u.role === 'ADMIN');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AuthUser | null>(null);
  const [adminName, setAdminName] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminAvatarUrl, setAdminAvatarUrl] = useState<string>('');
  const [showPasswordInForm, setShowPasswordInForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Card password visibility toggles
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // Delete dialog state
  const [deletingUser, setDeletingUser] = useState<AuthUser | null>(null);

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', `${label} copied.`, 'info');
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    // Limit to 5MB max
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image size should be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setAdminAvatarUrl(result);
      setFormError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    setAdminName('');
    setAdminUsername('');
    setAdminPassword('1234');
    setAdminAvatarUrl('');
    setShowPasswordInForm(false);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: AuthUser) => {
    setEditingUser(user);
    setAdminName(user.name);
    setAdminUsername(user.username || user.staffCode.toLowerCase());
    setAdminPassword(user.password || user.pin || '1234');
    setAdminAvatarUrl(user.avatarUrl || '');
    setShowPasswordInForm(false);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = adminName.trim();
    const cleanUsername = adminUsername.trim().toLowerCase().replace(/\s+/g, '');
    const cleanPassword = adminPassword.trim();

    if (!cleanName) {
      setFormError('Admin user full name is required.');
      return;
    }

    if (!cleanUsername) {
      setFormError('Username is required for logging in.');
      return;
    }

    if (!cleanPassword) {
      setFormError('Password is required.');
      return;
    }

    // Check duplicate username against other users
    const duplicate = authUsers.find(
      u => u.username?.toLowerCase() === cleanUsername && u.id !== editingUser?.id
    );
    if (duplicate) {
      setFormError(`Username "${cleanUsername}" is already taken by ${duplicate.name}.`);
      return;
    }

    if (editingUser) {
      updateStaff(editingUser.id, {
        name: cleanName,
        username: cleanUsername,
        password: cleanPassword,
        pin: cleanPassword,
        avatarUrl: adminAvatarUrl || undefined
      });
      addToast('Admin Updated', `Updated credentials for ${cleanName}.`, 'success');
    } else {
      addStaff({
        name: cleanName,
        username: cleanUsername,
        password: cleanPassword,
        pin: cleanPassword,
        avatarUrl: adminAvatarUrl || undefined,
        role: 'ADMIN',
        staffCode: `STF-${(adminUsers.length + 1).toString().padStart(2, '0')}`,
        title: 'Staff / Admin POS',
        email: `${cleanUsername}@tapcard.ph`,
        branch: 'Makati Central Branch',
        shift: 'Regular Shift',
        status: 'ACTIVE'
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div id="staff-management-container" className="space-y-5">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Users size={16} />
            </div>
            <h2 className="font-extrabold text-slate-900 text-base">
              Admin Users
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage admin users, photos, usernames, and passwords for the counter staff.
          </p>
        </div>

        <button
          type="button"
          id="add-admin-user-btn"
          onClick={openAddModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          <UserPlus size={15} />
          <span>Add Admin User</span>
        </button>
      </div>

      {/* Admin User Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminUsers.map((user) => {
          const isCurrentUser = currentUser?.id === user.id;
          const passwordVisible = visiblePasswords[user.id] || false;
          const currentPassword = user.password || user.pin || '1234';
          const usernameDisplay = user.username || user.name.toLowerCase().replace(/\s+/g, '');

          return (
            <div
              key={user.id}
              id={`staff-card-${user.id}`}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 flex flex-col justify-between space-y-3.5 hover:border-slate-300 transition-all"
            >
              {/* User Info Header with Photo and Username */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Photo Avatar */}
                  {user.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={user.name} 
                      className="w-11 h-11 rounded-2xl object-cover ring-2 ring-emerald-100 shrink-0 shadow-2xs"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0 ring-2 ring-emerald-100">
                      {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  {/* Name and Username (Cleanly separated without the removed subtitle) */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-sm text-slate-900 leading-tight truncate">
                        {user.name}
                      </h3>
                      {isCurrentUser && (
                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-extrabold text-[9px] border border-emerald-200 shrink-0">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-xs font-semibold text-emerald-700 block truncate">
                      @{usernameDisplay}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEditModal(user)}
                    className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Edit user details and photo"
                  >
                    <Edit3 size={14} />
                  </button>
                  {adminUsers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setDeletingUser(user)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete admin user"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Password Display Box */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
                    <Lock size={11} className="text-slate-400" />
                    Password:
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <code className="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-mono font-bold text-slate-900 text-xs">
                      {passwordVisible ? currentPassword : '••••••••'}
                    </code>
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(user.id)}
                      className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                      title={passwordVisible ? "Hide password" : "Show password"}
                    >
                      {passwordVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(currentPassword, 'Password')}
                      className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                      title="Copy password"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px] text-slate-400">
                  <span>Sign In Code: <b className="text-slate-700 font-mono">@{usernameDisplay}</b></span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                    <ShieldCheck size={11} /> Active
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* ADD / EDIT MODAL - Name, Username, Photo Upload & Password */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center">
                  {editingUser ? <Edit3 size={18} /> : <UserPlus size={18} />}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    {editingUser ? 'Edit Admin User' : 'Add Admin User'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Configure name, username, photo and password
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveUser} className="p-5 space-y-4 text-xs">
              {formError && (
                <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-[11px] font-medium">
                  <AlertCircle size={14} className="shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Photo Upload Area */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Admin Photo
                </label>

                <div className="flex items-center gap-3.5">
                  {/* Photo Preview */}
                  <div className="relative group shrink-0">
                    {adminAvatarUrl ? (
                      <img
                        src={adminAvatarUrl}
                        alt="Admin preview"
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/30 shadow-xs"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                        <ImageIcon size={20} />
                        <span className="text-[9px] font-bold mt-0.5">No Photo</span>
                      </div>
                    )}
                  </div>

                  {/* Dropzone & Upload Button */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex-1 border-2 border-dashed rounded-2xl p-3 text-center cursor-pointer transition-all ${
                      isDragging 
                        ? 'border-emerald-500 bg-emerald-50/50' 
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex items-center justify-center gap-1.5 text-slate-700 font-bold text-xs">
                      <Upload size={14} className="text-emerald-600" />
                      <span>{adminAvatarUrl ? 'Change Photo' : 'Upload Photo'}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Drag & drop or click to browse (PNG, JPG)
                    </p>
                  </div>

                  {adminAvatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAdminAvatarUrl('')}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Remove photo"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Admin Name */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={15} />
                  </div>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={adminName}
                    onChange={(e) => {
                      setAdminName(e.target.value);
                      if (!editingUser && !adminUsername) {
                        const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '');
                        setAdminUsername(slug);
                      }
                    }}
                    placeholder="e.g. Arlene Santos"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Admin Username (Separated from Name) */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Username <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-mono font-bold text-xs">
                    @
                  </div>
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    placeholder="e.g. admin or arlene"
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Username typed when signing in to the Admin POS.
                </span>
              </div>

              {/* Password */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={15} />
                  </div>
                  <input
                    type={showPasswordInForm ? "text" : "password"}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="e.g. 1234 or securepass"
                    className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordInForm(!showPasswordInForm)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showPasswordInForm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check size={14} />
                  <span>{editingUser ? 'Save Admin' : 'Add Admin'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deletingUser && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setDeletingUser(null)}
        >
          <div 
            className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 size={20} />
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Remove Admin User?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove <b className="text-slate-800">{deletingUser.name}</b> (<code className="font-mono text-emerald-700">@{deletingUser.username || deletingUser.name.toLowerCase()}</code>)?
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteStaff(deletingUser.id);
                  setDeletingUser(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 text-xs transition-all shadow-xs cursor-pointer"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
