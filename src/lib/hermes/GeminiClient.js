/**
 * GeminiClient.js — Free-tier Gemini API client for the Hermes Engine
 *
 * Uses the OpenAI-compatible endpoint so the same pattern works with
 * any provider. Defaults to gemini-2.5-flash (free tier).
 *
 * Free-tier limits (2026):
 *   gemini-2.5-flash  → 15 RPM / 1,000 RPD / 1M TPM
 *   gemini-2.5-pro    → 2 RPM  / 50 RPD   / 32K TPM
 *
 * Set VITE_GEMINI_API_KEY in your .env file.
 */

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/openai';

export const MODELS = {
  FLASH:  'gemini-2.5-flash',   // Fast, free-tier workhorse
  PRO:    'gemini-2.5-pro',     // Long context / lore consistency
  NANO:   'gemini-2.0-flash-lite', // Ultra-fast, lowest cost
};

/**
 * Core chat completion call — OpenAI-compatible format.
 * @param {Object} opts
 * @param {string} opts.model
 * @param {Array}  opts.messages  — [{role, content}]
 * @param {number} [opts.temperature]
 * @param {number} [opts.maxTokens]
 * @param {string} [opts.apiKey]   — falls back to VITE_GEMINI_API_KEY
 * @returns {Promise<string>}  assistant message content
 */
export async function geminiChat({
  model = MODELS.FLASH,
  messages,
  temperature = 0.7,
  maxTokens = 2048,
  apiKey,
}) {
  const key = apiKey || import.meta.env.VITE_GEMINI_API_KEY || '';
  if (!key) throw new Error('[GeminiClient] No API key. Set VITE_GEMINI_API_KEY in .env');

  const res = await fetch(`${GEMINI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`[GeminiClient] API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

/**
 * Streaming chat — yields text chunks as they arrive.
 * @param {Object} opts  — same as geminiChat
 * @yields {string}  text delta
 */
export async function* geminiStream({ model = MODELS.FLASH, messages, temperature = 0.7, apiKey }) {
  const key = apiKey || import.meta.env.VITE_GEMINI_API_KEY || '';
  if (!key) throw new Error('[GeminiClient] No API key.');

  const res = await fetch(`${GEMINI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, messages, temperature, stream: true }),
  });

  if (!res.ok) throw new Error(`[GeminiClient] Stream error ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const raw = line.slice(6).trim();
      if (raw === '[DONE]') return;
      try {
        const chunk = JSON.parse(raw);
        const delta = chunk.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {}
    }
  }
}

/**
 * Simple one-shot prompt helper.
 */
export async function ask(prompt, { model = MODELS.FLASH, apiKey } = {}) {
  return geminiChat({
    model,
    messages: [{ role: 'user', content: prompt }],
    apiKey,
  });
}
