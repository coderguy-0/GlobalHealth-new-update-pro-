import React, { useState } from 'react';
import { X, Building2, Phone, ShieldCheck, UserCheck, AlertCircle, Sparkles } from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';

export const RegisterHospitalModal: React.FC = () => {
  const { activeModal, closeModal, registerNewHospital } = useHospitalPortal();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [name, setName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [shortName, setShortName] = useState('');
  const [hospitalType, setHospitalType] = useState<'Super Specialty' | 'Multi Specialty' | 'Tertiary Care' | 'Teaching Hospital'>('Super Specialty');
  const [ownership, setOwnership] = useState<'Private' | 'Trust / Non-Profit' | 'Government / Public'>('Private');
  const [establishedYear, setEstablishedYear] = useState<number>(2012);
  const [cinNo, setCinNo] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [traumaLevel, setTraumaLevel] = useState<'Level 1 Trauma Center' | 'Level 2 Trauma Center' | 'Level 3 Emergency'>('Level 1 Trauma Center');

  // Step 2: Helplines & Address
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('India');
  const [postalCode, setPostalCode] = useState('');
  const [officialEmail, setOfficialEmail] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [mainReceptionPhone, setMainReceptionPhone] = useState('');
  const [ambulanceHelpline, setAmbulanceHelpline] = useState('');
  const [bloodBankHelpline, setBloodBankHelpline] = useState('');

  // Step 3: Admin User
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminRole, setAdminRole] = useState<'Hospital Administrator' | 'Hospital Owner'>('Hospital Administrator');
  const [adminPhone, setAdminPhone] = useState('');
  const [error, setError] = useState('');

  if (activeModal !== 'register_hospital') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !officialEmail || !emergencyPhone) {
      setError('Hospital name, official email, and 24/7 emergency hotline are required.');
      return;
    }
    if (!adminName || !adminEmail) {
      setError('Admin name and work email are required.');
      return;
    }

    registerNewHospital(
      {
        orgId: `ORG-${name.slice(0, 4).toUpperCase()}`,
        name,
        legalName: legalName || name,
        shortName: shortName || name.split(' ')[0],
        tagline: 'Excellence in Tertiary Medicine & Compassionate Clinical Governance',
        hospitalType,
        ownership,
        establishedYear: establishedYear || 2020,
        registrationNo: registrationNo || `REG-${Math.floor(1000 + Math.random() * 9000)}`,
        cinNo: cinNo || `U85110DL${establishedYear}PLC${Math.floor(100000 + Math.random() * 900000)}`,
        officialEmail,
        emergencyPhone,
        mainReceptionPhone: mainReceptionPhone || emergencyPhone,
        opdAppointmentPhone: mainReceptionPhone || emergencyPhone,
        bloodBankHelpline: bloodBankHelpline || emergencyPhone,
        ambulanceHelpline: ambulanceHelpline || emergencyPhone,
        tpaInsuranceDeskPhone: mainReceptionPhone || emergencyPhone,
        websiteUrl: `https://${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.org`,
        streetAddress: streetAddress || 'Healthcare Institutional Area',
        city: city || 'New Delhi',
        state: state || 'Delhi NCR',
        country: country || 'India',
        postalCode: postalCode || '110001',
        emergencyHours: '24 Hours / 365 Days',
        opdHours: '08:00 AM - 08:00 PM',
        visitingHours: '05:00 PM - 07:00 PM',
        pharmacyHours: '24 Hours Continuous',
        bloodBankHours: '24 Hours Service',
        verificationStatus: 'Verified',
        redAlertActive: false,
        traumaLevel,
        rating: 4.9,
        totalBedsCount: 450,
        icuBedsCount: 80
      },
      {
        name: adminName,
        email: adminEmail,
        hospitalName: name,
        createdAt: new Date().toISOString(),
        role: adminRole,
        department: 'Hospital Administration',
        employeeId: `EMP-ADM-${Math.floor(100 + Math.random() * 900)}`,
        phone: adminPhone || '+91 98000 00000',
        registrationNumber: 'MHA/NMC/VERIFIED',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        lastLoginAt: new Date().toISOString(),
        twoFactorEnabled: true,
        status: 'Active'
      }
    );

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17221E]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#FFFFFF] rounded-2xl border border-[#DCEBE4] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DCEBE4] bg-[#F1FAF6]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#008F68] text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#17221E]">Provision New Hospital Institution</h3>
              <p className="text-xs text-[#52635C]">Multi-Tenant Enterprise Onboarding Wizard</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg text-[#52635C] hover:bg-[#DCEBE4] hover:text-[#17221E] transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 border-b border-[#DCEBE4] text-xs font-bold text-center bg-white">
          <div
            className={`py-2.5 px-3 border-b-2 transition ${
              step === 1 ? 'border-[#008F68] text-[#008F68] bg-[#E8F7F1]' : 'border-transparent text-[#52635C]'
            }`}
          >
            1. Institutional Identity
          </div>
          <div
            className={`py-2.5 px-3 border-b-2 transition ${
              step === 2 ? 'border-[#008F68] text-[#008F68] bg-[#E8F7F1]' : 'border-transparent text-[#52635C]'
            }`}
          >
            2. Campus & 24/7 Helplines
          </div>
          <div
            className={`py-2.5 px-3 border-b-2 transition ${
              step === 3 ? 'border-[#008F68] text-[#008F68] bg-[#E8F7F1]' : 'border-transparent text-[#52635C]'
            }`}
          >
            3. SuperAdmin Authority
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FFF1F1] border border-[#F2CCCC] text-[#C53939] text-xs font-semibold">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#52635C] mb-1">
                  Public Hospital Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. St. Jude Metropolitan Medical Center"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] placeholder-[#8A9993] focus:outline-none focus:border-[#008F68] focus:ring-1 focus:ring-[#008F68]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#52635C] mb-1">Registered Legal Entity Name</label>
                  <input
                    type="text"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    placeholder="e.g. St. Jude Health Sciences Ltd."
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] placeholder-[#8A9993] focus:outline-none focus:border-[#008F68]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#52635C] mb-1">Facility Short Moniker</label>
                  <input
                    type="text"
                    value={shortName}
                    onChange={(e) => setShortName(e.target.value)}
                    placeholder="e.g. St. Jude Trauma"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] placeholder-[#8A9993] focus:outline-none focus:border-[#008F68]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#52635C] mb-1">Hospital Category</label>
                  <select
                    value={hospitalType}
                    onChange={(e) => setHospitalType(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
                  >
                    <option value="Super Specialty">Super Specialty</option>
                    <option value="Multi Specialty">Multi Specialty</option>
                    <option value="Tertiary Care">Tertiary Care</option>
                    <option value="Teaching Hospital">Teaching Hospital</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#52635C] mb-1">Ownership Type</label>
                  <select
                    value={ownership}
                    onChange={(e) => setOwnership(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
                  >
                    <option value="Private">Private Entity</option>
                    <option value="Trust / Non-Profit">Trust / Non-Profit</option>
                    <option value="Government / Public">Government / Public</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#52635C] mb-1">Emergency Trauma Level</label>
                  <select
                    value={traumaLevel}
                    onChange={(e) => setTraumaLevel(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
                  >
                    <option value="Level 1 Trauma Center">Level 1 Trauma Center</option>
                    <option value="Level 2 Trauma Center">Level 2 Trauma Center</option>
                    <option value="Level 3 Emergency">Level 3 Emergency</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#52635C] mb-1">Established Year</label>
                  <input
                    type="number"
                    value={establishedYear}
                    onChange={(e) => setEstablishedYear(parseInt(e.target.value) || 2020)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#52635C] mb-1">State Reg No</label>
                  <input
                    type="text"
                    value={registrationNo}
                    onChange={(e) => setRegistrationNo(e.target.value)}
                    placeholder="DHS/DL/TER-0091"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] placeholder-[#8A9993] focus:outline-none focus:border-[#008F68]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#52635C] mb-1">CIN Number</label>
                  <input
                    type="text"
                    value={cinNo}
                    onChange={(e) => setCinNo(e.target.value)}
                    placeholder="U85110DL2012PLC8812"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] placeholder-[#8A9993] focus:outline-none focus:border-[#008F68]"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#52635C] mb-1">Campus Street Address *</label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="Plot 4, Knowledge Park III, Medical District"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] placeholder-[#8A9993] focus:outline-none focus:border-[#008F68]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#52635C] mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New Delhi"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#52635C] mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Delhi"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#52635C] mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="India"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#52635C] mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="110029"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#DCEBE4]">
                <div>
                  <label className="block text-xs font-bold text-[#52635C] mb-1">
                    Official Central Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={officialEmail}
                    onChange={(e) => setOfficialEmail(e.target.value)}
                    placeholder="admin@stjudehealth.org"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#D64545] mb-1">
                    24/7 Red Alert Emergency Hotline *
                  </label>
                  <input
                    type="text"
                    required
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="+91 11 2659 8888"
                    className="w-full px-3.5 py-2 text-sm bg-[#FFF1F1] border border-[#F2CCCC] rounded-xl text-[#C53939] font-bold focus:outline-none focus:border-[#D64545]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#52635C] mb-1">Main Reception</label>
                  <input
                    type="text"
                    value={mainReceptionPhone}
                    onChange={(e) => setMainReceptionPhone(e.target.value)}
                    placeholder="+91 11 2659 8000"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#52635C] mb-1">Ambulance STAT Desk</label>
                  <input
                    type="text"
                    value={ambulanceHelpline}
                    onChange={(e) => setAmbulanceHelpline(e.target.value)}
                    placeholder="+91 11 2659 8333"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#52635C] mb-1">Blood Bank Helpline</label>
                  <input
                    type="text"
                    value={bloodBankHelpline}
                    onChange={(e) => setBloodBankHelpline(e.target.value)}
                    placeholder="+91 11 2659 8222"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#E8F7F1] border border-[#BDE4D5] text-[#008F68] text-xs flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 shrink-0" />
                <span>
                  The initial administrator account is granted full institution privileges, RBAC management, and 2FA enforcement authority.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#52635C] mb-1">
                  Primary Administrator Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="Dr. Anand S. Vardhan, MD, MHA"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#52635C] mb-1">
                    Official Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@stjudehealth.org"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#52635C] mb-1">Direct Mobile Phone</label>
                  <input
                    type="text"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    placeholder="+91 98110 55443"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#52635C] mb-1">Assigned RBAC Role</label>
                <select
                  value={adminRole}
                  onChange={(e) => setAdminRole(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
                >
                  <option value="Hospital Administrator">Hospital Administrator (Executive Management)</option>
                  <option value="Hospital Owner">Hospital Owner (Governing Trustee)</option>
                </select>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#DCEBE4] flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="px-4 py-2 text-xs font-bold text-[#52635C] bg-[#F1FAF6] hover:bg-[#DCEBE4] rounded-xl transition cursor-pointer"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-xs font-bold text-[#52635C] hover:bg-[#F1FAF6] rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 1 && !name) {
                      setError('Hospital name is required.');
                      return;
                    }
                    setError('');
                    setStep((prev) => (prev + 1) as any);
                  }}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#008F68] hover:bg-[#007A59] rounded-xl transition shadow-xs cursor-pointer"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#008F68] hover:bg-[#007A59] rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Provision Institution</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
