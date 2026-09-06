import React, { useState } from 'react';
import {
  X,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Stethoscope,
  ArrowRight,
  Info,
  ChevronDown
} from 'lucide-react';
import { COMMON_CLINICAL_PANELS, ClinicalPanelItem } from '../../data/medicalTests';
import {
  interpretClinicalPanel,
  PanelTestInput,
  PanelInterpretationResult
} from './interpretationEngine';

interface PanelInterpretationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskAI?: (prompt: string) => void;
}

// Typical clinical preset values for easy exploration
const PANEL_PRESETS: Record<string, { label: string; values: Record<string, string> }[]> = {
  'panel-cbc': [
    {
      label: 'Healthy Normal CBC Baseline',
      values: {
        'White Blood Cell Count': '6.8',
        'Red Blood Cell Count': '4.9',
        'Hemoglobin': '14.5',
        'Hematocrit': '43.0',
        'Platelet Count': '260',
        'Mean Corpuscular Volume': '88.0',
        'Absolute Neutrophil Count': '4.2'
      }
    },
    {
      label: 'Microcytic Anemia Profile',
      values: {
        'White Blood Cell Count': '7.1',
        'Red Blood Cell Count': '3.6',
        'Hemoglobin': '9.2',
        'Hematocrit': '28.5',
        'Platelet Count': '380',
        'Mean Corpuscular Volume': '71.0',
        'Absolute Neutrophil Count': '4.5'
      }
    },
    {
      label: 'Reactive Leukocytosis (Infection)',
      values: {
        'White Blood Cell Count': '16.4',
        'Red Blood Cell Count': '4.8',
        'Hemoglobin': '14.0',
        'Hematocrit': '41.5',
        'Platelet Count': '410',
        'Mean Corpuscular Volume': '86.0',
        'Absolute Neutrophil Count': '12.8'
      }
    }
  ],
  'panel-lft': [
    {
      label: 'Healthy Liver Function Baseline',
      values: {
        'Alanine Aminotransferase': '24',
        'Aspartate Aminotransferase': '22',
        'Alkaline Phosphatase': '68',
        'Gamma-Glutamyl Transferase': '28',
        'Total Bilirubin': '0.8',
        'Serum Albumin': '4.5'
      }
    },
    {
      label: 'Acute Hepatocellular Injury Pattern',
      values: {
        'Alanine Aminotransferase': '185',
        'Aspartate Aminotransferase': '142',
        'Alkaline Phosphatase': '95',
        'Gamma-Glutamyl Transferase': '84',
        'Total Bilirubin': '1.8',
        'Serum Albumin': '4.1'
      }
    }
  ],
  'panel-kft': [
    {
      label: 'Healthy Renal Function Baseline',
      values: {
        'Serum Creatinine': '0.9',
        'Estimated GFR (CKD-EPI 2021)': '102',
        'Blood Urea Nitrogen': '14',
        'Serum Cystatin C': '0.85',
        'Serum Sodium': '140',
        'Serum Potassium': '4.2'
      }
    },
    {
      label: 'Impaired Glomerular Filtration (Stage 3 CKD)',
      values: {
        'Serum Creatinine': '1.8',
        'Estimated GFR (CKD-EPI 2021)': '42',
        'Blood Urea Nitrogen': '34',
        'Serum Cystatin C': '1.75',
        'Serum Sodium': '138',
        'Serum Potassium': '4.9'
      }
    }
  ],
  'panel-lipid': [
    {
      label: 'Optimal Cardiovascular Lipid Baseline',
      values: {
        'Total Cholesterol': '175',
        'LDL Cholesterol': '90',
        'HDL Cholesterol': '58',
        'Triglycerides': '110',
        'Non-HDL Cholesterol': '117'
      }
    },
    {
      label: 'Mixed Atherogenic Dyslipidemia',
      values: {
        'Total Cholesterol': '248',
        'LDL Cholesterol': '162',
        'HDL Cholesterol': '36',
        'Triglycerides': '245',
        'Non-HDL Cholesterol': '212'
      }
    }
  ]
};

