import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Zap, Brain, Feather, Send, Shield, FlaskConical,
  Play, Square, RefreshCw, Settings, ChevronDown, ChevronUp,
  Terminal, Wifi, WifiOff, Key, CheckCircle, AlertCircle,
  Coins, Radio, Layers, MemoryStick, Globe, GitBranch, Search
} from 'lucide-react';
import { createPageUrl } from '@/utils';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import GlobalPlayer from '@/components/audio/GlobalPlayer';
import {
  runArchitect, runScribe, runDistributor, runSentinel, runAlchemist, runFullPipeline,
  NODE_STATUS
} from '@/lib/hermes/APCNodes';
import { MCP_TOOLS } from '@/lib/hermes/MCPBridge';
import { MODELS } from '@/lib/hermes/GeminiClient';

/* ── Node definitions ── */
const NODE_DEFS = [
  {
    id: 'ARCHITECT',
    label: 'Architect',
    icon: Brain,
    color: 'text-purple-400',
    border: 'border-purple-400/30',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',
    bg: 'from-purple-500/10 to-transparent',
    model: MODELS.PRO,
    description: 'Long-context lore retrieval & strategic planning',
    inputLabel: 'Strategic Topic',
    inputPlaceholder: 'e.g. Q3 release strategy for DOGECHAIN EP',
    runner: (input, apiKey, onLog) => runArchitect({ topic: input, apiKey, onLog }),
  },
  {
    id: 'SCRIBE',
    label: 'Scribe',
    icon: Feather,
    color: 'text-cyan-400',
    border: 'border-cyan-400/30',
    glow: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]',
    bg: 'from-cyan-400/10 to-transparent',
    model: MODELS.FLASH,
    description: 'Fast content writing: lyrics, bios, promo, press kits',
    inputLabel: 'Content Brief',
    inputPlaceholder: 'e.g. bio for DJ Red Fang, dark electronic artist',
    runner: (input, apiKey, onLog) => runScribe({ contentType: 'bio', brief: input, apiKey, onLog }),
  },
  {
    id: 'DISTRIBUTOR',
    label: 'Distributor',
    icon: Send,
    color: 'text-lime-400',
    border: 'border-lime-400/30',
    glow: 'shadow-[0_0_20px_rgba(163,230,53,0.3)]',
    bg: 'from-lime-400/10 to-transparent',
    model: MODELS.FLASH,
    description: 'Platform routing, metadata, release scheduling',
    inputLabel: 'Release Title — Artist',
    inputPlaceholder: 'e.g. Neon Vault EP — DJ Red Fang',
    runner: (input, apiKey, onLog) => {
      const [title, artist] = input.split('—').map((s) => s.trim());
      return runDistributor({ releaseTitle: title || input, artist: artist || 'Unknown', apiKey, onLog });
    },
  },
  {
    id: 'SENTINEL',
    label: 'Sentinel',
    icon: Shield,
    color: 'text-red-400',
    border: 'border-red-400/30',
    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    bg: 'from-red-500/10 to-transparent',
    model: MODELS.NANO,
    description: 'System health, anomaly detection, rate-limit guard',
    inputLabel: 'Check Type',
    inputPlaceholder: 'system / api / memory / full',
    runner: (input, apiKey, onLog) => runSentinel({ checkType: input || 'system', onLog }),
  },
  {
    id: 'ALCHEMIST',
    label: 'Alchemist',
    icon: FlaskConical,
    color: 'text-orange-400',
    border: 'border-orange-400/30',
    glow: 'shadow-[0_0_20px_rgba(251,146,60,0.3)]',
    bg: 'from-orange-400/10 to-transparent',
    model: MODELS.FLASH,
    description: 'Revenue optimization, pricing, XMR/DOGE payment routing',
    inputLabel: 'Product — Base Price',
    inputPlaceholder: 'e.g. Creator Tier Subscription — 9.99',
    runner: (input, apiKey, onLog) => {
      const [product, price] = input.split('—').map((s) => s.trim());
      return runAlchemist({ product: product || input, basePrice: parseFloat(price) || 9.99, apiKey, onLog });
    },
  },
];

const MCP_SERVER_DEFS = [
  { id: 'server-fetch',       label: 'Fetch',            icon: Globe,      color: 'text-blue-400',   desc: 'Web content fetching & conversion' },
  { id: 'server-memory',      label: 'Memory',           icon: MemoryStick, color: 'text-purple-400', desc: 'Persistent key-value agent memory' },
  { id: 'server-filesystem',  label: 'Filesystem',       icon: Layers,     color: 'text-cyan-400',   desc: 'Sandboxed file read/write' },
  { id: 'sequential-thinking',label: 'Sequential Think', icon: Brain,      color: 'text-lime-400',   desc: 'Multi-step reasoning chains' },
  { id: 'server-github',      label: 'GitHub',           icon: GitBranch,  color: 'text-white/60',   desc: 'Repo search & operations' },
  { id: 'exa-mcp-server',     label: 'Exa Search',       icon: Search,     color: 'text-orange-400', desc: 'Semantic web search' },
];

