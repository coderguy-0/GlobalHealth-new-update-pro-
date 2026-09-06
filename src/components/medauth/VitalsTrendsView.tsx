import React, { useState } from 'react';
import {
  Activity,
  Heart,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Calendar,
  Clock,
  TrendingUp,
  Wind
} from 'lucide-react';
import { PatientRecord, VitalsDataPoint } from '../../types/medauth';

interface VitalsTrendsViewProps {
  patient: PatientRecord;
  onAddVitalsPoint?: (point: VitalsDataPoint) => void;
}

export const VitalsTrendsView: React.FC<VitalsTrendsViewProps> = ({
  patient,
  onAddVitalsPoint
}) => {
  const [vitalsHistory, setVitalsHistory] = useState<VitalsDataPoint[]>(patient.vitalsHistory || []);
  
  // Log Vitals Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newSystolic, setNewSystolic] = useState(130);
  const [newDiastolic, setNewDiastolic] = useState(82);
  const [newHeartRate, setNewHeartRate] = useState(74);
  const [newGlucose, setNewGlucose] = useState(110);
  const [newSpo2, setNewSpo2] = useState(98);

  const handleAddVitals = (e: React.FormEvent) => {
    e.preventDefault();
    const point: VitalsDataPoint = {
      date: newDate,
      systolic: Number(newSystolic),
      diastolic: Number(newDiastolic),
      heartRate: Number(newHeartRate),
      glucose: Number(newGlucose),
      spo2: Number(newSpo2)
    };

    const updated = [...vitalsHistory, point];
    setVitalsHistory(updated);
    if (onAddVitalsPoint) {
      onAddVitalsPoint(point);
    }
    setShowAddForm(false);
  };

  const latestPoint = vitalsHistory[vitalsHistory.length - 1] || {
    systolic: 128,
    diastolic: 82,
    heartRate: 76,
    glucose: 115,
    spo2: 98
  };

  const isHypertensive = latestPoint.systolic >= 140 || latestPoint.diastolic >= 90;
  const isTachycardic = latestPoint.heartRate > 100;
  const isHyperglycemic = latestPoint.glucose > 140;
  const isHypoxemic = (latestPoint.spo2 || 98) < 95;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>Telemetry & Biometric Trends</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Longitudinal Vitals & Hemodynamic Telemetry
          </h2>
          <p className="text-xs text-slate-600">
            Monitoring biometric trajectory for: <strong className="text-slate-900">{patient.name}</strong> ({patient.mrn})
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Vitals Entry</span>
        </button>
      </div>

      {/* Real-time Threshold Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`p-4 rounded-xl border transition ${
            isHypertensive ? 'bg-amber-50 border-amber-300 text-amber-950' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span>Blood Pressure</span>
            <Heart className={`w-4 h-4 ${isHypertensive ? 'text-amber-600' : 'text-slate-400'}`} />
          </div>
          <div className="text-2xl font-bold font-mono">
            {latestPoint.systolic}/{latestPoint.diastolic} <span className="text-xs font-normal">mmHg</span>
          </div>
          <span className="text-[10px] block mt-1">
            {isHypertensive ? '⚠️ Stage 2 Hypertension Alert' : '✓ Normal / Controlled Target'}
          </span>
        </div>

        <div
          className={`p-4 rounded-xl border transition ${
            isTachycardic ? 'bg-rose-50 border-rose-300 text-rose-950' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span>Heart Rate</span>
            <Activity className={`w-4 h-4 ${isTachycardic ? 'text-rose-600' : 'text-slate-400'}`} />
          </div>
          <div className="text-2xl font-bold font-mono">
            {latestPoint.heartRate} <span className="text-xs font-normal">bpm</span>
          </div>
          <span className="text-[10px] block mt-1">
            {isTachycardic ? '⚠️ Tachycardia Threshold (>100)' : '✓ Normal Sinus Rhythm (60-100)'}
          </span>
        </div>

        <div
          className={`p-4 rounded-xl border transition ${
            isHyperglycemic ? 'bg-amber-50 border-amber-300 text-amber-950' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span>Fasting Glucose</span>
            <Droplets className={`w-4 h-4 ${isHyperglycemic ? 'text-amber-600' : 'text-slate-400'}`} />
          </div>
          <div className="text-2xl font-bold font-mono">
            {latestPoint.glucose} <span className="text-xs font-normal">mg/dL</span>
          </div>
          <span className="text-[10px] block mt-1">
            {isHyperglycemic ? '⚠️ Fasting Hyperglycemia (>140)' : '✓ Target Glycemic Zone'}
          </span>
        </div>

        <div
          className={`p-4 rounded-xl border transition ${
            isHypoxemic ? 'bg-rose-50 border-rose-300 text-rose-950' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span>Blood Oxygen (SpO2)</span>
            <Wind className={`w-4 h-4 ${isHypoxemic ? 'text-rose-600' : 'text-slate-400'}`} />
          </div>
          <div className="text-2xl font-bold font-mono">
            {latestPoint.spo2 || 98}%
          </div>
          <span className="text-[10px] block mt-1">
            {isHypoxemic ? '⚠️ Hypoxemia Warning (<95%)' : '✓ Normal Room Air Oxygenation'}
          </span>
        </div>
      </div>

      {/* Add New Vitals Entry Form */}
      {showAddForm && (
        <form onSubmit={handleAddVitals} className="bg-white rounded-2xl border-2 border-emerald-500/40 p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Record New Telemetry Observation</h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">Date of Observation</label>
              <input
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">Systolic BP (mmHg)</label>
              <input
                type="number"
                required
                value={newSystolic}
                onChange={(e) => setNewSystolic(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600 font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">Diastolic BP (mmHg)</label>
              <input
                type="number"
                required
                value={newDiastolic}
                onChange={(e) => setNewDiastolic(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600 font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">Heart Rate (BPM)</label>
              <input
                type="number"
                required
                value={newHeartRate}
                onChange={(e) => setNewHeartRate(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600 font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">Fasting Glucose (mg/dL)</label>
              <input
                type="number"
                required
                value={newGlucose}
                onChange={(e) => setNewGlucose(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition"
            >
              Commit to Longitudinal Trend
            </button>
          </div>
        </form>
      )}

      {/* Longitudinal Telemetry History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Longitudinal Biometric Telemetry Matrix ({vitalsHistory.length} Encounters)
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="pb-3 px-3">Date</th>
                <th className="pb-3 px-3">Systolic BP</th>
                <th className="pb-3 px-3">Diastolic BP</th>
                <th className="pb-3 px-3">Pulse Rate</th>
                <th className="pb-3 px-3">Glucose</th>
                <th className="pb-3 px-3">SpO2 Oxygen</th>
                <th className="pb-3 px-3 text-right">Clinical Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {vitalsHistory.map((item, idx) => {
                const highBp = item.systolic >= 140 || item.diastolic >= 90;
                return (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-sans font-semibold text-slate-800">{item.date}</td>
                    <td className={`py-3 px-3 font-bold ${highBp ? 'text-amber-700' : 'text-slate-800'}`}>
                      {item.systolic} mmHg
                    </td>
                    <td className={`py-3 px-3 font-bold ${highBp ? 'text-amber-700' : 'text-slate-800'}`}>
                      {item.diastolic} mmHg
                    </td>
                    <td className="py-3 px-3 text-emerald-700 font-bold">{item.heartRate} bpm</td>
                    <td className="py-3 px-3 text-slate-800">{item.glucose} mg/dL</td>
                    <td className="py-3 px-3 text-emerald-700">{item.spo2 || 98}%</td>
                    <td className="py-3 px-3 text-right font-sans">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          highBp
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {highBp ? 'Stage 2 HTN' : 'Target Normative'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
