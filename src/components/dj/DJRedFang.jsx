import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { Mic2, Sparkles, Radio, Volume2, X, Minimize2, Maximize2, Zap, TrendingUp, Users } from 'lucide-react';

export default function DJRedFang({ context = 'greeting', currentGenre = 'electronic', chatSentiment = 'neutral' }) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showPoll, setShowPoll] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [autoMode, setAutoMode] = useState(false);

  const contextMessages = {
    greeting: "What's up, I'm Red Fang. Ready to drop some heat on the airwaves?",
    recording: "Hit that record button. I'll keep the vibe right while you lay down your track.",
    live: "We're LIVE! Keep the energy high, the frequency's locked in.",
    broadcast: "Your station, your rules. I'm here to keep the signal strong.",
  };

  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => {
      setMessage(contextMessages[context] || contextMessages.greeting);
      setIsTyping(false);
    }, 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);

  const askRedFang = async (question) => {
    setIsTyping(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are DJ Red Fang, a charismatic radio DJ at 33.3FM DOGECHAIN. Keep responses short, energetic, and music-focused. Use broadcast lingo. User asks: ${question}`,
      });
      setMessage(response);
    } catch (error) {
      setMessage("Signal's a bit fuzzy right now. Try me again in a sec.");
    } finally {
      setIsTyping(false);
    }
  };

  const generateTrackSuggestions = async () => {
    setIsTyping(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are DJ Red Fang. Generate 3 track suggestions. Current genre: ${currentGenre}. Chat vibe: ${chatSentiment}. Return ONLY a JSON array of objects with "artist" and "track" fields.`,
        response_json_schema: {
          type: "object",
          properties: {
            tracks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  artist: { type: "string" },
                  track: { type: "string" }
                }
              }
            }
          }
        }
      });
      setSuggestions(response.tracks || []);
      setMessage(`Based on the ${chatSentiment} energy in the chat, here's what's hitting right now:`);
    } catch (error) {
      setMessage("Let me read the room first...");
    } finally {
      setIsTyping(false);
    }
  };

  const launchPoll = async (question) => {
    setShowPoll(true);
    setMessage(`🎤 POLL TIME: ${question}`);
  };

  const greetVIP = async () => {
    try {
      const tips = await base44.entities.Tip.list('-created_date', 5);
      const subscriptions = await base44.entities.Subscription.filter({ tier: 'vip' });
      
      if (tips.length > 0 || subscriptions.length > 0) {
        const vipNames = tips.slice(0, 3).map(t => t.from_user.split('@')[0]);
        setMessage(`Big shout to our supporters: ${vipNames.join(', ')}! Y'all keep the station alive. 🔥`);
      }
    } catch (error) {
      console.error('VIP greeting failed:', error);
    }
  };

  const analyzeAudience = async () => {
    setIsTyping(true);
    try {
      const tips = await base44.entities.Tip.list('-created_date', 10);
      const subs = await base44.entities.Subscription.list('-created_date', 10);
      
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are DJ Red Fang analyzing the audience. Recent activity: ${tips.length} tips, ${subs.length} subscriptions. Current genre: ${currentGenre}, chat vibe: ${chatSentiment}. Give a short, energetic audience insight and what to play next.`,
      });
      setMessage(response);
    } catch (error) {
      setMessage("Reading the crowd... Hold tight!");
    } finally {
      setIsTyping(false);
    }
  };

  const generateSetlist = async () => {
    setIsTyping(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are DJ Red Fang. Create a 5-track setlist for a ${currentGenre} set with ${chatSentiment} energy. Return JSON only.`,
        response_json_schema: {
          type: "object",
          properties: {
            setlist: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  position: { type: "number" },
                  artist: { type: "string" },
                  track: { type: "string" },
                  reason: { type: "string" }
                }
              }
            }
          }
        }
      });
      setSuggestions(response.setlist || []);
      setMessage(`Full setlist incoming. This is how we ride the wave:`);
    } catch (error) {
      setMessage("Give me a sec to mix this up...");
    } finally {
      setIsTyping(false);
    }
  };

  const handleCustomPrompt = async () => {
    if (!customPrompt.trim()) return;
    await askRedFang(customPrompt);
    setCustomPrompt('');
  };

  useEffect(() => {
    if (autoMode && !isTyping) {
      const autoActions = [analyzeAudience, generateTrackSuggestions, greetVIP];
      const interval = setInterval(() => {
        const randomAction = autoActions[Math.floor(Math.random() * autoActions.length)];
        randomAction();
      }, 45000); // Every 45 seconds
      return () => clearInterval(interval);
    }
  }, [autoMode, isTyping]);

  // Minimized floating button
  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-24 left-6 z-30 w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/50 hover:shadow-red-500/70 transition-all group"
      >
        <Mic2 className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-24 left-6 z-30 pointer-events-auto transition-all duration-300 ${
      isExpanded ? 'w-[500px]' : 'w-80'
    }`}>
      <div className="backdrop-blur-xl bg-gradient-to-br from-black/95 to-red-950/40 border-2 border-red-500/50 rounded-2xl shadow-2xl shadow-red-500/30 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-red-500/30 bg-gradient-to-r from-red-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                <Mic2 className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center">
                <Volume2 className="w-2 h-2 text-black" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-red-400 font-bold text-sm uppercase tracking-wide">Red Fang</h3>
                <div className="px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] uppercase tracking-wider">
                  AI DJ
                </div>
              </div>
              <p className="text-cyan-400 text-xs">33.3FM · Live Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setAutoMode(!autoMode)}
              className={`w-8 h-8 ${autoMode ? 'text-cyan-400' : 'text-white/40'} hover:text-cyan-400`}
              title="Auto Mode"
            >
              <Zap className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-8 h-8 text-white/40 hover:text-white"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(true)}
              className="w-8 h-8 text-white/40 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[400px] overflow-y-auto">
          {/* Status Bar */}
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-xs text-white/60">
              <TrendingUp className="w-3 h-3 text-cyan-400" />
              <span>Genre: {currentGenre}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <Users className="w-3 h-3 text-cyan-400" />
              <span>Vibe: {chatSentiment}</span>
            </div>
            {autoMode && (
              <div className="flex items-center gap-1 text-xs text-cyan-400 animate-pulse">
                <Zap className="w-3 h-3" />
                <span>Auto</span>
              </div>
            )}
          </div>

          {/* Message */}
          <div className="min-h-[60px] mb-4">
            {isTyping ? (
              <div className="flex items-center gap-2 text-white/60">
                <span className="text-sm">Red Fang is analyzing</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            ) : (
              <p className="text-white leading-relaxed text-sm">{message}</p>
            )}
          </div>

          {/* Track Suggestions */}
          {suggestions.length > 0 && (
            <div className="mb-4 space-y-2">
              {suggestions.map((track, i) => (
                <div key={i} className="px-3 py-2 rounded-lg bg-gradient-to-r from-red-500/10 to-cyan-400/10 border border-red-500/30 hover:border-cyan-400/50 transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs text-cyan-400">{track.artist}</div>
                    {track.position && (
                      <div className="text-[10px] text-white/40">#{track.position}</div>
                    )}
                  </div>
                  <div className="text-sm text-white font-medium">{track.track}</div>
                  {track.reason && (
                    <div className="text-xs text-white/60 mt-1">{track.reason}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Custom Prompt */}
          {isExpanded && (
            <div className="mb-4">
              <div className="text-xs text-white/60 mb-2">Ask Red Fang</div>
              <div className="flex gap-2">
                <Input
                  placeholder="What should I play next?"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCustomPrompt()}
                  className="bg-white/5 border-red-500/30 text-white text-sm h-8"
                />
                <Button
                  onClick={handleCustomPrompt}
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 h-8 px-3"
                >
                  <Sparkles className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="p-4 pt-0 flex flex-wrap gap-2">
          <button
            onClick={generateTrackSuggestions}
            disabled={isTyping}
            className="px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30 transition-colors disabled:opacity-50"
          >
            🎵 Smart Picks
          </button>
          <button
            onClick={generateSetlist}
            disabled={isTyping}
            className="px-3 py-1.5 rounded-full bg-cyan-400/20 text-cyan-400 text-xs hover:bg-cyan-400/30 transition-colors disabled:opacity-50"
          >
            📋 Full Setlist
          </button>
          <button
            onClick={analyzeAudience}
            disabled={isTyping}
            className="px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30 transition-colors disabled:opacity-50"
          >
            📊 Analyze Crowd
          </button>
          <button
            onClick={() => launchPoll("What genre next?")}
            disabled={isTyping}
            className="px-3 py-1.5 rounded-full bg-cyan-400/20 text-cyan-400 text-xs hover:bg-cyan-400/30 transition-colors disabled:opacity-50"
          >
            🎤 Launch Poll
          </button>
          <button
            onClick={greetVIP}
            disabled={isTyping}
            className="px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30 transition-colors disabled:opacity-50"
          >
            👑 Shout VIPs
          </button>
        </div>
      </div>
    </div>
  );
}