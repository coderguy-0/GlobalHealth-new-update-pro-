import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Shield,
  Stethoscope,
  Fingerprint,
  KeyRound,
  AlertCircle,
  LogOut,
  CheckCircle2
} from 'lucide-react';
import { DoctorProfile } from '../../../types/medauth';

interface LockSessionModalProps {
  doctor: DoctorProfile;
  isOpen: boolean;
  onUnlock: () => void;
  onFullLogout: () => void;
}

export const LockSessionModal: React.FC<LockSessionModalProps> = ({
  doctor,
  isOpen,
  onUnlock,
  onFullLogout
}) => {
  const [pin, setPin] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'pin' | 'password' | 'biometric'>('pin');
  const [errorMsg, setErrorMsg] = useState('');
  const [isBiometricVerifying, setIsBiometricVerifying] = useState(false);

  if (!isOpen) return null;

  const handlePinSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // Accept standard default PIN 1234 or any 4 digit entered
    if (pin.length >= 4) {
      setErrorMsg('');
      setPin('');
      onUnlock();
    } else {
      setErrorMsg('Please enter a valid 4-digit practitioner PIN.');
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length > 0) {
      setErrorMsg('');
      setPassword('');
      onUnlock();
    } else {
      setErrorMsg('Please enter your physician account password.');
    }
  };

  const handleBiometricAuth = () => {
    setIsBiometricVerifying(true);
    setErrorMsg('');
    setTimeout(() => {
      setIsBiometricVerifying(false);
      onUnlock();
    }, 1000);
  };

  const handlePinDigit = (digit: string) => {
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        setTimeout(() => {
          onUnlock();
          setPin('');
        }, 300);
      }
    }
  };

  const handlePinBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden p-7 text-center">
        
        {/* Lock Shield Icon */}
        <div className="mx-auto w-16 h-16 rounded-3xl bg-slate-900 text-emerald-400 flex items-center justify-center shadow-lg mb-4">
          <Lock className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold mb-2">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Workstation Locked • HIPAA Protected</span>
        </div>

        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          {doctor.fullName}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {doctor.post} • NPI: {doctor.npiNumber}
        </p>

        {/* Tab switcher for unlock mode */}
        <div className="flex bg-slate-100 p-1 rounded-xl my-5">
          <button
            type="button"
            onClick={() => { setAuthMode('pin'); setErrorMsg(''); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              authMode === 'pin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Quick PIN
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('biometric'); setErrorMsg(''); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              authMode === 'biometric' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Biometric
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('password'); setErrorMsg(''); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              authMode === 'password' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Password
          </button>
        </div>

        {/* Mode 1: Quick PIN */}
        {authMode === 'pin' && (
          <div className="space-y-4">
            {/* PIN Dots Display */}
            <div className="flex justify-center items-center gap-3 py-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full transition-all ${
                    pin.length > i
                      ? 'bg-emerald-600 scale-110'
                      : 'bg-slate-200 border border-slate-300'
                  }`}
                />
              ))}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handlePinDigit(num)}
                  className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 text-lg font-bold text-slate-900 transition flex items-center justify-center cursor-pointer shadow-2xs"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPin('')}
                className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-500 transition flex items-center justify-center cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handlePinDigit('0')}
                className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 text-lg font-bold text-slate-900 transition flex items-center justify-center cursor-pointer shadow-2xs"
              >
                0
              </button>
              <button
                type="button"
                onClick={handlePinBackspace}
                className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-600 transition flex items-center justify-center cursor-pointer"
              >
                ⌫
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              Demo PIN: <strong className="text-slate-700">1234</strong> (or any 4 digits)
            </p>
          </div>
        )}

        {/* Mode 2: Biometric */}
        {authMode === 'biometric' && (
          <div className="py-6 space-y-4">
            <button
              onClick={handleBiometricAuth}
              disabled={isBiometricVerifying}
              className="mx-auto w-24 h-24 rounded-full bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-500/40 text-emerald-700 flex flex-col items-center justify-center transition cursor-pointer shadow-md active:scale-95 group"
            >
              <Fingerprint className={`w-12 h-12 ${isBiometricVerifying ? 'animate-pulse text-emerald-600' : 'group-hover:scale-110 transition-transform'}`} />
            </button>
            <p className="text-xs text-slate-600 font-medium">
              {isBiometricVerifying ? 'Verifying TouchID / WebAuthn token...' : 'Click fingerprint scanner to unlock session'}
            </p>
          </div>
        )}

        {/* Mode 3: Password */}
        {authMode === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-3 py-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter physician password"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
              autoFocus
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Unlock Doctor Workspace</span>
            </button>
          </form>
        )}

        {errorMsg && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Logout / Switch Doctor Button */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">Unsaved clinical drafts are preserved</span>
          <button
            onClick={onFullLogout}
            className="flex items-center gap-1 text-slate-500 hover:text-rose-600 font-semibold cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Completely</span>
          </button>
        </div>

      </div>
    </div>
  );
};
