import React from 'react';
import { ArrowRight, Link2, Salad, Pill, FlaskConical, Stethoscope, Building2, Newspaper } from 'lucide-react';
import { HealthCondition, NavigationTab } from '../../../types';
import { getRelatedDiseases } from '../../../data/diseases/diseaseIndex';
import { DiseaseSection, EmptyNote } from './shared';

interface Props {
  condition: HealthCondition;
  onOpenDisease: (id: string) => void;
  onNavigate: (tab: NavigationTab) => void;
}

/** Related diseases — same body system / category / specialty, honestly labeled. */
export const DiseaseRelatedConditions: React.FC<Props> = ({ condition, onOpenDisease }) => {
  const related = getRelatedDiseases(condition, 6);
  return (
    <DiseaseSection
      id="related-conditions"
      icon={<Link2 className="h-4.5 w-4.5" />}
      title="Related Diseases & Conditions"
      description="Conditions related by body system, category or specialty — related does not mean the same."
    >
      {related.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {related.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onOpenDisease(r.id)}
              className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 text-left shadow-soft transition hover:border-medical-200 hover:shadow-lift"
            >
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-bold text-slate-800 group-hover:text-medical-800">{r.title}</span>
                <span className="block truncate text-[11px] text-slate-500">{r.category} · {r.specialist}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-medical-600" />
            </button>
          ))}
        </div>
      ) : (
        <EmptyNote text="Related-condition data is not currently available." />
      )}
    </DiseaseSection>
  );
};

const TOPICS: { tab: NavigationTab; label: string; icon: React.ReactNode }[] = [
  { tab: 'diseases', label: 'More disease information', icon: <Link2 className="h-4 w-4" /> },
  { tab: 'nutrition', label: 'Nutrition & recipes', icon: <Salad className="h-4 w-4" /> },
  { tab: 'medicines', label: 'Medicines directory', icon: <Pill className="h-4 w-4" /> },
  { tab: 'medical-tests', label: 'Lab tests', icon: <FlaskConical className="h-4 w-4" /> },
  { tab: 'doctors', label: 'Find specialists', icon: <Stethoscope className="h-4 w-4" /> },
  { tab: 'medical-map', label: 'Medical facilities', icon: <Building2 className="h-4 w-4" /> },
  { tab: 'news', label: 'Healthcare updates', icon: <Newspaper className="h-4 w-4" /> },
];

/** Related health topics — a connected information network across GlobalHealth. */
export const DiseaseRelatedTopics: React.FC<Props> = ({ onNavigate }) => (
  <DiseaseSection id="related-topics" icon={<Link2 className="h-4.5 w-4.5" />} title="Related health topics">
    <div className="flex flex-wrap gap-2">
      {TOPICS.map((t) => (
        <button key={t.tab} type="button" onClick={() => onNavigate(t.tab)} className="gh-chip">
          {t.icon}
          {t.label}
          <ArrowRight className="h-3 w-3 text-slate-400" />
        </button>
      ))}
    </div>
  </DiseaseSection>
);
