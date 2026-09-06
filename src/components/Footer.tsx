import React, { useState } from 'react';
import {
  Heart,
  X,
  Globe2,
  Accessibility,
  Info,
  Mail,
  ShieldCheck,
  PhoneCall,
  Activity,
  Command,
} from 'lucide-react';
import { NavigationTab, DashboardViewMode } from '../types';
import { useLocalization } from '../context/LocalizationContext';

interface FooterProps {
  onTabChange: (tab: NavigationTab, dashboardMode?: DashboardViewMode) => void;
}

type LegalDoc = 'editorial' | 'about' | 'contact' | 'accessibility' | null;

export const Footer: React.FC<FooterProps> = ({ onTabChange }) => {
  const { languageOption, setIsLanguageModalOpen } = useLocalization();
  const [legalDoc, setLegalDoc] = useState<LegalDoc>(null);

  const legalCopy: Record<NonNullable<LegalDoc>, { title: string; body: string }> = {
    editorial: {
      title: 'Medical Disclaimer',
      body: 'Public news and research briefs are labelled by source and evidence type. Institutional announcements are published through the Verified Authority portal. Content is educational and is not a prescription. GlobalHealth is not a medical certification body.',
    },
    about: {
      title: 'About GlobalHealth',
      body: 'GlobalHealth is a unified healthcare platform connecting trustworthy information, healthcare discovery, personal health tools, and intelligent assistance — with trusted conditions, medicines, healthcare professionals, medical facilities, laboratory resources, and verified pharmacy pathways in one place.',
    },
    contact: {
      title: 'Contact & Institutional Relations',
      body: 'Healthcare institutions and partners connect through the dedicated Doctor, Hospital, and Pharmacy portals available in the navigation. For editorial and institutional announcements, use the News Management workspace. Emergency hotlines are always accessible.',
    },
    accessibility: {
      title: 'Accessibility Statement',
      body: 'GlobalHealth is designed for keyboard navigation, visible focus states, semantic headings, and screen readers. The interface honors prefers-reduced-motion settings and maintains WCAG AAA color contrast standards.',
    },
  };

  const columnLink = (label: string, action: () => void) => (
    <li>
      <button
        type="button"
        onClick={action}
        className="text-[13px] text-slate-400 transition hover:text-white cursor-pointer text-left"
      >
        {label}
      </button>
    </li>
  );

  return (
    <footer className="border-t border-slate-800 bg-slate-950 pb-10 pt-16 text-xs text-slate-300">
      <div className="gh-container">
        {/* Top Emergency SOS Strip in Footer */}
        <div className="mb-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <PhoneCall className="h-5 w-5 animate-pulse" />
            </span>
            <div>
              <p className="text-sm font-bold text-white">Emergency Services &amp; Immediate Triage</p>
              <p className="text-xs text-slate-400">24/7 National Emergency Numbers &amp; Crisis Support</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="tel:911"
              className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-slate-700 transition"
            >
              US/CA: 911
            </a>
            <a
              href="tel:112"
              className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-slate-700 transition"
            >
              EU/UK/IN: 112
            </a>
            <a
              href="tel:988"
              className="rounded-xl border border-emerald-900/60 bg-emerald-950/80 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-900 transition"
            >
              Crisis Line: 988
            </a>
          </div>
        </div>

        {/* Symmetric 5-Column Navigation Grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Column 1 — Brand & Network Status */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-medical-500 via-medical-600 to-medical-800 text-white shadow-sm">
                <Heart className="h-4.5 w-4.5 fill-white/20" />
              </span>
              <span className="text-lg font-bold tracking-tight text-white">
                Global<span className="text-medical-400">Health</span>
              </span>
            </div>

            <p className="text-[13px] leading-relaxed text-slate-400">
              Universal healthcare discovery, clinical knowledge, verified directory, and MedAuth secure medical records.
            </p>

            <div className="flex flex-col gap-2 w-full">
              <button
                type="button"
                onClick={() => setIsLanguageModalOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-slate-700 hover:text-white"
              >
                <Globe2 className="h-4 w-4 text-medical-400" />
                Language ({languageOption.nativeName})
              </button>

              <div className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-[11px] font-semibold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                MedAuth Network Live
              </div>
            </div>
          </div>

          {/* Column 2 — Clinical Knowledge */}
          <nav aria-label="Clinical Knowledge" className="flex flex-col items-start">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-200">
              Clinical Reference
            </h4>
            <ul className="space-y-2.5">
              {columnLink('Diseases & Conditions', () => onTabChange('diseases'))}
              {columnLink('Medicines & Pharmacy', () => onTabChange('medicines'))}
              {columnLink('Diagnostic Lab Tests', () => onTabChange('medical-tests'))}
              {columnLink('Clinical AI Assistant', () => onTabChange('ai-assistant'))}
              {columnLink('Interactive Matrix', () => onTabChange('explore'))}
            </ul>
          </nav>

          {/* Column 3 — Facilities & Providers */}
          <nav aria-label="Facilities and Doctors" className="flex flex-col items-start">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-200">
              Facilities &amp; Care
            </h4>
            <ul className="space-y-2.5">
              {columnLink('Find Doctors & Specialists', () => onTabChange('doctors'))}
              {columnLink('Hospitals & Clinics', () => onTabChange('hospitals'))}
              {columnLink('Live Medical Map', () => onTabChange('medical-map'))}
              {columnLink('Blood Bank Inventory', () => onTabChange('medical-map'))}
              {columnLink('Book Appointment', () => onTabChange('appointments'))}
            </ul>
          </nav>

          {/* Column 4 — Tools & Wellness */}
          <nav aria-label="Tools and Wellness" className="flex flex-col items-start">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-200">
              Health &amp; Wellness
            </h4>
            <ul className="space-y-2.5">
              {columnLink('Clinical Calculators', () => onTabChange('calculators'))}
              {columnLink('Nutrition & Recipes', () => onTabChange('nutrition'))}
              {columnLink('Wellness & Workouts', () => onTabChange('wellness'))}
              {columnLink('Community Discussions', () => onTabChange('community'))}
              {columnLink('Verified Health News', () => onTabChange('news'))}
            </ul>
          </nav>

          {/* Column 5 — Enterprise & Portals */}
          <nav aria-label="Enterprise and Legal" className="flex flex-col items-start">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-200">
              Workspaces &amp; Trust
            </h4>
            <ul className="space-y-2.5">
              {columnLink('Doctor Portal & MedAuth', () => onTabChange('doctor-portal'))}
              {columnLink('Hospital Portal', () => onTabChange('hospital-portal'))}
              {columnLink('Pharmacy Portal', () => onTabChange('pharmacy-portal'))}
              {columnLink('News CMS Admin', () => onTabChange('news-management'))}
              {columnLink('Privacy & Consent', () => onTabChange('privacy-policy'))}
              {columnLink('Terms of Service', () => onTabChange('terms'))}
            </ul>
          </nav>
        </div>

        {/* Symmetric Centered Bottom Bar */}
        <div className="mt-14 border-t border-slate-800/80 pt-8 flex flex-col items-center justify-between gap-4 text-center sm:flex-row">
          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} GlobalHealth Universal Network. HL7 &amp; FHIR R4 Compliant.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-slate-400">
            <button
              type="button"
              onClick={() => onTabChange('privacy-policy')}
              className="hover:text-white transition"
            >
              Privacy Policy
            </button>
            <span aria-hidden="true" className="text-slate-700">•</span>
            <button
              type="button"
              onClick={() => onTabChange('terms')}
              className="hover:text-white transition"
            >
              Terms &amp; Conditions
            </button>
            <span aria-hidden="true" className="text-slate-700">•</span>
            <button
              type="button"
              onClick={() => setLegalDoc('accessibility')}
              className="hover:text-white transition"
            >
              Accessibility
            </button>
            <span aria-hidden="true" className="text-slate-700">•</span>
            <button
              type="button"
              onClick={() => setLegalDoc('editorial')}
              className="hover:text-white transition"
            >
              Medical Disclaimer
            </button>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-4xl text-center text-[11px] leading-relaxed text-slate-600">
          GlobalHealth provides educational healthcare discovery and care-coordination tools. It does
          not provide medical advice, diagnosis, or treatment, and is not a substitute for a licensed
          clinician or emergency services. Consult a qualified professional before making clinical decisions.
        </p>
      </div>

      {/* Legal / Info Modal */}
      {legalDoc && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-title"
          onClick={() => setLegalDoc(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 text-slate-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <h3 id="legal-title" className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                {legalDoc === 'about' && <Info className="h-4 w-4 text-medical-600" />}
                {legalDoc === 'contact' && <Mail className="h-4 w-4 text-medical-600" />}
                {legalDoc === 'accessibility' && <Accessibility className="h-4 w-4 text-medical-600" />}
                {legalCopy[legalDoc].title}
              </h3>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setLegalDoc(null)}
                className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-600">{legalCopy[legalDoc].body}</p>
            <button
              type="button"
              onClick={() => setLegalDoc(null)}
              className="mt-6 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
