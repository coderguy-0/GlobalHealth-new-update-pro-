import React, { useState } from 'react';
import { X, Stethoscope, UserCheck, AlertCircle } from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';

export const DoctorModal: React.FC = () => {
  const { activeModal, closeModal, addDoctor, departments } = useHospitalPortal();

  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [subspecialty, setSubspecialty] = useState('');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || 'DEPT-CARDIO');
  const [qualifications, setQualifications] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [council, setCouncil] = useState('Delhi Medical Council / National Medical Commission');
  const [experienceYears, setExperienceYears] = useState(12);
  const [consultationFee, setConsultationFee] = useState(1500);
  const [followUpFee, setFollowUpFee] = useState(750);
  const [teleconsultFee, setTeleconsultFee] = useState(1200);
  const [roomNumber, setRoomNumber] = useState('OPD Suite 204');
  const [opdSchedule, setOpdSchedule] = useState('Mon, Wed, Fri (09:00 AM - 01:00 PM)');
  const [status, setStatus] = useState<'Active' | 'Consulting' | 'In Surgery' | 'On Leave'>('Active');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [error, setError] = useState('');

  if (activeModal !== 'add_doctor') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !specialty || !registrationNo) {
      setError('Doctor name, specialty, and council registration number are required.');
      return;
    }

    const dept = departments.find((d) => d.id === departmentId);

    addDoctor({
      name: name.startsWith('Dr.') || name.startsWith('Prof.') ? name : `Dr. ${name}`,
      specialty,
      subspecialty: subspecialty || 'General Clinical Specialist Care',
      departmentId,
      departmentName: dept?.name || 'Clinical Specialist Services',
      qualifications: qualifications || 'MBBS, MD / MS',
      registrationNo,
      council,
      experienceYears: experienceYears || 10,
      consultationFee: consultationFee || 1200,
      followUpFee: followUpFee || 600,
      teleconsultFee: teleconsultFee || 1000,
      roomNumber: roomNumber || 'OPD Chamber 101',
      opdSchedule: opdSchedule || 'Mon to Fri (09:00 - 13:00)',
      status,
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
      contactEmail: contactEmail || `dr.${name.toLowerCase().replace(/[^a-z]/g, '')}@apexhealth.org`,
      contactPhone: contactPhone || '+91 98000 00000'
    });

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17221E]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#FFFFFF] rounded-2xl border border-[#DCEBE4] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DCEBE4] bg-[#F1FAF6]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#008F68] text-white">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#17221E]">Enroll Specialist Physician</h3>
              <p className="text-xs text-[#52635C]">Clinical Faculty Credentials & Consultation Tariffs</p>
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
            <label className="block text-xs font-bold text-[#52635C] mb-1">Doctor Full Name & Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Rajeshwari Mukherjee"
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Primary Specialty *</label>
              <input
                type="text"
                required
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="e.g. Interventional Cardiology"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Subspecialty Focus</label>
              <input
                type="text"
                value={subspecialty}
                onChange={(e) => setSubspecialty(e.target.value)}
                placeholder="e.g. Complex Angioplasty & TAVR"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Clinical Department</label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Clinical Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              >
                <option value="Active">Active & Available</option>
                <option value="Consulting">In OPD Consultation</option>
                <option value="In Surgery">In Operation Theater</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Qualifications / Fellowships</label>
              <input
                type="text"
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                placeholder="MBBS, MD (Med), DM (Card), FACC"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Council Registration No *</label>
              <input
                type="text"
                required
                value={registrationNo}
                onChange={(e) => setRegistrationNo(e.target.value)}
                placeholder="DMC/R/88210"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-[#F1FAF6] border border-[#DCEBE4]">
            <div>
              <label className="block text-[11px] font-bold text-[#52635C] mb-1">1st Visit OPD Fee</label>
              <input
                type="number"
                value={consultationFee}
                onChange={(e) => setConsultationFee(parseInt(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#D8E7E0] rounded-lg text-[#17221E] font-bold focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#52635C] mb-1">Follow-Up Fee</label>
              <input
                type="number"
                value={followUpFee}
                onChange={(e) => setFollowUpFee(parseInt(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#D8E7E0] rounded-lg text-[#17221E] font-bold focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#52635C] mb-1">Teleconsult Fee</label>
              <input
                type="number"
                value={teleconsultFee}
                onChange={(e) => setTeleconsultFee(parseInt(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#D8E7E0] rounded-lg text-[#17221E] font-bold focus:outline-none focus:border-[#008F68]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Chamber / Room Location</label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="OPD Suite 204 (North Wing)"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">OPD Schedule Timetable</label>
              <input
                type="text"
                value={opdSchedule}
                onChange={(e) => setOpdSchedule(e.target.value)}
                placeholder="Tue, Thu, Sat (10:00 AM - 02:00 PM)"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
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
              <span>Enroll Physician</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
