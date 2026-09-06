import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  UploadCloud, 
  FileText, 
  Lock, 
  AlertCircle, 
  HelpCircle,
  Clock,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { PharmacyPortalService } from '../../services/pharmacyPortalStore';

interface PharmacyApplicationWizardProps {
  onBackToLanding: () => void;
  onApplicationSubmitted?: (applicationId: string) => void;
  onCompleted?: (applicationId?: string) => void;
}

export const PharmacyApplicationWizard: React.FC<PharmacyApplicationWizardProps> = ({
  onBackToLanding,
  onApplicationSubmitted,
  onCompleted
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedAppId, setGeneratedAppId] = useState<string | null>(null);

  // Form State - Step 1
  const [legalEntityName, setLegalEntityName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [pharmacyType, setPharmacyType] = useState('Retail Pharmacy');
  const [ownershipType, setOwnershipType] = useState('Private Limited');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Delhi');
  const [pincode, setPincode] = useState('');
  const [totalBranches, setTotalBranches] = useState('1');
  const [operatingHours, setOperatingHours] = useState('08:00 AM - 11:00 PM');

  // Form State - Step 2
  const [drugLicenseNumber, setDrugLicenseNumber] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [pharmacistName, setPharmacistName] = useState('');
  const [pharmacistRegNo, setPharmacistRegNo] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: string }>({
    drugLicense: 'Apex_Drug_License_Form20B_21B.pdf',
    gstCert: 'GST_Registration_Certificate.pdf',
    pharmacistProof: 'Pharmacist_Council_Registration.pdf'
  });

  const [formErrors, setFormErrors] = useState<string[]>([]);

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];
    if (!legalEntityName.trim()) errors.push('Pharmacy Legal Entity Name is required');
    if (!tradeName.trim()) errors.push('Store / Trade Brand Name is required');
    if (!phone.trim()) errors.push('Primary Phone Number is required');
    if (!email.trim() || !email.includes('@')) errors.push('Valid Official Email is required');
    if (!address.trim()) errors.push('Premises Physical Address is required');
    if (!city.trim()) errors.push('City is required');
    if (!pincode.trim() || pincode.length < 6) errors.push('Valid 6-digit Postal PIN Code is required');

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors([]);
    setCurrentStep(2);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];
    if (!drugLicenseNumber.trim()) errors.push('Valid Drug License Number (Form 20B/21B) is required');
    if (!pharmacistName.trim()) errors.push('Principal Registered Pharmacist Name is required');
    if (!pharmacistRegNo.trim()) errors.push('Pharmacist State Council Registration Number is required');

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setFormErrors([]);

    setTimeout(() => {
      const newApp = PharmacyPortalService.submitApplication({
        legalEntityName,
        tradeName,
        pharmacyType,
        ownershipType,
        phone,
        email,
        address,
        city,
        state,
        pincode,
        drugLicenseNumber,
        pharmacistName,
        pharmacistRegNo,
        operatingHours,
        totalBranches: parseInt(totalBranches, 10) || 1
      });

      setGeneratedAppId(newApp.applicationId);
      setIsSubmitting(false);
      setCurrentStep(3);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Top Breadcrumb / Return */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Partner Overview</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Step {currentStep} of 3</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
          <div 
            className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full transition-all duration-300"
            style={{ width: currentStep === 1 ? '33%' : currentStep === 2 ? '66%' : '100%' }}
          />
        </div>

        {/* Card Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-bold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Pharmacy Partner Application</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {currentStep === 1 && 'Step 1: Pharmacy Legal & Operating Details'}
              {currentStep === 2 && 'Step 2: Regulatory Licensing & Pharmacist Credentials'}
              {currentStep === 3 && 'Application Submitted Successfully'}
            </h1>
            <p className="text-xs text-slate-400">
              {currentStep === 1 && 'Provide verified commercial registration details for your pharmacy organization.'}
              {currentStep === 2 && 'Upload statutory drug licenses and registered pharmacist documentation for background compliance audit.'}
              {currentStep === 3 && 'Your application has been registered with our medical compliance desk.'}
            </p>
          </div>

          {/* Validation Errors Box */}
          {formErrors.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-rose-200">
                <AlertCircle className="w-4 h-4" />
                <span>Please correct the following before continuing:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                {formErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 1: Pharmacy Details */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <form onSubmit={handleNextStep1} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Pharmacy Legal Entity Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Healthcare Dispensaries Pvt Ltd"
                    value={legalEntityName}
                    onChange={(e) => setLegalEntityName(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Store / Public Trade Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Central Clinical Dispensary"
                    value={tradeName}
                    onChange={(e) => setTradeName(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Pharmacy Type *</label>
                  <select
                    value={pharmacyType}
                    onChange={(e) => setPharmacyType(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Retail Pharmacy">Retail Pharmacy</option>
                    <option value="Hospital Pharmacy">Hospital / Clinical Dispensary</option>
                    <option value="Clinic Pharmacy">Clinic Pharmacy</option>
                    <option value="Specialty Pharmacy">Specialty Pharmacy (Biologics / Oncology)</option>
                    <option value="Chain Pharmacy">Chain / Multi-Branch Pharmacy</option>
                    <option value="Institutional Pharmacy">Institutional Pharmacy</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Ownership Structure *</label>
                  <select
                    value={ownershipType}
                    onChange={(e) => setOwnershipType(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Private Limited">Private Limited Company</option>
                    <option value="Partnership">Partnership / LLP</option>
                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                    <option value="Public Limited">Public Limited Company</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Primary Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98110 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Official Pharmacy Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="dispensary@yourpharmacy.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Premises Physical Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Plot / Shop No., Street, Complex or Hospital Wing"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. New Delhi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">State *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Delhi"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Postal PIN *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="110029"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Operating Hours</label>
                  <input
                    type="text"
                    value={operatingHours}
                    onChange={(e) => setOperatingHours(e.target.value)}
                    placeholder="24/7 or 08:00 AM - 11:00 PM"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Total Branches / Outlets</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={totalBranches}
                    onChange={(e) => setTotalBranches(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer"
                >
                  <span>Continue to Step 2 (Regulatory Verification)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: Regulatory Verification */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4 text-xs">
              
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  All regulatory licenses will be verified in real time against state drug control registers. Misrepresenting licenses is a punishable offense under the Drugs and Cosmetics Act.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Retail Drug License Number (Form 20B / 21B) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DL-ND-2024-88910"
                    value={drugLicenseNumber}
                    onChange={(e) => setDrugLicenseNumber(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">GSTIN Number (Optional/If Applicable)</label>
                  <input
                    type="text"
                    placeholder="e.g. 07AAACA9912K1Z5"
                    value={taxNumber}
                    onChange={(e) => setTaxNumber(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Principal Registered Pharmacist (R.Ph) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. / Mr. / Ms. Registered Pharmacist Name"
                    value={pharmacistName}
                    onChange={(e) => setPharmacistName(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Pharmacist Council Registration No. *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PCI-DL-184920"
                    value={pharmacistRegNo}
                    onChange={(e) => setPharmacistRegNo(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Uploads simulated box */}
              <div className="space-y-3 pt-2">
                <label className="font-bold text-slate-300 block">Uploaded Regulatory Documents</label>
                
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-teal-400" />
                      <div>
                        <div className="font-bold text-white">Form 20B/21B Drug License Document</div>
                        <div className="text-[10px] text-slate-500 font-mono">Drug_License_Certified_Copy.pdf (2.4 MB)</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      Ready to Upload
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-teal-400" />
                      <div>
                        <div className="font-bold text-white">Pharmacist Registration Certificate & Identity Proof</div>
                        <div className="text-[10px] text-slate-500 font-mono">Pharmacist_PCI_Registration.pdf (1.8 MB)</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      Ready to Upload
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
                >
                  Back to Step 1
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <span>Submit Application for Audit</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: Submission Confirmation */}
          {/* ========================================================================= */}
          {currentStep === 3 && (
            <div className="text-center py-6 space-y-6">
              
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-white">
                  Application Submitted for Regulatory Audit
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Your registration has been logged in the GlobalHealth Pharmacy Partner Registry. Our clinical compliance desk will review statutory licenses within 24–48 hours.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 max-w-md mx-auto space-y-2 text-left">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Application Reference ID:</span>
                  <span className="font-mono font-black text-teal-300 text-sm">{generatedAppId || 'APP-GH-99214'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Registered Trade Name:</span>
                  <span className="font-bold text-white">{tradeName || 'Apex Central Clinical Dispensary'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Initial Status:</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                    Under Compliance Review
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    const appId = generatedAppId || 'APP-GH-99214';
                    if (onApplicationSubmitted) {
                      onApplicationSubmitted(appId);
                    } else if (onCompleted) {
                      onCompleted(appId);
                    } else {
                      onBackToLanding();
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition cursor-pointer"
                >
                  Track Application Status
                </button>

                <button
                  onClick={onBackToLanding}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition cursor-pointer"
                >
                  Back to Partner Portal
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
