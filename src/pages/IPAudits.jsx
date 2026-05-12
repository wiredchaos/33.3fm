import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, FileCheck, Shield, Check } from 'lucide-react';

const AUDITS = [
  { id: 1, title: 'Signal Genesis #001', status: 'verified', chain: 'DOGECHAIN', hash: '0x3f9a...c4e1', date: '2024-01-15' },
  { id: 2, title: 'Cipher Dreams Vol.1', status: 'verified', chain: 'DOGECHAIN', hash: '0x7b2d...a8f3', date: '2024-01-20' },
  { id: 3, title: 'Red Fang Session #7', status: 'pending', chain: 'DOGECHAIN', hash: '0x1c5e...d2b9', date: '2024-02-01' },
];

export default function IPAudits() {
  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1a1a1a', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link to={createPageUrl('NeonVault')} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666', textDecoration: 'none', fontSize: '13px', fontFamily: 'monospace' }}><ArrowLeft size={14} /> Neon Vault</Link>
        <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '10px', color: '#00ff88', letterSpacing: '0.15em' }}>IP AUDITS</span>
      </div>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 20px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <FileCheck size={20} style={{ color: '#00ff88' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'monospace' }}>IP Audits</h1>
        </div>
        <p style={{ fontSize: '13px', color: '#666', fontFamily: 'monospace', marginBottom: '24px' }}>Blockchain-verified intellectual property registry for all 33.3FM artists</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {AUDITS.map(a => (
            <div key={a.id} style={{ padding: '16px', borderRadius: '8px', border: `1px solid ${a.status === 'verified' ? '#00ff8830' : '#ffff0030'}`, background: '#0a0a0a' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontFamily: 'monospace', fontWeight: 700 }}>{a.title}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: a.status === 'verified' ? '#00ff88' : '#ffff00' }} />
                  <span style={{ fontSize: '9px', fontFamily: 'monospace', color: a.status === 'verified' ? '#00ff88' : '#ffff00', letterSpacing: '0.1em' }}>{a.status.toUpperCase()}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '10px', color: '#555', fontFamily: 'monospace' }}>
                <span>Chain: {a.chain}</span>
                <span>Hash: {a.hash}</span>
                <span>Date: {a.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
