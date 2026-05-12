import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Room3DWrapper } from '@/components/studio/Room3DWrapper';
import { ArrowLeft, Home, Star, Image, ShieldCheck, Music, Radio } from 'lucide-react';

const NFT_ITEMS = [
  { id: 1, title: 'Signal Genesis #001', artist: 'DJ Red Fang', type: 'Audio NFT', price: '0.5 ETH', color: '#ff0033', rarity: 'LEGENDARY' },
  { id: 2, title: 'Neon Cipher Vol.1', artist: 'NEURO META X', type: 'Visual NFT', price: '0.2 ETH', color: '#00ffff', rarity: 'RARE' },
  { id: 3, title: 'Labyrinth OST Fragment', artist: 'Bass Nomad', type: 'Audio NFT', price: '0.15 ETH', color: '#ffff00', rarity: 'UNCOMMON' },
  { id: 4, title: 'Vault33 Access Key', artist: 'VSS-33.3', type: 'Access NFT', price: '2.09 ETH', color: '#ff00ff', rarity: 'MYTHIC' },
  { id: 5, title: 'Red Fang Session #7', artist: 'DJ Red Fang', type: 'Audio NFT', price: '0.08 ETH', color: '#ff8800', rarity: 'COMMON' },
  { id: 6, title: 'Trinity Floor Pass', artist: 'VSS-33.3', type: 'Access NFT', price: '0.45 ETH', color: '#00ff88', rarity: 'RARE' },
];

const RARITY_COLORS = {
  MYTHIC: '#ff00ff',
  LEGENDARY: '#ff0033',
  RARE: '#00ffff',
  UNCOMMON: '#ffff00',
  COMMON: '#888',
};

export default function NeonVault() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? NFT_ITEMS : NFT_ITEMS.filter(n => n.type.toLowerCase().includes(filter));

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', position: 'relative' }}>
      <Room3DWrapper room="neon-vault" opacity={0.25} />

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
        <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '10px', color: '#00ffff', letterSpacing: '0.15em' }}>THE NEON VAULT</span>
      </div>

      <div style={{ paddingTop: '60px', maxWidth: '900px', margin: '0 auto', padding: '80px 20px 80px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
            <Radio size={16} style={{ color: '#ff0033', animation: 'pulse 2s infinite' }} />
            <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#ff0033', letterSpacing: '0.15em' }}>33.3 FM DOGECHAIN</span>
          </div>
          <h1 style={{ fontSize: '40px', fontWeight: 900, fontFamily: 'monospace', marginBottom: '12px' }}>
            The Neon <span style={{ color: '#00ffff', textShadow: '0 0 20px #00ffff80' }}>Vault</span> Museum
          </h1>
          <p style={{ fontSize: '14px', color: '#666', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
            Enter the cyberpunk sanctuary where holographic NFTs float in the void, powered by 33.3FM and secured by blockchain verification.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
            <Link to={createPageUrl('MintStudio')} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '10px 20px', borderRadius: '6px',
              background: '#ff0033', color: '#fff', fontFamily: 'monospace', fontSize: '13px',
              textDecoration: 'none', boxShadow: '0 0 16px #ff003340',
            }}>
              Mint Your NFT
            </Link>
            <Link to={createPageUrl('AudioTours')} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '10px 20px', borderRadius: '6px',
              border: '1px solid #00ffff', color: '#00ffff', fontFamily: 'monospace', fontSize: '13px',
              textDecoration: 'none',
            }}>
              Audio Tours
            </Link>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {['all', 'audio', 'visual', 'access'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 14px', borderRadius: '4px', cursor: 'pointer',
                border: `1px solid ${filter === f ? '#ff0033' : '#1a1a1a'}`,
                background: filter === f ? '#ff003310' : '#0a0a0a',
                color: filter === f ? '#ff0033' : '#666',
                fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.05em',
              }}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* NFT Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {filtered.map(nft => (
            <div key={nft.id} style={{
              borderRadius: '8px', border: `1px solid ${nft.color}30`,
              background: '#0a0a0a', overflow: 'hidden',
              transition: 'all 0.2s',
            }}>
              {/* NFT visual */}
              <div style={{
                aspectRatio: '1', background: `radial-gradient(circle at center, ${nft.color}20, #000)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderBottom: `1px solid ${nft.color}20`,
              }}>
                <div style={{
                  width: '60px', height: '60px',
                  border: `2px solid ${nft.color}`,
                  borderRadius: '4px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 20px ${nft.color}40`,
                }}>
                  {nft.type.includes('Audio') ? <Music size={24} style={{ color: nft.color }} /> : <Image size={24} style={{ color: nft.color }} />}
                </div>
              </div>
              <div style={{ padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, color: '#fff' }}>{nft.title}</span>
                  <span style={{ fontSize: '8px', fontFamily: 'monospace', color: RARITY_COLORS[nft.rarity], border: `1px solid ${RARITY_COLORS[nft.rarity]}`, padding: '1px 4px', borderRadius: '2px' }}>
                    {nft.rarity}
                  </span>
                </div>
                <div style={{ fontSize: '10px', color: '#666', fontFamily: 'monospace', marginBottom: '8px' }}>{nft.artist}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', fontFamily: 'monospace', color: nft.color, fontWeight: 700 }}>{nft.price}</span>
                  <button style={{
                    padding: '4px 10px', borderRadius: '3px', cursor: 'pointer',
                    background: `${nft.color}20`, border: `1px solid ${nft.color}60`,
                    color: nft.color, fontFamily: 'monospace', fontSize: '10px',
                  }}>
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
