import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Room3DWrapper } from '@/components/studio/Room3DWrapper';
import { WaveformVisualizer } from '@/components/studio/WaveformVisualizer';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { Mic, Square, Pause, Play, Trash2, Save, Radio, Volume2, ArrowLeft, Home, Wand2 } from 'lucide-react';

const AI_PRESETS = [
  { id: 'broadcast', name: 'Broadcast Clean', desc: 'Radio-ready clarity and compression' },
  { id: 'phantom', name: 'Phantom Vocal', desc: 'Ethereal reverb and presence' },
  { id: 'redfang', name: 'Red Fang Silk', desc: 'Warm vintage vocal character' },
  { id: 'raw', name: 'Raw Signal', desc: 'No processing, pure capture' },
];

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function SignalBooth() {
  const { state, startRecording, stopRecording, pauseRecording, resumeRecording, clearRecording, getAudioData } = useAudioRecorder();
  const [preset, setPreset] = useState('broadcast');
  const [gain, setGain] = useState(75);
  const [takes, setTakes] = useState([]);

  const handleSaveTake = () => {
    if (state.audioUrl) {
      setTakes(prev => [...prev, {
        id: `take-${Date.now()}`,
        name: `Take ${prev.length + 1}`,
        duration: state.duration,
        url: state.audioUrl,
      }]);
      clearRecording();
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', position: 'relative' }}>
      <Room3DWrapper room="signal-booth" opacity={0.2} />

      {/* Header */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1a1a1a', padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <Link to={createPageUrl('VirtualSignalStudio')} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666', textDecoration: 'none', fontSize: '13px', fontFamily: 'monospace' }}>
          <ArrowLeft size={14} /> Back
        </Link>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666', textDecoration: 'none', fontSize: '13px', fontFamily: 'monospace' }}>
          <Home size={14} />
        </Link>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: state.isRecording ? '#ff0033' : '#333', animation: state.isRecording ? 'pulse 1s infinite' : 'none' }} />
          <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#666', letterSpacing: '0.1em' }}>SIGNAL BOOTH</span>
        </div>
      </div>

      <div style={{ paddingTop: '60px', maxWidth: '800px', margin: '0 auto', padding: '80px 20px 80px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Mic size={20} style={{ color: '#ff0033' }} />
            <h1 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'monospace' }}>Signal Booth</h1>
          </div>
          <p style={{ fontSize: '13px', color: '#666', fontFamily: 'monospace' }}>Record your vocals and instruments with AI-enhanced processing</p>
        </div>

        {/* AI Presets */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Wand2 size={12} /> AI PRESET
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {AI_PRESETS.map(p => (
              <button
                key={p.id}
                onClick={() => setPreset(p.id)}
                style={{
                  padding: '12px', borderRadius: '6px', textAlign: 'left', cursor: 'pointer',
                  border: `1px solid ${preset === p.id ? '#ff0033' : '#1a1a1a'}`,
                  background: preset === p.id ? '#ff003310' : '#0a0a0a',
                  color: '#fff', transition: 'all 0.2s',
                }}
              >
                <div style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 600, marginBottom: '2px' }}>{p.name}</div>
                <div style={{ fontSize: '10px', color: '#666', fontFamily: 'monospace' }}>{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Gain */}
        <div style={{ marginBottom: '24px', padding: '16px', borderRadius: '8px', border: '1px solid #1a1a1a', background: '#0a0a0a' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#666', fontFamily: 'monospace' }}>
              <Volume2 size={12} /> INPUT GAIN
            </div>
            <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#ff0033' }}>{gain}%</span>
          </div>
          <input
            type="range" min={0} max={100} value={gain}
            onChange={e => setGain(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#ff0033' }}
          />
        </div>

        {/* Waveform */}
        <div style={{ marginBottom: '24px' }}>
          <WaveformVisualizer
            isActive={state.isRecording && !state.isPaused}
            getAudioData={getAudioData}
            className="w-full"
          />
        </div>

        {/* Recording Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '24px' }}>
          {!state.isRecording ? (
            <button
              onClick={startRecording}
              style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: '#ff0033', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 24px #ff003360', transition: 'all 0.2s',
              }}
            >
              <Mic size={28} style={{ color: '#fff' }} />
            </button>
          ) : (
            <>
              <button
                onClick={state.isPaused ? resumeRecording : pauseRecording}
                style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: '#1a1a1a', border: '1px solid #333', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {state.isPaused ? <Play size={20} style={{ color: '#fff' }} /> : <Pause size={20} style={{ color: '#fff' }} />}
              </button>
              <button
                onClick={stopRecording}
                style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: '#ff0033', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 24px #ff003360',
                }}
              >
                <Square size={24} style={{ color: '#fff' }} />
              </button>
            </>
          )}
          {state.isRecording && (
            <div style={{ fontFamily: 'monospace', fontSize: '20px', color: '#ff0033', minWidth: '60px' }}>
              {formatDuration(state.duration)}
            </div>
          )}
        </div>

        {/* Save / Discard after recording */}
        {state.audioUrl && !state.isRecording && (
          <div style={{ padding: '16px', borderRadius: '8px', border: '1px solid #ff003330', background: '#ff003308', marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', color: '#aaa', fontFamily: 'monospace', marginBottom: '12px' }}>
              Recording complete — {formatDuration(state.duration)}
            </div>
            <audio src={state.audioUrl} controls style={{ width: '100%', marginBottom: '12px' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleSaveTake}
                style={{
                  flex: 1, padding: '10px', borderRadius: '6px',
                  background: '#ff0033', border: 'none', color: '#fff',
                  fontFamily: 'monospace', fontSize: '12px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}
              >
                <Save size={14} /> Save Take
              </button>
              <button
                onClick={clearRecording}
                style={{
                  padding: '10px 16px', borderRadius: '6px',
                  background: '#1a1a1a', border: '1px solid #333', color: '#aaa',
                  fontFamily: 'monospace', fontSize: '12px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                <Trash2 size={14} /> Discard
              </button>
            </div>
          </div>
        )}

        {/* Takes list */}
        {takes.length > 0 && (
          <div>
            <div style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: '10px' }}>
              SAVED TAKES ({takes.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {takes.map(take => (
                <div key={take.id} style={{
                  padding: '12px 16px', borderRadius: '6px',
                  border: '1px solid #1a1a1a', background: '#0a0a0a',
                  display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 600 }}>{take.name}</div>
                    <div style={{ fontSize: '10px', color: '#666', fontFamily: 'monospace' }}>{formatDuration(take.duration)}</div>
                  </div>
                  <audio src={take.url} controls style={{ height: '32px' }} />
                  <button
                    onClick={() => setTakes(prev => prev.filter(t => t.id !== take.id))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', padding: '4px' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
