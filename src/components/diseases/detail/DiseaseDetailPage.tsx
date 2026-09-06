import React, { useEffect, useMemo, useState } from 'react';
import { Bot, Info, ClipboardList, Activity, Dna, ShieldAlert, AlertCircle, Stethoscope, HeartPulse, Pill, ShieldCheck, HelpCircle, Link2, FileText, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import { HealthCondition, NavigationTab } from '../../../types';
import { getRelatedDiseases } from '../../../data/diseases/diseaseIndex';
import { DiseaseHeader } from './DiseaseHeader';
import { DiseaseOverview, DiseaseQuickFacts, DiseaseDisclaimer } from './DiseaseOverviewQuickFacts';
import { DiseaseSymptoms } from './DiseaseSymptoms';
import { DiseaseCauses, DiseaseRiskFactors, DiseaseComplications } from './DiseaseCausesRiskComplications';
import { DiseaseDiagnosis } from './DiseaseDiagnosis';
import { DiseaseTreatment, DiseaseMedicines } from './DiseaseTreatmentMedicines';
import { DiseaseSpecialists } from './DiseaseSpecialists';
import { DiseasePrevention, DiseaseSeekCare } from './DiseasePreventionSeekCare';
import { DiseaseFaq, DiseaseMythsFacts } from './DiseaseFaqMyths';
import { DiseaseRelatedConditions, DiseaseRelatedTopics } from './DiseaseRelated';
import { DiseaseSources } from './DiseaseSources';
import { DiseaseInfographic } from '../../DiseaseInfographic';
import { Button } from '../../ui/Button';
import { Skeleton } from '../../ui/Skeleton';

interface DiseaseDetailPageProps {
  condition: HealthCondition;
  isSaved: boolean;
  onToggleSave: () => void;
  onOpenDisease: (id: string) => void;
  onBack: () => void;
  onNavigate: (tab: NavigationTab) => void;
  onAskAI: (prompt: string) => void;
  onFindDoctor: () => void;
  onFindTests: () => void;
  onOpenMap: () => void;
}

const NAV_ITEMS: { id: string; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <Info className="h-3.5 w-3.5" /> },
  { id: 'quick-facts', label: 'Quick Facts', icon: <ClipboardList className="h-3.5 w-3.5" /> },
  { id: 'symptoms', label: 'Symptoms', icon: <Activity className="h-3.5 w-3.5" /> },
  { id: 'causes', label: 'Causes', icon: <Dna className="h-3.5 w-3.5" /> },
  { id: 'risk-factors', label: 'Risk Factors', icon: <ShieldAlert className="h-3.5 w-3.5" /> },
  { id: 'complications', label: 'Complications', icon: <AlertCircle className="h-3.5 w-3.5" /> },
  { id: 'diagnosis', label: 'Diagnosis', icon: <Stethoscope className="h-3.5 w-3.5" /> },
  { id: 'treatment', label: 'Treatment', icon: <HeartPulse className="h-3.5 w-3.5" /> },
  { id: 'medicines', label: 'Medicines', icon: <Pill className="h-3.5 w-3.5" /> },
  { id: 'specialists', label: 'Specialists', icon: <Stethoscope className="h-3.5 w-3.5" /> },
  { id: 'prevention', label: 'Prevention', icon: <ShieldCheck className="h-3.5 w-3.5" /> },
  { id: 'seek-care', label: 'When to Seek Care', icon: <AlertCircle className="h-3.5 w-3.5" /> },
  { id: 'faq', label: 'FAQ', icon: <HelpCircle className="h-3.5 w-3.5" /> },
  { id: 'related-conditions', label: 'Related Conditions', icon: <Link2 className="h-3.5 w-3.5" /> },
  { id: 'sources', label: 'Sources', icon: <FileText className="h-3.5 w-3.5" /> },
];

const AI_PROMPTS = [
  'Explain this disease simply.',
  'What are the common symptoms?',
  'What tests are often associated with it?',
  'Which specialist usually manages it?',
  'Explain the difference between this and a related condition.',
];

