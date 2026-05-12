import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Room3DWrapper } from '@/components/studio/Room3DWrapper';
import { Play, Square, ArrowLeft, Home, Music, Sliders } from 'lucide-react';

const PADS = [
  { id: 0, label: 'KICK', color: '#ff0033', freq: 60 },
  { id: 1, label: 'SNARE', color: '#ff8800', freq: 200 },
  { id: 2, label: 'HI-HAT', color: '#ffff00', freq: 800 },
  { id: 3, label: 'CLAP', color: '#00ff88', freq: 400 },
  { id: 4, label: 'BASS', color: '#00ffff', freq: 80 },
  { id: 5, label: 'LEAD', color: '#ff00ff', freq: 440 },
  { id: 6, label: 'PAD', color: '#8800ff', freq: 220 },
  { id: 7, label: 'FX', color: '#ff0088', freq: 1200 },
];

const STEPS = 16;

function playTone(freq, duration = 0.1) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = freq < 100 ? 'sine' : freq < 300 ? 'square' : 'sawtooth';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

export default function ProducerRoom() {
  const [pattern, setPattern] = useState(() =>
    PADS.map(() => Array(STEPS).fill(false))
  );
  const [playing, setPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [bpm, setBpm] = useState(120);
  const intervalRef = useRef(null);

  const toggleStep = (padIdx, stepIdx) => {
    setPattern(prev => {
      const next = prev.map(row => [...row]);
      next[padIdx][stepIdx] = !next[padIdx][stepIdx];
      return next;
    });
  };

  const triggerPad = (pad) => {
    playTone(pad.freq, 0.15);
  };

  const startSequencer = useCallback(() => {
    let step = 0;
    const interval = (60 / bpm / 4) * 1000;
    intervalRef.current = setInterval(() => {
      setCurrentStep(step);
      PADS.forEach((pad, i) => {
        if (pattern[i][step]) playTone(pad.freq, 0.1);
      });
      step = (step + 1) % STEPS;
    }, interval);
    setPlaying(true);
  }, [bpm, pattern]);

  const stopSequencer = () => {
    clearInterval(intervalRef.current);
    setPlaying(false);
    setCurrentStep(-1);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', position: 'relative' }}>
      <Room3DWrapper room="producer-room" opacity={0.2} />

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
        <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '10px', color: '#00ffff', letterSpacing: '0.15em' }}>PRODUCER ROOM</span>
      </div>

      <div style={{ paddingTop: '60px', maxWidth: '900px', margin: '0 auto', padding: '80px 20px 80px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Music size={20} style={{ color: '#00ffff' }} />
            <h1 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'monospace' }}>Producer Room</h1>
          </div>
          <p style={{ fontSize: '13px', color: '#666', fontFamily: 'monospace' }}>Beat sequencer with 8 pads and 16 steps</p>
        </div>

        {/* Transport */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px',
          padding: '16px', borderRadius: '8px', border: '1px solid #1a1a1a', background: '#0a0a0a',
        }}>
          <button
            onClick={playing ? stopSequencer : startSequencer}
            style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: playing ? '#333' : '#00ffff', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: playing ? 'none' : '0 0 16px #00ffff60',
            }}
          >
            {playing ? <Square size={20} style={{ color: '#fff' }} /> : <Play size={20} style={{ color: '#000' }} />}
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace' }}>BPM</span>
              <span style={{ fontSize: '14px', fontFamily: 'monospace', color: '#00ffff' }}>{bpm}</span>
            </div>
            <input
              type="range" min={60} max={200} value={bpm}
              onChange={e => setBpm(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#00ffff' }}
            />
          </div>
        </div>

        {/* Pad grid + sequencer */}
        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: '700px' }}>
            {PADS.map((pad, padIdx) => (
              <div key={pad.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                {/* Pad trigger button */}
                <button
                  onClick={() => triggerPad(pad)}
                  style={{
                    width: '72px', minWidth: '72px', height: '36px', borderRadius: '4px',
                    background: '#0a0a0a', border: `1px solid ${pad.color}40`,
                    color: pad.color, fontFamily: 'monospace', fontSize: '10px',
                    cursor: 'pointer', fontWeight: 700, letterSpacing: '0.05em',
                    transition: 'all 0.1s',
                  }}
                >
                  {pad.label}
                </button>
                {/* 16 steps */}
                {Array(STEPS).fill(null).map((_, stepIdx) => (
                  <button
                    key={stepIdx}
                    onClick={() => toggleStep(padIdx, stepIdx)}
                    style={{
                      width: '32px', height: '36px', borderRadius: '3px',
                      border: `1px solid ${pattern[padIdx][stepIdx] ? pad.color : '#1a1a1a'}`,
                      background: pattern[padIdx][stepIdx]
                        ? `${pad.color}30`
                        : currentStep === stepIdx && playing
                        ? '#ffffff10'
                        : '#050505',
                      cursor: 'pointer',
                      boxShadow: currentStep === stepIdx && playing && pattern[padIdx][stepIdx]
                        ? `0 0 8px ${pad.color}`
                        : 'none',
                      transition: 'all 0.05s',
                      outline: currentStep === stepIdx ? `1px solid #ffffff20` : 'none',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Clear pattern */}
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setPattern(PADS.map(() => Array(STEPS).fill(false)))}
            style={{
              padding: '8px 16px', borderRadius: '4px',
              background: '#1a1a1a', border: '1px solid #333',
              color: '#666', fontFamily: 'monospace', fontSize: '11px', cursor: 'pointer',
            }}
          >
            Clear Pattern
          </button>
          <button
            onClick={() => {
              // Random pattern
              setPattern(PADS.map((_, i) => Array(STEPS).fill(null).map((_, j) => {
                if (i === 0) return j % 4 === 0; // kick on beats
                if (i === 1) return j % 4 === 2; // snare on 2 and 4
                if (i === 2) return j % 2 === 0; // hihat on 8ths
                return Math.random() > 0.75;
              })));
            }}
            style={{
              padding: '8px 16px', borderRadius: '4px',
              background: '#00ffff10', border: '1px solid #00ffff40',
              color: '#00ffff', fontFamily: 'monospace', fontSize: '11px', cursor: 'pointer',
            }}
          >
            Generate Pattern
          </button>
        </div>
      </div>
    </div>
  );
}
