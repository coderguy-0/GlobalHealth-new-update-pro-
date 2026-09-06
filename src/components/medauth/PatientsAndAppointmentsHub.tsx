import React, { useState } from 'react';
import {
  Clock,
  Users,
  Calendar,
  Layers,
  Video,
  Building,
  ArrowRight,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  ChevronRight,
  Plus,
  Eye,
  Activity,
  FileText
} from 'lucide-react';
import { PatientRecord, AppointmentItem, DoctorProfile } from '../../types/medauth';

interface PatientsAndAppointmentsHubProps {
  doctor: DoctorProfile;
  patients: PatientRecord[];
  appointments: AppointmentItem[];
  onSelectPatient: (patient: PatientRecord) => void;
  onStartConsult: (patient: PatientRecord, appointment?: AppointmentItem) => void;
  onViewEhr: (patient: PatientRecord) => void;
}

export const PatientsAndAppointmentsHub: React.FC<PatientsAndAppointmentsHubProps> = ({
  doctor,
  patients,
  appointments,
  onSelectPatient,
  onStartConsult,
  onViewEhr
}) => {
  // View mode switcher: 'unified' | 'appointments' | 'patients'
  const [viewMode, setViewMode] = useState<'unified' | 'appointments' | 'patients'>('unified');

  // Filter states
  const [appointmentFilter, setAppointmentFilter] = useState<'Today' | 'All' | 'In-Person' | 'Telemedicine'>('Today');
  const [patientFilter, setPatientFilter] = useState<'All' | 'Active' | 'High-Priority' | 'Follow-up'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered appointments
  const filteredAppointments = appointments.filter((apt) => {
    if (appointmentFilter === 'In-Person' && apt.type !== 'Clinic (In-Person)') return false;
    if (appointmentFilter === 'Telemedicine' && apt.type !== 'Video Call (Telemedicine)') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        apt.patientName.toLowerCase().includes(q) ||
        apt.mrn.toLowerCase().includes(q) ||
        apt.reason.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered patients
  const filteredPatients = patients.filter((pt) => {
    if (patientFilter === 'High-Priority') {
      const isHighPriority = pt.chronicConditions.some((c) =>
        c.toLowerCase().includes('post-coronary') || c.toLowerCase().includes('stent')
      );
      if (!isHighPriority) return false;
    }
    if (patientFilter === 'Follow-up') {
      const isFollowUp = pt.chronicConditions.some((c) =>
        c.toLowerCase().includes('hypertension')
      );
      if (!isFollowUp) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        pt.name.toLowerCase().includes(q) ||
        pt.mrn.toLowerCase().includes(q) ||
        pt.chronicConditions.some((c) => c.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Patients & Appointments Hub Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Unified Clinical Workspace</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Patients & Appointments Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Manage patient records, medical histories, and scheduled consultations in one unified location.
          </p>
        </div>

        {/* View Mode Switcher Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 self-start lg:self-auto">
          <button
            onClick={() => setViewMode('unified')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              viewMode === 'unified'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Unified Side-by-Side</span>
          </button>

          <button
            onClick={() => setViewMode('appointments')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              viewMode === 'appointments'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Appointments ({appointments.length})</span>
          </button>

          <button
            onClick={() => setViewMode('patients')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              viewMode === 'patients'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Patients Directory ({patients.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      {viewMode === 'unified' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: Appointments Schedule */}
          {/* ========================================================= */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Appointments Schedule
                  </h3>
                </div>

                <button
                  onClick={() => setViewMode('appointments')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Full Schedule</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 py-3 overflow-x-auto">
                {(['Today', 'All', 'In-Person', 'Telemedicine'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setAppointmentFilter(filter)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      appointmentFilter === filter
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Appointments List */}
              <div className="space-y-3 pt-1">
                {filteredAppointments.map((apt) => {
                  const targetPatient = patients.find((p) => p.id === apt.patientId) || patients[0];
                  const isTelehealth = apt.type.includes('Telemedicine');
                  return (
                    <div
                      key={apt.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:shadow-2xs transition space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3">
                          <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono shrink-0">
                            {apt.time}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900">
                                {apt.patientName}
                              </h4>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {apt.reason}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                            apt.status === 'Waiting'
                              ? 'bg-slate-100 text-slate-700 border border-slate-300'
                              : apt.status === 'In-Progress'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          {isTelehealth ? (
                            <Video className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Building className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span className="text-[11px] font-medium">{apt.type}</span>
                        </div>

                        <button
                          onClick={() => onStartConsult(targetPatient, apt)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-2xs cursor-pointer"
                        >
                          <span>Start Consult</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Registered Patients Database */}
          {/* ========================================================= */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Registered Patients Database
                  </h3>
                </div>

                <button
                  onClick={() => setViewMode('patients')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>All Records</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 py-3 overflow-x-auto">
                {(['All', 'Active', 'High-Priority', 'Follow-up'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setPatientFilter(filter)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      patientFilter === filter
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Patients List */}
              <div className="space-y-3 pt-1">
                {filteredPatients.map((pt) => {
                  const isHighPriority = pt.chronicConditions.some((c) =>
                    c.toLowerCase().includes('post-coronary') || c.toLowerCase().includes('stent')
                  );
                  const isFollowUp = pt.chronicConditions.some((c) =>
                    c.toLowerCase().includes('hypertension')
                  );
                  const priorityTag = isHighPriority
                    ? 'High-Priority'
                    : isFollowUp
                    ? 'Follow-up'
                    : 'Active';

                  return (
                    <div
                      key={pt.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:shadow-2xs transition space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-slate-900">{pt.name}</h4>
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-semibold">
                              {pt.mrn}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">
                            {pt.chronicConditions[0] || 'General Cardiology Review'} • {pt.age} Yrs ({pt.gender})
                          </p>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                            priorityTag === 'High-Priority'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : priorityTag === 'Follow-up'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {priorityTag}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <button
                          onClick={() => onViewEhr(pt)}
                          className="text-emerald-700 hover:text-emerald-800 font-bold underline cursor-pointer text-xs flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View EHR Profile</span>
                        </button>

                        <button
                          onClick={() => onStartConsult(pt)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-2xs cursor-pointer"
                        >
                          <span>Start Consult</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode: Appointments Only Full View */}
      {viewMode === 'appointments' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Scheduled Consultations & Patient Queue ({appointments.length})
              </h3>
              <p className="text-xs text-slate-500">
                Today's clinical schedule and upcoming appointments for {doctor.fullName}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {(['Today', 'All', 'In-Person', 'Telemedicine'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setAppointmentFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    appointmentFilter === filter
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="pb-3 px-3">Time</th>
                  <th className="pb-3 px-3">Patient</th>
                  <th className="pb-3 px-3">MRN</th>
                  <th className="pb-3 px-3">Type</th>
                  <th className="pb-3 px-3">Clinical Reason</th>
                  <th className="pb-3 px-3">Vitals Status</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredAppointments.map((apt) => {
                  const targetPatient = patients.find((p) => p.id === apt.patientId) || patients[0];
                  return (
                    <tr key={apt.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-3 font-bold text-emerald-800">{apt.time}</td>
                      <td className="py-3.5 px-3 font-sans font-bold text-slate-900">{apt.patientName}</td>
                      <td className="py-3.5 px-3 text-slate-500">{apt.mrn}</td>
                      <td className="py-3.5 px-3 font-sans">
                        <span className="text-[11px] font-semibold text-slate-700">{apt.type}</span>
                      </td>
                      <td className="py-3.5 px-3 font-sans text-slate-600 max-w-xs truncate">{apt.reason}</td>
                      <td className="py-3.5 px-3 text-slate-700 text-[11px]">{apt.vitalsSummary || '128/82 mmHg'}</td>
                      <td className="py-3.5 px-3 font-sans">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            apt.status === 'Waiting'
                              ? 'bg-slate-100 text-slate-700'
                              : apt.status === 'In-Progress'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-sans">
                        <button
                          onClick={() => onStartConsult(targetPatient, apt)}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                        >
                          Start Consult
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mode: Patients Only Full Directory View */}
      {viewMode === 'patients' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Registered Patients Directory ({patients.length})
              </h3>
              <p className="text-xs text-slate-500">
                Complete longitudinal records, diagnoses, and allergies
              </p>
            </div>

            <div className="flex items-center gap-2">
              {(['All', 'Active', 'High-Priority', 'Follow-up'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setPatientFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    patientFilter === filter
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPatients.map((pt) => (
              <div
                key={pt.id}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{pt.name}</h4>
                      <p className="text-xs text-slate-500">
                        MRN: <strong className="font-mono text-slate-800">{pt.mrn}</strong> • {pt.age} Yrs • {pt.gender} • Blood Group: <strong className="text-rose-700">{pt.bloodGroup}</strong>
                      </p>
                    </div>

                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono px-2 py-0.5 rounded">
                      ACTIVE EHR
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[9px] block">Chronic Conditions</span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {pt.chronicConditions.map((c, i) => (
                          <span key={i} className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded text-[10px] font-medium">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1">
                      <span className="text-rose-500 font-bold uppercase text-[9px] block">Documented Allergies</span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {pt.allergies.map((a, i) => (
                          <span key={i} className="bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-bold">
                            ⚠️ {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
                  <button
                    onClick={() => onViewEhr(pt)}
                    className="text-emerald-700 hover:text-emerald-800 font-bold underline cursor-pointer"
                  >
                    View Comprehensive EHR
                  </button>

                  <button
                    onClick={() => onStartConsult(pt)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition cursor-pointer"
                  >
                    <span>Start Consult</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
