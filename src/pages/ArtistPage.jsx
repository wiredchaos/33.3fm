import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Music, ExternalLink, ArrowLeft, ArrowRight, Radio, Home } from 'lucide-react';

const DEMO_ARTIST = {
  name: 'Demo Artist',
  slug: 'demo-artist',
  image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
  bio: 'Independent artist creating meaningful music. Currently featured on 33.3FM DOGECHAIN.',
  spotifyArtistId: '3TVXtAsR1Inumwj472S9r4', // Drake as placeholder
  youtubeId: 'dQw4w9WgXcQ',
  socials: {
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
  },
};

export default function ArtistPage() {
  const { slug } = useParams();
  const artist = DEMO_ARTIST; // In production, fetch by slug
  const [spotifyLoaded, setSpotifyLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff' }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1a1a1a',
        padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <Link to={createPageUrl('VirtualSignalStudio')} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          color: '#666', textDecoration: 'none', fontSize: '13px', fontFamily: 'monospace',
        }}>
          <ArrowLeft size={14} /> Back
        </Link>
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          color: '#666', textDecoration: 'none', fontSize: '13px', fontFamily: 'monospace', marginLeft: '4px',
        }}>
          <Home size={14} />
        </Link>
        <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '10px', color: '#555', letterSpacing: '0.15em' }}>
          5∞8∞9 MUS8C broadcasting on 33.3FM DOGECHAIN
        </span>
      </div>

      {/* Section label */}
      <div style={{
        borderBottom: '1px solid #1a1a1a', background: '#0a0a0a',
        padding: '10px 16px',
      }}>
        <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#aaa', letterSpacing: '0.1em' }}>
          FREE — Artist Page
        </span>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 16px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>

          {/* Artist Info Column */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr)', gap: '32px' }}>
            <div>
              <img
                src={artist.image}
                alt={artist.name}
                style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }}
              />
              <h2 style={{ fontSize: '28px', fontWeight: 300, marginBottom: '8px' }}>{artist.name}</h2>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '4px 10px', borderRadius: '20px',
                border: '1px solid #00ffff', color: '#00ffff',
                fontSize: '11px', fontFamily: 'monospace', marginBottom: '16px',
              }}>
                <Music size={11} /> Featured on 33.3FM
              </div>
              <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.7, marginBottom: '20px' }}>{artist.bio}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {artist.socials.instagram && (
                  <a href={artist.socials.instagram} target="_blank" rel="noopener noreferrer" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    padding: '6px 12px', borderRadius: '4px',
                    border: '1px solid #333', color: '#aaa',
                    fontSize: '12px', fontFamily: 'monospace', textDecoration: 'none',
                  }}>
                    Instagram <ExternalLink size={11} />
                  </a>
                )}
                {artist.socials.twitter && (
                  <a href={artist.socials.twitter} target="_blank" rel="noopener noreferrer" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    padding: '6px 12px', borderRadius: '4px',
                    border: '1px solid #333', color: '#aaa',
                    fontSize: '12px', fontFamily: 'monospace', textDecoration: 'none',
                  }}>
                    Twitter <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>

            {/* Media Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Spotify Embed */}
              <div style={{
                borderRadius: '8px', border: '1px solid #1a1a1a',
                background: '#0a0a0a', overflow: 'hidden',
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #1a1a1a' }}>
                  <span style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace' }}>Listen on Spotify</span>
                </div>
                <div style={{ padding: '12px' }}>
                  {!spotifyLoaded ? (
                    <div
                      onClick={() => setSpotifyLoaded(true)}
                      style={{
                        aspectRatio: '16/9', background: '#111', borderRadius: '6px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', border: '1px dashed #333',
                        flexDirection: 'column', gap: '8px',
                      }}
                    >
                      <Music size={32} style={{ color: '#1DB954' }} />
                      <span style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>Click to load Spotify player</span>
                    </div>
                  ) : (
                    <iframe
                      src={`https://open.spotify.com/embed/artist/${artist.spotifyArtistId}?utm_source=generator&theme=0`}
                      width="100%"
                      height="352"
                      frameBorder="0"
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      style={{ borderRadius: '6px' }}
                    />
                  )}
                </div>
              </div>

              {/* YouTube Embed */}
              <div style={{
                borderRadius: '8px', border: '1px solid #1a1a1a',
                background: '#0a0a0a', overflow: 'hidden',
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #1a1a1a' }}>
                  <span style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace' }}>Featured Video</span>
                </div>
                <div style={{ padding: '12px' }}>
                  {!videoLoaded ? (
                    <div
                      onClick={() => setVideoLoaded(true)}
                      style={{
                        aspectRatio: '16/9', background: '#111', borderRadius: '6px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', border: '1px dashed #333',
                        flexDirection: 'column', gap: '8px',
                      }}
                    >
                      <Radio size={32} style={{ color: '#ff0033' }} />
                      <span style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>Click to load video</span>
                    </div>
                  ) : (
                    <iframe
                      src={`https://www.youtube.com/embed/${artist.youtubeId}?autoplay=1`}
                      width="100%"
                      style={{ aspectRatio: '16/9', borderRadius: '6px' }}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
              </div>

              {/* Educational callout */}
              <div style={{
                padding: '20px', borderRadius: '8px',
                border: '1px solid #00ffff20', background: '#00ffff05',
              }}>
                <p style={{ fontSize: '14px', color: '#ccc', lineHeight: 1.7, fontStyle: 'italic' }}>
                  Your music lives on platforms you don't control — yet.
                </p>
              </div>

              {/* Upgrade CTA */}
              <div style={{
                padding: '24px', borderRadius: '8px',
                border: '1px solid #ff003330', background: '#ff003308',
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '8px' }}>
                  Ready for your own broadcast room?
                </h3>
                <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px', lineHeight: 1.6 }}>
                  Upgrade to a 3D broadcast environment with persistent audio and artist-owned identity.
                </p>
                <Link to={createPageUrl('BroadcastPortal')} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '12px 20px', borderRadius: '6px',
                  background: '#ff0033', color: '#fff',
                  fontSize: '13px', fontFamily: 'monospace', fontWeight: 700,
                  textDecoration: 'none', boxShadow: '0 0 16px #ff003340',
                }}>
                  Upgrade to 3D Broadcast Room <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