/* ── Log entry component ── */
function LogEntry({ entry }) {
  const colors = {
    ARCHITECT:   'text-purple-400',
    SCRIBE:      'text-cyan-400',
    DISTRIBUTOR: 'text-lime-400',
    SENTINEL:    'text-red-400',
    ALCHEMIST:   'text-orange-400',
    PIPELINE:    'text-white',
  };
  return (
    <div className="flex gap-2 text-xs font-mono">
      <span className="text-white/30 flex-shrink-0">
        {new Date(entry.ts).toLocaleTimeString()}
      </span>
      <span className={`flex-shrink-0 ${colors[entry.nodeId] || 'text-white/60'}`}>
        [{entry.nodeId}]
      </span>
      <span className="text-white/70">{entry.msg}</span>
    </div>
  );
}

/* ── Node card ── */
function NodeCard({ node, apiKey, onLog, onResult }) {
  const [status, setStatus] = useState(NODE_STATUS.IDLE);
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [showResult, setShowResult] = useState(false);
  const Icon = node.icon;

  const run = async () => {
    if (!apiKey) { onLog({ nodeId: node.id, msg: '✗ No API key set. Add your Gemini key in Settings.', ts: Date.now() }); return; }
    if (!input.trim()) { onLog({ nodeId: node.id, msg: '✗ Input is empty.', ts: Date.now() }); return; }
    setStatus(NODE_STATUS.RUNNING);
    setResult('');
    try {
      const out = await node.runner(input, apiKey, onLog);
      setResult(typeof out === 'string' ? out : JSON.stringify(out, null, 2));
      setStatus(NODE_STATUS.SUCCESS);
      setShowResult(true);
      onResult?.({ nodeId: node.id, result: out });
    } catch (e) {
      onLog({ nodeId: node.id, msg: `✗ Error: ${e.message}`, ts: Date.now() });
      setStatus(NODE_STATUS.ERROR);
    }
  };

  const statusDot = {
    [NODE_STATUS.IDLE]:    'bg-white/20',
    [NODE_STATUS.RUNNING]: 'bg-yellow-400 animate-pulse',
    [NODE_STATUS.SUCCESS]: 'bg-lime-400',
    [NODE_STATUS.ERROR]:   'bg-red-500',
    [NODE_STATUS.WAITING]: 'bg-cyan-400 animate-pulse',
  }[status];

  return (
    <div className={`relative glass-panel rounded-2xl p-5 border ${node.border} transition-all`}>
      <GlowingEffect spread={35} glow proximity={70} inactiveZone={0.3} borderWidth={2} />

      {/* Header */}
      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${node.bg} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${node.color}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`font-semibold text-sm ${node.color}`}>{node.label}</h3>
              <div className={`w-2 h-2 rounded-full ${statusDot}`} />
            </div>
            <p className="text-[10px] text-white/40 font-mono">{node.model}</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-white/50 mb-3 relative z-10">{node.description}</p>

      {/* Input */}
      <div className="relative z-10 mb-3">
        <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1 block">
          {node.inputLabel}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={node.inputPlaceholder}
          rows={2}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 resize-none focus:outline-none focus:border-white/30 transition-colors"
        />
      </div>

      {/* Run button */}
      <div className="flex gap-2 relative z-10">
        <button
          type="button"
          onClick={run}
          disabled={status === NODE_STATUS.RUNNING}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
            status === NODE_STATUS.RUNNING
              ? 'bg-white/10 text-white/40 cursor-not-allowed'
              : `bg-gradient-to-r ${node.bg} border ${node.border} ${node.color} hover:bg-white/10`
          }`}
        >
          {status === NODE_STATUS.RUNNING ? (
            <><RefreshCw className="w-3 h-3 animate-spin" /> Running...</>
          ) : (
            <><Play className="w-3 h-3" /> Run Node</>
          )}
        </button>
        {result && (
          <button
            type="button"
            onClick={() => setShowResult(!showResult)}
            className="flex items-center gap-1 px-3 py-2 rounded-full text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            {showResult ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            Output
          </button>
        )}
      </div>

      {/* Result */}
      {showResult && result && (
        <div className="mt-3 relative z-10">
          <pre className="text-xs text-white/70 bg-black/40 rounded-lg p-3 overflow-auto max-h-48 whitespace-pre-wrap border border-white/10">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}

/* ── Main HermesEngine page ── */
export default function HermesEngine() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('hermes:gemini_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(true);
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);
  const [pipelineInput, setPipelineInput] = useState({ topic: '', artist: '', release: '' });
  const [pipelineResults, setPipelineResults] = useState(null);
  const logsEndRef = useRef(null);

  const addLog = useCallback((entry) => {
    setLogs((prev) => [...prev.slice(-199), entry]);
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const saveApiKey = () => {
    localStorage.setItem('hermes:gemini_key', keyInput);
    setApiKey(keyInput);
    setShowKeyInput(false);
    addLog({ nodeId: 'SYSTEM', msg: '✓ Gemini API key saved to localStorage', ts: Date.now() });
  };

  const runPipeline = async () => {
    if (!apiKey) { addLog({ nodeId: 'PIPELINE', msg: '✗ No API key. Set it in Settings first.', ts: Date.now() }); return; }
    setIsPipelineRunning(true);
    setPipelineResults(null);
    try {
      const results = await runFullPipeline({
        topic:        pipelineInput.topic || '33.3FM DOGECHAIN Q3 strategy',
        artist:       pipelineInput.artist || 'DJ Red Fang',
        releaseTitle: pipelineInput.release || 'Neon Vault EP',
        onLog: addLog,
      });
      setPipelineResults(results);
    } catch (e) {
      addLog({ nodeId: 'PIPELINE', msg: `✗ Pipeline error: ${e.message}`, ts: Date.now() });
    } finally {
      setIsPipelineRunning(false);
    }
  };

  const keyStatus = apiKey
    ? { icon: CheckCircle, text: 'API Key Active', color: 'text-lime-400' }
    : { icon: AlertCircle, text: 'No API Key',     color: 'text-red-400' };
  const KeyIcon = keyStatus.icon;

  return (
    <div className="min-h-screen bg-black circuit-pattern text-white">
      {/* Scan line */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-30">
        <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent animate-scan-line" />
      </div>

      {/* ── TOP NAV ── */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to={createPageUrl('Home')} className="flex items-center gap-2 text-white/60 hover:text-purple-400 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">Home</span>
          </Link>

          <div className="flex items-center gap-2 ml-2">
            <Zap className="h-4 w-4 text-purple-400" />
            <span className="font-mono text-sm">
              <span className="text-purple-400">HERMES</span>
              <span className="text-white/40"> ENGINE</span>
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className={`flex items-center gap-1.5 text-xs ${keyStatus.color}`}>
              <KeyIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{keyStatus.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-white/10 text-white/60 hover:bg-white/20 transition-all"
            >
              <Key className="h-3.5 w-3.5" />
              Settings
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-20 pb-32">

        {/* ── API KEY SETUP ── */}
        {showKeyInput && (
          <div className="mb-6 glass-panel rounded-2xl p-5 border border-purple-400/30">
            <h3 className="text-sm font-mono text-purple-400 mb-3 flex items-center gap-2">
              <Key className="h-4 w-4" /> Gemini API Key Setup
            </h3>
            <p className="text-xs text-white/50 mb-4 leading-relaxed">
              Get your free key at{' '}
              <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                aistudio.google.com
              </a>
              . Free tier: <strong className="text-white/70">15 RPM / 1,000 RPD</strong> — sufficient for APC automation.
              The key is stored only in your browser's localStorage.
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="AIza..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-400/50 font-mono"
              />
              <button
                type="button"
                onClick={saveApiKey}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white rounded-lg text-sm font-medium transition-all"
              >
                Save
              </button>
            </div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-white/40">
              <div className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-lime-400" /> gemini-2.5-flash (free)</div>
              <div className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-lime-400" /> gemini-2.5-pro (free, 50 RPD)</div>
              <div className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-lime-400" /> No billing required</div>
            </div>
          </div>
        )}

        {/* ── HERO ── */}
        <div className="glass-panel rounded-2xl p-6 md:p-8 mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-purple-500 opacity-30" />
              <div className="relative h-3 w-3 rounded-full bg-purple-500" />
            </div>
            <span className="text-xs font-mono text-purple-400 tracking-wider uppercase">
              Autonomous Passive Commerce
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            <span className="text-purple-400" style={{ textShadow: '0 0 20px rgba(168,85,247,0.8)' }}>HERMES</span>
            <span className="text-white/80"> ENGINE</span>
          </h1>
          <p className="text-sm text-white/50 max-w-2xl mx-auto mb-4">
            Five sovereign AI nodes powered by <strong className="text-white/70">Gemini free-tier</strong> and
            six open-source <strong className="text-white/70">MCP servers</strong>. Create, distribute, and
            monetize music autonomously on the 33.3FM DOGECHAIN network.
          </p>
          <div className="flex flex-wrap gap-2 justify-center text-xs font-mono">
            {['gemini-2.5-flash', 'gemini-2.5-pro', 'MCP:fetch', 'MCP:memory', 'MCP:filesystem', 'MCP:sequential-thinking', 'XMR payments'].map((tag) => (
              <span key={tag} className="px-2 py-1 rounded-full bg-purple-400/10 text-purple-400 border border-purple-400/20">{tag}</span>
            ))}
          </div>
        </div>

        {/* ── MCP SERVERS STATUS ── */}
        <div className="mb-8">
          <h2 className="text-xs font-mono text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Wifi className="h-3.5 w-3.5" /> Open-Source MCP Servers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {MCP_SERVER_DEFS.map((srv) => (
              <div key={srv.id} className="glass-panel rounded-xl p-3 text-center">
                <srv.icon className={`h-5 w-5 mx-auto mb-1.5 ${srv.color}`} />
                <div className="text-xs font-medium text-white/80">{srv.label}</div>
                <div className="text-[10px] text-white/30 mt-0.5">{srv.desc}</div>
                <div className="mt-2 flex items-center justify-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-lime-400" />
                  <span className="text-[10px] text-lime-400">Browser Mode</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FULL PIPELINE ── */}
        <div className="mb-8 glass-panel rounded-2xl p-5 border border-purple-400/20">
          <h2 className="text-sm font-mono text-purple-400 mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4" /> Full APC Pipeline — Run All 5 Nodes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1 block">Strategic Topic</label>
              <input
                value={pipelineInput.topic}
                onChange={(e) => setPipelineInput((p) => ({ ...p, topic: e.target.value }))}
                placeholder="e.g. Q3 release strategy"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-purple-400/50"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1 block">Artist Name</label>
              <input
                value={pipelineInput.artist}
                onChange={(e) => setPipelineInput((p) => ({ ...p, artist: e.target.value }))}
                placeholder="e.g. DJ Red Fang"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-purple-400/50"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1 block">Release Title</label>
              <input
                value={pipelineInput.release}
                onChange={(e) => setPipelineInput((p) => ({ ...p, release: e.target.value }))}
                placeholder="e.g. Neon Vault EP"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-purple-400/50"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={runPipeline}
            disabled={isPipelineRunning}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
              isPipelineRunning
                ? 'bg-white/10 text-white/40 cursor-not-allowed'
                : 'bg-purple-500 hover:bg-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
            }`}
          >
            {isPipelineRunning ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Running Pipeline...</>
            ) : (
              <><Zap className="w-4 h-4" /> Run Full Pipeline</>
            )}
          </button>

          {pipelineResults && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(pipelineResults).map(([nodeId, result]) => (
                <div key={nodeId} className="bg-black/40 rounded-xl p-3 border border-white/10">
                  <div className="text-xs font-mono text-purple-400 mb-2">[{nodeId.toUpperCase()}]</div>
                  <pre className="text-xs text-white/60 whitespace-pre-wrap overflow-auto max-h-32">
                    {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── NODE CARDS ── */}
        <h2 className="text-xs font-mono text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Brain className="h-3.5 w-3.5" /> Individual Nodes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {NODE_DEFS.map((node) => (
            <NodeCard
              key={node.id}
              node={node}
              apiKey={apiKey}
              onLog={addLog}
              onResult={(r) => addLog({ nodeId: r.nodeId, msg: `✓ Result ready (${String(r.result).length} chars)`, ts: Date.now() })}
            />
          ))}
        </div>

        {/* ── LOG CONSOLE ── */}
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
          <div
            className="flex items-center justify-between px-4 py-3 border-b border-white/10 cursor-pointer"
            onClick={() => setShowLogs(!showLogs)}
          >
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-white/40" />
              <span className="text-xs font-mono text-white/60 uppercase tracking-wider">
                APC Console — {logs.length} entries
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setLogs([]); }}
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                Clear
              </button>
              {showLogs ? <ChevronUp className="h-4 w-4 text-white/40" /> : <ChevronDown className="h-4 w-4 text-white/40" />}
            </div>
          </div>
          {showLogs && (
            <div className="p-4 max-h-64 overflow-y-auto space-y-1 bg-black/60">
              {logs.length === 0 ? (
                <p className="text-xs font-mono text-white/20">Waiting for node activity...</p>
              ) : (
                logs.map((entry, i) => <LogEntry key={i} entry={entry} />)
              )}
              <div ref={logsEndRef} />
            </div>
          )}
        </div>
      </div>

      <GlobalPlayer />
    </div>
  );
}
