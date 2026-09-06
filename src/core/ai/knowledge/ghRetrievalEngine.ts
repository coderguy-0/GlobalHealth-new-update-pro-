/* ============================================================================
   GlobalHealth AI — Retrieval Engine (shared ranking core).

   This is the "training" layer of the assistant: instead of fine-tuning a
   model on the website, every answer is GROUNDED by ranking the website's own
   canonical records for the user's question and feeding only the best,
   source-labelled matches into the prompt.

   Design goals (kept deliberately dependency-free and deterministic):

   - BM25F ranking with field weights (title > keywords > summary > details)
     so a short, on-topic title outranks a long page that merely mentions the
     word once.
   - Light morphological normalisation (plurals, -ing/-ed) so "calculators",
     "calculator" and "calculating" hit the same records.
   - Alias-aware query expansion: expansions score lower than the user's own
     words, so "heart attack" finds "myocardial infarction" without letting an
     alias outrank an exact match.
   - Typo tolerance: an unknown query term (>= 5 chars) is repaired against the
     index vocabulary at edit distance 1 ("parcetamol" -> "paracetamol"), at a
     reduced weight.
   - Identity gate + adaptive cut-off: a record only qualifies if a query term
     appears in its TITLE or KEYWORDS, and weak tails are dropped relative to
     the best hit. Nothing relevant found => nothing returned. The assistant
     must be able to say "I don't have that", so the engine never pads results.

   The engine is content-agnostic: the public content index, the verified
   clinical libraries and the live directories all use it, which is what makes
   ranking behaviour consistent across the whole site.
   ========================================================================== */

/** A document handed to the engine. `ref` is the caller's own record. */
export interface EngineDoc<T = unknown> {
  id: string;
  type: string;
  title: string;
  /** Short, high-signal terms (synonyms, tags, category names). */
  keywords?: string;
  summary?: string;
  details?: string;
  ref: T;
}

export interface ScoredHit<T = unknown> {
  doc: EngineDoc<T>;
  score: number;
  /** Query terms (normalised) that matched the document. */
  matched: string[];
}

export interface SearchOptions {
  /** Max hits returned overall. */
  limit?: number;
  /** Max hits of a single `type` (diversity across content types). */
  maxPerType?: number;
  /** Multiplier applied to a type's score (intent boosting). */
  typeBoosts?: Record<string, number>;
  /** A matched term must appear in title/keywords (default true). */
  requireIdentity?: boolean;
  /** Absolute minimum BM25F score (default 1.1). */
  minScore?: number;
  /** Drop hits scoring below `topScore * relativeCutoff` (default 0.28). */
  relativeCutoff?: number;
  /** Extra query terms (aliases, context) scored below the user's words. */
  expansions?: string[];
  /** Allow edit-distance-1 repair of unknown terms (default true). */
  typoTolerance?: boolean;
  /**
   * When the best record matches N distinct query terms, weaker records must
   * match at least min(2, N) of them. Kills "one incidental word" matches
   * such as "Membrane Attack Complex" for "heart attack" (default true).
   */
  requireTermCoverage?: boolean;
  /**
   * Terms too generic to prove a record is about the topic ("blood", "test",
   * "high"). They still contribute score, but cannot satisfy the identity
   * gate on their own — this is what stops "my sugar is high" from returning
   * every record with "High" in its name.
   */
  weakIdentityTerms?: Set<string>;
  /**
   * Terms that must never be "repaired" into an index term. Protects real
   * words that simply do not exist in this corpus ("consent" must not become
   * "content" inside the clinical library).
   */
  protectedTerms?: Set<string>;
}

/* -------------------------------------------------------------------------
   Tokenisation
   ------------------------------------------------------------------------- */

/** Function words carry no topic identity. */
export const ENGINE_STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'not', 'for', 'to', 'of', 'in', 'on',
  'at', 'by', 'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being', 'do',
  'does', 'did', 'doing', 'have', 'has', 'had', 'i', 'me', 'my', 'mine', 'we',
  'us', 'our', 'you', 'your', 'yours', 'he', 'him', 'his', 'she', 'her',
  'hers', 'it', 'its', 'they', 'them', 'their', 'this', 'that', 'these',
  'those', 'there', 'here', 'what', 'which', 'who', 'whom', 'whose', 'when',
  'where', 'why', 'how', 'can', 'could', 'should', 'would', 'will', 'shall',
  'may', 'might', 'must', 'need', 'want', 'get', 'got', 'give', 'tell', 'show',
  'about', 'from', 'into', 'over', 'with', 'without', 'please', 'thanks',
  'thank', 'hi', 'hello', 'hey', 'any', 'all', 'some', 'more', 'most', 'much',
  'many', 'also', 'just', 'like', 'if', 'then', 'than', 'so', 'as', 'up',
  'out', 'down', 'off', 'again', 'very', 'really', 'good', 'bad', 'ok',
  // Everyday nouns with no topical meaning. Keeping them out also protects
  // typo repair from turning "thing" into a clinical term like "thin".
  'thing', 'things', 'something', 'anything', 'nothing', 'everything',
  'someone', 'anyone', 'everyone', 'person', 'people', 'way', 'ways',
  'time', 'times', 'stuff', 'lot', 'kind', 'sort', 'bit', 'today',
  'tomorrow', 'yesterday', 'now', 'thanks', 'okay',
]);

