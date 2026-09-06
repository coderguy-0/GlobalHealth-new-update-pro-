import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createAiProvider, extractGeminiText, AiProviderError } from './aiProvider';

test('extractGeminiText normalizes SDK response variants', () => {
  assert.equal(extractGeminiText({ text: 'hello' }), 'hello');
  assert.equal(extractGeminiText({ text: () => 'via function' }), 'via function');
  assert.equal(extractGeminiText({}), '');
  assert.equal(extractGeminiText(null), '');
  assert.equal(extractGeminiText(undefined), '');
});

test('missing API key fails safely with NOT_CONFIGURED (no network call)', () => {
  assert.throws(
    () => createAiProvider({ provider: 'gemini', model: 'gemini-2.5-flash', apiKey: '' }),
    (err: unknown) => err instanceof AiProviderError && err.code === 'NOT_CONFIGURED'
  );
});

test('unsupported providers fail loudly instead of silently degrading', () => {
  assert.throws(
    () => createAiProvider({ provider: 'openai' as never, model: 'x', apiKey: 'k' }),
    (err: unknown) => err instanceof AiProviderError && err.code === 'NOT_CONFIGURED'
  );
});

test('provider errors never contain the API key', () => {
  const key = 'super-secret-key-abc123';
  try {
    createAiProvider({ provider: 'gemini', model: 'gemini-2.5-flash', apiKey: '' });
    assert.fail('should have thrown');
  } catch (err) {
    assert.ok(err instanceof Error);
    assert.ok(!err.message.includes(key));
  }
});
