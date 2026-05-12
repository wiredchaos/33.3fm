import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  Radio, Mic, Music, Sliders, Coins, LayoutDashboard,
  Lock, Unlock, ArrowLeft, ArrowRight, Hand, Palette,
  TrendingUp, ChevronRight
} from 'lucide-react';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import ElevatorNav from '@/components/navigation/ElevatorNav';
import GlobalPlayer from '@/components/audio/GlobalPlayer';

/* ── Patch Manifest (mirrors wcmhub patch-registry) ── */
const PATCH_MANIFEST = {
  id: 'vss-33.3',
  name: 'Virtual Signal Studio',
  version: '33.3.0',
  floor: 'THE_NEON_VAULT',
  trinityMount: {
    timeline: '33.3_FM_DOGECHAIN',
    type: 'CONSUMER',
  },
};

const DEMO_MODE = true;

const TIERS = {
  GUEST:     { level: 0, color: 'text-white/50',   bg: 'bg-white/10',       border: 'border-white/15' },
  CREATOR:   { level: 1, color: 'text-purple-400', bg: 'bg-purple-400/15',  border: 'border-purple-400/30' },
  PRODUCER:  { level: 2, color: 'text-orange-400', bg: 'bg-orange-400/15',  border: 'border-orange-400/30' },
  SYNDICATE: { level: 3, color: 'text-lime-400',   bg: 'bg-lime-400/15',    border: 'border-lime-400/30' },
  LIVE:      { level: 1, color: 'text-red-400',    bg: 'bg-red-500/15',     border: 'border-red-500/30' },
};

const studioRooms = [
  {
    id: 'signal-booth',
    title: 'Signal Booth',
    description: 'Real-time recording with AI cleanup presets. Capture vocals, instruments, and live sessions.',
    icon: Mic,
    tier: 'CREATOR',
    path: 'BroadcastPortal',
    color: 'from-red-500/20 to-transparent',
    iconColor: 'text-red-400',
    stats: { label: 'AI Presets', value: '4' },
  },
  {
    id: 'producer-room',
    title: 'Producer Room',
    description: 'AI beat generation & sample packs. Create original beats and export stems.',
    icon: Music,
    tier: 'CREATOR',
    path: 'RecordingStudio',
    color: 'from-cyan-400/20 to-transparent',
    iconColor: 'text-cyan-400',
    stats: { label: 'Instruments', value: '5' },
  },
  {
    id: 'mix-room',
    title: 'Mix Room',
    description: 'DAW-lite multitrack editor. Arrange, mix, and master your productions.',
    icon: Sliders,
    tier: 'PRODUCER',
    path: 'RecordingStudio',
    color: 'from-orange-400/20 to-transparent',
    iconColor: 'text-orange-400',
    stats: { label: 'Tracks', value: '16' },
  },
  {
    id: 'gesture-studio',
    title: 'Gesture Studio',
    description: 'Hand-controlled synthesizer. Play instruments with motion capture.',
    icon: Hand,
    tier: 'LIVE',
    path: 'GestureStudio',
    color: 'from-purple-400/20 to-transparent',
    iconColor: 'text-purple-400',
    stats: { label: 'Gestures', value: '∞' },
  },
  {
    id: 'broadcast-portal',
    title: 'Broadcast Portal',
    description: 'Artist-owned station with liquid glass architecture. Go live on DOGECHAIN.',
    icon: Radio,
    tier: 'CREATOR',
    path: 'BroadcastPortal',
    color: 'from-red-500/20 to-transparent',
    iconColor: 'text-red-400',
    stats: { label: 'Stations', value: '5' },
  },
  {
    id: 'control-room',
    title: 'Control Room',
    description: 'Project management, analytics, and royalty splits for your productions.',
    icon: LayoutDashboard,
    tier: 'PRODUCER',
    path: 'ArtistDashboard',
    color: 'from-lime-400/20 to-transparent',
    iconColor: 'text-lime-400',
    stats: { label: 'Projects', value: '∞' },
  },
  {
    id: 'nft-mint',
    title: 'NFT Mint',
    description: 'On-chain NFT minting on DOGECHAIN. Inscribe your music permanently.',
    icon: Coins,
    tier: 'SYNDICATE',
    path: 'NFTMuseum',
    color: 'from-yellow-400/20 to-transparent',
    iconColor: 'text-yellow-400',
    stats: { label: 'Network', value: 'DOGE' },
  },
  {
    id: 'neon-vault',
    title: 'Neon Vault Museum',
    description: 'Digital art gallery with NFT exhibitions and audio tours.',
    icon: Palette,
    tier: 'GUEST',
    path: 'NFTMuseum',
    color: 'from-pink-400/20 to-transparent',
    iconColor: 'text-pink-400',
    stats: { label: 'Galleries', value: '∞' },
  },
];

const quickStats = [
  { label: 'Studio Rooms', value: '8', icon: LayoutDashboard, color: 'text-cyan-400' },
  { label: 'AI Presets',   value: '4', icon: Music,           color: 'text-purple-400' },
  { label: 'Live Stations', value: '5', icon: Radio,          color: 'text-red-400' },
  { label: 'NFT Network',  value: 'DOGE', icon: Coins,        color: 'text-lime-400' },
];

