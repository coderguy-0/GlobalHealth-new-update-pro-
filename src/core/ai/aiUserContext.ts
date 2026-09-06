/* ============================================================================
   GlobalHealth AI — authorized personal record context (server-side).

   Builds the ONLY private-context block the AI model may receive for a
   signed-in caller. It is derived exclusively from the caller's own account
   record — the same owner-only data the platform already serves back to that
   user via /api/me/ehr, /api/me/health-records and /api/me/appointments.

   Hard rules enforced here:
   - The caller's identity always comes from the validated server session,
     never from the browser. Guests never reach this code path: no session →
     no block at all.
   - Every value is sanitized (line breaks and markup stripped, length
     bounded) and the whole block is hard-capped, so stored data can never
     bloat the prompt or inject instructions into it.
   - Nothing from any other account is ever included.
   ========================================================================== */

export interface AuthorizedUser {
  id: string;
  fullName: string;
}

export interface AuthorizedEhrLike {
  bloodGroup?: string;
  allergies?: string[];
  chronicConditions?: string[];
  immunizations?: { name?: string; date?: string }[];
}

export interface AuthorizedRecordDataLike {
  ehr?: AuthorizedEhrLike;
  healthRecords?: {
    type?: string;
    title?: string;
    date?: string;
    provider?: string;
    summary?: string;
  }[];
  appointments?: {
    doctorName?: string;
    specialty?: string;
    facility?: string;
    date?: string;
    time?: string;
    status?: string;
    reason?: string;
  }[];
}

/** Hard cap for the whole generated block (kept small on purpose). */
export const MAX_AUTHORIZED_CONTEXT_CHARS = 3000;

const MAX_BLOOD_GROUP = 8;
const MAX_LIST_ITEMS = 6;
const MAX_IMMUNIZATIONS = 6;
const MAX_HEALTH_RECORDS = 6;
const MAX_APPOINTMENTS = 5;
const MAX_LIST_CELL = 90;
const MAX_SUMMARY_CELL = 160;

const cleanCell = (v: unknown, max = MAX_LIST_CELL): string =>
  String(v ?? '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/[<>{}]/g, '')
    .trim()
    .slice(0, max);

const cleanList = (values: unknown, maxItems = MAX_LIST_ITEMS): string[] => {
  if (!Array.isArray(values)) return [];
  return values
    .map((v) => cleanCell(v))
    .filter(Boolean)
    .slice(0, maxItems);
};

/**
 * Builds the bounded "AUTHORIZED RECORD SUMMARY" prompt block for the
 * signed-in account owner. Pure function — no I/O, no session access.
 */
export function buildAuthorizedRecordSummary(
  user: AuthorizedUser,
  data: AuthorizedRecordDataLike | null | undefined
): string {
  const lines: string[] = [];

  // ---- Record basics (EHR) ----
  const ehr = data?.ehr ?? {};
  const basics: string[] = [];
  const bloodGroup = cleanCell(ehr.bloodGroup, MAX_BLOOD_GROUP);
  if (bloodGroup) basics.push(`blood group ${bloodGroup}`);
  const allergies = cleanList(ehr.allergies);
  if (allergies.length) basics.push(`allergies: ${allergies.join(', ')}`);
  const conditions = cleanList(ehr.chronicConditions);
  if (conditions.length) basics.push(`chronic conditions: ${conditions.join(', ')}`);
  const immunizations = Array.isArray(ehr.immunizations)
    ? ehr.immunizations
        .slice(0, MAX_IMMUNIZATIONS)
        .map((i) => {
          const name = cleanCell(i?.name, 60);
          const date = cleanCell(i?.date, 20);
          return date ? `${name} on ${date}` : name;
        })
        .filter(Boolean)
    : [];
  if (immunizations.length) basics.push(`immunizations: ${immunizations.join('; ')}`);
  lines.push(`- Record basics: ${basics.length ? basics.join('; ') : 'no clinical details stored yet'}`);

  // ---- Health records on file (e.g. lab reports) ----
  const records = Array.isArray(data?.healthRecords) ? data!.healthRecords!.slice(0, MAX_HEALTH_RECORDS) : [];
  const recordLines: string[] = [];
  for (const r of records) {
    const title = cleanCell(r?.title, 80);
    if (!title) continue;
    const bits = [cleanCell(r?.type, 40), cleanCell(r?.date, 20), cleanCell(r?.provider, 60)].filter(Boolean);
    const summary = cleanCell(r?.summary, MAX_SUMMARY_CELL);
    recordLines.push(`  * ${title}${bits.length ? ` (${bits.join(' · ')})` : ''}${summary ? ` — ${summary}` : ''}`);
  }
  if (recordLines.length) {
    lines.push('- Health records on file:');
    lines.push(...recordLines);
  }

  // ---- Upcoming appointments ----
  const appointments = (Array.isArray(data?.appointments) ? data!.appointments! : [])
    .filter((a) => String(a?.status ?? '').toLowerCase() === 'upcoming')
    .slice(0, MAX_APPOINTMENTS);
  const apptLines: string[] = [];
  for (const a of appointments) {
    const doctor = cleanCell(a?.doctorName, 80);
    if (!doctor) continue;
    const bits = [cleanCell(a?.specialty, 60), cleanCell(a?.facility, 80)].filter(Boolean);
    const when = [cleanCell(a?.date, 20), cleanCell(a?.time, 10)].filter(Boolean).join(' ');
    const reason = cleanCell(a?.reason, 100);
    apptLines.push(`  * ${doctor}${bits.length ? ` (${bits.join(' · ')})` : ''}${when ? ` — ${when}` : ''}${reason ? ` — ${reason}` : ''}`);
  }
  if (apptLines.length) {
    lines.push('- Upcoming appointments:');
    lines.push(...apptLines);
  }

  const who = cleanCell(user?.fullName, 80);
  const header = `AUTHORIZED RECORD SUMMARY for the signed-in account owner${who ? ` (${who})` : ''} — the ONLY private data you may use for personal questions:`;
  const footer =
    'Use this summary ONLY to answer this owner\'s own questions. If the answer needs details not listed here, say you do not have that detail. Never reference, assume or fabricate any other person\'s information.';

  let block = `${header}\n${lines.join('\n')}\n${footer}`;
  if (block.length > MAX_AUTHORIZED_CONTEXT_CHARS) {
    block = `${block.slice(0, MAX_AUTHORIZED_CONTEXT_CHARS)}…`;
  }
  return block;
}