/**
 * Conservative stemmer: plurals, simple verb endings and a trailing silent
 * "e". The last rule matters more than it looks — without it "cause",
 * "causes" and "caused" produce three different keys and the typo repair
 * starts inventing matches between them.
 */
export function stemToken(word: string): string {
  let w = word;
  if (w.length <= 3) return w;
  if (w.endsWith("'s")) w = w.slice(0, -2);
  if (w.endsWith('ies') && w.length > 4) w = `${w.slice(0, -3)}y`;
  else if (w.endsWith('sses')) w = w.slice(0, -2);
  else if (/(ches|shes|xes|zes)$/.test(w)) w = w.slice(0, -2);
  else if (w.endsWith('s') && !/(ss|us|is|as|os)$/.test(w)) w = w.slice(0, -1);
  else if (w.endsWith('ing') && w.length > 6) w = w.slice(0, -3);
  else if (w.endsWith('ed') && w.length > 5) w = w.slice(0, -2);
  // Trailing silent "e" (cause -> caus, migraine -> migrain), but never for a
  // vowel pair like "value" or a short word.
  if (w.length >= 5 && w.endsWith('e') && !/[aeiou]e$/.test(w)) w = w.slice(0, -1);
  return w;
}

/** Lowercase, split on non-alphanumerics, drop stopwords, stem. */
export function tokenize(text: string, keepStopwords = false): string[] {
  const raw = String(text || '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .split(/[^a-z0-9]+/);
  const out: string[] = [];
  for (const part of raw) {
    if (!part) continue;
    if (part.length < 2) continue;
    if (!keepStopwords && ENGINE_STOPWORDS.has(part)) continue;
    out.push(stemToken(part));
  }
  return out;
}

/** Normalised phrase form used for exact-title / phrase boosting. */
export function normalizePhrase(text: string): string {
  return tokenize(text, true).join(' ');
}

/* -------------------------------------------------------------------------
   Index
   ------------------------------------------------------------------------- */

const FIELD_WEIGHTS = { title: 4, keywords: 2.5, summary: 1.2, details: 0.7 } as const;
const K1 = 1.4;
const B = 0.6;

interface IndexedDoc<T> {
  doc: EngineDoc<T>;
  /** Weighted term frequencies (BM25F pseudo-frequency). */
  tf: Map<string, number>;
  /** Terms in title/keywords — the identity signal. */
  identity: Set<string>;
  length: number;
  titlePhrase: string;
  titleTokens: string[];
}

export interface RetrievalIndex<T = unknown> {
  size: number;
  docs: IndexedDoc<T>[];
  postings: Map<string, number[]>;
  df: Map<string, number>;
  avgLength: number;
  vocabBuckets: Map<string, string[]>;
}

function addField(tf: Map<string, number>, text: string | undefined, weight: number, sink?: Set<string>): number {
  if (!text) return 0;
  const terms = tokenize(text);
  for (const t of terms) {
    tf.set(t, (tf.get(t) ?? 0) + weight);
    if (sink) sink.add(t);
  }
  return terms.length * weight;
}

export function buildRetrievalIndex<T>(docs: EngineDoc<T>[]): RetrievalIndex<T> {
  const indexed: IndexedDoc<T>[] = [];
  const postings = new Map<string, number[]>();
  const df = new Map<string, number>();
  const vocabBuckets = new Map<string, string[]>();
  let totalLength = 0;

  for (const doc of docs) {
    const tf = new Map<string, number>();
    const identity = new Set<string>();
    let length = 0;
    length += addField(tf, doc.title, FIELD_WEIGHTS.title, identity);
    length += addField(tf, doc.keywords, FIELD_WEIGHTS.keywords, identity);
    length += addField(tf, doc.summary, FIELD_WEIGHTS.summary);
    length += addField(tf, doc.details, FIELD_WEIGHTS.details);
    if (!tf.size) continue;

    const docIdx = indexed.length;
    indexed.push({
      doc,
      tf,
      identity,
      length,
      titlePhrase: normalizePhrase(doc.title),
      titleTokens: tokenize(doc.title),
    });
    totalLength += length;

    for (const term of tf.keys()) {
      const list = postings.get(term);
      if (list) list.push(docIdx);
      else postings.set(term, [docIdx]);
      df.set(term, (df.get(term) ?? 0) + 1);
    }
  }

  // Vocabulary buckets for cheap edit-distance-1 repair.
  for (const term of postings.keys()) {
    if (term.length < 4) continue;
    for (const key of bucketKeys(term)) {
      const list = vocabBuckets.get(key);
      if (list) list.push(term);
      else vocabBuckets.set(key, [term]);
    }
  }

  return {
    size: indexed.length,
    docs: indexed,
    postings,
    df,
    avgLength: indexed.length ? totalLength / indexed.length : 1,
    vocabBuckets,
  };
}

/** Buckets that any edit-distance-1 neighbour is guaranteed to share. */
function bucketKeys(term: string): string[] {
  const head = term.slice(0, 2);
  const tail = term.slice(-2);
  return [`h:${head}:${term.length}`, `h:${head}:${term.length + 1}`, `h:${head}:${term.length - 1}`, `t:${tail}:${term.length}`];
}

/** True when `a` and `b` differ by at most one insert/delete/substitute. */
export function withinOneEdit(a: string, b: string): boolean {
  if (a === b) return true;
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < la && j < lb) {
    if (a[i] === b[j]) {
      i += 1;
      j += 1;
      continue;
    }
    edits += 1;
    if (edits > 1) return false;
    if (la === lb) {
      i += 1;
      j += 1;
    } else if (la > lb) i += 1;
    else j += 1;
  }
  if (i < la || j < lb) edits += 1;
  return edits <= 1;
}

