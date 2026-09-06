import React, { useEffect, useMemo, useState } from 'react';
import {
  FlaskConical,
  ShieldCheck,
  Info,
  CheckCircle2,
  HelpCircle,
  Stethoscope,
  ShieldAlert,
  Activity,
  Share2,
  Printer,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Bot,
  Link2,
  ClipboardList,
  AlertCircle,
  TestTube,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { MedicalTest, NavigationTab } from '../../types';
import { MEDICAL_TESTS } from '../../data/healthData';
import { SingleTestInterpretationModal } from './SingleTestInterpretationModal';

interface MedicalTestDetailPageProps {
  test: MedicalTest;
  onBack: () => void;
  onNavigate?: (tab: NavigationTab) => void;
  onOpenTest?: (id: string) => void;
  onAskAI?: (prompt: string) => void;
}

const NAV_ITEMS: { id: string; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview & Mechanism', icon: <Info className="h-3.5 w-3.5" /> },
  { id: 'uses', label: 'Clinical Indications & Uses', icon: <Stethoscope className="h-3.5 w-3.5" /> },
  { id: 'prep', label: 'Preparation & Safety', icon: <ClipboardList className="h-3.5 w-3.5" /> },
  { id: 'results', label: 'Results & Reference Ranges', icon: <Activity className="h-3.5 w-3.5" /> },
  { id: 'faqs', label: 'Clinical FAQs', icon: <HelpCircle className="h-3.5 w-3.5" /> },
];

export const MedicalTestDetailPage: React.FC<MedicalTestDetailPageProps> = ({
  test,
  onBack,
  onNavigate,
  onOpenTest,
  onAskAI,
}) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
  const [isInterpreterOpen, setIsInterpreterOpen] = useState(false);

  const related = useMemo(() => {
    return MEDICAL_TESTS.filter(
      (t) =>
        t.id !== test.id &&
        (t.category === test.category ||
          (test.category && t.category.toLowerCase().includes(test.category.toLowerCase().split(',')[0].trim())) ||
          (test.category && test.category.toLowerCase().includes(t.category.toLowerCase().split(',')[0].trim())))
    ).slice(0, 4);
  }, [test]);

  // Scroll spy for sticky sidebar navigation.
  useEffect(() => {
    const ids = (test.faqs && test.faqs.length ? NAV_ITEMS : NAV_ITEMS.filter((n) => n.id !== 'faqs')).map((n) => n.id);
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
  }, [test.id, test.faqs]);

  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}#medical-tests/${test.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${test.name} - Complete Lab Test Guide`,
          text: `Complete laboratory test guide for ${test.name} incl. preparation, reference ranges and interpretation.`,
          url,
        });
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

  const handlePrint = () => window.print();

  const aiPrompts = [
    `Explain what the ${test.name} lab test measures in simple terms.`,
    `How should I prepare for the ${test.name} lab test?`,
    `What do abnormal ${test.name} results mean?`,
  ];

  const handleAsk = (prompt: string) => {
    if (onAskAI) onAskAI(prompt);
    else if (onNavigate) onNavigate('ai-assistant');
  };

  return (
    <div className="bg-white">
      {/* 1. Breadcrumb Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="gh-container flex items-center gap-1.5 py-3 text-xs text-slate-500 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => (onNavigate ? onNavigate('home') : onBack())}
            className="font-semibold text-slate-600 transition hover:text-cyan-700 shrink-0"
          >
            Home
          </button>
          <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" />
          <button
            type="button"
            onClick={onBack}
            className="font-semibold text-slate-600 transition hover:text-cyan-700 shrink-0"
          >
            Lab Tests
          </button>
          <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" />
          <span className="font-medium text-slate-700 shrink-0">{test.category}</span>
          <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" />
          <span className="truncate font-bold text-slate-900">{test.name}</span>
        </div>
      </div>

      {/* 2. Main Page Container */}
      <div className="gh-container py-8 sm:py-10">
        {/* Header Banner */}
        <header className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-6 sm:p-8 text-white shadow-soft relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 px-3 py-1 text-xs font-extrabold text-cyan-300">
                  <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                  Clinical Lab Test Guide
                </span>
                <span className="rounded-full bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 text-xs font-bold">
                  {test.category}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800/90 border border-slate-700 px-3.5 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition cursor-pointer"
                  title="Share test guide"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>{copyState === 'copied' ? 'Copied Link!' : 'Share'}</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-slate-800/90 border border-slate-700 px-3.5 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition cursor-pointer"
                  title="Print test guide"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">{test.name}</h1>
              <p className="mt-1.5 text-sm sm:text-base text-slate-300 font-medium">{test.purpose}</p>
            </div>

            {/* Quick Spec Bar */}
            <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-800 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Sample Type</span>
                <span className="font-semibold text-cyan-200 truncate block">{test.sampleType}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Results Time</span>
                <span className="font-semibold text-slate-200">{test.timeToResults}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Preparation</span>
                <span className="font-semibold text-slate-200 truncate block">{test.preparation}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Primary Focus</span>
                <span className="font-semibold text-cyan-200 truncate block">{test.category}</span>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsInterpreterOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-500 transition cursor-pointer shadow-md"
              >
                <Activity className="h-4 w-4" />
                ⚡ Interpret Result
              </button>
              <button
                type="button"
                onClick={() => handleAsk(aiPrompts[0])}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition cursor-pointer"
              >
                <Bot className="h-4 w-4" />
                Ask GlobalHealth AI
              </button>
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800/90 border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 transition cursor-pointer ml-auto"
              >
                <ChevronLeft className="h-4 w-4" />
                All Lab Tests
              </button>
            </div>
          </div>
        </header>

        {/* Main Content + Sticky Sidebar Grid */}
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_270px]">
          <article className="min-w-0 space-y-8">
            {/* 1. Overview */}
            <section id="overview" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg border-b border-slate-100 pb-3">
                <Info className="h-5 w-5 text-cyan-600" />
                <h2>1. Overview &amp; Mechanism</h2>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-50/80 border border-cyan-100">
                <h4 className="font-bold text-cyan-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <FlaskConical className="h-4 w-4 text-cyan-600" /> Primary Clinical Purpose
                </h4>
                <p className="text-slate-700 text-sm leading-relaxed">{test.purpose}</p>
              </div>

              {test.overview && (
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-2">Comprehensive Overview</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{test.overview}</p>
                </div>
              )}
              {test.whatIsIt && (
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-2">What is this Test?</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{test.whatIsIt}</p>
                </div>
              )}
              {test.whyImportant && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                    Why is this Biomarker/Test Important?
                  </h4>
                  <p className="text-slate-700 text-sm">{test.whyImportant}</p>
                </div>
              )}
              {test.howItWorks && (
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-2">Biological Mechanism &amp; Procedure Pathway</h4>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 whitespace-pre-line text-slate-700 text-sm">
                    {test.howItWorks}
                  </div>
                </div>
              )}

              <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100 p-4 text-xs text-emerald-950">
                <span className="font-extrabold uppercase tracking-wider text-emerald-800 block mb-1">Reference Range</span>
                <p className="leading-relaxed text-sm">{test.normalRange}</p>
              </div>
            </section>

            {/* 2. Uses */}
            <section id="uses" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg border-b border-slate-100 pb-3">
                <Stethoscope className="h-5 w-5 text-cyan-600" />
                <h2>2. Clinical Indications &amp; Uses</h2>
              </div>

              {test.whyPerformed && (
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-3">Why Healthcare Providers Perform This Test</h4>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {test.whyPerformed.map((reason, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <CheckCircle2 className="h-4 w-4 text-cyan-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700 text-xs">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {test.conditionsDetected && (
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-rose-600" /> Medical Conditions &amp; Diseases Identified
                  </h4>
                  <div className="space-y-2">
                    {test.conditionsDetected.map((cond, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100 text-slate-800 flex items-center gap-2 text-xs">
                        <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0"></span>
                        <span>{cond}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {test.whoShouldGetIt && (
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-3">Who Should Undergo Testing?</h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-700 text-xs">
                    {test.whoShouldGetIt.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {test.whenNotInterpretedAlone && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-amber-600" /> Clinical Context &amp; Limitations
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-amber-900 text-xs">
                    {test.whenNotInterpretedAlone.map((warn, idx) => (
                      <li key={idx}>{warn}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* 3. Preparation */}
            <section id="prep" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg border-b border-slate-100 pb-3">
                <ClipboardList className="h-5 w-5 text-cyan-600" />
                <h2>3. Preparation &amp; Safety</h2>
              </div>

              {test.testPreparationChecklist ? (
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-3">Patient Preparation Checklist</h4>
                  <div className="space-y-2.5">
                    {test.testPreparationChecklist.map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 flex items-start gap-3">
                        <span className="flex items-center justify-center h-5 w-5 rounded-full bg-cyan-700 text-white font-bold text-[10px] shrink-0">
                          {idx + 1}
                        </span>
                        <p className="text-slate-800 font-medium text-xs">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">Standard Preparation</h4>
                  <p className="text-slate-700 text-sm">{test.preparation}</p>
                </div>
              )}

              {test.risksAndComplications && (
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-2">Procedure Safety &amp; Risks</h4>
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-emerald-950">
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      {test.risksAndComplications.map((risk, idx) => (
                        <li key={idx}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {test.postTestRecovery && (
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-2">Post-Test Recovery &amp; Next Steps</h4>
                  <p className="text-slate-700 text-sm">{test.postTestRecovery}</p>
                </div>
              )}
            </section>

            {/* 4. Results */}
            <section id="results" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg border-b border-slate-100 pb-3">
                <Activity className="h-5 w-5 text-cyan-600" />
                <h2>4. Results &amp; Reference Ranges</h2>
              </div>

              {test.normalValuesDetails ? (
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-3">Physiological Reference Range Bounds</h4>
                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="p-3 border-b border-slate-200">Category / Parameter</th>
                          <th className="p-3 border-b border-slate-200">Reference Bound</th>
                          <th className="p-3 border-b border-slate-200">Clinical Interpretation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {test.normalValuesDetails.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-900">{row.title}</td>
                            <td className="p-3 font-mono font-bold text-cyan-800">{row.range}</td>
                            <td className="p-3 text-slate-600">{row.interpretation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <h4 className="font-bold text-emerald-900 text-xs uppercase tracking-wider mb-1">Standard Reference Range</h4>
                  <p className="text-emerald-950 font-medium text-sm">{test.normalRange}</p>
                </div>
              )}

              {test.highInterpretation && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                  <h4 className="font-bold text-rose-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-rose-600" /> High Level / Abnormal Findings Significance
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-rose-950 text-xs">
                    {test.highInterpretation.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {test.lowInterpretation && (
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
                  <h4 className="font-bold text-sky-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <TrendingDown className="h-4 w-4 text-sky-600" /> Low Level / Decreased Value Significance
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-sky-950 text-xs">
                    {test.lowInterpretation.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {test.factorsAffectingResults && (
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-3">Factors Affecting Test Accuracy &amp; Results</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {test.factorsAffectingResults.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                        <span className="font-bold text-slate-900 block mb-0.5 text-xs">{item.factor}</span>
                        <p className="text-slate-600 text-[11px]">{item.effect}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                {test.advantagesAndBenefits && (
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                    <h5 className="font-bold text-emerald-900 text-xs uppercase tracking-wider mb-2">Key Advantages</h5>
                    <ul className="list-disc pl-4 space-y-1 text-emerald-950 text-[11px]">
                      {test.advantagesAndBenefits.map((adv, idx) => (
                        <li key={idx}>{adv}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {test.limitationsAndDisadvantages && (
                  <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200">
                    <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Key Limitations</h5>
                    <ul className="list-disc pl-4 space-y-1 text-slate-700 text-[11px]">
                      {test.limitationsAndDisadvantages.map((lim, idx) => (
                        <li key={idx}>{lim}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>

            {/* 5. FAQs */}
            {test.faqs && test.faqs.length > 0 && (
              <section id="faqs" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-soft space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg border-b border-slate-100 pb-3">
                  <HelpCircle className="h-5 w-5 text-cyan-600" />
                  <h2>5. Clinical FAQs ({test.faqs.length})</h2>
                </div>
                <div className="space-y-4">
                  {test.faqs.map((faq, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <h5 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-cyan-600 shrink-0" /> {faq.question}
                      </h5>
                      <p className="text-slate-600 pl-6 text-xs leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Related Tests */}
            {related.length > 0 && (
              <section className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-soft space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg border-b border-slate-100 pb-3">
                  <Link2 className="h-5 w-5 text-cyan-600" />
                  <h2>Related Lab Tests</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {related.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => onOpenTest?.(r.id)}
                      className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-left transition hover:border-cyan-300 hover:bg-cyan-50/40"
                    >
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-100 text-cyan-700 shrink-0">
                        <TestTube className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-bold text-slate-900">{r.name}</span>
                        <span className="block text-[11px] text-slate-500 truncate">{r.purpose}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Sticky Sidebar */}
          <aside className="lg:sticky lg:top-24 h-fit space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">On this page</h4>
              <nav className="space-y-1">
                {(test.faqs && test.faqs.length ? NAV_ITEMS : NAV_ITEMS.filter((n) => n.id !== 'faqs')).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      setActiveSection(item.id);
                    }}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[12px] font-bold transition cursor-pointer ${
                      activeSection === item.id ? 'bg-cyan-700 text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <ShieldAlert className="h-4 w-4 text-amber-700" />
                Patient Education Resource
              </div>
              <p>Results are interpreted by your clinician in the context of your history. Always consult your physician. This guide is educational and is not a substitute for professional medical advice.</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 text-xs text-slate-600 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold mb-1 text-slate-900">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                Ask GlobalHealth AI
              </div>
              <p>Get a simple, evidence-based explanation of this test, its preparation or its results.</p>
              <button
                type="button"
                onClick={() => handleAsk(aiPrompts[0])}
                className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition cursor-pointer"
              >
                <Bot className="h-4 w-4" />
                Ask AI
              </button>
            </div>
          </aside>
        </div>

        {/* Back to catalog */}
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-soft transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800 cursor-pointer"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to all Lab Tests
          </button>
        </div>
      </div>

      {/* Test Interpretation Modal */}
      {isInterpreterOpen && (
        <SingleTestInterpretationModal
          test={test}
          isOpen={isInterpreterOpen}
          onClose={() => setIsInterpreterOpen(false)}
          onAskAI={onAskAI}
        />
      )}
    </div>
  );
};
