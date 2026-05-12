import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Music, Radio, TrendingUp, Users, Zap, Check, X, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FreeTier() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Auth handled by standalone AuthContext
  }, []);

  const freeFeatures = [
    { name: 'Discover Music Feed', available: true, icon: TrendingUp },
    { name: 'Artist Profile Pages', available: true, icon: Users },
    { name: 'Fan Wall Interactions', available: true, icon: Music },
    { name: 'Basic Analytics', available: true, icon: TrendingUp },
    { name: 'Community Events', available: true, icon: Users },
  ];

  const paidFeatures = [
    { name: 'Broadcast Portal', available: false, icon: Radio },
    { name: 'Recording Studio', available: false, icon: Music },
    { name: 'Podcast Booth', available: false, icon: Radio },
    { name: 'Remove 33.3FM Watermarks', available: false, icon: Crown },
    { name: 'AI Music Generation', available: false, icon: Zap },
    { name: 'Advanced Blockchain Features', available: false, icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-black p-8 relative overflow-hidden">
      {/* Black Liquid Motherboard Background with 3D Dynamic Vectors */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-cyan-950/5 to-black" />
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit-free" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M 0 100 L 50 100 L 50 50 L 100 50" stroke="cyan" strokeWidth="0.5" fill="none" opacity="0.3" />
              <path d="M 100 50 L 150 50 L 150 100 L 200 100" stroke="cyan" strokeWidth="0.5" fill="none" opacity="0.3" />
              <circle cx="50" cy="100" r="2" fill="cyan" opacity="0.6" />
              <circle cx="100" cy="50" r="2" fill="cyan" opacity="0.6" />
              <circle cx="150" cy="100" r="2" fill="cyan" opacity="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-free)" />
        </svg>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      </div>

      <div className="relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in duration-500">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Radio className="w-12 h-12 text-cyan-400" />
            <h1 className="text-5xl font-light text-white">33.3FM</h1>
          </div>
          <p className="text-xl text-cyan-400 mb-2">DOGECHAIN · Free Tier</p>
          <p className="text-white/60 max-w-2xl mx-auto">
            Welcome to the free experience. Discover music, connect with artists, and explore the community.
          </p>
        </div>

        {/* Free Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="backdrop-blur-xl bg-white/5 border border-cyan-400/30 rounded-2xl p-8 animate-in slide-in-from-left duration-500">
            <div className="flex items-center gap-3 mb-6">
              <Check className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-light text-white">Free Access</h2>
            </div>
            <div className="space-y-4">
              {freeFeatures.map((feature) => (
                <div key={feature.name} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                  <feature.icon className="w-5 h-5 text-cyan-400" />
                  <span className="text-white">{feature.name}</span>
                  <Check className="w-4 h-4 text-green-400 ml-auto" />
                </div>
              ))}
            </div>
            <Link to={createPageUrl('Discover')}>
              <Button className="w-full mt-6 bg-gradient-to-r from-cyan-400 to-purple-600 hover:opacity-90">
                <TrendingUp className="w-4 h-4 mr-2" />
                Explore Free Features
              </Button>
            </Link>
          </div>

          {/* Premium Features */}
          <div className="backdrop-blur-xl bg-white/5 border border-purple-500/30 rounded-2xl p-8 animate-in slide-in-from-right duration-500">
            <div className="flex items-center gap-3 mb-6">
              <Crown className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-light text-white">Premium Only</h2>
            </div>
            <div className="space-y-4">
              {paidFeatures.map((feature) => (
                <div key={feature.name} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 opacity-60">
                  <feature.icon className="w-5 h-5 text-purple-400" />
                  <span className="text-white/60">{feature.name}</span>
                  <X className="w-4 h-4 text-red-400 ml-auto" />
                </div>
              ))}
            </div>
            <Link to={createPageUrl('Subscription')}>
              <Button className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to={createPageUrl('Discover')}>
            <div className="backdrop-blur-xl bg-white/5 border border-cyan-400/30 rounded-2xl p-6 hover:border-cyan-400/50 transition-all group">
              <TrendingUp className="w-8 h-8 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-light text-white mb-2">Discover</h3>
              <p className="text-sm text-white/60">Browse music feed and recommendations</p>
            </div>
          </Link>

          <Link to={createPageUrl('ArtistProfile')}>
            <div className="backdrop-blur-xl bg-white/5 border border-cyan-400/30 rounded-2xl p-6 hover:border-cyan-400/50 transition-all group">
              <Users className="w-8 h-8 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-light text-white mb-2">Artist Profiles</h3>
              <p className="text-sm text-white/60">Connect with your favorite artists</p>
            </div>
          </Link>

          <Link to={createPageUrl('Home')}>
            <div className="backdrop-blur-xl bg-white/5 border border-cyan-400/30 rounded-2xl p-6 hover:border-cyan-400/50 transition-all group">
              <Radio className="w-8 h-8 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-light text-white mb-2">Explore All</h3>
              <p className="text-sm text-white/60">See all available environments</p>
            </div>
          </Link>
        </div>

        {/* User Status */}
        {user && (
          <div className="mt-8 p-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-white/60 mb-1">Logged in as</div>
                <div className="text-white font-medium">{user.email}</div>
              </div>
              <div className="px-4 py-2 rounded-full bg-cyan-400/20 text-cyan-400 text-sm">
                Free Tier
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}