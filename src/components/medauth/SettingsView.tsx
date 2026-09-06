import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  Key,
  FileSignature,
  Building,
  Save,
  CheckCircle2,
  Lock,
  Download
} from 'lucide-react';
import { DoctorProfile } from '../../types/medauth';

interface SettingsViewProps {
  doctor: DoctorProfile;
  onUpdateDoctor?: (updated: DoctorProfile) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ doctor, onUpdateDoctor }) => {
  const [clinicName, setClinicName] = useState(doctor.hospitalAffiliation);
  const [phone, setPhone] = useState(doctor.phone);
  const [email, setEmail] = useState(doctor.email);
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateDoctor) {
      onUpdateDoctor({
        ...doctor,
        hospitalAffiliation: clinicName,
        phone,
        email
      });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-1">
            <SettingsIcon className="w-3.5 h-3.5" />
            <span>Clinic & EHR Customization</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Practitioner & Workspace Settings
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Customize e-prescription letterheads, notification frequencies, and digital signature credentials.
          </p>
        </div>

        {saved && (
          <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Preferences Saved Successfully</span>
          </span>
        )}
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h3 className="text-sm font-bold text-slate-900">Institutional & Practice Contact Info</h3>
          <p className="text-xs text-slate-500">Appears on official prescriptions, referral dispatches, and lab requisitions.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-800 block">Hospital / Practice Affiliation</label>
            <input
              type="text"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-800 block">Institutional Secure Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-800 block">Direct Clinical Phone Extension</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-800 block">Electronic Signature Pad Status</label>
            <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg font-mono text-emerald-800 font-bold flex items-center justify-between">
              <span>ACTIVE • SHA-256 HMAC STAMP</span>
              <FileSignature className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-200">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-2xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
