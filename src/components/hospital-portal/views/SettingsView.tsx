import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Lock,
  Key,
  Save,
  CheckCircle2
} from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';

export const SettingsView: React.FC = () => {
  const { currentHospital, updateHospitalProfile } = useHospitalPortal();

  const [notificationEmail, setNotificationEmail] = useState(currentHospital.officialEmail);
  const [allowPublicAppointments, setAllowPublicAppointments] = useState(true);
  const [strictAuditLogging, setStrictAuditLogging] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-[#DCEBE4] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#17221E]">Hospital Facility Settings</h1>
          <p className="text-xs text-[#52635C]">
            Enterprise Integration Parameters, Notification Webhooks & Automation Policies
          </p>
        </div>

        {saved && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-[#008F68] bg-[#E8F7F1] px-3 py-1.5 rounded-xl border border-[#BDE4D5]">
            <CheckCircle2 className="h-4 w-4" />
            <span>Settings Saved</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-6 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#DCEBE4]">
            <Bell className="h-5 w-5 text-[#008F68]" />
            <h2 className="text-base font-bold text-[#17221E]">Notification Channels</h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#52635C] mb-1">Central Administrative Alert Email</label>
            <input
              type="email"
              value={notificationEmail}
              onChange={(e) => setNotificationEmail(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
            />
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#F6FBF8] border border-[#DCEBE4] cursor-pointer">
              <div>
                <span className="text-xs font-bold text-[#17221E] block">Public OPD Appointment Booking</span>
                <span className="text-[11px] text-[#52635C]">Allow direct walk-in tokens from public directory</span>
              </div>
              <input
                type="checkbox"
                checked={allowPublicAppointments}
                onChange={(e) => setAllowPublicAppointments(e.target.checked)}
                className="h-4 w-4 rounded text-[#008F68] focus:ring-[#008F68]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#F6FBF8] border border-[#DCEBE4] cursor-pointer">
              <div>
                <span className="text-xs font-bold text-[#17221E] block">Cryptographic SHA-256 Mutation Logging</span>
                <span className="text-[11px] text-[#52635C]">Enforce block hashing on all clinical state mutations</span>
              </div>
              <input
                type="checkbox"
                checked={strictAuditLogging}
                onChange={(e) => setStrictAuditLogging(e.target.checked)}
                className="h-4 w-4 rounded text-[#008F68] focus:ring-[#008F68]"
              />
            </label>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#DCEBE4]">
            <Key className="h-5 w-5 text-[#287EA8]" />
            <h2 className="text-base font-bold text-[#17221E]">FHIR / HL7 Interoperability API Keys</h2>
          </div>

          <div className="p-3 rounded-xl bg-[#F6FBF8] border border-[#DCEBE4] space-y-1">
            <span className="text-xs font-bold text-[#52635C] block">Facility Secret Key (ABDM / HL7 FHIR v4)</span>
            <div className="font-mono text-xs text-[#17221E] bg-white p-2 rounded border border-[#DCEBE4] truncate">
              gh_live_sec_{currentHospital.id.toLowerCase()}_8f9a204b88e7
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#008F68] hover:bg-[#007A59] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
