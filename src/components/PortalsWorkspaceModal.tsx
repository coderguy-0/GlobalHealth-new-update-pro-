import React, { useState } from 'react';
import { 
  X, 
  Stethoscope, 
  Building2, 
  ShoppingBag, 
  Newspaper, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  ExternalLink,
  Search,
  Sparkles,
  Layers,
  Activity,
  FileCheck,
  ShieldAlert,
  Server
} from 'lucide-react';
import { NavigationTab } from '../types';

interface PortalsWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPortal: (tab: NavigationTab) => void;
}

export const PortalsWorkspaceModal: React.FC<PortalsWorkspaceModalProps> = ({
  isOpen,
  onClose,
  onSelectPortal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'clinical' | 'enterprise' | 'pharmacy' | 'editorial'>('all');

  if (!isOpen) return null;

  const handleLaunch = (tab: NavigationTab) => {
    onSelectPortal(tab);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="portal-workspace-title"
    >
      <div className="relative w-full max-w-5xl my-auto rounded-3xl bg-slate-900 text-slate-100 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header Strip with Institutional Branding */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="portal-workspace-title" className="text-lg font-extrabold text-white tracking-tight">
                  GlobalHealth Specialized Portals
                </h2>
                <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-500/30">
                  Enterprise Workspace
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Institutional clinical, hospital administration, pharmacy logistics, and editorial management portals.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>HIPAA &amp; HL7 FHIR Compliant</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close portal workspace"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filter and Quick Category Toolbar */}
        <div className="px-6 py-3 border-b border-slate-800/80 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {[
              { id: 'all', label: 'All Portals' },
              { id: 'clinical', label: 'Physician & Doctor' },
              { id: 'enterprise', label: 'Hospital Operations' },
              { id: 'pharmacy', label: 'Pharmacy Partners' },
              { id: 'editorial', label: 'Editorial & News' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search portal features..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Main Grid Content Area */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Doctor Portal (MedAuth Engine™) */}
            {(activeCategory === 'all' || activeCategory === 'clinical') && (
              <div className="group relative rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 p-5 shadow-xl transition hover:border-emerald-500/60 hover:shadow-emerald-950/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 group-hover:scale-105 transition">
                        <Stethoscope className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                          <span>Doctor Portal</span>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                            MedAuth Engine™
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-emerald-400">
                          State Board Registry &amp; Private Doctor Portal
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Dedicated clinical operating system for licensed medical practitioners. Access unified patient EHR, initiate telemedicine consultations, digitally sign electronic prescriptions with cryptographic validity, and manage patient consent tokens.
                  </p>

                  <div className="space-y-1.5 mb-4 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>State Medical Board identity verification &amp; NPI syncing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>FHIR R4-compliant diagnostic review &amp; lab ordering</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Encrypted direct patient-to-physician clinical messaging</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400">
                    Authority-Only Access
                  </span>
                  <button
                    onClick={() => handleLaunch('doctor-portal')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md cursor-pointer group-hover:translate-x-0.5"
                  >
                    <span>Launch Doctor Portal</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* 2. Hospital Portal (GlobalHealth Enterprise) */}
            {(activeCategory === 'all' || activeCategory === 'enterprise') && (
              <div className="group relative rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30 p-5 shadow-xl transition hover:border-indigo-500/60 hover:shadow-indigo-950/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 group-hover:scale-105 transition">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                          <span>Hospital Portal</span>
                          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono px-2 py-0.5 rounded-full border border-indigo-500/30">
                            GlobalHealth Enterprise
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-indigo-400">
                          Hospital Staff &amp; Multi-Wing Clinical Operations
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Enterprise hospital management system for department heads, triage nurses, and administrators. Manage real-time ICU and ward bed capacity, coordinate emergency trauma ambulances, maintain blood bank reserves, and configure tariff schedules.
                  </p>

                  <div className="space-y-1.5 mb-4 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                      <span>Real-time ICU, ventilator &amp; general bed telemetry</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                      <span>GPS-integrated emergency ambulance dispatch &amp; routing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                      <span>Multi-department staff role-based access control (RBAC)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400">
                    Institutional Tier v3.8
                  </span>
                  <button
                    onClick={() => handleLaunch('hospital-portal')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md cursor-pointer group-hover:translate-x-0.5"
                  >
                    <span>Launch Hospital Portal</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* 3. Pharmacy Porter (Enterprise v4.2) */}
            {(activeCategory === 'all' || activeCategory === 'pharmacy') && (
              <div className="group relative rounded-2xl border border-teal-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/30 p-5 shadow-xl transition hover:border-teal-500/60 hover:shadow-teal-950/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 group-hover:scale-105 transition">
                        <ShoppingBag className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                          <span>pharmacy porter</span>
                          <span className="text-[10px] bg-teal-500/20 text-teal-300 font-mono px-2 py-0.5 rounded-full border border-teal-500/30">
                            Enterprise v4.2
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-teal-400">
                          Authorized Pharmacy Portal Website • Verified Pharmacy Partners
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Independent operations portal for licensed hospital dispensaries, retail pharmacies, and clinical chains. Manage real-time medicine catalogs, verify doctor prescriptions, process orders, control batch inventory, and sync availability with the GlobalHealth patient ecosystem.
                  </p>

                  <div className="space-y-1.5 mb-4 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                      <span>Prescription OCR &amp; Pharmacist Sign-Off Workflow</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                      <span>Real-Time Stock &amp; Batch Expiry Quarantine Management</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                      <span>Multi-Branch RBAC &amp; Automated Daily Payouts</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400">
                    State Pharmacy Council Regulated
                  </span>
                  <button
                    onClick={() => handleLaunch('pharmacy-portal')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition shadow-md cursor-pointer group-hover:translate-x-0.5"
                  >
                    <span>Launch Pharmacy Porter</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* 4. News Management & Verified Authority */}
            {(activeCategory === 'all' || activeCategory === 'editorial') && (
              <div className="group relative rounded-2xl border border-purple-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/30 p-5 shadow-xl transition hover:border-purple-500/60 hover:shadow-purple-950/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 group-hover:scale-105 transition">
                        <Newspaper className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                          <span>news management</span>
                          <span className="text-[10px] bg-purple-500/20 text-purple-300 font-mono px-2 py-0.5 rounded-full border border-purple-500/30">
                            Editorial CMS
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-purple-400">
                          Medical Editorial CMS &amp; Verified Authority Portal
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Official publishing and verification engine for accredited health journalism, peer-reviewed clinical trial summaries, disease alerts, and health ministry press releases.
                  </p>

                  <div className="space-y-1.5 mb-4 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                      <span>Peer-reviewed clinical evidence scoring &amp; reference tagging</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                      <span>Verified Authority Portal for WHO, CDC &amp; Health Ministries</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                      <span>Fact-checking review queues and scheduled article publishing</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleLaunch('news-authority')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-200 hover:text-white border border-purple-500/30 text-xs font-semibold transition cursor-pointer"
                  >
                    <Building2 className="h-3.5 w-3.5 text-purple-400" />
                    <span>Verified Authority</span>
                  </button>
                  <button
                    onClick={() => handleLaunch('news-management')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-md cursor-pointer group-hover:translate-x-0.5"
                  >
                    <span>Launch News Management</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Banner */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/70 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Server className="h-3.5 w-3.5 text-emerald-400" />
            <span>Encrypted 256-bit TLS • Zero-Trust Role Based Infrastructure</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 underline font-medium cursor-pointer"
          >
            Return to Public GlobalHealth Website
          </button>
        </div>
      </div>
    </div>
  );
};
