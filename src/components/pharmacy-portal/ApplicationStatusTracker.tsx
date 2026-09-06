import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Lock, 
  KeyRound,
  ArrowRight
} from 'lucide-react';
import { PharmacyPortalService, PharmacyApplicationRecord } from '../../services/pharmacyPortalStore';

interface ApplicationStatusTrackerProps {
  initialAppId?: string;
  onBackToLanding: () => void;
  onGoToLogin?: () => void;
  onOpenLogin?: () => void;
}

export const ApplicationStatusTracker: React.FC<ApplicationStatusTrackerProps> = ({
  initialAppId,
  onBackToLanding,
  onGoToLogin,
  onOpenLogin
}) => {
  const [appIdInput, setAppIdInput] = useState(initialAppId || 'APP-GH-99214');
  const [emailInput, setEmailInput] = useState('dispensary@apexhealth.org');
  const [otpInput, setOtpInput] = useState('492104');
  const [isOtpVerified, setIsOtpVerified] = useState(true);
  const [searchedRecord, setSearchedRecord] = useState<PharmacyApplicationRecord | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const apps = PharmacyPortalService.getApplications();
    const found = apps.find(a => 
      a.applicationId.toLowerCase() === appIdInput.trim().toLowerCase() ||
      a.email.toLowerCase() === emailInput.trim().toLowerCase()
    );

    if (found) {
      setSearchedRecord(found);
    } else {
      setSearchedRecord({
        applicationId: appIdInput,
        legalEntityName: 'Sample Registered Pharmacy Organization',
        tradeName: 'City Healthcare Dispensary',
        pharmacyType: 'Retail Pharmacy',
        ownershipType: 'Private Limited',
        phone: '+91 98110 •••••',
        email: emailInput,
        address: 'Medical Enclave, Ring Road',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110029',
        drugLicenseNumber: 'DL-ND-2025-0012',
        pharmacistName: 'Dr. Anand Kumar, R.Ph',
        pharmacistRegNo: 'PCI-DL-19401',
        operatingHours: '24 Hours',
        totalBranches: 1,
        submittedAt: 'Today',
        status: 'Under Review',
        statusNotes: 'Statutory documents undergoing background verification.',
        otpVerified: true
      });
    }
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Back Link */}
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Partner Overview</span>
        </button>

        {/* Card Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-bold">
              <Search className="w-3.5 h-3.5" />
              <span>Application Verification Tracker</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Track Pharmacy Partner Application
            </h1>
            <p className="text-xs text-slate-400">
              Enter your Application Reference ID and registered credentials to view live regulatory audit milestones.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Application Reference ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. APP-GH-99214"
                  value={appIdInput}
                  onChange={(e) => setAppIdInput(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Registered Official Email</label>
                <input
                  type="email"
                  required
                  placeholder="dispensary@apexhealth.org"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-300 flex items-center justify-between">
                  <span>Security OTP Code</span>
                  <span className="text-[10px] text-teal-400 font-mono">OTP Sent to Email</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="492104"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Check Verification Status</span>
                </button>
              </div>
            </div>
          </form>

          {/* Result Display */}
          {hasSearched && searchedRecord && (
            <div className="pt-4 border-t border-slate-800 space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <div className="text-xs text-slate-400">Application Reference ID</div>
                  <div className="font-mono font-black text-teal-300 text-base">{searchedRecord.applicationId}</div>
                  <div className="font-bold text-white text-xs mt-0.5">{searchedRecord.tradeName}</div>
                </div>

                <div className="flex flex-col items-start sm:items-end">
                  <span className="text-[11px] text-slate-400">Current Status</span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mt-1 ${
                    searchedRecord.status === 'Approved'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : searchedRecord.status === 'Under Review'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  }`}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{searchedRecord.status}</span>
                  </span>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Verification Milestones
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-white">1. Initial Application Form & Basic Info</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">COMPLETED</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-white">2. Drug License Form 20B/21B Validity Audit</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">VERIFIED</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-white">3. Registered Pharmacist Council Credentials</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">VERIFIED</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {searchedRecord.status === 'Approved' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-400" />
                      )}
                      <span className="font-bold text-white">4. Commercial Premises & Cold Storage Clearance</span>
                    </div>
                    <span className={`text-[10px] font-mono font-bold ${
                      searchedRecord.status === 'Approved' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {searchedRecord.status === 'Approved' ? 'COMPLETED' : 'IN PROGRESS'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {searchedRecord.status === 'Approved' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-500" />
                      )}
                      <span className="font-bold text-white">5. Account Activation & Catalog Sync</span>
                    </div>
                    <span className={`text-[10px] font-mono font-bold ${
                      searchedRecord.status === 'Approved' ? 'text-emerald-400' : 'text-slate-500'
                    }`}>
                      {searchedRecord.status === 'Approved' ? 'ACTIVE' : 'PENDING'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              {searchedRecord.status === 'Approved' ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4">
                  <div className="text-xs text-emerald-300">
                    <div className="font-bold">Your Pharmacy Partner Account is Active!</div>
                    <div className="text-[11px] text-emerald-400/80">Log in to manage orders, catalog, and inventory.</div>
                  </div>
                  <button
                    onClick={() => {
                      if (onGoToLogin) onGoToLogin();
                      else if (onOpenLogin) onOpenLogin();
                      else onBackToLanding();
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer"
                  >
                    <span>Proceed to Login</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
                  <div className="font-bold text-slate-200">Compliance Officer Notes:</div>
                  <p className="text-[11px]">{searchedRecord.statusNotes}</p>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
