import React, { useState } from 'react';
import {
  Activity,
  Stethoscope,
  FlaskConical,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Bot,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { NavigationTab } from '../../types';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';

interface SymptomTriageNavigatorProps {
  onTabChange: (tab: NavigationTab) => void;
}

interface SymptomProfile {
  id: string;
  symptomName: string;
  category: string;
  description: string;
  urgency: 'routine' | 'moderate' | 'urgent';
  specialty: string;
  recommendedTests: string[];
  relatedConditions: string[];
  guidance: string;
}

const SYMPTOM_DATA: SymptomProfile[] = [
  {
    id: 'sym-cardio',
    symptomName: 'Chest Pain / Palpitations',
    category: 'Cardiovascular',
    description: 'Sensations of rapid fluttering, pressure, or irregular heartbeats.',
    urgency: 'urgent',
    specialty: 'Cardiologist',
    recommendedTests: ['ECG (Electrocardiogram)', 'Troponin-I Test', 'Lipid Profile', 'Echocardiogram'],
    relatedConditions: ['Angina Pectoris', 'Essential Hypertension', 'Arrhythmia'],
    guidance: 'Sudden, crushing chest pain radiating to the arm or jaw requires emergency care (call emergency SOS immediately).',
  },
  {
    id: 'sym-pulmo',
    symptomName: 'Shortness of Breath & Cough',
    category: 'Respiratory',
    description: 'Difficulty breathing, persistent dry/productive cough, or wheezing.',
    urgency: 'moderate',
    specialty: 'Pulmonologist',
    recommendedTests: ['Spirometry / PFT', 'Chest X-Ray / CT', 'Complete Blood Count (CBC)', 'Peak Flow'],
    relatedConditions: ['Bronchial Asthma', 'COPD', 'Pneumonia'],
    guidance: 'Evaluate airway inflammation and baseline oxygen saturation with a qualified respiratory specialist.',
  },
  {
    id: 'sym-endocrine',
    symptomName: 'Excessive Thirst & Fatigue',
    category: 'Metabolic & Endocrine',
    description: 'Unusual lethargy, frequent urination, dry mouth, or unexplained weight shifts.',
    urgency: 'routine',
    specialty: 'Endocrinologist',
    recommendedTests: ['HbA1c (Glycated Hemoglobin)', 'Fasting Blood Glucose', 'Serum Creatinine', 'Thyroid Profile (TSH)'],
    relatedConditions: ['Type 2 Diabetes Mellitus', 'Hypothyroidism', 'Metabolic Syndrome'],
    guidance: 'Comprehensive metabolic panel and glycemic tracking help evaluate insulin sensitivity and organ function.',
  },
  {
    id: 'sym-neuro',
    symptomName: 'Severe Headaches & Dizziness',
    category: 'Neurological',
    description: 'Throbbing cranial discomfort, light sensitivity, or balance instability.',
    urgency: 'moderate',
    specialty: 'Neurologist',
    recommendedTests: ['MRI / CT Brain', 'Blood Pressure Series', 'Serum Electrolytes', 'Eye Fundus Exam'],
    relatedConditions: ['Migraine with Aura', 'Tension Headache', 'Vertigo Syndrome'],
    guidance: 'Track trigger factors, sleep cycles, and hydration while obtaining formal neurological consultation.',
  },
  {
    id: 'sym-gastro',
    symptomName: 'Abdominal Pain & Acid Reflux',
    category: 'Gastroenterology',
    description: 'Heartburn, epigastric burning, bloating, or digestive irregularity.',
    urgency: 'routine',
    specialty: 'Gastroenterologist',
    recommendedTests: ['Liver Function Test (LFT)', 'Upper GI Endoscopy', 'H. Pylori Antigen', 'Abdominal Ultrasound'],
    relatedConditions: ['GERD', 'Gastritis', 'Irritable Bowel Syndrome'],
    guidance: 'Dietary adjustments, meal timing, and clinical GI evaluation prevent chronic esophageal irritation.',
  },
  {
    id: 'sym-ortho',
    symptomName: 'Joint Pain & Morning Stiffness',
    category: 'Musculoskeletal',
    description: 'Aching knee/hip/finger joints, reduced range of motion, or swelling.',
    urgency: 'routine',
    specialty: 'Orthopedist / Rheumatologist',
    recommendedTests: ['Uric Acid Test', 'Rheumatoid Factor (RF)', 'X-Ray of Joint', 'CRP / ESR Inflammatory Markers'],
    relatedConditions: ['Osteoarthritis', 'Gouty Arthritis', 'Rheumatoid Arthritis'],
    guidance: 'Early physical therapy and targeted joint mobility routines maintain long-term cartilage integrity.',
  },
  {
    id: 'sym-derma',
    symptomName: 'Persistent Skin Rashes & Itching',
    category: 'Dermatology',
    description: 'Erythematous plaques, skin scaling, flare-ups, or allergic hives.',
    urgency: 'routine',
    specialty: 'Dermatologist',
    recommendedTests: ['Skin Scraping / Biopsy', 'Total IgE / Allergy Panel', 'CBC with Eosinophil Count'],
    relatedConditions: ['Atopic Dermatitis', 'Psoriasis Vulgaris', 'Contact Dermatitis'],
    guidance: 'Dermatological assessment identifies barrier dysfunction, contact allergens, or autoimmune triggers.',
  },
];

export const SymptomTriageNavigator: React.FC<SymptomTriageNavigatorProps> = ({ onTabChange }) => {
  const [selectedId, setSelectedId] = useState<string>(SYMPTOM_DATA[0].id);

  const selected = SYMPTOM_DATA.find((s) => s.id === selectedId) || SYMPTOM_DATA[0];

  return (
    <section className="gh-section bg-slate-50/70" aria-labelledby="triage-title">
      <div className="gh-container">
        <SectionHeading
          id="triage-title"
          eyebrow="Interactive Clinical Navigator"
          title="Match Symptoms to Doctors &amp; Diagnostic Tests"
          description="Explore common clinical presentations to discover recommended medical specialties, diagnostic investigations, and verified next steps."
          align="center"
        />

        {/* Symmetrical 2-Column Interactive Grid */}
        <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:items-stretch">
          {/* Left Column: Symptom Selector List (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between px-2 pb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Select Observed Symptom
              </span>
              <span className="text-[11px] font-semibold text-medical-600">
                {SYMPTOM_DATA.length} clinical profiles
              </span>
            </div>

            <div className="space-y-2">
              {SYMPTOM_DATA.map((item) => {
                const isActive = item.id === selected.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`group flex w-full items-center justify-between rounded-2xl p-3.5 text-left transition duration-200 ${
                      isActive
                        ? 'border-2 border-medical-600 bg-white shadow-soft text-medical-950 font-bold'
                        : 'border border-slate-200/80 bg-white/80 hover:border-slate-300 hover:bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition ${
                          isActive
                            ? 'bg-medical-600 text-white'
                            : 'bg-slate-100 text-slate-500 group-hover:bg-medical-50 group-hover:text-medical-600'
                        }`}
                      >
                        <Activity className="h-4.5 w-4.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{item.symptomName}</p>
                        <p className="truncate text-[11px] text-slate-400 mt-0.5">{item.category}</p>
                      </div>
                    </div>

                    <ChevronRight
                      className={`h-4 w-4 shrink-0 transition ${
                        isActive ? 'text-medical-600 translate-x-0.5' : 'text-slate-300 group-hover:text-slate-500'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* AI Assistant Callout */}
            <div className="mt-4 rounded-2xl border border-medical-200/70 bg-gradient-to-r from-medical-500/10 to-teal-500/10 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-4.5 w-4.5 text-medical-600" />
                  <span className="text-xs font-bold text-slate-800">Unsure about your symptoms?</span>
                </div>
                <button
                  type="button"
                  onClick={() => onTabChange('ai-assistant')}
                  className="text-xs font-bold text-medical-700 hover:underline inline-flex items-center gap-1"
                >
                  Ask AI <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Symmetrical Clinical Detail Matrix (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-card">
            <div>
              {/* Header Badge & Title */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-medical-50 px-3 py-1 text-[11px] font-bold text-medical-700">
                    <Sparkles className="h-3.5 w-3.5" />
                    {selected.category} Profile
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-slate-900">{selected.symptomName}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      selected.urgency === 'urgent'
                        ? 'bg-rose-100 text-rose-800'
                        : selected.urgency === 'moderate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {selected.urgency === 'urgent' ? '● High Priority' : selected.urgency === 'moderate' ? '● Moderate' : '● Routine Check'}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-600">{selected.description}</p>

              {/* 2-Column Symmetrical Triage Breakdown */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {/* Specialty Card */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-medical-700">
                    <Stethoscope className="h-4 w-4" />
                    Managing Specialty
                  </div>
                  <p className="mt-2 text-base font-bold text-slate-900">{selected.specialty}</p>
                  <p className="mt-1 text-xs text-slate-500">Certified clinician specializing in {selected.category.toLowerCase()} disorders.</p>
                </div>

                {/* Related Conditions Card */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-medical-700">
                    <Activity className="h-4 w-4" />
                    Related Conditions
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selected.relatedConditions.map((cond) => (
                      <span key={cond} className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-200/80">
                        {cond}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Diagnostic Investigations */}
              <div className="mt-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <FlaskConical className="h-4 w-4 text-medical-600" />
                  Recommended Diagnostic Tests
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {selected.recommendedTests.map((test) => (
                    <div key={test} className="flex items-center gap-2 rounded-xl border border-slate-200/70 bg-white p-2.5 text-xs font-semibold text-slate-800">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{test}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinical Guidance Footnote */}
              <div className="mt-6 rounded-2xl border border-amber-200/60 bg-amber-50/60 p-3.5 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
                <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{selected.guidance}</span>
              </div>
            </div>

            {/* Symmetrical Action Cluster */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                fullWidth
                onClick={() => onTabChange('doctors')}
              >
                <Stethoscope className="h-4 w-4" />
                Find {selected.specialty}
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => onTabChange('medical-tests')}
              >
                <FlaskConical className="h-4 w-4 text-medical-600" />
                Explore Lab Tests
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
