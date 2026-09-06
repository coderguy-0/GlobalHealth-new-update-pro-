import React from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLocalization } from '../context/LocalizationContext';

interface LanguageSelectorProps {
  /** Compact variant shows only the globe + flag (used in tight header layouts). */
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ compact = false }) => {
  const { languageOption, setIsLanguageModalOpen, t } = useLocalization();

  return (
    <button
      onClick={() => setIsLanguageModalOpen(true)}
      className={`flex items-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:border-medical-200 hover:bg-slate-50 focus:outline-hidden group ${
        compact ? 'px-2.5 py-2' : 'px-3 py-1.5 shadow-2xs'
      }`}
      title={t('Change Language & Script (100 World Languages)')}
      aria-label={t('Change Language & Script')}
    >
      <Globe className={`h-4 w-4 text-medical-600 group-hover:scale-105 transition ${compact ? '' : 'text-emerald-600'}`} />
      {!compact && (
        <>
          <span className="flex items-center gap-1.5">
            <span className="text-sm">{languageOption.flag}</span>
            <span className="hidden text-slate-900 font-bold max-w-24 truncate sm:block">{languageOption.nativeName}</span>
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition" />
        </>
      )}
    </button>
  );
};
