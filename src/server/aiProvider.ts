/* ============================================================================
   GlobalHealth AI — model provider abstraction (spec §128).

   GlobalHealth must not be tightly coupled to one AI model. The assistant
   talks to THIS interface only; adding a provider later means implementing
   `generateText` here — no application code changes.

   Implemented providers:
   - "gemini" (Google @google/genai). Default model: gemini-2.5-flash,
     overridable with AI_MODEL.

   The API key never leaves server-side configuration (spec §106) and is
   never logged or included in error payloads sent to clients.
   ========================================================================== */

import { GoogleGenAI } from '@google/genai';

export type AIProviderName = 'gemini';

export interface AiProviderConfig {
  provider: AIProviderName;
  model: string;
  apiKey: string;
}

export interface GenerateTextInput {
  systemInstruction: string;
  prompt: string;
}

export interface GenerateTextResult {
  text: string;
  provider: AIProviderName;
  model: string;
}

/** Typed, user-safe provider failure. `message` is safe to show/log without
 * leaking secrets; `code` lets callers branch (e.g. NOT_CONFIGURED). */
export class AiProviderError extends Error {
  code: 'NOT_CONFIGURED' | 'PROVIDER_FAILED';
  constructor(message: string, code: 'NOT_CONFIGURED' | 'PROVIDER_FAILED') {
    super(message);
    this.code = code;
  }
}

/** Normalizes a Gemini generateContent response into plain text. Exported for
 * unit testing — different SDK versions expose text slightly differently. */
export function extractGeminiText(response: unknown): string {
  const r = response as { text?: string | (() => string) } | null | undefined;
  if (!r) return '';
  if (typeof r.text === 'string') return r.text;
  if (typeof r.text === 'function') {
    try {
      return r.text();
    } catch {
      return '';
    }
  }
  return '';
}

export interface AiProvider {
  /** Generates a single assistant reply. Throws AiProviderError on failure. */
  generateText(input: GenerateTextInput): Promise<GenerateTextResult>;
}

export function createAiProvider(config: AiProviderConfig): AiProvider {
  if (config.provider !== 'gemini') {
    // Future providers (OpenAI/others) plug in here; today Gemini is the only
    // implemented engine, so anything else fails loudly and safely.
    throw new AiProviderError(`AI provider "${config.provider}" is not supported by this build.`, 'NOT_CONFIGURED');
  }
  if (!config.apiKey) {
    throw new AiProviderError('The AI service is not configured on this server (missing API key).', 'NOT_CONFIGURED');
  }

  const client = new GoogleGenAI({
    apiKey: config.apiKey,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
  });

  return {
    async generateText(input: GenerateTextInput): Promise<GenerateTextResult> {
      try {
        const response = await client.models.generateContent({
          model: config.model,
          contents: input.prompt,
          config: { systemInstruction: input.systemInstruction },
        });
        return { text: extractGeminiText(response), provider: 'gemini', model: config.model };
      } catch (err) {
        // Never include the API key or raw provider internals in the message.
        const detail = err instanceof Error ? err.name : 'unknown error';
        throw new AiProviderError(`The AI provider request failed (${detail}).`, 'PROVIDER_FAILED');
      }
    },
  };
}
