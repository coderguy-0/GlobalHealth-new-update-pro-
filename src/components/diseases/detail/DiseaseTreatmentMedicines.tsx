import React from 'react';
import { Pill, HeartPulse, ArrowRight } from 'lucide-react';
import { HealthCondition } from '../../../types';
import { DiseaseSection, IconList, SubLabel, cleanItems, EmptyNote, CarefulNote, DetailCta } from './shared';

interface Props {
  condition: HealthCondition;
  onExploreMedicines: () => void;
  onFindDoctor: () => void;
}

/** Treatment & management — educational structure, never individual instructions. */
export const DiseaseTreatment: React.FC<Props> = ({ condition, onFindDoctor }) => {
  const treatments = cleanItems(condition.treatments);
  const homeCare = cleanItems(condition.homeCare);
  const relief = cleanItems(condition.symptomReliefMedicines);

  return (
    <DiseaseSection
      id="treatment"
      icon={<HeartPulse className="h-4.5 w-4.5" />}
      title="Treatment & Management"
      description="Treatment depends on the individual's condition, severity, medical history and clinician assessment."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {treatments.length > 0 && (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft">
            <SubLabel>General management approach</SubLabel>
            <IconList items={treatments} icon={<HeartPulse className="h-3.5 w-3.5" />} />
          </div>
        )}
        {homeCare.length > 0 && (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft">
            <SubLabel>Everyday care &amp; lifestyle considerations</SubLabel>
            <IconList items={homeCare} icon={<HeartPulse className="h-3.5 w-3.5" />} />
          </div>
        )}
      </div>

      <CarefulNote>
        Do not start, stop or change any treatment without discussing it with a qualified healthcare
        professional. The information here describes general approaches only.
      </CarefulNote>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-medical-50/70 px-5 py-4">
        <p className="text-xs leading-relaxed text-medical-900">
          A specialist commonly manages this condition — find healthcare professionals who can help.
        </p>
        <DetailCta onClick={onFindDoctor} tone="primary">
          Find a specialist
          <ArrowRight className="h-3.5 w-3.5" />
        </DetailCta>
      </div>
    </DiseaseSection>
  );
};

/** Medicines commonly associated — informational bridge to the Medicine system. */
export const DiseaseMedicines: React.FC<Props> = ({ condition, onExploreMedicines }) => {
  const relief = cleanItems(condition.symptomReliefMedicines);

  return (
    <DiseaseSection
      id="medicines"
      icon={<Pill className="h-4.5 w-4.5" />}
      title="Medicines commonly associated with this condition"
      description="Category-level information only. Not every medicine is appropriate for every patient."
    >
      {relief.length ? (
        <>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft">
            <SubLabel>Medication categories &amp; symptom-relief agents</SubLabel>
            <IconList items={relief} icon={<Pill className="h-3.5 w-3.5" />} />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 px-5 py-4">
            <p className="text-xs leading-relaxed text-slate-600">
              The GlobalHealth Medicines directory explains medicine information, available forms,
              precautions and verified pharmacy pathways.
            </p>
            <DetailCta onClick={onExploreMedicines}>
              Learn about this medicine
              <ArrowRight className="h-3.5 w-3.5" />
            </DetailCta>
          </div>
        </>
      ) : (
        <EmptyNote text="Medicine association data is not currently available for this condition." />
      )}
      <CarefulNote>
        Medicine choices are made by a clinician based on your individual condition and history. This
        page never tells you which medicine to take.
      </CarefulNote>
    </DiseaseSection>
  );
};
