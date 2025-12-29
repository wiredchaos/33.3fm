import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Mic2, Sparkles, Radio, Volume2 } from 'lucide-react';

export default function DJRedFang({ context = 'greeting' }) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const contextMessages = {
    greeting: "What's up, I'm Red Fang. Ready to drop some heat on the airwaves?",
    recording: "Hit that record button. I'll keep the vibe right while you lay down your track.",
    live: "We're LIVE! Keep the energy high, the frequency's locked in.",
    broadcast: "Your station, your rules. I'm here to keep the signal strong.",
  };

  useEffect(() => {
    if (isVisible) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setMessage(contextMessages[context] || contextMessages.greeting);
        setIsTyping(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [context, isVisible]);

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

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed top-24 left-6 z-30 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-xs uppercase tracking-wider flex items-center gap-2 hover:shadow-lg hover:shadow-red-500/50 transition-all"
      >
        <Radio className="w-4 h-4" />
        DJ Red Fang
      </button>
    );
  }

  return (
    <div className="fixed top-24 left-6 z-30 max-w-sm pointer-events-auto">
      <div className="backdrop-blur-xl bg-black/90 border-2 border-red-500/50 rounded-2xl p-6 shadow-2xl shadow-red-500/30">
        {/* DJ Avatar */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
              <Mic2 className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center">
              <Volume2 className="w-3 h-3 text-black" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-red-400 font-bold uppercase tracking-wide">Red Fang</h3>
              <div className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs uppercase tracking-wider">
                DJ
              </div>
            </div>
            <p className="text-cyan-400 text-xs">33.3FM · On Air</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="text-white/40 hover:text-white"
          >
            <Sparkles className="w-4 h-4" />
          </Button>
        </div>

        {/* Message */}
        <div className="min-h-[60px] mb-4">
          {isTyping ? (
            <div className="flex items-center gap-2 text-white/60">
              <span className="text-sm">Red Fang is typing</span>
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

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => askRedFang("What should I play next?")}
            className="px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30 transition-colors"
          >
            Track suggestion
          </button>
          <button
            onClick={() => askRedFang("Give me broadcast tips")}
            className="px-3 py-1.5 rounded-full bg-cyan-400/20 text-cyan-400 text-xs hover:bg-cyan-400/30 transition-colors"
          >
            Broadcast tips
          </button>
        </div>
      </div>
    </div>
  );
}