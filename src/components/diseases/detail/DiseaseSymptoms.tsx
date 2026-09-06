import React from 'react';
import { Activity, AlertTriangle, ShieldAlert } from 'lucide-react';
import { HealthCondition } from '../../../types';
import { DiseaseSection, IconList, CarefulNote, SubLabel, cleanItems } from './shared';

interface DiseaseSymptomsProps {
  condition: HealthCondition;
}

/** Symptoms — common / less common / urgent, with calm, non-alarmist wording. */
export const DiseaseSymptoms: React.FC<DiseaseSymptomsProps> = ({ condition }) => {
  const common = cleanItems(condition.commonSymptoms?.length ? condition.commonSymptoms : condition.symptoms);
  const lessCommon = cleanItems(condition.lessCommonSymptoms);
  const urgent = cleanItems(condition.emergencyWarningSigns);
  const early = cleanItems(condition.earlySymptoms);

  return (
    <DiseaseSection
      id="symptoms"
      icon={<Activity className="h-4.5 w-4.5" />}
      title="Symptoms"
      description="Symptom patterns can differ between people. A healthcare professional may be needed to determine the cause."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft">
          <SubLabel>Common symptoms</SubLabel>
          {common.length ? (
            <IconList items={common} icon={<Activity className="h-3.5 w-3.5" />} />
          ) : (
            <p className="text-xs text-slate-400">No common-symptom data available.</p>
          )}
          {early.length > 0 && (
            <div className="mt-4 border-t border-slate-100 pt-4">
              <SubLabel>Possible early signs</SubLabel>
              <IconList items={early.slice(0, 3)} icon={<Activity className="h-3.5 w-3.5" />} />
            </div>
          )}
        </div>

        <div className="space-y-4">
          {lessCommon.length > 0 && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft">
              <SubLabel>Less common symptoms</SubLabel>
              <IconList items={lessCommon} icon={<AlertTriangle className="h-3.5 w-3.5" />} />
            </div>
          )}
          {urgent.length > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
              <SubLabel>Symptoms that may require urgent evaluation</SubLabel>
              <IconList
                items={urgent}
                icon={<ShieldAlert className="h-3.5 w-3.5 text-amber-600" />}
              />
              <CarefulNote>
                If you or someone else experiences these symptoms, seek medical care promptly. When in
                doubt, contact emergency services.
              </CarefulNote>
            </div>
          )}
        </div>
      </div>

      <CarefulNote>
        Some symptoms can overlap with many conditions. Only a qualified healthcare professional can
        determine the cause through proper evaluation.
      </CarefulNote>
    </DiseaseSection>
  );
};
