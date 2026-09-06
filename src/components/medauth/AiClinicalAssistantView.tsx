import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  Activity,
  Heart,
  HelpCircle,
  Send,
  FileCheck
} from 'lucide-react';
import { DoctorProfile, PatientRecord } from '../../types/medauth';
import { samplePatients } from '../../data/samplePatients';

interface AiClinicalAssistantViewProps {
  doctor: DoctorProfile;
  activePatient?: PatientRecord;
}

export const AiClinicalAssistantView: React.FC<AiClinicalAssistantViewProps> = ({
  doctor,
  activePatient = samplePatients[0]
}) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ddx' | 'interactions' | 'guidelines'>('ddx');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleRunAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisResult(
        `Clinical Evidence Summary for: "${query}"\n\n1. ACC/AHA 2026 Guideline Aligned: Recommended target systolic blood pressure < 130 mmHg in high-risk ASCVD cohorts.\n2. Pharmacotherapy: Dual therapy with DHP-CCB (Amlodipine) + ARB/ACEi shows superior outcome over monotherapy in patients with concurrent metabolic risk.\n3. Safety Check: No CYP3A4 inhibitors or QT-prolonging agents identified in current active medication regimen.`
      );
    }, 1200);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Clinical Decision Support Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            AI Clinical Assistant & Evidence Reference
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Differential diagnosis builder, drug-drug contraindication matrix, and ACC/AHA clinical pathways.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
            Model: Med-Audit-LLM v4.2
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-fit">
        <button
          onClick={() => setActiveTab('ddx')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'ddx' ? 'bg-emerald-700 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Differential Diagnosis (DDx)
        </button>
        <button
          onClick={() => setActiveTab('interactions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'interactions' ? 'bg-emerald-700 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Drug Interaction Matrix
        </button>
        <button
          onClick={() => setActiveTab('guidelines')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'guidelines' ? 'bg-emerald-700 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Clinical Guidelines
        </button>
      </div>

      {/* Query Bar */}
      <form onSubmit={handleRunAnalysis} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <label className="text-xs font-bold text-slate-900 block">
          Enter Clinical Query, Symptom Cluster, or Medication Combination
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Atorvastatin 80mg with Diltiazem in patient with Paroxysmal AFib..."
            className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
          />
          <button
            type="submit"
            disabled={analyzing}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{analyzing ? 'Evaluating...' : 'Query Clinical Engine'}</span>
          </button>
        </div>
      </form>

      {/* Result Display */}
      {analysisResult && (
        <div className="bg-white rounded-2xl border-2 border-emerald-500/40 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Algorithmic Clinical Decision Support Report</span>
          </div>
          <pre className="text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            {analysisResult}
          </pre>
        </div>
      )}

      {/* Default Clinical Evidence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Heart className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">2026 Primary Prevention ASCVD</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Consensus thresholds for high-intensity statin initiation in adults aged 40–75 with diabetes and LDL &gt; 70 mg/dL.
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Atrial Fibrillation Anticoagulation</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            CHA₂DS₂-VASc evaluation scoring for direct oral anticoagulant (DOAC) choice over Vitamin K antagonists.
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Dual Antiplatelet Therapy (DAPT)</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Post-PCI guideline durations (12 months post-ACS vs 6 months post-elective DES) with bleeding risk scores.
          </p>
        </div>
      </div>
    </div>
  );
};