/** True when one term is the other plus/minus a trailing character. */
export function isTrailingEdit(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) !== 1) return false;
  const [shortT, longT] = a.length < b.length ? [a, b] : [b, a];
  return longT.startsWith(shortT);
}

function repairTerm<T>(index: RetrievalIndex<T>, term: string): string | null {
  if (term.length < 5) return null;
  let best: string | null = null;
  let bestDf = 0;
  const seen = new Set<string>();
  for (const key of bucketKeys(term)) {
    for (const candidate of index.vocabBuckets.get(key) ?? []) {
      if (seen.has(candidate)) continue;
      seen.add(candidate);
      if (!withinOneEdit(term, candidate)) continue;
      // A difference at the very END of the word is morphology, not a typo
      // ("cause" must never be repaired into the stem artefact "caus").
      if (isTrailingEdit(term, candidate)) continue;
      const dfv = index.df.get(candidate) ?? 0;
      if (dfv > bestDf) {
        bestDf = dfv;
        best = candidate;
      }
    }
  }
  return best;
}

/* -------------------------------------------------------------------------
   Search
   ------------------------------------------------------------------------- */

interface WeightedTerm {
  term: string;
  weight: number;
  /** Original user word (not an alias / repair). */
  primary: boolean;
}

function buildQueryTerms<T>(
  index: RetrievalIndex<T>,
  query: string,
  expansions: string[],
  typoTolerance: boolean,
  protectedTerms: Set<string>
): WeightedTerm[] {
  const out = new Map<string, WeightedTerm>();
  const push = (term: string, weight: number, primary: boolean) => {
    const existing = out.get(term);
    if (!existing) out.set(term, { term, weight, primary });
    else {
      existing.weight = Math.max(existing.weight, weight);
      existing.primary = existing.primary || primary;
    }
  };

  for (const term of tokenize(query)) {
    if (index.postings.has(term)) {
      push(term, 1, true);
      continue;
    }
    if (!typoTolerance || protectedTerms.has(term)) continue;
    const repaired = repairTerm(index, term);
    // A repaired term is a guess: it scores lower than a word the user
    // actually typed, but it still counts as identity evidence — otherwise a
    // simple typo ("parcetamol") would return nothing at all.
    if (repaired) push(repaired, 0.9, false);
  }

  for (const expansion of expansions) {
    for (const term of tokenize(expansion)) {
      if (!index.postings.has(term)) continue;
      push(term, 0.62, false);
    }
  }

  return [...out.values()];
}

const EMPTY_TERMS: Set<string> = new Set();

