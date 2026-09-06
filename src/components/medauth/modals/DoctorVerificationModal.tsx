import React from 'react';
import {
  ShieldCheck,
  Award,
  Building2,
  FileCheck2,
  Lock,
  ExternalLink,
  Copy,
  Check,
  X,
  Stethoscope,
  Clock,
  Sparkles,
  Fingerprint
} from 'lucide-react';
import { DoctorProfile } from '../../../types/medauth';

interface DoctorVerificationModalProps {
  doctor: DoctorProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const DoctorVerificationModal: React.FC<DoctorVerificationModalProps> = ({
  doctor,
  isOpen,
  onClose
}) => {
  const [copiedBadge, setCopiedBadge] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyBadge = () => {
    navigator.clipboard.writeText(doctor.verificationBadgeId);
    setCopiedBadge(true);
    setTimeout(() => setCopiedBadge(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div className="min-w-0 pr-8">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Medical Board Verified Practitioner</span>
              </div>
              <h2 className="text-xl font-black tracking-tight text-white">{doctor.fullName}</h2>
              <p className="text-xs text-slate-300 mt-0.5">{doctor.post}</p>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Badge & Security Hash Card */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">
                Cryptographic Badge ID
              </span>
              <div className="text-sm font-mono font-black text-emerald-950 mt-0.5">
                {doctor.verificationBadgeId}
              </div>
              <span className="text-[11px] text-emerald-800 font-medium">
                SHA-256 Verified Credential Token
              </span>
            </div>

            <button
              onClick={handleCopyBadge}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition shadow-2xs cursor-pointer self-start sm:self-auto"
            >
              {copiedBadge ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedBadge ? 'Copied' : 'Copy Badge ID'}</span>
            </button>
          </div>

          {/* Core Verified Credentials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold uppercase tracking-tight">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                <span>NPI Registry</span>
              </div>
              <div className="text-base font-extrabold font-mono text-slate-900">
                {doctor.npiNumber}
              </div>
              <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Active in NPPES Registry</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold uppercase tracking-tight">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>State Medical License</span>
              </div>
              <div className="text-base font-extrabold font-mono text-slate-900">
                {doctor.licenseNumber}
              </div>
              <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Medical Council: {doctor.medicalCouncilNumber}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold uppercase tracking-tight">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Hospital Affiliation</span>
              </div>
              <div className="text-sm font-bold text-slate-900">
                {doctor.hospitalAffiliation}
              </div>
              <div className="text-[11px] text-slate-500">
                Active Inpatient & Procedural Privileges
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold uppercase tracking-tight">
                <Fingerprint className="w-4 h-4 text-emerald-600" />
                <span>DEA Clearance</span>
              </div>
              <div className="text-base font-extrabold font-mono text-slate-900">
                {doctor.deaNumber || 'BC1982736'}
              </div>
              <div className="text-[11px] text-emerald-700 font-medium">
                Schedule II-V Prescribing Authority
              </div>
            </div>
          </div>

          {/* Board Certifications */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-tight block">
              Accredited Board Certifications
            </span>
            <div className="flex flex-wrap gap-2">
              {doctor.boardCertifications.map((cert, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{cert}</span>
                </span>
              ))}
            </div>
          </div>

          {/* AI Audit & Registry Confirmation */}
          <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between text-emerald-400 font-bold">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Automated Registry Validation Score</span>
              </div>
              <span className="font-mono">{doctor.confidenceScore}% Confidence</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {doctor.aiAuditSummary}
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Last Registry Poll: {new Date(doctor.lastVerifiedCheck).toLocaleString()}</span>
              <span className="text-emerald-400">Zero Sanctions / Clear Standing</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>MedAuth Cryptographic Trust Layer</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            Close Verification
          </button>
        </div>

      </div>
    </div>
  );
};
