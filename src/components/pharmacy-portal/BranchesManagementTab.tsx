import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  Snowflake, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  X 
} from 'lucide-react';
import { PharmacyBranchInfo } from '../../types/pharmacyPortal';
import { PharmacyPortalService } from '../../services/pharmacyPortalStore';

interface BranchesManagementTabProps {
  branches: PharmacyBranchInfo[];
  onBranchesUpdated: () => void;
}

export const BranchesManagementTab: React.FC<BranchesManagementTabProps> = ({
  branches,
  onBranchesUpdated
}) => {
  const [isAddBranchModal, setIsAddBranchModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('APX-NCR-05');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [state, setState] = useState('Delhi');
  const [pincode, setPincode] = useState('110001');
  const [phone, setPhone] = useState('+91 11 4000 1100');
  const [email, setEmail] = useState('branch@apexhealth.org');
  const [managerName, setManagerName] = useState('Operations Manager');
  const [pharmacistInCharge, setPharmacistInCharge] = useState('Dr. Registered Pharmacist, R.Ph');
  const [operatingHours, setOperatingHours] = useState('08:00 AM - 10:00 PM');
  const [deliveryRadiusKm, setDeliveryRadiusKm] = useState(10);
  const [hasColdStorage, setHasColdStorage] = useState(true);
  const [is24x7, setIs24x7] = useState(false);

  const handleSaveBranch = (e: React.FormEvent) => {
    e.preventDefault();
    PharmacyPortalService.addBranch({
      name,
      code,
      address,
      city,
      state,
      pincode,
      phone,
      email,
      managerName,
      pharmacistInCharge,
      operatingHours,
      deliveryRadiusKm,
      isActive: true,
      is24x7,
      hasColdStorage
    });
    setIsAddBranchModal(false);
    onBranchesUpdated();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-white">Dispensary Branches & Fulfilment Hubs</h2>
          <p className="text-xs text-slate-400">
            Manage multi-outlet inventory hubs, cold storage capabilities, pharmacist assignments, and delivery radiuses.
          </p>
        </div>

        <button
          onClick={() => setIsAddBranchModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-md shadow-teal-950/50"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Branch Depot</span>
        </button>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {branches.map(b => (
          <div key={b.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-teal-500/40 transition">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-teal-400 uppercase bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                  {b.code}
                </span>
                <h3 className="text-sm font-bold text-white mt-1.5">{b.name}</h3>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                <CheckCircle2 className="w-3 h-3" />
                <span>Active</span>
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{b.address}, {b.city} - {b.pincode}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span className="font-mono">{b.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>{b.operatingHours}</span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-[10px]">
              {b.hasColdStorage && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  <Snowflake className="w-3 h-3 text-cyan-400" />
                  <span>Cold Chain Validated (2-8°C)</span>
                </span>
              )}
              {b.is24x7 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  <span>24x7 Dispensary</span>
                </span>
              )}
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {b.deliveryRadiusKm} km Radius
              </span>
            </div>

            <div className="flex justify-between items-center text-xs pt-1 text-slate-400 font-mono">
              <span>Pharmacist: <strong className="text-white">{b.pharmacistInCharge}</strong></span>
              <span>Active Orders: <strong className="text-teal-300">{b.activeOrdersCount}</strong></span>
            </div>

          </div>
        ))}
      </div>

      {/* Add Branch Modal */}
      {isAddBranchModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">Add New Dispensary Branch</h3>
              <button onClick={() => setIsAddBranchModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBranch} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Branch Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Super-Specialty Hub (Dwarka)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Physical Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Street, Block, City, PIN"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Pharmacist In-Charge *</label>
                  <input
                    type="text"
                    required
                    value={pharmacistInCharge}
                    onChange={(e) => setPharmacistInCharge(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Delivery Radius (km)</label>
                  <input
                    type="number"
                    value={deliveryRadiusKm}
                    onChange={(e) => setDeliveryRadiusKm(parseInt(e.target.value, 10) || 10)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasColdStorage}
                    onChange={(e) => setHasColdStorage(e.target.checked)}
                    className="rounded text-teal-500 focus:ring-teal-400"
                  />
                  <span className="text-slate-300">Cold Chain Storage (2-8°C)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={is24x7}
                    onChange={(e) => setIs24x7(e.target.checked)}
                    className="rounded text-teal-500 focus:ring-teal-400"
                  />
                  <span className="text-slate-300">24/7 Operations</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddBranchModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs"
                >
                  Save Branch Depot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
