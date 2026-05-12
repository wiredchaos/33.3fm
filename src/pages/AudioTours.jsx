import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Headphones, Play, Square } from 'lucide-react';

const TOURS = [
  { id: 1, title: 'The Signal Genesis Story', duration: '12:30', narrator: 'VSS-33.3 AI', color: '#ff0033', stops: 5 },
  { id: 2, title: 'Neon Vault Architecture', duration: '8:45', narrator: 'NEURO META X', color: '#00ffff', stops: 4 },
  { id: 3, title: 'DOGECHAIN History', duration: '15:20', narrator: 'Bass Nomad', color: '#ffff00', stops: 7 },
  { id: 4, title: 'Red Fang Sessions Deep Dive', duration: '10:00', narrator: 'DJ Red Fang', color: '#ff8800', stops: 6 },
];

export default function AudioTours() {
  const [playing, setPlaying] = useState(null);

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1a1a1a', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link to={createPageUrl('NeonVault')} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666', textDecoration: 'none', fontSize: '13px', fontFamily: 'monospace' }}><ArrowLeft size={14} /> Neon Vault</Link>
        <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '10px', color: '#ff8800', letterSpacing: '0.15em' }}>AUDIO TOURS</span>
      </div>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 20px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <Headphones size={20} style={{ color: '#ff8800' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'monospace' }}>Audio Tours</h1>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {TOURS.map(tour => (
            <div key={tour.id} style={{ padding: '20px', borderRadius: '8px', border: `1px solid ${playing === tour.id ? tour.color : '#1a1a1a'}`, background: playing === tour.id ? `${tour.color}08` : '#0a0a0a', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontFamily: 'monospace', fontWeight: 700, marginBottom: '4px' }}>{tour.title}</div>
                  <div style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace' }}>Narrated by {tour.narrator} · {tour.stops} stops · {tour.duration}</div>
                </div>
                <button onClick={() => setPlaying(playing === tour.id ? null : tour.id)} style={{
                  width: '40px', height: '40px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                  background: playing === tour.id ? tour.color : `${tour.color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: playing === tour.id ? `0 0 12px ${tour.color}60` : 'none',
                }}>
                  {playing === tour.id ? <Square size={16} style={{ color: '#000' }} /> : <Play size={16} style={{ color: tour.color } } />}
                </button>
              </div>
              {playing === tour.id && (
                <div style={{ marginTop: '12px', padding: '10px', borderRadius: '4px', background: '#111', fontFamily: 'monospace', fontSize: '11px', color: '#aaa' }}>
                  ▶ Now playing: {tour.title}...
                  <div style={{ marginTop: '6px', height: '3px', borderRadius: '2px', background: '#222', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '35%', background: tour.color, animation: 'progress 10s linear infinite' }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
