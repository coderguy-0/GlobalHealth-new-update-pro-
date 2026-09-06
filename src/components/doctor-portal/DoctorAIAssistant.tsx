import React, { useState } from 'react';
import { Bot, X, Sparkles, ScanSearch, FileText, FlaskConical, BookOpen, MessageSquareText } from 'lucide-react';

export const DoctorAIAssistant: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close clinical AI assistant' : 'Open clinical AI assistant'}
        className="fixed bottom-6 right-6 z-[55] grid h-14 w-14 place-items-center rounded-full bg-[#1769E0] text-white shadow-xl transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#1769E0]/40"
      >
        <Bot className="h-6 w-6" />
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 z-[55] flex max-h-[80vh] w-[min(380px,calc(100vw-3rem))] flex-col rounded-3xl border border-[#E3E8EF] bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#E3E8EF] px-4 py-3">
            <div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#1769E0]/10 text-[#1769E0]"><Sparkles className="h-4 w-4" /></span><div><p className="text-sm font-extrabold text-[#162235]">GlobalHealth AI</p><p className="text-[10px] text-[#8A97A8]">Clinical assistant</p></div></div>
            <button type="button" onClick={() => setOpen(false)} className="cursor-pointer rounded-lg p-1 text-slate-400 hover:bg-slate-100" aria-label="Close"><X className="h-4 w-4" /></button>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-4">
            <p className="text-xs font-bold text-[#162235]">How can I assist?</p>
            <Option icon={<ScanSearch className="h-3.5 w-3.5" />} label="Search clinical information" />
            <Option icon={<FileText className="h-3.5 w-3.5" />} label="Draft a clinical note" />
            <Option icon={<FlaskConical className="h-3.5 w-3.5" />} label="Explain a laboratory value" />
            <Option icon={<BookOpen className="h-3.5 w-3.5" />} label="Prepare patient education" />
            <Option icon={<MessageSquareText className="h-3.5 w-3.5" />} label="Summarize authorized records" />
            <p className="mt-2 rounded-xl bg-amber-50 p-2.5 text-[10px] leading-relaxed text-amber-800 ring-1 ring-amber-200">
              AI output is AI-generated and requires professional review. It never bypasses patient permissions and cannot make clinical decisions.
            </p>
          </div>
          <div className="border-t border-[#E3E8EF] p-3">
            <input placeholder="Ask about a patient, finding or guideline…" className="w-full rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs focus:border-[#1769E0] focus:outline-none" />
          </div>
        </div>
      )}
    </>
  );
};

const Option: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <button type="button" className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-[#E3E8EF] px-3 py-2.5 text-left text-xs font-bold text-[#162235] transition hover:bg-[#1769E0]/5">
    <span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-50 text-[#1769E0]">{icon}</span>
    {label}
  </button>
);
