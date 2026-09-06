import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Lightbulb } from 'lucide-react';
import { HealthCondition } from '../../../types';
import { deriveFaqs, deriveMythsFacts } from '../../../data/diseases/diseaseIndex';
import { DiseaseSection, EmptyNote } from './shared';

const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-soft">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4.5 py-3.5 text-left"
      >
        <span className="text-[13px] font-bold text-slate-800">{question}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="border-t border-slate-100 px-4.5 py-3.5">
          <p className="text-[13px] leading-relaxed text-slate-600">{answer}</p>
        </div>
      )}
    </div>
  );
};

/** Dynamic FAQ — questions derived from real fields, varying per disease. */
export const DiseaseFaq: React.FC<{ condition: HealthCondition }> = ({ condition }) => {
  const faqs = deriveFaqs(condition);
  return (
    <DiseaseSection id="faq" icon={<HelpCircle className="h-4.5 w-4.5" />} title="Common questions">
      {faqs.length ? (
        <div className="space-y-2.5">
          {faqs.map((f, i) => (
            <FaqItem key={i} question={f.question} answer={f.answer} />
          ))}
        </div>
      ) : (
        <EmptyNote text="FAQ information is not currently available for this condition." />
      )}
    </DiseaseSection>
  );
};

/** Myths & facts — only derived from reliable data, never manufactured. */
export const DiseaseMythsFacts: React.FC<{ condition: HealthCondition }> = ({ condition }) => {
  const myths = deriveMythsFacts(condition);
  if (myths.length === 0) return null;
  return (
    <DiseaseSection id="myths" icon={<Lightbulb className="h-4.5 w-4.5" />} title="Common myths & facts">
      <div className="space-y-4">
        {myths.map((m, i) => (
          <div key={i} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft">
            <p className="text-xs font-bold text-slate-400">
              <span className="uppercase tracking-wider">Myth</span>
            </p>
            <p className="mt-1 text-[13px] font-medium text-slate-600">“{m.myth}”</p>
            <p className="mt-3 text-xs font-bold text-medical-700">
              <span className="uppercase tracking-wider">Fact</span>
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-slate-700">{m.fact}</p>
          </div>
        ))}
      </div>
    </DiseaseSection>
  );
};