export function searchIndex<T>(
  index: RetrievalIndex<T>,
  query: string,
  options: SearchOptions = {}
): ScoredHit<T>[] {
  const limit = options.limit ?? 6;
  const maxPerType = options.maxPerType ?? limit;
  const requireIdentity = options.requireIdentity !== false;
  const minScore = options.minScore ?? 1.1;
  const relativeCutoff = options.relativeCutoff ?? 0.28;
  const typeBoosts = options.typeBoosts ?? {};
  const weakIdentity = options.weakIdentityTerms ?? EMPTY_TERMS;
  const terms = buildQueryTerms(
    index,
    query,
    options.expansions ?? [],
    options.typoTolerance !== false,
    options.protectedTerms ?? EMPTY_TERMS
  );
  if (!terms.length || !index.size) return [];

  const queryPhrase = normalizePhrase(query);
  const queryTokens = tokenize(query);
  const queryTokenSet = new Set(queryTokens);
  const queryBigrams: string[] = [];
  for (let i = 0; i + 1 < queryTokens.length; i += 1) queryBigrams.push(`${queryTokens[i]} ${queryTokens[i + 1]}`);
  const expansionPhrases = (options.expansions ?? [])
    .map((e) => normalizePhrase(e))
    .filter((p) => p.length >= 4);
  const scores = new Map<number, { score: number; matched: string[]; identity: boolean }>();

  for (const { term, weight, primary } of terms) {
    const posting = index.postings.get(term);
    if (!posting) continue;
    const dfv = index.df.get(term) ?? 1;
    const idf = Math.log(1 + (index.size - dfv + 0.5) / (dfv + 0.5));
    for (const docIdx of posting) {
      const entry = index.docs[docIdx];
      const tf = entry.tf.get(term) ?? 0;
      const denom = tf + K1 * (1 - B + (B * entry.length) / (index.avgLength || 1));
      const contribution = weight * idf * ((tf * (K1 + 1)) / (denom || 1));
      const current = scores.get(docIdx) ?? { score: 0, matched: [], identity: false };
      current.score += contribution;
      current.matched.push(term);
      if (entry.identity.has(term) && (primary || weight >= 0.55) && !weakIdentity.has(term)) {
        current.identity = true;
      }
      scores.set(docIdx, current);
    }
  }

  const hits: ScoredHit<T>[] = [];
  let bestTermCount = 0;
  for (const [docIdx, value] of scores) {
    if (requireIdentity && !value.identity) continue;
    const entry = index.docs[docIdx];
    let score = value.score;

    // Exact / containment title match — the strongest human signal there is.
    if (entry.titlePhrase && queryPhrase) {
      if (entry.titlePhrase === queryPhrase) score *= 2.2;
      else if (queryPhrase.includes(entry.titlePhrase)) score *= 1.8;
      else if (entry.titlePhrase.includes(queryPhrase)) score *= 1.45;
    }

    // Alias phrase in the title ("myocardial infarction" for "heart attack").
    if (entry.titlePhrase && expansionPhrases.some((p) => entry.titlePhrase.includes(p))) {
      score *= 1.5;
    }

    // The user effectively said the record's whole name ("lipid profile" →
    // "Lipid Profile", not "Specialized Lipid Profile Assay Marker #6").
    if (entry.titleTokens.length && entry.titleTokens.every((t) => queryTokenSet.has(t))) {
      score *= 1.6;
    } else if (queryBigrams.length && queryBigrams.some((b) => entry.titlePhrase.includes(b))) {
      // A two-word phrase from the question appears verbatim in the title.
      score *= 1.25;
    }

    // Prefer focused records over sprawling ones when scores are close.
    const titleTerms = entry.titlePhrase ? entry.titlePhrase.split(' ').length : 1;
    score *= 1 + 0.5 / (titleTerms + 2);

    const boost = typeBoosts[entry.doc.type];
    if (boost && boost > 0) score *= boost;

    const matched = [...new Set(value.matched)];
    if (matched.length > bestTermCount) bestTermCount = matched.length;
    hits.push({ doc: entry.doc, score, matched });
  }

  if (!hits.length) return [];
  hits.sort((a, b) => b.score - a.score || a.doc.title.length - b.doc.title.length);

  // Term-coverage gate: if something matched several query terms, records that
  // caught only one incidental word are noise, not answers.
  const requiredTerms =
    options.requireTermCoverage === false ? 1 : Math.min(2, Math.max(1, bestTermCount));
  const top = hits[0].score;
  const floor = Math.max(minScore, top * relativeCutoff);
  const perType = new Map<string, number>();
  const out: ScoredHit<T>[] = [];
  for (const hit of hits) {
    if (hit.score < floor) break;
    if (hit.matched.length < requiredTerms) continue;
    const used = perType.get(hit.doc.type) ?? 0;
    if (used >= maxPerType) continue;
    perType.set(hit.doc.type, used + 1);
    out.push(hit);
    if (out.length >= limit) break;
  }
  return out;
}

/** Build once, reuse for the process lifetime (indexes are immutable). */
export function lazyIndex<T>(factory: () => EngineDoc<T>[]): () => RetrievalIndex<T> {
  let cached: RetrievalIndex<T> | null = null;
  return () => {
    if (!cached) cached = buildRetrievalIndex(factory());
    return cached;
  };
}
