import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Room3DWrapper } from '@/components/studio/Room3DWrapper';
import {
  Radio, Music, Mic, Sliders, Cpu, Disc, List, Shield, Image,
  Headphones, FileCheck, Lock, Zap, Crown, Star, ArrowRight,
  Home, ChevronRight
} from 'lucide-react';

const STUDIO_ROUTES = [
  { id: 'dashboard', label: 'Dashboard', icon: Cpu, path: 'StudioDashboard', tier: 'FREE', color: '#00ffff' },
  { id: 'gate', label: 'Access Gate', icon: Shield, path: 'AccessGate', tier: 'FREE', color: '#ff0033' },
  { id: 'gesture', label: 'Gesture Instrument', icon: Zap, path: 'GestureStudio', tier: 'CREATOR', color: '#ffff00' },
  { id: 'signal-booth', label: 'Signal Booth', icon: Mic, path: 'SignalBooth', tier: 'CREATOR', color: '#ff0033' },
  { id: 'producer-room', label: 'Producer Room', icon: Music, path: 'ProducerRoom', tier: 'PRODUCER', color: '#00ffff' },
  { id: 'mix-room', label: 'Mix Room', icon: Sliders, path: 'MixRoom', tier: 'PRODUCER', color: '#00ff88' },
  { id: 'control-room', label: 'Control Room', icon: Cpu, path: 'ControlRoom', tier: 'SYNDICATE', color: '#ff00ff' },
  { id: 'mint', label: 'Mint', icon: Disc, path: 'MintStudio', tier: 'PRODUCER', color: '#ffff00' },
  { id: 'playlists', label: 'Playlists', icon: List, path: 'Playlists', tier: 'CREATOR', color: '#ff8800' },
];

const MUSEUM_ROUTES = [
  { id: 'neon-vault', label: 'Neon Vault', icon: Star, path: 'NeonVault', color: '#ff0033' },
  { id: 'galleries', label: 'Galleries', icon: Image, path: 'Galleries', color: '#00ffff' },
  { id: 'ip-audits', label: 'IP Audits', icon: FileCheck, path: 'IPAudits', color: '#00ff88' },
  { id: 'audio-tours', label: 'Audio Tours', icon: Headphones, path: 'AudioTours', color: '#ff8800' },
];

const ARTIST_ROUTES = [
  { id: 'free', label: 'Free Artist Page', icon: Music, path: 'FreeTier', tier: 'FREE', desc: 'Editorial layout, platform embeds' },
  { id: 'premium', label: '3D Broadcast Room', icon: Radio, path: 'BroadcastPortal', tier: 'PREMIUM', desc: 'Spatial presence, persistent audio' },
  { id: 'blockchain', label: 'Why Blockchain', icon: Shield, path: 'Discover', tier: 'INFO', desc: 'Traditional vs 33.3FM' },
];

const TIER_COLORS = {
  FREE: '#00ff88',
  CREATOR: '#00ffff',
  PRODUCER: '#ff0033',
  SYNDICATE: '#ff00ff',
  PREMIUM: '#ffff00',
  INFO: '#888',
};

function TierBadge({ tier }) {
  return (
    <span style={{
      fontSize: '9px',
      fontFamily: 'monospace',
      letterSpacing: '0.1em',
      padding: '2px 6px',
      borderRadius: '3px',
      border: `1px solid ${TIER_COLORS[tier] || '#444'}`,
      color: TIER_COLORS[tier] || '#888',
      background: `${TIER_COLORS[tier] || '#444'}15`,
    }}>
      {tier}
    </span>
  );
}

function RouteCard({ icon: Icon, label, path, tier, color, desc, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={createPageUrl(path)}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '6px',
        padding: '14px',
        borderRadius: '8px',
        border: `1px solid ${hovered ? color : '#1a1a1a'}`,
        background: hovered ? `${color}08` : '#0a0a0a',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        boxShadow: hovered ? `0 0 12px ${color}30` : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <Icon size={16} style={{ color: hovered ? color : '#666' }} />
        {tier && <TierBadge tier={tier} />}
      </div>
      <span style={{ fontSize: '12px', fontFamily: 'monospace', color: hovered ? '#fff' : '#aaa', fontWeight: 600 }}>
        {label}
      </span>
      {desc && <span style={{ fontSize: '10px', color: '#555', fontFamily: 'monospace' }}>{desc}</span>}
    </Link>
  );
}

