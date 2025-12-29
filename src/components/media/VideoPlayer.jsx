import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

export default function VideoPlayer({ url, onUrlChange }) {
  const [videoUrl, setVideoUrl] = useState(url || '');
  const [embedUrl, setEmbedUrl] = useState('');

  const handleLoadVideo = () => {
    let embed = videoUrl;
    
    // Convert YouTube URLs
    if (videoUrl.includes('youtube.com/watch')) {
      const videoId = new URL(videoUrl).searchParams.get('v');
      embed = `https://www.youtube.com/embed/${videoId}`;
    } else if (videoUrl.includes('youtu.be/')) {
      const videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
      embed = `https://www.youtube.com/embed/${videoId}`;
    }
    // Convert Vimeo URLs
    else if (videoUrl.includes('vimeo.com/')) {
      const videoId = videoUrl.split('vimeo.com/')[1].split('?')[0];
      embed = `https://player.vimeo.com/video/${videoId}`;
    }
    
    setEmbedUrl(embed);
    if (onUrlChange) onUrlChange(embed);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="YouTube, Vimeo, or direct video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
        />
        <Button
          onClick={handleLoadVideo}
          className="bg-cyan-400 hover:bg-cyan-500 text-black"
        >
          <Play className="w-4 h-4" />
        </Button>
      </div>

      {embedUrl ? (
        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="aspect-video rounded-xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center">
          <div className="text-center">
            <Play className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-sm text-white/40">Enter a video URL above</p>
          </div>
        </div>
      )}
    </div>
  );
}