import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Music, TrendingUp, User } from 'lucide-react';

export default function MusicDiscovery() {
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const discoverMusic = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a music curator for 33.3FM DOGECHAIN, a premium broadcast platform. Based on the user's taste: "${query}", recommend 5 artists or tracks that would fit the 33.3FM aesthetic (electronic, ambient, experimental, underground). Return ONLY real artists/tracks. Format as JSON.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  artist: { type: "string" },
                  track: { type: "string" },
                  genre: { type: "string" },
                  reason: { type: "string" }
                }
              }
            }
          }
        }
      });

      setRecommendations(response.recommendations || []);
    } catch (error) {
      console.error('Discovery failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-black/60 border border-cyan-400/30 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-cyan-400" />
        <h2 className="text-2xl font-light text-white">AI Music Discovery</h2>
      </div>

      <div className="flex gap-3 mb-6">
        <Input
          placeholder="Describe your music taste..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && discoverMusic()}
          className="bg-white/5 border-white/10 text-white h-12"
        />
        <Button
          onClick={discoverMusic}
          disabled={isLoading}
          className="bg-gradient-to-r from-cyan-400 to-purple-600 hover:opacity-90 whitespace-nowrap"
        >
          {isLoading ? 'Discovering...' : 'Discover'}
        </Button>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, i) => (
          <div
            key={i}
            className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 hover:border-cyan-400/50 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400/20 to-purple-600/20 flex items-center justify-center">
                <Music className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium mb-1">{rec.track}</h3>
                <p className="text-sm text-white/60 mb-2">{rec.artist} · {rec.genre}</p>
                <p className="text-xs text-white/40">{rec.reason}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {recommendations.length === 0 && !isLoading && (
        <div className="text-center py-8 text-white/40 text-sm">
          Tell us what you like and we'll find the perfect tracks for you
        </div>
      )}
    </div>
  );
}