import React from 'react';
import { Stethoscope, FlaskConical, ClipboardCheck, ArrowRight } from 'lucide-react';
import { HealthCondition } from '../../../types';
import { DiseaseSection, SubLabel, IconList, cleanItems, EmptyNote, DetailCta } from './shared';

interface Props {
  condition: HealthCondition;
  onFindTests: () => void;
}

/** How is it diagnosed? — the general pathway + connection to the Lab Tests section. */
export const DiseaseDiagnosis: React.FC<Props> = ({ condition, onFindTests }) => {
  const history = condition.diagnosisMedicalHistory;
  const exam = condition.diagnosisPhysicalExam;
  const tests = cleanItems(condition.diagnosisAndTests);

  return (
    <DiseaseSection
      id="diagnosis"
      icon={<Stethoscope className="h-4.5 w-4.5" />}
      title="How is it diagnosed?"
      description="Diagnosis follows a structured clinical pathway — it is rarely based on a single finding."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          {history && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft">
              <SubLabel>Medical history &amp; clinical interview</SubLabel>
              <p className="text-[13px] leading-relaxed text-slate-600">{history}</p>
            </div>
          )}
          {exam && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft">
              <SubLabel>Physical examination</SubLabel>
              <p className="text-[13px] leading-relaxed text-slate-600">{exam}</p>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft">
          <SubLabel>Common evaluation steps</SubLabel>
          {tests.length ? (
            <IconList items={tests} icon={<ClipboardCheck className="h-3.5 w-3.5" />} />
          ) : (
            <EmptyNote text="Test information is not currently available for this condition." />
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-medical-50/70 px-5 py-4">
        <p className="text-xs leading-relaxed text-medical-900">
          Related laboratory tests are explained in the GlobalHealth Lab Tests section. No single test
          confirms every condition — results are interpreted with your full clinical picture.
        </p>
        <DetailCta onClick={onFindTests} tone="primary">
          Explore related lab tests
          <ArrowRight className="h-3.5 w-3.5" />
        </DetailCta>
      </div>
    </DiseaseSection>
  );
};
