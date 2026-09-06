import React from 'react';
import { LogOut, ArrowRight, ShieldCheck, Home } from 'lucide-react';

interface LogoutSuccessViewProps {
  onLoginAgain: () => void;
  onReturnHome: () => void;
}

export const LogoutSuccessView: React.FC<LogoutSuccessViewProps> = ({
  onLoginAgain,
  onReturnHome
}) => {
  return (
    <div className="w-full text-left animate-in fade-in zoom-in-95 duration-200">
      <div className="h-14 w-14 rounded-2xl bg-medical-100 border border-medical-200 text-medical-700 flex items-center justify-center mb-4">
        <LogOut className="h-7 w-7" />
      </div>

      <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900">
        You Have Been Logged Out
      </h1>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">
        Your GlobalHealth session has ended securely. All local credentials and active session tokens have been cleared from this browser.
      </p>

      <div className="my-6 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-slate-800">
          <ShieldCheck className="h-4 w-4 text-medical-600" />
          <span>Session Termination Confirmed</span>
        </div>
        <p className="leading-relaxed">
          For shared computers or public terminals, we recommend closing all browser tabs to preserve your complete privacy.
        </p>
      </div>

      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={onLoginAgain}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-medical-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-medical-700 transition cursor-pointer"
        >
          <span>Log In Again</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onReturnHome}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
        >
          <Home className="h-4 w-4 text-slate-500" />
          <span>Back to GlobalHealth Home</span>
        </button>
      </div>
    </div>
  );
};
