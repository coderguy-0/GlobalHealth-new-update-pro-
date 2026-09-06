import React, { useState } from 'react';
import {
  X,
  Plus,
  FlaskConical,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { useDiagnostics } from '../../../context/DiagnosticContext';
import { LabCategory, SpecimenType, VacutainerCapColor } from '../../../types/diagnostics';

export const AddLabTestModal: React.FC = () => {
  const { activeModal, closeModal, addLabTest } = useDiagnostics();

  const [testCode, setTestCode] = useState('LOINC-718-7');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<LabCategory>('Biochemistry');
  const [specimenType, setSpecimenType] = useState<SpecimenType>('Serum');
  const [vacutainerCapColor, setVacutainerCapColor] = useState<VacutainerCapColor>('Red / Gold (Clot + Gel)');
  const [standardTurnaroundMinutes, setStandardTurnaroundMinutes] = useState(120);
  const [statTurnaroundMinutes, setStatTurnaroundMinutes] = useState(30);
  const [nablAccredited, setNablAccredited] = useState(true);
  const [price, setPrice] = useState(650);
  const [criticalLowThreshold, setCriticalLowThreshold] = useState<string>('');
  const [criticalHighThreshold, setCriticalHighThreshold] = useState<string>('');
  const [normalRangeMale, setNormalRangeMale] = useState('');
  const [normalRangeFemale, setNormalRangeFemale] = useState('');
  const [unitOfMeasure, setUnitOfMeasure] = useState('mg/dL');
  const [methodology, setMethodology] = useState('Chemiluminescence Immunoassay (CLIA)');
  const [analyzers, setAnalyzers] = useState('Roche Cobas c501, Abbott Architect');
  const [fastingRequired, setFastingRequired] = useState(false);
  const [instructions, setInstructions] = useState('');

  if (activeModal !== 'add_lab_test') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addLabTest({
      testCode: testCode.trim() || 'LOINC-GEN',
      name: name.trim(),
      category,
      specimenType,
      vacutainerCapColor,
      standardTurnaroundMinutes: Number(standardTurnaroundMinutes) || 120,
      statTurnaroundMinutes: Number(statTurnaroundMinutes) || 30,
      nablAccredited,
      price: Number(price) || 500,
      criticalLowThreshold: criticalLowThreshold ? Number(criticalLowThreshold) : undefined,
      criticalHighThreshold: criticalHighThreshold ? Number(criticalHighThreshold) : undefined,
      normalRangeMale: normalRangeMale.trim() || 'Normal Adult Limits',
      normalRangeFemale: normalRangeFemale.trim() || 'Normal Adult Limits',
      unitOfMeasure: unitOfMeasure.trim() || 'IU/L',
      methodology: methodology.trim() || 'Automated Clinical Assay',
      analyzersAvailable: analyzers.split(',').map((s) => s.trim()).filter(Boolean),
      fastingRequired,
      instructions: instructions.trim() || undefined
    });

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#DCEBE4] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-[#17221E]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#DCEBE4] flex items-center justify-between bg-[#F6FBF8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#008F68]/10 text-[#008F68] flex items-center justify-center">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#17221E]">Enroll Pathology Test Formulary</h2>
              <p className="text-xs text-[#52635C]">
                NABL ISO-15189 Accredited In-Vitro Diagnostic Master Record
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-[#17221E] mb-1">LOINC / CPT Code</label>
              <input
                type="text"
                value={testCode}
                onChange={(e) => setTestCode(e.target.value)}
                placeholder="e.g. LOINC-2951-2"
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#17221E] mb-1">Test Formal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Serum Ferritin Automated Quantitative"
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-[#17221E] mb-1">Lab Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as LabCategory)}
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              >
                <option value="Biochemistry">Biochemistry</option>
                <option value="Hematology">Hematology</option>
                <option value="Microbiology">Microbiology</option>
                <option value="Histopathology">Histopathology</option>
                <option value="Serology">Serology</option>
                <option value="Molecular">Molecular</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#17221E] mb-1">Specimen Matrix</label>
              <select
                value={specimenType}
                onChange={(e) => setSpecimenType(e.target.value as SpecimenType)}
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              >
                <option value="Serum">Serum</option>
                <option value="Whole Blood (EDTA)">Whole Blood (EDTA)</option>
                <option value="Plasma (Citrate)">Plasma (Citrate)</option>
                <option value="Plasma (Heparin)">Plasma (Heparin)</option>
                <option value="Plasma (Fluoride)">Plasma (Fluoride)</option>
                <option value="Urine (Spot/24hr)">Urine (Spot/24hr)</option>
                <option value="CSF">CSF</option>
                <option value="Biopsy Tissue">Biopsy Tissue</option>
                <option value="Swab / Exudate">Swab / Exudate</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#17221E] mb-1">Vacutainer Cap Tube</label>
              <select
                value={vacutainerCapColor}
                onChange={(e) => setVacutainerCapColor(e.target.value as VacutainerCapColor)}
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              >
                <option value="Red / Gold (Clot + Gel)">Red / Gold (Clot + Gel)</option>
                <option value="Purple / Lavender (K2-EDTA)">Purple / Lavender (K2-EDTA)</option>
                <option value="Light Blue (Sodium Citrate)">Light Blue (Sodium Citrate)</option>
                <option value="Green (Lithium Heparin)">Green (Lithium Heparin)</option>
                <option value="Grey (Sodium Fluoride)">Grey (Sodium Fluoride)</option>
                <option value="Yellow (ACD Solution)">Yellow (ACD Solution)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold text-[#17221E] mb-1">Routine TAT (mins)</label>
              <input
                type="number"
                value={standardTurnaroundMinutes}
                onChange={(e) => setStandardTurnaroundMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
                min="1"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#17221E] mb-1">STAT TAT (mins)</label>
              <input
                type="number"
                value={statTurnaroundMinutes}
                onChange={(e) => setStatTurnaroundMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
                min="1"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#17221E] mb-1">Tariff Price (₹)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
                min="0"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#17221E] mb-1">Unit of Measure</label>
              <input
                type="text"
                value={unitOfMeasure}
                onChange={(e) => setUnitOfMeasure(e.target.value)}
                placeholder="e.g. ng/mL"
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#17221E] mb-1">Normal Reference Range (Male)</label>
              <input
                type="text"
                value={normalRangeMale}
                onChange={(e) => setNormalRangeMale(e.target.value)}
                placeholder="e.g. 20 - 250 ng/mL"
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#17221E] mb-1">Normal Reference Range (Female)</label>
              <input
                type="text"
                value={normalRangeFemale}
                onChange={(e) => setNormalRangeFemale(e.target.value)}
                placeholder="e.g. 10 - 120 ng/mL"
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
          </div>

          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-rose-900">
            <div className="flex items-center gap-2 font-bold text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Automated Critical Panic Threshold Triggers</span>
            </div>
            <p className="text-[11px] text-rose-700">
              When result exceeds these values, an emergency notification is instantly dispatched to the on-duty ICU and ward physician.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-semibold text-rose-800 text-[11px] mb-1">Panic Low Trigger (&lt;)</label>
                <input
                  type="number"
                  step="any"
                  value={criticalLowThreshold}
                  onChange={(e) => setCriticalLowThreshold(e.target.value)}
                  placeholder="e.g. 2.5"
                  className="w-full px-2.5 py-1.5 bg-white border border-rose-300 rounded-lg text-slate-900 focus:outline-none focus:border-rose-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-rose-800 text-[11px] mb-1">Panic High Trigger (&gt;)</label>
                <input
                  type="number"
                  step="any"
                  value={criticalHighThreshold}
                  onChange={(e) => setCriticalHighThreshold(e.target.value)}
                  placeholder="e.g. 0.04"
                  className="w-full px-2.5 py-1.5 bg-white border border-rose-300 rounded-lg text-slate-900 focus:outline-none focus:border-rose-600"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#17221E] mb-1">Methodology</label>
              <input
                type="text"
                value={methodology}
                onChange={(e) => setMethodology(e.target.value)}
                placeholder="e.g. Chemiluminescence Immunoassay (CLIA)"
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#17221E] mb-1">Validated Analyzers (Comma-separated)</label>
              <input
                type="text"
                value={analyzers}
                onChange={(e) => setAnalyzers(e.target.value)}
                placeholder="e.g. Roche Cobas e411, Abbott Architect"
                className="w-full px-3 py-2 bg-white border border-[#DCEBE4] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={nablAccredited}
                onChange={(e) => setNablAccredited(e.target.checked)}
                className="rounded border-[#DCEBE4] text-[#008F68] focus:ring-[#008F68]"
              />
              <span className="font-semibold text-[#17221E]">NABL ISO-15189 Accredited Scope</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={fastingRequired}
                onChange={(e) => setFastingRequired(e.target.checked)}
                className="rounded border-[#DCEBE4] text-[#008F68] focus:ring-[#008F68]"
              />
              <span className="font-semibold text-[#17221E]">8-10h Overnight Fasting Required</span>
            </label>
          </div>

          {/* Footer */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#DCEBE4]">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-xl border border-[#DCEBE4] text-[#52635C] font-semibold hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#008F68] hover:bg-[#007a58] text-white font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save to Pathology Master</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
