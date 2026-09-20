// Notification delivery for GlobalHealth one-time secrets and account notices.
//
// WHY THIS EXISTS
// Registration, email/phone verification and password recovery all depend on a
// one-time secret (a 6-digit code or a reset token) reaching the account owner
// through a channel the account owner controls. Before this module the server
// generated those secrets, stored them, and then silently dropped them: no
// transport was ever called, so a real visitor could create an account but
// could never verify it, and password recovery could never complete.
//
// This module is deliberately transport-agnostic. It never assumes a vendor:
//
//   webhook   — POST the message to NOTIFICATION_WEBHOOK_URL. This is the
//               production transport: point it at your email/SMS provider
//               (SES, Postmark, Twilio, a queue, an internal service, …).
//   capture   — record the message in a bounded in-memory outbox so a developer
//               can complete the flow locally. Returns the secret to the
//               *requesting* caller. Never the default in production.
//   disabled  — fail closed. The secret is never returned to anyone.
//
// SECURITY MODEL
// One-time secrets are a credential. Returning them to the caller is only ever
// acceptable when the operator has explicitly accepted that the environment is
// not handling real personal data. Therefore:
//   * capture is the automatic default ONLY outside production;
//   * in production, capture requires an explicit AUTH_CODE_CAPTURE=true
//     opt-in and raises a startup warning;
//   * the secret is never written to logs (see logger.ts redaction) and is
//     excluded from captured message metadata.

import type { Logger } from './logger';

export type NotificationTransport = 'webhook' | 'capture' | 'disabled';

export type NotificationPurpose =
  | 'EMAIL_VERIFICATION'
  | 'PHONE_VERIFICATION'
  | 'PASSWORD_RESET'
  | 'ACCOUNT_NOTICE';

export interface NotificationMessage {
  /** Destination address: email address, or phone number for SMS. */
  to: string;
  channel: 'email' | 'sms';
  purpose: NotificationPurpose;
  subject: string;
  /** Human-readable body. Templates embed the secret; the secret field below
   *  is the same value kept separate so transports can pick either. */
  body: string;
  /** One-time secret (verification code / reset token). Never logged. */
  secret?: string;
}

export interface DeliveryResult {
  transport: NotificationTransport;
  /** True when a real transport accepted the message. */
  delivered: boolean;
  /** Populated ONLY by the capture transport, and only when the operator has
   *  allowed it. Everywhere else this stays undefined. */
  capturedSecret?: string;
  /** Operator-facing failure reason. Never shown verbatim to end users. */
  error?: string;
}

export interface CapturedNotification {
  id: string;
  to: string;
  channel: 'email' | 'sms';
  purpose: NotificationPurpose;
  subject: string;
  body: string;
  capturedAt: string;
}

export interface NotificationDispatcherOptions {
  transport: NotificationTransport;
  webhookUrl?: string;
  webhookTimeoutMs?: number;
  /** Allows the capture transport to return secrets to the caller. */
  allowCapture: boolean;
  logger: Logger;
}

const MAX_CAPTURED = 100;
const DEFAULT_TIMEOUT_MS = 8000;

/** Bounded, in-memory record of captured messages (developer aid only). */
export class NotificationOutbox {
  private items: CapturedNotification[] = [];
  private counter = 0;

  record(message: NotificationMessage, capturedSecret?: string): CapturedNotification {
    this.counter += 1;
    const entry: CapturedNotification = {
      id: `ntf-${Date.now()}-${this.counter}`,
      to: message.to,
      channel: message.channel,
      purpose: message.purpose,
      subject: message.subject,
      // The body embeds the secret, so it is stored only when the operator has
      // explicitly allowed secret capture for this process.
      body: capturedSecret === undefined ? '[body withheld]' : message.body,
      capturedAt: new Date().toISOString()
    };
    this.items.push(entry);
    if (this.items.length > MAX_CAPTURED) {
      this.items = this.items.slice(-MAX_CAPTURED);
    }
    return entry;
  }

  list(): CapturedNotification[] {
    return [...this.items];
  }

  clear(): void {
    this.items = [];
  }
}

export interface NotificationDispatcher {
  transport: NotificationTransport;
  send(message: NotificationMessage): Promise<DeliveryResult>;
  /** Bounded view of captured messages. Empty unless transport is capture. */
  outbox: NotificationOutbox;
}

/**
 * Resolves the effective transport from operator configuration.
 *
 * `isProduction` gates capture: production never captures unless the operator
 * explicitly opted in, so a misconfigured deploy cannot start leaking
 * one-time secrets over the network.
 */
