import React, { useState } from 'react';
import { X, Calendar, UserCheck, AlertCircle, Clock } from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';

export const AppointmentBookingModal: React.FC = () => {
  const { activeModal, closeModal, addAppointment, doctors } = useHospitalPortal();

  const [patientName, setPatientName] = useState('');
  const [patientMRN, setPatientMRN] = useState(`MRN-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [patientPhone, setPatientPhone] = useState('');
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || 'DOC-101');
  const [appointmentTime, setAppointmentTime] = useState('11:30 AM');
  const [type, setType] = useState<'In-Person Consultation' | 'Video Teleconsultation' | 'Emergency Walk-in'>('In-Person Consultation');
  const [triagePriority, setTriagePriority] = useState<'Normal Priority' | 'Senior Citizen' | 'STAT Emergency Walk-in'>('Normal Priority');
  const [paymentStatus, setPaymentStatus] = useState<'Paid (Cashless / Insurance)' | 'Paid (Card / UPI)' | 'Pending at Counter'>('Paid (Card / UPI)');
  const [error, setError] = useState('');

  if (activeModal !== 'book_appointment') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone) {
      setError('Patient name and contact phone number are required.');
      return;
    }

    const doc = doctors.find((d) => d.id === doctorId);

    addAppointment({
      patientName,
      patientMRN: patientMRN || `MRN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patientPhone,
      doctorId,
      doctorName: doc?.name || 'Assigned Specialist',
      departmentName: doc?.departmentName || 'Specialist OPD',
      chamber: doc?.roomNumber || 'OPD Chamber 101',
      appointmentTime: appointmentTime || '11:00 AM',
      type,
      triagePriority,
      paymentStatus
    });

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17221E]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#FFFFFF] rounded-2xl border border-[#DCEBE4] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DCEBE4] bg-[#F1FAF6]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#008F68] text-white">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#17221E]">Book OPD Consultation & Token</h3>
              <p className="text-xs text-[#52635C]">Real-Time Outpatient Chamber Scheduling</p>
            </div>
          </div>
          <button onClick={closeModal} className="p-1.5 rounded-lg text-[#52635C] hover:bg-[#DCEBE4] transition cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FFF1F1] border border-[#F2CCCC] text-[#C53939] text-xs font-semibold">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#52635C] mb-1">Patient Full Name *</label>
            <input
              type="text"
              required
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. Smt. Kamala Devi Sharma"
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Patient MRN (Medical Record No)</label>
              <input
                type="text"
                value={patientMRN}
                onChange={(e) => setPatientMRN(e.target.value)}
                placeholder="MRN-2026-9901"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] font-mono focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Contact Mobile *</label>
              <input
                type="text"
                required
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="+91 98110 00112"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#52635C] mb-1">Select Consulting Specialist</label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
            >
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} - {doc.specialty} [{doc.roomNumber}] (₹{doc.consultationFee})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Time Slot</label>
              <input
                type="text"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                placeholder="11:30 AM"
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Consultation Mode</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              >
                <option value="In-Person Consultation">In-Person OPD</option>
                <option value="Video Teleconsultation">Teleconsult Video</option>
                <option value="Emergency Walk-in">Emergency Walk-In</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Triage Priority</label>
              <select
                value={triagePriority}
                onChange={(e) => setTriagePriority(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              >
                <option value="Normal Priority">Normal</option>
                <option value="Senior Citizen">Senior Citizen</option>
                <option value="STAT Emergency Walk-in">STAT Emergency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#52635C] mb-1">Billing / Payment Mode</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as any)}
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
            >
              <option value="Paid (Card / UPI)">Paid via Card / UPI / NetBanking</option>
              <option value="Paid (Cashless / Insurance)">Cashless Insurance Empaneled</option>
              <option value="Pending at Counter">Pay Cash at OPD Counter</option>
            </select>
          </div>

          <div className="pt-4 border-t border-[#DCEBE4] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-xs font-bold text-[#52635C] hover:bg-[#F1FAF6] rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#008F68] hover:bg-[#007A59] rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="h-4 w-4" />
              <span>Issue OPD Token</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
