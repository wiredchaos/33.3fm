import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Room3DWrapper } from '@/components/studio/Room3DWrapper';
import { ArrowLeft, Home, Sliders } from 'lucide-react';

const CHANNELS = [
  { id: 0, name: 'KICK', color: '#ff0033' },
  { id: 1, name: 'SNARE', color: '#ff8800' },
  { id: 2, name: 'HI-HAT', color: '#ffff00' },
  { id: 3, name: 'BASS', color: '#00ffff' },
  { id: 4, name: 'LEAD', color: '#00ff88' },
  { id: 5, name: 'PAD', color: '#ff00ff' },
  { id: 6, name: 'VOX', color: '#ff0088' },
  { id: 7, name: 'FX', color: '#8800ff' },
];

export default function MixRoom() {
  const [faders, setFaders] = useState(CHANNELS.map(() => 75));
  const [pans, setPans] = useState(CHANNELS.map(() => 50));
  const [mutes, setMutes] = useState(CHANNELS.map(() => false));
  const [solos, setSolos] = useState(CHANNELS.map(() => false));
  const [masterVol, setMasterVol] = useState(80);
  const [eq, setEq] = useState({ bass: 50, mid: 50, treble: 50 });

  const setFader = (i, v) => setFaders(prev => { const n = [...prev]; n[i] = v; return n; });
  const setPan = (i, v) => setPans(prev => { const n = [...prev]; n[i] = v; return n; });
  const toggleMute = (i) => setMutes(prev => { const n = [...prev]; n[i] = !n[i]; return n; });
  const toggleSolo = (i) => setSolos(prev => { const n = [...prev]; n[i] = !n[i]; return n; });

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', position: 'relative' }}>
      <Room3DWrapper room="mix-room" opacity={0.2} />

      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1a1a1a', padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <Link to={createPageUrl('VirtualSignalStudio')} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666', textDecoration: 'none', fontSize: '13px', fontFamily: 'monospace' }}>
          <ArrowLeft size={14} /> Back
        </Link>
        <Link to="/" style={{ color: '#666', textDecoration: 'none' }}><Home size={14} /></Link>
        <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '10px', color: '#00ff88', letterSpacing: '0.15em' }}>MIX ROOM</span>
      </div>

      <div style={{ paddingTop: '60px', maxWidth: '1000px', margin: '0 auto', padding: '80px 20px 80px', overflowX: 'auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sliders size={20} style={{ color: '#00ff88' }} />
            <h1 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'monospace' }}>Mix Room</h1>
          </div>
          <p style={{ fontSize: '13px', color: '#666', fontFamily: 'monospace' }}>16-channel mixing console with EQ and spatial controls</p>
        </div>

        {/* Channel strips */}
        <div style={{ display: 'flex', gap: '8px', minWidth: '700px', marginBottom: '32px' }}>
          {CHANNELS.map((ch, i) => (
            <div key={ch.id} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
              padding: '12px 8px', borderRadius: '8px',
              border: `1px solid ${mutes[i] ? '#333' : ch.color + '30'}`,
              background: mutes[i] ? '#050505' : '#0a0a0a',
              opacity: mutes[i] ? 0.5 : 1,
              transition: 'all 0.2s',
            }}>
              {/* Channel name */}
              <div style={{ fontSize: '9px', fontFamily: 'monospace', color: ch.color, letterSpacing: '0.1em', fontWeight: 700 }}>
                {ch.name}
              </div>

              {/* VU meter */}
              <div style={{ width: '8px', height: '80px', background: '#111', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: `${mutes[i] ? 0 : faders[i]}%`,
                  background: `linear-gradient(to top, ${ch.color}, ${faders[i] > 80 ? '#ff0033' : ch.color})`,
                  transition: 'height 0.1s',
                }} />
              </div>

              {/* Fader */}
              <input
                type="range" min={0} max={100} value={faders[i]}
                onChange={e => setFader(i, Number(e.target.value))}
                style={{ writingMode: 'vertical-lr', direction: 'rtl', height: '100px', accentColor: ch.color }}
              />

              {/* Pan */}
              <div style={{ fontSize: '8px', color: '#555', fontFamily: 'monospace' }}>PAN</div>
              <input
                type="range" min={0} max={100} value={pans[i]}
                onChange={e => setPan(i, Number(e.target.value))}
                style={{ width: '100%', accentColor: '#666' }}
              />

              {/* M / S buttons */}
              <button
                onClick={() => toggleMute(i)}
                style={{
                  width: '28px', height: '20px', borderRadius: '3px', border: 'none', cursor: 'pointer',
                  background: mutes[i] ? '#ff8800' : '#1a1a1a',
                  color: mutes[i] ? '#000' : '#666',
                  fontSize: '9px', fontFamily: 'monospace', fontWeight: 700,
                }}
              >M</button>
              <button
                onClick={() => toggleSolo(i)}
                style={{
                  width: '28px', height: '20px', borderRadius: '3px', border: 'none', cursor: 'pointer',
                  background: solos[i] ? '#ffff00' : '#1a1a1a',
                  color: solos[i] ? '#000' : '#666',
                  fontSize: '9px', fontFamily: 'monospace', fontWeight: 700,
                }}
              >S</button>

              {/* Level readout */}
              <div style={{ fontSize: '9px', fontFamily: 'monospace', color: '#555' }}>{faders[i]}</div>
            </div>
          ))}

          {/* Master channel */}
          <div style={{
            width: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            padding: '12px 8px', borderRadius: '8px',
            border: '1px solid #ff003350', background: '#0d0505',
          }}>
            <div style={{ fontSize: '9px', fontFamily: 'monospace', color: '#ff0033', letterSpacing: '0.1em', fontWeight: 700 }}>MSTR</div>
            <div style={{ width: '8px', height: '80px', background: '#111', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${masterVol}%`, background: 'linear-gradient(to top, #ff0033, #ff8800)' }} />
            </div>
            <input
              type="range" min={0} max={100} value={masterVol}
              onChange={e => setMasterVol(Number(e.target.value))}
              style={{ writingMode: 'vertical-lr', direction: 'rtl', height: '100px', accentColor: '#ff0033' }}
            />
            <div style={{ fontSize: '9px', fontFamily: 'monospace', color: '#ff0033' }}>{masterVol}</div>
          </div>
        </div>

        {/* Master EQ */}
        <div style={{ padding: '20px', borderRadius: '8px', border: '1px solid #1a1a1a', background: '#0a0a0a' }}>
          <div style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: '16px' }}>
            MASTER EQ
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { key: 'bass', label: 'BASS', color: '#ff0033' },
              { key: 'mid', label: 'MID', color: '#ffff00' },
              { key: 'treble', label: 'TREBLE', color: '#00ffff' },
            ].map(band => (
              <div key={band.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '10px', color: band.color, fontFamily: 'monospace' }}>{band.label}</span>
                  <span style={{ fontSize: '10px', color: '#666', fontFamily: 'monospace' }}>
                    {eq[band.key] > 50 ? `+${eq[band.key] - 50}` : eq[band.key] - 50} dB
                  </span>
                </div>
                <input
                  type="range" min={0} max={100} value={eq[band.key]}
                  onChange={e => setEq(prev => ({ ...prev, [band.key]: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: band.color }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