export const PanelInterpretationModal: React.FC<PanelInterpretationModalProps> = ({
  isOpen,
  onClose,
  onAskAI
}) => {
  const [selectedPanelId, setSelectedPanelId] = useState<string>('panel-cbc');
  const [panelValues, setPanelValues] = useState<Record<string, string>>({
    'White Blood Cell Count': '6.8',
    'Red Blood Cell Count': '4.9',
    'Hemoglobin': '14.5',
    'Hematocrit': '43.0',
    'Platelet Count': '260',
    'Mean Corpuscular Volume': '88.0',
    'Absolute Neutrophil Count': '4.2'
  });
  const [interpretation, setInterpretation] = useState<PanelInterpretationResult | null>(null);

  if (!isOpen) return null;

  const currentPanel = COMMON_CLINICAL_PANELS.find(p => p.id === selectedPanelId) || COMMON_CLINICAL_PANELS[0];

  const handlePanelChange = (id: string) => {
    setSelectedPanelId(id);
    const target = COMMON_CLINICAL_PANELS.find(p => p.id === id);
    if (!target) return;

    // Load first preset or empty
    const presets = PANEL_PRESETS[id];
    if (presets && presets.length > 0) {
      setPanelValues(presets[0].values);
    } else {
      const initial: Record<string, string> = {};
      target.testNames.forEach(t => { initial[t] = ''; });
      setPanelValues(initial);
    }
    setInterpretation(null);
  };

  const handleApplyPreset = (values: Record<string, string>) => {
    setPanelValues(values);
    setInterpretation(null);
  };

  const handleValueChange = (testName: string, val: string) => {
    setPanelValues(prev => ({ ...prev, [testName]: val }));
  };

  const handleRunInterpretation = (e: React.FormEvent) => {
    e.preventDefault();
    const testInputs: PanelTestInput[] = currentPanel.testNames.map(tName => ({
      testName: tName,
      value: panelValues[tName] || '0',
      unit: tName.includes('Count') || tName.includes('Platelet') ? 'x10^9/L' :
            tName.includes('Hemoglobin') || tName.includes('Creatinine') || tName.includes('Cholesterol') || tName.includes('Bilirubin') || tName.includes('Albumin') ? 'mg/dL' :
            tName.includes('Aminotransferase') || tName.includes('Phosphatase') ? 'U/L' :
            tName.includes('Hematocrit') ? '%' : 'Units',
      customRange: tName.includes('Hemoglobin') ? '12.0 - 17.5' :
                   tName.includes('White') ? '4.5 - 11.0' :
                   tName.includes('Platelet') ? '150 - 450' :
                   tName.includes('Creatinine') ? '0.7 - 1.3' :
                   tName.includes('GFR') ? '60 - 120' :
                   tName.includes('Alanine') ? '7 - 55' :
                   tName.includes('Cholesterol') ? '120 - 200' : 'Normal range'
    }));

    const result = interpretClinicalPanel(currentPanel.name, testInputs);
    setInterpretation(result);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Multi-Test Panel Interpretation Workspace
              </h3>
              <p className="text-xs text-slate-500">
                Synthesize inter-test biological patterns across organ profiles
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

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          
          {/* Panel Selector & Presets */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700">Select Clinical Laboratory Panel:</label>
            <div className="flex flex-wrap gap-2">
              {COMMON_CLINICAL_PANELS.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePanelChange(p.id)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                    selectedPanelId === p.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Preset Buttons */}
          {PANEL_PRESETS[selectedPanelId] && (
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-500 font-medium">Quick Presets:</span>
              {PANEL_PRESETS[selectedPanelId].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset.values)}
                  className="rounded-lg bg-indigo-50 border border-indigo-200/80 px-2.5 py-1 text-xs font-medium text-indigo-800 hover:bg-indigo-100 transition"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRunInterpretation} className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
              <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Enter Test Analytes for {currentPanel.name}</span>
                <span className="text-slate-500 font-normal">{currentPanel.testNames.length} Analytes in Panel</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {currentPanel.testNames.map(tName => (
                  <div key={tName} className="bg-white rounded-lg p-2.5 border border-slate-200 space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 block truncate" title={tName}>
                      {tName}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 14.2"
                      value={panelValues[tName] || ''}
                      onChange={(e) => handleValueChange(tName, e.target.value)}
                      className="w-full rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-800 focus:border-indigo-500 focus:outline-hidden"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition"
              >
                <Sparkles className="h-4 w-4" /> Synthesize Panel Results
              </button>
            </div>
          </form>

          {/* Interpretation Output */}
          {interpretation && (
            <div className="space-y-4 pt-4 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* Summary Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-center">
                  <div className="text-xl font-extrabold text-emerald-700">{interpretation.normalCount}</div>
                  <div className="text-[11px] font-semibold text-emerald-800">Normal In-Range</div>
                </div>
                <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-3 text-center">
                  <div className="text-xl font-extrabold text-yellow-700">{interpretation.borderlineCount}</div>
                  <div className="text-[11px] font-semibold text-yellow-800">Borderline</div>
                </div>
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-center">
                  <div className="text-xl font-extrabold text-amber-700">{interpretation.highCount}</div>
                  <div className="text-[11px] font-semibold text-amber-800">Elevated High</div>
                </div>
                <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-center">
                  <div className="text-xl font-extrabold text-blue-700">{interpretation.lowCount}</div>
                  <div className="text-[11px] font-semibold text-blue-800">Low / Decreased</div>
                </div>
              </div>

              {/* Synthesized Pattern Card */}
              <div className="rounded-xl bg-slate-900 text-white p-4 space-y-2 shadow-lg">
                <div className="text-xs uppercase font-bold text-indigo-300 tracking-wider">
                  Synthesized Clinical Correlation
                </div>
                <p className="text-sm font-semibold text-white">
                  {interpretation.patternSummary}
                </p>
                <div className="pt-2 border-t border-slate-700/80">
                  <div className="text-xs font-medium text-slate-300 mb-1">
                    Differential Physiological Context:
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300">
                    {interpretation.differentialContext.map((diff, i) => (
                      <li key={i}>{diff}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Individual Analytes Table */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Analyte</th>
                      <th className="p-3">Entered Value</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Clinical Evaluation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {interpretation.tests.map((t, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-900">{t.name}</td>
                        <td className="p-3 font-mono text-slate-700">{t.value} {t.unit}</td>
                        <td className="p-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            t.status === 'NORMAL' ? 'bg-emerald-100 text-emerald-800' :
                            t.status === 'BORDERLINE' ? 'bg-yellow-100 text-yellow-800' :
                            t.status === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600">{t.summary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* AI Assistant Button */}
              {onAskAI && (
                <div className="flex items-center justify-between rounded-xl bg-indigo-50 border border-indigo-200 p-3">
                  <div className="flex items-center gap-2 text-xs text-indigo-950 font-medium">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                    <span>Review this full panel pattern with the GlobalHealth AI Doctor.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onAskAI(`I have this complete ${currentPanel.name} panel: ${JSON.stringify(panelValues)}. What is the clinical pattern and what should I discuss with my physician?`)}
                    className="flex items-center gap-1 rounded-lg bg-indigo-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-800 transition"
                  >
                    Discuss with AI <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer */}
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
