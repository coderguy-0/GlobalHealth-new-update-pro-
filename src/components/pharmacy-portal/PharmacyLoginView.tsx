import React, { useState } from 'react';
import { 
  Building2, 
  Lock, 
  ShieldCheck, 
  KeyRound, 
  ArrowLeft, 
  ArrowRight, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { PharmacyStaffRole } from '../../types/pharmacyPortal';
import { PharmacyPortalService } from '../../services/pharmacyPortalStore';

interface PharmacyLoginViewProps {
  onLoginSuccess: (staffId: string) => void;
  onBackToLanding: () => void;
  onApplyClick: () => void;
}

export const PharmacyLoginView: React.FC<PharmacyLoginViewProps> = ({
  onLoginSuccess,
  onBackToLanding,
  onApplyClick
}) => {
  const [email, setEmail] = useState('dr.ramanathan@apexhealth.org');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<PharmacyStaffRole>('Pharmacy Owner');
  const [is2FAStage, setIs2FAStage] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('849201');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid registered pharmacy email.');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIs2FAStage(true);
    }, 700);
  };

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorCode || twoFactorCode.length < 6) {
      setErrorMsg('Please enter the 6-digit authentication token.');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Look up staff
      const staffList = PharmacyPortalService.getStaff();
      const matched = staffList.find(s => s.role === selectedRole) || staffList[0];
      PharmacyPortalService.logAction('Staff Login (2FA)', `Authenticated session as ${matched.name} (${matched.role})`, 'Auth');
      onLoginSuccess(matched.id);
    }, 800);
  };

  // Demo accounts helper
  const handleQuickFill = (role: PharmacyStaffRole, emailAddr: string) => {
    setSelectedRole(role);
    setEmail(emailAddr);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto space-y-6">
        
        {/* Back Link */}
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Partner Overview</span>
        </button>

        {/* Login Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Header */}
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 flex items-center justify-center font-black mx-auto shadow-lg shadow-teal-500/20">
              <Building2 className="w-6 h-6" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Authorized Pharmacy Partners Only</span>
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1.5">
                {is2FAStage ? 'Two-Factor Verification' : 'Pharmacy Partner Sign In'}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {is2FAStage
                  ? 'Enter the 6-digit TOTP code from your registered authenticator app.'
                  : 'Access your clinical dispensary dashboard, prescription review desk & inventory.'}
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!is2FAStage ? (
            <form onSubmit={handleInitialSubmit} className="space-y-4 text-xs">
              
              {/* Role Selector */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Operational Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as PharmacyStaffRole)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="Pharmacy Owner">Pharmacy Owner / Managing Director</option>
                  <option value="Pharmacist">Registered Pharmacist (R.Ph) — Prescription Desk</option>
                  <option value="Pharmacy Administrator">Pharmacy Administrator / General Manager</option>
                  <option value="Inventory Manager">Inventory & Batch Manager</option>
                  <option value="Order Manager">Order Fulfillment Manager</option>
                  <option value="Finance Manager">Finance & Settlement Manager</option>
                  <option value="Delivery Coordinator">Logistics & Delivery Coordinator</option>
                </select>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Registered Partner Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dispensary@apexhealth.org"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-300">Account Password</label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset instructions sent to your registered official email.')}
                    className="text-[11px] text-teal-400 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Remember Device Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="rounded text-teal-500 focus:ring-teal-400"
                />
                <span className="text-[11px] text-slate-400">Remember this workstation session (30 days)</span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs transition disabled:opacity-50 shadow-lg shadow-teal-950/50 cursor-pointer"
              >
                {isLoading ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <span>Proceed to Two-Factor Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick Demo Pre-fills */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                  Quick Demo Pre-Fill Roles:
                </div>
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <button
                    type="button"
                    onClick={() => handleQuickFill('Pharmacy Owner', 'dr.ramanathan@apexhealth.org')}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                  >
                    Dr. Ramanathan (Owner)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('Pharmacist', 'rohan.m@apexhealth.org')}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                  >
                    Rohan M. (Pharmacist)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('Inventory Manager', 'amitabh.inventory@apexhealth.org')}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                  >
                    Amitabh (Inventory)
                  </button>
                </div>
              </div>

            </form>
          ) : (
            <form onSubmit={handle2FASubmit} className="space-y-4 text-xs">
              
              <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[11px] flex items-center gap-2.5">
                <KeyRound className="w-4 h-4 text-teal-400 shrink-0" />
                <span>
                  Logging in as <strong>{selectedRole}</strong> ({email})
                </span>
              </div>

              <div className="space-y-1 text-center">
                <label className="font-bold text-slate-300 block">6-Digit Hardware/Authenticator Token</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="849201"
                  className="w-48 mx-auto text-center tracking-[0.5em] text-lg font-mono font-bold rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-teal-300 focus:outline-none focus:border-teal-500"
                />
                <p className="text-[10px] text-slate-500 pt-1">Demo code auto-filled for instant verification.</p>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIs2FAStage(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
                >
                  Change Email
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs transition disabled:opacity-50 cursor-pointer shadow-md shadow-teal-950/50"
                >
                  {isLoading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Authorize Session</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

          {/* Footer Apply CTA */}
          <div className="pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
            <span>New pharmacy organization? </span>
            <button
              onClick={onApplyClick}
              className="text-teal-400 hover:underline font-bold cursor-pointer"
            >
              Apply for Verification
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