export default function VirtualSignalStudio() {
  const [activeRoom, setActiveRoom] = useState('signal-booth');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 3000);
    return () => clearInterval(t);
  }, []);

  const rooms = ['signal-booth', 'producer-room', 'mix-room', 'control-room', 'neon-vault'];
  useEffect(() => {
    setActiveRoom(rooms[tick % rooms.length]);
  }, [tick]);

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', position: 'relative' }}>
      {/* 3D Background - cycles through rooms */}
      <Room3DWrapper room={activeRoom} opacity={0.25} />

      {/* Trinity Floor Header */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1a1a1a',
        padding: '10px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radio size={18} style={{ color: '#ff0033', animation: 'pulse 2s infinite' }} />
          <span style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 700, color: '#ff0033' }}>33.3FM</span>
          <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#555' }}>Virtual Signal Studio</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ffff', animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#00ffff', letterSpacing: '0.15em' }}>
            TRINITY FLOOR: THE_NEON_VAULT
          </span>
        </div>
      </div>

      {/* Main content */}
      <div style={{ paddingTop: '60px', maxWidth: '480px', margin: '0 auto', padding: '60px 20px 80px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '48px 0 32px' }}>
          <div style={{
            fontSize: '48px', fontWeight: 900, letterSpacing: '-0.02em',
            color: '#ff0033', textShadow: '0 0 40px #ff003380',
            fontFamily: 'monospace',
          }}>
            33.3FM
          </div>
          <div style={{ fontSize: '20px', fontWeight: 300, color: '#fff', marginTop: '4px', letterSpacing: '0.05em' }}>
            Virtual Signal Studio
          </div>
          <p style={{ fontSize: '13px', color: '#666', marginTop: '12px', lineHeight: 1.6, fontFamily: 'monospace' }}>
            The resurrected recording studio. Record, mix, master, and mint your music on the 33.3FM DOGECHAIN broadcast network.
          </p>
          <div style={{ fontSize: '10px', color: '#444', marginTop: '8px', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
            TIMELINE: 33_3_FM_DOGECHAIN | GOVERNED BY: CONSUMER
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px', flexWrap: 'wrap' }}>
            <Link to={createPageUrl('SignalBooth')} style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '6px',
              background: '#ff0033', color: '#fff', fontFamily: 'monospace',
              fontSize: '14px', fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 0 20px #ff003360',
            }}>
              Enter Studio <ArrowRight size={16} />
            </Link>
            <Link to={createPageUrl('NeonVault')} style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '6px',
              border: '1px solid #00ffff', color: '#00ffff', fontFamily: 'monospace',
              fontSize: '13px', textDecoration: 'none',
            }}>
              <Star size={14} /> Neon Vault Museum
            </Link>
            <Link to={createPageUrl('FreeTier')} style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '6px',
              border: '1px solid #ff0033', color: '#ff0033', fontFamily: 'monospace',
              fontSize: '13px', textDecoration: 'none',
            }}>
              <Radio size={14} /> Artist Pages
            </Link>
          </div>
        </div>

        {/* Artist Pathways */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Radio size={14} style={{ color: '#ff0033' }} />
            <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#ff0033', letterSpacing: '0.2em' }}>
              ARTIST PAGES
            </span>
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>All Pathways</h2>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '16px', fontFamily: 'monospace' }}>
            Access your creative workspace
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {ARTIST_ROUTES.map(r => (
              <RouteCard key={r.id} {...r} />
            ))}
          </div>
        </section>

        {/* Studio Routes */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Radio size={14} style={{ color: '#ff0033' }} />
            <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#ff0033', letterSpacing: '0.2em' }}>
              STUDIO ROUTES
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {STUDIO_ROUTES.map(r => (
              <RouteCard key={r.id} {...r} />
            ))}
          </div>
        </section>

        {/* Museum Routes */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Star size={14} style={{ color: '#00ffff' }} />
            <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#00ffff', letterSpacing: '0.2em' }}>
              MUSEUM ROUTES
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {MUSEUM_ROUTES.map(r => (
              <RouteCard key={r.id} {...r} />
            ))}
          </div>
        </section>

        {/* Room preview indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          marginBottom: '32px',
        }}>
          {rooms.map(r => (
            <div
              key={r}
              onClick={() => setActiveRoom(r)}
              style={{
                width: r === activeRoom ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: r === activeRoom ? '#ff0033' : '#333',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', borderTop: '1px solid #111', paddingTop: '24px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#444', letterSpacing: '0.1em', marginBottom: '4px' }}>
            VSS-33.3 | Rebuilt from the Fallen Studio Node 2090
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#333', letterSpacing: '0.08em', marginBottom: '4px' }}>
            PATCH: vss_33.3 | REALM: BUSINESS | MOUNT: CONSUMER
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#555' }}>
            Part of the{' '}
            <span style={{ color: '#ff0033' }}>3D VECTOR DOGECHAIN</span> network
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#333', marginTop: '8px', letterSpacing: '0.1em' }}>
            TIMELINE: 33_3_FM_DOGECHAIN
          </div>
        </div>
      </div>
    </div>
  );
}
