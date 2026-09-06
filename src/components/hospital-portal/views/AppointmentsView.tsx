import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  UserCheck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Video,
  Building
} from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';
import { Appointment } from '../../../types/hospitalPortal';

export const AppointmentsView: React.FC = () => {
  const { appointments, openModal, updateAppointmentStatus, doctors } = useHospitalPortal();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientMRN.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCEBE4] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#17221E]">OPD Consultation Queue & Tokens</h1>
            <span className="text-xs font-mono font-bold bg-[#E8F7F1] text-[#008F68] px-2 py-0.5 rounded border border-[#BDE4D5]">
              {appointments.length} Consultations
            </span>
          </div>
          <p className="text-xs text-[#52635C]">
            Live Token Callouts, Triage Priority & Video Teleconsultation Integration
          </p>
        </div>

        <button
          onClick={() => openModal('book_appointment')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#008F68] hover:bg-[#007A59] text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Book OPD Token</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#52635C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient name, MRN number, token code, or specialist..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] placeholder-[#8A9993] focus:outline-none focus:border-[#008F68]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-[#52635C] shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68] cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="Checked-In / In Queue">Checked-In / In Queue</option>
            <option value="Inside Chamber">Inside Chamber</option>
            <option value="Consultation Completed">Consultation Completed</option>
            <option value="No-Show / Cancelled">No-Show / Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointment Tokens Table */}
      <div className="p-6 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#DCEBE4] text-[#52635C] font-bold uppercase text-[10px]">
                <th className="pb-3 px-3">Token & Time</th>
                <th className="pb-3 px-3">Patient Information</th>
                <th className="pb-3 px-3">Consulting Specialist</th>
                <th className="pb-3 px-3">Mode & Triage</th>
                <th className="pb-3 px-3">Billing Status</th>
                <th className="pb-3 px-3">Queue Status</th>
                <th className="pb-3 px-3 text-right">Call / Transition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCEBE4]">
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-[#F6FBF8]">
                  <td className="py-3 px-3">
                    <div className="font-mono font-bold text-xs text-[#008F68] bg-[#E8F7F1] px-2 py-0.5 rounded-md border border-[#BDE4D5] inline-block">
                      {apt.tokenNumber}
                    </div>
                    <div className="text-[11px] text-[#52635C] mt-0.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{apt.appointmentTime}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-[#17221E]">{apt.patientName}</div>
                    <div className="text-[10px] text-[#52635C] font-mono">
                      {apt.patientMRN} • {apt.patientPhone}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-[#17221E]">{apt.doctorName}</div>
                    <div className="text-[10px] text-[#52635C]">{apt.departmentName} • {apt.chamber}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                        apt.type === 'Video Teleconsultation'
                          ? 'bg-[#EAF6FB] text-[#287EA8] border border-[#C5E4F3]'
                          : 'bg-[#F1FAF6] text-[#52635C]'
                      }`}
                    >
                      {apt.type}
                    </span>
                    <div className="text-[10px] text-[#52635C] mt-0.5">{apt.triagePriority}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-bold text-[#008F68]">
                      {apt.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                        apt.status === 'Inside Chamber'
                          ? 'bg-[#E8F7F1] text-[#008F68] border border-[#BDE4D5]'
                          : apt.status === 'Completed'
                          ? 'bg-[#F1FAF6] text-[#52635C]'
                          : 'bg-[#FFF7E6] text-[#A86E00] border border-[#FED88B]'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <select
                      value={apt.status}
                      onChange={(e) => updateAppointmentStatus(apt.id, e.target.value as any)}
                      className="px-2 py-1 text-[11px] font-bold bg-white border border-[#D8E7E0] rounded-lg text-[#17221E] cursor-pointer"
                    >
                      <option value="Checked-In / In Queue">Call Next in Queue</option>
                      <option value="Inside Chamber">Inside Chamber (Active)</option>
                      <option value="Consultation Completed">Complete Consultation</option>
                      <option value="No-Show / Cancelled">No-Show</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
