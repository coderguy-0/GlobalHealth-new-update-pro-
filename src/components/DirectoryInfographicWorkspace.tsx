import React, { useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Award,
  BedDouble,
  BookOpen,
  Building2,
  ChefHat,
  CheckCircle2,
  Clock,
  FlaskConical,
  HeartPulse,
  Layers,
  MapPin,
  Newspaper,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  Zap,
} from 'lucide-react';
import { NavigationTab } from '../types';
import {
  DOCTORS,
  HEALTH_CONDITIONS,
  HOSPITALS,
  MEDICAL_TESTS,
  MEDICINES,
  NEWS_ARTICLES,
  RECIPES,
} from '../data/healthData';
import { DiseaseInfographic } from './DiseaseInfographic';
import { MedicineInfographic } from './MedicineInfographic';
import { WorkspaceOverlay } from './WorkspaceOverlay';
import { newsService } from '../services/newsService';

export type DirectoryInfographicKind =
  | 'diseases'
  | 'medicines'
  | 'medical-tests'
  | 'nutrition'
  | 'news'
  | 'doctors';

interface DirectoryInfographicWorkspaceProps {
  kind: DirectoryInfographicKind;
  onClose: () => void;
  onOpenFullDirectory: (tab: NavigationTab) => void;
}

const META: Record<
  DirectoryInfographicKind,
  { title: string; subtitle: string; badge: string; tab: NavigationTab }
> = {
  diseases: {
    title: 'Disease and condition — Clinical Infographic',
    subtitle: 'Pathophysiology, organ impact, staging and care matrix',
    badge: 'Visual Monograph',
    tab: 'diseases',
  },
  medicines: {
    title: 'Medicine & Drugs — Pharmacology Infographic',
    subtitle: 'Mechanism flow, pharmacokinetics, dosing and safety matrix',
    badge: 'Clinical PK',
    tab: 'medicines',
  },
  'medical-tests': {
    title: 'Medical test — Diagnostics Infographic',
    subtitle: 'Sample → assay → range → clinical interpretation',
    badge: 'Lab Pathway',
    tab: 'medical-tests',
  },
  nutrition: {
    title: 'Nutrition and recipes — Plate Infographic',
    subtitle: 'Macros, therapeutic diets and evidence-based meals',
    badge: 'Culinary Science',
    tab: 'nutrition',
  },
  news: {
    title: 'News health and research — Evidence Infographic',
    subtitle: 'Peer-reviewed findings, trial phases and clinical takeaways',
    badge: 'Evidence Map',
    tab: 'news',
  },
  doctors: {
    title: 'Hospital and doctors — Care Network Infographic',
    subtitle: 'Beds, trauma level, specialties and verified clinicians',
    badge: 'Enterprise Map',
    tab: 'doctors',
  },
};

export const DirectoryInfographicWorkspace: React.FC<DirectoryInfographicWorkspaceProps> = ({
  kind,
  onClose,
  onOpenFullDirectory,
}) => {
  const meta = META[kind];

  return (
    <WorkspaceOverlay
      title={meta.title}
      subtitle={meta.subtitle}
      badge={meta.badge}
      onClose={onClose}
    >
      {kind === 'diseases' && (
        <DiseaseHub onOpenFullDirectory={() => onOpenFullDirectory('diseases')} />
      )}
      {kind === 'medicines' && (
        <MedicineHub onOpenFullDirectory={() => onOpenFullDirectory('medicines')} />
      )}
      {kind === 'medical-tests' && (
        <TestsHub onOpenFullDirectory={() => onOpenFullDirectory('medical-tests')} />
      )}
      {kind === 'nutrition' && (
        <NutritionHub onOpenFullDirectory={() => onOpenFullDirectory('nutrition')} />
      )}
      {kind === 'news' && <NewsHub onOpenFullDirectory={() => onOpenFullDirectory('news')} />}
      {kind === 'doctors' && (
        <HospitalsHub onOpenFullDirectory={() => onOpenFullDirectory('doctors')} />
      )}
    </WorkspaceOverlay>
  );
};

const HubFooter: React.FC<{ label: string; onOpen: () => void }> = ({ label, onOpen }) => (
  <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
    <p className="text-xs text-slate-500">Educational infographic · not a diagnosis or prescription.</p>
    <button
      type="button"
      onClick={onOpen}
      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
    >
      Open full {label} directory
      <ArrowRight className="h-3.5 w-3.5" />
    </button>
  </div>
);

