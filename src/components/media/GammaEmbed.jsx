import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

export default function GammaEmbed({ url, onUrlChange }) {
  const [gammaUrl, setGammaUrl] = useState(url || '');
  const [embedUrl, setEmbedUrl] = useState('');

  const handleLoadGamma = () => {
    let embed = gammaUrl;
    
    // Convert Gamma.app URLs to embed format
    if (gammaUrl.includes('gamma.app/docs/')) {
      embed = gammaUrl.replace('/docs/', '/embed/');
    }
    
    setEmbedUrl(embed);
    if (onUrlChange) onUrlChange(embed);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Gamma presentation URL (gamma.app/docs/...)"
          value={gammaUrl}
          onChange={(e) => setGammaUrl(e.target.value)}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
        />
        <Button
          onClick={handleLoadGamma}
          className="bg-cyan-400 hover:bg-cyan-500 text-black"
        >
          <FileText className="w-4 h-4" />
        </Button>
      </div>

      {embedUrl ? (
        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="aspect-video rounded-xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-sm text-white/40">Enter a Gamma URL above</p>
          </div>
        </div>
      )}
    </div>
  );
}