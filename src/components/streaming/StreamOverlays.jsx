import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Layers, Download, Eye, Settings } from 'lucide-react';

export default function StreamOverlays() {
  const [selectedOverlay, setSelectedOverlay] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  const { data: purchases = [] } = useQuery({
    queryKey: ['purchases'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Purchase.filter({ user_email: user.email });
    },
  });

  const { data: items = [] } = useQuery({
    queryKey: ['virtualItems'],
    queryFn: () => base44.entities.VirtualItem.list(),
  });

  const overlayItems = items.filter(item => 
    item.category === 'visual_effect' && 
    purchases.some(p => p.item_id === item.id)
  );

  const overlayTemplates = [
    {
      id: 'minimal',
      name: 'Minimal Frame',
      preview: 'border-2 border-cyan-400/50 rounded-lg',
      free: true
    },
    {
      id: 'neon',
      name: 'Neon Border',
      preview: 'border-4 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] rounded-lg',
      free: false
    },
    {
      id: 'hologram',
      name: 'Hologram',
      preview: 'border-2 border-cyan-400 bg-gradient-to-br from-cyan-400/10 to-purple-600/10 backdrop-blur-sm rounded-lg',
      free: false
    },
    {
      id: 'particle',
      name: 'Particle Effect',
      preview: 'border-2 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.4)] rounded-lg',
      free: false
    }
  ];

  const downloadOverlayConfig = (overlay) => {
    const config = {
      name: overlay.name,
      css: overlay.preview,
      obs_settings: {
        browser_source: `https://33.3fm.app/overlay/${overlay.id}`,
        width: 1920,
        height: 1080,
        fps: 60
      },
      streamlabs_compatible: true,
      instructions: 'Add as Browser Source in OBS/Streamlabs'
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${overlay.id}_overlay_config.json`;
    a.click();
  };

  return (
    <div className="backdrop-blur-xl bg-black/80 border border-cyan-400/30 rounded-2xl p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-red-500/20 flex items-center justify-center">
            <Layers className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-light text-white">Stream Overlays</h2>
            <p className="text-sm text-white/60">Customize your broadcast appearance</p>
          </div>
        </div>
        <Button
          onClick={() => setPreviewMode(!previewMode)}
          variant="outline"
          size="sm"
          className="border-cyan-400/30 text-cyan-400"
        >
          <Eye className="w-4 h-4 mr-2" />
          {previewMode ? 'Hide' : 'Preview'}
        </Button>
      </div>

      {/* Overlay Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {overlayTemplates.map((overlay) => {
          const isOwned = overlay.free || overlayItems.some(item => 
            item.name.toLowerCase().includes(overlay.id)
          );

          return (
            <div
              key={overlay.id}
              className={`backdrop-blur-md bg-white/5 border rounded-xl p-4 transition-all cursor-pointer ${
                selectedOverlay?.id === overlay.id
                  ? 'border-cyan-400 shadow-lg shadow-cyan-400/20'
                  : 'border-white/10 hover:border-cyan-400/50'
              }`}
              onClick={() => setSelectedOverlay(overlay)}
            >
              {/* Preview Frame */}
              <div className={`w-full aspect-video ${overlay.preview} mb-3 flex items-center justify-center`}>
                <div className="text-white/60 text-sm">Overlay Preview</div>
              </div>

              {/* Overlay Info */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">{overlay.name}</h3>
                  <div className="text-xs text-white/60">
                    {overlay.free ? 'Free' : 'Premium'} • OBS Compatible
                  </div>
                </div>
                {isOwned ? (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadOverlayConfig(overlay);
                    }}
                    className="bg-cyan-400 hover:bg-cyan-500 text-black"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                ) : (
                  <div className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs">
                    Locked
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Preview */}
      {previewMode && selectedOverlay && (
        <div className="backdrop-blur-md bg-black/60 border border-cyan-400/30 rounded-xl p-6">
          <div className="text-sm text-white/80 mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Live Preview: {selectedOverlay.name}
          </div>
          <div className={`w-full aspect-video ${selectedOverlay.preview} flex items-center justify-center relative`}>
            <div className="absolute top-4 left-4 backdrop-blur-md bg-black/60 rounded-lg px-3 py-2">
              <div className="text-cyan-400 text-sm font-medium">33.3FM LIVE</div>
              <div className="text-white/60 text-xs">Now Playing: Electronic Vibes</div>
            </div>
            <div className="text-6xl text-white/20">🎵</div>
            <div className="absolute bottom-4 left-4 right-4 backdrop-blur-md bg-black/60 rounded-lg p-3">
              <div className="text-white text-sm">Chat messages appear here...</div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 rounded-lg bg-cyan-400/10 border border-cyan-400/30">
        <div className="text-xs text-cyan-400 mb-1 font-medium">Setup Instructions:</div>
        <ol className="text-xs text-white/70 space-y-1 ml-4 list-decimal">
          <li>Purchase overlay from Virtual Store</li>
          <li>Click "Export" to download OBS config</li>
          <li>Add as Browser Source in OBS/Streamlabs</li>
          <li>Customize position and size as needed</li>
        </ol>
      </div>
    </div>
  );
}