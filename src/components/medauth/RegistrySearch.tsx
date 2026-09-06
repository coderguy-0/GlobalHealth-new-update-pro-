import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  FileCheck,
  Lock,
  ExternalLink,
  Award,
  Hash
} from 'lucide-react';
import { DoctorProfile } from '../../types/medauth';

interface RegistrySearchProps {
  doctors: DoctorProfile[];
}

export const RegistrySearch: React.FC<RegistrySearchProps> = ({ doctors }) => {
  const [query, setQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);

  const filtered = doctors.filter((doc) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      doc.fullName.toLowerCase().includes(q) ||
      doc.npiNumber.includes(q) ||
      doc.licenseNumber.toLowerCase().includes(q) ||
      doc.verificationBadgeId.toLowerCase().includes(q) ||
      doc.speciality.toLowerCase().includes(q) ||
      doc.hospitalAffiliation.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Search className="w-4 h-4" />
            <span>Public Credential Verification Ledger</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            State Medical Board & NPI Registry Lookup
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Verify active board certifications, malpractice clearance, state licensing, and cryptographic HMAC signatures for any registered physician.
          </p>
        </div>

        <div className="relative max-w-2xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by 10-digit NPI, Practitioner Name, License #, or Badge ID..."
            className="w-full pl-12 pr-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-2xs"
          />
        </div>
      </div>

      {/* Grid of Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-emerald-500 hover:shadow-xs transition space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-base">
                    {doc?.fullName ? (doc.fullName.replace('Dr. ', '').charAt(0) || 'D') : 'D'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{doc.fullName}</h3>
                    <p className="text-xs font-semibold text-emerald-700">{doc.post}</p>
                  </div>
                </div>

                <span className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{doc.status}</span>
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-2 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{doc.hospitalAffiliation}</span>
              </p>

              <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono">
                <div>
                  <span className="text-slate-400 block text-[9px]">10-DIGIT NPI</span>
                  <span className="font-bold text-slate-900">{doc.npiNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">STATE LICENSE</span>
                  <span className="font-bold text-slate-900">{doc.licenseNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">BOARD COUNCIL ID</span>
                  <span className="font-bold text-slate-900">{doc.medicalCouncilNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">CLINICAL TENURE</span>
                  <span className="font-bold text-slate-900">{doc.yearsOfPractice} Years</span>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-600 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-200/60">
                <strong className="text-emerald-900 block text-[10px] uppercase font-bold">Audit Summary:</strong>
                <p className="mt-0.5 text-[11px]">{doc.aiAuditSummary}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-[10px] font-mono text-slate-500">
              <span className="truncate">Badge: {doc.verificationBadgeId}</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>99% CONFIDENCE</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
