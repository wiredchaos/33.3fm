import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  Radio, Mic, Music, User, Sparkles, Layers, Crown, ShoppingBag,
  TrendingUp, Sliders, Coins, Palette, LayoutDashboard, Lock,
  ArrowRight, Hand, Shield
} from 'lucide-react';
import NeuroConcierge from '@/components/navigation/NeuroConcierge';
import ElevatorNav from '@/components/navigation/ElevatorNav';
import ElevatorDoors from '@/components/navigation/ElevatorDoors';
import SocialAuth from '@/components/auth/SocialAuth';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import GlobalPlayer from '@/components/audio/GlobalPlayer';

const TIER_STYLES = {
  FREE:      'bg-cyan-400/15 text-cyan-400 border border-cyan-400/30',
  CORE:      'bg-white/10 text-white/60 border border-white/20',
  PAID:      'bg-red-500/15 text-red-400 border border-red-500/30',
  GUEST:     'bg-white/10 text-white/50 border border-white/15',
  CREATOR:   'bg-purple-400/15 text-purple-400 border border-purple-400/30',
  PRODUCER:  'bg-orange-400/15 text-orange-400 border border-orange-400/30',
  SYNDICATE: 'bg-lime-400/15 text-lime-400 border border-lime-400/30',
  LIVE:      'bg-red-500/15 text-red-400 border border-red-500/30',
  INFO:      'bg-blue-400/15 text-blue-400 border border-blue-400/30',
};

const artistEnvironments = [
  { name: 'Discover',          description: 'Content feed & recommendations',        icon: TrendingUp, path: 'Discover',         tier: 'FREE' },
  { name: 'Artist Dashboard',  description: 'Analytics & management',                icon: TrendingUp, path: 'ArtistDashboard',  tier: 'FREE' },
  { name: 'Podcast Booth',     description: 'Voice-first broadcast environment',     icon: Mic,        path: 'PodcastBooth',     tier: 'CORE' },
  { name: 'Recording Studio',  description: 'Music creation & production',           icon: Music,      path: 'RecordingStudio',  tier: 'CORE' },
  { name: 'Artist Profile',    description: 'Free discovery portal',                 icon: User,       path: 'ArtistProfile',    tier: 'FREE' },
  { name: 'Broadcast Portal',  description: 'Artist-owned station',                  icon: Radio,      path: 'BroadcastPortal',  tier: 'PAID' },
  { name: 'NFT Museum',        description: 'Your music NFT collection',             icon: Palette,    path: 'NFTMuseum',        tier: 'FREE' },
];

const studioRoutes = [
  { name: 'Studio Dashboard', description: 'Studio overview',          icon: LayoutDashboard, path: 'StudioDashboard', tier: 'GUEST' },
  { name: 'Signal Booth',     description: 'Real-time recording',      icon: Mic,             path: 'BroadcastPortal', tier: 'CREATOR' },
  { name: 'Gesture Studio',   description: 'Hand-controlled synth',    icon: Hand,            path: 'GestureStudio',   tier: 'LIVE' },
  { name: 'Mix Room',         description: 'Multitrack editor',        icon: Sliders,         path: 'RecordingStudio', tier: 'PRODUCER' },
  { name: 'NFT Mint',         description: 'On-chain minting',         icon: Coins,           path: 'NFTMuseum',       tier: 'SYNDICATE' },
  { name: 'Subscription',     description: 'Unlock all tiers',         icon: Crown,           path: 'Subscription',    tier: 'FREE' },
  { name: 'Hermes Engine',     description: 'APC · Gemini · MCP nodes',  icon: Sparkles,        path: 'HermesEngine',    tier: 'CREATOR' },
];

