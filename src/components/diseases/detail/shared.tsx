import React from 'react';
import { HealthCondition } from '../../../types';
import { normalizeText } from '../../../data/diseases/diseaseIndex';

/** Consistent section wrapper with heading. */
export const DiseaseSection: React.FC<{
  id: string;
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}> = ({ id, icon, title, description, children }) => (
  <section id={id} className="scroll-mt-28 border-t border-slate-100 py-8 first:border-t-0 first:pt-0" aria-labelledby={`${id}-heading`}>
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-medical-50 text-medical-700">
        {icon}
      </span>
      <div>
        <h2 id={`${id}-heading`} className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
          {title}
        </h2>
        {description && <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{description}</p>}
      </div>
    </div>
    <div className="mt-5">{children}</div>
  </section>
);

/** Bullet list with icon. */
export const IconList: React.FC<{ items: string[]; icon: React.ReactNode; className?: string }> = ({ items, icon, className = '' }) => (
  <ul className={`space-y-2.5 ${className}`}>
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-slate-600">
        <span className="mt-0.5 shrink-0 text-medical-500">{icon}</span>
        <span>{normalizeText(item)}</span>
      </li>
    ))}
  </ul>
);

export const CarefulNote: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500">{children}</p>
);

/** Consistent subsection label. */
export const SubLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">{children}</h3>
);

/** Consistent action chip-link used across detail page CTAs. */
export const DetailCta: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  tone?: 'default' | 'primary';
}> = ({ onClick, children, tone = 'default' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
      tone === 'primary'
        ? 'bg-medical-600 text-white shadow-sm hover:bg-medical-700'
        : 'border border-slate-200 bg-white text-medical-700 shadow-soft hover:border-medical-200 hover:bg-medical-50'
    }`}
  >
    {children}
  </button>
);

/** Content note shown where the data cannot support a claim. */
export const EmptyNote: React.FC<{ text: string }> = ({ text }) => (
  <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-3 text-xs text-slate-500">{text}</p>
);

export function isDefined<T>(value: T[] | undefined | null): value is T[] {
  return Array.isArray(value) && value.length > 0;
}

export function cleanItems(items: string[] | undefined): string[] {
  if (!items) return [];
  return items.map(normalizeText).filter(Boolean);
}
