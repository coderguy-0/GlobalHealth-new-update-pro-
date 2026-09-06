import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Trash2,
  Plus
} from 'lucide-react';
import { MedicalTest } from '../../types';
import { interpretTestResult, InterpretationResult } from './interpretationEngine';

interface ReportUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableTests: MedicalTest[];
  onAskAI?: (prompt: string) => void;
}

interface ExtractedItem {
  id: string;
  testName: string;
  matchedTest?: MedicalTest;
  value: string;
  unit: string;
  range: string;
}

export const ReportUploadModal: React.FC<ReportUploadModalProps> = ({
  isOpen,
  onClose,
  availableTests,
  onAskAI
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedItems, setExtractedItems] = useState<ExtractedItem[]>([]);
  const [interpretations, setInterpretations] = useState<Record<string, InterpretationResult>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);
    setExtractedItems([]);
    setInterpretations({});

    // Simulate intelligent parsing of the lab report document
    setTimeout(() => {
      // High-precision sample extracted entries simulating OCR
      const sampleExtracted: ExtractedItem[] = [
        {
          id: 'item-1',
          testName: 'Hemoglobin A1c (HbA1c)',
          value: '6.2',
          unit: '%',
          range: '< 5.7'
        },
        {
          id: 'item-2',
          testName: 'Fasting Plasma Glucose',
          value: '112',
          unit: 'mg/dL',
          range: '70 - 99'
        },
        {
          id: 'item-3',
          testName: 'Serum Creatinine',
          value: '1.05',
          unit: 'mg/dL',
          range: '0.6 - 1.2'
        },
        {
          id: 'item-4',
          testName: 'Thyroid Stimulating Hormone (TSH)',
          value: '3.40',
          unit: 'mIU/L',
          range: '0.45 - 4.50'
        },
        {
          id: 'item-5',
          testName: 'Total Cholesterol',
          value: '228',
          unit: 'mg/dL',
          range: '< 200'
        }
      ];

      // Match to database tests
      const enriched = sampleExtracted.map(item => {
        const found = availableTests.find(t => 
          t.name.toLowerCase().includes(item.testName.toLowerCase().split(' ')[0]) ||
          (t.abbreviation && item.testName.toLowerCase().includes(t.abbreviation.toLowerCase()))
        );
        return { ...item, matchedTest: found };
      });

      setExtractedItems(enriched);
      setIsProcessing(false);
    }, 1200);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleItemChange = (id: string, field: 'testName' | 'value' | 'unit' | 'range', newVal: string) => {
    setExtractedItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: newVal };
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: string) => {
    setExtractedItems(prev => prev.filter(i => i.id !== id));
  };

  const handleAddItem = () => {
    const newItem: ExtractedItem = {
      id: `item-${Date.now()}`,
      testName: 'Complete Blood Count',
      value: '',
      unit: '',
      range: ''
    };
    setExtractedItems(prev => [...prev, newItem]);
  };

  const handleRunBatchInterpretation = () => {
    const results: Record<string, InterpretationResult> = {};
    extractedItems.forEach(item => {
      const parsedRange = item.range.split('-');
      const res = interpretTestResult(item.matchedTest, {
        testId: item.matchedTest?.id || item.id,
        testName: item.testName,
        value: item.value,
        unit: item.unit,
        customRangeLower: parsedRange[0]?.trim(),
        customRangeUpper: parsedRange[1]?.trim()
      });
      results[item.id] = res;
    });
    setInterpretations(results);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Upload Clinical Lab Report & Extract Values
              </h3>
              <p className="text-xs text-slate-500">
                Supports PDF, JPG, PNG document formats with editable pre-interpretation verification
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
        <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          
          {/* Dropzone */}
          {!file && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-8 text-center cursor-pointer transition bg-slate-50 hover:bg-teal-50/30 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
              />
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 group-hover:scale-105 transition">
                <FileText className="h-7 w-7" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 mt-3">
                Drag and drop your laboratory report here
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                or click to browse from your device (PDF, PNG, JPG up to 20MB)
              </p>
              <span className="mt-3 inline-block rounded-lg bg-teal-600 text-white px-3 py-1.5 text-xs font-semibold shadow-xs">
                Select Report File
              </span>
            </div>
          )}

          {/* Processing Spinner */}
          {isProcessing && (
            <div className="py-12 text-center space-y-3">
              <div className="h-8 w-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="text-sm font-bold text-slate-800">
                Extracting Test Values, Units & Printed Reference Ranges...
              </div>
              <p className="text-xs text-slate-500">
                Matching extracted analytes against the 2,000+ clinical laboratory catalog
              </p>
            </div>
          )}

          {/* Extracted Values Review */}
          {extractedItems.length > 0 && !isProcessing && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Step 2: Verify Extracted Laboratory Values
                  </h4>
                  <p className="text-xs text-slate-500">
                    Review and edit any values to guarantee 100% accuracy before running the interpretation engine.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Test Manually
                </button>
              </div>

              {/* Editable Table */}
              <div className="rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Test / Analyte Name</th>
                      <th className="p-3">Report Value</th>
                      <th className="p-3">Unit</th>
                      <th className="p-3">Report Reference Range</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {extractedItems.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-2.5">
                          <input
                            type="text"
                            value={item.testName}
                            onChange={(e) => handleItemChange(item.id, 'testName', e.target.value)}
                            className="w-full rounded border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-800"
                          />
                        </td>
                        <td className="p-2.5 w-24">
                          <input
                            type="text"
                            value={item.value}
                            onChange={(e) => handleItemChange(item.id, 'value', e.target.value)}
                            className="w-full rounded border border-slate-200 px-2 py-1 text-xs font-bold text-slate-900 text-center"
                          />
                        </td>
                        <td className="p-2.5 w-24">
                          <input
                            type="text"
                            value={item.unit}
                            onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                            className="w-full rounded border border-slate-200 px-2 py-1 text-xs text-slate-700 text-center"
                          />
                        </td>
                        <td className="p-2.5 w-36">
                          <input
                            type="text"
                            value={item.range}
                            onChange={(e) => handleItemChange(item.id, 'range', e.target.value)}
                            placeholder="e.g. 70 - 99"
                            className="w-full rounded border border-slate-200 px-2 py-1 text-xs text-slate-700 text-center"
                          />
                        </td>
                        <td className="p-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-slate-400 hover:text-red-600 p-1 transition"
                            title="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => { setFile(null); setExtractedItems([]); setInterpretations({}); }}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  ← Upload Different Document
                </button>
                <button
                  type="button"
                  onClick={handleRunBatchInterpretation}
                  className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-teal-700 transition"
                >
                  <Sparkles className="h-4 w-4" /> Run Report Interpretation
                </button>
              </div>
            </div>
          )}

          {/* Interpretations Output */}
          {Object.keys(interpretations).length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h4 className="text-sm font-bold text-slate-900">
                Step 3: Clinical Report Findings Summary
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {extractedItems.map(item => {
                  const interp = interpretations[item.id];
                  if (!interp) return null;
                  return (
                    <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">{item.testName}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${interp.badgeColor}`}>
                          {interp.statusLabel}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600">
                        Result: <strong className="text-slate-900">{item.value} {item.unit}</strong> (Target: {interp.effectiveRangeText})
                      </div>
                      <p className="text-[11px] text-slate-700 leading-snug">
                        {interp.simpleExplanation}
                      </p>
                    </div>
                  );
                })}
              </div>

              {onAskAI && (
                <div className="flex items-center justify-between rounded-xl bg-teal-50 border border-teal-200 p-3">
                  <div className="flex items-center gap-2 text-xs text-teal-950 font-medium">
                    <Sparkles className="h-4 w-4 text-teal-600" />
                    <span>Want a complete personalized doctor summary of your uploaded report?</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onAskAI(`I uploaded my lab report with ${extractedItems.length} tests: ${extractedItems.map(i => `${i.testName}: ${i.value} ${i.unit}`).join(', ')}. Can you give me a holistic clinical summary and advice on what to talk to my doctor about?`)}
                    className="flex items-center gap-1 rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-800 transition"
                  >
                    Summarize with AI <ArrowRight className="h-3 w-3" />
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
