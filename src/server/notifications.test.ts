import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createNotificationDispatcher,
  resolveTransport,
  redactDestination,
  buildVerificationMessage,
  buildPasswordResetMessage
} from './notifications';
import { createLogger } from './logger';

// The logger writes to stdout; keep the test output readable.
const silentLogger = { ...createLogger('test') };
for (const level of ['debug', 'info', 'warn', 'error', 'fatal'] as const) {
  (silentLogger as any)[level] = () => {};
}

test('resolveTransport prefers an explicitly configured provider', () => {
  assert.equal(resolveTransport('webhook', true, false, 'https://mail.example'), 'webhook');
  assert.equal(resolveTransport('disabled', false, true, 'https://mail.example'), 'disabled');
});

test('resolveTransport fails closed when webhook is selected without a URL', () => {
  assert.equal(resolveTransport('webhook', false, false, ''), 'disabled');
});

test('capture transport is refused in production unless explicitly opted in', () => {
  assert.equal(resolveTransport('capture', true, false, ''), 'disabled');
  assert.equal(resolveTransport('capture', true, true, ''), 'capture');
  assert.equal(resolveTransport('capture', false, false, ''), 'capture');
});

test('auto-selection captures outside production but fails closed in production', () => {
  // A local developer always gets a usable flow.
  assert.equal(resolveTransport(undefined, false, false, ''), 'capture');
  // Production without a provider cannot deliver, so it must not pretend to.
  assert.equal(resolveTransport(undefined, true, false, ''), 'disabled');
  // A configured provider always wins.
  assert.equal(resolveTransport(undefined, true, false, 'https://mail.example'), 'webhook');
});

test('capture dispatcher returns the secret so a developer can finish the flow', async () => {
  const dispatcher = createNotificationDispatcher({
    transport: 'capture',
    allowCapture: true,
    logger: silentLogger as any
  });
  const result = await dispatcher.send(
    buildVerificationMessage('person@example.com', 'email', '123456')
  );
  assert.equal(result.transport, 'capture');
  assert.equal(result.delivered, true);
  assert.equal(result.capturedSecret, '123456');
  assert.equal(dispatcher.outbox.list().length, 1);
});

test('capture dispatcher withholds the secret when capture is not allowed', async () => {
  const dispatcher = createNotificationDispatcher({
    transport: 'capture',
    allowCapture: false,
    logger: silentLogger as any
  });
  const result = await dispatcher.send(
    buildVerificationMessage('person@example.com', 'email', '123456')
  );
  assert.equal(result.delivered, true);
  assert.equal(result.capturedSecret, undefined);
  // The body embeds the secret, so it must not be retained either.
  assert.equal(dispatcher.outbox.list()[0].body, '[body withheld]');
});

test('disabled dispatcher reports failure and never exposes a secret', async () => {
  const dispatcher = createNotificationDispatcher({
    transport: 'disabled',
    allowCapture: true,
    logger: silentLogger as any
  });
  const result = await dispatcher.send(
    buildVerificationMessage('person@example.com', 'email', '123456')
  );
  assert.equal(result.delivered, false);
  assert.equal(result.capturedSecret, undefined);
  assert.equal(result.error, 'NO_TRANSPORT_CONFIGURED');
  assert.equal(dispatcher.outbox.list().length, 0);
});

test('webhook dispatcher posts the message and reports provider rejection', async () => {
  const originalFetch = globalThis.fetch;
  const calls: { url: string; body: any }[] = [];
  try {
    globalThis.fetch = (async (url: any, init: any) => {
      calls.push({ url: String(url), body: JSON.parse(init.body) });
      return { ok: true, status: 202 } as any;
    }) as any;
    const dispatcher = createNotificationDispatcher({
      transport: 'webhook',
      webhookUrl: 'https://mail.example/send',
      allowCapture: false,
      logger: silentLogger as any
    });
    const ok = await dispatcher.send(buildVerificationMessage('a@b.com', 'email', '999999'));
    assert.equal(ok.delivered, true);
    assert.equal(calls[0].url, 'https://mail.example/send');
    assert.equal(calls[0].body.secret, '999999');
    // A webhook transport never returns secrets back to the caller.
    assert.equal(ok.capturedSecret, undefined);

    globalThis.fetch = (async () => ({ ok: false, status: 500 }) as any) as any;
    const bad = await dispatcher.send(buildVerificationMessage('a@b.com', 'email', '999999'));
    assert.equal(bad.delivered, false);
    assert.equal(bad.error, 'WEBHOOK_HTTP_500');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('webhook network failure is reported, never thrown', async () => {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = (async () => {
      throw new Error('ECONNREFUSED');
    }) as any;
    const dispatcher = createNotificationDispatcher({
      transport: 'webhook',
      webhookUrl: 'https://mail.example/send',
      allowCapture: false,
      logger: silentLogger as any
    });
    const result = await dispatcher.send(buildVerificationMessage('a@b.com', 'email', '1'));
    assert.equal(result.delivered, false);
    assert.equal(result.error, 'WEBHOOK_UNREACHABLE');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('outbox is bounded so a long-running process cannot grow without limit', async () => {
  const dispatcher = createNotificationDispatcher({
    transport: 'capture',
    allowCapture: true,
    logger: silentLogger as any
  });
  for (let i = 0; i < 130; i += 1) {
    await dispatcher.send(buildVerificationMessage('person@example.com', 'email', String(i)));
  }
  assert.equal(dispatcher.outbox.list().length, 100);
});

test('redactDestination never reveals a full address', () => {
  assert.equal(redactDestination('someone@example.com'), 'so*****@example.com');
  assert.equal(redactDestination('+91 98765 43210'), '********3210');
  assert.equal(redactDestination(''), '*');
});

test('verification message names the correct channel and carries the code', () => {
  const email = buildVerificationMessage('a@b.com', 'email', '424242');
  assert.equal(email.channel, 'email');
  assert.equal(email.purpose, 'EMAIL_VERIFICATION');
  assert.ok(email.body.includes('424242'));

  const sms = buildVerificationMessage('+911234567890', 'sms', '424242');
  assert.equal(sms.channel, 'sms');
  assert.equal(sms.purpose, 'PHONE_VERIFICATION');
});

test('password reset message embeds a usable recovery link', () => {
  const message = buildPasswordResetMessage('a@b.com', 'email', 'rst-token', 'https://globalhealth.health/');
  assert.equal(message.purpose, 'PASSWORD_RESET');
  assert.ok(message.body.includes('rst-token'));
  assert.ok(message.body.includes('https://globalhealth.health/#auth?resetToken=rst-token'));
});
