import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, TrendingUp, Radio, Music, Users, Bell, BellOff, ArrowLeft, Filter, Sparkles } from 'lucide-react';
import FollowButton from '@/components/social/FollowButton';
import MusicDiscovery from '@/components/ai/MusicDiscovery';

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    } catch (error) {
      console.log('User not logged in');
    }
  };

  const trendingArtists = [
    { id: 1, name: 'DJ Red Fang', genre: 'Electronic', listeners: '12.3K', isLive: true, email: 'redfang@33.3fm.example' },
    { id: 2, name: 'Neon Pulse', genre: 'Synthwave', listeners: '8.7K', isLive: false, email: 'neonpulse@33.3fm.example' },
    { id: 3, name: 'Echo Chamber', genre: 'Ambient', listeners: '6.2K', isLive: true, email: 'echo@33.3fm.example' },
    { id: 4, name: 'Bass Theory', genre: 'Drum & Bass', listeners: '5.1K', isLive: false, email: 'bass@33.3fm.example' }
  ];

  const newReleases = [
    { id: 1, artist: 'DJ Red Fang', track: 'Midnight Signal', time: '2h ago' },
    { id: 2, artist: 'Neon Pulse', track: 'Crystal Waves', time: '5h ago' },
    { id: 3, artist: 'Echo Chamber', track: 'Deep Space', time: '1d ago' },
    { id: 4, artist: 'Bass Theory', track: 'Frequency Drop', time: '2d ago' }
  ];

  const liveStreams = [
    { id: 1, artist: 'DJ Red Fang', title: 'Late Night Session', viewers: 234, genre: 'Electronic' },
    { id: 2, artist: 'Echo Chamber', title: 'Ambient Journey', viewers: 187, genre: 'Ambient' }
  ];

  const communityHighlights = [
    { id: 1, user: 'Producer_Mike', content: 'Just dropped a new remix using the 3D studio!', likes: 45 },
    { id: 2, user: 'Artist_Sarah', content: 'My first live broadcast on 33.3FM was incredible', likes: 38 },
    { id: 3, user: 'DJ_Alex', content: 'The 3D Orchestra is a game changer for production', likes: 52 }
  ];

  const filteredContent = () => {
    if (filter === 'live') return liveStreams;
    if (filter === 'releases') return newReleases;
    if (filter === 'artists') return trendingArtists;
    return null;
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Black Liquid Motherboard Background with 3D Dynamic Vectors */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-cyan-950/5 to-black" />
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M 0 100 L 50 100 L 50 50 L 100 50" stroke="cyan" strokeWidth="0.5" fill="none" opacity="0.3" />
              <path d="M 100 50 L 150 50 L 150 100 L 200 100" stroke="cyan" strokeWidth="0.5" fill="none" opacity="0.3" />
              <circle cx="50" cy="100" r="2" fill="cyan" opacity="0.6" />
              <circle cx="100" cy="50" r="2" fill="cyan" opacity="0.6" />
              <circle cx="150" cy="100" r="2" fill="cyan" opacity="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      </div>

      <div className="relative z-10">
      {/* Header */}
      <div className="backdrop-blur-xl bg-black/60 border-b border-white/10 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link 
              to={createPageUrl('Home')}
              className="flex items-center gap-2 text-white/60 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm uppercase tracking-wider">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">33.3</span>
              </div>
              <div>
                <div className="text-white font-bold text-sm">Discover</div>
                <div className="text-white/40 text-[10px] uppercase tracking-wider">33.3FM</div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Search artists, tracks, or broadcasts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-white/5 border-white/10 text-white h-12 rounded-xl"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {['all', 'live', 'artists', 'releases', 'community'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider whitespace-nowrap transition-all ${
                  filter === f
                    ? 'bg-cyan-400 text-black'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* AI Music Discovery */}
        {filter === 'all' && (
          <section className="mb-12">
            <MusicDiscovery />
          </section>
        )}

        {/* Live Streams */}
        {(filter === 'all' || filter === 'live') && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Radio className="w-5 h-5 text-red-500" />
              <h2 className="text-2xl font-light tracking-wide">Live Now</h2>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveStreams.map((stream) => (
                <div
                  key={stream.id}
                  className="backdrop-blur-md bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/30 rounded-2xl p-6 hover:border-red-500/50 transition-all group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-light text-white mb-1">{stream.artist}</h3>
                      <p className="text-sm text-white/60">{stream.title}</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs uppercase tracking-wider border border-red-500/30">
                      LIVE
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{stream.viewers}</span>
                      </div>
                      <span className="text-xs">{stream.genre}</span>
                    </div>
                    <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white gap-2">
                      <Radio className="w-3 h-3" />
                      Join Stream
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trending Artists */}
        {(filter === 'all' || filter === 'artists') && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h2 className="text-2xl font-light tracking-wide">Trending Artists</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {trendingArtists.map((artist) => (
                <div
                  key={artist.id}
                  className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-cyan-400/50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-400/20 to-transparent border border-cyan-400/30 flex items-center justify-center">
                      <Music className="w-6 h-6 text-cyan-400" />
                    </div>
                    {artist.isLive && (
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    )}
                  </div>
                  <h3 className="text-lg font-light text-white mb-1">{artist.name}</h3>
                  <p className="text-xs text-white/60 mb-3">{artist.genre}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">{artist.listeners} listeners</span>
                  </div>
                  <div className="mt-3">
                    <FollowButton 
                      artistEmail={artist.email}
                      artistName={artist.name}
                      size="small"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* New Releases */}
        {(filter === 'all' || filter === 'releases') && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Music className="w-5 h-5 text-purple-400" />
              <h2 className="text-2xl font-light tracking-wide">New Releases</h2>
            </div>
            <div className="space-y-3">
              {newReleases.map((release) => (
                <div
                  key={release.id}
                  className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-purple-400/50 transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                     <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400/20 to-transparent border border-purple-400/30 flex items-center justify-center relative">
                       <Music className="w-5 h-5 text-purple-400" />
                       <button className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                         <div className="w-6 h-6 rounded-full bg-purple-400 flex items-center justify-center">
                           <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                             <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                           </svg>
                         </div>
                       </button>
                     </div>
                     <div>
                       <h3 className="text-white font-light">{release.track}</h3>
                       <p className="text-sm text-white/60">{release.artist}</p>
                     </div>
                    </div>
                    <div className="text-xs text-white/40">{release.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Community Highlights */}
        {(filter === 'all' || filter === 'community') && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-5 h-5 text-cyan-400" />
              <h2 className="text-2xl font-light tracking-wide">Community Highlights</h2>
            </div>
            <div className="space-y-3">
              {communityHighlights.map((highlight) => (
                <div
                  key={highlight.id}
                  className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-cyan-400/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400/20 to-transparent border border-cyan-400/30" />
                      <div>
                        <div className="text-white font-light">{highlight.user}</div>
                        <div className="text-xs text-white/40">Community Member</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-white/80 mb-3">{highlight.content}</p>
                  <div className="flex items-center gap-4 text-xs text-white/40">
                    <div className="flex items-center gap-1">
                      <span>❤️</span>
                      <span>{highlight.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      </div>
    </div>
  );
}