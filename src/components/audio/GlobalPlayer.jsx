import React, { useState, useRef, useEffect } from 'react';
import {
  Play, Pause, ChevronUp, ChevronDown, Volume2, VolumeX,
  SlidersHorizontal, Radio, Music, Mic, Disc3, Library, X
} from 'lucide-react';

/**
 * GlobalPlayer — Persistent floating audio player
 * Ported from wiredchaos/v0-use-wcmhub-v-1-0 with PR #35 hydration fix applied.
 * Features: 5-station switcher, EQ (bass/mid/treble), Spotify embeds,
 * live waveform visualizer, mute/volume controls.
 */
export default function GlobalPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLive] = useState(true);
  const [volume, setVolume] = useState(0.9);
  const [showEQ, setShowEQ] = useState(false);
  const [eqBass, setEqBass] = useState(0);
  const [eqMid, setEqMid] = useState(0);
  const [eqTreble, setEqTreble] = useState(0);
  const [showStations, setShowStations] = useState(false);
  const [selectedStation, setSelectedStation] = useState('live');
  const [showSpotifyEmbed, setShowSpotifyEmbed] = useState(false);
  const [spotifyUrl, setSpotifyUrl] = useState('');

  const stations = [
    {
      id: 'live',
      name: 'LIVE BROADCAST',
      frequency: '33.3',
      icon: Radio,
      color: 'text-red-400',
      spotifyEmbed:
        'https://open.spotify.com/embed/playlist/34HMPdg2ywHWz0EmCE64yo?utm_source=generator&theme=0',
    },
    {
      id: 'ambient',
      name: 'AMBIENT ZONE',
      frequency: '88.8',
      icon: Music,
      color: 'text-cyan-400',
      spotifyEmbed:
        'https://open.spotify.com/embed/playlist/37i9dQZF1DX4wta20PHgwo?utm_source=generator&theme=0',
    },
    {
      id: 'covers',
      name: 'LIVE COVERS',
      frequency: '99.9',
      icon: Mic,
      color: 'text-purple-400',
      spotifyEmbed:
        'https://open.spotify.com/embed/playlist/37i9dQZF1DWVFeEut75IAL?utm_source=generator&theme=0',
    },
    {
      id: 'beats',
      name: 'PRODUCER BEATS',
      frequency: '44.4',
      icon: Disc3,
      color: 'text-orange-400',
      spotifyEmbed:
        'https://open.spotify.com/embed/playlist/37i9dQZF1DX0XUsuxWHRQd?utm_source=generator&theme=0',
    },
    {
      id: 'archive',
      name: 'VAULT ARCHIVE',
      frequency: '55.5',
      icon: Library,
      color: 'text-lime-400',
      spotifyEmbed:
        'https://open.spotify.com/embed/playlist/37i9dQZF1DX4dyzvuaRJ0n?utm_source=generator&theme=0',
    },
  ];

  const currentStation = stations.find((s) => s.id === selectedStation) || stations[0];

  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);
  const bassFilterRef = useRef(null);
  const midFilterRef = useRef(null);
  const trebleFilterRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = ctx;

        const bass = ctx.createBiquadFilter();
        bass.type = 'lowshelf';
        bass.frequency.value = 200;
        bassFilterRef.current = bass;

        const mid = ctx.createBiquadFilter();
        mid.type = 'peaking';
        mid.frequency.value = 1000;
        mid.Q.value = 1;
        midFilterRef.current = mid;

        const treble = ctx.createBiquadFilter();
        treble.type = 'highshelf';
        treble.frequency.value = 3000;
        trebleFilterRef.current = treble;

        const gain = ctx.createGain();
        gain.gain.value = 0.9;
        gainNodeRef.current = gain;
      } catch (e) {
        console.warn('[GlobalPlayer] Audio engine init failed:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (gainNodeRef.current) gainNodeRef.current.gain.value = isMuted ? 0 : volume;
    if (bassFilterRef.current) bassFilterRef.current.gain.value = eqBass;
    if (midFilterRef.current) midFilterRef.current.gain.value = eqMid;
    if (trebleFilterRef.current) trebleFilterRef.current.gain.value = eqTreble;
  }, [isMuted, volume, eqBass, eqMid, eqTreble]);

  const togglePlayback = () => {
    if (isPlaying) {
      setShowSpotifyEmbed(false);
      setIsPlaying(false);
    } else {
      setShowSpotifyEmbed(true);
      setIsPlaying(true);
      setSpotifyUrl(currentStation.spotifyEmbed || '');
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        setIsExpanded(true);
      }
    }
  };

  const selectStation = (stationId) => {
    setSelectedStation(stationId);
    setShowStations(false);
    if (isPlaying) {
      const station = stations.find((s) => s.id === stationId);
      setSpotifyUrl(station?.spotifyEmbed || '');
    }
  };

  const StationIcon = currentStation.icon;

  return (
    <div
      className={`fixed z-[9999] pointer-events-auto transition-all duration-300 ease-out ${
        isExpanded
          ? 'inset-x-2 bottom-2 md:bottom-4 md:left-4 md:right-auto md:inset-x-auto md:w-96'
          : 'bottom-4 left-4 w-auto'
      }`}
    >
      <div
        className={`relative overflow-hidden border border-cyan-400/30 bg-black/95 backdrop-blur-xl
          ${isExpanded ? 'rounded-2xl' : 'rounded-full md:rounded-xl'}
          shadow-[0_0_30px_rgba(34,211,238,0.15)]`}
      >
        {/* Circuit pattern background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="gp-circuit" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M0 20h10M30 20h10M20 0v10M20 30v10M15 15h10v10h-10z"
                  stroke="#22d3ee"
                  strokeWidth="0.5"
                  fill="none"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gp-circuit)" />
          </svg>
        </div>

        {/* Live indicator line */}
        {isLive && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />
          </div>
        )}

        {/* ── COLLAPSED VIEW ── */}
        {!isExpanded && (
          /* PR #35 fix: use role="button" div instead of nested button to avoid hydration error */
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsExpanded(true); }}
            onClick={() => setIsExpanded(true)}
            className="relative w-full px-3 py-2 md:px-4 md:py-3 flex items-center gap-2 hover:bg-white/5 transition-colors cursor-pointer"
          >
            {isLive && (
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-75" />
                <div className="relative h-2 w-2 rounded-full bg-red-500" />
              </div>
            )}

            <span className="text-xs font-mono text-cyan-400 hidden md:inline">NOW PLAYING</span>

            {/* Play/Pause — standalone button, not nested inside the div's click handler */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); togglePlayback(); }}
              className="h-8 w-8 rounded-full p-0 flex-shrink-0 flex items-center justify-center hover:bg-cyan-400/10 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 text-cyan-400" />
              ) : (
                <Play className="h-4 w-4 ml-0.5 text-cyan-400" />
              )}
            </button>

            <ChevronUp className="h-4 w-4 text-white/40 flex-shrink-0" />
          </div>
        )}

        {/* ── EXPANDED VIEW ── */}
        {isExpanded && (
          <div className="relative p-4 md:p-5">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="absolute top-2 right-2 md:top-3 md:right-3 h-8 w-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors z-10"
              aria-label="Collapse player"
            >
              <ChevronDown className="h-4 w-4 text-white/60" />
            </button>

            {/* Header */}
            <div className="mb-4 pr-10">
              {isLive && (
                <div className="mb-3 flex items-center gap-2">
                  <div className="relative">
                    <div className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-75" />
                    <div className="relative h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                  </div>
                  <span className="text-xs font-mono text-red-400 tracking-wider">LIVE</span>
                </div>
              )}
              <p className="text-xs text-white/50 font-mono mb-1">BROADCASTING ON</p>
              <p className="text-lg md:text-2xl font-bold font-mono text-cyan-400 mb-1 tracking-tight">
                {currentStation.frequency}FM DOGECHAIN
              </p>
              <p className="text-sm text-white/70">{currentStation.name}</p>
            </div>

            {/* Spotify Embed */}
            {showSpotifyEmbed && spotifyUrl && (
              <div className="mb-4 rounded-lg overflow-hidden border border-cyan-400/30">
                <iframe
                  style={{ borderRadius: '12px' }}
                  src={spotifyUrl}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title={`${currentStation.name} Spotify embed`}
                />
              </div>
            )}

            {/* Waveform visualizer — only when playing without embed */}
            {isPlaying && !showSpotifyEmbed && (
              <div className="mb-4 flex h-12 items-end gap-0.5 rounded-lg overflow-hidden bg-cyan-400/5 p-2">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-gradient-to-t from-cyan-400 via-cyan-400/60 to-cyan-400/20"
                    style={{
                      height: `${30 + Math.random() * 70}%`,
                      animationName: 'pulse-bar',
                      animationDuration: `${0.8 + Math.random() * 0.4}s`,
                      animationTimingFunction: 'ease-in-out',
                      animationIterationCount: 'infinite',
                      animationDelay: `${i * 30}ms`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Controls row */}
            <div className="flex items-center gap-2 md:gap-3 mb-3">
              <button
                type="button"
                onClick={togglePlayback}
                className="h-12 w-12 md:h-14 md:w-14 rounded-full p-0 flex items-center justify-center bg-red-500 hover:bg-red-400 transition-colors shadow-[0_0_20px_rgba(239,68,68,0.4)] flex-shrink-0"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 md:h-6 md:w-6 text-white" />
                ) : (
                  <Play className="h-5 w-5 md:h-6 md:w-6 ml-0.5 text-white" />
                )}
              </button>

              {/* Volume slider */}
              <div className="flex-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4 text-white/50" />
                  ) : (
                    <Volume2 className="h-4 w-4 text-cyan-400" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
                  className="flex-1 h-1 accent-cyan-400 cursor-pointer"
                  aria-label="Volume"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowEQ(!showEQ)}
                className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
                  showEQ ? 'bg-cyan-400/20 text-cyan-400' : 'hover:bg-white/10 text-white/50'
                }`}
                aria-label="Toggle EQ"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>

            {/* EQ Controls */}
            {showEQ && (
              <div className="mb-3 p-3 rounded-lg bg-white/5 border border-white/10 space-y-2">
                <p className="text-xs font-mono text-white/50 mb-2">EQUALIZER</p>
                {[
                  { label: 'BASS', value: eqBass, setter: setEqBass, color: 'accent-red-400' },
                  { label: 'MID', value: eqMid, setter: setEqMid, color: 'accent-cyan-400' },
                  { label: 'TREBLE', value: eqTreble, setter: setEqTreble, color: 'accent-purple-400' },
                ].map(({ label, value, setter, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-white/40 w-12">{label}</span>
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      step="1"
                      value={value}
                      onChange={(e) => setter(parseInt(e.target.value))}
                      className={`flex-1 h-1 ${color} cursor-pointer`}
                      aria-label={`${label} EQ`}
                    />
                    <span className="text-xs font-mono text-white/40 w-8 text-right">
                      {value > 0 ? `+${value}` : value}dB
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Station Picker */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setShowStations(!showStations)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"
              >
                <div className="flex items-center gap-2">
                  <StationIcon className={`h-4 w-4 ${currentStation.color}`} />
                  <span className="font-mono text-xs text-white/70">{currentStation.name}</span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-white/40 transition-transform ${showStations ? 'rotate-180' : ''}`}
                />
              </button>

              {showStations && (
                <div className="rounded-lg overflow-hidden border border-white/10">
                  {stations.map((station) => {
                    const Icon = station.icon;
                    return (
                      <button
                        key={station.id}
                        type="button"
                        onClick={() => selectStation(station.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                          selectedStation === station.id
                            ? 'bg-cyan-400/10 text-cyan-400'
                            : 'hover:bg-white/5 text-white/60'
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${station.color}`} />
                        <span className="font-mono text-xs">{station.name}</span>
                        <span className="ml-auto font-mono text-xs text-white/30">{station.frequency}FM</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
