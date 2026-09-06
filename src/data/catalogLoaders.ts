// On-demand loaders for the large clinical catalogs.
//
// The disease, medicine and lab-test catalogs together weigh ~13MB of static
// data. Importing them statically forced every first-time visitor to download
// and parse the whole set before the landing page could paint, even though the
// homepage only ever shows a handful of preview cards.
//
// These loaders use dynamic import() so the bundler emits the catalogs as
// separate chunks that are fetched only when a view actually needs them. Each
// promise is memoised, so the chunk is downloaded and parsed at most once per
// session no matter how many components ask for it.
import type { HealthCondition, Medicine, MedicalTest } from '../types';

let diseasesPromise: Promise<HealthCondition[]> | null = null;
let medicinesPromise: Promise<Medicine[]> | null = null;
let medicalTestsPromise: Promise<MedicalTest[]> | null = null;

export function loadDiseases(): Promise<HealthCondition[]> {
  if (!diseasesPromise) {
    diseasesPromise = import('./diseases').then((m) => m.ALL_500_DISEASES);
  }
  return diseasesPromise;
}

export function loadMedicines(): Promise<Medicine[]> {
  if (!medicinesPromise) {
    medicinesPromise = import('./medicines').then((m) => m.ALL_400_MEDICINES);
  }
  return medicinesPromise;
}

export function loadMedicalTests(): Promise<MedicalTest[]> {
  if (!medicalTestsPromise) {
    medicalTestsPromise = import('./medicalTests').then((m) => m.ALL_1000_MEDICAL_TESTS);
  }
  return medicalTestsPromise;
}
