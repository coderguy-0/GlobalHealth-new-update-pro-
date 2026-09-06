import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  KeyRound,
  UserCheck,
  CheckCircle2,
  Lock,
  Plus,
  Search
} from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';
import { RoleType } from '../../../types/hospitalPortal';

export const StaffView: React.FC = () => {
  const { registeredUsers, signup, quickSwitchUser, currentUser } = useHospitalPortal();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<RoleType>('Chief Nurse / Matron');
  const [newDept, setNewDept] = useState('Nursing & Patient Care');

  const filteredUsers = registeredUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;
    await signup({
      name: newName,
      email: newEmail,
      role: newRole,
      department: newDept
    });
    setNewName('');
    setNewEmail('');
    setShowAddUser(false);
  };

  const ROLE_PERMISSIONS: { role: RoleType; scope: string; level: string }[] = [
    { role: 'Hospital Owner', scope: 'Complete Institutional Ownership, Financial Audit & Global Governance', level: 'Level 5 (Full)' },
    { role: 'Hospital Administrator', scope: 'Operations, RBAC, Pricing Tariffs & Profile Management', level: 'Level 5 (Full)' },
    { role: 'Medical Director', scope: 'Clinical Protocols, Doctor Credentialing & OT Governance', level: 'Level 4 (High)' },
    { role: 'Doctor / Specialist', scope: 'OPD Queue, EMR, Prescriptions & Inpatient Rounds', level: 'Level 3 (Clinical)' },
    { role: 'Department Head', scope: 'Department Operations, Specialist Rostering & Bed Allocations', level: 'Level 3 (Department)' },
    { role: 'Chief Nurse / Matron', scope: 'Bed Telemetry, Vital Signs, Medication Administration', level: 'Level 2 (Inpatient)' },
    { role: 'Lab Incharge', scope: 'Diagnostic Formularies, Specimen Log & Pathology Reports', level: 'Level 3 (Laboratory)' },
    { role: 'Blood Bank Officer', scope: 'Blood Units Inventory, Donor Logs, Crossmatch Verifications', level: 'Level 3 (Blood Center)' },
    { role: 'Chief Pharmacist', scope: 'Drug Inventory, Schedule X/H Dispensation, Batch Expiries', level: 'Level 3 (Pharmacy)' },
    { role: 'Billing & Finance', scope: 'Cashless Pre-Auth, TPAs, Claim Settlement & Tariff Schedule', level: 'Level 3 (Finance)' },
    { role: 'Biomedical Engineer', scope: 'Biomedical Asset Calibrations, Equipment PPM, Breakdown Log', level: 'Level 2 (Asset)' },
    { role: 'GlobalHealth SuperAdmin', scope: 'Multi-Tenant Master Group Provisioning, Audit Ledger & Keys', level: 'Level 5 (Global)' }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCEBE4] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#17221E]">Staff Personnel & RBAC Authority Matrix</h1>
            <span className="text-xs font-mono font-bold bg-[#E8F7F1] text-[#008F68] px-2 py-0.5 rounded border border-[#BDE4D5]">
              {registeredUsers.length} Active Personnel
            </span>
          </div>
          <p className="text-xs text-[#52635C]">
            Role-Based Access Control (12 Clinical Personas), 2FA Compliance & Cryptographic Session Scope
          </p>
        </div>

        <button
          onClick={() => setShowAddUser(!showAddUser)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#008F68] hover:bg-[#007A59] text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Provision New Personnel</span>
        </button>
      </div>

      {/* Add User Drawer */}
      {showAddUser && (
        <form onSubmit={handleEnroll} className="p-5 rounded-2xl bg-white border border-[#008F68] shadow-md space-y-4 animate-in fade-in">
          <h3 className="text-sm font-bold text-[#17221E]">Provision New Staff Account</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Full Name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Dr. / Mr. / Ms. Staff Name"
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#D8E7E0] rounded-lg text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Work Email</label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="staff@apexhealth.org"
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#D8E7E0] rounded-lg text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Assigned RBAC Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#D8E7E0] rounded-lg text-[#17221E] focus:outline-none focus:border-[#008F68]"
              >
                {ROLE_PERMISSIONS.map((r) => (
                  <option key={r.role} value={r.role}>
                    {r.role}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Department</label>
              <input
                type="text"
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
                placeholder="e.g. Critical Care Services"
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#D8E7E0] rounded-lg text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddUser(false)}
              className="px-3 py-1.5 text-xs font-bold text-[#52635C] hover:bg-[#F1FAF6] rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-[#008F68] hover:bg-[#007A59] rounded-lg transition cursor-pointer"
            >
              Provision Account
            </button>
          </div>
        </form>
      )}

      {/* Personnel Roster List */}
      <div className="p-6 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#DCEBE4] pb-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#008F68]" />
            <h2 className="text-base font-bold text-[#17221E]">Active Enrolled Personnel</h2>
          </div>
          <div className="w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search personnel..."
              className="w-full px-3 py-1.5 text-xs bg-white border border-[#D8E7E0] rounded-lg text-[#17221E] focus:outline-none focus:border-[#008F68]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#DCEBE4] text-[#52635C] font-bold uppercase text-[10px]">
                <th className="pb-3 px-3">Personnel</th>
                <th className="pb-3 px-3">RBAC Role</th>
                <th className="pb-3 px-3">Department</th>
                <th className="pb-3 px-3">Employee ID</th>
                <th className="pb-3 px-3">2FA Status</th>
                <th className="pb-3 px-3 text-right">Quick Switch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCEBE4]">
              {filteredUsers.map((u) => {
                const isCurrent = u.id === currentUser?.id;
                return (
                  <tr key={u.id} className={isCurrent ? 'bg-[#E8F7F1]/50' : 'hover:bg-[#F6FBF8]'}>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={u.name}
                          className="h-8 w-8 rounded-full object-cover border border-[#008F68]"
                        />
                        <div>
                          <div className="font-bold text-[#17221E] flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {isCurrent && (
                              <span className="text-[9px] bg-[#008F68] text-white px-1.5 py-0.2 rounded font-bold">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#52635C] font-mono">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#008F68]">{u.role}</td>
                    <td className="py-3 px-3 text-[#52635C]">{u.department}</td>
                    <td className="py-3 px-3 font-mono text-[#52635C]">{u.employeeId}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#008F68] bg-[#E8F7F1] px-2 py-0.5 rounded border border-[#BDE4D5]">
                        <KeyRound className="h-3 w-3" />
                        <span>Enforced</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {!isCurrent && (
                        <button
                          onClick={() => quickSwitchUser(u.id)}
                          className="px-2.5 py-1 rounded-lg bg-[#F1FAF6] hover:bg-[#DCEBE4] text-[#17221E] font-bold text-[11px] transition cursor-pointer border border-[#DCEBE4]"
                        >
                          Switch Persona
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 12 Roles Scope Authority Reference Matrix */}
      <div className="p-6 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#DCEBE4] pb-3">
          <ShieldCheck className="h-5 w-5 text-[#008F68]" />
          <h2 className="text-base font-bold text-[#17221E]">12 Clinical & Administrative RBAC Permission Profiles</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ROLE_PERMISSIONS.map((p) => (
            <div key={p.role} className="p-3.5 rounded-xl bg-[#F6FBF8] border border-[#DCEBE4] space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#17221E]">{p.role}</h4>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white text-[#008F68] border border-[#BDE4D5]">
                  {p.level}
                </span>
              </div>
              <p className="text-[11px] text-[#52635C] leading-snug">{p.scope}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
