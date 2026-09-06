import React from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { useLocalization } from '../context/LocalizationContext';

interface MedicalDisclaimerProps {
  compact?: boolean;
}

export const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({ compact = false }) => {
  const { t } = useLocalization();

  if (compact) {
    return (
      <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs text-slate-700 font-medium">
        <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
        <span className="truncate">
          <strong className="font-semibold text-slate-900">Medical Disclaimer:</strong> For educational purposes only. Always consult a qualified medical professional for diagnosis or emergency treatment.
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-slate-800 shadow-xs">
      <AlertCircle className="mt-0.5 h-4 w-4 text-amber-600 shrink-0" />
      <div className="text-xs sm:text-sm leading-relaxed">
        <p className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-600" /> {t('disclaimer.badge')}
        </p>
        <p className="text-slate-600">
          {t('disclaimer.fullText')}
        </p>
      </div>
    </div>
  );
};
