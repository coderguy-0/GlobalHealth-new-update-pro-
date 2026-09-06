import React, { useState, useMemo } from 'react';
import { Search, Globe, Check, X, Sparkles, Compass, Layers, ArrowRight } from 'lucide-react';
import { ALL_100_LANGUAGES, LanguageConfig } from '../data/languages100';
import { useLocalization } from '../context/LocalizationContext';

export const LanguageModal: React.FC = () => {
  const { currentLanguage, setLanguage, isLanguageModalOpen, setIsLanguageModalOpen, t, isRTL } = useLocalization();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'popular' | 'all' | 'regions'>('popular');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  const filteredLanguages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ALL_100_LANGUAGES.filter((lang) => {
      const matchSearch =
        !q ||
        lang.name.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q) ||
        lang.script.toLowerCase().includes(q) ||
        lang.region.toLowerCase().includes(q);

      if (!matchSearch) return false;

      if (activeTab === 'popular') {
        return lang.popular === true || q.length > 0;
      }

      if (activeTab === 'regions' && selectedRegion !== 'All') {
        return lang.region === selectedRegion;
      }

      return true;
    });
  }, [searchQuery, activeTab, selectedRegion]);

  const regions = ['All', 'Asia', 'Europe', 'Middle East', 'Americas', 'Africa'];

  if (!isLanguageModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-600 text-white shadow-sm">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {t('langModal.title')}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {t('langModal.autoTranslateNote')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLanguageModalOpen(false)}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Bar & Filter Tabs */}
        <div className="p-4 sm:px-6 border-b border-slate-100 space-y-3 bg-white">
          <div className="relative">
            <Search className={`absolute top-3 ${isRTL ? 'right-3.5' : 'left-3.5'} h-5 w-5 text-slate-400`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('langModal.searchPlaceholder')}
              className={`w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-2.5 ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'} text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition`}
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute top-2.5 ${isRTL ? 'left-3' : 'right-3'} rounded-lg bg-slate-200 px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-300`}
              >
                {t('common.clear')}
              </button>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('popular')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'popular'
                    ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('langModal.popularTab')}
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'all'
                    ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('langModal.allTab')} ({ALL_100_LANGUAGES.length})
              </button>
              <button
                onClick={() => setActiveTab('regions')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'regions'
                    ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('langModal.regionsTab')}
              </button>
            </div>

            {activeTab === 'regions' && (
              <div className="flex items-center gap-1 overflow-x-auto text-xs scrollbar-none">
                {regions.map((reg) => (
                  <button
                    key={reg}
                    onClick={() => setSelectedRegion(reg)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition ${
                      selectedRegion === reg
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {t(reg)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Language Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          {filteredLanguages.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <p className="text-sm font-semibold">{t('hero.noResults')} "{searchQuery}"</p>
              <p className="text-xs">{t('Try searching by English name, native script, or country.')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredLanguages.map((lang) => {
                const isSelected = lang.code === currentLanguage;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLanguageModalOpen(false);
                    }}
                    className={`group relative flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all duration-150 ${
                      isSelected
                        ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-white border-slate-200/90 hover:border-emerald-300 hover:bg-emerald-50/30 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl shrink-0">{lang.flag}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-slate-900 truncate block">
                            {lang.nativeName}
                          </span>
                          {lang.direction === 'rtl' && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-900">
                              RTL
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <span className="truncate">{lang.name}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[10px] text-slate-400 truncate">{t(lang.script)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 ml-2">
                      {isSelected ? (
                        <div className="grid h-6 w-6 place-items-center rounded-full bg-emerald-600 text-white shadow-xs">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="grid h-6 w-6 place-items-center rounded-full border border-slate-200 group-hover:border-emerald-400 group-hover:bg-emerald-100 text-transparent group-hover:text-emerald-700 transition">
                          <Check className="h-3 w-3 stroke-[2]" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">{t('Current selection:')}</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {ALL_100_LANGUAGES.find(l => l.code === currentLanguage)?.flag} {ALL_100_LANGUAGES.find(l => l.code === currentLanguage)?.nativeName} ({ALL_100_LANGUAGES.find(l => l.code === currentLanguage)?.name})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLanguageModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
            >
              {t('common.done')} / {t('common.apply')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
