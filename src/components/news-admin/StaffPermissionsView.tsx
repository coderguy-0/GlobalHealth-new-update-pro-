import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  Lock,
  KeyRound,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
  Power,
  RotateCcw,
  Sparkles,
  Info,
  Check,
  X
} from 'lucide-react';
import {
  StaffMember,
  StaffRole,
  StaffPermission,
  StaffAccountStatus
} from '../../types';
import {
  newsAuthService,
  ALL_STAFF_PERMISSIONS,
  DEFAULT_ROLE_PERMISSIONS
} from '../../services/newsAuthService';
import { useLocalization } from '../../context/LocalizationContext';

interface StaffPermissionsViewProps {
  currentStaff: StaffMember | null;
  onRefreshStaff: () => void;
}

export const StaffPermissionsView: React.FC<StaffPermissionsViewProps> = ({
  currentStaff,
  onRefreshStaff
}) => {
  const { t, formatNumber } = useLocalization();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [deleteConfirmStaff, setDeleteConfirmStaff] = useState<StaffMember | null>(null);
  const [showMatrixInfo, setShowMatrixInfo] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    role: StaffRole;
    status: StaffAccountStatus;
    permissions: StaffPermission[];
    assignedCategories: string[];
    accessExpiry: string;
    notes: string;
    mfaEnabled: boolean;
  }>({
    name: '',
    email: '',
    role: 'EDITOR',
    status: 'active',
    permissions: DEFAULT_ROLE_PERMISSIONS.EDITOR,
    assignedCategories: [],
    accessExpiry: '',
    notes: '',
    mfaEnabled: false,
  });

  const staffMembers = newsAuthService.getStaffMembers();

  const filteredStaff = staffMembers.filter((s) => {
    if (selectedRole !== 'all' && s.role !== selectedRole) return false;
    if (selectedStatus !== 'all' && s.status !== selectedStatus) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        (s.notes && s.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      email: '',
      role: 'EDITOR',
      status: 'active',
      permissions: DEFAULT_ROLE_PERMISSIONS.EDITOR,
      assignedCategories: [],
      accessExpiry: '',
      notes: '',
      mfaEnabled: false,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (staff: StaffMember) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email,
      role: staff.role,
      status: staff.status,
      permissions: [...staff.permissions],
      assignedCategories: staff.assignedCategories || [],
      accessExpiry: staff.accessExpiry || '',
      notes: staff.notes || '',
      mfaEnabled: !!staff.mfaEnabled,
    });
  };

  const handleRoleChangeInForm = (newRole: StaffRole) => {
    setFormData((prev) => ({
      ...prev,
      role: newRole,
      permissions: DEFAULT_ROLE_PERMISSIONS[newRole] || [],
    }));
  };

  const handleTogglePermission = (permKey: StaffPermission) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(permKey);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((p) => p !== permKey)
          : [...prev.permissions, permKey],
      };
    });
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const res = newsAuthService.addStaffMember({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status,
      permissions: formData.permissions,
      assignedCategories: formData.assignedCategories,
      accessExpiry: formData.accessExpiry || undefined,
      notes: formData.notes,
      mfaEnabled: formData.mfaEnabled,
    });

    if (res.success) {
      setIsAddModalOpen(false);
      onRefreshStaff();
    } else {
      alert(res.error || 'Failed to create staff');
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    const res = newsAuthService.updateStaffMember(editingStaff.id, {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status,
      permissions: formData.permissions,
      assignedCategories: formData.assignedCategories,
      accessExpiry: formData.accessExpiry || undefined,
      notes: formData.notes,
      mfaEnabled: formData.mfaEnabled,
    });

    if (res.success) {
      setEditingStaff(null);
      onRefreshStaff();
    } else {
      alert(res.error || 'Failed to update staff');
    }
  };

  const handleToggleStatus = (staff: StaffMember, newStatus: StaffAccountStatus) => {
    const res = newsAuthService.toggleStaffStatus(staff.id, newStatus);
    if (res.success) {
      onRefreshStaff();
    } else {
      alert(res.error || 'Failed to update status');
    }
  };

  const handleForceLogout = (staff: StaffMember) => {
    newsAuthService.forceLogoutStaff(staff.id);
    alert(t(`Terminated active sessions for ${staff.name}.`));
    onRefreshStaff();
  };

  const handleDeleteStaff = (staff: StaffMember) => {
    const res = newsAuthService.deleteStaffMember(staff.id);
    if (res.success) {
      setDeleteConfirmStaff(null);
      onRefreshStaff();
    } else {
      alert(res.error || 'Failed to delete staff member');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Governance notice: live authorization is server-controlled */}
      <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-xs text-sky-900 flex items-start gap-2.5">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
        <p>
          <strong>Server-controlled authorization.</strong> News Management identity, roles and permissions are
          provisioned and enforced by the GlobalHealth backend through the unified News Management login. The list
          below is a planning reference for editorial staffing — changes made here do not create or grant live
          News Management access. Individual administrator accounts and their permissions are managed through the
          administrative process and recorded in the news audit trail.
        </p>
      </div>
      {/* Top Header Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Shield className="h-4 w-4" /> {t('Administrative Security Kernel')}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t('Staff Authorization & Granular Permissions')}
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            {t('Control editorial personnel credentials, zero-trust permission matrices, multi-factor authentication requirements, and role delegations.')}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowMatrixInfo(!showMatrixInfo)}
            className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>{t('Role Matrix Reference')}</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="rounded-xl bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            <span>{t('Add Authorized Staff')}</span>
          </button>
        </div>
      </div>

      {/* Permission Matrix Info Panel */}
      {showMatrixInfo && (
        <div className="rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50/80 via-emerald-50/40 to-white p-6 shadow-xs space-y-4 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
              <ShieldCheck className="h-5 w-5 text-teal-600" />
              <span>{t('Clinical Editorial Authorization Hierarchy')}</span>
            </div>
            <button
              onClick={() => setShowMatrixInfo(false)}
              className="text-slate-400 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {t('Every operational action (publication, review, deletion, taxonomy modification) is cryptographically guarded and checked against assigned permissions before execution.')}
          </p>

          <div className="overflow-x-auto rounded-2xl border border-teal-100 bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-teal-900/5 text-slate-700 font-bold border-b border-teal-100">
                <tr>
                  <th className="p-3">{t('Role Tier')}</th>
                  <th className="p-3">{t('Primary Responsibility')}</th>
                  <th className="p-3">{t('Publishing')}</th>
                  <th className="p-3">{t('Review Queue')}</th>
                  <th className="p-3">{t('Permanent Delete')}</th>
                  <th className="p-3">{t('Staff Admin')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-3 font-bold text-rose-700">SUPER ADMIN</td>
                  <td className="p-3">{t('Absolute system control & override')}</td>
                  <td className="p-3 font-bold text-emerald-600">✓ {t('Full')}</td>
                  <td className="p-3 font-bold text-emerald-600">✓ {t('Full')}</td>
                  <td className="p-3 font-bold text-rose-600">✓ {t('Exclusive')}</td>
                  <td className="p-3 font-bold text-rose-600">✓ {t('Exclusive')}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-purple-700">NEWS ADMIN</td>
                  <td className="p-3">{t('News operations & editorial oversight')}</td>
                  <td className="p-3 font-bold text-emerald-600">✓ {t('Yes')}</td>
                  <td className="p-3 font-bold text-emerald-600">✓ {t('Yes')}</td>
                  <td className="p-3 text-slate-400">✕ {t('Restricted')}</td>
                  <td className="p-3 text-slate-400">✕ {t('No')}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-blue-700">EDITOR</td>
                  <td className="p-3">{t('Content synthesis, curation & feedback')}</td>
                  <td className="p-3 text-slate-500">{t('Assigned')}</td>
                  <td className="p-3 font-bold text-emerald-600">✓ {t('Yes')}</td>
                  <td className="p-3 text-slate-400">✕ {t('No')}</td>
                  <td className="p-3 text-slate-400">✕ {t('No')}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-amber-700">REVIEWER</td>
                  <td className="p-3">{t('Medical fact-checking & clinical peer review')}</td>
                  <td className="p-3 text-slate-400">✕ {t('No')}</td>
                  <td className="p-3 font-bold text-emerald-600">✓ {t('Full')}</td>
                  <td className="p-3 text-slate-400">✕ {t('No')}</td>
                  <td className="p-3 text-slate-400">✕ {t('No')}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-emerald-700">PUBLISHER</td>
                  <td className="p-3">{t('Syndication & release schedule timing')}</td>
                  <td className="p-3 font-bold text-emerald-600">✓ {t('Full')}</td>
                  <td className="p-3 text-slate-500">{t('View')}</td>
                  <td className="p-3 text-slate-400">✕ {t('No')}</td>
                  <td className="p-3 text-slate-400">✕ {t('No')}</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-700">AUTHOR</td>
                  <td className="p-3">{t('Draft creation and initial research input')}</td>
                  <td className="p-3 text-slate-400">✕ {t('No')}</td>
                  <td className="p-3 text-slate-400">✕ {t('No')}</td>
                  <td className="p-3 text-slate-400">✕ {t('No')}</td>
                  <td className="p-3 text-slate-400">✕ {t('No')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('Search staff by name, email, or role...')}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-teal-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700 focus:bg-white focus:border-teal-500 focus:outline-hidden"
          >
            <option value="all">{t('All Roles')}</option>
            <option value="SUPER_ADMIN">SUPER ADMIN</option>
            <option value="NEWS_ADMIN">NEWS ADMIN</option>
            <option value="EDITOR">EDITOR</option>
            <option value="REVIEWER">REVIEWER</option>
            <option value="PUBLISHER">PUBLISHER</option>
            <option value="AUTHOR">AUTHOR</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700 focus:bg-white focus:border-teal-500 focus:outline-hidden"
          >
            <option value="all">{t('All Statuses')}</option>
            <option value="active">{t('Active')}</option>
            <option value="pending_approval">{t('Pending Approval')}</option>
            <option value="suspended">{t('Suspended')}</option>
            <option value="disabled">{t('Disabled')}</option>
            <option value="expired">{t('Expired')}</option>
          </select>
        </div>
      </div>

      {/* Staff Members Table */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">{t('Staff Member')}</th>
                <th className="p-4">{t('Role & Permissions')}</th>
                <th className="p-4">{t('Account Status')}</th>
                <th className="p-4">{t('Last Login')}</th>
                <th className="p-4">{t('Security & 2FA')}</th>
                <th className="p-4 text-right">{t('Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.map((staff) => {
                const isSuperAdmin = staff.role === 'SUPER_ADMIN';
                const isCurrentLoggedIn = currentStaff?.id === staff.id;

                return (
                  <tr key={staff.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={staff.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'}
                          alt={staff.name}
                          className="h-10 w-10 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 text-xs">{staff.name}</span>
                            {isCurrentLoggedIn && (
                              <span className="px-1.5 py-0.2 rounded-md bg-teal-100 text-teal-800 font-extrabold text-[9px]">
                                {t('YOU')}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 block">{staff.email}</span>
                          {staff.assignedCategories && staff.assignedCategories.length > 0 && (
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {t('Restricted to')}: {staff.assignedCategories.join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          staff.role === 'SUPER_ADMIN'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : staff.role === 'NEWS_ADMIN'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : staff.role === 'EDITOR'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : staff.role === 'REVIEWER'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : staff.role === 'PUBLISHER'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-800 border border-slate-200'
                        }`}>
                          {staff.role.replace('_', ' ')}
                        </span>
                        <span className="text-[11px] text-slate-600 block">
                          <strong>{staff.permissions.length}</strong> {t('active permissions')}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        staff.status === 'active'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : staff.status === 'pending_approval'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : staff.status === 'suspended'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {staff.status === 'active' && <CheckCircle2 className="h-3 w-3 text-emerald-600" />}
                        {staff.status === 'pending_approval' && <Clock className="h-3 w-3 text-amber-600" />}
                        {staff.status === 'suspended' && <ShieldAlert className="h-3 w-3 text-rose-600" />}
                        {staff.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="p-4 text-slate-600 text-[11px]">
                      {staff.lastLogin ? (
                        <div>
                          <span className="font-semibold text-slate-800 block">
                            {new Date(staff.lastLogin).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(staff.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">{t('Never logged in')}</span>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                          staff.mfaEnabled ? 'text-teal-700' : 'text-slate-400'
                        }`}>
                          <KeyRound className="h-3 w-3" />
                          {staff.mfaEnabled ? t('2FA Enabled') : t('2FA Disabled')}
                        </span>
                        {staff.accessExpiry && (
                          <span className="text-[10px] text-amber-700 block">
                            {t('Expires')}: {new Date(staff.accessExpiry).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(staff)}
                          title={t('Edit Permissions & Role')}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>

                        {staff.status === 'active' ? (
                          <button
                            onClick={() => handleToggleStatus(staff, 'suspended')}
                            title={t('Suspend Staff Account')}
                            className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 transition cursor-pointer"
                          >
                            <Power className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(staff, 'active')}
                            title={t('Activate / Re-enable Staff Account')}
                            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition cursor-pointer"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleForceLogout(staff)}
                          title={t('Force Session Termination')}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </button>

                        {!isSuperAdmin && (
                          <button
                            onClick={() => setDeleteConfirmStaff(staff)}
                            title={t('Delete Staff Authorization')}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Staff Modal */}
      {(isAddModalOpen || editingStaff) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 my-auto">
            
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-widest block">
                  {t('Credential Provisioning')}
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  {editingStaff ? t('Edit Staff Permissions & Security') : t('Add New Authorized Staff')}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingStaff(null);
                }}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={editingStaff ? handleSaveEdit : handleSaveAdd} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    {t('Full Name & Title')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Jennifer Hayes, MD"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    {t('Work Email Address')} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. jhayes@globalhealth.org"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    {t('Primary Role Tier')} *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleRoleChangeInForm(e.target.value as StaffRole)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-hidden"
                  >
                    <option value="SUPER_ADMIN">SUPER ADMIN</option>
                    <option value="NEWS_ADMIN">NEWS ADMIN</option>
                    <option value="EDITOR">EDITOR</option>
                    <option value="REVIEWER">REVIEWER</option>
                    <option value="PUBLISHER">PUBLISHER</option>
                    <option value="AUTHOR">AUTHOR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    {t('Account Status')} *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as StaffAccountStatus })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-hidden"
                  >
                    <option value="active">{t('Active & Authorized')}</option>
                    <option value="pending_approval">{t('Pending Approval')}</option>
                    <option value="suspended">{t('Suspended')}</option>
                    <option value="disabled">{t('Disabled')}</option>
                    <option value="expired">{t('Expired')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    {t('Access Expiry Date (Optional)')}
                  </label>
                  <input
                    type="date"
                    value={formData.accessExpiry}
                    onChange={(e) => setFormData({ ...formData, accessExpiry: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* MFA Toggle */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-xs block">
                    {t('Enforce Two-Factor Authentication (2FA/MFA)')}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {t('Requires TOTP authentication code on every management login')}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.mfaEnabled}
                  onChange={(e) => setFormData({ ...formData, mfaEnabled: e.target.checked })}
                  className="h-4 w-4 rounded-sm border-slate-300 text-teal-600 focus:ring-teal-500"
                />
              </div>

              {/* Granular Permissions Checklist */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                    {t('Granular Permissions Matrix')} ({formData.permissions.length} {t('selected')})
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, permissions: ALL_STAFF_PERMISSIONS.map((p) => p.key) })}
                    className="text-[11px] font-bold text-teal-700 hover:underline"
                  >
                    {t('Grant All Permissions')}
                  </button>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 max-h-60 overflow-y-auto p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  {ALL_STAFF_PERMISSIONS.map((perm) => {
                    const isChecked = formData.permissions.includes(perm.key);
                    return (
                      <label
                        key={perm.key}
                        className={`p-2.5 rounded-xl border transition flex items-start gap-2.5 cursor-pointer ${
                          isChecked
                            ? 'bg-white border-teal-500/50 shadow-2xs'
                            : 'bg-white/40 border-slate-200 opacity-70'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(perm.key)}
                          className="h-4 w-4 mt-0.5 rounded-sm border-slate-300 text-teal-600 focus:ring-teal-500"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-slate-900 truncate">{perm.label}</span>
                            {perm.critical && (
                              <span className="text-[9px] font-bold uppercase px-1 rounded-sm bg-rose-100 text-rose-700">
                                {t('CRITICAL')}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                            {perm.description}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  {t('Internal Security / Role Notes')}
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Clinical reviewer specializing in Phase 3 oncology trials and immunology."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingStaff(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  {t('Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  {editingStaff ? t('Save Permissions') : t('Provision Staff Account')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600">
              <ShieldAlert className="h-6 w-6" />
              <h3 className="text-lg font-black text-slate-900">{t('Revoke Staff Authorization?')}</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('Are you sure you want to permanently delete the staff record for')} <strong className="text-slate-900">{deleteConfirmStaff.name}</strong> ({deleteConfirmStaff.email})? {t('This will immediately terminate all active sessions.')}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmStaff(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                {t('Cancel')}
              </button>
              <button
                onClick={() => handleDeleteStaff(deleteConfirmStaff)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition"
              >
                {t('Revoke Authorization')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
