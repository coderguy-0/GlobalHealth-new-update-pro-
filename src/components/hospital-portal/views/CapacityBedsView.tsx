import React, { useState } from 'react';
import {
  BedDouble,
  Activity,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Wind,
  ShieldCheck,
  AlertTriangle,
  FileText,
  ArrowRightLeft,
  UserCheck,
  Printer,
  Download,
  X,
  Sparkles
} from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';
import { PortalBed } from '../../../types/hospitalPortal';

export const CapacityBedsView: React.FC = () => {
  const { beds, openModal, updateBedStatus, deleteBed, wings } = useHospitalPortal();
  const [searchQuery, setSearchQuery] = useState('');
  const [wardFilter, setWardFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Interactive ADT Modal States
  const [selectedBedForAdmission, setSelectedBedForAdmission] = useState<PortalBed | null>(null);
  const [patientNameInput, setPatientNameInput] = useState('');
  const [patientMrnInput, setPatientMrnInput] = useState('');
  const [attendingDoctorInput, setAttendingDoctorInput] = useState('Dr. Marcus Brody');
  const [selectedBedForDischarge, setSelectedBedForDischarge] = useState<PortalBed | null>(null);
  const [dischargeSummaryGenerated, setDischargeSummaryGenerated] = useState(false);

  const filteredBeds = beds.filter((b) => {
    const matchesSearch =
      b.bedNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.wingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.assignedPatientName && b.assignedPatientName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesWard = wardFilter === 'ALL' || b.wardType === wardFilter;
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesWard && matchesStatus;
  });

  const totalOccupied = beds.filter((b) => b.status === 'Occupied').length;
  const totalAvailable = beds.filter((b) => b.status === 'Available').length;
  const totalSanitizing = beds.filter((b) => b.status === 'Sanitization in Progress').length;
  const totalVentilatorBeds = beds.filter((b) => b.ventilatorAttached).length;

  const handleConfirmAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBedForAdmission || !patientNameInput) return;
    updateBedStatus(
      selectedBedForAdmission.id,
      'Occupied',
      patientNameInput,
      patientMrnInput || `MRN-${Math.floor(10000 + Math.random() * 90000)}`,
      attendingDoctorInput
    );
    setSelectedBedForAdmission(null);
    setPatientNameInput('');
    setPatientMrnInput('');
  };

  const handleDischargePatient = (bed: PortalBed) => {
    setSelectedBedForDischarge(bed);
    setDischargeSummaryGenerated(true);
  };

  const handleConfirmDischarge = () => {
    if (!selectedBedForDischarge) return;
    updateBedStatus(selectedBedForDischarge.id, 'Sanitization in Progress');
    setSelectedBedForDischarge(null);
    setDischargeSummaryGenerated(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Inpatient Bed Capacity & ICU Telemetry</h1>
            <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
              {beds.length} Monitored Beds
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Live Bed Occupancy, Mechanical Ventilator Allocations & Ward Sanitation Telemetry
          </p>
        </div>

        <button
          onClick={() => openModal('add_bed')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Commission Inpatient Bed</span>
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-600 font-bold block">Occupied Beds</span>
          <div className="text-xl font-bold text-slate-900 font-mono mt-1">{totalOccupied}</div>
          <span className="text-[10px] text-slate-500">
            {Math.round((totalOccupied / (beds.length || 1)) * 100)}% Facility Utilization
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-emerald-800 font-bold block">Available Ready Beds</span>
          <div className="text-xl font-bold text-emerald-800 font-mono mt-1">{totalAvailable}</div>
          <span className="text-[10px] text-emerald-700">Sanitized & Cleared for Admission</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-amber-800 font-bold block">Cleaning / Turnover</span>
          <div className="text-xl font-bold text-amber-800 font-mono mt-1">{totalSanitizing}</div>
          <span className="text-[10px] text-amber-700">Terminal Disinfection Active</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-teal-800 font-bold block">Ventilator Beds</span>
          <div className="text-xl font-bold text-teal-800 font-mono mt-1">{totalVentilatorBeds}</div>
          <span className="text-[10px] text-teal-700">Servo/Hamilton High Support</span>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by bed code, wing name, or admitted patient name..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-600 font-medium cursor-pointer"
          >
            <option value="ALL">All Ward Types</option>
            <option value="ICU">Intensive Care (ICU)</option>
            <option value="HDU / Step-Down">HDU / Step-Down</option>
            <option value="Post-Op Recovery">Post-Op Recovery</option>
            <option value="General Ward">General Ward</option>
            <option value="Deluxe Suite">Deluxe Suite</option>
            <option value="Isolation / Negative Pressure">Isolation Room</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-600 font-medium cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="Available">Available Ready</option>
            <option value="Occupied">Occupied</option>
            <option value="Cleaning / Sanitizing">Sanitizing</option>
            <option value="Maintenance / Blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Bed Matrix 2.5D Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBeds.map((bed) => {
          const isOccupied = bed.status === 'Occupied';
          const isAvailable = bed.status === 'Available';
          const isCleaning = bed.status === 'Sanitization in Progress';

          return (
            <div
              key={bed.id}
              className={`p-5 rounded-2xl bg-white border transition shadow-xs space-y-3 relative overflow-hidden ${
                isOccupied
                  ? 'border-slate-300'
                  : isAvailable
                  ? 'border-emerald-300 ring-1 ring-emerald-200'
                  : 'border-amber-300'
              }`}
            >
              {/* Top Row: Bed Identifier & Ward */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-base font-black text-slate-900">{bed.bedNumber}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {bed.wardType}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">{bed.wingName}</span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    isOccupied
                      ? 'bg-rose-100 text-rose-800'
                      : isAvailable
                      ? 'bg-emerald-100 text-emerald-800 font-black'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {bed.status}
                </span>
              </div>

              {/* Patient Demographics if Occupied */}
              {isOccupied ? (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>{bed.assignedPatientName}</span>
                    <span className="font-mono text-[10px] text-slate-500 font-semibold">{bed.assignedPatientId}</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Attending: <span className="font-medium text-slate-900">{bed.assignedDoctorName || 'Dr. Marcus Brody'}</span>
                  </div>
                  {bed.ventilatorAttached && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-teal-800 pt-1">
                      <Wind className="w-3.5 h-3.5 text-teal-600" />
                      <span>Servo Ventilator Synchronized (FiO2 40%)</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <span className="font-bold block">Bed Ready for Immediate Admission</span>
                  <p className="text-[11px] text-emerald-800">
                    Oxygen Line: 50 PSI • Monitored Telemetry Link Online
                  </p>
                </div>
              )}

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                {isAvailable && (
                  <button
                    onClick={() => setSelectedBedForAdmission(bed)}
                    className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs transition cursor-pointer"
                  >
                    Admit Patient to Bed
                  </button>
                )}

                {isOccupied && (
                  <div className="flex items-center gap-2 w-full">
                    <button
                      onClick={() => handleDischargePatient(bed)}
                      className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs transition cursor-pointer"
                    >
                      Discharge Summary
                    </button>
                    <button
                      onClick={() => updateBedStatus(bed.id, 'Sanitization in Progress')}
                      className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-lg text-xs border border-amber-200 cursor-pointer"
                      title="Send for Sanitization"
                    >
                      Turnover
                    </button>
                  </div>
                )}

                {isCleaning && (
                  <button
                    onClick={() => updateBedStatus(bed.id, 'Available')}
                    className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs transition cursor-pointer"
                  >
                    Mark Terminal Disinfection Complete (Ready)
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Admission Wizard Modal */}
      {selectedBedForAdmission && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-2xs flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmAdmission}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-w-md w-full space-y-4 animate-in fade-in"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Inpatient Admission (ADT)</h3>
                <p className="text-xs text-slate-500">
                  Assigning to {selectedBedForAdmission.bedNumber} ({selectedBedForAdmission.wingName})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBedForAdmission(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Patient Full Name</label>
              <input
                type="text"
                required
                value={patientNameInput}
                onChange={(e) => setPatientNameInput(e.target.value)}
                placeholder="e.g. David K. Miller"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Medical Record Number (MRN)</label>
              <input
                type="text"
                value={patientMrnInput}
                onChange={(e) => setPatientMrnInput(e.target.value)}
                placeholder="e.g. MRN-78401-09"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Attending Physician</label>
              <select
                value={attendingDoctorInput}
                onChange={(e) => setAttendingDoctorInput(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
              >
                <option value="Dr. Marcus Brody">Dr. Marcus Brody (Trauma & Critical Care)</option>
                <option value="Dr. Elena Rostova">Dr. Elena Rostova (Pulmonology & ICU)</option>
                <option value="Dr. Sophia Sterling">Dr. Sophia Sterling (Cardiology)</option>
                <option value="Dr. Arthur Pendelton">Dr. Arthur Pendelton (Internal Medicine)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedBedForAdmission(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Complete Admission
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Discharge Summary Modal */}
      {selectedBedForDischarge && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-w-lg w-full space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-slate-900">Hospital Discharge Summary & Clearance</h3>
              </div>
              <button
                onClick={() => setSelectedBedForDischarge(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="font-bold text-slate-900">{selectedBedForDischarge.assignedPatientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bed / Wing:</span>
                <span className="font-bold text-slate-900">{selectedBedForDischarge.bedNumber} ({selectedBedForDischarge.wingName})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Attending:</span>
                <span className="font-bold text-slate-900">{selectedBedForDischarge.assignedDoctorName || 'Dr. Marcus Brody'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Discharge Status:</span>
                <span className="font-bold text-emerald-800">Clinically Stable / Home Care</span>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-900 block">Post-Discharge Instructions:</span>
              <p>1. Complete prescribed oral antibiotic course as indicated.</p>
              <p>2. OPD follow-up appointment scheduled in 7 days.</p>
              <p>3. Immediate ER visit if fever &gt; 101°F or acute dyspnea occurs.</p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setSelectedBedForDischarge(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDischarge}
                className="flex-1 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Discharge & Send to Turnover</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