const Metric: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({
  label,
  value,
  icon,
}) => (
  <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3 backdrop-blur-md">
    <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/70">
      {icon}
      {label}
    </div>
    <div className="text-lg font-black tracking-tight text-white">{value}</div>
  </div>
);

const DiseaseHub: React.FC<{ onOpenFullDirectory: () => void }> = ({ onOpenFullDirectory }) => {
  const [selectedId, setSelectedId] = useState(HEALTH_CONDITIONS[0]?.id || '');
  const selected = HEALTH_CONDITIONS.find((c) => c.id === selectedId) || HEALTH_CONDITIONS[0];
  const specialties = useMemo(() => {
    const map = new Map<string, number>();
    HEALTH_CONDITIONS.forEach((c) => map.set(c.category, (map.get(c.category) || 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, []);

  return (
    <div className="bg-rose-50/40">
      <div className="bg-gradient-to-br from-rose-900 via-slate-900 to-rose-950 px-5 py-7 text-white sm:px-8">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-rose-500/30 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider">
          <Stethoscope className="h-3.5 w-3.5" /> Disease and condition
        </div>
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Clinical disease infographic</h1>
        <p className="mt-1 max-w-2xl text-sm text-rose-100/80">
          Select a condition to open its full pathophysiology pipeline, organ map, staging spectrum and care matrix.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label="Guides" value={`${HEALTH_CONDITIONS.length}`} icon={<BookOpen className="h-3 w-3" />} />
          <Metric label="Specialties" value={`${specialties.length}`} icon={<Layers className="h-3 w-3" />} />
          <Metric label="Red-flag protocols" value="FAST / ABC" icon={<ShieldCheck className="h-3 w-3" />} />
          <Metric label="Visual stages" value="4-step flow" icon={<Zap className="h-3 w-3" />} />
        </div>
      </div>

      <div className="px-4 py-6 sm:px-8">
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {HEALTH_CONDITIONS.slice(0, 12).map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedId(c.id)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-bold transition cursor-pointer ${
                selectedId === c.id
                  ? 'border-rose-600 bg-rose-600 text-white'
                  : 'border-rose-200 bg-white text-rose-900 hover:bg-rose-50'
              }`}
            >
              {c.title.split('(')[0].trim()}
            </button>
          ))}
        </div>
        {selected && <DiseaseInfographic condition={selected} />}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {specialties.slice(0, 6).map(([name, count]) => (
            <div key={name} className="rounded-2xl border border-rose-100 bg-white px-4 py-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Specialty cluster</div>
              <div className="text-sm font-extrabold text-slate-900">{name}</div>
              <div className="text-xs text-slate-500">{count} clinical guides</div>
            </div>
          ))}
        </div>
        <HubFooter label="disease" onOpen={onOpenFullDirectory} />
      </div>
    </div>
  );
};

const MedicineHub: React.FC<{ onOpenFullDirectory: () => void }> = ({ onOpenFullDirectory }) => {
  const [selectedId, setSelectedId] = useState(MEDICINES[0]?.id || '');
  const selected = MEDICINES.find((m) => m.id === selectedId) || MEDICINES[0];
  const otc = MEDICINES.filter((m) => m.overTheCounter).length;

  return (
    <div className="bg-violet-50/40">
      <div className="bg-gradient-to-br from-violet-900 via-slate-900 to-indigo-950 px-5 py-7 text-white sm:px-8">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-violet-500/30 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider">
          <Pill className="h-3.5 w-3.5" /> Medicine &amp; Drugs
        </div>
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Pharmacology infographic</h1>
        <p className="mt-1 max-w-2xl text-sm text-violet-100/80">
          Mechanism flowchart, target organs, DOs &amp; DON’Ts and 24-hour dosing gauge for each listed medicine.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label="Medicines" value={`${MEDICINES.length}`} icon={<Pill className="h-3 w-3" />} />
          <Metric label="OTC options" value={`${otc}`} icon={<CheckCircle2 className="h-3 w-3" />} />
          <Metric label="PK panels" value="Onset · Peak · t½" icon={<Activity className="h-3 w-3" />} />
          <Metric label="Safety" value="Max daily cap" icon={<ShieldCheck className="h-3 w-3" />} />
        </div>
      </div>
      <div className="px-4 py-6 sm:px-8">
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {MEDICINES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedId(m.id)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-bold transition cursor-pointer ${
                selectedId === m.id
                  ? 'border-violet-600 bg-violet-600 text-white'
                  : 'border-violet-200 bg-white text-violet-900 hover:bg-violet-50'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
        {selected && <MedicineInfographic medicine={selected} />}
        <HubFooter label="medicine" onOpen={onOpenFullDirectory} />
      </div>
    </div>
  );
};

const TestsHub: React.FC<{ onOpenFullDirectory: () => void }> = ({ onOpenFullDirectory }) => {
  const [selectedId, setSelectedId] = useState(MEDICAL_TESTS[0]?.id || '');
  const selected = MEDICAL_TESTS.find((t) => t.id === selectedId) || MEDICAL_TESTS[0];
  const pipeline = [
    { step: '01', title: 'Preparation', body: selected.preparation, icon: <Clock className="h-4 w-4" /> },
    { step: '02', title: 'Sample', body: selected.sampleType, icon: <FlaskConical className="h-4 w-4" /> },
    { step: '03', title: 'Turnaround', body: selected.timeToResults, icon: <Zap className="h-4 w-4" /> },
    { step: '04', title: 'Reference range', body: selected.normalRange, icon: <Activity className="h-4 w-4" /> },
  ];

  return (
    <div className="bg-cyan-50/40">
      <div className="bg-gradient-to-br from-cyan-900 via-slate-900 to-sky-950 px-5 py-7 text-white sm:px-8">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-cyan-500/30 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider">
          <FlaskConical className="h-3.5 w-3.5" /> Medical test
        </div>
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Diagnostics infographic</h1>
        <p className="mt-1 max-w-2xl text-sm text-cyan-100/80">
          Visual lab pathway from preparation and specimen type through result window and clinical range.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label="Tests" value={`${MEDICAL_TESTS.length}`} icon={<FlaskConical className="h-3 w-3" />} />
          <Metric label="Pathway" value="4 stages" icon={<Layers className="h-3 w-3" />} />
          <Metric label="Sample" value="Blood · Urine · ECG" icon={<HeartPulse className="h-3 w-3" />} />
          <Metric label="Goal" value="Interpret, not guess" icon={<ShieldCheck className="h-3 w-3" />} />
        </div>
      </div>
      <div className="px-4 py-6 sm:px-8 space-y-6">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {MEDICAL_TESTS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedId(t.id)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-bold transition cursor-pointer ${
                selectedId === t.id
                  ? 'border-cyan-700 bg-cyan-700 text-white'
                  : 'border-cyan-200 bg-white text-cyan-900 hover:bg-cyan-50'
              }`}
            >
              {t.name.split('(')[0].trim()}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-cyan-200 bg-white p-5 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-600">{selected.category}</div>
          <h2 className="text-xl font-black text-slate-900">{selected.name}</h2>
          <p className="mt-1 text-sm text-slate-600">{selected.purpose}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pipeline.map((p) => (
            <div key={p.step} className="rounded-2xl border border-cyan-100 bg-white p-4 shadow-xs">
              <div className="mb-2 flex items-center justify-between">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-cyan-100 text-cyan-800">{p.icon}</span>
                <span className="text-[10px] font-black text-cyan-500">{p.step}</span>
              </div>
              <div className="text-xs font-extrabold text-slate-900">{p.title}</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{p.body}</p>
            </div>
          ))}
        </div>

        {selected.description && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            {selected.description}
          </div>
        )}
        <HubFooter label="lab" onOpen={onOpenFullDirectory} />
      </div>
    </div>
  );
};

const NutritionHub: React.FC<{ onOpenFullDirectory: () => void }> = ({ onOpenFullDirectory }) => {
  const plate = [
    { label: 'Vegetables & fibre', pct: '40%', color: 'bg-lime-500', note: 'Half the plate — polyphenols, volume, satiety' },
    { label: 'Quality protein', pct: '30%', color: 'bg-emerald-600', note: 'Fish, legumes, dairy, eggs, lean meat' },
    { label: 'Smart carbs', pct: '20%', color: 'bg-amber-400', note: 'Whole grains, fruit, controlled portions' },
    { label: 'Healthy fats', pct: '10%', color: 'bg-teal-500', note: 'Olive oil, nuts, seeds, avocado' },
  ];

  return (
    <div className="bg-lime-50/40">
      <div className="bg-gradient-to-br from-lime-800 via-emerald-900 to-slate-900 px-5 py-7 text-white sm:px-8">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-lime-500/30 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider">
          <ChefHat className="h-3.5 w-3.5" /> Nutrition and recipes
        </div>
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Therapeutic plate infographic</h1>
        <p className="mt-1 max-w-2xl text-sm text-lime-100/80">
          Visual plate model plus featured recipes tagged for heart, diabetes, keto and anti-inflammatory eating.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label="Recipes" value={`${RECIPES.length}`} icon={<ChefHat className="h-3 w-3" />} />
          <Metric label="Plate model" value="40 / 30 / 20 / 10" icon={<Layers className="h-3 w-3" />} />
          <Metric label="Focus" value="MIND / DASH" icon={<HeartPulse className="h-3 w-3" />} />
          <Metric label="Goal" value="Metabolic flexibility" icon={<Sparkles className="h-3 w-3" />} />
        </div>
      </div>
      <div className="px-4 py-6 sm:px-8 space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {plate.map((p) => (
            <div key={p.label} className="overflow-hidden rounded-2xl border border-lime-100 bg-white shadow-xs">
              <div className={`h-2 ${p.color}`} />
              <div className="p-4">
                <div className="text-2xl font-black text-slate-900">{p.pct}</div>
                <div className="text-xs font-extrabold text-lime-800">{p.label}</div>
                <p className="mt-1 text-[11px] text-slate-500">{p.note}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {RECIPES.map((r) => (
            <div key={r.id} className="overflow-hidden rounded-2xl border border-lime-100 bg-white shadow-xs">
              <div className="h-36 w-full overflow-hidden bg-lime-100">
                <img src={r.imageUrl} alt={r.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-extrabold text-slate-900">{r.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-slate-600">{r.description}</p>
                <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-bold">
                  <span className="rounded-md bg-lime-50 px-2 py-0.5 text-lime-800">{r.calories} kcal</span>
                  <span className="rounded-md bg-slate-50 px-2 py-0.5 text-slate-700">P {r.protein}</span>
                  <span className="rounded-md bg-slate-50 px-2 py-0.5 text-slate-700">C {r.carbs}</span>
                  <span className="rounded-md bg-slate-50 px-2 py-0.5 text-slate-700">F {r.fats}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <HubFooter label="nutrition" onOpen={onOpenFullDirectory} />
      </div>
    </div>
  );
};

const NewsHub: React.FC<{ onOpenFullDirectory: () => void }> = ({ onOpenFullDirectory }) => {
  const articles = useMemo(() => {
    try {
      const published = newsService.getArticles().filter((a) => a.status === 'published');
      return published.length ? published : NEWS_ARTICLES;
    } catch {
      return NEWS_ARTICLES;
    }
  }, []);

  const pipeline = [
    { title: 'Primary source', body: 'Peer-reviewed journals, phase-3 trials, meta-analyses' },
    { title: 'Evidence grade', body: 'Trial design, sample, endpoints, limitations' },
    { title: 'Clinical takeaway', body: 'What changes (or does not change) daily care' },
    { title: 'Public translation', body: 'Plain-language summary without overclaiming' },
  ];

  return (
    <div className="bg-teal-50/40">
      <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-emerald-950 px-5 py-7 text-white sm:px-8">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-teal-500/30 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider">
          <Newspaper className="h-3.5 w-3.5" /> News health and research
        </div>
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Evidence infographic</h1>
        <p className="mt-1 max-w-2xl text-sm text-teal-100/80">
          How a finding moves from journal to bedside — plus the latest verified research briefs.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label="Briefs" value={`${articles.length}`} icon={<Newspaper className="h-3 w-3" />} />
          <Metric label="Filter" value="Peer-reviewed" icon={<Award className="h-3 w-3" />} />
          <Metric label="Pipeline" value="4 gates" icon={<Layers className="h-3 w-3" />} />
          <Metric label="Rule" value="No hype" icon={<ShieldCheck className="h-3 w-3" />} />
        </div>
      </div>
      <div className="px-4 py-6 sm:px-8 space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pipeline.map((p, i) => (
            <div key={p.title} className="rounded-2xl border border-teal-100 bg-white p-4">
              <div className="text-[10px] font-black text-teal-500">0{i + 1}</div>
              <div className="text-sm font-extrabold text-slate-900">{p.title}</div>
              <p className="mt-1 text-xs text-slate-600">{p.body}</p>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {articles.slice(0, 6).map((a) => (
            <div key={a.id} className="rounded-2xl border border-teal-100 bg-white p-4">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-teal-700">
                <span className="rounded-md bg-teal-50 px-2 py-0.5">{a.category}</span>
                <span className="text-slate-400">{a.source}</span>
                <span className="text-slate-400">{a.date}</span>
              </div>
              <h3 className="mt-1 text-sm font-extrabold text-slate-900">{a.title}</h3>
              <p className="mt-1 text-xs text-slate-600">{a.summary}</p>
            </div>
          ))}
        </div>
        <HubFooter label="news" onOpen={onOpenFullDirectory} />
      </div>
    </div>
  );
};

const HospitalsHub: React.FC<{ onOpenFullDirectory: () => void }> = ({ onOpenFullDirectory }) => {
  const beds = HOSPITALS.reduce((s, h) => s + (h.totalBeds || 0), 0);
  const icu = HOSPITALS.reduce((s, h) => s + (h.icuBeds || 0), 0);

  return (
    <div className="bg-emerald-50/40">
      <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 px-5 py-7 text-white sm:px-8">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/30 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider">
          <Building2 className="h-3.5 w-3.5" /> Hospital and doctors
        </div>
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Care-network infographic</h1>
        <p className="mt-1 max-w-2xl text-sm text-emerald-100/80">
          Verified hospitals, trauma capacity and specialist coverage — a visual map of the GlobalHealth network.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label="Hospitals" value={`${HOSPITALS.length}`} icon={<Building2 className="h-3 w-3" />} />
          <Metric label="Doctors" value={`${DOCTORS.length}`} icon={<Users className="h-3 w-3" />} />
          <Metric label="Beds" value={`${beds.toLocaleString()}`} icon={<BedDouble className="h-3 w-3" />} />
          <Metric label="ICU" value={`${icu}`} icon={<HeartPulse className="h-3 w-3" />} />
        </div>
      </div>
      <div className="px-4 py-6 sm:px-8 space-y-6">
        <div className="grid gap-4 lg:grid-cols-2">
          {HOSPITALS.map((h) => (
            <div key={h.id} className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-xs">
              <div className="h-32 w-full overflow-hidden bg-emerald-100">
                <img src={h.imageUrl} alt={h.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900">{h.name}</h3>
                  {h.verified && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      Verified
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                  <MapPin className="h-3 w-3" /> {h.city}, {h.country}
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="rounded-xl bg-slate-50 py-2">
                    <div className="font-black text-slate-900">{h.totalBeds}</div>
                    <div className="text-slate-500">Beds</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 py-2">
                    <div className="font-black text-slate-900">{h.icuBeds}</div>
                    <div className="text-slate-500">ICU</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 py-2">
                    <div className="font-black text-slate-900">{h.traumaLevel}</div>
                    <div className="text-slate-500">Trauma</div>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {h.specialties.slice(0, 4).map((s) => (
                    <span key={s} className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <h3 className="mb-3 text-sm font-extrabold text-slate-900">Verified specialists</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DOCTORS.map((d) => (
              <div key={d.id} className="rounded-2xl border border-emerald-100 bg-white p-4">
                <div className="text-sm font-extrabold text-slate-900">{d.name}</div>
                <div className="text-xs font-semibold text-emerald-800">{d.specialty}</div>
                <div className="mt-1 text-[11px] text-slate-500">{d.hospital}</div>
                <div className="mt-2 text-[11px] font-bold text-slate-700">
                  {d.experienceYears} yrs · {d.rating} ★ · {d.consultationFee}
                </div>
              </div>
            ))}
          </div>
        </div>
        <HubFooter label="hospital" onOpen={onOpenFullDirectory} />
      </div>
    </div>
  );
};
