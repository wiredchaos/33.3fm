import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Home, List, Play, Music, Star } from 'lucide-react';

const PLAYLISTS = [
  { id: 'genesis', name: 'Genesis Rotation', tracks: 24, color: '#ff0033', desc: 'The foundational signal — where it all began' },
  { id: 'labyrinth', name: 'Labyrinth OST', tracks: 18, color: '#00ffff', desc: 'Official soundtrack of the Labyrinth universe' },
  { id: 'redfang', name: 'Red Fang Sessions', tracks: 32, color: '#ff8800', desc: 'Raw sessions from the Red Fang collective' },
  { id: 'spotlight', name: 'Artist Spotlight', tracks: 12, color: '#ffff00', desc: 'Featured artists from the DOGECHAIN network' },
  { id: 'ambient', name: 'Ambient Zone', tracks: 20, color: '#00ff88', desc: 'Deep ambient textures for the studio mind' },
  { id: 'cipher', name: 'Cipher Dreams', tracks: 15, color: '#ff00ff', desc: 'Encrypted frequencies and hidden patterns' },
];

const MOCK_TRACKS = [
  { id: 1, title: 'Voltage Surge', artist: 'Electric Storm', duration: '3:33' },
  { id: 2, title: 'Crimson Code', artist: 'Neon Syndicate', duration: '4:05' },
  { id: 3, title: 'Fire Protocol', artist: 'Heat Seeker', duration: '3:47' },
  { id: 4, title: 'Midnight Signal', artist: 'Bass Nomad', duration: '5:12' },
  { id: 5, title: 'Cipher Dreams', artist: 'NEURO META X', duration: '4:30' },
];

export default function Playlists() {
  const [active, setActive] = useState(null);
  const [playing, setPlaying] = useState(null);

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff' }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1a1a1a', padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <Link to={createPageUrl('VirtualSignalStudio')} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666', textDecoration: 'none', fontSize: '13px', fontFamily: 'monospace' }}>
          <ArrowLeft size={14} /> Back
        </Link>
        <Link to="/" style={{ color: '#666', textDecoration: 'none' }}><Home size={14} /></Link>
        <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '10px', color: '#ff8800', letterSpacing: '0.15em' }}>PLAYLISTS</span>
      </div>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <List size={20} style={{ color: '#ff8800' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'monospace' }}>Playlists</h1>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '32px' }}>
          {PLAYLISTS.map(pl => (
            <div key={pl.id} onClick={() => setActive(active === pl.id ? null : pl.id)} style={{
              padding: '16px', borderRadius: '8px', cursor: 'pointer',
              border: `1px solid ${active === pl.id ? pl.color : '#1a1a1a'}`,
              background: active === pl.id ? `${pl.color}08` : '#0a0a0a',
              transition: 'all 0.2s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontFamily: 'monospace', fontWeight: 700, color: active === pl.id ? pl.color : '#fff' }}>{pl.name}</span>
                <span style={{ fontSize: '10px', color: '#555', fontFamily: 'monospace' }}>{pl.tracks} tracks</span>
              </div>
              <p style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace', marginBottom: '10px' }}>{pl.desc}</p>
              <button onClick={e => { e.stopPropagation(); setPlaying(pl.id); }} style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '4px 10px', borderRadius: '3px', cursor: 'pointer',
                background: `${pl.color}20`, border: `1px solid ${pl.color}60`,
                color: pl.color, fontFamily: 'monospace', fontSize: '10px',
              }}>
                <Play size={10} /> {playing === pl.id ? 'Playing...' : 'Play'}
              </button>
            </div>
          ))}
        </div>
        {active && (
          <div style={{ padding: '20px', borderRadius: '8px', border: '1px solid #1a1a1a', background: '#0a0a0a' }}>
            <div style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: '12px' }}>
              TRACKS — {PLAYLISTS.find(p => p.id === active)?.name}
            </div>
            {MOCK_TRACKS.map((track, i) => (
              <div key={track.id} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 0', borderBottom: i < MOCK_TRACKS.length - 1 ? '1px solid #111' : 'none',
              }}>
                <span style={{ fontSize: '10px', color: '#444', fontFamily: 'monospace', minWidth: '20px' }}>{i + 1}</span>
                <Music size={12} style={{ color: '#666' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#fff' }}>{track.title}</div>
                  <div style={{ fontSize: '10px', color: '#666', fontFamily: 'monospace' }}>{track.artist}</div>
                </div>
                <span style={{ fontSize: '10px', color: '#555', fontFamily: 'monospace' }}>{track.duration}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
