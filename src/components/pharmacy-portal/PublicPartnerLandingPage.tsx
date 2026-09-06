import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  FileCheck, 
  Zap, 
  Truck, 
  Activity, 
  DollarSign, 
  FileText, 
  Users, 
  Clock, 
  HelpCircle, 
  PhoneCall, 
  Search, 
  ChevronRight, 
  Sparkles,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

interface PublicPartnerLandingPageProps {
  onLoginClick: () => void;
  onApplyClick: () => void;
  onTrackClick: () => void;
  onBackToUserSite?: () => void;
  onReturnToMainApp?: () => void;
}

export const PublicPartnerLandingPage: React.FC<PublicPartnerLandingPageProps> = ({
  onLoginClick,
  onApplyClick,
  onTrackClick,
  onBackToUserSite,
  onReturnToMainApp
}) => {
  const handleReturn = () => {
    if (onReturnToMainApp) onReturnToMainApp();
    else if (onBackToUserSite) onBackToUserSite();
  };
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      
      {/* Top Professional Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Left */}
          <div className="flex items-center gap-3">
            <button 
              onClick={handleReturn}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer flex items-center gap-1 text-xs font-bold"
              title="Return to Patient Marketplace"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Patient Site</span>
            </button>

            <div className="h-5 w-px bg-slate-700" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 flex items-center justify-center font-black text-sm shadow-md shadow-teal-500/20">
                <Building2 className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-sm sm:text-base font-black text-white tracking-tight">GlobalHealth</span>
                <span className="ml-1.5 text-xs font-bold text-teal-400 uppercase tracking-wider">Pharmacy Partner</span>
              </div>
            </div>
          </div>

          {/* Quick Nav & Action Right */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onTrackClick}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Track Application</span>
            </button>

            <button
              onClick={onLoginClick}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Partner Sign In</span>
            </button>

            <button
              onClick={onApplyClick}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs transition shadow-md shadow-teal-950/50 cursor-pointer"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Hero Container */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 lg:px-8 border-b border-slate-800">
        
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-xs font-bold text-teal-300">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Official Partner Portal • Powering Trusted Pharmacy Care</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Verified Pharmacies. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
              Safer Healthcare Operations.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Connect your licensed dispensary or pharmacy chain with patients seeking authentic medicines, verified doctor prescription fulfillment, express cold-chain deliveries, and direct digital consultations.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onApplyClick}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-sm transition shadow-xl shadow-teal-950/60 cursor-pointer"
            >
              <span>Apply as Pharmacy Partner</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700 transition cursor-pointer"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Authorized Partner Login</span>
            </button>

            <button
              onClick={onTrackClick}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-bold text-sm border border-slate-800 transition cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Check Application Status</span>
            </button>
          </div>

          {/* Trust Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 border-t border-slate-800/80 max-w-4xl mx-auto text-left">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-xl sm:text-2xl font-black text-teal-400">100%</div>
              <div className="text-xs text-slate-400 mt-0.5">Licensed & Inspected Partners</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">&lt; 15 Mins</div>
              <div className="text-xs text-slate-400 mt-0.5">Avg Rx Verification SLA</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-xl sm:text-2xl font-black text-blue-400">T+1 Day</div>
              <div className="text-xs text-slate-400 mt-0.5">Automated Bank Settlement</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-xl sm:text-2xl font-black text-amber-400">0%</div>
              <div className="text-xs text-slate-400 mt-0.5">Toleration for Counterfeit Drugs</div>
            </div>
          </div>

        </div>
      </section>

      {/* Section 1: Why Partner With GlobalHealth? */}
      <section className="py-16 px-4 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Enterprise Operations Built Specifically for Pharmacists
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A regulated, clinical platform designed for healthcare professionals — not an ordinary e-commerce seller portal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-teal-500/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Digital Prescription Workflows</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive verified electronic doctor prescriptions with high-resolution document viewers, automated OCR composition checks, dosage guidance, and registered pharmacist digital sign-off.
            </p>
            <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800/80 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Doctor license registry verification</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Pharmacist clarification messenger</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-teal-500/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Real-Time Inventory & Batch Tracking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Manage live stock across multiple branches, track manufacturing batches, set auto-reorder levels, and benefit from automatic quarantine for expiring or recalled drugs.
            </p>
            <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800/80 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Expiry alerts at 180d, 90d, 30d</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Barcode scanning & CSV bulk import</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-teal-500/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Express Delivery & Cold-Chain Logistics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Integrated delivery partner fleets with temperature-controlled insulated pouches for insulin, vaccines, and biologics, with real-time GPS tracking and OTP customer confirmation.
            </p>
            <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800/80 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>2-Hour express dispatch routing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>In-store pickup counter verification</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Section 2: Regulatory Verification Standards */}
      <section className="py-14 px-4 lg:px-8 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Mandatory Platform Policy</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Required Regulatory & Verification Documents
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                GlobalHealth permits operations strictly for pharmacies with active state licenses and registered pharmacists.
              </p>
            </div>

            <button
              onClick={onApplyClick}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition cursor-pointer"
            >
              Start Application
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="font-bold text-white text-xs flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center text-[10px] font-mono">1</span>
                <span>Retail Drug License</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Form 20B & 21B issued by the State Drugs Control Department with authorized schedules.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="font-bold text-white text-xs flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center text-[10px] font-mono">2</span>
                <span>Pharmacist Council Reg</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Active registration certificate (R.Ph) with State Pharmacy Council & identity proof.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="font-bold text-white text-xs flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center text-[10px] font-mono">3</span>
                <span>GST & Business Setup</span>
              </div>
              <p className="text-[11px] text-slate-400">
                GSTIN Certificate, PAN, Certificate of Incorporation / Partnership Deed & bank proof.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="font-bold text-white text-xs flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center text-[10px] font-mono">4</span>
                <span>Premises Validation</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Proof of commercial possession, refrigerator / cold storage temperature log, & fire NOC.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Section 3: Step-by-Step Onboarding Journey */}
      <section className="py-16 px-4 lg:px-8 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            How Pharmacy Partner Onboarding Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            From initial digital registration to your first prescription dispatch in under 48 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 font-mono font-black text-sm flex items-center justify-center mx-auto">
              01
            </div>
            <h4 className="font-bold text-white text-xs">Submit Application</h4>
            <p className="text-[11px] text-slate-400">
              Fill pharmacy legal info, branch locations, operating hours, and contact details.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 font-mono font-black text-sm flex items-center justify-center mx-auto">
              02
            </div>
            <h4 className="font-bold text-white text-xs">Upload Credentials</h4>
            <p className="text-[11px] text-slate-400">
              Provide Form 20B/21B drug license, GST, registered pharmacist documents, and bank proofs.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 font-mono font-black text-sm flex items-center justify-center mx-auto">
              03
            </div>
            <h4 className="font-bold text-white text-xs">Compliance Verification</h4>
            <p className="text-[11px] text-slate-400">
              Our clinical compliance team validates license numbers against state databases.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-black text-sm flex items-center justify-center mx-auto">
              04
            </div>
            <h4 className="font-bold text-white text-xs">Go Live & Dispense</h4>
            <p className="text-[11px] text-slate-400">
              Receive verified badge, sync medicine catalog, receive prescription orders, and earn.
            </p>
          </div>

        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-950 to-slate-900 border border-teal-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h3 className="text-base font-bold text-white">Ready to connect your pharmacy?</h3>
            <p className="text-xs text-slate-300 mt-0.5">Applications take only 5 minutes to submit.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onApplyClick}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer"
            >
              Apply as Pharmacy Partner
            </button>
            <button
              onClick={onLoginClick}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition cursor-pointer"
            >
              Partner Sign In
            </button>
          </div>
        </div>

      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-800 text-center text-xs text-slate-500 space-y-2">
        <p>GlobalHealth Pharmacy Partner Portal • Regulated Healthcare Enterprise Operating Environment</p>
        <p className="text-[11px] text-slate-600">All dispensing operations subject to Pharmacy Act 1948 & Drugs and Cosmetics Act 1940.</p>
      </footer>

    </div>
  );
};
