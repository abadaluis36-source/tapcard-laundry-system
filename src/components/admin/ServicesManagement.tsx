import React, { useState } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { ServicePricing } from '../../types';
import { 
  Tag, 
  Plus, 
  Edit3, 
  Check, 
  X, 
  Sparkles, 
  Clock, 
  Layers, 
  CheckCircle2, 
  ToggleLeft, 
  ToggleRight,
  Shirt,
  DollarSign
} from 'lucide-react';

export const ServicesManagement: React.FC = () => {
  const { services, addService, updateService, toggleServiceActive } = useLaundry();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServicePricing | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Wash' | 'Dry Clean' | 'Pressing' | 'Specialty' | 'Add-on'>('Wash');
  const [price, setPrice] = useState<number>(70);
  const [unitType, setUnitType] = useState<'kg' | 'item' | 'piece' | 'pair' | 'load'>('kg');
  const [turnaroundHours, setTurnaroundHours] = useState<number>(24);
  const [description, setDescription] = useState('');

  const openAddModal = () => {
    setEditingService(null);
    setName('');
    setCategory('Wash');
    setPrice(70);
    setUnitType('kg');
    setTurnaroundHours(24);
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (srv: ServicePricing) => {
    setEditingService(srv);
    setName(srv.name);
    setCategory(srv.category);
    setPrice(srv.price);
    setUnitType(srv.unitType);
    setTurnaroundHours(srv.turnaroundHours);
    setDescription(srv.description);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingService) {
      updateService(editingService.id, {
        name,
        category,
        price,
        unitType,
        turnaroundHours,
        description
      });
    } else {
      addService({
        name,
        category,
        price,
        unitType,
        turnaroundHours,
        description,
        isActive: true,
        popular: false
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div id="services-management-view" className="space-y-5">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Services & Pricing Catalog
          </h1>
          <p className="text-xs text-slate-500">
            Configure rates per kilogram, garment piece, and specialty laundry processes
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 active:scale-95 self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>+ Add Service</span>
        </button>
      </div>

      {/* Services Grid (Section 12 Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((srv) => {
          return (
            <div
              key={srv.id}
              className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between space-y-4 ${
                srv.isActive ? 'border-slate-200 shadow-2xs' : 'border-slate-200 bg-slate-50/70 opacity-60'
              }`}
            >
              {/* Header: Name and Category badge */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                      {srv.category}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 mt-1.5">
                      {srv.name}
                    </h3>
                  </div>

                  {/* Active toggle */}
                  <button
                    onClick={() => toggleServiceActive(srv.id)}
                    className="text-slate-400 hover:text-slate-700"
                    title={srv.isActive ? 'Deactivate service' : 'Activate service'}
                  >
                    {srv.isActive ? (
                      <ToggleRight size={26} className="text-emerald-600" />
                    ) : (
                      <ToggleLeft size={26} className="text-slate-400" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {srv.description}
                </p>
              </div>

              {/* Price & Turnaround Box */}
              <div className="pt-3 border-t border-slate-100 flex items-end justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Standard Rate</span>
                  <div className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
                    ₱{srv.price}
                    <span className="text-xs font-semibold text-slate-500 font-sans ml-1">
                      / {srv.unitType}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block flex items-center justify-end gap-1">
                    <Clock size={11} /> Turnaround
                  </span>
                  <span className="text-xs font-bold text-slate-700 font-mono">
                    {srv.turnaroundHours} Hours
                  </span>
                </div>
              </div>

              {/* Edit button */}
              <button
                onClick={() => openEditModal(srv)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
              >
                <Edit3 size={13} />
                <span>Edit Pricing & Service</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wash & Fold"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="Wash">Wash</option>
                    <option value="Dry Clean">Dry Clean</option>
                    <option value="Pressing">Pressing</option>
                    <option value="Specialty">Specialty</option>
                    <option value="Add-on">Add-on</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit Type</label>
                  <select
                    value={unitType}
                    onChange={(e) => setUnitType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="kg">Per kg</option>
                    <option value="item">Per item</option>
                    <option value="piece">Per piece</option>
                    <option value="pair">Per pair</option>
                    <option value="load">Per load</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price (₱) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Turnaround Time (Hours)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={turnaroundHours}
                    onChange={(e) => setTurnaroundHours(parseInt(e.target.value) || 24)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Details regarding detergent, processing, packaging..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
