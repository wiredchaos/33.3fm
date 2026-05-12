/**
 * APCNodes.js — Autonomous Passive Commerce sovereign engine nodes
 *
 * Five nodes, each powered by Gemini free-tier + MCP tools:
 *
 *   ARCHITECT  — Lore retrieval, strategy, long-context planning (gemini-2.5-pro)
 *   SCRIBE     — Fast chapter/content writing (gemini-2.5-flash)
 *   DISTRIBUTOR — Platform routing, metadata, release scheduling
 *   SENTINEL   — Monitoring, anomaly detection, rate-limit guard
 *   ALCHEMIST  — Revenue optimization, pricing, XMR payment routing
 */

import { geminiChat, MODELS } from './GeminiClient';
import { callTool, memoryStore } from './MCPBridge';

/* ── Node status enum ── */
export const NODE_STATUS = {
  IDLE:     'idle',
  RUNNING:  'running',
  SUCCESS:  'success',
  ERROR:    'error',
  WAITING:  'waiting',
};

/* ── Base node runner ── */
async function runNode({ nodeId, systemPrompt, userPrompt, model, tools = [], onLog }) {
  const log = (msg) => onLog?.({ nodeId, msg, ts: Date.now() });
  log(`Node ${nodeId} starting...`);

  // Execute any pre-flight MCP tool calls
  const toolResults = {};
  for (const { tool, params } of tools) {
    log(`  → MCP tool: ${tool}`);
    try {
      toolResults[tool] = await callTool(tool, params);
      log(`  ✓ ${tool} complete`);
    } catch (e) {
      log(`  ✗ ${tool} failed: ${e.message}`);
      toolResults[tool] = `[error: ${e.message}]`;
    }
  }

  // Build augmented prompt with tool results
  const augmented = tools.length
    ? `${userPrompt}\n\n--- MCP Tool Results ---\n${JSON.stringify(toolResults, null, 2)}`
    : userPrompt;

  log(`  → Calling Gemini (${model})...`);
  const result = await geminiChat({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: augmented },
    ],
    temperature: 0.7,
    maxTokens: 2048,
  });

  // Persist result to memory
  await callTool('memory_set', { key: `apc:${nodeId}:last_result`, value: result });
  log(`  ✓ ${nodeId} complete (${result.length} chars)`);

  return result;
}

/* ══════════════════════════════════════════════════════════
   NODE 1 — ARCHITECT
   Long-context lore retrieval & strategic planning
   ══════════════════════════════════════════════════════════ */
export async function runArchitect({ topic, context = '', apiKey, onLog }) {
  return runNode({
    nodeId: 'ARCHITECT',
    model: MODELS.PRO,
    systemPrompt: `You are the Architect node of the 33.3FM DOGECHAIN Hermes Engine.
Your role: strategic planning, lore retrieval, and long-context reasoning for the APC system.
You operate on the VSS-33.3 timeline. Respond with structured JSON when asked for plans.
Always maintain the CRAB 3DT Trinity framework: Create, Release, Archive, Broadcast.`,
    userPrompt: `Strategic analysis request: ${topic}\n\nContext: ${context}`,
    tools: [
      { tool: 'think', params: { problem: topic, steps: 4 } },
      { tool: 'memory_get', params: { key: 'apc:lore:context' } },
    ],
    onLog,
  });
}

/* ══════════════════════════════════════════════════════════
   NODE 2 — SCRIBE
   Fast content writing: lyrics, bios, promo, chapters
   ══════════════════════════════════════════════════════════ */
export async function runScribe({ contentType, brief, style = 'broadcast-grade', apiKey, onLog }) {
  const prompts = {
    lyrics:   `Write song lyrics for: ${brief}. Style: ${style}. Include verse, chorus, bridge.`,
    bio:      `Write a professional artist bio: ${brief}. Style: ${style}. 2-3 sentences, broadcast-ready.`,
    promo:    `Write promotional copy: ${brief}. Style: ${style}. Platform-ready for social + 33.3FM.`,
    chapter:  `Write a lore chapter: ${brief}. Style: ${style}. Rich narrative, 300-500 words.`,
    setlist:  `Curate a setlist: ${brief}. Style: ${style}. 8-12 tracks with flow rationale.`,
    presskit: `Write a press kit: ${brief}. Style: ${style}. Include bio, quotes, tech rider summary.`,
  };

  return runNode({
    nodeId: 'SCRIBE',
    model: MODELS.FLASH,
    systemPrompt: `You are the Scribe node of the 33.3FM DOGECHAIN Hermes Engine.
Your role: fast, high-quality content generation for artists on the platform.
Write in a style that is cinematic, broadcast-grade, and culturally resonant.
Output clean, ready-to-use text without meta-commentary.`,
    userPrompt: prompts[contentType] || `Write content about: ${brief}`,
    tools: [
      { tool: 'memory_get', params: { key: `apc:scribe:style:${style}` } },
    ],
    onLog,
  });
}

