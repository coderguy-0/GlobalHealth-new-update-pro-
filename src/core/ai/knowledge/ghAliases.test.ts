import { test } from 'node:test';
import assert from 'node:assert/strict';
import { expandQueryWithAliases, GH_ALIASES } from './ghAliases';

test('layman phrases expand to clinical terms (spec §96)', () => {
  const expanded = expandQueryWithAliases('What happens during a heart attack?');
  assert.ok(expanded.includes('myocardial infarction'));
  assert.ok(expanded.includes('heart attack'));

  const bp = expandQueryWithAliases('I have high blood pressure, what should I know?');
  assert.ok(bp.includes('hypertension'));

  const sugar = expandQueryWithAliases('Why is my sugar test high?');
  assert.ok(sugar.includes('glucose'));
  assert.ok(sugar.includes('hba1c'));
});

test('expansion preserves the original user wording', () => {
  const original = 'What happens during a heart attack?';
  const expanded = expandQueryWithAliases(original);
  assert.ok(expanded.includes(original.toLowerCase()));
});

test('text without known aliases is returned unchanged', () => {
  assert.equal(expandQueryWithAliases('How do I open the medical map?'), 'how do i open the medical map?');
});

test('empty input is safe', () => {
  assert.equal(expandQueryWithAliases(''), '');
  assert.equal(expandQueryWithAliases(undefined as unknown as string), '');
});

test('alias graph is bidirectional for the key pairs', () => {
  for (const [phrase, aliases] of Object.entries(GH_ALIASES)) {
    for (const alias of aliases) {
      // Either the alias maps back, or it is a one-way generalization
      // (e.g. cbc -> complete blood count). Both directions must at least
      // exist somewhere in the table for the clinically critical pairs.
      if (['heart attack', 'high blood pressure', 'diabetes', 'stroke'].includes(alias)) {
        assert.ok(
          GH_ALIASES[alias]?.includes(phrase),
          `"${alias}" should map back to "${phrase}" so retrieval works both ways`
        );
      }
    }
  }
});
