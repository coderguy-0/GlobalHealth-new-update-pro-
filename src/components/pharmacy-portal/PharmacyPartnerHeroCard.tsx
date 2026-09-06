import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  FileCheck, 
  Layers, 
  CheckCircle2, 
  Search, 
  PlusCircle, 
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface PharmacyPartnerHeroCardProps {
  onOpenPortal: () => void;
  onOpenApply: () => void;
  onOpenTrack: () => void;
}

export const PharmacyPartnerHeroCard: React.FC<PharmacyPartnerHeroCardProps> = ({
  onOpenPortal,
  onOpenApply,
  onOpenTrack
}) => {
  return (
    <div className="mt-6 pt-6 border-t border-teal-500/20 bg-gradient-to-r from-slate-900/90 via-teal-950/80 to-slate-900/90 rounded-2xl p-5 sm:p-6 border border-teal-500/30 shadow-2xl relative overflow-hidden group">
      {/* Background Subtle Highlights */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left Info Column */}
        <div className="space-y-2.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-500/20 border border-teal-400/40 text-[11px] font-extrabold uppercase tracking-wider text-teal-300">
              <Building2 className="w-3.5 h-3.5 text-teal-300" />
              <span>Verified Pharmacy Partners</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-[11px] font-bold text-slate-300">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Authorized Pharmacy Portal Website</span>
            </span>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span>GlobalHealth Pharmacy Partner Portal</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                Enterprise v4.2
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">
              Independent operations portal for licensed hospital dispensaries, retail pharmacies, and clinical chains. Manage real-time medicine catalogs, verify doctor prescriptions, process orders, control batch inventory, and sync availability with the GlobalHealth patient ecosystem.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-slate-300 pt-1">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Prescription OCR & Pharmacist Sign-Off</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Real-Time Stock & Batch Expiry Quarantine</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Multi-Branch RBAC & Daily Payouts</span>
            </div>
          </div>
        </div>

        {/* Right Action Column */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 w-full lg:w-auto shrink-0">
          <button
            onClick={onOpenPortal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-black text-xs transition-all shadow-lg shadow-teal-950/50 hover:shadow-teal-500/20 cursor-pointer text-center"
          >
            <Lock className="w-4 h-4 text-slate-950" />
            <span>Launch Pharmacy Partner Portal</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onOpenApply}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-teal-200 border border-teal-500/30 text-[11px] font-bold transition cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-teal-300" />
              <span>Apply for Verification</span>
            </button>

            <button
              onClick={onOpenTrack}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-bold transition cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Track Application</span>
            </button>
          </div>

          <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Regulated by State Pharmacy Council & CDSCO Guidelines</span>
          </div>
        </div>

      </div>
    </div>
  );
};
