import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Home, Shield, Zap, Crown, Lock, Check, Wallet, Mail } from 'lucide-react';
import XMRPayment from '@/components/monetization/XMRPayment';

const TIERS = [
  {
    id: 'creator',
    name: 'Creator',
    price: '$9.99/mo',
    xmrPrice: '0.065 XMR',
    icon: Zap,
    color: '#00ffff',
    features: ['Full recording access', 'Basic mixing tools', '5 exports/month', 'Signal Booth', 'Standard support'],
  },
  {
    id: 'producer',
    name: 'Producer',
    price: '$29.99/mo',
    xmrPrice: '0.195 XMR',
    icon: Crown,
    color: '#ff0033',
    features: ['Full studio access', 'Unlimited exports', 'NFT minting rights', 'Priority playlists', 'Private control room', 'Zero platform fee'],
    featured: true,
  },
  {
    id: 'syndicate',
    name: 'Syndicate',
    price: 'Vault33 Key',
    xmrPrice: 'Contact',
    icon: Shield,
    color: '#ff00ff',
    features: ['All Producer features', 'Exclusive rooms', 'Cipher-based tools', 'Labyrinth OST access', 'VIP support'],
  },
];

export default function AccessGate() {
  const [selected, setSelected] = useState('producer');
  const [authMethod, setAuthMethod] = useState('wallet');
  const [showXMR, setShowXMR] = useState(false);

  const selectedTier = TIERS.find(t => t.id === selected);

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
        <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '10px', color: '#ff0033', letterSpacing: '0.15em' }}>ACCESS GATE</span>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Shield size={32} style={{ color: '#ff0033', margin: '0 auto 16px' }} />
          <h1 style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'monospace', marginBottom: '8px' }}>Access Gate</h1>
          <p style={{ fontSize: '13px', color: '#666', fontFamily: 'monospace' }}>Choose your tier to unlock the Virtual Signal Studio</p>
        </div>

        {/* Tier cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
          {TIERS.map(tier => {
            const Icon = tier.icon;
            const isSelected = selected === tier.id;
            return (
              <div
                key={tier.id}
                onClick={() => setSelected(tier.id)}
                style={{
                  padding: '20px', borderRadius: '8px', cursor: 'pointer',
                  border: `1px solid ${isSelected ? tier.color : '#1a1a1a'}`,
                  background: isSelected ? `${tier.color}08` : '#0a0a0a',
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? `0 0 16px ${tier.color}30` : 'none',
                  position: 'relative',
                }}
              >
                {tier.featured && (
                  <div style={{
                    position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
                    padding: '2px 10px', borderRadius: '10px',
                    background: tier.color, color: '#000',
                    fontSize: '9px', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.1em',
                  }}>POPULAR</div>
                )}
                <Icon size={20} style={{ color: tier.color, marginBottom: '8px' }} />
                <div style={{ fontSize: '14px', fontFamily: 'monospace', fontWeight: 700, marginBottom: '4px' }}>{tier.name}</div>
                <div style={{ fontSize: '16px', color: tier.color, fontFamily: 'monospace', fontWeight: 700, marginBottom: '12px' }}>{tier.price}</div>
                <div style={{ fontSize: '10px', color: '#555', fontFamily: 'monospace', marginBottom: '12px' }}>
                  or {tier.xmrPrice} XMR <span style={{ color: '#00ff88' }}>(10% off)</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {tier.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#aaa', fontFamily: 'monospace' }}>
                      <Check size={10} style={{ color: tier.color }} /> {f}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Auth method */}
        <div style={{ padding: '24px', borderRadius: '8px', border: '1px solid #1a1a1a', background: '#0a0a0a', marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: '16px' }}>
            CONNECT TO {selectedTier?.name.toUpperCase()}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {['wallet', 'email'].map(method => (
              <button
                key={method}
                onClick={() => setAuthMethod(method)}
                style={{
                  flex: 1, padding: '10px', borderRadius: '4px', cursor: 'pointer',
                  border: `1px solid ${authMethod === method ? selectedTier?.color || '#ff0033' : '#333'}`,
                  background: authMethod === method ? `${selectedTier?.color || '#ff0033'}10` : '#111',
                  color: authMethod === method ? '#fff' : '#666',
                  fontFamily: 'monospace', fontSize: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}
              >
                {method === 'wallet' ? <Wallet size={14} /> : <Mail size={14} />}
                {method === 'wallet' ? 'Connect Wallet' : 'Email'}
              </button>
            ))}
          </div>
          <button style={{
            width: '100%', padding: '14px', borderRadius: '6px',
            background: selectedTier?.color || '#ff0033', border: 'none', cursor: 'pointer',
            color: '#000', fontFamily: 'monospace', fontSize: '13px', fontWeight: 700,
            boxShadow: `0 0 16px ${selectedTier?.color || '#ff0033'}40`,
          }}>
            {authMethod === 'wallet' ? 'Connect & Subscribe' : 'Continue with Email'}
          </button>
        </div>

        {/* XMR payment option */}
        <button
          onClick={() => setShowXMR(!showXMR)}
          style={{
            width: '100%', padding: '12px', borderRadius: '6px', cursor: 'pointer',
            border: '1px solid #ff8800', background: '#ff880008',
            color: '#ff8800', fontFamily: 'monospace', fontSize: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          Pay with XMR (Monero) — 10% privacy discount
        </button>
        {showXMR && selectedTier && (
          <div style={{ marginTop: '12px' }}>
            <XMRPayment
              amount={selectedTier.id === 'creator' ? 9.99 : selectedTier.id === 'producer' ? 29.99 : 0}
              description={`${selectedTier.name} tier — monthly subscription`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
