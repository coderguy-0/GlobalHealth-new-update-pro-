import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Bell, 
  ShieldCheck, 
  HelpCircle, 
  ChevronDown, 
  LogOut, 
  User, 
  Settings, 
  FileText, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ExternalLink,
  Shield,
  Activity,
  Layers,
  KeyRound,
  X
} from 'lucide-react';
import { PharmacyStaffMember, PharmacyBranchInfo, PortalNotificationItem, PharmacyProfileDetails } from '../../types/pharmacyPortal';
import { PharmacyPortalService } from '../../services/pharmacyPortalStore';

interface PharmacyPortalHeaderProps {
  currentStaff?: PharmacyStaffMember;
  currentUser?: PharmacyStaffMember;
  profile: PharmacyProfileDetails;
  branches?: PharmacyBranchInfo[];
  currentBranchId?: string;
  onBranchChange?: (branchId: string) => void;
  notifications?: PortalNotificationItem[];
  onNotificationClick?: (id: string) => void;
  onNavigateTab?: (tabId: string) => void;
  onOpenSupport?: () => void;
  onLogout: () => void;
  onBackToUserSite?: () => void;
  onReturnToMainApp?: () => void;
  onToggleMobileSidebar?: () => void;
  pendingRxCount?: number;
  activeOrdersCount?: number;
}