export function resolveTransport(
  configured: NotificationTransport | undefined,
  isProduction: boolean,
  allowCapture: boolean,
  webhookUrl: string
): NotificationTransport {
  if (configured === 'webhook') return webhookUrl ? 'webhook' : 'disabled';
  if (configured === 'disabled') return 'disabled';
  if (configured === 'capture') {
    // Capture is a development facility. Production only runs it when the
    // operator has explicitly accepted that secrets may reach the browser.
    return !isProduction || allowCapture ? 'capture' : 'disabled';
  }
  // Auto-select: a configured provider always wins, because that is the only
  // way a real visitor receives their code. Outside production, capture keeps a
  // local developer able to finish the flow.
  if (webhookUrl) return 'webhook';
  if (!isProduction) return 'capture';
  return allowCapture ? 'capture' : 'disabled';
}

export function createNotificationDispatcher(
  options: NotificationDispatcherOptions
): NotificationDispatcher {
  const { transport, webhookUrl, logger } = options;
  const timeoutMs = options.webhookTimeoutMs ?? DEFAULT_TIMEOUT_MS;
  const outbox = new NotificationOutbox();

  const deliver = async (message: NotificationMessage): Promise<DeliveryResult> => {
    if (transport === 'disabled') {
      logger.warn('notification delivery is disabled; one-time secret was not sent', {
        purpose: message.purpose,
        channel: message.channel
      });
      return { transport, delivered: false, error: 'NO_TRANSPORT_CONFIGURED' };
    }

    if (transport === 'capture') {
      // The secret is disclosed only under an explicit opt-in, and the retained
      // message body is gated on the same decision so the outbox cannot become
      // a secondary store of live credentials.
      const disclosedSecret = options.allowCapture ? message.secret : undefined;
      outbox.record(message, disclosedSecret);
      const captured: DeliveryResult = { transport, delivered: true };
      if (disclosedSecret) captured.capturedSecret = disclosedSecret;
      logger.info('notification captured for local development', {
        purpose: message.purpose,
        channel: message.channel,
        to: redactDestination(message.to)
      });
      return captured;
    }

    // webhook
    try {
      const res = await fetch(webhookUrl as string, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: message.to,
          channel: message.channel,
          purpose: message.purpose,
          subject: message.subject,
          body: message.body,
          secret: message.secret
        }),
        signal: AbortSignal.timeout(timeoutMs)
      });
      if (!res.ok) {
        logger.error('notification webhook rejected the message', {
          purpose: message.purpose,
          status: res.status
        });
        return { transport, delivered: false, error: `WEBHOOK_HTTP_${res.status}` };
      }
      outbox.record(message, undefined);
      logger.info('notification dispatched', {
        purpose: message.purpose,
        channel: message.channel,
        to: redactDestination(message.to)
      });
      return { transport, delivered: true };
    } catch (err) {
      logger.error('notification webhook failed', {
        purpose: message.purpose,
        reason: (err as Error)?.message
      });
      return { transport, delivered: false, error: 'WEBHOOK_UNREACHABLE' };
    }
  };

  return { transport, send: deliver, outbox };
}

/** Keeps logs useful without writing a full address into them. */
export function redactDestination(destination: string): string {
  const value = String(destination || '');
  if (value.includes('@')) {
    const [local, domain] = value.split('@');
    const head = local.slice(0, 2);
    return `${head}${'*'.repeat(Math.max(local.length - 2, 1))}@${domain}`;
  }
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 4) return '*'.repeat(digits.length || 1);
  return `${'*'.repeat(digits.length - 4)}${digits.slice(-4)}`;
}

/** Builds the verification message body for a channel. */
export function buildVerificationMessage(
  to: string,
  channel: 'email' | 'sms',
  code: string
): NotificationMessage {
  const minutes = 15;
  return {
    to,
    channel,
    purpose: channel === 'sms' ? 'PHONE_VERIFICATION' : 'EMAIL_VERIFICATION',
    subject: 'Your GlobalHealth verification code',
    body:
      `Your GlobalHealth verification code is ${code}. ` +
      `It expires in ${minutes} minutes. ` +
      `If you did not request this, you can safely ignore this message.`,
    secret: code
  };
}

/** Builds the password-recovery message body for a channel. */
export function buildPasswordResetMessage(
  to: string,
  channel: 'email' | 'sms',
  token: string,
  appUrl: string
): NotificationMessage {
  const minutes = 30;
  const link = `${appUrl.replace(/\/$/, '')}/#auth?resetToken=${encodeURIComponent(token)}`;
  return {
    to,
    channel,
    purpose: 'PASSWORD_RESET',
    subject: 'Reset your GlobalHealth password',
    body:
      `We received a request to reset your GlobalHealth password. ` +
      `Use this recovery code within ${minutes} minutes: ${token}. ` +
      `Recovery link: ${link}. ` +
      `If you did not request a reset, no action is needed and your password stays unchanged.`,
    secret: token
  };
}
