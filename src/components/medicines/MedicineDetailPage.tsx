import React, { useEffect, useMemo, useState } from 'react';
import {
  Pill,
  ShieldCheck,
  FileText,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle2,
  HelpCircle,
  Stethoscope,
  ShieldAlert,
  Droplet,
  HeartPulse,
  Activity,
  Layers,
  Thermometer,
  Zap,
  Bookmark,
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
  ShoppingCart,
  MapPin,
  Check
} from 'lucide-react';
import { Medicine, NavigationTab } from '../../types';
import { ALL_400_MEDICINES } from '../../data/medicines';
import { MedicineInfographic } from '../MedicineInfographic';
import { Button } from '../ui/Button';
import { Skeleton } from '../ui/Skeleton';

interface MedicineDetailPageProps {
  medicine: Medicine;
  isSaved: boolean;
  onToggleSave: () => void;
  onOpenMedicine: (id: string) => void;
  onBack: () => void;
  onNavigate?: (tab: NavigationTab) => void;
  onAskAI?: (prompt: string) => void;
  onFindPharmacy?: () => void;
  onFindDoctor?: () => void;
}

const NAV_ITEMS: { id: string; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview & Class', icon: <Info className="h-3.5 w-3.5" /> },
  { id: 'quick-facts', label: 'Quick Clinical Facts', icon: <ClipboardList className="h-3.5 w-3.5" /> },
  { id: 'uses', label: 'Uses & Indications', icon: <Stethoscope className="h-3.5 w-3.5" /> },
  { id: 'dosage', label: 'Dosage & Regimen', icon: <Clock className="h-3.5 w-3.5" /> },
  { id: 'how-to-take', label: 'Administration Guide', icon: <Layers className="h-3.5 w-3.5" /> },
  { id: 'side-effects', label: 'Side Effects', icon: <Activity className="h-3.5 w-3.5" /> },
  { id: 'warnings', label: 'Warnings & Cautions', icon: <ShieldAlert className="h-3.5 w-3.5" /> },
  { id: 'interactions', label: 'Drug & Food Interactions', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  { id: 'how-it-works', label: 'Mechanism of Action', icon: <Zap className="h-3.5 w-3.5" /> },
  { id: 'storage', label: 'Storage & Handling', icon: <Thermometer className="h-3.5 w-3.5" /> },
  { id: 'seek-care', label: 'When to Seek Care', icon: <AlertCircle className="h-3.5 w-3.5" /> },
  { id: 'faq', label: 'Clinical FAQs', icon: <HelpCircle className="h-3.5 w-3.5" /> },
  { id: 'alternatives', label: 'Therapeutic Alternatives', icon: <Link2 className="h-3.5 w-3.5" /> },
  { id: 'sources', label: 'Compendia Sources', icon: <FileText className="h-3.5 w-3.5" /> },
];

export const MedicineDetailPage: React.FC<MedicineDetailPageProps> = ({
  medicine,
  isSaved,
  onToggleSave,
  onOpenMedicine,
  onBack,
  onNavigate,
  onAskAI,
  onFindPharmacy,
  onFindDoctor,
}) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [showInfographic, setShowInfographic] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');

  // Related medicines in the same category/therapeutic group
  const related = useMemo(() => {
    return ALL_400_MEDICINES.filter(
      (m) =>
        m.id !== medicine.id &&
        (m.category === medicine.category ||
          (medicine.therapeuticGroup && m.therapeuticGroup === medicine.therapeuticGroup))
    ).slice(0, 4);
  }, [medicine]);

  // Scroll spy for sticky sidebar navigation
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
  }, [medicine.id]);

  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}#medicines/${medicine.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${medicine.name} - Complete Clinical Monograph`,
          text: `Comprehensive clinical monograph, dosage, uses, and side effects for ${medicine.name}`,
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

  const handlePrint = () => {
    window.print();
  };

  const aiPrompts = [
    `Explain how ${medicine.name} works in simple terms.`,
    `What are the most common side effects of ${medicine.name}?`,
    `Can I take ${medicine.name} with food or other medications?`,
    `What should I do if I miss a dose of ${medicine.name}?`,
    `What are the safe alternatives to ${medicine.name}?`,
  ];

  const handleAsk = (prompt: string) => {
    if (onAskAI) {
      onAskAI(prompt);
    } else if (onNavigate) {
      onNavigate('ai-assistant');
    }
  };

  return (
    <div className="bg-white">
      {/* 1. Breadcrumb Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="gh-container flex items-center gap-1.5 py-3 text-xs text-slate-500 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => (onNavigate ? onNavigate('home') : onBack())}
            className="font-semibold text-slate-600 transition hover:text-emerald-700 shrink-0"
          >
            Home
          </button>
          <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" />
          <button
            type="button"
            onClick={onBack}
            className="font-semibold text-slate-600 transition hover:text-emerald-700 shrink-0"
          >
            Medicines
          </button>
          <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" />
          <span className="font-medium text-slate-700 shrink-0">{medicine.category || 'Therapeutics'}</span>
          <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" />
          <span className="truncate font-bold text-slate-900">{medicine.name}</span>
        </div>
      </div>

      {/* 2. Main Page Container */}
      <div className="gh-container py-8 sm:py-10">
        
        {/* Medicine Header Banner */}
        <header className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-6 sm:p-8 text-white shadow-soft relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            {/* Top Badges & Meta */}
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-extrabold text-emerald-300">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  Verified Clinical Monograph
                </span>

                <span className="rounded-full bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 text-xs font-bold">
                  {medicine.category}
                </span>

                {!medicine.overTheCounter || (medicine.prescriptionStatus && medicine.prescriptionStatus.toLowerCase().includes('rx')) ? (
                  <span className="rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 px-3 py-1 text-xs font-extrabold flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    Prescription Required (Rx)
                  </span>
                ) : (
                  <span className="rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 px-3 py-1 text-xs font-extrabold">
                    OTC Safe (Over-The-Counter)
                  </span>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onToggleSave}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer border ${
                    isSaved
                      ? 'bg-rose-500/20 border-rose-400/40 text-rose-300 hover:bg-rose-500/30'
                      : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  title={isSaved ? 'Remove from saved' : 'Save medicine monograph'}
                >
                  <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-current text-rose-400' : ''}`} />
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800/90 border border-slate-700 px-3.5 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition cursor-pointer"
                  title="Share medicine monograph"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>{copyState === 'copied' ? 'Copied Link!' : 'Share'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-slate-800/90 border border-slate-700 px-3.5 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition cursor-pointer"
                  title="Print monograph"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Medicine Title & Generic Name */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                {medicine.name}
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-slate-300 font-medium">
                Active Molecule / Generic: <strong className="text-emerald-300">{medicine.genericName}</strong>
              </p>
              {medicine.therapeuticGroup && (
                <p className="mt-1 text-xs text-slate-400">
                  Therapeutic Class: <span className="font-semibold text-slate-200">{medicine.therapeuticGroup}</span>
                </p>
              )}
            </div>

            {/* Available Dosage Form Tags */}
            {medicine.dosageForms && medicine.dosageForms.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-slate-400">Available Forms:</span>
                {medicine.dosageForms.map((form, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-white/10 border border-white/10 px-2.5 py-1 text-xs font-medium text-emerald-200"
                  >
                    {form}
                  </span>
                ))}
              </div>
            )}

            {/* Quick Actions Row */}
            <div className="pt-3 flex flex-wrap items-center gap-3 border-t border-slate-800">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleAsk(`Explain ${medicine.name} simply.`)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                <Bot className="h-4 w-4 mr-1.5" />
                Ask GlobalHealth AI
              </Button>

              {onFindPharmacy && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onFindPharmacy}
                  className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                >
                  <ShoppingCart className="h-4 w-4 mr-1.5 text-emerald-400" />
                  Check Pharmacy Stock
                </Button>
              )}

              {onFindDoctor && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onFindDoctor}
                  className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                >
                  <Stethoscope className="h-4 w-4 mr-1.5 text-blue-400" />
                  Find Prescribing Specialist
                </Button>
              )}

              <Button
                variant="secondary"
                size="sm"
                onClick={onBack}
                className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 ml-auto"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                All Medicines
              </Button>
            </div>
          </div>
        </header>

        {/* Visual Summary / Infographic Toggle */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold">
              <Activity className="h-5 w-5 text-emerald-600" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Interactive Pharmacokinetic Diagram</h4>
              <p className="text-xs text-slate-500">Visual breakdown of onset, half-life, target organs, and mechanism of action.</p>
            </div>
          </div>

          <Button
            variant={showInfographic ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setShowInfographic(!showInfographic)}
            className="shrink-0"
          >
            {showInfographic ? 'Hide Diagram' : 'View Pharmacokinetic Diagram'}
          </Button>
        </div>

        {showInfographic && (
          <div className="mt-5 animate-in fade-in duration-300">
            <MedicineInfographic medicine={medicine} />
          </div>
        )}

        {/* Main Content + Sticky Sidebar Grid */}
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_270px]">
          
          {/* ---------------- Left Main Article Column ---------------- */}
          <article className="min-w-0 space-y-8">
            
            {/* 1. Overview */}
            <section id="overview" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg border-b border-slate-100 pb-3">
                <Info className="h-5 w-5 text-emerald-600" />
                <h2>1. Overview &amp; What is {medicine.name}?</h2>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-slate-700">
                {medicine.whatIs || medicine.description}
              </p>
              {medicine.therapeuticGroup && (
                <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100 p-4 text-xs text-emerald-950 space-y-1">
                  <span className="font-extrabold uppercase tracking-wider text-emerald-800 block">
                    Pharmacological Class &amp; Category:
                  </span>
                  <p className="leading-relaxed">
                    Classified clinically as a <strong>{medicine.therapeuticGroup}</strong> within the{' '}
                    <strong>{medicine.category}</strong> therapeutic scope.
                  </p>
                </div>
              )}
            </section>

            {/* 2. Quick Clinical Facts */}
            <section id="quick-facts" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg border-b border-slate-100 pb-3">
                <ClipboardList className="h-5 w-5 text-emerald-600" />
                <h2>2. Quick Clinical Facts</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Generic Molecule</span>
                  <span className="font-extrabold text-slate-900 text-sm">{medicine.genericName}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Regulatory Status</span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {!medicine.overTheCounter ? 'Rx Prescription Only' : 'OTC Approved'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Primary Route</span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {medicine.dosageForms?.[0] || 'Oral Administration'}
                  </span>
                </div>
              </div>
            </section>

            {/* AI Prompt Box */}
            <section className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 p-6 shadow-soft" aria-labelledby="ask-ai-med-title">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 id="ask-ai-med-title" className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Bot className="h-5 w-5 text-emerald-600" />
                  Ask GlobalHealth AI about {medicine.name}
                </h3>
                <Button size="sm" onClick={() => handleAsk(`Explain ${medicine.name} simply.`)}>
                  Open AI Assistant
                </Button>
              </div>

              <div className="mt-3.5 flex flex-wrap gap-2">
                {aiPrompts.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleAsk(p)}
                    className="gh-chip hover:border-emerald-300 hover:bg-emerald-50 text-xs font-semibold cursor-pointer"
                  >
                    “{p}”
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                AI responses synthesize verified pharmacological monographs. They are intended for patient education and do not replace individualized medical advice from your prescribing doctor.
              </p>
            </section>

            {/* 3. Uses & Indications */}
            <section id="uses" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg border-b border-slate-100 pb-3">
                <Stethoscope className="h-5 w-5 text-blue-600" />
                <h2>3. Medically Approved Uses &amp; Clinical Indications</h2>
              </div>
              <p className="text-xs text-slate-500">
                Evidence-based medical applications approved by international health authorities and clinical compendia:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {medicine.uses.map((use, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-800">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium leading-relaxed">{use}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Dosage & Administration */}
            <section id="dosage" className="rounded-3xl border border-emerald-200 bg-emerald-50/40 p-6 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-base sm:text-lg border-b border-emerald-200 pb-3">
                <Clock className="h-5 w-5 text-emerald-700" />
                <h2>4. Dosage, Regimen &amp; Administration Guidelines</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Adults */}
                <div className="p-4 rounded-2xl bg-white border border-emerald-100 space-y-1.5 shadow-xs">
                  <span className="font-extrabold text-emerald-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Adult Dosage (Age 12+)
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {medicine.adultDosage || medicine.dosage || 'Take strictly as prescribed by your doctor or as outlined on the pharmaceutical product packaging.'}
                  </p>
                </div>

                {/* Children */}
                <div className="p-4 rounded-2xl bg-white border border-emerald-100 space-y-1.5 shadow-xs">
                  <span className="font-extrabold text-blue-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                    <Activity className="h-4 w-4 text-blue-600" />
                    Pediatric Guidance
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {medicine.childrenDosage || 'Consult a pediatrician for weight-based (mg/kg) dosage. Do not administer to infants without direct clinical authorization.'}
                  </p>
                </div>

                {/* Missed Dose */}
                <div className="p-4 rounded-2xl bg-white border border-amber-200 space-y-1.5 shadow-xs">
                  <span className="font-extrabold text-amber-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                    <Clock className="h-4 w-4 text-amber-600" />
                    Missed Dose Protocol
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {medicine.missedDose || 'Take the missed dose as soon as you remember. If it is close to your next scheduled dose, skip it. Never double up doses.'}
                  </p>
                </div>

                {/* Overdose */}
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1.5 shadow-xs text-rose-950">
                  <span className="font-extrabold text-rose-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                    Overdose Emergency Protocol
                  </span>
                  <p className="text-rose-900 leading-relaxed">
                    {medicine.overdose || 'Immediate emergency medical intervention required. Contact your local poison control hotline or nearest hospital emergency room immediately.'}
                  </p>
                </div>
              </div>
            </section>

            {/* 5. How to Take */}
            <section id="how-to-take" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg border-b border-slate-100 pb-3">
                <Layers className="h-5 w-5 text-indigo-600" />
                <h2>5. Administration Steps &amp; Best Practices</h2>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                {(medicine.howToTake || [
                  'Administer exactly as prescribed by your doctor or as outlined on the medication guide.',
                  'Swallow oral solid dosage forms whole with a full glass of water; do not crush or chew sustained-release forms.',
                  'Maintain consistent daily timing to ensure stable therapeutic plasma concentration.',
                  'Do not abruptly discontinue without consulting your prescriber.'
                ]).map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. Side Effects */}
            <section id="side-effects" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg border-b border-slate-100 pb-3">
                <Activity className="h-5 w-5 text-amber-600" />
                <h2>6. Side Effects &amp; Adverse Drug Reactions</h2>
              </div>

              <div className="space-y-4">
                {/* Common Side Effects */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" />
                    Common &amp; Mild Effects (Usually Self-Limiting)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(medicine.commonSideEffects || medicine.sideEffects.slice(0, 3)).map((effect, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 text-xs text-amber-900 flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{effect}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Serious Side Effects */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                    Serious Side Effects (Contact Doctor Immediately)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(medicine.seriousSideEffects || medicine.sideEffects.slice(3)).map((effect, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-900 flex items-start gap-2">
                        <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0 mt-0.5" />
                        <span>{effect}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 7. Warnings & Contraindications */}
            <section id="warnings" className="rounded-3xl border border-rose-200 bg-rose-50/30 p-6 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-rose-950 font-bold text-base sm:text-lg border-b border-rose-200 pb-3">
                <ShieldAlert className="h-5 w-5 text-rose-600" />
                <h2>7. Warnings, Contraindications &amp; Precautions</h2>
              </div>

              {medicine.warnings && (
                <div className="p-4 rounded-2xl bg-white border border-rose-200 text-xs sm:text-sm text-rose-950 leading-relaxed">
                  <strong>Black Box &amp; Clinical Warning:</strong> {medicine.warnings}
                </div>
              )}

              {medicine.whoShouldNotTake && medicine.whoShouldNotTake.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900">
                    Who Should NOT Take This Medication:
                  </h4>
                  <ul className="space-y-1.5">
                    {medicine.whoShouldNotTake.map((contra, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-rose-900">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                        <span>{contra}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {medicine.precautions && medicine.precautions.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-rose-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Key Precautions:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    {medicine.precautions.map((p, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200">
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* 8. Interactions */}
            <section id="interactions" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg border-b border-slate-100 pb-3">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <h2>8. Drug, Food &amp; Substance Interactions</h2>
              </div>
              <p className="text-xs text-slate-500">
                Inform your doctor or pharmacist of all concurrent medications, dietary supplements, and herbal products:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(medicine.drugInteractions || [
                  'Concomitant agents metabolized via overlapping Cytochrome P450 hepatic pathways.',
                  'Alcohol or central nervous system depressants which can amplify drowsiness.',
                  'Anticoagulants or antiplatelet agents requiring bleeding monitoring.',
                  'Specific herbal supplements like St. John’s Wort or high-dose Vitamin E.'
                ]).map((inter, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-amber-50/50 border border-amber-100 text-xs text-amber-950 flex items-start gap-2.5">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{inter}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 9. Mechanism of Action */}
            <section id="how-it-works" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg border-b border-slate-100 pb-3">
                <Zap className="h-5 w-5 text-emerald-600" />
                <h2>9. Mechanism of Action &amp; Pharmacodynamics</h2>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
                {medicine.howItWorks ||
                  `${medicine.name} exerts its therapeutic effect by selectively binding to specific physiological receptors or enzymatic pathways, modulating biochemical cascades to alleviate clinical symptoms and stabilize the diagnosed condition.`}
              </p>
            </section>

            {/* 10. Storage & Safe Handling */}
            <section id="storage" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg border-b border-slate-100 pb-3">
                <Thermometer className="h-5 w-5 text-teal-600" />
                <h2>10. Storage &amp; Safe Handling Guidelines</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {(medicine.storage || [
                  'Store at controlled room temperature (20°C to 25°C / 68°F to 77°F).',
                  'Keep in the original packaging away from direct moisture, sunlight, and heat.',
                  'Store securely out of reach and sight of children and household pets.',
                  'Safely discard expired or unused medicines; do not pour down wastewater drains.'
                ]).map((rule, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 11. When to Seek Care */}
            <section id="seek-care" className="rounded-3xl border border-rose-200 bg-rose-50/40 p-6 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-rose-950 font-bold text-base sm:text-lg border-b border-rose-200 pb-3">
                <AlertCircle className="h-5 w-5 text-rose-600" />
                <h2>11. When to Seek Immediate Medical Care</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {(medicine.whenToSeeDoctor || [
                  'Severe allergic reaction (anaphylaxis): facial/throat swelling, acute wheezing, severe hives.',
                  'Unexplained jaundice, yellowing of skin or eyes, or severe right upper quadrant abdominal pain.',
                  'Symptoms worsen significantly or do not improve within the expected therapeutic timeframe.',
                  'Severe dizziness, fainting spells, irregular heartbeat, or chest tightness.'
                ]).map((warn, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-white border border-rose-200 text-rose-950 flex items-start gap-2.5 shadow-2xs">
                    <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                    <span className="font-medium leading-relaxed">{warn}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 12. Clinical FAQs */}
            <section id="faq" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg border-b border-slate-100 pb-3">
                <HelpCircle className="h-5 w-5 text-emerald-600" />
                <h2>12. Frequently Asked Clinical Questions</h2>
              </div>

              <div className="space-y-3">
                {(medicine.faqs || [
                  {
                    question: `How long does it take for ${medicine.name} to start working?`,
                    answer: `Onset of action depends on the formulation and dosage, but therapeutic effects typically commence within 30 minutes to a few hours following administration.`
                  },
                  {
                    question: `Can I drink alcohol while taking ${medicine.name}?`,
                    answer: `It is strongly advised to avoid or strictly limit alcohol consumption during treatment to prevent adverse drug interactions, dizziness, and organ strain.`
                  },
                  {
                    question: `Is ${medicine.name} safe during pregnancy or breastfeeding?`,
                    answer: `Always consult your obstetrician or healthcare professional before taking ${medicine.name} during pregnancy or lactation to evaluate the clinical risk-benefit ratio.`
                  }
                ]).map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-start gap-2">
                      <span className="text-emerald-700 font-black">Q:</span>
                      <span>{faq.question}</span>
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-600 pl-4">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 13. Alternatives & Related */}
            <section id="alternatives" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg border-b border-slate-100 pb-3">
                <Link2 className="h-5 w-5 text-indigo-600" />
                <h2>13. Therapeutic Alternatives &amp; Related Medications</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {(medicine.alternatives || [
                  `Other approved medications within the ${medicine.therapeuticGroup || medicine.category} class.`,
                  `Alternative first-line and second-line therapeutic agents recommended in clinical practice guidelines.`,
                  `Non-pharmacological lifestyle and dietary interventions tailored to the condition.`
                ]).map((alt, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-800 flex items-start gap-2.5">
                    <Pill className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{alt}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 14. Sources & Compendia */}
            <section id="sources" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-soft space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base border-b border-slate-100 pb-2">
                <FileText className="h-4.5 w-4.5 text-slate-600" />
                <h2>14. Pharmacological Sources &amp; Compendia</h2>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Information compiled from official international pharmacopeias (USP, BP, IP), clinical drug reference manuals (BNF, DailyMed, FDA Prescribing Information), and peer-reviewed pharmacology literature.
              </p>
            </section>

            {/* 15. Medical Disclaimer */}
            <div id="disclaimer" className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 text-xs text-amber-950 leading-relaxed">
              <strong className="block mb-1 font-bold text-amber-900">Official Clinical Disclaimer:</strong>
              {medicine.disclaimer ||
                'This clinical medicine monograph is provided strictly for educational and informational purposes. It is not medical advice, diagnosis, or prescription guidance. Always consult a qualified healthcare professional, doctor, or licensed pharmacist before starting, stopping, or altering any medication.'}
            </div>

            {/* Next / Related Medicines Navigation Strip */}
            {related.length > 0 && (
              <nav className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row" aria-label="Related medicines">
                <div className="flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Next related medicine</p>
                  <button
                    type="button"
                    onClick={() => onOpenMedicine(related[0].id)}
                    className="group mt-1.5 flex w-full items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 text-left shadow-soft transition hover:border-emerald-300 hover:shadow-lift cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:-translate-x-0.5" />
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-bold text-slate-800 group-hover:text-emerald-800">
                        {related[0].name}
                      </span>
                      <span className="block text-[11px] text-slate-500">{related[0].category}</span>
                    </span>
                  </button>
                </div>

                <div className="flex-1 text-right">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">More in this class</p>
                  <button
                    type="button"
                    onClick={() => onOpenMedicine(related[1]?.id || related[0].id)}
                    className="group mt-1.5 flex w-full items-center justify-end gap-2 rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 text-right shadow-soft transition hover:border-emerald-300 hover:shadow-lift cursor-pointer"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-bold text-slate-800 group-hover:text-emerald-800">
                        {related[1]?.name || related[0].name}
                      </span>
                      <span className="block text-[11px] text-slate-500">
                        {related[1]?.category || related[0].category}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5" />
                  </button>
                </div>
              </nav>
            )}
          </article>

          {/* ---------------- Right Sticky Sidebar ---------------- */}
          <aside className="hidden lg:block" aria-label="On this page">
            <div className="sticky top-24 space-y-4">
              {/* Table of Contents */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft">
                <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  On this page
                </p>
                <nav className="space-y-0.5 max-h-[60vh] overflow-y-auto scrollbar-none">
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
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <span className={activeSection === item.id ? 'text-emerald-600' : 'text-slate-400'}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </a>
                  ))}
                </nav>
              </div>

              {/* AI Helper Callout */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
                <p className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                  <Bot className="h-4 w-4 text-emerald-600" />
                  Need a plain explanation?
                </p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-emerald-900/80">
                  Ask GlobalHealth AI to break down dosages, safety precautions, or compare with alternative treatments.
                </p>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleAsk(`Explain ${medicine.name} simply.`)}
                  className="mt-3 w-full text-xs font-bold bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50"
                >
                  Ask AI Now
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export const MedicineDetailSkeleton: React.FC = () => (
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
    <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_270px]">
      <div className="space-y-6">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
      <Skeleton className="hidden h-80 lg:block" />
    </div>
  </div>
);
