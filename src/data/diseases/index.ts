import { HealthCondition } from '../../types';
import { CARDIOLOGY_DISEASES } from './cardiologyDiseases';
import { NEUROLOGY_DISEASES } from './neurologyDiseases';
import { PULMONOLOGY_DISEASES } from './pulmonologyDiseases';
import { GASTROENTEROLOGY_DISEASES } from './gastroenterologyDiseases';
import { ORTHOPEDICS_DISEASES } from './orthopedicsDiseases';
import { NEPHROLOGY_DISEASES } from './nephrologyDiseases';
import { ENDOCRINOLOGY_DISEASES } from './endocrinologyDiseases';
import { DERMATOLOGY_DISEASES } from './dermatologyDiseases';
import { INFECTIOUSDISEASE_DISEASES } from './infectiousdiseaseDiseases';
import { ONCOLOGY_DISEASES } from './oncologyDiseases';

export const ALL_500_DISEASES: HealthCondition[] = [
  ...CARDIOLOGY_DISEASES,
  ...NEUROLOGY_DISEASES,
  ...PULMONOLOGY_DISEASES,
  ...GASTROENTEROLOGY_DISEASES,
  ...ORTHOPEDICS_DISEASES,
  ...NEPHROLOGY_DISEASES,
  ...ENDOCRINOLOGY_DISEASES,
  ...DERMATOLOGY_DISEASES,
  ...INFECTIOUSDISEASE_DISEASES,
  ...ONCOLOGY_DISEASES,
];

export const TOTAL_DISEASE_COUNT = ALL_500_DISEASES.length;
