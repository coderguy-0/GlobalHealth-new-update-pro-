import { HealthCondition } from '../../types';
import { ALL_DISEASES, BODY_SYSTEMS } from '../../data/diseases/diseaseIndex';

export type DiseaseSort = 'relevance' | 'title-asc' | 'title-desc';

export interface DiseaseFilters {
  categories: string[];
  bodySystemId: string | null;
  specialty: string | null;
  contagiousOnly: boolean;
  savedOnly: boolean;
  letter: string | null;
}

export const EMPTY_FILTERS: DiseaseFilters = {
  categories: [],
  bodySystemId: null,
  specialty: null,
  contagiousOnly: false,
  savedOnly: false,
  letter: null,
};

export function countActiveFilters(f: DiseaseFilters, hasSearch: boolean): number {
  let n = 0;
  n += f.categories.length;
  if (f.bodySystemId) n += 1;
  if (f.specialty) n += 1;
  if (f.contagiousOnly) n += 1;
  if (f.savedOnly) n += 1;
  if (f.letter) n += 1;
  if (hasSearch) n += 1;
  return n;
}

export function bodySystemLabel(id: string): string {
  return BODY_SYSTEMS.find((b) => b.id === id)?.label || id;
}

/** Pure filtering + sorting engine. */
export function filterDiseases(
  query: string,
  filters: DiseaseFilters,
  sort: DiseaseSort,
  savedIds: string[],
  page: number,
  perPage: number
): { items: HealthCondition[]; total: number; availableLetters: string[] } {
  const q = query.trim().toLowerCase();
  const all = ALL_DISEASES;

  const matches = all.filter((cond) => {
    if (filters.categories.length > 0 && !filters.categories.includes(cond.category)) return false;
    if (filters.bodySystemId) {
      const bs = BODY_SYSTEMS.find((b) => b.id === filters.bodySystemId);
      if (!bs) return false;
      const haystack = `${cond.bodySystem || ''} ${cond.category || ''} ${(cond.affectedBodyParts || []).join(' ')}`.toLowerCase();
      if (!bs.keywords.some((k) => haystack.includes(k))) return false;
    }
    if (filters.specialty && cond.specialist !== filters.specialty) return false;
    if (filters.contagiousOnly && !/yes|communicable/i.test(cond.contagious || '')) return false;
    if (filters.savedOnly && !savedIds.includes(cond.id)) return false;
    if (filters.letter && !cond.title.toUpperCase().startsWith(filters.letter)) return false;
    if (q) {
      const haystack =
        `${cond.title} ${cond.commonName || ''} ${cond.category} ${cond.bodySystem || ''} ${cond.specialist || ''} ${(cond.symptoms || []).join(' ')} ${(cond.causes || []).join(' ')} ${(cond.treatments || []).join(' ')} ${(cond.affectedBodyParts || []).join(' ')}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const availableLetters = new Set<string>();
  all.forEach((c) => availableLetters.add(c.title.charAt(0).toUpperCase()));
  const letters = [...availableLetters].sort();

  const sorted = [...matches];
  if (sort === 'title-asc') sorted.sort((a, b) => a.title.localeCompare(b.title));
  else if (sort === 'title-desc') sorted.sort((a, b) => b.title.localeCompare(a.title));
  else if (q) {
    // Relevance: title/start matches first, then category/body matches.
    sorted.sort((a, b) => {
      const score = (c: HealthCondition) => {
        const t = c.title.toLowerCase();
        if (t === q) return 6;
        if (t.startsWith(q)) return 5;
        if (t.includes(q)) return 4;
        if ((c.commonName || '').toLowerCase().includes(q)) return 3;
        if ((c.category || '').toLowerCase().includes(q)) return 2;
        return 1;
      };
      return score(b) - score(a);
    });
  }

  const total = sorted.length;
  const start = (page - 1) * perPage;
  const items = sorted.slice(start, start + perPage);
  return { items, total, availableLetters: letters };
}
