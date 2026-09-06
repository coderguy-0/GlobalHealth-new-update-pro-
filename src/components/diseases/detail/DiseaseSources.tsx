import React from 'react';
import { ExternalLink, ShieldCheck, FileText } from 'lucide-react';
import { HealthCondition } from '../../../types';
import { DiseaseSection } from './shared';

const LEARN_MORE_SOURCES = [
  {
    name: 'MedlinePlus (U.S. National Library of Medicine)',
    url: 'https://medlineplus.gov/',
    note: 'Consumer health information from the world\'s largest medical library.',
  },
  {
    name: 'World Health Organization (WHO)',
    url: 'https://www.who.int/health-topics',
    note: 'International public health guidance and health topics.',
  },
  {
    name: 'Centers for Disease Control and Prevention (CDC)',
    url: 'https://www.cdc.gov/',
    note: 'Disease-specific public health information and prevention guidance.',
  },
  {
    name: 'National Institutes of Health (NIH)',
    url: 'https://www.nih.gov/health-information',
    note: 'Health information and research from U.S. federal agencies.',
  },
];

/** Content provenance + where to learn more. Real organizations, real links. */
export const DiseaseSources: React.FC<{ condition: HealthCondition }> = ({ condition }) => (
  <DiseaseSection
    id="sources"
    icon={<FileText className="h-4.5 w-4.5" />}
    title="Sources & References"
    description="GlobalHealth structures educational information for clarity. This page is a plain-language summary, not a primary clinical document."
  >
    <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
        <ShieldCheck className="h-4 w-4 text-medical-600" />
        Content provenance
      </p>
      <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-slate-600">
        <li><span className="font-semibold text-slate-700">Review status:</span> Educational summary — reviewed and updated as part of ongoing content maintenance.</li>
        <li><span className="font-semibold text-slate-700">Reviewed by:</span> GlobalHealth editorial process. Individual medical review boards are not claimed.</li>
        <li><span className="font-semibold text-slate-700">Last updated:</span> Content maintenance is continuous; no publication date is fabricated.</li>
        <li><span className="font-semibold text-slate-700">Source type:</span> Structured educational health-information framework.</li>
      </ul>
    </div>

    <div className="grid gap-3 sm:grid-cols-2">
      {LEARN_MORE_SOURCES.map((s) => (
        <a
          key={s.name}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 shadow-soft transition hover:border-medical-200 hover:shadow-lift"
        >
          <span className="min-w-0">
            <span className="block text-[13px] font-bold text-slate-800 group-hover:text-medical-800">{s.name}</span>
            <span className="mt-0.5 block text-[11px] leading-relaxed text-slate-500">{s.note}</span>
          </span>
          <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-medical-600" />
        </a>
      ))}
    </div>

    <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500">
      These trusted organizations provide general health information. Links open their official pages
      — GlobalHealth does not claim that this specific summary was authored or endorsed by them.
    </p>
  </DiseaseSection>
);
