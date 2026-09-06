import React, { useState } from 'react';
import {
  Share2,
  Building,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  FileCheck,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { PatientRecord, DoctorProfile, ReferralRequest } from '../../types/medauth';

interface ReferralManagerProps {
  patient: PatientRecord;
  doctor: DoctorProfile;
}

export const ReferralManager: React.FC<ReferralManagerProps> = ({
  patient,
  doctor
}) => {
  const [referrals, setReferrals] = useState<ReferralRequest[]>([
    {
      id: 'ref-101',
      patientId: patient.id,
      patientName: patient.name,
      referringDoctorId: doctor.id,
      referringDoctorName: doctor.fullName,
      targetSpeciality: 'Interventional Cardiology',
      targetFacility: 'Johns Hopkins Cardiac Catheterization Suite',
      urgency: 'PRIORITY',
      reasonForReferral: 'Coronary Angiography and Ischemic Evaluation',
      clinicalSummary: '58yo female with stable CAD presenting with exertion-induced dyspnea. Exercise stress test shows mild anterolateral ST depressions.',
      attachedDiagnostics: ['CBC & CMP (08/10)', 'Echocardiogram 2D (04/12)', 'Resting 12-Lead ECG'],
      createdAt: '2026-08-18T10:00:00Z',
      status: 'DISPATCHED'
    }
  ]);

  // Form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [targetSpeciality, setTargetSpeciality] = useState('Cardiothoracic Surgery');
  const [targetFacility, setTargetFacility] = useState('Memorial Sloan Kettering / Regional Center');
  const [urgency, setUrgency] = useState<'ROUTINE' | 'PRIORITY' | 'EMERGENCY'>('ROUTINE');
  const [reasonForReferral, setReasonForReferral] = useState('');
  const [clinicalSummary, setClinicalSummary] = useState('');

  const handleDispatchReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonForReferral.trim()) return;

    const newRef: ReferralRequest = {
      id: `ref-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      referringDoctorId: doctor.id,
      referringDoctorName: doctor.fullName,
      targetSpeciality,
      targetFacility: targetFacility || 'Affiliated Specialist Medical Network',
      urgency,
      reasonForReferral,
      clinicalSummary: clinicalSummary || `Clinical referral from ${doctor.fullName} for comprehensive specialist management.`,
      attachedDiagnostics: ['Longitudinal EHR Records', 'Recent Vitals Telemetry', 'Active Lab Reports'],
      createdAt: new Date().toISOString(),
      status: 'DISPATCHED'
    };

    setReferrals([newRef, ...referrals]);
    setReasonForReferral('');
    setClinicalSummary('');
    setShowCreateForm(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Share2 className="w-4 h-4" />
            <span>Specialist Care Network</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Clinical Referral & Inter-Network Gateway
          </h2>
          <p className="text-xs text-slate-600">
            Dispatch peer-to-peer specialist consultations for <strong className="text-slate-900">{patient.name}</strong> ({patient.mrn})
          </p>
        </div>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Dispatch New Referral</span>
        </button>
      </div>

      {/* Referral Creation Form */}
      {showCreateForm && (
        <form onSubmit={handleDispatchReferral} className="bg-white rounded-2xl border-2 border-emerald-500/40 p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Initiate Inter-Facility Specialist Referral</h3>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">Target Subspecialty</label>
              <select
                value={targetSpeciality}
                onChange={(e) => setTargetSpeciality(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
              >
                <option value="Cardiothoracic Surgery">Cardiothoracic Surgery</option>
                <option value="Interventional Cardiology">Interventional Cardiology</option>
                <option value="Nephrology & Renal Dialysis">Nephrology & Renal Dialysis</option>
                <option value="Medical Oncology & Infusion">Medical Oncology & Infusion</option>
                <option value="Orthopedic Spine & Trauma">Orthopedic Spine & Trauma</option>
                <option value="Neurology & Stroke Unit">Neurology & Stroke Unit</option>
                <option value="Pulmonology & Critical Care">Pulmonology & Critical Care</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">Target Medical Center / Facility</label>
              <input
                type="text"
                value={targetFacility}
                onChange={(e) => setTargetFacility(e.target.value)}
                placeholder="e.g., Johns Hopkins Hospital"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">Clinical Urgency Tier</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600 font-bold"
              >
                <option value="ROUTINE">ROUTINE (Within 14 Days)</option>
                <option value="PRIORITY">PRIORITY (Within 48-72 Hours)</option>
                <option value="EMERGENCY">EMERGENCY (Immediate Transfer)</option>
              </select>
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="text-xs font-bold text-slate-800 block">Primary Reason for Referral</label>
              <input
                type="text"
                required
                value={reasonForReferral}
                onChange={(e) => setReasonForReferral(e.target.value)}
                placeholder="e.g., Robotic Coronary Artery Bypass Grafting (CABG) surgical evaluation"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="text-xs font-bold text-slate-800 block">Clinical Summary & Consultation Questions</label>
              <textarea
                rows={3}
                value={clinicalSummary}
                onChange={(e) => setClinicalSummary(e.target.value)}
                placeholder="Provide medical context, symptoms, prior interventions..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Sign & Dispatch Referral Packet</span>
            </button>
          </div>
        </form>
      )}

      {/* Referrals Dispatch Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Active Referral Dispatch Queue ({referrals.length})
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Referring: {doctor.fullName} (NPI {doctor.npiNumber})
          </span>
        </div>

        <div className="space-y-4">
          {referrals.map((ref) => (
            <div
              key={ref.id}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full ${
                      ref.urgency === 'EMERGENCY'
                        ? 'bg-rose-600 text-white'
                        : ref.urgency === 'PRIORITY'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {ref.urgency}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{ref.reasonForReferral}</h4>
                </div>

                <span className="text-[10px] font-mono text-slate-500">
                  Ref ID: <strong>{ref.id}</strong> • {new Date(ref.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-3.5 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Subspecialty</span>
                  <span className="font-bold text-slate-800">{ref.targetSpeciality}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Health Facility</span>
                  <span className="font-bold text-slate-800">{ref.targetFacility}</span>
                </div>
                <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Clinical Background</span>
                  <p className="text-slate-600 mt-0.5">{ref.clinicalSummary}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-semibold">Attached Records:</span>
                  <div className="flex flex-wrap gap-1">
                    {ref.attachedDiagnostics.map((diag, i) => (
                      <span key={i} className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                        {diag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{ref.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
