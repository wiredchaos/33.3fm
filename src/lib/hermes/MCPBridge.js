/**
 * MCPBridge.js — Browser-side adapter for open-source MCP tool calls
 *
 * Since MCP servers run as local processes (stdio/SSE), this bridge
 * simulates the tool interface in the browser and routes to real
 * endpoints when a backend proxy is available.
 *
 * Open-source MCPs integrated:
 *   1. @modelcontextprotocol/server-fetch      — Web content fetching
 *   2. @modelcontextprotocol/server-filesystem — File read/write (sandboxed)
 *   3. @modelcontextprotocol/server-memory     — Persistent key-value memory
 *   4. sequential-thinking                     — Multi-step reasoning chains
 *   5. @modelcontextprotocol/server-github     — GitHub repo operations
 *   6. exa-mcp-server                          — Semantic web search (Exa AI)
 *
 * In production: point MCP_PROXY_URL to a local mcp-proxy server.
 * In demo mode:  all tools run as in-browser simulations.
 */

const MCP_PROXY_URL = import.meta.env.VITE_MCP_PROXY_URL || null;

/* ── In-memory store (simulates server-memory) ── */
const memoryStore = new Map();

/* ── Sequential thinking chain store ── */
const thinkingChains = new Map();

/* ── Tool registry ── */
export const MCP_TOOLS = {
  // ── FETCH ──────────────────────────────────────────────────────────────
  fetch: {
    name: 'fetch',
    server: 'server-fetch',
    description: 'Fetch a URL and return its text content',
    params: ['url', 'maxLength'],
    async call({ url, maxLength = 5000 }) {
      if (MCP_PROXY_URL) {
        return proxyCall('fetch', 'fetch', { url, maxLength });
      }
      // Browser fallback via CORS proxy
      try {
        const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        const data = await res.json();
        return (data.contents || '').slice(0, maxLength);
      } catch (e) {
        return `[fetch error: ${e.message}]`;
      }
    },
  },

  // ── MEMORY ─────────────────────────────────────────────────────────────
  memory_set: {
    name: 'memory_set',
    server: 'server-memory',
    description: 'Store a value in persistent memory',
    params: ['key', 'value'],
    async call({ key, value }) {
      if (MCP_PROXY_URL) return proxyCall('memory', 'set', { key, value });
      memoryStore.set(key, { value, ts: Date.now() });
      return `Stored: ${key}`;
    },
  },

  memory_get: {
    name: 'memory_get',
    server: 'server-memory',
    description: 'Retrieve a value from persistent memory',
    params: ['key'],
    async call({ key }) {
      if (MCP_PROXY_URL) return proxyCall('memory', 'get', { key });
      const entry = memoryStore.get(key);
      return entry ? entry.value : null;
    },
  },

  memory_list: {
    name: 'memory_list',
    server: 'server-memory',
    description: 'List all memory keys',
    params: [],
    async call() {
      if (MCP_PROXY_URL) return proxyCall('memory', 'list', {});
      return Array.from(memoryStore.keys());
    },
  },

  // ── FILESYSTEM ─────────────────────────────────────────────────────────
  fs_read: {
    name: 'fs_read',
    server: 'server-filesystem',
    description: 'Read a file from the sandboxed workspace',
    params: ['path'],
    async call({ path }) {
      if (MCP_PROXY_URL) return proxyCall('filesystem', 'read_file', { path });
      // Browser: use localStorage as sandbox
      return localStorage.getItem(`fs:${path}`) || `[file not found: ${path}]`;
    },
  },

  fs_write: {
    name: 'fs_write',
    server: 'server-filesystem',
    description: 'Write content to a file in the sandboxed workspace',
    params: ['path', 'content'],
    async call({ path, content }) {
      if (MCP_PROXY_URL) return proxyCall('filesystem', 'write_file', { path, content });
      localStorage.setItem(`fs:${path}`, content);
      return `Written: ${path} (${content.length} chars)`;
    },
  },

  fs_list: {
    name: 'fs_list',
    server: 'server-filesystem',
    description: 'List files in the sandboxed workspace',
    params: ['directory'],
    async call({ directory = '/' }) {
      if (MCP_PROXY_URL) return proxyCall('filesystem', 'list_directory', { path: directory });
      const keys = Object.keys(localStorage)
        .filter((k) => k.startsWith('fs:'))
        .map((k) => k.slice(3));
      return keys;
    },
  },

  // ── SEQUENTIAL THINKING ────────────────────────────────────────────────
  think: {
    name: 'think',
    server: 'sequential-thinking',
    description: 'Run a multi-step reasoning chain',
    params: ['problem', 'steps'],
    async call({ problem, steps = 3 }) {
      if (MCP_PROXY_URL) return proxyCall('sequential-thinking', 'think', { problem, steps });
      const chainId = `chain-${Date.now()}`;
      const chain = { problem, steps: [], status: 'running' };
      thinkingChains.set(chainId, chain);
      // Simulate step-by-step reasoning
      for (let i = 1; i <= steps; i++) {
        chain.steps.push({ step: i, thought: `[Step ${i}] Analyzing: ${problem} — phase ${i}/${steps}` });
      }
      chain.status = 'complete';
      return { chainId, steps: chain.steps };
    },
  },

  // ── GITHUB ─────────────────────────────────────────────────────────────
  github_search: {
    name: 'github_search',
    server: 'server-github',
    description: 'Search GitHub repositories',
    params: ['query', 'limit'],
    async call({ query, limit = 5 }) {
      if (MCP_PROXY_URL) return proxyCall('github', 'search_repositories', { query });
      try {
        const res = await fetch(
          `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=${limit}`,
          { headers: { Accept: 'application/vnd.github.v3+json' } }
        );
        const data = await res.json();
        return (data.items || []).map((r) => ({
          name: r.full_name,
          stars: r.stargazers_count,
          description: r.description,
          url: r.html_url,
        }));
      } catch (e) {
        return `[github error: ${e.message}]`;
      }
    },
  },

  // ── EXA SEARCH ─────────────────────────────────────────────────────────
  exa_search: {
    name: 'exa_search',
    server: 'exa-mcp-server',
    description: 'Semantic web search via Exa AI',
    params: ['query', 'numResults'],
    async call({ query, numResults = 5 }) {
      if (MCP_PROXY_URL) return proxyCall('exa', 'search', { query, numResults });
      // Fallback: DuckDuckGo instant answer API
      try {
        const res = await fetch(
          `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
        );
        const data = await res.json();
        return {
          abstract: data.AbstractText || '',
          source: data.AbstractSource || '',
          url: data.AbstractURL || '',
          relatedTopics: (data.RelatedTopics || []).slice(0, numResults).map((t) => t.Text),
        };
      } catch (e) {
        return `[search error: ${e.message}]`;
      }
    },
  },
};

/* ── Proxy call to a local MCP proxy server ── */
async function proxyCall(server, tool, params) {
  const res = await fetch(`${MCP_PROXY_URL}/call`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ server, tool, params }),
  });
  if (!res.ok) throw new Error(`[MCPBridge] Proxy error ${res.status}`);
  return res.json();
}

/**
 * Call any registered MCP tool by name.
 * @param {string} toolName
 * @param {Object} params
 */
export async function callTool(toolName, params = {}) {
  const tool = MCP_TOOLS[toolName];
  if (!tool) throw new Error(`[MCPBridge] Unknown tool: ${toolName}`);
  return tool.call(params);
}

/**
 * Get the tool definitions array for passing to Gemini as function_declarations.
 */
export function getToolDefinitions() {
  return Object.values(MCP_TOOLS).map((t) => ({
    name: t.name,
    description: t.description,
    parameters: {
      type: 'object',
      properties: Object.fromEntries(t.params.map((p) => [p, { type: 'string' }])),
    },
  }));
}

export { memoryStore };
