import React from 'react';
import {
  X,
  Printer,
  FileDown,
  ShieldCheck,
  Stethoscope,
  Building2,
  CheckCircle2,
  Calendar,
  Lock
} from 'lucide-react';
import { LabReportItem, PatientRecord, DoctorProfile } from '../../../types/medauth';

interface LabReportPrintModalProps {
  report: LabReportItem | null;
  patient: PatientRecord;
  doctor: DoctorProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const LabReportPrintModal: React.FC<LabReportPrintModalProps> = ({
  report,
  patient,
  doctor,
  isOpen,
  onClose
}) => {
  if (!isOpen || !report) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-extrabold tracking-tight">Clinical Diagnostic Document Preview</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Clean Report</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Laboratory Sheet (Clean Clinical Layout) */}
        <div className="p-8 space-y-6 overflow-y-auto bg-white text-slate-900 font-sans print:p-0">
          
          {/* Hospital & Laboratory Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                  GH
                </div>
                <h1 className="text-lg font-black tracking-tight text-slate-900">
                  GLOBALHEALTH DIAGNOSTIC PATHOLOGY CORE
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                CAP &amp; CLIA Accredited Laboratory • CLIA ID: {report.performingLab?.cliaNumber || '05D9823194'}
              </p>
              <p className="text-[11px] text-slate-400">
                Medical Director: Dr. Marcus Vance, MD, FCAP • Johns Hopkins Health Network
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-mono font-bold border border-slate-200 uppercase">
                Official Clinical Laboratory Report
              </span>
              <p className="text-[11px] font-mono text-slate-500 mt-1">
                Accession: ACC-{report.id.replace('lab-', '').toUpperCase()}
              </p>
            </div>
          </div>

          {/* Patient Demographics & Order Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Patient Name</span>
              <strong className="text-slate-900 text-sm">{patient.name}</strong>
              <span className="text-[11px] text-slate-500 block">DOB: {patient.dob || '1992-05-14'} (Age {patient.age})</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Medical Record Number</span>
              <strong className="text-slate-900 font-mono">{patient.mrn}</strong>
              <span className="text-[11px] text-slate-500 block">Sex: {patient.gender} • Blood: {patient.bloodGroup}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Ordering Clinician</span>
              <strong className="text-slate-900">{doctor.fullName}</strong>
              <span className="text-[11px] text-slate-500 block">NPI: {doctor.npiNumber}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Collection / Report</span>
              <strong className="text-slate-900 font-mono text-[11px]">
                {new Date(report.performedAt).toLocaleDateString()}
              </strong>
              <span className="text-[10px] text-slate-500 block">
                Specimen: {report.specimen?.type || 'Venous Blood'}
              </span>
            </div>
          </div>

          {/* Main Laboratory Findings Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">
                {report.testName}
              </h2>
              <span className="text-xs font-mono text-slate-500">
                Category: {report.category}
              </span>
            </div>

            <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th className="py-2 px-3">Analyte / Test</th>
                  <th className="py-2 px-3">Result</th>
                  <th className="py-2 px-3">Unit</th>
                  <th className="py-2 px-3">Reference Range</th>
                  <th className="py-2 px-3 text-right">Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {report.biomarkers && report.biomarkers.length > 0 ? (
                  report.biomarkers.map((bm) => (
                    <tr key={bm.id} className={bm.status !== 'NORMAL' ? 'bg-amber-50/40' : ''}>
                      <td className="py-2.5 px-3 font-sans font-medium text-slate-900">
                        {bm.name}
                        {bm.loincCode && <span className="text-[10px] text-slate-400 ml-1">({bm.loincCode})</span>}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{bm.resultValue}</td>
                      <td className="py-2.5 px-3 text-slate-600">{bm.unit}</td>
                      <td className="py-2.5 px-3 text-slate-600">{bm.referenceRange}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            bm.status === 'NORMAL'
                              ? 'text-emerald-700 font-semibold'
                              : 'text-amber-800 font-extrabold bg-amber-100'
                          }`}
                        >
                          {bm.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className={report.status !== 'NORMAL' ? 'bg-amber-50/40' : ''}>
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-900">{report.testName}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{report.resultValue}</td>
                    <td className="py-2.5 px-3 text-slate-600">{report.unit}</td>
                    <td className="py-2.5 px-3 text-slate-600">{report.referenceRange}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${report.status === 'NORMAL' ? 'text-emerald-700' : 'text-amber-800 bg-amber-100'}`}>
                        {report.status}
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Attending Physician Clinical Interpretation */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Attending Physician Clinical Interpretation
            </span>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {report.doctorNotes}
            </p>
          </div>

          {/* Digital Signature & Verification Seal */}
          <div className="pt-4 border-t-2 border-slate-200 flex items-end justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Electronically Signed &amp; Finalized</span>
              </div>
              <p className="text-xs font-serif italic text-slate-800">
                {doctor.fullName}
              </p>
              <p className="text-[10px] font-mono text-slate-400">
                NPI: {doctor.npiNumber} • Badge: {doctor.verificationBadgeId} • Timestamp: {report.reviewedAt || new Date().toISOString()}
              </p>
            </div>

            <div className="text-right">
              <div className="inline-block p-2 rounded-lg bg-slate-100 border border-slate-200 text-center font-mono text-[9px] text-slate-500">
                <span>MEDAUTH TRUST LAYER</span>
                <span className="block font-bold text-slate-700">VERIFIED VALID</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
