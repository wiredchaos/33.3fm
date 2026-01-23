import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import SplineScene from '@/components/3d/SplineScene';
import NFTCollectionImporter from './NFTCollectionImporter';
import { Package, Plus, Eye, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NFTMuseum() {
  const [nfts, setNfts] = useState([]);
  const [showImporter, setShowImporter] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);

  useEffect(() => {
    loadNFTs();
  }, []);

  const loadNFTs = async () => {
    try {
      const user = await base44.auth.me();
      const items = await base44.entities.PhygitalItem.filter({ 
        user_email: user.email,
        'metadata.nft_type': 'music'
      });
      setNfts(items);
    } catch (error) {
      console.error('Failed to load NFTs');
    }
  };

  const handleImportComplete = (items) => {
    setNfts([...nfts, ...items]);
    setShowImporter(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Spline 3D Museum Scene */}
      <div className="absolute inset-0">
        <SplineScene 
          scene="https://prod.spline.design/your-museum-scene-url/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 pointer-events-none">
        {/* Top Bar */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-auto">
          <div className="backdrop-blur-xl bg-black/60 border border-cyan-400/30 rounded-xl px-4 py-3">
            <div className="flex items-center gap-3">
              <Music className="w-6 h-6 text-cyan-400" />
              <div>
                <h1 className="text-xl font-light text-white">NFT Music Museum</h1>
                <p className="text-xs text-white/60">{nfts.length} Music NFTs</p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setShowImporter(true)}
            className="backdrop-blur-xl bg-gradient-to-r from-cyan-400 to-purple-600 hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Import Collection
          </Button>
        </div>

        {/* NFT Grid */}
        <div className="absolute bottom-6 left-6 right-6 pointer-events-auto">
          <div className="backdrop-blur-xl bg-black/60 border border-cyan-400/30 rounded-2xl p-6 max-h-64 overflow-y-auto">
            {nfts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/60 mb-4">No music NFTs in your collection yet</p>
                <Button
                  onClick={() => setShowImporter(true)}
                  variant="outline"
                  className="border-cyan-400/30 text-cyan-400"
                >
                  Import Your First Collection
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {nfts.map((nft) => (
                  <div
                    key={nft.id}
                    onClick={() => setSelectedNFT(nft)}
                    className="group cursor-pointer"
                  >
                    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-3 hover:border-cyan-400/50 transition-all">
                      {nft.model_url && (
                        <img
                          src={nft.model_url}
                          alt={nft.item_name}
                          className="w-full h-32 object-cover rounded-lg mb-2"
                          onError={(e) => e.target.style.display = 'none'}
                          loading="lazy"
                        />
                      )}
                      <p className="text-xs text-white font-medium truncate">{nft.item_name}</p>
                      <p className="text-[10px] text-cyan-400">#{nft.metadata?.token_id}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NFT Importer Modal */}
      {showImporter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="relative max-w-2xl w-full">
            <button
              onClick={() => setShowImporter(false)}
              className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-10"
            >
              ×
            </button>
            <NFTCollectionImporter onImportComplete={handleImportComplete} />
          </div>
        </div>
      )}

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm px-4">
          <div className="relative max-w-2xl w-full backdrop-blur-xl bg-black/80 border border-cyan-400/30 rounded-2xl p-6">
            <button
              onClick={() => setSelectedNFT(null)}
              className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-10"
            >
              ×
            </button>
            <div className="flex gap-6">
              {selectedNFT.model_url && (
                <img
                  src={selectedNFT.model_url}
                  alt={selectedNFT.item_name}
                  className="w-64 h-64 object-cover rounded-xl"
                  onError={(e) => e.target.style.display = 'none'}
                  loading="lazy"
                />
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-light text-white mb-2">{selectedNFT.item_name}</h2>
                <p className="text-sm text-cyan-400 mb-4">Token #{selectedNFT.metadata?.token_id}</p>
                <p className="text-sm text-white/60 mb-4">{selectedNFT.metadata?.description}</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/40">Collection:</span>
                    <span className="text-white">{selectedNFT.metadata?.collection}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Platform:</span>
                    <span className="text-white capitalize">{selectedNFT.metadata?.platform}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}