// Client for the server-side News Governance Engine (verified authorities,
// submissions, reports, audit). All identity/permissions are enforced by the
// server from the presented session token — this client only carries tokens.

const AUTHORITY_TOKEN_KEY = 'globalhealth_news_authority_token';
const ADMIN_TOKEN_KEY = 'globalhealth_news_admin_token';
const ADMIN_PROFILE_KEY = 'globalhealth_news_admin_profile';

export interface ServerAdmin {
  adminId: string;
  name: string;
  email: string;
  role: string;
  title: string;
  status: string;
  mfaEnabled: boolean;
  permissions: string[];
}
export interface UnifiedLoginResult {
  success: boolean;
  stage: 'mfa' | 'complete';
  accountType: 'admin' | 'authority';
  challengeId?: string;
  challengeExpiresAt?: string;
  demoDelivery?: { channel: string; recipientEmail: string; code: string };
  token?: string;
  admin?: ServerAdmin;
  authority?: any;
}
export interface NewsMfaState {
  challengeId: string;
  accountType: 'admin' | 'authority';
  demoDelivery: { channel: string; recipientEmail: string; code: string };
}

export function getAuthorityToken(): string | null {
  try { return localStorage.getItem(AUTHORITY_TOKEN_KEY); } catch { return null; }
}
export function storeAuthorityToken(token: string) {
  try { localStorage.setItem(AUTHORITY_TOKEN_KEY, token); } catch { /* ignore */ }
}
export function clearAuthorityToken() {
  try { localStorage.removeItem(AUTHORITY_TOKEN_KEY); } catch { /* ignore */ }
}
export function getAdminToken(): string | null {
  try { return localStorage.getItem(ADMIN_TOKEN_KEY); } catch { return null; }
}
/**
 * Stores the server-issued admin session token together with the SERVER
 * GRANTED profile (name, role, permissions). The server profile — not a
 * client-chosen value — is the source of truth for role/permissions.
 */
export function storeAdminSession(token: string, admin: ServerAdmin | null) {
  try {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    if (admin) localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(admin));
    else localStorage.removeItem(ADMIN_PROFILE_KEY);
  } catch { /* ignore */ }
}
export function getAdminProfile(): ServerAdmin | null {
  try {
    const raw = localStorage.getItem(ADMIN_PROFILE_KEY);
    return raw ? (JSON.parse(raw) as ServerAdmin) : null;
  } catch {
    return null;
  }
}
export function clearAdminSession() {
  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_PROFILE_KEY);
  } catch { /* ignore */ }
}
/** Back-compat wrapper (stores token only; profile unknown). */
export function storeAdminToken(token: string) {
  storeAdminSession(token, getAdminProfile());
}

export class NewsGovError extends Error {
  code: string;
  status: number;
  similar?: string[];
  problems?: string[];
  constructor(message: string, code: string, status: number, similar?: string[], problems?: string[]) {
    super(message);
    this.code = code;
    this.status = status;
    this.similar = similar;
    this.problems = problems;
  }
}

interface GovOptions {
  method?: 'GET' | 'POST';
  body?: unknown;
  token: string | null;
}

/** Public Verified-Authority application (no token required). The server
 *  validates the organization details and stores the application as
 *  PENDING_REVIEW for GlobalHealth administrator verification. */
export async function newsAuthorityRegister(input: {
  orgName: string;
  orgType: string;
  website: string;
  contactName: string;
  contactEmail: string;
  representativeName: string;
  representativeRole: string;
  description: string;
  verificationReason: string;
  password: string;
}): Promise<{ success: boolean; message: string }> {
  return newsFetch('/api/news/authority/register', { method: 'POST', body: input, token: null });
}

export async function newsFetch<T = any>(path: string, options: GovOptions): Promise<T> {
  const { method = 'GET', body, token } = options;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  let res: Response;
  try {
    res = await fetch(path, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
  } catch {
    throw new NewsGovError('Network error. Please try again.', 'NETWORK_ERROR', 0);
  }
  let data: any = null;
  try { data = await res.json(); } catch { data = {}; }
  if (!res.ok) {
    const message = data?.error || 'Something went wrong. Please try again.';
    throw new NewsGovError(message, data?.code || `HTTP_${res.status}`, res.status, data?.similar, data?.problems);
  }
  return data as T;
}
