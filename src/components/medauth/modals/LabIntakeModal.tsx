import React, { useState } from 'react';
import {
  X,
  FlaskConical,
  UploadCloud,
  FileText,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  AlertCircle,
  Plus,
  Trash2,
  Check,
  Building2,
  Lock
} from 'lucide-react';
import { LabReportItem, PatientRecord, BiomarkerResult } from '../../../types/medauth';

interface LabIntakeModalProps {
  patient: PatientRecord;
  allPatients: PatientRecord[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (report: LabReportItem) => void;
}

export const LabIntakeModal: React.FC<LabIntakeModalProps> = ({
  patient,
  allPatients,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState(patient.id);
  const [source, setSource] = useState('Global Diagnostics Hospital Core');
  const [reportType, setReportType] = useState('Fasting Lipid Panel: LDL');
  const [category, setCategory] = useState<'Hematology' | 'Metabolic' | 'Lipid' | 'Cardiology' | 'Urinalysis' | 'Endocrine' | 'Renal'>('Lipid');
  const [resultValue, setResultValue] = useState('124');
  const [unit, setUnit] = useState('mg/dL');
  const [referenceRange, setReferenceRange] = useState('< 100');
  const [status, setStatus] = useState<'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL'>('HIGH');
  const [collectionDate, setCollectionDate] = useState('2026-08-23');
  const [reportDate, setReportDate] = useState('2026-08-23');
  const [doctorNotes, setDoctorNotes] = useState('Fasting 12-hour lipid profile verified. Recommend dietary titration.');
  const [fileName, setFileName] = useState('Lipid_Panel_20260823.pdf');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  if (!isOpen) return null;

  const currentSelectedPatient = allPatients.find((p) => p.id === selectedPatientId) || patient;

  // Preset templates for swift entry
  const handleTemplateSelect = (template: string) => {
    setReportType(template);
    if (template.includes('CBC')) {
      setCategory('Hematology');
      setResultValue('14.8');
      setUnit('g/dL');
      setReferenceRange('13.5 - 17.5');
      setStatus('NORMAL');
      setDoctorNotes('Normocytic, normochromic RBC indices within physiological limits.');
    } else if (template.includes('Lipid')) {
      setCategory('Lipid');
      setResultValue('124');
      setUnit('mg/dL');
      setReferenceRange('< 100');
      setStatus('HIGH');
      setDoctorNotes('Borderline elevated LDL. Dietary counseling initiated.');
    } else if (template.includes('Metabolic') || template.includes('Creatinine')) {
      setCategory('Metabolic');
      setResultValue('0.9');
      setUnit('mg/dL');
      setReferenceRange('0.7 - 1.3');
      setStatus('NORMAL');
      setDoctorNotes('eGFR > 90 mL/min/1.73m2. Intact renal clearance.');
    } else if (template.includes('Troponin') || template.includes('CRP')) {
      setCategory('Cardiology');
      setResultValue('1.2');
      setUnit('mg/L');
      setReferenceRange('< 3.0');
      setStatus('NORMAL');
      setDoctorNotes('Low systemic cardiovascular inflammatory risk.');
    } else if (template.includes('Urinalysis')) {
      setCategory('Urinalysis');
      setResultValue('Negative');
      setUnit('dipstick');
      setReferenceRange('Negative');
      setStatus('NORMAL');
      setDoctorNotes('Negative for nitrites, leukocyte esterase, and microalbumin.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const newReport: LabReportItem = {
        id: `lab-${Date.now()}`,
        testName: reportType,
        category,
        resultValue,
        unit,
        referenceRange,
        status,
        performedAt: `${collectionDate}T09:00:00Z`,
        reportedAt: `${reportDate}T10:30:00Z`,
        doctorNotes: doctorNotes || 'Diagnostic result logged and verified.',
        physicianNoteAuthor: 'Dr. Alexandra Chen, MD',
        physicianNoteTimestamp: new Date().toISOString(),
        reviewStatus: 'PENDING_REVIEW',
        performingLab: {
          name: source,
          cliaNumber: '05D9823194',
          accreditation: 'CAP & CLIA Accredited'
        },
        specimen: {
          type: category === 'Hematology' ? 'Venous Whole Blood (EDTA)' : category === 'Urinalysis' ? 'Clean Catch Urine' : 'Serum Separator Tube',
          collectedAt: `${collectionDate}T08:30:00Z`,
          fastingStatus: 'Fasting (12 hrs)'
        },
        sourceDocument: {
          filename: fileName,
          filesize: '420 KB',
          mimeType: 'application/pdf',
          verifiedHash: 'sha256:8b4e72...'
        }
      };

      onSubmit(newReport);
      setIsProcessing(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FlaskConical className="w-4 h-4" />
            <span>Pathology Diagnostic Intake Pipeline</span>
          </div>

          <h2 className="text-xl font-black tracking-tight text-white">
            Upload &amp; Log Laboratory Report
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Automated range checking, LOINC mapping, and practitioner review queue assignment.
          </p>
        </div>

        {/* Pipeline Step Tracker */}
        <div className="bg-slate-100 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-600">
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>1. Intake &amp; Match</span>
          </span>
          <span>→</span>
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>2. Range Verification</span>
          </span>
          <span>→</span>
          <span className="text-slate-500 flex items-center gap-1">
            <ClockIcon className="w-3.5 h-3.5" />
            <span>3. Review Queue</span>
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          
          {/* Patient Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">Matched Patient (EHR)</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 font-semibold"
              >
                {allPatients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.mrn}) — Age {p.age}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">Laboratory Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
              >
                <option value="Global Diagnostics Hospital Core">Global Diagnostics Hospital Core</option>
                <option value="Quest Diagnostics Partner Lab">Quest Diagnostics Partner Lab</option>
                <option value="LabCorp Clinical Diagnostic Lab">LabCorp Clinical Diagnostic Lab</option>
                <option value="Point-of-Care Clinic Analyzer">Point-of-Care Clinic Analyzer</option>
              </select>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight block">
              Quick Diagnostic Presets
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                'Complete Blood Count (CBC)',
                'Fasting Lipid Panel: LDL',
                'Comprehensive Metabolic (CMP)',
                'High-Sensitivity CRP',
                'Urinalysis Screen'
              ].map((tmpl) => (
                <button
                  key={tmpl}
                  type="button"
                  onClick={() => handleTemplateSelect(tmpl)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    reportType === tmpl
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {tmpl}
                </button>
              ))}
            </div>
          </div>

          {/* Report Details Form */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-800 block">Test / Diagnostic Name</label>
              <input
                type="text"
                required
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
              >
                <option value="Metabolic">Metabolic (CMP)</option>
                <option value="Lipid">Lipid Profile</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Hematology">Hematology (CBC)</option>
                <option value="Urinalysis">Urinalysis</option>
                <option value="Endocrine">Endocrine</option>
                <option value="Renal">Renal / Kidney</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">Measured Result</label>
              <input
                type="text"
                required
                value={resultValue}
                onChange={(e) => setResultValue(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">Unit</label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">Reference Interval</label>
              <input
                type="text"
                required
                value={referenceRange}
                onChange={(e) => setReferenceRange(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">Status Flag</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className={`w-full px-3 py-2 text-xs border rounded-xl font-bold focus:outline-none ${
                  status === 'NORMAL'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : status === 'CRITICAL'
                    ? 'bg-rose-50 border-rose-300 text-rose-800'
                    : 'bg-amber-50 border-amber-300 text-amber-800'
                }`}
              >
                <option value="NORMAL">NORMAL (Within Reference)</option>
                <option value="HIGH">HIGH (Above Reference)</option>
                <option value="LOW">LOW (Below Reference)</option>
                <option value="CRITICAL">CRITICAL (Requires Urgent Action)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">Collection Date</label>
              <input
                type="date"
                value={collectionDate}
                onChange={(e) => setCollectionDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">Report Date</label>
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 font-mono"
              />
            </div>
          </div>

          {/* Physician Clinical Interpretation */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800 block">Attending Physician Clinical Notes</label>
            <textarea
              rows={2}
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              placeholder="Clinical impression and plan for this laboratory finding..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Document Upload Simulation */}
          <div className="p-3.5 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">{fileName}</span>
                <span className="text-[11px] text-slate-500">PDF Document • 420 KB • Direct LIS Parsed</span>
              </div>
            </div>

            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Attached ✓
            </span>
          </div>

          {/* Footer Controls */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isProcessing}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isProcessing ? 'Validating & Logging...' : 'Commit & Add to Review Queue'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}
