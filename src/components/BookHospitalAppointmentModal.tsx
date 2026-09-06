import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Stethoscope,
  Video,
  CheckCircle2,
  X,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { Hospital, Doctor } from '../types';
import { DOCTORS } from '../data/healthData';
import { useHospitalPortal } from '../context/HospitalContext';
import { usePatientEhr } from '../context/PatientEhrContext';

interface BookHospitalAppointmentModalProps {
  hospital: Hospital;
  onClose: () => void;
  preselectedSpecialty?: string;
  preselectedDoctor?: Doctor | null;
}

export const BookHospitalAppointmentModal: React.FC<BookHospitalAppointmentModalProps> = ({
  hospital,
  onClose,
  preselectedSpecialty,
  preselectedDoctor
}) => {
  const { addAppointment: addPortalAppointment, addAuditLog, doctors: portalDoctors } = useHospitalPortal();
  const { bookAppointment } = usePatientEhr();

  const specialties = hospital.specialties?.length
    ? hospital.specialties
    : ['Cardiology', 'Neurology', 'Orthopedics', 'Oncology', 'General Medicine', 'Pediatrics', 'Nephrology'];

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(
    preselectedSpecialty || specialties[0] || 'Cardiology'
  );

  // Doctors for this hospital/specialty
  const availableDoctors = [
    ...DOCTORS.filter(
      (d) =>
        d.hospital.toLowerCase().includes(hospital.name.toLowerCase()) ||
        d.location.toLowerCase().includes(hospital.city.toLowerCase())
    ),
    ...(portalDoctors || [])
      .filter((d) => d.hospitalId === hospital.id || d.status === 'Active')
      .map((d) => ({
        id: d.id,
        name: d.name,
        specialty: d.departmentName || d.specialty,
        hospital: hospital.name,
        location: `${hospital.city}, ${hospital.country}`,
        experienceYears: d.experienceYears || 12,
        rating: 4.9,
        reviewCount: 140,
        consultationFee: d.consultationFee || '$150',
        availableSlots: ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'],
        telehealthAvailable: true,
        languages: ['English'],
        education: d.qualifications || 'MBBS, MD',
        bio: 'Board-certified medical specialist.',
        verifiedLicense: true
      }))
  ];

  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    preselectedDoctor ? preselectedDoctor.id : availableDoctors[0]?.id || 'any'
  );

  const [consultationType, setConsultationType] = useState<'In-Person OPD' | 'Video Telehealth'>('In-Person OPD');
  const [appointmentDate, setAppointmentDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [appointmentTime, setAppointmentTime] = useState('10:00 AM');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [confirmationToken, setConfirmationToken] = useState('');

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone || !appointmentDate) return;

    const token = `APT-${hospital.country.slice(0, 2).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const chosenDoc = availableDoctors.find((d) => d.id === selectedDoctorId);
    const doctorName = chosenDoc ? chosenDoc.name : `Dr. Specialist (${selectedSpecialty})`;

    // Write to Hospital Portal Context
    addPortalAppointment({
      patientName,
      patientPhone,
      doctorName,
      doctorId: chosenDoc?.id || 'DOC-GEN-01',
      departmentName: selectedSpecialty,
      patientMRN: `MRN-WEB-${Date.now().toString().slice(-6)}`,
      chamber: 'OPD Reception',
      appointmentTime: `${appointmentDate} ${appointmentTime}`,
      type: consultationType === 'In-Person OPD' ? 'In-Person Consultation' : 'Video Teleconsultation',
      triagePriority: 'Normal Priority',
      paymentStatus: 'Pending at Counter'
    });

    // Write to Patient EHR Context
    bookAppointment({
      time: appointmentTime,
      date: appointmentDate,
      patientId: 'PT-PUBLIC',
      patientName,
      mrn: `MRN-${Math.floor(100000 + Math.random() * 900000)}`,
      age: parseInt(patientAge, 10) || 32,
      gender: 'Other',
      reason: chiefComplaint || `${selectedSpecialty} consultation at ${hospital.name}`,
      type: consultationType === 'In-Person OPD' ? 'Clinic (In-Person)' : 'Video Call (Telemedicine)',
      doctorName,
      notes: `Booked for ${hospital.name}. Phone: ${patientPhone}`
    });

    if (addAuditLog) {
      addAuditLog(
        'Public Appointment Scheduled',
        'Appointments',
        `Booked slot for patient ${patientName} with ${doctorName} on ${appointmentDate} at ${appointmentTime}.`
      );
    }

    setConfirmationToken(token);
    setConfirmed(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/20 text-white font-black backdrop-blur-xs shrink-0">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded text-white block w-fit">
                Hospital OPD & Telehealth Booking
              </span>
              <h3 className="text-lg font-black text-white leading-tight">
                Schedule Hospital Consultation
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-white/80 hover:bg-white/20 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Selected Facility Sub-Header Banner */}
        <div className="bg-blue-50 border-b border-blue-100 px-5 py-3 flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 truncate">
            <Building2 className="h-4 w-4 text-blue-600 shrink-0" />
            <span className="font-bold text-slate-900 truncate">{hospital.name}</span>
            <span className="text-blue-600 font-semibold hidden sm:inline">• {hospital.city}, {hospital.country}</span>
          </div>
          <span className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg shrink-0">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified Facility
          </span>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {!confirmed ? (
            <form onSubmit={handleBook} className="space-y-4">
              
              {/* Specialty & Consultation Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
                    Department / Specialty *
                  </label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                  >
                    {specialties.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
                    Consultation Modality *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setConsultationType('In-Person OPD')}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        consultationType === 'In-Person OPD'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Building2 className="h-3.5 w-3.5" />
                      <span>In-Person OPD</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setConsultationType('Video Telehealth')}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        consultationType === 'Video Telehealth'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Video className="h-3.5 w-3.5" />
                      <span>Telehealth</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Doctor Selector */}
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
                  Preferred Doctor / Specialist
                </label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="any">✨ First Available Department Specialist</option>
                  {availableDoctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialty} ({d.consultationFee})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
                    Preferred Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="date"
                      required
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
                    Preferred Time Slot *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <select
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                    >
                      <option>09:00 AM (Morning Slot)</option>
                      <option>10:00 AM (Morning Slot)</option>
                      <option>11:30 AM (Midday Slot)</option>
                      <option>02:00 PM (Afternoon Slot)</option>
                      <option>03:30 PM (Afternoon Slot)</option>
                      <option>05:00 PM (Evening Slot)</option>
                      <option>06:30 PM (Evening Slot)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Patient Contact Information */}
              <div className="space-y-3 pt-1 border-t border-slate-100">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                  Patient Contact Information *
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="Patient Full Name *"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <input
                    type="number"
                    placeholder="Patient Age"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="Contact Mobile Number *"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="email"
                      placeholder="Email Address (Optional)"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <textarea
                  rows={2}
                  placeholder="Primary symptoms, medical condition, or reason for appointment..."
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 text-white py-3.5 text-sm font-black transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="h-5 w-5" />
                  <span>CONFIRM APPOINTMENT BOOKING</span>
                </button>
                <p className="text-[11px] text-center text-slate-400 mt-2">
                  Guaranteed slot allocation with direct notification to the OPD front desk.
                </p>
              </div>
            </form>
          ) : (
            /* Confirmation Receipt */
            <div className="space-y-5 animate-in zoom-in-95 duration-200">
              <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-600 text-white font-black shrink-0">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                      Booking Confirmed
                    </span>
                    <h4 className="text-lg font-black text-emerald-950">
                      Appointment Scheduled Successfully!
                    </h4>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Token Reference</span>
                    <span className="font-mono font-black text-emerald-700 text-sm">{confirmationToken}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Modality</span>
                    <span className="font-bold text-slate-800">{consultationType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Date & Time</span>
                    <span className="font-bold text-slate-800">{appointmentDate} at {appointmentTime}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Department</span>
                    <span className="font-bold text-slate-800">{selectedSpecialty}</span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Medical Facility</span>
                    <p className="font-bold text-slate-900">{hospital.name}</p>
                    <p className="text-[11px] text-slate-500">{hospital.address}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 text-white py-3 text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
