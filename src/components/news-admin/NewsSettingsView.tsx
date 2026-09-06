import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Clock,
  Globe2,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  Info
} from 'lucide-react';

interface NewsSettingsViewProps {
  onResetAllData: () => void;
  onExportJson: () => void;
  onImportJson: () => void;
}

export const NewsSettingsView: React.FC<NewsSettingsViewProps> = ({
  onResetAllData,
  onExportJson,
  onImportJson
}) => {
  const [defaultDisclaimer, setDefaultDisclaimer] = useState(
    'This article is synthesized from peer-reviewed clinical research and does not replace individual stroke risk management from your attending physician.'
  );
  const [breakingExpiryHours, setBreakingExpiryHours] = useState(48);
  const [autoSlugFormat, setAutoSlugFormat] = useState('kebab-case');
  const [requireMedicalSignoff, setRequireMedicalSignoff] = useState(true);
  const [savedToast, setSavedToast] = useState(false);

  const handleSaveSettings = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
          <Settings className="h-4 w-4" /> Global Editorial Configurations
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          News Management Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure default medical disclaimers, breaking news timeouts, slug generation, and data backups.
        </p>
      </div>

      {savedToast && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Editorial CMS settings saved successfully.</span>
        </div>
      )}

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* 1. Medical Governance */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Shield className="h-4 w-4 text-teal-600" /> Medical Review & Quality Assurance
          </h2>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-slate-50 border border-slate-200">
              <input
                type="checkbox"
                checked={requireMedicalSignoff}
                onChange={(e) => setRequireMedicalSignoff(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
              />
              <div>
                <div className="font-bold text-slate-800">Require MD / Clinical Reviewer sign-off before publishing</div>
                <div className="text-[11px] text-slate-500">
                  Prevents non-medical staff from publishing clinical breakthrough content directly to the public.
                </div>
              </div>
            </label>

            <div className="space-y-1 pt-1">
              <label className="font-bold text-slate-800">Default Medical Disclaimer Text</label>
              <textarea
                rows={3}
                value={defaultDisclaimer}
                onChange={(e) => setDefaultDisclaimer(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* 2. Broadcast & Automation */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-600" /> Broadcast Timing & Placements
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-800">Default Breaking News Auto-Expiry (Hours)</label>
              <input
                type="number"
                min={1}
                max={168}
                value={breakingExpiryHours}
                onChange={(e) => setBreakingExpiryHours(Number(e.target.value) || 48)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-400">After this period, the red breaking ticker automatically expires.</span>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800">URL Slug Standardization</label>
              <select
                value={autoSlugFormat}
                onChange={(e) => setAutoSlugFormat(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
              >
                <option value="kebab-case">Kebab Case (/news/heart-study-update)</option>
                <option value="dated-kebab">Dated Kebab (/news/2026/08/heart-study)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Data Portability & Demo Reset */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-slate-600" /> Data Portability & Demo Tools
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onExportJson}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-2xs"
            >
              <Download className="h-4 w-4 text-slate-500" />
              <span>Export News Archive (JSON)</span>
            </button>

            <button
              onClick={onImportJson}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-2xs"
            >
              <Upload className="h-4 w-4 text-slate-500" />
              <span>Import News Feed</span>
            </button>

            <button
              onClick={onResetAllData}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset CMS to Peer-Reviewed Clinical Defaults</span>
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end">
        <button
          onClick={handleSaveSettings}
          className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-sm"
        >
          Save Editorial Settings
        </button>
      </div>
    </div>
  );
};
