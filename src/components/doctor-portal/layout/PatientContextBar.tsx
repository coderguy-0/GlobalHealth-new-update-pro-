import React from 'react';
import { FolderHeart, Stethoscope, Activity, FlaskConical, ClipboardList, ArrowLeftRight, History, X, ShieldAlert, Video } from 'lucide-react';
import { WorkspaceView } from '../doctorPortalData';
import { useClinicalWorkspace, CONSENT_LABEL } from '../doctorClinicalData';

interface PatientContextBarProps {
  onNavigate: (v: WorkspaceView) => void;
}

const ACTIONS: { view: WorkspaceView; label: string; icon: React.ReactNode }[] = [
  { view: 'ehr', label: 'EHR', icon: <FolderHeart className="h-3.5 w-3.5" /> },
  { view: 'consultations', label: 'Consultation', icon: <Stethoscope className="h-3.5 w-3.5" /> },
  { view: 'vitals', label: 'Vitals', icon: <Activity className="h-3.5 w-3.5" /> },
  { view: 'labs', label: 'Labs', icon: <FlaskConical className="h-3.5 w-3.5" /> },
  { view: 'prescriptions', label: 'Prescription', icon: <ClipboardList className="h-3.5 w-3.5" /> },
  { view: 'referrals', label: 'Referral', icon: <ArrowLeftRight className="h-3.5 w-3.5" /> },
  { view: 'ehr', label: 'Timeline', icon: <History className="h-3.5 w-3.5" /> },
  { view: 'telemedicine', label: 'Call', icon: <Video className="h-3.5 w-3.5" /> },
];

export const PatientContextBar: React.FC<PatientContextBarProps> = ({ onNavigate }) => {
  const { patients, selectedPatientId, activeEncounterId, selectPatient } = useClinicalWorkspace();
  const patient = patients.find((p) => p.id === selectedPatientId);
  if (!patient) return null;

  const consentTone =
    patient.consentStatus === 'granted' ? 'bg-emerald-50 text-emerald-800 ring-emerald-200'
      : patient.consentStatus === 'pending' ? 'bg-amber-50 text-amber-800 ring-amber-200'
        : patient.consentStatus === 'denied' || patient.consentStatus === 'revoked' ? 'bg-rose-50 text-rose-800 ring-rose-200'
          : 'bg-slate-100 text-slate-600 ring-slate-200';

  return (
    <div className="sticky top-[57px] z-20 border-b border-emerald-100 bg-white/95 backdrop-blur-md">
      <div className="flex flex-wrap items-center gap-2 px-4 py-2 lg:px-6">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#0B1F3A] text-[10px] font-bold text-white">
          {patient.name.split(' ').map((x) => x[0]).slice(0, 2).join('')}
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-extrabold text-[#162235]">
            Patient: {patient.name}
            <span className="ml-2 font-semibold text-[#607086]">ID: {patient.identifier}</span>
            <span className="ml-2 font-semibold text-[#607086]">Age: {patient.age}</span>
            {activeEncounterId && <span className="ml-2 font-semibold text-emerald-700">Encounter: {activeEncounterId}</span>}
          </p>
          <p className="flex flex-wrap items-center gap-1.5 text-[10px] text-[#8A97A8]">
            {patient.sex} · {patient.bloodGroup}
            {patient.allergies.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-1.5 py-0.5 font-bold text-rose-700">
                <ShieldAlert className="h-3 w-3" /> {patient.allergies.join(', ')}
              </span>
            )}
            {patient.highRisk && <span className="rounded-full bg-rose-600 px-1.5 py-0.5 font-bold text-white">HIGH RISK</span>}
          </p>
        </div>
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${consentTone}`}>
          Consent: {CONSENT_LABEL[patient.consentStatus]}
        </span>
        <div className="ml-auto flex flex-wrap items-center gap-1">
          {ACTIONS.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={() => onNavigate(a.view)}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#E3E8EF] bg-white px-2 py-1 text-[10px] font-bold text-[#607086] transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
            >
              {a.icon} {a.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => selectPatient(null)}
            className="ml-1 cursor-pointer rounded-lg p-1 text-[#8A97A8] hover:bg-slate-100 hover:text-[#162235]"
            aria-label="Clear selected patient"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
