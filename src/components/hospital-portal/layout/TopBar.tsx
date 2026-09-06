import React, { useState } from 'react';
import {
  Building2,
  Siren,
  ShieldCheck,
  ChevronDown,
  User,
  LogOut,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';

interface TopBarProps {
  onBackToPublic?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onBackToPublic }) => {
  const {
    hospitals,
    currentHospital,
    setCurrentHospitalId,
    currentUser,
    currentRole,
    registeredUsers,
    quickSwitchUser,
    logout,
    toggleRedAlert,
    openModal,
    twoFactorVerified
  } = useHospitalPortal();

  const [isHospitalDropdownOpen, setIsHospitalDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [showRedAlertConfirm, setShowRedAlertConfirm] = useState(false);

  const isSuperAdmin = currentRole === 'GlobalHealth SuperAdmin';
  const tenantUsers = registeredUsers.filter((u) => isSuperAdmin || !u.hospitalId || u.hospitalId === currentHospital.id);

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#DCEBE4] shadow-xs px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left Zone: Brand & Institution Switcher */}
        <div className="flex items-center gap-3">
          {onBackToPublic && (
            <button
              onClick={onBackToPublic}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F1FAF6] hover:bg-[#DCEBE4] text-[#17221E] text-xs font-bold transition border border-[#DCEBE4] cursor-pointer"
              title="Return to Public Health & Doctors Directory"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Public Portal</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#17221E] text-base tracking-tight flex items-center gap-1.5">
              <span className="h-6 w-6 rounded-lg bg-[#008F68] text-white flex items-center justify-center text-xs font-black">
                GH
              </span>
              <span>GlobalHealth</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#E8F7F1] text-[#008F68] border border-[#BDE4D5] hidden md:inline">
                Enterprise
              </span>
            </span>
          </div>

          <div className="h-5 w-px bg-[#DCEBE4] hidden sm:block" />

          {/* Hospital Institution Display / SuperAdmin Switcher */}
          <div className="relative">
            {isSuperAdmin ? (
              <>
                <button
                  onClick={() => {
                    setIsHospitalDropdownOpen(!isHospitalDropdownOpen);
                    setIsUserDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F6FBF8] hover:bg-[#F1FAF6] border border-[#008F68] text-left transition cursor-pointer shadow-xs"
                >
                  <Building2 className="h-4 w-4 text-[#008F68] shrink-0" />
                  <div className="truncate max-w-[160px] sm:max-w-[240px]">
                    <div className="text-xs font-bold text-[#17221E] truncate flex items-center gap-1">
                      <span>{currentHospital?.name}</span>
                      <span className="text-[9px] bg-[#E8F7F1] text-[#008F68] font-bold px-1 rounded">SuperAdmin View</span>
                    </div>
                    <div className="text-[10px] text-[#52635C] font-mono">{currentHospital?.id}</div>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-[#52635C] shrink-0" />
                </button>

                {isHospitalDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-white border border-[#DCEBE4] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 text-[11px] font-bold text-[#52635C] uppercase tracking-wider border-b border-[#DCEBE4] flex items-center justify-between">
                      <span>Authority Cross-Tenant Switcher</span>
                      <button
                        onClick={() => {
                          setIsHospitalDropdownOpen(false);
                          openModal('register_hospital');
                        }}
                        className="text-[#008F68] hover:underline font-bold text-xs"
                      >
                        + Enroll Facility
                      </button>
                    </div>
                    <div className="max-h-60 overflow-y-auto py-1 space-y-1">
                      {hospitals.map((h) => (
                        <button
                          key={h.id}
                          onClick={() => {
                            setCurrentHospitalId(h.id);
                            setIsHospitalDropdownOpen(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between ${
                            h.id === currentHospital.id
                              ? 'bg-[#E8F7F1] border border-[#BDE4D5]'
                              : 'hover:bg-[#F1FAF6] border border-transparent'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <div className="text-xs font-bold text-[#17221E] truncate">{h.name}</div>
                            <div className="text-[10px] text-[#52635C] font-mono">
                              {h.city}, {h.country} • {h.totalBedsCount || 500} Beds
                            </div>
                          </div>
                          {h.id === currentHospital.id && (
                            <CheckCircle2 className="h-4 w-4 text-[#008F68] shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Locked Single-Tenant Organization Badge */
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F6FBF8] border border-[#D8E7E0] text-left cursor-default select-none"
                title="Single-Tenant Isolated Workspace: Your session is cryptographically bound to this hospital institution."
              >
                <div className="p-1 rounded-lg bg-[#E8F7F1] text-[#008F68] shrink-0">
                  <Building2 className="h-3.5 w-3.5" />
                </div>
                <div className="truncate max-w-[160px] sm:max-w-[240px]">
                  <div className="text-xs font-bold text-[#17221E] truncate flex items-center gap-1.5">
                    <span>{currentHospital?.name}</span>
                    <span className="text-[9px] bg-[#E8F7F1] text-[#008F68] font-bold px-1.5 py-0.2 rounded-full border border-[#BDE4D5] hidden sm:inline">
                      Isolated Realm
                    </span>
                  </div>
                  <div className="text-[10px] text-[#52635C] font-mono flex items-center gap-1">
                    <span>{currentHospital?.id}</span>
                    <span>•</span>
                    <span className="text-[#008F68] font-medium">Tenant Verified</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Zone: Red Alert Trigger & User Persona Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Emergency Code Red Beacon */}
          <button
            onClick={() => setShowRedAlertConfirm(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
              currentHospital.redAlertActive
                ? 'bg-[#D64545] text-white animate-pulse'
                : 'bg-[#FFF1F1] text-[#C53939] border border-[#F2CCCC] hover:bg-[#D64545] hover:text-white'
            }`}
            title="Trigger or stand down facility-wide Code Red mass casualty alert"
          >
            <Siren className="h-4 w-4" />
            <span className="hidden md:inline">
              {currentHospital.redAlertActive ? 'CODE RED ACTIVE' : 'CODE RED PROTOCOL'}
            </span>
          </button>

          {/* 2FA Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#E8F7F1] border border-[#BDE4D5] text-[#008F68] text-[11px] font-bold">
            <KeyRound className="h-3.5 w-3.5" />
            <span>2FA Enforced</span>
          </div>

          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsUserDropdownOpen(!isUserDropdownOpen);
                setIsHospitalDropdownOpen(false);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#F6FBF8] hover:bg-[#F1FAF6] border border-[#D8E7E0] transition cursor-pointer"
            >
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-7 w-7 rounded-full object-cover border border-[#008F68]"
                />
              ) : (
                <div className="h-7 w-7 rounded-full bg-[#008F68] text-white flex items-center justify-center text-xs font-bold">
                  {currentUser?.name?.slice(0, 2) || 'AD'}
                </div>
              )}
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-[#17221E] leading-tight truncate max-w-[130px]">
                  {currentUser?.name}
                </div>
                <div className="text-[10px] text-[#008F68] font-bold truncate max-w-[130px]">
                  {currentRole}
                </div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-[#52635C]" />
            </button>

            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-[#DCEBE4] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-[#DCEBE4] mb-1">
                  <div className="text-xs font-bold text-[#17221E]">{currentUser?.name}</div>
                  <div className="text-[11px] text-[#52635C] font-mono">{currentUser?.email}</div>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F7F1] text-[#008F68] border border-[#BDE4D5]">
                    {currentRole}
                  </span>
                </div>

                <div className="px-3 py-1.5 text-[10px] font-bold text-[#52635C] uppercase tracking-wider">
                  {isSuperAdmin ? 'Quick Switch Role Persona (All Tenancy)' : `Active Hospital Staff (${tenantUsers.length} Roles)`}
                </div>

                <div className="max-h-60 overflow-y-auto space-y-1 py-1">
                  {tenantUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        quickSwitchUser(u.id);
                        setIsUserDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl transition flex items-center gap-2.5 ${
                        u.id === currentUser?.id
                          ? 'bg-[#E8F7F1] border border-[#BDE4D5]'
                          : 'hover:bg-[#F1FAF6] border border-transparent'
                      }`}
                    >
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={u.name}
                        className="h-6 w-6 rounded-full object-cover shrink-0"
                      />
                      <div className="truncate">
                        <div className="text-xs font-bold text-[#17221E] truncate">{u.name}</div>
                        <div className="text-[10px] text-[#52635C] truncate">{u.role}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#DCEBE4] mt-1">
                  <button
                    onClick={() => {
                      logout();
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-[#C53939] hover:bg-[#FFF1F1] rounded-xl transition cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out Cleanly</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Red Alert Confirmation Modal */}
      {showRedAlertConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17221E]/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#F2CCCC] shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#FFF1F1] text-[#D64545]">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#C53939]">
                  {currentHospital.redAlertActive ? 'Stand Down Code Red Alert?' : 'Activate Facility Code Red Alert?'}
                </h4>
                <p className="text-xs text-[#52635C]">Mass Casualty & Emergency Protocol System</p>
              </div>
            </div>

            <p className="text-xs text-[#17221E] leading-relaxed">
              {currentHospital.redAlertActive
                ? 'Deactivating Code Red will notify on-call trauma surgeons and dispatch teams that the facility has returned to standard operational readiness.'
                : 'Triggering Code Red broadcasts an immediate emergency directive across all trauma bays, prioritizes STAT blood crossmatches, and readies emergency OT suites.'}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DCEBE4]">
              <button
                onClick={() => setShowRedAlertConfirm(false)}
                className="px-4 py-2 text-xs font-bold text-[#52635C] hover:bg-[#F1FAF6] rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toggleRedAlert();
                  setShowRedAlertConfirm(false);
                }}
                className={`px-5 py-2 text-xs font-bold text-white rounded-xl transition shadow-xs cursor-pointer ${
                  currentHospital.redAlertActive
                    ? 'bg-[#008F68] hover:bg-[#007A59]'
                    : 'bg-[#D64545] hover:bg-[#C53939]'
                }`}
              >
                {currentHospital.redAlertActive ? 'Stand Down Alert' : 'Confirm & Trigger Code Red'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
