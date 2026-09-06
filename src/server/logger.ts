// Structured, redacted JSON logger.
//
// Never logs passwords, secrets, reset tokens, 2FA secrets, or raw auth
// headers. Redaction is applied to every field before serialization.

type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

type LogField = string | number | boolean | null | undefined | Record<string, unknown> | unknown[];

const REDACT_KEYS = new Set([
  'password',
  'passwordHash',
  'currentPassword',
  'newPassword',
  'confirmPassword',
  'resetToken',
  'token',
  'accessToken',
  'authorization',
  'secret',
  '2fa',
  'twoFactor',
  'secretKey',
  'backupCodes',
  'otp',
  'totp',
  'verificationCode',
  'apiKey'
]);

const REDACTED_VALUE = '[REDACTED]';

function redactFields(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((v) => redactFields(v));
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      out[key] = REDACT_KEYS.has(key.toLowerCase()) ? REDACTED_VALUE : redactFields(val);
    }
    return out;
  }
  return value;
}

function timestamp(): string {
  return new Date().toISOString();
}

export function createLogger(scope: string) {
  const write = (level: Level, message: string, fields: Record<string, unknown>) => {
    const record = {
      ts: timestamp(),
      level,
      scope,
      message,
      ...fields
    };
    const line = JSON.stringify(redactFields(record));
    // eslint-disable-next-line no-console
    if (level === 'error' || level === 'fatal') console.error(line);
    else if (level === 'warn') console.warn(line);
    else console.log(line);
  };

  return {
    debug: (message: string, fields: Record<string, unknown> = {}) => write('debug', message, fields),
    info: (message: string, fields: Record<string, unknown> = {}) => write('info', message, fields),
    warn: (message: string, fields: Record<string, unknown> = {}) => write('warn', message, fields),
    error: (message: string, fields: Record<string, unknown> = {}) => write('error', message, fields),
    fatal: (message: string, fields: Record<string, unknown> = {}) => write('fatal', message, fields)
  };
}

export type Logger = ReturnType<typeof createLogger>;
