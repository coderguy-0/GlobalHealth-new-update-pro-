import React, { useState } from 'react';
import { X, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useLocalization } from '../../context/LocalizationContext';

interface CommunityReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId?: string;
  postTitle?: string;
  onSubmitReport: (reason: string, details: string) => void;
}

export const CommunityReportModal: React.FC<CommunityReportModalProps> = ({
  isOpen,
  onClose,
  postId,
  postTitle,
  onSubmitReport
}) => {
  const { t } = useLocalization();
  const [selectedReason, setSelectedReason] = useState('Medical Misinformation / Unverified Cures');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const reasons = [
    'Medical Misinformation / Unverified Cures',
    'Dangerous Health / Medication Advice',
    'Commercial Supplement / Product Spam',
    'Harassment, Hostility or Bullying',
    'Impersonation of Licensed Healthcare Provider',
    'Patient Privacy / Personal Data Breach',
    'Other Guideline Violation'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport(selectedReason, details);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-rose-600">
            <ShieldAlert className="h-5 w-5" />
            <h3 className="text-base font-black text-slate-900">{t('Report Content to Clinicians')}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">{t('Report Submitted Successfully')}</h4>
            <p className="text-xs text-slate-500">{t('Our medical safety team and board moderators will review this within 1 hour.')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {postTitle && (
              <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-500">{t('Reporting')}:</span> <strong className="text-slate-800 line-clamp-1">{postTitle}</strong>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5">{t('Select Violation Reason')}</label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/40"
              >
                {reasons.map((r, idx) => (
                  <option key={idx} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5">{t('Additional Context (Optional)')}</label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={t('Explain why this post violates scientific accuracy or community safety...')}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/40"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                {t('Cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-xs transition cursor-pointer"
              >
                {t('Submit Report')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
