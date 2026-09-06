/* ============================================================================
   GlobalHealth AI — Signed-in (account) knowledge layer.

   The public index deliberately stops at the sign-in wall. This module carries
   the assistant's knowledge of the AUTHENTICATED half of the product: what the
   personal sections are, what they contain, and how the user works with them.

   Hard rule (unchanged security model): these records describe FEATURES, never
   people. There is no user data of any kind in this file. A specific user's
   own values are resolved separately, per request, from the validated session
   (see aiUserContext.buildAuthorizedRecordSummary) — never from here.

   Records are only retrieved when the caller is authenticated. A guest asking
   "what is on my dashboard?" gets the honest sign-in answer instead.
   ========================================================================== */

import { EngineDoc, ScoredHit, lazyIndex, searchIndex } from './ghRetrievalEngine';
import { aliasExpansions } from './ghAliases';

export interface AccountDoc {
  documentId: string;
  entityType: 'ACCOUNT_FEATURE';
  title: string;
  summary: string;
  details: string;
  keywords: string[];
  /** Real route key from src/App.tsx VALID_TABS. */
  route: string;
  sourceTitle: string;
  accessLevel: 'AUTHENTICATED';
  status: 'PUBLISHED';
  version: string;
  lastUpdated: string;
}

const UPDATED = '2026-09-06';

const doc = (d: Omit<AccountDoc, 'entityType' | 'accessLevel' | 'status' | 'version' | 'lastUpdated'>): AccountDoc => ({
  ...d,
  entityType: 'ACCOUNT_FEATURE',
  accessLevel: 'AUTHENTICATED',
  status: 'PUBLISHED',
  version: '1.0.0',
  lastUpdated: UPDATED,
});

export const ACCOUNT_DOCS: AccountDoc[] = [
  doc({
    documentId: 'account:dashboard',
    title: 'Health Dashboard (your personal space)',
    summary:
      'The signed-in Health Dashboard brings the account owner\'s own health picture together: health summary and vitals, current medications, recent lab results, upcoming appointments, reminders and saved content.',
    details:
      'Open Dashboard from the main navigation while signed in. Values shown there belong to the account owner only. The assistant may discuss the owner\'s own dashboard data when it is provided by the authenticated session, and must say when a detail is not available instead of estimating it.',
    keywords: ['dashboard', 'my health', 'my records', 'vitals', 'medications', 'summary', 'reminders', 'saved'],
    route: 'dashboard',
    sourceTitle: 'GlobalHealth → Health Dashboard',
  }),
  doc({
    documentId: 'account:appointments',
    title: 'Appointments (your bookings)',
    summary:
      'Appointments lists the account owner\'s own upcoming and past bookings with doctors and hospitals, including status, and supports booking, rescheduling and cancelling.',
    details:
      'Open Appointments from the main navigation while signed in. Booking flows start from Doctors or Hospitals. Appointment times, statuses and doctors are shown exactly as recorded — the assistant never invents a booking or confirms one it cannot see.',
    keywords: ['appointment', 'booking', 'reschedule', 'cancel', 'visit', 'schedule', 'consultation'],
    route: 'appointments',
    sourceTitle: 'GlobalHealth → Appointments',
  }),
  doc({
    documentId: 'account:privacy-center',
    title: 'Privacy & Consent Center (your data controls)',
    summary:
      'The Privacy & Consent Center is where the account owner reviews and withdraws consents, controls which verified doctors may access their health record, and manages data-sharing preferences.',
    details:
      'Open Privacy from the main navigation while signed in. Doctor access to a personal health record is consent-based: a verified doctor requests access, the owner approves or denies it, and every decision is recorded. Consent can be withdrawn at any time from this section.',
    keywords: ['privacy', 'consent', 'permissions', 'data sharing', 'withdraw consent', 'doctor access', 'record access'],
    route: 'privacy',
    sourceTitle: 'GlobalHealth → Privacy & Consent Center',
  }),
  doc({
    documentId: 'account:my-history',
    title: 'My History (your activity & audit trail)',
    summary:
      'My History shows the account owner\'s own activity on GlobalHealth: what was viewed, searched and saved, plus the audit trail of security-relevant events such as record access.',
    details:
      'Open My History from the main navigation while signed in. The audit trail exists so the owner can see who accessed what and when. The assistant can explain the trail but never reads another account\'s history.',
    keywords: ['history', 'activity', 'audit', 'log', 'recently viewed', 'access log'],
    route: 'my-history',
    sourceTitle: 'GlobalHealth → My History',
  }),
  doc({
    documentId: 'account:ai-conversations',
    title: 'Saved AI conversations',
    summary:
      'Signed-in users get persistent AI Assistant conversations: threads are stored with the account, can be revisited from the conversation sidebar, renamed and deleted.',
    details:
      'Open AI Assistant while signed in to see saved conversations. Guests can chat, but the conversation is not stored with an account. Deleting a conversation removes it from the account.',
    keywords: ['ai', 'assistant', 'conversation', 'chat history', 'saved chats', 'thread'],
    route: 'ai-assistant',
    sourceTitle: 'GlobalHealth → AI Assistant',
  }),
  doc({
    documentId: 'account:security',
    title: 'Account & security settings',
    summary:
      'Account settings cover profile details, email/phone verification, password changes and account security options such as two-factor authentication and active session control.',
    details:
      'Security actions always require the account owner to re-authenticate. The assistant never asks for, repeats or stores passwords, one-time codes or tokens, and never performs a security action on the user\'s behalf.',
    keywords: ['account', 'security', 'password', 'two factor', '2fa', 'verification', 'profile', 'sessions', 'logout'],
    route: 'dashboard',
    sourceTitle: 'GlobalHealth → Account & Security',
  }),
  doc({
    documentId: 'account:health-records',
    title: 'Personal health records & reports',
    summary:
      'Signed-in users can keep health records with the account: lab reports, prescriptions and documents shared through consented doctor access, viewable from the dashboard.',
    details:
      'Records are private to the account owner and to clinicians the owner has explicitly consented to. Lab values must always be read against the reference range printed on the owner\'s own report; the assistant explains, and never diagnoses from, a stored result.',
    keywords: ['health record', 'report', 'lab report', 'prescription', 'ehr', 'documents', 'results'],
    route: 'dashboard',
    sourceTitle: 'GlobalHealth → Health Records',
  }),
];

const accountIndex = lazyIndex<AccountDoc>(() =>
  ACCOUNT_DOCS.map(
    (d): EngineDoc<AccountDoc> => ({
      id: d.documentId,
      type: d.entityType,
      title: d.title,
      keywords: d.keywords.join(' '),
      summary: d.summary,
      details: d.details,
      ref: d,
    })
  )
);

/**
 * Retrieve account-feature knowledge. Callers MUST only pass
 * `authenticated: true` for a validated session — a guest gets nothing.
 */
export function retrieveAccountKnowledge(
  text: string,
  authenticated: boolean,
  maxHits = 2
): ScoredHit<AccountDoc>[] {
  if (!authenticated) return [];
  const query = String(text || '');
  if (!query.trim()) return [];
  const hits = searchIndex(accountIndex(), query, {
    limit: maxHits,
    maxPerType: maxHits,
    minScore: 1.6,
    relativeCutoff: 0.35,
    expansions: aliasExpansions(query),
  });
  // This layer is a 7-record corpus, so its raw BM25 scores are structurally
  // lower than the 2800-document public index. When the owner asks about
  // "my" dashboard/appointments/history, their own account section should
  // lead the answer — this puts the scores on a comparable footing.
  return hits.map((h) => ({ ...h, score: h.score * 2.4 }));
}
