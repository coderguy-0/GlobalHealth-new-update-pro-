import React from 'react';
import { X, ShieldCheck, AlertTriangle, PhoneCall, CheckCircle2, HeartHandshake } from 'lucide-react';
import { useLocalization } from '../../context/LocalizationContext';

interface CommunitySafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommunitySafetyModal: React.FC<CommunitySafetyModalProps> = ({
  isOpen,
  onClose
}) => {
  const { t } = useLocalization();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-emerald-700">
            <ShieldCheck className="h-5 w-5" />
            <h3 className="text-base font-black text-slate-900">{t('Community Safety & Medical Guidelines')}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Emergency Alert Banner */}
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
            <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{t('Immediate Medical Emergency Notice')}</span>
          </div>
          <p className="text-xs text-rose-900 leading-relaxed">
            {t('This community is designed for peer education and informational discussions. It does NOT replace professional medical diagnosis, emergency triage, or doctor-patient relationships.')}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-center text-xs font-bold">
            <div className="bg-white p-2 rounded-xl border border-rose-200 text-rose-800">
              🚨 {t('US & Canada')}: 911
            </div>
            <div className="bg-white p-2 rounded-xl border border-rose-200 text-rose-800">
              🚨 {t('Europe & UK')}: 112 / 999
            </div>
            <div className="bg-white p-2 rounded-xl border border-rose-200 text-rose-800">
              🧠 {t('Crisis Lifeline')}: 988
            </div>
          </div>
        </div>

        {/* Core Principles */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{t('Our Community Pillars')}</h4>
          
          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>{t('Evidence-Based Discussions')}:</strong> {t('Cite peer-reviewed journals (PubMed, Lancet, NEJM) when asserting clinical mechanisms or therapies.')}</span>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <HeartHandshake className="h-4 w-4 text-violet-600 shrink-0 mt-0.5" />
              <span><strong>{t('Compassion & Empathy')}:</strong> {t('Health journeys can be vulnerable. Treat every member with unconditional respect and encouragement.')}</span>
            </div>

            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <span><strong>{t('Zero Tolerance for Misinformation')}:</strong> {t('Commercial snake oils, miracle cures, and unverified medical sales are permanently banned.')}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition cursor-pointer"
          >
            {t('I Understand & Agree')}
          </button>
        </div>
      </div>
    </div>
  );
};
