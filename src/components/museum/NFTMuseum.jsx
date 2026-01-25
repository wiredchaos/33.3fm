import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import SplineScene from '@/components/3d/SplineScene';
import NFTCollectionImporter from './NFTCollectionImporter';
import { Package, Plus, Eye, Music, Play, Pause, Volume2, Edit3, Palette, Grid3x3, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export default function NFTMuseum() {
  const [nfts, setNfts] = useState([]);
  const [showImporter, setShowImporter] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [editMode, setEditMode] = useState(false);
  const [museumTheme, setMuseumTheme] = useState('modern');
  const [showCustomizer, setShowCustomizer] = useState(false);
  const audioRef = useRef(null);

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

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const updateNFTPosition = async (nftId, position) => {
    try {
      await base44.entities.PhygitalItem.update(nftId, {
        display_position: position
      });
      loadNFTs();
    } catch (error) {
      console.error('Failed to update position');
    }
  };

  const saveMuseumTheme = async () => {
    try {
      await base44.auth.updateMe({
        museum_theme: museumTheme
      });
    } catch (error) {
      console.error('Failed to save theme');
    }
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

          <div className="flex gap-2">
            <Button
              onClick={() => setEditMode(!editMode)}
              variant="outline"
              className={`backdrop-blur-xl border-white/20 ${editMode ? 'bg-cyan-400 text-black' : 'bg-black/60 text-white'}`}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {editMode ? 'Done' : 'Arrange'}
            </Button>
            <Button
              onClick={() => setShowCustomizer(true)}
              variant="outline"
              className="backdrop-blur-xl bg-black/60 border-white/20 text-white"
            >
              <Palette className="w-4 h-4 mr-2" />
              Customize
            </Button>
            <Button
              onClick={() => setShowImporter(true)}
              className="backdrop-blur-xl bg-gradient-to-r from-cyan-400 to-purple-600 hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Import
            </Button>
          </div>
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
                    className={`group cursor-pointer ${editMode ? 'animate-pulse' : ''}`}
                  >
                    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-3 hover:border-cyan-400/50 transition-all relative">
                      {editMode && (
                        <div className="absolute top-2 right-2 z-10 bg-cyan-400 text-black rounded-full p-1">
                          <Grid3x3 className="w-3 h-3" />
                        </div>
                      )}
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
                      {nft.metadata?.audio_url && (
                        <div className="mt-2 flex items-center gap-1">
                          <Music className="w-3 h-3 text-purple-400" />
                          <span className="text-[10px] text-purple-400">Audio</span>
                        </div>
                      )}
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
              onClick={() => {
                setSelectedNFT(null);
                setIsPlaying(false);
                if (audioRef.current) audioRef.current.pause();
              }}
              className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-10"
            >
              ×
            </button>
            <div className="flex gap-6">
              {selectedNFT.model_url && (
                <div className="relative">
                  <img
                    src={selectedNFT.model_url}
                    alt={selectedNFT.item_name}
                    className="w-64 h-64 object-cover rounded-xl"
                    onError={(e) => e.target.style.display = 'none'}
                    loading="lazy"
                  />
                  {selectedNFT.metadata?.audio_url && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={togglePlayback}
                        className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                      >
                        {isPlaying ? (
                          <Pause className="w-8 h-8 text-white" />
                        ) : (
                          <Play className="w-8 h-8 text-white ml-1" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-light text-white mb-2">{selectedNFT.item_name}</h2>
                <p className="text-sm text-cyan-400 mb-4">Token #{selectedNFT.metadata?.token_id}</p>
                <p className="text-sm text-white/60 mb-4">{selectedNFT.metadata?.description}</p>
                
                {/* Audio Player */}
                {selectedNFT.metadata?.audio_url && (
                  <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-cyan-400/10 border border-purple-400/30">
                    <div className="flex items-center gap-3 mb-3">
                      <button
                        onClick={togglePlayback}
                        className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center hover:bg-purple-600 transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 text-white" />
                        ) : (
                          <Play className="w-5 h-5 text-white ml-0.5" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Volume2 className="w-4 h-4 text-white/60" />
                          <Slider
                            value={[volume * 100]}
                            onValueChange={([v]) => setVolume(v / 100)}
                            max={100}
                            step={1}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                    <audio
                      ref={audioRef}
                      src={selectedNFT.metadata?.audio_url}
                      onEnded={() => setIsPlaying(false)}
                    />
                  </div>
                )}
                
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

      {/* Museum Customizer */}
      {showCustomizer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="relative max-w-md w-full backdrop-blur-xl bg-black/80 border border-cyan-400/30 rounded-2xl p-6">
            <button
              onClick={() => setShowCustomizer(false)}
              className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-10"
            >
              ×
            </button>
            <h2 className="text-xl font-light text-white mb-6 flex items-center gap-2">
              <Palette className="w-5 h-5 text-cyan-400" />
              Museum Customization
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/60 uppercase tracking-wider mb-3 block">
                  Theme
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['modern', 'classical', 'neon', 'minimal'].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setMuseumTheme(theme)}
                      className={`py-3 rounded-lg border transition-all capitalize ${
                        museumTheme === theme
                          ? 'bg-gradient-to-r from-cyan-400 to-purple-600 border-transparent text-white'
                          : 'bg-white/5 border-white/10 text-white/60 hover:border-cyan-400/30'
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => {
                  saveMuseumTheme();
                  setShowCustomizer(false);
                }}
                className="w-full bg-gradient-to-r from-cyan-400 to-purple-600"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}