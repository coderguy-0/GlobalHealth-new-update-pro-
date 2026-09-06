import React from 'react';
import { Dna, ShieldAlert, AlertCircle } from 'lucide-react';
import { HealthCondition } from '../../../types';
import { DiseaseSection, IconList, SubLabel, cleanItems, EmptyNote, CarefulNote } from './shared';

interface Props {
  condition: HealthCondition;
}

/** Causes & contributing factors — separates known causes from uncertain ones. */
export const DiseaseCauses: React.FC<Props> = ({ condition }) => {
  const causes = cleanItems(condition.causes);
  return (
    <DiseaseSection
      id="causes"
      icon={<Dna className="h-4.5 w-4.5" />}
      title="Causes & Contributing Factors"
      description="Presented associations are contributing factors, not guaranteed causes for every person."
    >
      {causes.length ? <IconList items={causes} icon={<Dna className="h-3.5 w-3.5" />} /> : <EmptyNote text="Cause information is not currently available for this condition." />}
      {condition.howDoesItSpread && (
        <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-600">
          <span className="font-bold text-slate-700">Transmission: </span>
          {condition.howDoesItSpread}
        </div>
      )}
    </DiseaseSection>
  );
};

/** Risk factors — structured, with the "risk factor ≠ certainty" distinction. */
export const DiseaseRiskFactors: React.FC<Props> = ({ condition }) => {
  const riskFactors = cleanItems(condition.riskFactors);
  return (
    <DiseaseSection
      id="risk-factors"
      icon={<ShieldAlert className="h-4.5 w-4.5" />}
      title="Risk Factors"
      description="Factors that may increase the likelihood of developing a condition."
    >
      {riskFactors.length ? (
        <IconList items={riskFactors} icon={<ShieldAlert className="h-3.5 w-3.5" />} />
      ) : (
        <EmptyNote text="Risk-factor information is not currently available for this condition." />
      )}
      <CarefulNote>
        A risk factor is not the same as certainty of developing the disease. Many people with risk
        factors never develop the condition, and some people without them do.
      </CarefulNote>
    </DiseaseSection>
  );
};

/** Possible complications — calm educational language. */
export const DiseaseComplications: React.FC<Props> = ({ condition }) => {
  const complications = cleanItems(condition.complications);
  return (
    <DiseaseSection
      id="complications"
      icon={<AlertCircle className="h-4.5 w-4.5" />}
      title="Possible Complications"
      description="Complications are not inevitable — timely care and management reduce risk."
    >
      {complications.length ? (
        <IconList items={complications} icon={<AlertCircle className="h-3.5 w-3.5" />} />
      ) : (
        <EmptyNote text="Complication information is not currently available for this condition." />
      )}
    </DiseaseSection>
  );
};
