import React, { useEffect } from 'react';
import { PhoneCall, X } from 'lucide-react';
import { useLocalization } from '../context/LocalizationContext';

interface EmergencyModalProps {
  open: boolean;
  onClose: () => void;
}

/** Local emergency numbers modal — shared by the Navbar and the Explore page. */
export const EmergencyModal: React.FC<EmergencyModalProps> = ({ open, onClose }) => {
  const { t } = useLocalization();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-title"
    >
      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-rose-600">
            <PhoneCall className="h-5 w-5" />
            <h3 id="emergency-title" className="text-base font-bold text-slate-900">{t('emergency.title')}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-4 text-xs leading-relaxed text-slate-600">{t('emergency.description')}</p>
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between rounded-2xl border border-rose-100 bg-rose-50 p-3 font-medium text-rose-950">
            <span>🇺🇸 {t('emergency.usCanada')}</span>
            <a href="tel:911" className="text-sm font-bold text-rose-700 hover:underline">911</a>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-rose-100 bg-rose-50 p-3 font-medium text-rose-950">
            <span>🇪🇺 {t('emergency.euUk')}</span>
            <a href="tel:112" className="text-sm font-bold text-rose-700 hover:underline">112 / 999</a>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-rose-100 bg-rose-50 p-3 font-medium text-rose-950">
            <span>🇮🇳 {t('emergency.india')}</span>
            <a href="tel:112" className="text-sm font-bold text-rose-700 hover:underline">112 / 102</a>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50 p-3 font-medium text-emerald-950">
            <span>🧠 {t('emergency.crisisLine')}</span>
            <a href="tel:988" className="text-sm font-bold text-emerald-700 hover:underline">988 (Call/Text)</a>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
        >
          {t('emergency.closeBtn')}
        </button>
      </div>
    </div>
  );
};
