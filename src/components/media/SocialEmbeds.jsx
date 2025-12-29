import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Music, Play } from 'lucide-react';

export default function SocialEmbeds({ type, onUrlChange }) {
  const [url, setUrl] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');

  const handleLoad = () => {
    let embed = url;
    
    if (type === 'spotify') {
      // Convert Spotify URLs: track, album, playlist
      if (url.includes('spotify.com/track/')) {
        const trackId = url.split('track/')[1].split('?')[0];
        embed = `https://open.spotify.com/embed/track/${trackId}`;
      } else if (url.includes('spotify.com/album/')) {
        const albumId = url.split('album/')[1].split('?')[0];
        embed = `https://open.spotify.com/embed/album/${albumId}`;
      } else if (url.includes('spotify.com/playlist/')) {
        const playlistId = url.split('playlist/')[1].split('?')[0];
        embed = `https://open.spotify.com/embed/playlist/${playlistId}`;
      }
    } else if (type === 'apple') {
      // Apple Music embed
      if (url.includes('music.apple.com')) {
        embed = url.replace('music.apple.com', 'embed.music.apple.com');
      }
    } else if (type === 'soundcloud') {
      // SoundCloud embed
      embed = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%2300ffff&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;
    } else if (type === 'twitter') {
      // Twitter/X embed
      embed = `https://platform.twitter.com/embed/Tweet.html?url=${encodeURIComponent(url)}`;
    } else if (type === 'instagram') {
      // Instagram embed
      embed = `${url}embed/`;
    }
    
    setEmbedUrl(embed);
    if (onUrlChange) onUrlChange(embed);
  };

  const placeholders = {
    spotify: 'Spotify track, album, or playlist URL',
    apple: 'Apple Music URL',
    soundcloud: 'SoundCloud track URL',
    twitter: 'Twitter/X post URL',
    instagram: 'Instagram post URL'
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder={placeholders[type] || 'Enter URL'}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
        />
        <Button
          onClick={handleLoad}
          className="bg-cyan-400 hover:bg-cyan-500 text-black"
        >
          <Play className="w-4 h-4" />
        </Button>
      </div>

      {embedUrl ? (
        <div className={`relative ${type === 'spotify' || type === 'soundcloud' ? 'h-80' : 'aspect-video'} rounded-xl overflow-hidden border border-white/10`}>
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="h-80 rounded-xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center">
          <div className="text-center">
            <Music className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-sm text-white/40">Enter a {type} URL above</p>
          </div>
        </div>
      )}
    </div>
  );
}