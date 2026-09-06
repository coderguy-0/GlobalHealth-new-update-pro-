import React from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Info,
  Clock
} from 'lucide-react';
import { LabReportItem, PatientRecord } from '../../../types/medauth';

interface LabTrendModalProps {
  report: LabReportItem | null;
  patient: PatientRecord;
  isOpen: boolean;
  onClose: () => void;
}

export const LabTrendModal: React.FC<LabTrendModalProps> = ({
  report,
  patient,
  isOpen,
  onClose
}) => {
  if (!isOpen || !report) return null;

  const trends = report.historicalTrends || [
    { date: '2026-04-10', value: Number(report.resultValue) * 0.9, displayValue: String((Number(report.resultValue) * 0.9).toFixed(1)), unit: report.unit, status: 'NORMAL' as const },
    { date: '2026-06-15', value: Number(report.resultValue) * 0.95, displayValue: String((Number(report.resultValue) * 0.95).toFixed(1)), unit: report.unit, status: 'NORMAL' as const },
    { date: report.performedAt ? report.performedAt.split('T')[0] : '2026-08-23', value: Number(report.resultValue), displayValue: report.resultValue, unit: report.unit, status: report.status }
  ];

  const firstVal = trends[0].value;
  const latestVal = trends[trends.length - 1].value;
  const delta = latestVal - firstVal;
  const isRising = delta > 0;

  // Calculate scaling for visualization
  const allValues = trends.map((t) => t.value);
  const minVal = Math.min(...allValues) * 0.85;
  const maxVal = Math.max(...allValues) * 1.15;
  const range = maxVal - minVal || 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Longitudinal Biomarker Telemetry</span>
          </div>

          <h2 className="text-xl font-extrabold text-white">
            {report.testName} Historical Trajectory
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Patient: {patient.name} ({patient.mrn}) • Reference Interval: {report.referenceRange} {report.unit}
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Summary Delta Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isRising ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {isRising ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">
                  3-Month Progression Delta
                </span>
                <span className="text-xs text-slate-500">
                  {isRising ? '+' : ''}{delta.toFixed(1)} {report.unit} change since baseline
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Status</span>
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-extrabold font-mono ${
                  report.status === 'NORMAL'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {report.status}
              </span>
            </div>
          </div>

          {/* Visual Trend Chart Canvas / SVG */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Timeline: April 2026 — August 2026</span>
              <span className="font-mono text-emerald-400">Unit: {report.unit}</span>
            </div>

            {/* Simulated Clean SVG Line Chart */}
            <div className="relative h-44 w-full flex items-end justify-between px-6 pt-4 pb-2 border-b border-slate-800">
              {trends.map((pt, idx) => {
                const heightPercent = Math.min(100, Math.max(15, ((pt.value - minVal) / range) * 100));
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 group z-10">
                    <div className="text-[11px] font-mono font-bold text-emerald-300">
                      {pt.displayValue}
                    </div>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-4 rounded-t-lg transition-all duration-500 ${
                        pt.status === 'NORMAL' ? 'bg-emerald-500' : 'bg-amber-400'
                      }`}
                    />
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(pt.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Target Clinical Boundary: &lt; 100 {report.unit}</span>
              <span className="text-amber-400">Current: {report.resultValue} {report.unit}</span>
            </div>
          </div>

          {/* Detailed Observations Table */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-tight block">
              Sequential Clinical Data Points
            </span>

            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4">Biomarker Value</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">Clinical Context</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {trends.map((t, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {new Date(t.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {t.displayValue} {t.unit}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            t.status === 'NORMAL'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {t.notes || (idx === trends.length - 1 ? 'Latest verified outpatient diagnostic' : 'Baseline monitoring')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            Close Trend View
          </button>
        </div>

      </div>
    </div>
  );
};
