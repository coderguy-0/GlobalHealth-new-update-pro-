import React from 'react';
import { X, Scale, Check, Info } from 'lucide-react';
import { MedicalTest } from '../../types';

interface CompareTestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tests: MedicalTest[];
  onRemoveTest: (id: string) => void;
  onSelectTest: (test: MedicalTest) => void;
}

export const CompareTestsModal: React.FC<CompareTestsModalProps> = ({
  isOpen,
  onClose,
  tests,
  onRemoveTest,
  onSelectTest
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Side-by-Side Diagnostic Test Comparison ({tests.length}/3)
              </h3>
              <p className="text-xs text-slate-500">
                Compare specimen, physiological indications, turnaround times, and reference bounds
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

        {/* Content */}
        <div className="p-6 max-h-[82vh] overflow-y-auto">
          {tests.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <Scale className="h-10 w-10 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">No tests selected for comparison.</p>
              <p className="text-xs text-slate-400">
                Click the "Compare" button on any test card in the catalog to add up to 3 tests.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="p-3.5 font-bold text-slate-500 w-44">Attribute</th>
                    {tests.map(t => (
                      <th key={t.id} className="p-3.5 font-bold text-slate-900 min-w-[220px]">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-sm font-black text-slate-900">{t.name}</div>
                            {t.abbreviation && (
                              <span className="inline-block rounded bg-purple-100 text-purple-800 px-1.5 py-0.5 text-[10px] font-bold mt-0.5">
                                {t.abbreviation}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveTest(t.id)}
                            className="text-slate-400 hover:text-red-500 p-1"
                            title="Remove from comparison"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/50">Category</td>
                    {tests.map(t => (
                      <td key={t.id} className="p-3.5 text-slate-800 font-medium">
                        {t.category}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/50">Clinical Purpose</td>
                    {tests.map(t => (
                      <td key={t.id} className="p-3.5 text-slate-700 leading-relaxed">
                        {t.clinicalPurpose || t.purpose}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/50">What It Measures</td>
                    {tests.map(t => (
                      <td key={t.id} className="p-3.5 text-slate-700 leading-relaxed">
                        {t.whatItMeasures || t.description}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/50">Specimen & Method</td>
                    {tests.map(t => (
                      <td key={t.id} className="p-3.5 text-slate-800">
                        <div>🧪 {t.specimenType || t.sampleType}</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">{t.collectionMethod}</div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/50">Reference Interval</td>
                    {tests.map(t => (
                      <td key={t.id} className="p-3.5 font-mono text-cyan-800 font-semibold">
                        {t.referenceRange || t.normalRange}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/50">Standard Units</td>
                    {tests.map(t => (
                      <td key={t.id} className="p-3.5 text-slate-800 font-mono">
                        {t.units || '—'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/50">Turnaround Time</td>
                    {tests.map(t => (
                      <td key={t.id} className="p-3.5 text-slate-700">
                        ⏱️ {t.turnaroundTime || t.timeToResults}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/50">Fasting Protocol</td>
                    {tests.map(t => (
                      <td key={t.id} className="p-3.5 text-slate-700">
                        {t.fastingRequirement ? (
                          <span className="text-amber-700 font-semibold">Overnight Fasting Required (8-12h)</span>
                        ) : (
                          <span className="text-emerald-700">No fasting required</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/50">Actions</td>
                    {tests.map(t => (
                      <td key={t.id} className="p-3.5">
                        <button
                          type="button"
                          onClick={() => { onClose(); onSelectTest(t); }}
                          className="rounded-lg bg-purple-600 text-white px-3 py-1.5 text-xs font-semibold hover:bg-purple-700 transition"
                        >
                          View Full Details →
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
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
