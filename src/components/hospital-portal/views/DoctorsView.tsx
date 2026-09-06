import React, { useState } from 'react';
import {
  Stethoscope,
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  Trash2,
  Edit2
} from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';
import { PortalDoctor } from '../../../types/hospitalPortal';

export const DoctorsView: React.FC = () => {
  const { doctors, openModal, updateDoctor, deleteDoctor, departments } = useHospitalPortal();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.registrationNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || doc.departmentId === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCEBE4] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#17221E]">Specialist Doctors & Faculty</h1>
            <span className="text-xs font-mono font-bold bg-[#E8F7F1] text-[#008F68] px-2 py-0.5 rounded border border-[#BDE4D5]">
              {doctors.length} Registered
            </span>
          </div>
          <p className="text-xs text-[#52635C]">
            Medical Council Registrations, Consultation Tariffs & OPD Chamber Timetables
          </p>
        </div>

        <button
          onClick={() => openModal('add_doctor')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#008F68] hover:bg-[#007A59] text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Enroll New Specialist</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#52635C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search specialist by name, specialty, or medical council registration..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] placeholder-[#8A9993] focus:outline-none focus:border-[#008F68]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-[#52635C] shrink-0" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68] cursor-pointer"
          >
            <option value="ALL">All Clinical Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-4 hover:border-[#008F68]/40 transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Doctor Head */}
              <div className="flex items-start gap-3.5">
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  className="h-14 w-14 rounded-2xl object-cover border-2 border-[#008F68] shrink-0"
                />
                <div className="truncate">
                  <h3 className="text-sm font-bold text-[#17221E] truncate">{doc.name}</h3>
                  <p className="text-xs font-semibold text-[#008F68] truncate">{doc.specialty}</p>
                  <p className="text-[11px] text-[#52635C] truncate">{doc.qualifications}</p>
                  <div className="text-[10px] text-[#52635C] font-mono mt-0.5">
                    Reg: <span className="font-bold text-[#17221E]">{doc.registrationNo}</span>
                  </div>
                </div>
              </div>

              {/* Badges & Status Switcher */}
              <div className="flex items-center justify-between pt-2 border-t border-[#DCEBE4]">
                <span className="text-[11px] font-bold text-[#52635C]">{doc.roomNumber}</span>
                <select
                  value={doc.status}
                  onChange={(e) => updateDoctor(doc.id, { status: e.target.value as any })}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg cursor-pointer border ${
                    doc.status === 'Active'
                      ? 'bg-[#E8F7F1] text-[#008F68] border-[#BDE4D5]'
                      : doc.status === 'Consulting'
                      ? 'bg-[#EAF6FB] text-[#287EA8] border-[#C5E4F3]'
                      : doc.status === 'In Surgery'
                      ? 'bg-[#FFF7E6] text-[#A86E00] border-[#FED88B]'
                      : 'bg-[#F1FAF6] text-[#52635C] border-[#DCEBE4]'
                  }`}
                >
                  <option value="Active">Active & Available</option>
                  <option value="Consulting">In OPD Consultation</option>
                  <option value="In Surgery">In Operation Theater</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>

              {/* Schedule */}
              <div className="p-2.5 rounded-xl bg-[#F6FBF8] border border-[#DCEBE4] space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#17221E]">
                  <Clock className="h-3.5 w-3.5 text-[#008F68]" />
                  <span>{doc.opdSchedule}</span>
                </div>
              </div>

              {/* Fee Matrix */}
              <div className="grid grid-cols-3 gap-2 text-center pt-1 text-xs">
                <div className="p-2 rounded-lg bg-white border border-[#DCEBE4]">
                  <span className="text-[10px] text-[#52635C] block">1st Visit</span>
                  <strong className="text-[#17221E]">₹{doc.consultationFee}</strong>
                </div>
                <div className="p-2 rounded-lg bg-white border border-[#DCEBE4]">
                  <span className="text-[10px] text-[#52635C] block">Follow-Up</span>
                  <strong className="text-[#17221E]">₹{doc.followUpFee}</strong>
                </div>
                <div className="p-2 rounded-lg bg-white border border-[#DCEBE4]">
                  <span className="text-[10px] text-[#52635C] block">Teleconsult</span>
                  <strong className="text-[#17221E]">₹{doc.teleconsultFee}</strong>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#DCEBE4] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#52635C] font-mono">{doc.experienceYears} Years Exp</span>
              <button
                onClick={() => deleteDoctor(doc.id)}
                className="text-[#C53939] hover:bg-[#FFF1F1] p-1.5 rounded-lg transition cursor-pointer"
                title="Remove Doctor Record"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