export default function Home() {
  const [showTour, setShowTour] = useState(false);
  const [showElevator, setShowElevator] = useState(false);
  const [showDoors, setShowDoors] = useState(true);
  const [showSocialAuth, setShowSocialAuth] = useState(false);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-black circuit-pattern">
      {/* Entrance elevator doors */}
      {showDoors && <ElevatorDoors onDoorsOpen={() => setShowDoors(false)} />}

      {/* Scan line effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-30">
        <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-scan-line" />
      </div>

      {/* ── HERO ── */}
      <section className="relative z-10 flex flex-col items-center justify-center px-4 pt-24 pb-16 min-h-screen">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Radio
              className="w-12 h-12 text-red-500"
              style={{ filter: 'drop-shadow(0 0 15px rgba(239,68,68,0.8))' }}
            />
          </div>
          <h1
            className="text-6xl md:text-8xl font-light tracking-tight text-white mb-4"
            style={{ textShadow: '0 0 20px rgba(239,68,68,0.8), 0 0 40px rgba(239,68,68,0.5)' }}
          >
            33.3FM
          </h1>
          <p className="text-xl md:text-2xl text-cyan-400 font-light tracking-wide text-glow-cyan">
            DOGECHAIN
          </p>
          <div className="mt-4 px-6 py-2 inline-block border border-red-500/30 rounded-full bg-black/40 backdrop-blur-sm">
            <span className="text-sm text-red-400 uppercase tracking-widest text-glow-red">
              WIRED CHAOS META · CRAB 3DT TRINITY
            </span>
          </div>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              to={createPageUrl('BroadcastPortal')}
              className="px-6 py-3 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] font-medium"
            >
              <Radio className="w-5 h-5" />
              Enter Studio
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setShowTour(true)}
              className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-purple-600 text-white rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-cyan-400/30"
            >
              <Sparkles className="w-5 h-5" />
              NEURO CONCIERGE Tour
            </button>
            <button
              onClick={() => setShowElevator(true)}
              className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-full flex items-center gap-2 hover:bg-white/20 transition-all"
            >
              <Layers className="w-5 h-5" />
              3D Elevator
            </button>
          </div>

          {/* Quick links */}
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

        {/* ── ARTIST ENVIRONMENTS GRID ── */}
        <div className="w-full max-w-7xl">
          <h2 className="text-sm font-mono text-cyan-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
            <Radio className="h-4 w-4" />
            Artist Environments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {artistEnvironments.map((env) => (
              <Link
                key={env.path}
                to={createPageUrl(env.path)}
                className="group relative glass-panel rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-500 hover:bg-black/60 hover:neon-glow-cyan"
              >
                <GlowingEffect spread={40} glow proximity={80} inactiveZone={0.3} borderWidth={2} />

                {/* Tier badge */}
                <div className={`absolute top-4 right-4 text-xs px-2 py-1 rounded-full z-10 ${TIER_STYLES[env.tier]}`}>
                  {env.tier}
                </div>

                {/* Icon */}
                <div className="mb-5 flex items-center justify-center relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-transparent flex items-center justify-center group-hover:from-cyan-400/30 transition-all duration-500">
                    <env.icon className="w-7 h-7 text-cyan-400" />
                  </div>
                </div>

                <h3 className="text-lg font-light text-white mb-1 tracking-wide relative z-10">{env.name}</h3>
                <p className="text-sm text-white/50 leading-relaxed relative z-10">{env.description}</p>
              </Link>
            ))}
          </div>

          {/* ── STUDIO ROUTES ── */}
          <h2 className="text-sm font-mono text-red-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
            <Mic className="h-4 w-4" />
            Studio Routes
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
            {studioRoutes.map((route) => (
              <Link
                key={route.path + route.name}
                to={createPageUrl(route.path)}
                className="group glass-panel rounded-xl p-4 text-left hover:border-red-500/40 transition-all hover:neon-glow-red"
              >
                <div className="flex items-start justify-between mb-3">
                  <route.icon className="h-5 w-5 text-red-400 group-hover:text-red-300 transition-colors" />
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${TIER_STYLES[route.tier]}`}>
                    {route.tier}
                  </span>
                </div>
                <h3 className="font-medium text-white text-xs mb-1">{route.name}</h3>
                <p className="text-[10px] text-white/40 hidden sm:block">{route.description}</p>
              </Link>
            ))}
          </div>

          {/* ── BROADCAST INFO BANNER ── */}
          <div className="glass-panel rounded-2xl p-8 text-center neon-glow-cyan">
            <div className="text-cyan-400 text-sm uppercase tracking-widest mb-3 font-mono">
              Broadcast Infrastructure
            </div>
            <h2 className="text-3xl text-white font-light mb-3">Signal Organism Platform</h2>
            <p className="text-white/50 max-w-2xl mx-auto text-sm leading-relaxed">
              A learnable production system with temporal authority, signal conditioning, and transmission contexts.
              Record, mix, master, and mint your music on the 33.3FM DOGECHAIN broadcast network.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <span className="px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-400 text-xs font-mono border border-cyan-400/20">
                Music Creation
              </span>
              <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-mono border border-red-500/20">
                Permanent Storage
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-400/10 text-purple-400 text-xs font-mono border border-purple-400/20">
                CRAB Core
              </span>
              <span className="px-3 py-1 rounded-full bg-lime-400/10 text-lime-400 text-xs font-mono border border-lime-400/20">
                NFT Minting
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-white/20 text-xs uppercase tracking-widest font-mono">
          VSS-33.3 · TIMELINE: 33.3_FM_DOGECHAIN · GOVERNED BY: AKIRA CODEX
        </div>
      </section>

      {/* ── OVERLAYS ── */}
      <NeuroConcierge isActive={showTour} onClose={() => setShowTour(false)} />
      <ElevatorNav isOpen={showElevator} onClose={() => setShowElevator(false)} />

      {showSocialAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSocialAuth(false)}
              className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              ×
            </button>
            <SocialAuth onSuccess={() => setShowSocialAuth(false)} />
          </div>
        </div>
      )}

      {/* Global Player */}
      <GlobalPlayer />
    </div>
  );
}
