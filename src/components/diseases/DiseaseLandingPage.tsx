import React, { useMemo } from 'react';
import { ArrowRight, Sparkles, BookOpen, Bot, ShieldCheck, Lock, Search, Stethoscope, Activity } from 'lucide-react';
import { NavigationTab } from '../../types';
import { getPopularDiseases, ALL_DISEASES, BODY_SYSTEMS, specialtyForSymptom } from '../../data/diseases/diseaseIndex';
import { DiseaseSearch } from './DiseaseSearch';
import { DiseaseGrid } from './DiseaseCard';
import { BodySystemExplorer } from './BodySystemExplorer';
import { CategorySelector } from './CategorySelector';
import { DiseaseAlphabet } from './DiseaseAlphabet';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

interface DiseaseLandingPageProps {
  onOpenDisease: (id: string) => void;
  onOpenDirectory: (prefilter?: { bodySystemId?: string; category?: string; letter?: string; specialty?: string }) => void;
  onNavigate: (tab: NavigationTab) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export const DiseaseLandingPage: React.FC<DiseaseLandingPageProps> = ({
  onOpenDisease,
  onOpenDirectory,
  onNavigate,
  savedIds,
  onToggleSave,
}) => {
  const popular = useMemo(() => getPopularDiseases(), []);
  const availableLetters = useMemo(() => {
    const s = new Set<string>();
    ALL_DISEASES.forEach((c) => s.add(c.title.charAt(0).toUpperCase()));
    return [...s].sort();
  }, []);

  const handleSuggestion = (kind: 'symptom' | 'bodySystem' | 'specialty' | 'category', label: string) => {
    if (kind === 'bodySystem') {
      const bs = BODY_SYSTEMS.find((b) => b.label === label);
      onOpenDirectory({ bodySystemId: bs?.id });
    } else if (kind === 'specialty') {
      onOpenDirectory({ specialty: label });
    } else if (kind === 'symptom') {
      // Symptom → specialty navigation aid (never a diagnosis).
      onOpenDirectory({ specialty: specialtyForSymptom(label) });
    } else {
      onOpenDirectory();
    }
  };

  return (
    <>
      {/* 1 + 2. Hero + universal search */}
      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-medical-50/80 via-medical-50/30 to-transparent" aria-hidden="true" />
        <div className="gh-container relative py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="gh-eyebrow">
              <Stethoscope className="h-3.5 w-3.5" />
              Disease &amp; Health Information
            </span>
            <h1 className="mt-5 text-[1.9rem] font-bold leading-[1.15] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.6rem]">
              Understand diseases clearly. Make better-informed health decisions.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
              Explore structured information about diseases, symptoms, causes, risk factors,
              diagnosis, management, prevention and related healthcare resources.
            </p>

            <div className="mt-8">
              <DiseaseSearch
                onSelectDisease={onOpenDisease}
                onSelectSuggestion={handleSuggestion}
                onOpenDirectory={() => onOpenDirectory()}
              />
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-medical-500" /> {ALL_DISEASES.length} structured condition guides
              </span>
              <span className="text-slate-200" aria-hidden="true">•</span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-medical-500" /> Educational — not a diagnosis
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Popular Disease Topics */}
      <section className="gh-section pt-4" aria-labelledby="popular-diseases-title">
        <div className="gh-container">
          <SectionHeading
            id="popular-diseases-title"
            eyebrow="Start here"
            title="Popular Disease Topics"
            description="A focused selection of commonly searched conditions — each with structured, easy-to-understand information."
            action={
              <button
                type="button"
                onClick={() => onOpenDirectory()}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-medical-700 transition hover:text-medical-800"
              >
                Explore all diseases
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </button>
            }
          />
          <div className="mt-8">
            <DiseaseGrid conditions={popular} savedIds={savedIds} onOpen={onOpenDisease} onToggleSave={onToggleSave} />
          </div>
        </div>
      </section>

      {/* 4. Browse by body system */}
      <section className="gh-section bg-slate-50/60" aria-labelledby="body-systems-title">
        <div className="gh-container">
          <SectionHeading
            id="body-systems-title"
            eyebrow="Browse by body system"
            title="Explore by body system"
            description="Select a body system to see the conditions that affect it."
          />
          <div className="mt-8">
            <BodySystemExplorer onSelect={(id) => onOpenDirectory({ bodySystemId: id })} />
          </div>
        </div>
      </section>

      {/* 5. Browse by category */}
      <section className="gh-section" aria-labelledby="categories-title">
        <div className="gh-container">
          <SectionHeading
            id="categories-title"
            eyebrow="Browse by category"
            title="Disease categories"
            description="Filter the directory by medical category."
          />
          <div className="mt-8">
            <CategorySelector selected={[]} onToggle={(cat) => onOpenDirectory({ category: cat })} onClear={() => onOpenDirectory()} initialVisible={10} />
          </div>
        </div>
      </section>

      {/* 6. A–Z explorer */}
      <section className="gh-section bg-slate-50/60" aria-labelledby="az-title">
        <div className="gh-container">
          <SectionHeading
            id="az-title"
            eyebrow="A–Z explorer"
            title="Browse diseases A to Z"
            description="Jump straight to conditions by first letter."
          />
          <div className="mt-8">
            <DiseaseAlphabet activeLetter={null} onSelect={(letter) => letter && onOpenDirectory({ letter })} availableLetters={availableLetters} />
          </div>
        </div>
      </section>

      {/* 7. Featured health information */}
      <section className="gh-section" aria-labelledby="featured-health-title">
        <div className="gh-container">
          <SectionHeading
            id="featured-health-title"
            eyebrow="Go further"
            title="Featured health information"
            description="Diseases connect to the wider GlobalHealth ecosystem."
          />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { tab: 'medical-tests' as NavigationTab, title: 'Understand lab tests', desc: 'Explore 1,000+ laboratory tests, preparation and interpretation context.', icon: <Search className="h-5 w-5" /> },
              { tab: 'medicines' as NavigationTab, title: 'Medicine information', desc: 'Clear medicine details, forms, precautions and safety notes.', icon: <Activity className="h-5 w-5" /> },
              { tab: 'doctors' as NavigationTab, title: 'Find healthcare professionals', desc: 'Discover specialists by specialty, location and availability.', icon: <Stethoscope className="h-5 w-5" /> },
            ].map((card, i) => (
              <Reveal key={card.tab} delay={i * 60}>
                <button
                  type="button"
                  onClick={() => onNavigate(card.tab)}
                  className="group flex h-full w-full flex-col rounded-2xl border border-slate-200/80 bg-white p-6 text-left shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-medical-200 hover:shadow-lift"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-medical-50 text-medical-700 transition group-hover:bg-medical-600 group-hover:text-white">
                    {card.icon}
                  </span>
                  <h3 className="mt-4 text-[15px] font-bold text-slate-900">{card.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">{card.desc}</p>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 8. AI Assistant */}
      <section className="gh-section bg-slate-50/60" aria-labelledby="ai-disease-title">
        <div className="gh-container">
          <div className="relative overflow-hidden rounded-3xl border border-medical-100 bg-gradient-to-br from-medical-50 via-white to-medical-50/60 px-6 py-10 sm:px-10">
            <div className="relative grid items-center gap-8 lg:grid-cols-[auto_1fr_auto]">
              <Reveal className="justify-self-center">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-medical-500 to-medical-800 text-white shadow-lift">
                  <Bot className="h-9 w-9" />
                </div>
              </Reveal>
              <div>
                <SectionHeading
                  id="ai-disease-title"
                  eyebrow="Ask GlobalHealth AI"
                  title="Not sure what to look for?"
                  description="Ask the AI assistant to explain a condition in plain language, compare related diseases, or point you to the right resources."
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Explain this disease simply', 'What are the common symptoms?', 'Which specialist usually manages it?', 'What tests are often associated with it?'].map((p) => (
                    <button key={p} type="button" onClick={() => onNavigate('ai-assistant')} className="gh-chip">
                      <Sparkles className="h-3 w-3 text-medical-500" />
                      “{p}”
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Button onClick={() => onNavigate('ai-assistant')}>
                  <Bot className="h-4 w-4" />
                  Open AI Assistant
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Trust */}
      <section className="gh-section" aria-labelledby="disease-trust-title">
        <div className="gh-container">
          <SectionHeading
            id="disease-trust-title"
            eyebrow="Trust &amp; sources"
            title="Responsible health information"
            align="center"
          />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: <BookOpen className="h-5 w-5" />, title: 'Structured & sourced', desc: 'Each guide organizes symptoms, causes, diagnosis and management into a consistent, readable structure.' },
              { icon: <Lock className="h-5 w-5" />, title: 'Privacy-conscious', desc: 'Saved disease guides stay in your private library and are never exposed publicly.' },
              { icon: <ShieldCheck className="h-5 w-5" />, title: 'Educational, not prescriptive', desc: 'Information helps you understand and prepare — it never replaces professional medical advice.' },
            ].map((t, i) => (
              <Reveal key={t.title} delay={i * 60}>
                <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-medical-50 text-medical-700">{t.icon}</span>
                  <h3 className="mt-4 text-[15px] font-bold text-slate-900">{t.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">{t.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Final CTA */}
      <section className="gh-section pt-6" aria-labelledby="disease-cta-title">
        <div className="gh-container">
          <Reveal>
            <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center shadow-soft sm:px-12">
              <h2 id="disease-cta-title" className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Explore the full disease directory
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
                Search, filter and browse {ALL_DISEASES.length} structured condition guides by
                category, body system, specialty or alphabetically.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Button size="lg" onClick={() => onOpenDirectory()}>
                  Open Disease Directory
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="secondary" onClick={() => onNavigate('ai-assistant')}>
                  Ask AI Assistant
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
};
