import React from 'react';
import { ChevronRight, Bookmark, Share2, Bot, Stethoscope, FlaskConical, Clock } from 'lucide-react';
import { HealthCondition } from '../../../types';
import { Button } from '../../ui/Button';

interface DiseaseHeaderProps {
  condition: HealthCondition;
  isSaved: boolean;
  onToggleSave: () => void;
  onShare: () => void;
  onAskAI: () => void;
  onFindDoctor: () => void;
  onFindTests: () => void;
  onBack: () => void;
  onHome: () => void;
}

/** Restrained disease page header — the name and summary stay the visual focus. */
export const DiseaseHeader: React.FC<DiseaseHeaderProps> = ({
  condition,
  isSaved,
  onToggleSave,
  onShare,
  onAskAI,
  onFindDoctor,
  onFindTests,
  onBack,
  onHome,
}) => {
  return (
    <header>
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          <li>
            <button type="button" onClick={onHome} className="font-semibold text-slate-600 transition hover:text-medical-700">
              Home
            </button>
          </li>
          <li aria-hidden="true"><ChevronRight className="h-3 w-3 text-slate-300" /></li>
          <li>
            <button type="button" onClick={onBack} className="font-semibold text-slate-600 transition hover:text-medical-700">
              Diseases
            </button>
          </li>
          <li aria-hidden="true"><ChevronRight className="h-3 w-3 text-slate-300" /></li>
          <li aria-current="page" className="truncate font-medium text-slate-800">
            {condition.category} · {condition.title}
          </li>
        </ol>
      </nav>

      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-soft sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-medical-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-medical-700">
            {condition.category}
          </span>
          {condition.diseaseType && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-500">
              {condition.diseaseType}
            </span>
          )}
        </div>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{condition.title}</h1>
        {condition.commonName && condition.commonName !== condition.title && (
          <p className="mt-1 text-sm font-medium text-slate-400">Also known as: {condition.commonName}</p>
        )}
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-slate-600">{condition.summary}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Stethoscope className="h-3.5 w-3.5 text-medical-500" />
            Body system: <span className="font-semibold text-slate-700">{condition.bodySystem}</span>
          </span>
          {condition.readTime && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-medical-500" />
              {condition.readTime}
            </span>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-slate-100 pt-5">
          <Button variant={isSaved ? 'subtle' : 'primary'} size="sm" onClick={onToggleSave} aria-pressed={isSaved}>
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
            {isSaved ? 'Saved' : 'Save'}
          </Button>
          <Button variant="secondary" size="sm" onClick={onShare}>
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="secondary" size="sm" onClick={onAskAI}>
            <Bot className="h-4 w-4 text-medical-600" />
            Ask AI
          </Button>
          <div className="ml-auto flex flex-wrap items-center gap-2.5">
            <Button variant="secondary" size="sm" onClick={onFindTests}>
              <FlaskConical className="h-4 w-4" />
              Find Related Tests
            </Button>
            <Button variant="secondary" size="sm" onClick={onFindDoctor}>
              <Stethoscope className="h-4 w-4" />
              Find a Doctor
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
