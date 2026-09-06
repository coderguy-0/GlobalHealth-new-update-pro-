import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Stethoscope,
  ChevronDown,
  LogOut,
  UserCheck,
  ArrowLeft,
  Building2,
  Lock,
  Activity,
  CheckCircle2,
  Sparkles,
  Shield
} from 'lucide-react';
import { DoctorProfile } from '../../types/medauth';

interface MedAuthNavbarProps {
  verifiedCount: number;
  activeDoctor: DoctorProfile | null;
  allDoctors: DoctorProfile[];
  onLogout: () => void;
  onSelectDoctor?: (doc: DoctorProfile) => void;
  onBackToGlobalHealth?: () => void;
}

export const MedAuthNavbar: React.FC<MedAuthNavbarProps> = ({
  verifiedCount,
  activeDoctor,
  onLogout,
  onBackToGlobalHealth
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-900 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          {onBackToGlobalHealth && (
            <button
              onClick={onBackToGlobalHealth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 border border-slate-200 transition cursor-pointer whitespace-nowrap"
              title="Return to GlobalHealth Public Portal"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to GlobalHealth</span>
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                MedAuth<span className="text-emerald-700 font-semibold">Engine™</span>
              </span>
              <span className="text-[10px] text-slate-500 block -mt-1 font-mono">
                State Board Registry &amp; Private Doctor Portal
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation & Security Status Zone */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 bg-emerald-50/70 border border-emerald-200 rounded-full px-3 py-1 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="text-emerald-900 font-medium whitespace-nowrap">
              <strong className="text-emerald-800 font-bold">Isolated Session</strong> • End-to-End Encrypted
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>NPI &amp; DEA Verified</span>
          </div>
        </div>

        {/* Zone 3: Action & Authenticated Identity Zone */}
        <div className="flex items-center gap-2.5">
          {activeDoctor ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-left transition cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-bold text-xs">
                  {activeDoctor?.fullName ? (activeDoctor.fullName.replace('Dr. ', '').charAt(0) || 'D') : 'D'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[140px]">
                    {activeDoctor.fullName}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-700 -mt-0.5">
                    NPI: {activeDoctor.npiNumber}
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Secure Doctor Account Panel (NO cross-account switching) */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 divide-y divide-slate-100 animate-in fade-in">
                  <div className="pb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Authenticated Practitioner
                      </span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                        VERIFIED
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">{activeDoctor.fullName}</div>
                    <div className="text-[11px] text-emerald-700 font-semibold">{activeDoctor.speciality}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{activeDoctor.hospitalAffiliation}</div>
                    <div className="mt-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-[10px] text-slate-600 space-y-0.5">
                      <div className="flex justify-between">
                        <span className="text-slate-400">License / Reg:</span>
                        <span className="font-mono font-bold text-slate-700">{activeDoctor.medicalCouncilNumber || activeDoctor.licenseNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Badge ID:</span>
                        <span className="font-mono text-emerald-700 font-bold">{activeDoctor.verificationBadgeId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        onLogout();
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Lock &amp; Sign Out</span>
                    </button>
                    <p className="text-[9px] text-slate-400 text-center mt-1.5">
                      To access a different doctor account, sign out and authenticate.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 hidden sm:inline">Practitioner Auth Portal</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono">
                AUTHENTICATION REQUIRED
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
