import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, FileText, Music, Zap, Loader2 } from 'lucide-react';

export default function ArtistSupport({ artistEmail }) {
  const [activeTab, setActiveTab] = useState('bio');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const tools = {
    bio: {
      label: 'Bio Generator',
      icon: FileText,
      prompt: (text) => `Write a professional artist bio for a musician with this info: ${text}. Make it broadcast-grade, 2-3 sentences, suitable for 33.3FM DOGECHAIN.`,
    },
    lyrics: {
      label: 'Lyric Assistant',
      icon: Music,
      prompt: (text) => `Help develop song lyrics based on this theme or concept: ${text}. Provide creative, poetic suggestions that fit electronic/experimental music.`,
    },
    promo: {
      label: 'Promo Copy',
      icon: Zap,
      prompt: (text) => `Write promotional copy for this music release/event: ${text}. Make it engaging, concise, platform-ready for social media and 33.3FM.`,
    },
    setlist: {
      label: 'Setlist Curator',
      icon: Music,
      prompt: (text) => `Suggest a cohesive setlist/playlist for this theme: ${text}. Return 5-8 tracks with artist names. Format as JSON.`,
      useJson: true,
    }
  };

  const generateContent = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    try {
      const tool = tools[activeTab];
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: tool.prompt(input),
        response_json_schema: tool.useJson ? {
          type: "object",
          properties: {
            setlist: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  position: { type: "number" },
                  track: { type: "string" },
                  artist: { type: "string" }
                }
              }
            }
          }
        } : undefined
      });

      setOutput(tool.useJson ? JSON.stringify(response, null, 2) : response);
    } catch (error) {
      setOutput('Error generating content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-black/60 border border-cyan-400/30 rounded-2xl p-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
        <h2 className="text-2xl font-light text-white">AI Artist Support</h2>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {Object.entries(tools).map(([key, { label, icon: Icon }]) => (
          <button
            key={key}
            onClick={() => { setActiveTab(key); setOutput(''); }}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === key
                ? 'bg-gradient-to-r from-cyan-400 to-purple-600 text-white shadow-lg'
                : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Icon className="w-3 h-3" />
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <Textarea
          placeholder={`Enter your ${tools[activeTab].label.toLowerCase()} request...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-white/5 border-white/10 text-white min-h-[100px] resize-none"
        />
        
        <Button
          onClick={generateContent}
          disabled={isLoading || !input.trim()}
          className="w-full bg-gradient-to-r from-cyan-400 to-purple-600 hover:opacity-90 transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate with AI
            </>
          )}
        </Button>

        {output && (
          <div className="p-4 rounded-xl bg-white/5 border border-cyan-400/30 animate-in slide-in-from-bottom duration-300">
            <div className="text-xs text-cyan-400 uppercase tracking-wider mb-2">Generated Output</div>
            <div className="text-sm text-white/90 whitespace-pre-wrap">{output}</div>
          </div>
        )}
      </div>
    </div>
  );
}