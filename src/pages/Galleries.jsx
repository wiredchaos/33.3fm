import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Image } from 'lucide-react';

const GALLERIES = [
  { id: 1, name: 'Signal Genesis Collection', items: 12, color: '#ff0033' },
  { id: 2, name: 'Neon Cipher Series', items: 8, color: '#00ffff' },
  { id: 3, name: 'Red Fang Visual Archive', items: 24, color: '#ff8800' },
  { id: 4, name: 'Labyrinth Art Vault', items: 16, color: '#ff00ff' },
];

export default function Galleries() {
  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1a1a1a', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link to={createPageUrl('NeonVault')} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666', textDecoration: 'none', fontSize: '13px', fontFamily: 'monospace' }}><ArrowLeft size={14} /> Neon Vault</Link>
        <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '10px', color: '#00ffff', letterSpacing: '0.15em' }}>GALLERIES</span>
      </div>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <Image size={20} style={{ color: '#00ffff' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'monospace' }}>Galleries</h1>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {GALLERIES.map(g => (
            <div key={g.id} style={{ borderRadius: '8px', border: `1px solid ${g.color}30`, background: '#0a0a0a', overflow: 'hidden', cursor: 'pointer' }}>
              <div style={{ aspectRatio: '16/9', background: `radial-gradient(circle at 30% 50%, ${g.color}20, #000)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image size={32} style={{ color: g.color, opacity: 0.5 }} />
              </div>
              <div style={{ padding: '12px' }}>
                <div style={{ fontSize: '13px', fontFamily: 'monospace', fontWeight: 700, marginBottom: '4px' }}>{g.name}</div>
                <div style={{ fontSize: '10px', color: '#666', fontFamily: 'monospace' }}>{g.items} items</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
