import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadRuntimeConfig } from './config';

test('loadRuntimeConfig defaults to development with safe defaults', () => {
  const cfg = loadRuntimeConfig({});
  assert.equal(cfg.nodeEnv, 'development');
  assert.equal(cfg.isProduction, false);
  assert.equal(cfg.port, 3000);
  assert.equal(cfg.corsOrigins.length, 0);
});

test('loadRuntimeConfig parses production mode and explicit origins', () => {
  const cfg = loadRuntimeConfig({
    NODE_ENV: 'production',
    CORS_ORIGIN: 'https://globalhealth.example',
    PORT: '8443'
  });
  assert.equal(cfg.isProduction, true);
  assert.equal(cfg.port, 8443);
  assert.deepEqual(cfg.corsOrigins, ['https://globalhealth.example']);
});

test('loadRuntimeConfig warns when production critical gates are missing', () => {
  const cfg = loadRuntimeConfig({ NODE_ENV: 'production' });
  assert.ok(cfg.warnings.some((w) => w.includes('GH_ADMIN_KEY')));
  assert.ok(cfg.warnings.some((w) => w.includes('PRESCRIPTION_SIGNING_SECRET')));
  assert.ok(cfg.warnings.some((w) => w.includes('MEDAUTH_REGISTRY_URL')));
});

test('loadRuntimeConfig rejects wildcard CORS in production', () => {
  assert.throws(
    () => loadRuntimeConfig({ NODE_ENV: 'production', CORS_ORIGIN: '*' }),
    /CORS_ORIGIN must not be "\*"/
  );
});

test('invalid port falls back to 3000 with a warning', () => {
  const cfg = loadRuntimeConfig({ PORT: 'not-a-port' });
  assert.equal(cfg.port, 3000);
  assert.ok(cfg.warnings.some((w) => w.includes('PORT')));
});

test('notification delivery is disabled in production without a provider', () => {
  const cfg = loadRuntimeConfig({ NODE_ENV: 'production' });
  assert.equal(cfg.allowAuthCodeCapture, false);
  assert.equal(cfg.notificationWebhookUrl, '');
  assert.ok(
    cfg.warnings.some((w) => w.includes('NOTIFICATION_WEBHOOK_URL')),
    'production without a delivery provider must warn that accounts cannot be verified'
  );
});

test('notification transport is parsed and unknown values are reported', () => {
  assert.equal(loadRuntimeConfig({ NOTIFICATION_TRANSPORT: 'webhook' }).notificationTransport, 'webhook');
  assert.equal(loadRuntimeConfig({ NOTIFICATION_TRANSPORT: 'capture' }).notificationTransport, 'capture');
  assert.equal(loadRuntimeConfig({ NOTIFICATION_TRANSPORT: 'disabled' }).notificationTransport, 'disabled');
  const bad = loadRuntimeConfig({ NOTIFICATION_TRANSPORT: 'carrier-pigeon' });
  assert.equal(bad.notificationTransport, undefined);
  assert.ok(bad.warnings.some((w) => w.includes('carrier-pigeon')));
});

test('AUTH_CODE_CAPTURE is parsed and loudly warned about in production', () => {
  assert.equal(loadRuntimeConfig({ AUTH_CODE_CAPTURE: 'true' }).allowAuthCodeCapture, true);
  assert.equal(loadRuntimeConfig({ AUTH_CODE_CAPTURE: 'yes' }).allowAuthCodeCapture, false);
  const prod = loadRuntimeConfig({ NODE_ENV: 'production', AUTH_CODE_CAPTURE: 'true' });
  assert.ok(prod.warnings.some((w) => w.includes('AUTH_CODE_CAPTURE=true in production')));
});

test('webhook timeout falls back to a sane default', () => {
  assert.equal(loadRuntimeConfig({ NOTIFICATION_WEBHOOK_TIMEOUT_MS: '2500' }).notificationWebhookTimeoutMs, 2500);
  assert.equal(loadRuntimeConfig({ NOTIFICATION_WEBHOOK_TIMEOUT_MS: 'nonsense' }).notificationWebhookTimeoutMs, 8000);
});
