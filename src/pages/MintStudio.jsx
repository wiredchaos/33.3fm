import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Room3DWrapper } from '@/components/studio/Room3DWrapper';
import { ArrowLeft, Home, Disc, Upload, Check } from 'lucide-react';

export default function MintStudio() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ title: '', artist: '', description: '', type: 'audio', royalty: 10 });
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);

  const handleMint = () => {
    setMinting(true);
    setTimeout(() => { setMinting(false); setMinted(true); }, 2500);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', position: 'relative' }}>
      <Room3DWrapper room="neon-vault" opacity={0.15} />
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
        <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '10px', color: '#ffff00', letterSpacing: '0.15em' }}>MINT PROTOCOL</span>
      </div>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '60px 20px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Disc size={32} style={{ color: '#ffff00', margin: '0 auto 12px', animation: minting ? 'spin 1s linear infinite' : 'none' }} />
          <h1 style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'monospace', marginBottom: '8px' }}>Mint Studio</h1>
          <p style={{ fontSize: '13px', color: '#666', fontFamily: 'monospace' }}>Mint your music as an NFT on the DOGECHAIN broadcast network</p>
        </div>
        {minted ? (
          <div style={{ textAlign: 'center', padding: '40px', borderRadius: '12px', border: '1px solid #00ff88', background: '#00ff8808' }}>
            <Check size={48} style={{ color: '#00ff88', margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '20px', fontFamily: 'monospace', color: '#00ff88', marginBottom: '8px' }}>NFT Minted!</h2>
            <p style={{ fontSize: '13px', color: '#666', fontFamily: 'monospace', marginBottom: '20px' }}>{form.title || 'Your track'} has been minted on the DOGECHAIN.</p>
            <Link to={createPageUrl('NeonVault')} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '10px 20px', borderRadius: '6px',
              background: '#00ff88', color: '#000', fontFamily: 'monospace', fontSize: '13px', fontWeight: 700,
              textDecoration: 'none',
            }}>View in Neon Vault</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { key: 'title', label: 'Track Title', placeholder: 'Enter track title...' },
              { key: 'artist', label: 'Artist Name', placeholder: 'Your artist name...' },
              { key: 'description', label: 'Description', placeholder: 'Describe your track...' },
            ].map(field => (
              <div key={field.key}>
                <label style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>{field.label.toUpperCase()}</label>
                <input
                  value={form[field.key]}
                  onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: '6px',
                    background: '#0a0a0a', border: '1px solid #1a1a1a',
                    color: '#fff', fontFamily: 'monospace', fontSize: '13px',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            ))}
            <div>
              <label style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>NFT TYPE</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['audio', 'visual', 'access'].map(t => (
                  <button key={t} onClick={() => setForm(prev => ({ ...prev, type: t }))} style={{
                    flex: 1, padding: '8px', borderRadius: '4px', cursor: 'pointer',
                    border: `1px solid ${form.type === t ? '#ffff00' : '#1a1a1a'}`,
                    background: form.type === t ? '#ffff0010' : '#0a0a0a',
                    color: form.type === t ? '#ffff00' : '#666',
                    fontFamily: 'monospace', fontSize: '11px',
                  }}>{t.toUpperCase()}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace', letterSpacing: '0.1em' }}>ROYALTY %</label>
                <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#ffff00' }}>{form.royalty}%</span>
              </div>
              <input type="range" min={0} max={50} value={form.royalty} onChange={e => setForm(prev => ({ ...prev, royalty: Number(e.target.value) }))} style={{ width: '100%', accentColor: '#ffff00' }} />
            </div>
            <div style={{ padding: '16px', borderRadius: '8px', border: '1px solid #1a1a1a', background: '#0a0a0a' }}>
              <div style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: '10px' }}>UPLOAD AUDIO FILE</div>
              <div style={{
                padding: '24px', borderRadius: '6px', border: '2px dashed #333',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer',
              }}>
                <Upload size={24} style={{ color: '#666' }} />
                <span style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>Drop audio file here or click to browse</span>
                <span style={{ fontSize: '10px', color: '#444', fontFamily: 'monospace' }}>MP3, WAV, FLAC up to 50MB</span>
              </div>
            </div>
            <button
              onClick={handleMint}
              disabled={minting || !form.title}
              style={{
                width: '100%', padding: '14px', borderRadius: '6px',
                background: minting ? '#333' : '#ffff00', border: 'none', cursor: form.title ? 'pointer' : 'not-allowed',
                color: '#000', fontFamily: 'monospace', fontSize: '14px', fontWeight: 700,
                boxShadow: minting ? 'none' : '0 0 20px #ffff0040',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              <Disc size={16} style={{ animation: minting ? 'spin 1s linear infinite' : 'none' }} />
              {minting ? 'Minting on DOGECHAIN...' : 'Mint NFT'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
