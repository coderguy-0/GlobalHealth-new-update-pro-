import React, { useState } from 'react';
import {
  History,
  RotateCcw,
  CheckCircle2,
  GitCompare,
  ArrowRight,
  User,
  Clock
} from 'lucide-react';
import { NewsArticle, NewsArticleRevision } from '../../types';

interface RevisionHistoryModalProps {
  article: NewsArticle;
  onRestoreRevision: (version: number) => void;
  onClose: () => void;
}

export const RevisionHistoryModal: React.FC<RevisionHistoryModalProps> = ({
  article,
  onRestoreRevision,
  onClose
}) => {
  const revisions = article.revisions || [
    {
      version: 1,
      date: article.date,
      editedBy: article.author,
      authorRole: 'Author',
      changeSummary: 'Initial article publication',
      titleSnapshot: article.title,
      contentSnapshot: article.content
    }
  ];

  const [selectedVersion, setSelectedVersion] = useState<number>(revisions[0]?.version || 1);
  const activeRev = revisions.find((r) => r.version === selectedVersion) || revisions[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl space-y-6 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
              <History className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Revision History & Audit Log (Section 15)
              </h2>
              <p className="text-xs text-slate-500 truncate max-w-lg">
                {article.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Workspace: Versions List & Snapshot Diff */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 overflow-hidden">
          {/* Left Column: Versions List (4 Cols) */}
          <div className="md:col-span-4 space-y-2 overflow-y-auto pr-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Recorded Versions ({revisions.length})
            </div>

            {revisions.map((rev) => {
              const isSelected = rev.version === selectedVersion;
              return (
                <div
                  key={rev.version}
                  onClick={() => setSelectedVersion(rev.version)}
                  className={`cursor-pointer rounded-xl p-3 border transition space-y-1 ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50/50 shadow-2xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">
                      Version {rev.version}
                    </span>
                    <span className="text-[10px] text-slate-400">{rev.date}</span>
                  </div>

                  <div className="text-[11px] text-slate-600 flex items-center gap-1 font-medium">
                    <User className="h-3 w-3 text-slate-400" />
                    <span>{rev.editedBy}</span>
                  </div>

                  <div className="text-[10px] text-slate-500 italic line-clamp-1">
                    {rev.changeSummary}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Snapshot Viewer (8 Cols) */}
          <div className="md:col-span-8 space-y-4 overflow-y-auto border-l border-slate-100 pl-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                  Inspecting Version {activeRev.version}
                </span>
                <span className="text-xs text-slate-500 ml-2">
                  Timestamp: <strong>{activeRev.date}</strong>
                </span>
              </div>

              <button
                onClick={() => {
                  onRestoreRevision(activeRev.version);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-sm"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Restore This Version</span>
              </button>
            </div>

            {/* Change Note */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold text-slate-700">Change Log Note: </span>
              <span className="text-slate-600">{activeRev.changeSummary}</span>
            </div>

            {/* Title Snapshot */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Headline Snapshot
              </label>
              <div className="p-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900">
                {activeRev.titleSnapshot}
              </div>
            </div>

            {/* Content Snapshot */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Article Body Snapshot
              </label>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {activeRev.contentSnapshot || 'No content captured for this snapshot.'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>GlobalHealth automated audit history retention policy</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
