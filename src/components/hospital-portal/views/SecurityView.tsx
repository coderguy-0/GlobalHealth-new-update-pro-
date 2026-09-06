import React, { useState } from 'react';
import {
  Lock,
  KeyRound,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  QrCode
} from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';

export const SecurityView: React.FC = () => {
  const { currentUser, currentRole, verify2FA, toggleUser2FA, twoFactorVerified } = useHospitalPortal();
  const [totpCode, setTotpCode] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (verify2FA(totpCode)) {
      setMessage({ text: '2FA Passcode verified! Session security clearance refreshed.', type: 'success' });
      setTotpCode('');
    } else {
      setMessage({ text: 'Invalid 6-digit TOTP code. Try demo code "849201"', type: 'error' });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCEBE4] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#17221E]">Security Center & 2FA TOTP Protection</h1>
          <p className="text-xs text-[#52635C]">
            Time-Based One-Time Password (TOTP) Hardware Tokens, Session Encryption & Active Session Revocation
          </p>
        </div>

        <span className="flex items-center gap-1.5 text-xs font-bold text-[#008F68] bg-[#E8F7F1] px-3 py-1.5 rounded-xl border border-[#BDE4D5]">
          <ShieldCheck className="h-4 w-4" />
          <span>2FA Protected Session</span>
        </span>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-[#E8F7F1] border border-[#BDE4D5] text-[#008F68]'
              : 'bg-[#FFF1F1] border border-[#F2CCCC] text-[#C53939]'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* 2FA Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: 2FA Simulator */}
        <div className="p-6 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#DCEBE4]">
            <KeyRound className="h-5 w-5 text-[#008F68]" />
            <h2 className="text-base font-bold text-[#17221E]">2-Factor Authenticator Challenge</h2>
          </div>

          <p className="text-xs text-[#52635C] leading-relaxed">
            Enter the current 6-digit rolling authenticator token from your hardware key or Google Authenticator app.
          </p>

          <div className="p-3 rounded-xl bg-[#F6FBF8] border border-[#DCEBE4] flex items-center justify-between">
            <span className="text-xs font-bold text-[#52635C]">Demo Sandbox TOTP:</span>
            <span className="font-mono font-bold text-sm text-[#008F68] bg-white px-2 py-0.5 rounded border border-[#BDE4D5]">
              849201
            </span>
          </div>

          <form onSubmit={handleVerify} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Enter 6-Digit TOTP Code</label>
              <input
                type="text"
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                placeholder="849201"
                className="w-full px-4 py-2 text-center text-lg tracking-widest font-mono font-bold bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#008F68] hover:bg-[#007A59] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Verify & Refresh Key</span>
            </button>
          </form>
        </div>

        {/* Right: Enforce Policy */}
        <div className="p-6 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#DCEBE4]">
            <Smartphone className="h-5 w-5 text-[#287EA8]" />
            <h2 className="text-base font-bold text-[#17221E]">Institutional 2FA Policy</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[#F6FBF8] border border-[#DCEBE4] space-y-1">
              <span className="text-xs font-bold text-[#17221E] block">Personnel Profile</span>
              <p className="text-[#52635C]">{currentUser?.name} ({currentRole})</p>
              <p className="text-[10px] text-[#687971] font-mono">ID: {currentUser?.id}</p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#DCEBE4]">
              <div>
                <span className="font-bold text-[#17221E] block">Mandatory 2FA Policy</span>
                <span className="text-[11px] text-[#52635C]">Required for Level 3+ RBAC actions</span>
              </div>
              <input
                type="checkbox"
                checked={currentUser?.twoFactorEnabled || true}
                onChange={(e) => toggleUser2FA(e.target.checked)}
                className="h-4 w-4 rounded text-[#008F68] focus:ring-[#008F68] cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#E8F7F1] border border-[#BDE4D5] text-[#008F68] text-xs">
              ✓ Hardware Key & TOTP support enabled for this workstation terminal.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
