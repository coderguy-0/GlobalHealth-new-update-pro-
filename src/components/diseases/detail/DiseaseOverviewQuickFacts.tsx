import React from 'react';
import { Info, ClipboardList, BookOpen } from 'lucide-react';
import { HealthCondition } from '../../../types';
import { DiseaseSection, IconList, EmptyNote, CarefulNote } from './shared';

interface OverviewProps {
  condition: HealthCondition;
  onFindTests: () => void;
}

/** "What is X?" — plain language first, optional deeper medical overview. */
export const DiseaseOverview: React.FC<OverviewProps> = ({ condition }) => (
  <DiseaseSection id="overview" icon={<Info className="h-4.5 w-4.5" />} title={`What is ${condition.title.toLowerCase()}?`}>
    <p className="max-w-3xl text-[15px] leading-relaxed text-slate-700">{condition.summary}</p>
    {condition.recovery && (
      <div className="mt-5">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Medical overview</p>
        <p className="max-w-3xl text-[13px] leading-relaxed text-slate-500">{condition.recovery}</p>
      </div>
    )}
    <CarefulNote>
      This section provides educational context. A healthcare professional is needed to interpret how
      this information applies to any individual.
    </CarefulNote>
  </DiseaseSection>
);

const FACT_FIELDS: { key: keyof HealthCondition; label: string }[] = [
  { key: 'commonName', label: 'Also known as' },
  { key: 'diseaseType', label: 'Typical classification' },
  { key: 'bodySystem', label: 'Main body system' },
  { key: 'specialist', label: 'Commonly involved specialty' },
  { key: 'contagious', label: 'Contagious status' },
  { key: 'commonAgeGroup', label: 'Typical age patterns' },
  { key: 'severity', label: 'Severity' },
  { key: 'curable', label: 'Chronic / acute / variable' },
  { key: 'vaccineAvailable', label: 'Vaccine available' },
  { key: 'commonRecoveryTime', label: 'Typical recovery time' },
];

/** Quick facts panel — only fields with real data, nothing forced. */
export const DiseaseQuickFacts: React.FC<{ condition: HealthCondition }> = ({ condition }) => {
  const facts = FACT_FIELDS.filter((f) => {
    const v = condition[f.key];
    return typeof v === 'string' && (v as string).trim().length > 0 && v !== condition.title;
  });

  return (
    <DiseaseSection
      id="quick-facts"
      icon={<ClipboardList className="h-4.5 w-4.5" />}
      title="Quick facts"
      description="A compact summary of key information about this condition."
    >
      {facts.length === 0 ? (
        <EmptyNote text="Additional quick facts are not available for this condition." />
      ) : (
        <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
          {facts.map((f) => (
            <div key={f.key} className="bg-white px-4 py-3">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{f.label}</dt>
              <dd className="mt-1 text-[13px] font-semibold leading-snug text-slate-800">{String(condition[f.key])}</dd>
            </div>
          ))}
        </dl>
      )}
    </DiseaseSection>
  );
};

/** Medical information disclaimer — concise and visible, not tiny text. */
export const DiseaseDisclaimer: React.FC = () => (
  <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5" role="note">
    <div className="flex items-start gap-3">
      <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
      <div>
        <p className="text-sm font-bold text-amber-900">Medical disclaimer</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-amber-900/80">
          This information is for educational purposes and is not a substitute for professional medical
          advice, diagnosis, or treatment. Always consult a qualified healthcare professional if you have
          concerns about your health or your symptoms are severe or persistent.
        </p>
      </div>
    </div>
  </div>
);
