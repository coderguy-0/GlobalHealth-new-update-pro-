import React from 'react';
import { Stethoscope, MapPin, ArrowRight } from 'lucide-react';
import { HealthCondition } from '../../../types';
import { DiseaseSection, DetailCta } from './shared';

interface Props {
  condition: HealthCondition;
  onFindDoctor: () => void;
  onOpenMap: () => void;
}

/** Specialist connection + Medical Map bridge. */
export const DiseaseSpecialists: React.FC<Props> = ({ condition, onFindDoctor, onOpenMap }) => {
  const specialist = condition.specialist;
  return (
    <DiseaseSection
      id="specialists"
      icon={<Stethoscope className="h-4.5 w-4.5" />}
      title="Who may help manage this condition?"
    >
      {specialist ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-medical-50 text-medical-700">
              <Stethoscope className="h-6 w-6" />
            </span>
            <div>
              <p className="text-[15px] font-bold text-slate-900">{specialist}</p>
              <p className="text-xs text-slate-500">
                {specialist === 'Infectious Disease Specialist'
                  ? 'Specialists in diagnosing and managing infections.'
                  : `A ${specialist} commonly evaluates and manages conditions like this.`}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <DetailCta onClick={onFindDoctor} tone="primary">
              Find a specialist
              <ArrowRight className="h-3.5 w-3.5" />
            </DetailCta>
            <DetailCta onClick={onOpenMap}>
              <MapPin className="h-3.5 w-3.5" />
              Explore Medical Map
            </DetailCta>
          </div>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-3 text-xs text-slate-500">
          Specialist information is not currently available for this condition.
        </p>
      )}
      <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500">
        The Medical Map connects you to hospitals, clinics, medical centers, nursing homes, urgent
        care facilities and specialized healthcare locations.
      </p>
    </DiseaseSection>
  );
};
