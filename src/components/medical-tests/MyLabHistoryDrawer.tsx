import React, { useState } from 'react';
import {
  X,
  Bookmark,
  Clock,
  Trash2,
  TrendingUp,
  TrendingDown,
  Calendar,
  Activity,
  FileText,
  Sparkles
} from 'lucide-react';
import { MedicalTest } from '../../types';

export interface SavedLabRecord {
  id: string;
  testId: string;
  testName: string;
  value: string;
  unit: string;
  status: string;
  date: string;
}

interface MyLabHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedTestIds: string[];
  historyRecords: SavedLabRecord[];
  allTests: MedicalTest[];
  onOpenTest: (test: MedicalTest) => void;
  onRemoveSavedTest: (id: string) => void;
  onClearHistory: () => void;
  onAskAI?: (prompt: string) => void;
}

export const MyLabHistoryDrawer: React.FC<MyLabHistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedTestIds,
  historyRecords,
  allTests,
  onOpenTest,
  onRemoveSavedTest,
  onClearHistory,
  onAskAI
}) => {
  const [activeTab, setActiveTab] = useState<'saved' | 'history'>('saved');

  if (!isOpen) return null;

  const savedTests = allTests.filter(t => savedTestIds.includes(t.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-600 text-white shadow-xs">
                <Bookmark className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">My Lab Tests & History</h3>
                <p className="text-[11px] text-slate-500">
                  Track saved reference tests and recorded lab trends
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

          {/* Tab Switcher */}
          <div className="flex border-b border-slate-200 px-5 pt-2">
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-1.5 pb-2.5 px-2 text-xs font-bold border-b-2 transition ${
                activeTab === 'saved'
                  ? 'border-cyan-600 text-cyan-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" /> Saved Tests ({savedTests.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 pb-2.5 px-2 text-xs font-bold border-b-2 transition ${
                activeTab === 'history'
                  ? 'border-cyan-600 text-cyan-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Clock className="h-3.5 w-3.5" /> Result History ({historyRecords.length})
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            
            {/* Tab 1: Saved Tests */}
            {activeTab === 'saved' && (
              <div className="space-y-3">
                {savedTests.length === 0 ? (
                  <div className="py-16 text-center text-slate-400 space-y-2">
                    <Bookmark className="h-8 w-8 mx-auto text-slate-300" />
                    <p className="text-xs font-semibold text-slate-600">No saved laboratory tests yet.</p>
                    <p className="text-[11px] text-slate-400">
                      Click the bookmark star on any test card to save it for rapid lookup.
                    </p>
                  </div>
                ) : (
                  savedTests.map(t => (
                    <div
                      key={t.id}
                      className="rounded-xl border border-slate-200 p-3 hover:border-cyan-400 transition bg-white shadow-2xs space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                          <span className="text-[10px] text-slate-500">{t.category}</span>
                        </div>
                        <button
                          onClick={() => onRemoveSavedTest(t.id)}
                          className="text-slate-300 hover:text-red-500 transition p-1"
                          title="Remove"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] font-mono text-cyan-800 bg-cyan-50/70 rounded px-2 py-1">
                        Normal: {t.referenceRange || t.normalRange}
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => { onClose(); onOpenTest(t); }}
                          className="text-xs font-bold text-cyan-700 hover:text-cyan-900"
                        >
                          Open Workspace →
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 2: Result History */}
            {activeTab === 'history' && (
              <div className="space-y-3">
                {historyRecords.length === 0 ? (
                  <div className="py-16 text-center text-slate-400 space-y-2">
                    <Activity className="h-8 w-8 mx-auto text-slate-300" />
                    <p className="text-xs font-semibold text-slate-600">No recorded test results yet.</p>
                    <p className="text-[11px] text-slate-400">
                      When you interpret a test value, click "Save Result" to track longitudinal trends.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="text-[11px] text-slate-500 font-medium">Logged Results</span>
                      <button
                        onClick={onClearHistory}
                        className="text-[11px] text-red-600 hover:underline"
                      >
                        Clear History
                      </button>
                    </div>
                    {historyRecords.map(rec => (
                      <div
                        key={rec.id}
                        className="rounded-xl border border-slate-200 p-3 bg-white shadow-2xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{rec.testName}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            rec.status === 'NORMAL' ? 'bg-emerald-100 text-emerald-800' :
                            rec.status === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                            rec.status === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {rec.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-slate-800">{rec.value} {rec.unit}</span>
                          <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                            <Calendar className="h-3 w-3" /> {rec.date}
                          </span>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-xl bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-300 transition"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
