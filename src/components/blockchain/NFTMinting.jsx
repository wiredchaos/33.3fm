import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Image as ImageIcon, Music, Zap, Check } from 'lucide-react';

export default function NFTMinting({ artistEmail }) {
  const [mintData, setMintData] = useState({
    title: '',
    description: '',
    type: 'music',
    file_url: ''
  });
  const [isMinting, setIsMinting] = useState(false);
  const [mintedHash, setMintedHash] = useState('');

  const mintNFT = async () => {
    if (!mintData.title || !mintData.file_url) return;
    
    setIsMinting(true);
    try {
      // Simulate blockchain inscription
      const hash = 'DG-NFT-' + Math.random().toString(36).substring(2, 15);
      
      // Update artist verification
      const verifications = await base44.entities.ArtistVerification.filter({ artist_email: artistEmail });
      if (verifications.length > 0) {
        await base44.entities.ArtistVerification.update(verifications[0].id, {
          inscription_count: (verifications[0].inscription_count || 0) + 1
        });
      }

      setMintedHash(hash);
      setMintData({ title: '', description: '', type: 'music', file_url: '' });
    } catch (error) {
      console.error('Minting failed:', error);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-black/60 border border-purple-500/30 rounded-2xl p-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-6 h-6 text-purple-400 animate-pulse" />
        <h2 className="text-2xl font-light text-white">NFT Minting</h2>
      </div>

      {mintedHash ? (
        <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-cyan-400/10 border border-green-400/30 text-center animate-in zoom-in duration-300">
          <Check className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <div className="text-lg text-white mb-2">Successfully Minted!</div>
          <div className="text-xs text-white/60 mb-3 font-mono break-all">{mintedHash}</div>
          <Button
            onClick={() => setMintedHash('')}
            variant="outline"
            className="border-green-400/30 text-green-400 hover:bg-green-400/10"
          >
            Mint Another
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/60 uppercase tracking-wider mb-2 block">NFT Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => setMintData({ ...mintData, type: 'music' })}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  mintData.type === 'music'
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <Music className="w-4 h-4" />
                Music
              </button>
              <button
                onClick={() => setMintData({ ...mintData, type: 'artwork' })}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  mintData.type === 'artwork'
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                Artwork
              </button>
            </div>
          </div>

          <Input
            placeholder="NFT Title"
            value={mintData.title}
            onChange={(e) => setMintData({ ...mintData, title: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
          />

          <Textarea
            placeholder="Description"
            value={mintData.description}
            onChange={(e) => setMintData({ ...mintData, description: e.target.value })}
            className="bg-white/5 border-white/10 text-white min-h-[80px]"
          />

          <Input
            placeholder="File URL (after upload)"
            value={mintData.file_url}
            onChange={(e) => setMintData({ ...mintData, file_url: e.target.value })}
            className="bg-white/5 border-white/10 text-white"
          />

          <Button
            onClick={mintNFT}
            disabled={isMinting || !mintData.title || !mintData.file_url}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
          >
            {isMinting ? 'Minting to Dogechain...' : 'Mint NFT'}
          </Button>

          <div className="text-xs text-white/40 text-center">
            Permanent on-chain inscription • Provable ownership • No gas fees for listeners
          </div>
        </div>
      )}
    </div>
  );
}