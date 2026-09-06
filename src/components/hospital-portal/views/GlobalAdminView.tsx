import React from 'react';
import {
  Globe,
  Building2,
  Plus,
  CheckCircle2,
  Siren,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';

export const GlobalAdminView: React.FC = () => {
  const { hospitals, currentHospitalId, setCurrentHospitalId, openModal } = useHospitalPortal();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCEBE4] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#17221E]">Multi-Tenant SuperAdmin Control Tower</h1>
            <span className="text-xs font-mono font-bold bg-[#E8F7F1] text-[#008F68] px-2 py-0.5 rounded border border-[#BDE4D5]">
              {hospitals.length} Tenant Hospitals
            </span>
          </div>
          <p className="text-xs text-[#52635C]">
            Enterprise Healthcare Group Governance, Multi-Hospital Provisioning & Cross-Facility Telemetry
          </p>
        </div>

        <button
          onClick={() => openModal('register_hospital')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#008F68] hover:bg-[#007A59] text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Provision New Hospital</span>
        </button>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.map((h) => {
          const isSelected = h.id === currentHospitalId;
          return (
            <div
              key={h.id}
              className={`p-6 rounded-2xl bg-white border shadow-xs space-y-4 transition flex flex-col justify-between ${
                isSelected
                  ? 'border-[#008F68] ring-2 ring-[#008F68]/20'
                  : 'border-[#DCEBE4] hover:border-[#008F68]/40'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold bg-[#F1FAF6] px-2 py-0.5 rounded border border-[#DCEBE4] text-[#52635C]">
                    {h.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      h.redAlertActive
                        ? 'bg-[#FFF1F1] text-[#C53939] border border-[#F2CCCC] animate-pulse'
                        : 'bg-[#E8F7F1] text-[#008F68] border border-[#BDE4D5]'
                    }`}
                  >
                    {h.redAlertActive ? 'CODE RED ACTIVE' : 'Normal Operations'}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#17221E]">{h.name}</h3>
                  <p className="text-xs font-semibold text-[#008F68]">{h.hospitalType}</p>
                  <p className="text-xs text-[#52635C] mt-1">{h.streetAddress}, {h.city}, {h.country}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-[#F6FBF8] border border-[#DCEBE4]">
                  <div>
                    <span className="text-[10px] text-[#52635C] block">Total Beds</span>
                    <strong className="text-[#17221E] font-mono">{h.totalBedsCount || 500}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#52635C] block">ICU Beds</span>
                    <strong className="text-[#17221E] font-mono">{h.icuBedsCount || 80}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#DCEBE4] flex items-center justify-between">
                <span className="text-[11px] text-[#52635C]">{h.ownership}</span>
                {isSelected ? (
                  <span className="text-xs font-bold text-[#008F68] flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Active Tenant</span>
                  </span>
                ) : (
                  <button
                    onClick={() => setCurrentHospitalId(h.id)}
                    className="flex items-center gap-1 text-xs font-bold text-[#008F68] hover:underline cursor-pointer"
                  >
                    <span>Switch Tenant</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
