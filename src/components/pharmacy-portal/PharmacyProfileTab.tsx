import React, { useState } from 'react';
import { 
  Store, 
  Building2, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Save, 
  CheckCircle2, 
  Snowflake, 
  Truck 
} from 'lucide-react';
import { PharmacyProfileDetails } from '../../types/pharmacyPortal';
import { PharmacyPortalService } from '../../services/pharmacyPortalStore';

interface PharmacyProfileTabProps {
  profile: PharmacyProfileDetails;
  onProfileUpdated: () => void;
}

export const PharmacyProfileTab: React.FC<PharmacyProfileTabProps> = ({
  profile,
  onProfileUpdated
}) => {
  const [legalEntityName, setLegalEntityName] = useState(profile.legalEntityName);
  const [tradeName, setTradeName] = useState(profile.tradeName);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [website, setWebsite] = useState(profile.website || '');
  const [operatingHours, setOperatingHours] = useState(profile.operatingHours);
  const [headquartersAddress, setHeadquartersAddress] = useState(profile.headquartersAddress);
  const [aboutText, setAboutText] = useState(profile.aboutText || '');
  const [isSavedToast, setIsSavedToast] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    PharmacyPortalService.updateProfile({
      legalEntityName,
      tradeName,
      phone,
      email,
      website,
      operatingHours,
      headquartersAddress,
      aboutText
    });
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2500);
    onProfileUpdated();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Dispensary Profile</span>
          </div>
          <h2 className="text-base font-black text-white">Pharmacy Enterprise Credentials & Public Listing</h2>
          <p className="text-xs text-slate-400">
            Information displayed on patient receipts, prescription delivery packaging, and partner network listings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-slate-950 text-teal-300 font-mono text-xs font-bold border border-slate-800">
            License: {profile.licenseNumber}
          </span>
        </div>
      </div>

      {isSavedToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Pharmacy profile and public listing details saved successfully.</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-xs">
        
        {/* Verification Status Summary Strip */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Principal Pharmacist</div>
            <div className="font-bold text-white text-xs mt-0.5">{profile.pharmacistInCharge}</div>
            <div className="text-[10px] text-teal-400 font-mono">{profile.pharmacistRegNo}</div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Statutory GSTIN</div>
            <div className="font-mono font-bold text-white text-xs mt-0.5">{profile.taxNumber}</div>
            <div className="text-[10px] text-slate-500">Regular Taxpayer Status</div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Accredited Capabilities</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 text-[10px] text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30 font-bold">
                <Snowflake className="w-3 h-3" />
                <span>Cold-Chain Biologics</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                <Truck className="w-3 h-3" />
                <span>Express 2-Hr</span>
              </span>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-bold text-slate-300">Legal Entity Name</label>
            <input
              type="text"
              required
              value={legalEntityName}
              onChange={(e) => setLegalEntityName(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300">Public Trade / Store Brand Name</label>
            <input
              type="text"
              required
              value={tradeName}
              onChange={(e) => setTradeName(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="font-bold text-slate-300">Official Dispensary Phone</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300">Official Official Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300">Dispensary Website</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-300">Headquarters Registered Address</label>
          <input
            type="text"
            required
            value={headquartersAddress}
            onChange={(e) => setHeadquartersAddress(e.target.value)}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-300">Dispensary Operating Hours & Shift Guidelines</label>
          <input
            type="text"
            required
            value={operatingHours}
            onChange={(e) => setOperatingHours(e.target.value)}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-300">About Dispensary / Clinical Specialization Overview</label>
          <textarea
            rows={3}
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white focus:outline-none focus:border-teal-500 leading-relaxed"
          />
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg shadow-teal-950/50"
          >
            <Save className="w-4 h-4" />
            <span>Save Pharmacy Profile</span>
          </button>
        </div>

      </form>

    </div>
  );
};