/* ══════════════════════════════════════════════════════════
   NODE 3 — DISTRIBUTOR
   Platform routing, metadata, release scheduling
   ══════════════════════════════════════════════════════════ */
export async function runDistributor({ releaseTitle, artist, platforms = [], releaseDate, apiKey, onLog }) {
  const platformList = platforms.length ? platforms.join(', ') : 'Spotify, Apple Music, DOGECHAIN, SoundCloud';

  return runNode({
    nodeId: 'DISTRIBUTOR',
    model: MODELS.FLASH,
    systemPrompt: `You are the Distributor node of the 33.3FM DOGECHAIN Hermes Engine.
Your role: generate distribution metadata, platform-specific copy, and release schedules.
Output structured JSON with fields: title, artist, platforms, metadata, schedule, tags.`,
    userPrompt: `Generate distribution plan for:
Title: ${releaseTitle}
Artist: ${artist}
Platforms: ${platformList}
Release Date: ${releaseDate || 'TBD'}`,
    tools: [
      { tool: 'exa_search', params: { query: `${artist} music distribution best practices 2026`, numResults: 3 } },
    ],
    onLog,
  });
}

/* ══════════════════════════════════════════════════════════
   NODE 4 — SENTINEL
   Monitoring, anomaly detection, rate-limit guard
   ══════════════════════════════════════════════════════════ */
export async function runSentinel({ checkType = 'system', onLog }) {
  // Collect memory stats
  const memKeys = Array.from(memoryStore.keys());
  const systemState = {
    memoryKeys: memKeys.length,
    lastArchitectRun: memoryStore.get('apc:ARCHITECT:last_result') ? 'present' : 'empty',
    lastScribeRun:    memoryStore.get('apc:SCRIBE:last_result')    ? 'present' : 'empty',
    timestamp: new Date().toISOString(),
  };

  return runNode({
    nodeId: 'SENTINEL',
    model: MODELS.NANO,
    systemPrompt: `You are the Sentinel node of the 33.3FM DOGECHAIN Hermes Engine.
Your role: system health monitoring, anomaly detection, and rate-limit management.
Analyze the provided system state and return a JSON health report with:
{ status, warnings, recommendations, nextCheckIn }`,
    userPrompt: `System health check (${checkType}):\n${JSON.stringify(systemState, null, 2)}`,
    tools: [],
    onLog,
  });
}

/* ══════════════════════════════════════════════════════════
   NODE 5 — ALCHEMIST
   Revenue optimization, pricing, payment routing
   ══════════════════════════════════════════════════════════ */
export async function runAlchemist({ product, basePrice, currency = 'USD', onLog }) {
  return runNode({
    nodeId: 'ALCHEMIST',
    model: MODELS.FLASH,
    systemPrompt: `You are the Alchemist node of the 33.3FM DOGECHAIN Hermes Engine.
Your role: revenue optimization, dynamic pricing, and multi-currency payment strategy.
You support: USD, XMR (Monero), DOGE, ETH, BTC.
XMR payments receive a 10% discount (privacy premium).
Output structured JSON: { suggestedPrice, xmrEquivalent, dogeEquivalent, discounts, strategy }`,
    userPrompt: `Optimize pricing for:
Product: ${product}
Base Price: ${basePrice} ${currency}
Include XMR discount calculation and DOGE equivalent.`,
    tools: [
      { tool: 'fetch', params: { url: 'https://api.coingecko.com/api/v3/simple/price?ids=monero,dogecoin&vs_currencies=usd', maxLength: 500 } },
    ],
    onLog,
  });
}

/* ── Full APC pipeline: run all nodes in sequence ── */
export async function runFullPipeline({ topic, artist, releaseTitle, onLog }) {
  const results = {};

  onLog?.({ nodeId: 'PIPELINE', msg: 'Starting full APC pipeline...', ts: Date.now() });

  results.architect   = await runArchitect({ topic, onLog });
  results.scribe      = await runScribe({ contentType: 'promo', brief: `${artist} - ${releaseTitle}`, onLog });
  results.distributor = await runDistributor({ releaseTitle, artist, onLog });
  results.sentinel    = await runSentinel({ onLog });
  results.alchemist   = await runAlchemist({ product: releaseTitle, basePrice: 9.99, onLog });

  onLog?.({ nodeId: 'PIPELINE', msg: '✓ Full pipeline complete.', ts: Date.now() });
  return results;
}
