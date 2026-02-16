import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Radio, Mic, Music, User, Radio as Station, Sparkles, Layers, Crown, ShoppingBag, TrendingUp } from 'lucide-react';
import NeuroConcierge from '@/components/navigation/NeuroConcierge';
import ElevatorNav from '@/components/navigation/ElevatorNav';
import ElevatorDoors from '@/components/navigation/ElevatorDoors';
import SocialAuth from '@/components/auth/SocialAuth';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { GlowingEffect } from '@/components/ui/glowing-effect';

export default function Home() {
  const [showTour, setShowTour] = useState(false);
  const [showElevator, setShowElevator] = useState(false);
  const [showDoors, setShowDoors] = useState(true);
  const [showSocialAuth, setShowSocialAuth] = useState(false);

  const environments = [
    {
      name: 'Discover',
      description: 'Content feed & recommendations',
      icon: TrendingUp,
      path: 'Discover',
      tier: 'FREE'
    },
    {
      name: 'Artist Dashboard',
      description: 'Analytics & management',
      icon: TrendingUp,
      path: 'ArtistDashboard',
      tier: 'FREE'
    },
    {
      name: 'Podcast Booth',
      description: 'Voice-first broadcast environment',
      icon: Mic,
      path: 'PodcastBooth',
      tier: 'CORE'
    },
    {
      name: 'Recording Studio',
      description: 'Music creation & production',
      icon: Music,
      path: 'RecordingStudio',
      tier: 'CORE'
    },
    {
      name: 'Artist Profile',
      description: 'Free discovery portal',
      icon: User,
      path: 'ArtistProfile',
      tier: 'FREE'
    },
    {
      name: 'Broadcast Portal',
      description: 'Artist-owned station',
      icon: Station,
      path: 'BroadcastPortal',
      tier: 'PAID'
    },
    {
      name: 'NFT Museum',
      description: 'Your music NFT collection',
      icon: Music,
      path: 'NFTMuseum',
      tier: 'FREE'
    }
  ];

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-black">
      {showDoors && <ElevatorDoors onDoorsOpen={() => setShowDoors(false)} />}
      
      <ContainerScroll
        titleComponent={
          <div className="text-center mb-8">
            <div className="mb-4 flex items-center justify-center gap-3">
              <Radio className="w-12 h-12 text-cyan-400" />
            </div>
            <h1 className="text-6xl md:text-8xl font-light tracking-tight text-white mb-4">
              33.3FM
            </h1>
            <p className="text-xl md:text-2xl text-cyan-400 font-light tracking-wide">
              DOGECHAIN
            </p>
            <div className="mt-4 text-sm text-white/40 uppercase tracking-widest">
              WIRED CHAOS META · CRAB 3DT TRINITY
            </div>
          </div>
        }
      >
        <div className="w-full h-full bg-gradient-to-br from-black via-gray-900 to-black p-8 flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="text-cyan-400 text-sm uppercase tracking-widest">Broadcast Infrastructure</div>
            <h2 className="text-4xl text-white font-light">Signal Organism Platform</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              A learnable production system with temporal authority, signal conditioning, and transmission contexts
            </p>
          </div>
        </div>
      </ContainerScroll>
      
      <div className="relative z-10 flex flex-col items-center justify-center px-4 -mt-96">
        {/* Logo & Title */}
        <div className="text-center mb-16 px-8">
        <div className="mb-4 flex items-center justify-center gap-3">
          <Radio className="w-12 h-12 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
        </div>
        <h1 className="text-6xl md:text-8xl font-light tracking-tight text-white mb-4 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]" style={{
          textShadow: '0 0 20px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.6), 0 0 60px rgba(239, 68, 68, 0.4)'
        }}>
          33.3FM
        </h1>
        <p className="text-xl md:text-2xl text-cyan-400 font-light tracking-wide drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
          DOGECHAIN
        </p>
        <div className="mt-4 px-6 py-2 inline-block border border-red-500/30 rounded-full bg-black/40 backdrop-blur-sm">
          <span className="text-sm text-red-400 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]">
            WIRED CHAOS META · CRAB 3DT TRINITY
          </span>
        </div>
          
          {/* Tour & Navigation Buttons */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => setShowTour(true)}
              className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-purple-600 text-white rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-cyan-400/30"
            >
              <Sparkles className="w-5 h-5" />
              Start NEURO CONCIERGE Tour
            </button>
            <button
              onClick={() => setShowElevator(true)}
              className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-full flex items-center gap-2 hover:bg-white/20 transition-all"
            >
              <Layers className="w-5 h-5" />
              3D Elevator
            </button>
          </div>

          {/* Monetization Quick Links */}
          <div className="mt-4 flex gap-3 flex-wrap justify-center">
            <Link
              to={createPageUrl('FreeTier')}
              className="px-4 py-2 bg-white/5 border border-cyan-400/30 text-cyan-400 rounded-full text-sm flex items-center gap-2 hover:bg-cyan-400/10 transition-all"
            >
              <TrendingUp className="w-4 h-4" />
              Free Tier
            </Link>
            <Link
              to={createPageUrl('Subscription')}
              className="px-4 py-2 bg-white/5 border border-red-500/30 text-red-400 rounded-full text-sm flex items-center gap-2 hover:bg-red-500/10 transition-all"
            >
              <Crown className="w-4 h-4" />
              Subscribe
            </Link>
            <Link
              to={createPageUrl('Store')}
              className="px-4 py-2 bg-white/5 border border-purple-400/30 text-purple-400 rounded-full text-sm flex items-center gap-2 hover:bg-purple-400/10 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              Store
            </Link>
            <button
              onClick={() => setShowSocialAuth(true)}
              className="px-4 py-2 bg-white/5 border border-white/20 text-white rounded-full text-sm flex items-center gap-2 hover:bg-white/10 transition-all"
            >
              <User className="w-4 h-4" />
              Connect
            </button>
          </div>
        </div>

        {/* Environment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl w-full">
          {environments.map((env) => (
            <Link
              key={env.path}
              to={createPageUrl(env.path)}
              className="group relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-cyan-400/50 transition-all duration-500 hover:bg-black/60"
            >
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={80}
                inactiveZone={0.3}
                borderWidth={2}
              />
              
              {/* Tier Badge */}
              <div className={`absolute top-4 right-4 text-xs px-2 py-1 rounded-full z-10 ${
                env.tier === 'FREE' ? 'bg-cyan-400/20 text-cyan-400' :
                env.tier === 'PAID' ? 'bg-red-500/20 text-red-400' :
                'bg-white/10 text-white/60'
              }`}>
                {env.tier}
              </div>

              {/* Icon */}
              <div className="mb-6 flex items-center justify-center relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-transparent flex items-center justify-center group-hover:from-cyan-400/30 transition-all duration-500">
                  <env.icon className="w-8 h-8 text-cyan-400" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-light text-white mb-2 tracking-wide relative z-10">
                {env.name}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed relative z-10">
                {env.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-white/30 text-xs uppercase tracking-widest">
          Liquid Glass iOS · Broadcast Infrastructure
        </div>
      </div>

      {/* NEURO CONCIERGE Tour */}
      <NeuroConcierge isActive={showTour} onClose={() => setShowTour(false)} />

      {/* 3D Elevator Navigation */}
      <ElevatorNav isOpen={showElevator} onClose={() => setShowElevator(false)} />

      {/* Social Auth Modal */}
      {showSocialAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative">
            <button
              onClick={() => setShowSocialAuth(false)}
              className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              ×
            </button>
            <SocialAuth onSuccess={() => setShowSocialAuth(false)} />
          </div>
        </div>
      )}
    </div>
  );
}