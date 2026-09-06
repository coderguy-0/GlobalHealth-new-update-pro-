import { Medicine } from '../../types';
import { PRIMARY_CARE_MEDICINES } from './primaryCareMedicines';
import { CARDIOLOGY_MEDICINES } from './cardiologyMedicines';
import { NEUROLOGY_MEDICINES } from './neurologyMedicines';
import { PULMONOLOGY_MEDICINES } from './pulmonologyMedicines';
import { GASTROENTEROLOGY_MEDICINES } from './gastroenterologyMedicines';
import { ORTHOPEDICS_MEDICINES } from './orthopedicsMedicines';
import { NEPHROLOGY_MEDICINES } from './nephrologyMedicines';
import { SPECIALIST_MEDICINES } from './specialistMedicines';

export {
  PRIMARY_CARE_MEDICINES,
  CARDIOLOGY_MEDICINES,
  NEUROLOGY_MEDICINES,
  PULMONOLOGY_MEDICINES,
  GASTROENTEROLOGY_MEDICINES,
  ORTHOPEDICS_MEDICINES,
  NEPHROLOGY_MEDICINES,
  SPECIALIST_MEDICINES
};

export const ALL_400_MEDICINES: Medicine[] = [
  ...PRIMARY_CARE_MEDICINES,
  ...CARDIOLOGY_MEDICINES,
  ...NEUROLOGY_MEDICINES,
  ...PULMONOLOGY_MEDICINES,
  ...GASTROENTEROLOGY_MEDICINES,
  ...ORTHOPEDICS_MEDICINES,
  ...NEPHROLOGY_MEDICINES,
  ...SPECIALIST_MEDICINES
];
