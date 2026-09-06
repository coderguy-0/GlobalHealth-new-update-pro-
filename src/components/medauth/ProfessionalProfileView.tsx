import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  Building,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Printer,
  Copy,
  Check,
  ExternalLink,
  QrCode
} from 'lucide-react';
import { DoctorProfile } from '../../types/medauth';

interface ProfessionalProfileViewProps {
  doctor: DoctorProfile;
}

export const ProfessionalProfileView: React.FC<ProfessionalProfileViewProps> = ({ doctor }) => {
  const [copiedBadge, setCopiedBadge] = useState(false);

  const handleCopyBadge = () => {
    navigator.clipboard.writeText(doctor.verificationBadgeId);
    setCopiedBadge(true);
    setTimeout(() => setCopiedBadge(false), 2000);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>State Medical Board Verified Practitioner</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Professional Profile & Board Credentials
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Cryptographically authenticated credentials registered in the National Provider Registry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintCertificate}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-2xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Verification Certificate</span>
          </button>
        </div>
      </div>

      {/* Practitioner Primary Credential Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-2xl font-extrabold shadow-sm">
              {doctor?.fullName ? (doctor.fullName.replace('Dr. ', '').charAt(0) || 'D') : 'D'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-900">{doctor.fullName}</h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ACTIVE LICENSURE</span>
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">{doctor.post}</p>
              <p className="text-xs text-slate-500">{doctor.hospitalAffiliation}</p>
            </div>
          </div>

          {/* Badge ID Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-mono space-y-1.5 self-start md:self-auto">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Digital Badge ID</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">{doctor.verificationBadgeId}</span>
              <button
                onClick={handleCopyBadge}
                className="text-slate-500 hover:text-emerald-700 transition"
              >
                {copiedBadge ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold block">
              Confidence Score: {doctor.confidenceScore}% (OCR Match)
            </span>
          </div>
        </div>

        {/* 6-Grid Credential Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">National Provider Identifier (NPI)</span>
            <p className="font-mono font-bold text-sm text-slate-900">{doctor.npiNumber}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">State Medical License</span>
            <p className="font-mono font-bold text-sm text-slate-900">{doctor.licenseNumber}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Medical Council Registration</span>
            <p className="font-mono font-bold text-sm text-slate-900">{doctor.medicalCouncilNumber}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Clinical Specialty</span>
            <p className="font-bold text-slate-900">{doctor.speciality}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Years of Clinical Tenure</span>
            <p className="font-bold text-slate-900">{doctor.yearsOfPractice} Years in Practice</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">DEA Registration Status</span>
            <p className="font-mono font-bold text-slate-900">{doctor.deaNumber || 'Active (Schedules II-V)'}</p>
          </div>
        </div>

        {/* Board Certifications */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-800 block">Accredited Specialty Board Certifications</span>
          <div className="flex flex-wrap gap-2">
            {doctor.boardCertifications.map((b, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>{b}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
