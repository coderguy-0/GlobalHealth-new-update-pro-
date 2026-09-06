import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Stethoscope,
  Share2,
  Printer,
  Bookmark,
  Calendar,
  User,
  Activity,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Info
} from 'lucide-react';
import { MedicalTest } from '../../types';
import {
  interpretTestResult,
  InterpretationInput,
  InterpretationResult
} from './interpretationEngine';

interface SingleTestInterpretationModalProps {
  test: MedicalTest;
  isOpen: boolean;
  onClose: () => void;
  onSaveToHistory?: (record: {
    testId: string;
    testName: string;
    value: string;
    unit: string;
    status: string;
    date: string;
  }) => void;
  onAskAI?: (prompt: string) => void;
}

export const SingleTestInterpretationModal: React.FC<SingleTestInterpretationModalProps> = ({
  test,
  isOpen,
  onClose,
  onSaveToHistory,
  onAskAI
}) => {
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState(test.units || 'mg/dL');
  const [customRangeLower, setCustomRangeLower] = useState('');
  const [customRangeUpper, setCustomRangeUpper] = useState('');
  const [age, setAge] = useState<number | undefined>(35);
  const [sex, setSex] = useState<'male' | 'female' | 'other'>('male');
  const [isPregnant, setIsPregnant] = useState(false);
  const [patientNotes, setPatientNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'simple' | 'clinical' | 'associations'>('simple');
  const [result, setResult] = useState<InterpretationResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Pre-fill initial defaults when test changes
  useEffect(() => {
    setValue('');
    setUnit(test.units || 'mg/dL');
    setResult(null);
    setSavedSuccess(false);

    // Parse initial default range limits into the inputs
    const numRule = test.interpretationRules?.numeric;
    if (numRule?.lowThreshold !== undefined) {
      setCustomRangeLower(String(numRule.lowThreshold));
    } else {
      setCustomRangeLower('');
    }
    if (numRule?.highThreshold !== undefined) {
      setCustomRangeUpper(String(numRule.highThreshold));
    } else {
      setCustomRangeUpper('');
    }
  }, [test]);

  if (!isOpen) return null;

  const handleInterpret = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    const input: InterpretationInput = {
      testId: test.id,
      testName: test.name,
      value: value.trim(),
      unit,
      customRangeLower: customRangeLower.trim(),
      customRangeUpper: customRangeUpper.trim(),
      age,
      sex,
      isPregnant,
      patientNotes
    };

    const res = interpretTestResult(test, input);
    setResult(res);
  };

  const handleSave = () => {
    if (!result) return;
    if (onSaveToHistory) {
      onSaveToHistory({
        testId: test.id,
        testName: test.name,
        value,
        unit,
        status: result.status,
        date: new Date().toLocaleDateString()
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600 text-white shadow-xs">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{test.name}</h3>
                {test.abbreviation && (
                  <span className="rounded-md bg-cyan-100 px-2 py-0.5 text-xs font-semibold text-cyan-800">
                    {test.abbreviation}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Automated Clinical Interpretation Engine & Demographic Range Balancer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Clinical Rule Notice */}
          <div className="flex items-start gap-3 rounded-xl bg-amber-50/80 border border-amber-200/70 p-3.5 text-xs text-amber-900">
            <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-950">Most Important Clinical Rule:</span> Reference intervals differ significantly between laboratory analyzers. If your printed report displays specific normal bounds, enter them below for the most precise analysis.
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleInterpret} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Test Value Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  Your Test Result Value <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5.8, 142, Negative"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:border-cyan-500 focus:outline-hidden focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              {/* Units Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Measurement Unit</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g. mg/dL, mmol/L"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-cyan-500 focus:outline-hidden focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              {/* Report-Specific Range Bounds */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Lab Report Range (Low - High)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="any"
                    placeholder="Min"
                    value={customRangeLower}
                    onChange={(e) => setCustomRangeLower(e.target.value)}
                    className="w-1/2 rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-800 focus:border-cyan-500 focus:outline-hidden"
                  />
                  <span className="text-slate-400 text-xs">to</span>
                  <input
                    type="number"
                    step="any"
                    placeholder="Max"
                    value={customRangeUpper}
                    onChange={(e) => setCustomRangeUpper(e.target.value)}
                    className="w-1/2 rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-800 focus:border-cyan-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Demographics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600 flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-slate-400" /> Patient Age
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={age || ''}
                  onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Biological Sex</label>
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-800"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other / Not specified</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="pregnantCheck"
                  checked={isPregnant}
                  onChange={(e) => setIsPregnant(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                <label htmlFor="pregnantCheck" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Pregnancy Status
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-cyan-700 transition"
              >
                <Sparkles className="h-4 w-4" /> Run Automatic Interpretation
              </button>
            </div>
          </form>

          {/* Results Workspace */}
          {result && (
            <div className="space-y-6 pt-4 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* Critical Urgent Review Alert */}
              {result.isCritical && (
                <div className="rounded-xl border border-red-500 bg-red-50 p-4 shadow-sm animate-pulse">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-black uppercase text-red-900 tracking-wider">
                        CRITICAL PANIC VALUE ALERT
                      </h4>
                      <p className="text-xs font-semibold text-red-800 mt-1">
                        {result.urgentReviewNotice}
                      </p>
                      <p className="text-xs text-red-700 mt-1">
                        Immediate medical evaluation or contact with your healthcare provider is strongly recommended.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-slate-900 text-white p-5 shadow-lg">
                <div>
                  <div className="text-xs uppercase tracking-wider text-cyan-300 font-semibold">
                    Clinical Evaluation Status
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-2xl font-black text-white">
                      {value} {unit}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${result.badgeColor}`}>
                      {result.statusLabel}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Effective reference target: <span className="text-slate-200 font-medium">{result.effectiveRangeText}</span>
                    {result.rangeSource === 'report_printed' && (
                      <span className="ml-2 rounded bg-cyan-900/60 text-cyan-300 px-1.5 py-0.5 text-[10px]">
                        Printed Report Bounds
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20 transition"
                  >
                    <Bookmark className="h-3.5 w-3.5" /> {savedSuccess ? 'Saved!' : 'Save Result'}
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20 transition"
                  >
                    <Printer className="h-3.5 w-3.5" /> Print
                  </button>
                </div>
              </div>

              {/* Severity Gauge Visualization */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Analytical Severity Position</span>
                  <span className="text-cyan-700 font-semibold">{result.statusLabel}</span>
                </div>

                {/* Gauge Bar */}
                <div className="relative w-full h-4 rounded-full overflow-hidden flex shadow-inner bg-slate-200">
                  <div className="h-full w-[20%] bg-blue-400" title="Low / Deficient" />
                  <div className="h-full w-[40%] bg-emerald-500" title="Normal / Target" />
                  <div className="h-full w-[15%] bg-yellow-400" title="Borderline" />
                  <div className="h-full w-[15%] bg-amber-500" title="High" />
                  <div className="h-full w-[10%] bg-red-600" title="Critical Panic" />
                </div>

                {/* Needle Indicator */}
                <div className="relative w-full h-4">
                  <div
                    className="absolute -top-1 transform -translate-x-1/2 flex flex-col items-center transition-all duration-500"
                    style={{ left: `${result.gaugePosition}%` }}
                  >
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-slate-900" />
                    <span className="text-[10px] font-black text-slate-900 bg-white px-1 rounded shadow-xs border border-slate-200">
                      {value}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-slate-500 font-semibold px-1">
                  <span>Low</span>
                  <span>Normal Target</span>
                  <span>Borderline</span>
                  <span>High</span>
                  <span>Critical</span>
                </div>
              </div>

              {/* Three-Tier Explanation View Switcher */}
              <div className="space-y-3">
                <div className="flex border-b border-slate-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab('simple')}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
                      activeTab === 'simple'
                        ? 'border-cyan-600 text-cyan-700'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <HelpCircle className="h-3.5 w-3.5" /> Plain Language (Patient View)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('clinical')}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
                      activeTab === 'clinical'
                        ? 'border-cyan-600 text-cyan-700'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Stethoscope className="h-3.5 w-3.5" /> Clinical Interpretation (Doctor View)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('associations')}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
                      activeTab === 'associations'
                        ? 'border-cyan-600 text-cyan-700'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Activity className="h-3.5 w-3.5" /> Possible Clinical Associations
                  </button>
                </div>

                {/* Tab 1: Simple Explanation */}
                {activeTab === 'simple' && (
                  <div className="rounded-xl bg-slate-50 p-4 space-y-3 text-xs text-slate-700 leading-relaxed">
                    <p className="font-medium text-slate-900 text-sm">
                      {result.simpleExplanation}
                    </p>
                    <div className="pt-2 border-t border-slate-200">
                      <span className="font-bold text-slate-900">What to do next:</span>
                      <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-600">
                        {result.recommendations.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Tab 2: Clinical Interpretation */}
                {activeTab === 'clinical' && (
                  <div className="rounded-xl bg-slate-50 p-4 space-y-3 text-xs text-slate-800 leading-relaxed">
                    <p>{result.clinicalInterpretation}</p>
                    <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-900">Pathophysiological Markers & Limits:</div>
                      <div>Standard Unit: <span className="font-mono text-cyan-800">{unit}</span></div>
                      <div>Target Reference Interval: <span className="font-mono text-slate-800">{result.effectiveRangeText}</span></div>
                      <div>Assay Turnaround: <span className="text-slate-600">{test.turnaroundTime || '2 - 4 Hours'}</span></div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Possible Clinical Associations */}
                {activeTab === 'associations' && (
                  <div className="rounded-xl bg-slate-50 p-4 space-y-2 text-xs text-slate-800">
                    <div className="font-bold text-slate-900 mb-1">
                      Potential clinical conditions or factors associated with this result:
                    </div>
                    <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                      {result.possibleAssociations.map((item, idx) => (
                        <li key={idx}>
                          <span className="font-semibold text-slate-900">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 rounded-lg bg-amber-50 p-2.5 text-[11px] text-amber-900 border border-amber-200">
                      <strong>Important Diagnostic Notice:</strong> An abnormal lab marker indicates physiological deviation, not a standalone disease diagnosis. A qualified clinician must correlate with symptoms and history.
                    </div>
                  </div>
                )}
              </div>

              {/* AI Doctor Followup Prompt */}
              {onAskAI && (
                <div className="flex items-center justify-between rounded-xl bg-cyan-50 border border-cyan-200 p-3">
                  <div className="flex items-center gap-2 text-xs text-cyan-900">
                    <Sparkles className="h-4 w-4 text-cyan-600" />
                    <span>Have questions about this result? Ask the GlobalHealth AI Doctor.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onAskAI(`I just got a lab test result for ${test.name}: ${value} ${unit} (Reference range: ${result.effectiveRangeText}). Can you explain what this means in plain language and what questions I should ask my doctor?`)}
                    className="flex items-center gap-1 rounded-lg bg-cyan-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-cyan-800 transition"
                  >
                    Ask AI Assistant <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              )}

              {/* Disclaimer */}
              <p className="text-[11px] text-slate-400 leading-tight">
                {result.disclaimer}
              </p>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 bg-slate-50/80 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-300 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
