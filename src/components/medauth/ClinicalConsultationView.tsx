import React, { useState } from 'react';
import {
  Stethoscope,
  Video,
  Mic,
  MicOff,
  Sparkles,
  FileText,
  Pill,
  CheckCircle2,
  AlertTriangle,
  Send,
  Save,
  Clock,
  Heart,
  Activity,
  Layers,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { PatientRecord, DoctorProfile, ClinicalTimelineEvent } from '../../types/medauth';

interface ClinicalConsultationViewProps {
  patient: PatientRecord;
  doctor: DoctorProfile;
  onSaveNote: (event: ClinicalTimelineEvent) => void;
  onOpenPrescriptionBuilder?: () => void;
}

export const ClinicalConsultationView: React.FC<ClinicalConsultationViewProps> = ({
  patient,
  doctor,
  onSaveNote,
  onOpenPrescriptionBuilder
}) => {
  const [consultType, setConsultType] = useState<'In-Person' | 'Telehealth'>('In-Person');
  const [isRecording, setIsRecording] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);

  // SOAP Note Form State
  const [subjective, setSubjective] = useState(
    'Patient presents for routine cardiovascular evaluation. Reports good exercise tolerance without exertional angina or dyspnea on ordinary activities. Denies orthopnea or paroxysmal nocturnal dyspnea.'
  );
  const [objective, setObjective] = useState(
    `Vitals: BP ${patient.recentVitals.bp}, HR ${patient.recentVitals.hr} bpm, SpO2 ${patient.recentVitals.spo2}%, Temp ${patient.recentVitals.temp}°F. Cardiopulmonary: Regular rate and rhythm, normal S1 and S2, no S3/S4 or murmurs. Lungs clear to auscultation bilaterally.`
  );
  const [assessment, setAssessment] = useState(
    `${patient.chronicConditions.join(', ')}. Clinical trajectory is stable and well-controlled on current guideline-directed medical therapy.`
  );
  const [plan, setPlan] = useState(
    '1. Continue current pharmaceutical regimen.\n2. Maintain low-sodium DASH dietary protocol and 150 min/wk moderate aerobic exercise.\n3. Routine follow-up scheduled in 8-12 weeks.'
  );

  const handleToggleVoiceDictation = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate real-time audio transcription append
      setTimeout(() => {
        setSubjective((prev) => prev + ' [Audio Dictated: Patient also confirmed no palpitations or dizzy spells during morning walks.]');
        setIsRecording(false);
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  const handleCommitEncounter = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: ClinicalTimelineEvent = {
      id: `evt-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'Consultation',
      title: `${consultType} Clinical Encounter - ${doctor.speciality}`,
      clinician: doctor.fullName,
      facility: doctor.hospitalAffiliation,
      soapNotes: {
        subjective,
        objective,
        assessment,
        plan
      }
    };

    onSaveNote(newEvent);
    setSessionSaved(true);
    setTimeout(() => setSessionSaved(false), 4000);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-1">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Active Clinical Encounter Workspace</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Consultation & SOAP Encounter Builder
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Patient: <strong className="text-slate-900">{patient.name}</strong> (MRN: {patient.mrn}) • Attending: <strong className="text-slate-900">{doctor.fullName}</strong>
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setConsultType('In-Person')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              consultType === 'In-Person'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Clinic Exam
          </button>
          <button
            onClick={() => setConsultType('Telehealth')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              consultType === 'Telehealth'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Telehealth Suite</span>
          </button>
        </div>
      </div>

      {/* Patient Biometric & Risk Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs font-mono">
          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[10px]">BLOOD PRESSURE</span>
            <span className="text-emerald-400 font-bold text-sm">{patient.recentVitals.bp}</span>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[10px]">HEART RATE</span>
            <span className="text-white font-bold text-sm">{patient.recentVitals.hr} bpm</span>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[10px]">OXYGEN (SpO2)</span>
            <span className="text-emerald-400 font-bold text-sm">{patient.recentVitals.spo2}%</span>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[10px]">TEMPERATURE</span>
            <span className="text-white font-bold text-sm">{patient.recentVitals.temp}°F</span>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[10px]">BMI</span>
            <span className="text-white font-bold text-sm">{patient.recentVitals.bmi} kg/m²</span>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[10px]">BLOOD GROUP</span>
            <span className="text-rose-400 font-bold text-sm">{patient.bloodGroup}</span>
          </div>
        </div>

        {/* Allergy Warning if any */}
        {patient.allergies && patient.allergies.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-amber-300 font-semibold">Documented Severe Allergies:</span>
            <div className="flex flex-wrap gap-1">
              {patient.allergies.map((a, i) => (
                <span key={i} className="bg-amber-950/80 border border-amber-600/60 text-amber-200 px-2 py-0.5 rounded text-[11px] font-mono">
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main SOAP Builder Form */}
      <form onSubmit={handleCommitEncounter} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Standardized Clinical SOAP Documentation Matrix
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleVoiceDictation}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {isRecording ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
              <span>{isRecording ? 'Transcribing...' : 'Voice Dictation'}</span>
            </button>

            {onOpenPrescriptionBuilder && (
              <button
                type="button"
                onClick={onOpenPrescriptionBuilder}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition cursor-pointer"
              >
                <Pill className="w-3.5 h-3.5" />
                <span>e-Prescribe</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 SOAP Quadrants */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Subjective */}
          <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>[S] Subjective — Chief Complaint & HPI</span>
              <span className="text-[10px] text-slate-400 lowercase font-normal">patient narrative</span>
            </label>
            <textarea
              rows={4}
              value={subjective}
              onChange={(e) => setSubjective(e.target.value)}
              className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600 leading-relaxed"
            />
          </div>

          {/* Objective */}
          <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>[O] Objective — Physical Exam & Biometrics</span>
              <span className="text-[10px] text-slate-400 lowercase font-normal">measured telemetry</span>
            </label>
            <textarea
              rows={4}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600 leading-relaxed font-mono"
            />
          </div>

          {/* Assessment */}
          <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>[A] Assessment — Diagnosis & Clinical Status</span>
              <span className="text-[10px] text-slate-400 lowercase font-normal">ICD-10 clinical impression</span>
            </label>
            <textarea
              rows={4}
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600 leading-relaxed"
            />
          </div>

          {/* Plan */}
          <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>[P] Plan — Rx, Orders & Next Encounters</span>
              <span className="text-[10px] text-slate-400 lowercase font-normal">guidelines & follow-up</span>
            </label>
            <textarea
              rows={4}
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600 leading-relaxed font-mono"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Digital Sign Stamp: {doctor.fullName} (NPI: {doctor.npiNumber})</span>
          </div>

          <div className="flex items-center gap-2">
            {sessionSaved && (
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Encounter Note Signed & Synced to EHR</span>
              </span>
            )}
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Sign & Commit Clinical Encounter</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