export default function StudioDashboard() {
  const [showElevator, setShowElevator] = useState(false);

  return (
    <div className="min-h-screen bg-black circuit-pattern text-white">
      {/* Scan line */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-30">
        <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent animate-scan-line" />
      </div>

      {/* ── TOP NAV ── */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            to={createPageUrl('Home')}
            className="flex items-center gap-2 text-white/60 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">Home</span>
          </Link>

          <div className="flex items-center gap-2 ml-2">
            <Radio className="h-4 w-4 text-red-400" />
            <span className="font-mono text-sm text-white/60">
              VSS-33.3 <span className="text-cyan-400">STUDIO</span>
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs font-mono text-white/30 hidden md:inline">
              TIMELINE: {PATCH_MANIFEST.trinityMount.timeline}
            </span>
            <button
              type="button"
              onClick={() => setShowElevator(true)}
              className="px-3 py-1.5 rounded-full text-xs bg-white/10 text-white/60 hover:bg-white/20 transition-all"
            >
              Elevator
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-20 pb-32">
        {/* ── HERO HEADER ── */}
        <div className="glass-panel rounded-2xl p-6 md:p-8 mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-30" />
              <div className="relative h-3 w-3 rounded-full bg-red-500" />
            </div>
            <span className="text-xs font-mono text-red-400 tracking-wider uppercase">Live System</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            <span
              className="font-mono"
              style={{ textShadow: '0 0 20px rgba(239,68,68,0.8), 0 0 40px rgba(239,68,68,0.4)' }}
            >
              <span className="text-red-400">33.3FM</span>
            </span>
            <span className="block text-white/90 text-xl md:text-3xl mt-2 font-light">
              Virtual Signal Studio
            </span>
          </h1>

          <p className="text-sm text-white/50 mb-6 max-w-xl mx-auto">
            The resurrected recording studio. Record, mix, master, and mint your music on the 33.3FM DOGECHAIN broadcast network.
          </p>

          <p className="text-xs font-mono text-white/30 mb-6">
            FLOOR: {PATCH_MANIFEST.floor} · GOVERNED BY: {PATCH_MANIFEST.trinityMount.type}
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to={createPageUrl('BroadcastPortal')}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-400 text-white rounded-full text-sm font-medium transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)]"
            >
              Enter Studio
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to={createPageUrl('NFTMuseum')}
              className="flex items-center gap-2 px-5 py-2.5 border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 rounded-full text-sm transition-all"
            >
              <Palette className="h-4 w-4" />
              Neon Vault Museum
            </Link>
          </div>
        </div>

        {/* ── QUICK STATS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {quickStats.map((stat) => (
            <div key={stat.label} className="glass-panel rounded-xl p-4 text-center">
              <stat.icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
              <div className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-white/40 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── STUDIO ROOMS GRID ── */}
        <h2 className="text-sm font-mono text-red-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Radio className="h-4 w-4" />
          Studio Rooms
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {studioRooms.map((room) => {
            const tier = TIERS[room.tier] || TIERS.GUEST;
            const isUnlocked = DEMO_MODE || tier.level === 0;
            return (
              <Link
                key={room.id}
                to={createPageUrl(room.path)}
                className="group relative glass-panel rounded-2xl p-5 hover:border-white/20 transition-all duration-300 hover:neon-glow-cyan"
              >
                <GlowingEffect spread={35} glow proximity={70} inactiveZone={0.3} borderWidth={2} />

                {/* Tier badge */}
                <div className={`absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full z-10 ${tier.bg} ${tier.color} border ${tier.border}`}>
                  {isUnlocked ? (
                    <span className="flex items-center gap-1">
                      <Unlock className="h-2.5 w-2.5" />
                      {room.tier}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Lock className="h-2.5 w-2.5" />
                      {room.tier}
                    </span>
                  )}
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${room.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <room.icon className={`h-6 w-6 ${room.iconColor}`} />
                </div>

                <h3 className="font-semibold text-white mb-1 text-sm">{room.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed mb-3">{room.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-white/30">
                    {room.stats.label}: <span className={room.iconColor}>{room.stats.value}</span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white/60 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── ARTIST ROUTES ── */}
        <h2 className="text-sm font-mono text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Artist Pages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { path: 'Discover',        title: 'Discover',        desc: 'Content feed & recommendations',  tier: 'FREE',    color: 'text-cyan-400' },
            { path: 'ArtistDashboard', title: 'Artist Dashboard', desc: 'Analytics & management',         tier: 'FREE',    color: 'text-cyan-400' },
            { path: 'ArtistProfile',   title: 'Artist Profile',  desc: 'Free discovery portal',           tier: 'FREE',    color: 'text-cyan-400' },
          ].map((route) => (
            <Link
              key={route.path}
              to={createPageUrl(route.path)}
              className="glass-panel rounded-xl p-4 hover:border-cyan-400/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-mono ${route.color}`}>{route.tier}</span>
                <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-cyan-400 transition-colors" />
              </div>
              <h3 className="font-medium text-white text-sm mb-1">{route.title}</h3>
              <p className="text-xs text-white/40">{route.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ── OVERLAYS ── */}
      <ElevatorNav isOpen={showElevator} onClose={() => setShowElevator(false)} />
      <GlobalPlayer />
    </div>
  );
}
