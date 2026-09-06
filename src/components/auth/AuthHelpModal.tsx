import React from 'react';
import { X, ShieldCheck, HelpCircle, Lock, Smartphone, RefreshCw, UserCheck, AlertTriangle } from 'lucide-react';

interface AuthHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthHelpModal: React.FC<AuthHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-2xl text-left max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition cursor-pointer"
          aria-label="Close help"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Authentication Help & Security Guide</h2>
            <p className="text-xs text-slate-500">GlobalHealth Public User Security Policy</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-600">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Lock className="h-4 w-4 text-emerald-600" />
              <span>Password Security & Recovery</span>
            </div>
            <p className="leading-relaxed">
              If you forget your password, enter your registered email address or mobile number on the Forgot Password screen. For privacy protection, recovery instructions are dispatched without disclosing whether an account is present.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Smartphone className="h-4 w-4 text-emerald-600" />
              <span>6-Digit Verification Codes</span>
            </div>
            <p className="leading-relaxed">
              When creating an account or updating critical credentials, GlobalHealth dispatches a 6-digit one-time security code. Codes expire after 15 minutes. A new code can be requested every 45 seconds.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <UserCheck className="h-4 w-4 text-emerald-600" />
              <span>Strict Public User Role Separation</span>
            </div>
            <p className="leading-relaxed">
              This authentication system is strictly for public visitors and patients. Professional portals (Doctor Clinical Workspace, Hospital Administration, Enterprise Staff) require separate authority-vetted credentials and cannot be accessed via public accounts.
            </p>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
            <div className="flex items-center gap-2 font-bold text-emerald-950">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Healthcare Data Privacy Principle</span>
            </div>
            <p className="text-emerald-900 leading-relaxed">
              We never require sensitive medical histories, disease diagnoses, or prescription data simply to create an account. Medical records remain encrypted in your private personal vault.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