export const PharmacyPortalHeader: React.FC<PharmacyPortalHeaderProps> = ({
  currentStaff,
  currentUser,
  profile,
  branches = [],
  currentBranchId,
  onBranchChange,
  notifications = [],
  onNotificationClick,
  onNavigateTab,
  onOpenSupport,
  onLogout,
  onBackToUserSite,
  onReturnToMainApp,
  onToggleMobileSidebar
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);
  const [isBadgeOpen, setIsBadgeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const safeBranches = (branches && Array.isArray(branches) && branches.length > 0) 
    ? branches 
    : PharmacyPortalService.getBranches();

  const safeStaff: PharmacyStaffMember = currentStaff || currentUser || PharmacyPortalService.getStaff()[0] || {
    id: 'staff-default',
    name: 'Dr. S. K. Ramanathan',
    role: 'Pharmacy Owner',
    email: 'dispensary@apexhealth.org',
    phone: '+91 98110 00000',
    status: 'Active',
    assignedBranchId: 'branch-1',
    assignedBranchName: 'Main Dispensary',
    lastLogin: new Date().toISOString(),
    permissions: {
      canReviewPrescriptions: true,
      canModifyPrices: true,
      canManageInventory: true,
      canManageStaff: true,
      canViewFinancials: true,
      canDispenseMedicines: true,
      canManageBranches: true
    }
  };

  const safeNotifs = (notifications && Array.isArray(notifications))
    ? notifications
    : PharmacyPortalService.getNotifications();

  const activeBranchId = currentBranchId || safeBranches[0]?.id || '';
  const currentBranch = safeBranches.find(b => b.id === activeBranchId) || safeBranches[0] || {
    id: 'branch-1',
    name: 'Main Pharmacy Branch',
    isMainDepot: true,
    code: 'MAIN-01',
    address: 'Medical Complex',
    city: 'New Delhi',
    state: 'Delhi',
    phone: '+91 11 0000 0000',
    managerName: 'Branch Manager',
    status: 'Active',
    operatingHours: '24 Hours',
    deliveryRadiusKm: 15,
    activeOrdersCount: 0,
    totalMedicinesCount: 0
  };

  const unreadCount = safeNotifs.filter(n => !n.isRead).length;
  const isVerified = profile.verificationStatus === 'Verified';
  const verificationLabel = profile.verificationStatus || 'Verification Pending';

  const handleReturnToMain = () => {
    if (onReturnToMainApp) onReturnToMainApp();
    else if (onBackToUserSite) onBackToUserSite();
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-2.5 text-white">
      <div className="flex items-center justify-between gap-3">
        
        {/* Left Zone: Brand + Branch Selector */}
        <div className="flex items-center gap-3 shrink-0">
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 flex items-center justify-center font-black text-sm shadow-md shadow-teal-500/20">
              <Building2 className="w-4.5 h-4.5" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-white tracking-tight">GlobalHealth</span>
                <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">Pharmacy Partner</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                {profile.tradeName}
              </div>
            </div>
          </div>

          <div className="h-5 w-px bg-slate-800 hidden md:block" />

          {/* Branch Switcher Dropdown */}
          <div className="relative hidden md:block">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition">
              <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <select
                value={activeBranchId}
                onChange={(e) => onBranchChange?.(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer pr-1"
              >
                {safeBranches.map(b => (
                  <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Live Regulated Verification Badge */}
          <div className="relative">
            <button
              onClick={() => setIsBadgeOpen(!isBadgeOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold transition cursor-pointer ${
                isVerified
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                  : profile.verificationStatus === 'Suspended' || profile.verificationStatus === 'Rejected'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${isVerified ? 'text-emerald-400' : profile.verificationStatus === 'Suspended' || profile.verificationStatus === 'Rejected' ? 'text-rose-400' : 'text-amber-400'}`} />
              <span className="hidden lg:inline">{isVerified ? 'Verified Partner' : verificationLabel}</span>
              <span className="text-[10px] font-mono opacity-80">{profile.complianceScore}% Compliance</span>
            </button>

            {/* Popover */}
            {isBadgeOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl z-50 text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Regulatory Verification
                  </span>
                  <button onClick={() => setIsBadgeOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Drug License:</span>
                    <span className="font-mono font-bold text-teal-300">{profile.licenseNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pharmacist In-Charge:</span>
                    <span className="font-bold text-slate-200">{profile.pharmacistInCharge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">PCI Registration:</span>
                    <span className="font-mono text-slate-200">{profile.pharmacistRegNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Accredited Since:</span>
                    <span className="text-slate-200">{profile.verifiedSince}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Regulatory Audit:</span>
                    <span className="text-emerald-400 font-bold">{profile.lastAuditedDate}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setIsBadgeOpen(false);
                      onNavigateTab?.('documents');
                    }}
                    className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-center transition text-[11px]"
                  >
                    View Compliance Documents
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Center Zone: Universal Search */}
        <div className="flex-1 max-w-md mx-2 hidden md:block">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog, SKU, prescription ID, batch..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3.5 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Right Zone: Notifications, Support, Staff Profile */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setIsNotifsOpen(!isNotifsOpen)}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 transition relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotifsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl z-50 text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-teal-400" />
                    Portal Alerts ({unreadCount} new)
                  </span>
                  <button onClick={() => setIsNotifsOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {safeNotifs.map(n => (
                    <div 
                      key={n.id}
                      onClick={() => {
                        onNotificationClick?.(n.id);
                        if (n.category === 'prescription') onNavigateTab?.('prescriptions');
                        else if (n.category === 'stock' || n.category === 'expiry') onNavigateTab?.('inventory');
                        else if (n.category === 'order') onNavigateTab?.('orders');
                        setIsNotifsOpen(false);
                      }}
                      className={`p-2.5 rounded-xl border transition cursor-pointer ${
                        !n.isRead 
                          ? 'bg-slate-950 border-teal-500/40 text-slate-200' 
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-bold text-xs ${
                          n.priority === 'Critical' ? 'text-rose-400' : n.priority === 'Important' ? 'text-amber-400' : 'text-teal-300'
                        }`}>
                          {n.title}
                        </span>
                        <span className="text-[9px] text-slate-500">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 leading-snug">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Support Shortcut */}
          <button
            onClick={() => onNavigateTab ? onNavigateTab('support') : onOpenSupport?.()}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 transition cursor-pointer"
            title="Compliance & Platform Support"
          >
            <HelpCircle className="w-4 h-4 text-teal-400" />
          </button>

          {/* Staff Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-xs">
                {safeStaff?.name?.charAt(0) || 'P'}
              </div>
              <div className="text-left hidden xl:block">
                <div className="text-xs font-bold text-white truncate max-w-[120px]">{safeStaff?.name || 'Staff Member'}</div>
                <div className="text-[10px] text-teal-400 font-medium">{safeStaff?.role || 'Staff'}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-2xl z-50 text-xs space-y-1">
                <div className="p-2 border-b border-slate-800 pb-2.5 mb-1">
                  <div className="font-bold text-white">{safeStaff.name}</div>
                  <div className="text-[11px] text-teal-400">{safeStaff.role}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{safeStaff.email}</div>
                </div>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onNavigateTab?.('profile');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition text-left cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Pharmacy Profile</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onNavigateTab?.('staff');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition text-left cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Staff & Roles</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onNavigateTab?.('audit-logs');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition text-left cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5 text-slate-400" />
                  <span>Audit Logs</span>
                </button>

                <div className="h-px bg-slate-800 my-1" />

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    handleReturnToMain();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-teal-300 transition text-left cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
                  <span>Switch to Patient Site</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 transition text-left cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
