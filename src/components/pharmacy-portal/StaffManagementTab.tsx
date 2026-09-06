import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  ShieldCheck, 
  Plus, 
  KeyRound, 
  Mail, 
  Phone, 
  Building2, 
  CheckCircle2, 
  X 
} from 'lucide-react';
import { PharmacyStaffMember, PharmacyStaffRole, PharmacyBranchInfo } from '../../types/pharmacyPortal';
import { PharmacyPortalService } from '../../services/pharmacyPortalStore';

interface StaffManagementTabProps {
  staff?: PharmacyStaffMember[];
  branches?: PharmacyBranchInfo[];
  onStaffUpdated?: () => void;
}

export const StaffManagementTab: React.FC<StaffManagementTabProps> = ({
  staff = [],
  branches = [],
  onStaffUpdated
}) => {
  const [isAddStaffModal, setIsAddStaffModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState<PharmacyStaffRole>('Pharmacist');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [assignedBranchId, setAssignedBranchId] = useState(branches?.[0]?.id || 'branch-1');

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const branch = (branches || []).find(b => b.id === assignedBranchId);
    PharmacyPortalService.addStaff({
      name,
      role,
      email,
      phone,
      licenseNumber: licenseNumber ? licenseNumber : undefined,
      status: 'Active',
      assignedBranchId,
      assignedBranchName: branch?.name || '',
      permissions: {
        canReviewPrescriptions: role === 'Pharmacy Owner' || role === 'Pharmacist' || role === 'Pharmacy Administrator',
        canDispenseMedicines: role === 'Pharmacy Owner' || role === 'Pharmacist' || role === 'Order Manager',
        canManageInventory: role === 'Pharmacy Owner' || role === 'Inventory Manager' || role === 'Pharmacy Administrator',
        canModifyPrices: role === 'Pharmacy Owner' || role === 'Finance Manager' || role === 'Pharmacy Administrator',
        canManageStaff: role === 'Pharmacy Owner' || role === 'Pharmacy Administrator',
        canViewFinancials: role === 'Pharmacy Owner' || role === 'Finance Manager' || role === 'Pharmacy Administrator',
        canManageBranches: role === 'Pharmacy Owner' || role === 'Pharmacy Administrator'
      }
    });

    setIsAddStaffModal(false);
    onStaffUpdated?.();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Role-Based Access Control (RBAC)</span>
          </div>
          <h2 className="text-base font-black text-white">Dispensary Staff & Clinical Roles</h2>
          <p className="text-xs text-slate-400">
            Enforce separation of duty between registered pharmacists, inventory clerks, and delivery dispatchers.
          </p>
        </div>

        <button
          onClick={() => setIsAddStaffModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-md shadow-teal-950/50"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard Staff Member</span>
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                <th className="p-4 font-semibold">Staff Member</th>
                <th className="p-4 font-semibold">Clinical / Operational Role</th>
                <th className="p-4 font-semibold">PCI License</th>
                <th className="p-4 font-semibold">Assigned Branch</th>
                <th className="p-4 font-semibold">Key Permissions</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Last Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {staff.map(s => (
                <tr key={s.id} className="hover:bg-slate-800/30 transition">
                  <td className="p-4">
                    <div className="font-bold text-white text-xs">{s.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{s.email}</div>
                  </td>

                  <td className="p-4 font-medium text-teal-300">
                    {s.role}
                  </td>

                  <td className="p-4 font-mono text-slate-400">
                    {s.licenseNumber || 'N/A (Non-clinical)'}
                  </td>

                  <td className="p-4 text-slate-300">
                    {s.assignedBranchName || 'All Central Hubs'}
                  </td>

                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 text-[9px]">
                      {s.permissions.canReviewPrescriptions && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">Rx Review</span>
                      )}
                      {s.permissions.canManageInventory && (
                        <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold">Inventory</span>
                      )}
                      {s.permissions.canModifyPrices && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">Pricing</span>
                      )}
                      {s.permissions.canViewFinancials && (
                        <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold">Payouts</span>
                      )}
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                      {s.status}
                    </span>
                  </td>

                  <td className="p-4 text-right text-slate-400 font-mono text-[11px]">
                    {s.lastLogin}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {isAddStaffModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">Onboard Staff Member</h3>
              <button onClick={() => setIsAddStaffModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan Malhotra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="Pharmacist">Pharmacist (R.Ph)</option>
                  <option value="Inventory Manager">Inventory Manager</option>
                  <option value="Order Manager">Order Fulfillment Manager</option>
                  <option value="Finance Manager">Finance & Accounts Manager</option>
                  <option value="Delivery Coordinator">Delivery Coordinator</option>
                  <option value="Pharmacy Administrator">Pharmacy Administrator</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Official Email *</label>
                <input
                  type="email"
                  required
                  placeholder="staff@apexhealth.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98110 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              {(role === 'Pharmacist' || role === 'Pharmacy Owner') && (
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">PCI Pharmacist Registration No. *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PCI-DL-201944"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddStaffModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs"
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