export const DiseaseDetailPage: React.FC<DiseaseDetailPageProps> = ({
  condition,
  isSaved,
  onToggleSave,
  onOpenDisease,
  onBack,
  onNavigate,
  onAskAI,
  onFindDoctor,
  onFindTests,
  onOpenMap,
}) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [showInfographic, setShowInfographic] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');

  const related = useMemo(() => getRelatedDiseases(condition, 6), [condition]);

  // Scroll-spy for the "On this page" sidebar.
  useEffect(() => {
    const ids = NAV_ITEMS.map((n) => n.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [condition.id]);

  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}#diseases/${condition.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: condition.title, text: condition.summary, url });
        return;
      } catch {
        /* user cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="bg-white">
      <div className="border-b border-slate-200 bg-white">
        <div className="gh-container flex items-center gap-1.5 py-3 text-xs text-slate-500">
          <button type="button" onClick={() => onNavigate('home')} className="font-semibold text-slate-600 transition hover:text-medical-700">Home</button>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <button type="button" onClick={onBack} className="font-semibold text-slate-600 transition hover:text-medical-700">Diseases</button>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <span className="font-medium text-slate-800">{condition.category}</span>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <span className="truncate font-medium text-slate-800">{condition.title}</span>
        </div>
      </div>

      <div className="gh-container py-8 sm:py-10">
        <DiseaseHeader
          condition={condition}
          isSaved={isSaved}
          onToggleSave={onToggleSave}
          onShare={share}
          onAskAI={() => onAskAI('Explain this disease simply.')}
          onFindDoctor={onFindDoctor}
          onFindTests={onFindTests}
          onBack={onBack}
          onHome={() => onNavigate('home')}
        />

        {/* AI + infographic quick actions */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => setShowInfographic(!showInfographic)}>
            {showInfographic ? 'Hide infographic' : 'View disease infographic'}
          </Button>
          <span className="text-[11px] text-slate-400">A visual summary of the condition journey</span>
        </div>

        {showInfographic && (
          <div className="mt-5">
            <DiseaseInfographic condition={condition} />
          </div>
        )}

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_260px]">
          {/* ---------------- Main content ---------------- */}
          <article className="min-w-0">
            <DiseaseOverview condition={condition} onFindTests={onFindTests} />
            <DiseaseQuickFacts condition={condition} />

            {/* AI ask panel */}
            <section className="mt-4 rounded-2xl border border-medical-100 bg-gradient-to-br from-medical-50 via-white to-medical-50/60 p-5" aria-labelledby="ask-ai-title">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="ask-ai-title" className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Bot className="h-4.5 w-4.5 text-medical-600" />
                  Ask GlobalHealth AI
                </h2>
                <Button size="sm" onClick={() => onAskAI('Explain this disease simply.')}>
                  Open AI Assistant
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {AI_PROMPTS.map((p) => (
                  <button key={p} type="button" onClick={() => onAskAI(p)} className="gh-chip">
                    “{p}”
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
                AI responses use the trusted content on this page as context. They are educational and
                never a diagnosis — the assistant is not a doctor.
              </p>
            </section>

            <DiseaseSymptoms condition={condition} />
            <DiseaseCauses condition={condition} />
            <DiseaseRiskFactors condition={condition} />
            <DiseaseComplications condition={condition} />
            <DiseaseDiagnosis condition={condition} onFindTests={onFindTests} />
            <DiseaseTreatment condition={condition} onExploreMedicines={() => onNavigate('medicines')} onFindDoctor={onFindDoctor} />
            <DiseaseMedicines condition={condition} onExploreMedicines={() => onNavigate('medicines')} onFindDoctor={onFindDoctor} />
            <DiseaseSpecialists condition={condition} onFindDoctor={onFindDoctor} onOpenMap={onOpenMap} />
            <DiseasePrevention condition={condition} />
            <DiseaseSeekCare condition={condition} />
            <DiseaseMythsFacts condition={condition} />
            <DiseaseFaq condition={condition} />
            <DiseaseRelatedConditions condition={condition} onOpenDisease={onOpenDisease} onNavigate={onNavigate} />
            <DiseaseRelatedTopics condition={condition} onOpenDisease={onOpenDisease} onNavigate={onNavigate} />
            <DiseaseSources condition={condition} />

            <div className="mt-8">
              <DiseaseDisclaimer />
            </div>

            {/* Prev / next related */}
            {related.length > 0 && (
              <nav className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row" aria-label="Related diseases">
                <div className="flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Next related</p>
                  <button
                    type="button"
                    onClick={() => onOpenDisease(related[0].id)}
                    className="group mt-1.5 flex w-full items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 text-left shadow-soft transition hover:border-medical-200 hover:shadow-lift"
                  >
                    <ChevronLeft className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:-translate-x-0.5" />
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-bold text-slate-800 group-hover:text-medical-800">{related[0].title}</span>
                      <span className="block text-[11px] text-slate-500">{related[0].category}</span>
                    </span>
                  </button>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">More like this</p>
                  <button
                    type="button"
                    onClick={() => onOpenDisease(related[1]?.id || related[0].id)}
                    className="group mt-1.5 flex w-full items-center justify-end gap-2 rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 text-right shadow-soft transition hover:border-medical-200 hover:shadow-lift"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-bold text-slate-800 group-hover:text-medical-800">{related[1]?.title || related[0].title}</span>
                      <span className="block text-[11px] text-slate-500">{related[1]?.category || related[0].category}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5" />
                  </button>
                </div>
              </nav>
            )}
          </article>

          {/* ---------------- Sticky sidebar ---------------- */}
          <aside className="hidden lg:block" aria-label="On this page">
            <div className="sticky top-24">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft">
                <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">On this page</p>
                <nav className="space-y-0.5">
                  {NAV_ITEMS.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[12px] font-medium transition ${
                        activeSection === item.id
                          ? 'bg-medical-50 text-medical-800'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <span className={activeSection === item.id ? 'text-medical-600' : 'text-slate-300'}>{item.icon}</span>
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="mt-4 rounded-2xl border border-medical-100 bg-medical-50/60 p-4">
                <p className="flex items-center gap-2 text-xs font-bold text-medical-900">
                  <Bot className="h-4 w-4 text-medical-600" />
                  Not what you expected?
                </p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-medical-800/80">
                  Ask the AI assistant for a plain-language explanation, or browse related conditions.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

/** Skeleton shown while a disease detail loads. */
export const DiseaseDetailSkeleton: React.FC = () => (
  <div className="gh-container py-10">
    <div className="h-4 w-64 animate-pulse rounded bg-slate-200/70" />
    <div className="mt-6 rounded-3xl border border-slate-200/80 bg-white p-8 shadow-soft">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="mt-4 h-8 w-3/4" />
      <Skeleton className="mt-3 h-4 w-1/2" />
      <div className="mt-5 space-y-2">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-5/6" />
        <Skeleton className="h-3.5 w-2/3" />
      </div>
      <div className="mt-6 flex gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
    <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_260px]">
      <div className="space-y-6">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
      <Skeleton className="hidden h-80 lg:block" />
    </div>
  </div>
);
