import React, { useState } from 'react';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Award,
  CheckCircle2,
  Save,
  ShieldCheck,
  Globe,
  FileText
} from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';

export const ProfileView: React.FC = () => {
  const { currentHospital, updateHospitalProfile } = useHospitalPortal();

  const [formData, setFormData] = useState({
    name: currentHospital.name,
    legalName: currentHospital.legalName,
    shortName: currentHospital.shortName,
    tagline: currentHospital.tagline,
    hospitalType: currentHospital.hospitalType,
    ownership: currentHospital.ownership,
    establishedYear: currentHospital.establishedYear,
    registrationNo: currentHospital.registrationNo,
    cinNo: currentHospital.cinNo,
    traumaLevel: currentHospital.traumaLevel,
    officialEmail: currentHospital.officialEmail,
    emergencyPhone: currentHospital.emergencyPhone,
    mainReceptionPhone: currentHospital.mainReceptionPhone,
    opdAppointmentPhone: currentHospital.opdAppointmentPhone,
    ambulanceHelpline: currentHospital.ambulanceHelpline,
    bloodBankHelpline: currentHospital.bloodBankHelpline,
    tpaInsuranceDeskPhone: currentHospital.tpaInsuranceDeskPhone,
    websiteUrl: currentHospital.websiteUrl,
    streetAddress: currentHospital.streetAddress,
    city: currentHospital.city,
    state: currentHospital.state,
    country: currentHospital.country,
    postalCode: currentHospital.postalCode,
    emergencyHours: currentHospital.emergencyHours,
    opdHours: currentHospital.opdHours,
    visitingHours: currentHospital.visitingHours,
    pharmacyHours: currentHospital.pharmacyHours,
    bloodBankHours: currentHospital.bloodBankHours
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateHospitalProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCEBE4] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#17221E]">Hospital Facility Profile</h1>
            <span className="text-xs font-mono font-bold bg-[#E8F7F1] text-[#008F68] px-2 py-0.5 rounded border border-[#BDE4D5]">
              {currentHospital.id}
            </span>
          </div>
          <p className="text-xs text-[#52635C]">
            Institutional Master Credentials, Regulatory Registrations & 24/7 Public Hotlines
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#E8F7F1] border border-[#BDE4D5] text-[#008F68] text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="h-4 w-4" />
            <span>Profile telemetry saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Identity & Legal Registration */}
        <div className="p-6 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#DCEBE4]">
            <Building2 className="h-5 w-5 text-[#008F68]" />
            <h2 className="text-sm font-bold text-[#17221E]">Institutional Identity & Regulatory Registration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Public Display Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] font-semibold focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Registered Entity Legal Name</label>
              <input
                type="text"
                value={formData.legalName}
                onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Hospital Category</label>
              <input
                type="text"
                value={formData.hospitalType}
                onChange={(e) => setFormData({ ...formData, hospitalType: e.target.value as any })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Ownership Type</label>
              <input
                type="text"
                value={formData.ownership}
                onChange={(e) => setFormData({ ...formData, ownership: e.target.value as any })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Trauma Designation</label>
              <select
                value={formData.traumaLevel}
                onChange={(e) => setFormData({ ...formData, traumaLevel: e.target.value as any })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] font-bold focus:outline-none focus:border-[#008F68]"
              >
                <option value="Level 1 Trauma Center">Level 1 Trauma Center</option>
                <option value="Level 2 Trauma Center">Level 2 Trauma Center</option>
                <option value="Level 3 Emergency">Level 3 Emergency</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Directorate Registration No</label>
              <input
                type="text"
                value={formData.registrationNo}
                onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] font-mono focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Corporate CIN Number</label>
              <input
                type="text"
                value={formData.cinNo}
                onChange={(e) => setFormData({ ...formData, cinNo: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] font-mono focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Established Year</label>
              <input
                type="number"
                value={formData.establishedYear}
                onChange={(e) => setFormData({ ...formData, establishedYear: parseInt(e.target.value) || 2020 })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: 24/7 Helplines & Direct Emergency Hotlines */}
        <div className="p-6 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#DCEBE4]">
            <Phone className="h-5 w-5 text-[#D64545]" />
            <h2 className="text-sm font-bold text-[#17221E]">24/7 Emergency Hotlines & Public Helplines</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#D64545] mb-1">
                24/7 STAT Red Alert Emergency
              </label>
              <input
                type="text"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-[#FFF1F1] border border-[#F2CCCC] rounded-xl text-[#C53939] font-bold focus:outline-none focus:border-[#D64545]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Ambulance Dispatch Desk</label>
              <input
                type="text"
                value={formData.ambulanceHelpline}
                onChange={(e) => setFormData({ ...formData, ambulanceHelpline: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Blood Bank Requisition Line</label>
              <input
                type="text"
                value={formData.bloodBankHelpline}
                onChange={(e) => setFormData({ ...formData, bloodBankHelpline: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Main Reception</label>
              <input
                type="text"
                value={formData.mainReceptionPhone}
                onChange={(e) => setFormData({ ...formData, mainReceptionPhone: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">OPD Appointments</label>
              <input
                type="text"
                value={formData.opdAppointmentPhone}
                onChange={(e) => setFormData({ ...formData, opdAppointmentPhone: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">TPA & Cashless Claims Desk</label>
              <input
                type="text"
                value={formData.tpaInsuranceDeskPhone}
                onChange={(e) => setFormData({ ...formData, tpaInsuranceDeskPhone: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Campus Geo Address */}
        <div className="p-6 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#DCEBE4]">
            <MapPin className="h-5 w-5 text-[#008F68]" />
            <h2 className="text-sm font-bold text-[#17221E]">Campus Geographic Location</h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#52635C] mb-1">Street Address</label>
            <input
              type="text"
              value={formData.streetAddress}
              onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">State / Province</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Postal Code</label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
          </div>
        </div>

        {/* Action Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#008F68] hover:bg-[#007A59] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Save Profile Telemetry</span>
          </button>
        </div>
      </form>
    </div>
  );
};
