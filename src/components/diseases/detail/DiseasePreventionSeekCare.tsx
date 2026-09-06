import React from 'react';
import { ShieldCheck, PhoneCall, Stethoscope, Siren } from 'lucide-react';
import { HealthCondition } from '../../../types';
import { DiseaseSection, IconList, SubLabel, cleanItems, EmptyNote } from './shared';

interface Props {
  condition: HealthCondition;
}

/** Prevention & risk reduction — evidence-supported only, honest about limits. */
export const DiseasePrevention: React.FC<Props> = ({ condition }) => {
  const prevention = cleanItems(condition.prevention);
  return (
    <DiseaseSection
      id="prevention"
      icon={<ShieldCheck className="h-4.5 w-4.5" />}
      title="Prevention & Risk Reduction"
      description="Not every condition can be prevented — where prevention is possible, here is what evidence supports."
    >
      {prevention.length ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft">
          <SubLabel>Evidence-supported measures</SubLabel>
          <IconList items={prevention} icon={<ShieldCheck className="h-3.5 w-3.5" />} />
        </div>
      ) : (
        <EmptyNote text="Prevention information is not currently available for this condition." />
      )}
    </DiseaseSection>
  );
};

/** When to seek medical care — three levels, calm and accessible. */
export const DiseaseSeekCare: React.FC<Props> = ({ condition }) => {
  const routine = condition.whenToSeeDoctor;
  const emergency = condition.whenToSeekEmergencyCare;

  return (
    <DiseaseSection
      id="seek-care"
      icon={<Stethoscope className="h-4.5 w-4.5" />}
      title="When should you seek medical care?"
      description="Use these levels as general guidance — trust your judgment and contact a professional when unsure."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-medical-50 text-medical-700">
            <Stethoscope className="h-4.5 w-4.5" />
          </span>
          <h3 className="mt-3 text-sm font-bold text-slate-900">Routine evaluation</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
            For symptoms or concerns that warrant professional assessment but are not necessarily
            urgent.
          </p>
          {routine && <p className="mt-3 rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs leading-relaxed text-slate-600">{routine}</p>}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-600">
            <PhoneCall className="h-4.5 w-4.5" />
          </span>
          <h3 className="mt-3 text-sm font-bold text-slate-900">Prompt medical evaluation</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
            For worsening, persistent, or concerning symptoms — contact a healthcare provider soon.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-600 text-white">
            <Siren className="h-4.5 w-4.5" />
          </span>
          <h3 className="mt-3 text-sm font-bold text-slate-900">Emergency care</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-amber-900/80">
            Emergency symptoms need urgent attention — do not wait.
          </p>
          {emergency && <p className="mt-3 rounded-xl bg-white/80 px-3.5 py-2.5 text-xs leading-relaxed text-amber-900">{emergency}</p>}
          <p className="mt-3 text-[11px] font-bold text-amber-800">In an emergency, call your local emergency number.</p>
        </div>
      </div>
    </DiseaseSection>
  );
};
