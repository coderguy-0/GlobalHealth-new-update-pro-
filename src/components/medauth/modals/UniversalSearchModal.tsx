import React, { useState, useMemo } from 'react';
import {
  Search,
  Users,
  FlaskConical,
  Calendar,
  Pill,
  X,
  ChevronRight,
  Sparkles,
  FileText,
  Activity
} from 'lucide-react';
import { PatientRecord, AppointmentItem, LabReportItem } from '../../../types/medauth';

interface UniversalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: PatientRecord[];
  appointments: AppointmentItem[];
  onSelectPatient: (patientId: string, targetTab?: 'ehr' | 'labs' | 'consult' | 'rx' | 'vitals') => void;
  onSelectLabReport?: (patientId: string, reportId: string) => void;
}

export const UniversalSearchModal: React.FC<UniversalSearchModalProps> = ({
  isOpen,
  onClose,
  patients,
  appointments,
  onSelectPatient,
  onSelectLabReport
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  // Search calculations
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { patients: [], labs: [], appointments: [], medications: [] };

    const matchedPatients = patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.mrn.toLowerCase().includes(q) ||
        p.primaryCondition?.toLowerCase().includes(q) ||
        p.chronicConditions.some((c) => c.toLowerCase().includes(q))
    );

    const matchedLabs: { patient: PatientRecord; report: LabReportItem }[] = [];
    patients.forEach((p) => {
      (p.labReports || []).forEach((r) => {
        if (
          r.testName.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.doctorNotes.toLowerCase().includes(q) ||
          (r.biomarkers || []).some((bm) => bm.name.toLowerCase().includes(q))
        ) {
          matchedLabs.push({ patient: p, report: r });
        }
      });
    });

    const matchedAppointments = appointments.filter(
      (a) =>
        a.patientName.toLowerCase().includes(q) ||
        a.mrn.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q) ||
        a.reason?.toLowerCase().includes(q)
    );

    const matchedMeds: { patient: PatientRecord; medication: string }[] = [];
    patients.forEach((p) => {
      (p.currentMedications || []).forEach((m) => {
        if (m.toLowerCase().includes(q)) {
          matchedMeds.push({ patient: p, medication: m });
        }
      });
    });

    return {
      patients: matchedPatients,
      labs: matchedLabs,
      appointments: matchedAppointments,
      medications: matchedMeds
    };
  }, [query, patients, appointments]);

  const hasResults =
    searchResults.patients.length > 0 ||
    searchResults.labs.length > 0 ||
    searchResults.appointments.length > 0 ||
    searchResults.medications.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search EHR, Patients, MRN, Labs (e.g. 'CBC', 'LDL', 'Rahul')..."
            className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold px-2"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-200 text-slate-600 hover:bg-slate-300 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
          
          {!query ? (
            <div className="py-8 text-center text-slate-400 text-xs space-y-2">
              <Sparkles className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-semibold text-slate-600">Universal Clinical Search</p>
              <p className="text-[11px] max-w-xs mx-auto">
                Type a patient name, MRN, lab test name (CBC, LDL, Creatinine), or medication to instantly jump to chart.
              </p>
            </div>
          ) : !hasResults ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              <p className="font-semibold text-slate-700">No clinical records found matching &ldquo;{query}&rdquo;</p>
              <p className="text-[11px] text-slate-400 mt-1">Try searching with a patient MRN, condition, or test panel name.</p>
            </div>
          ) : (
            <>
              {/* 1. Matched Patients */}
              {searchResults.patients.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5 px-2">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Patients ({searchResults.patients.length})</span>
                  </div>

                  <div className="space-y-1">
                    {searchResults.patients.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSelectPatient(p.id, 'ehr');
                          onClose();
                        }}
                        className="p-3 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition cursor-pointer flex items-center justify-between group"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-800">
                              {p.name}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              {p.mrn}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              Age {p.age} • {p.gender}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 truncate max-w-md">
                            {p.primaryCondition}
                          </p>
                        </div>

                        <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                          <span>Open EHR</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Matched Lab Reports */}
              {searchResults.labs.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5 px-2">
                    <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Laboratory Panels &amp; Biomarkers ({searchResults.labs.length})</span>
                  </div>

                  <div className="space-y-1">
                    {searchResults.labs.map(({ patient: p, report: r }) => (
                      <div
                        key={`${p.id}-${r.id}`}
                        onClick={() => {
                          if (onSelectLabReport) {
                            onSelectLabReport(p.id, r.id);
                          } else {
                            onSelectPatient(p.id, 'labs');
                          }
                          onClose();
                        }}
                        className="p-3 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition cursor-pointer flex items-center justify-between group"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {r.testName}
                            </span>
                            <span
                              className={`text-[9px] font-bold font-mono px-2 py-0.2 rounded-full ${
                                r.status === 'NORMAL'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {r.status}
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-900">
                              {r.resultValue} {r.unit}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Patient: <strong className="text-slate-800">{p.name}</strong> ({p.mrn}) • {new Date(r.performedAt).toLocaleDateString()}
                          </p>
                        </div>

                        <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                          <span>View Lab</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Matched Appointments */}
              {searchResults.appointments.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5 px-2">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Appointments ({searchResults.appointments.length})</span>
                  </div>

                  <div className="space-y-1">
                    {searchResults.appointments.map((a) => (
                      <div
                        key={a.id}
                        onClick={() => {
                          const matchedP = patients.find((p) => p.id === a.patientId);
                          if (matchedP) onSelectPatient(matchedP.id, 'consult');
                          onClose();
                        }}
                        className="p-3 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition cursor-pointer flex items-center justify-between group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {a.patientName}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              {a.date} at {a.time}
                            </span>
                            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                              {a.type}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            {a.reason}
                          </p>
                        </div>

                        <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                          <span>Consult</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Search scope: Active clinic directory</span>
          <span>Press ESC to exit</span>
        </div>

      </div>
    </div>
  );
};
