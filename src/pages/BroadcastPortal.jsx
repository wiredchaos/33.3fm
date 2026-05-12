import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import * as THREE from 'three';
import {
  ArrowLeft, Radio, Layers, Upload, Video, FileText, Music as MusicIcon,
  Mic, Square, Pause, Play, Trash2, Save, Wand2, Volume2, Settings,
  ChevronDown, ChevronUp
} from 'lucide-react';
import MediaUpload from '@/components/media/MediaUpload';
import VideoPlayer from '@/components/media/VideoPlayer';
import GammaEmbed from '@/components/media/GammaEmbed';
import SocialEmbeds from '@/components/media/SocialEmbeds';
import SpatialAudio from '@/components/audio/SpatialAudio';
import ElevatorNav from '@/components/navigation/ElevatorNav';
import InscriptionExplainer from '@/components/education/InscriptionExplainer';
import LiveChat from '@/components/chat/LiveChat';
import DJRedFang from '@/components/dj/DJRedFang';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import GlobalPlayer from '@/components/audio/GlobalPlayer';

/* ── AI Presets (from wcmhub signal-booth) ── */
const AI_PRESETS = [
  { id: 'broadcast', name: 'Broadcast Clean',  description: 'Radio-ready clarity and compression' },
  { id: 'phantom',   name: 'Phantom Vocal',    description: 'Ethereal reverb and presence' },
  { id: 'redfang',   name: 'Red Fang Silk',    description: 'Warm vintage vocal character' },
  { id: 'raw',       name: 'Raw Signal',       description: 'No processing, pure capture' },
];

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/* ── Signal Booth Recording Panel ── */
function SignalBoothPanel({ isLive }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [takes, setTakes] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState('broadcast');
  const [inputGain, setInputGain] = useState(75);
  const [showSettings, setShowSettings] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(blob));
      };
      recorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch (err) {
      console.warn('[SignalBooth] Mic access denied:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    clearInterval(timerRef.current);
    setIsRecording(false);
    setIsPaused(false);
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.pause();
      clearInterval(timerRef.current);
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current?.state === 'paused') {
      mediaRecorderRef.current.resume();
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
      setIsPaused(false);
    }
  };

  const saveTake = () => {
    if (audioUrl) {
      setTakes((prev) => [
        ...prev,
        { id: `take-${Date.now()}`, name: `Take ${prev.length + 1}`, duration, url: audioUrl },
      ]);
      setAudioUrl(null);
      setDuration(0);
    }
  };

  const clearTake = () => {
    setAudioUrl(null);
    setDuration(0);
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`} />
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Signal Booth</span>
          {isRecording && (
            <span className="text-xs font-mono text-red-400 ml-2">{formatDuration(duration)}</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white/40 hover:text-white transition-colors"
        >
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-4 space-y-4">
          {/* Recording controls */}
          <div className="flex items-center gap-3">
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded-full text-sm font-medium transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              >
                <Mic className="w-4 h-4" />
                Record
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm transition-all"
                >
                  <Square className="w-4 h-4" />
                  Stop
                </button>
                <button
                  type="button"
                  onClick={isPaused ? resumeRecording : pauseRecording}
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm transition-all"
                >
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
              </>
            )}

            {audioUrl && !isRecording && (
              <>
                <button
                  type="button"
                  onClick={saveTake}
                  className="flex items-center gap-2 px-3 py-2 bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-400 rounded-full text-sm transition-all"
                >
                  <Save className="w-4 h-4" />
                  Save Take
                </button>
                <button
                  type="button"
                  onClick={clearTake}
                  className="p-2 text-white/40 hover:text-white/70 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className={`ml-auto p-2 rounded-full transition-colors ${showSettings ? 'text-cyan-400 bg-cyan-400/10' : 'text-white/40 hover:text-white/70'}`}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Waveform / audio preview */}
          {isRecording && (
            <div className="flex h-10 items-end gap-0.5 rounded-lg overflow-hidden bg-red-500/5 px-2 py-1">
              {Array.from({ length: 32 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-gradient-to-t from-red-500 via-red-400/60 to-red-400/20"
                  style={{
                    height: `${20 + Math.random() * 80}%`,
                    animationName: 'pulse-bar',
                    animationDuration: `${0.6 + Math.random() * 0.6}s`,
                    animationTimingFunction: 'ease-in-out',
                    animationIterationCount: 'infinite',
                    animationDelay: `${i * 25}ms`,
                  }}
                />
              ))}
            </div>
          )}

          {audioUrl && !isRecording && (
            <audio controls src={audioUrl} className="w-full h-8 accent-cyan-400" />
          )}

          {/* Settings panel */}
          {showSettings && (
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-3">
              {/* AI Preset */}
              <div>
                <p className="text-xs font-mono text-white/40 mb-2 flex items-center gap-1">
                  <Wand2 className="w-3 h-3" /> AI PRESET
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {AI_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedPreset(preset.id)}
                      className={`px-2 py-1.5 rounded-lg text-xs text-left transition-all ${
                        selectedPreset === preset.id
                          ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30'
                          : 'bg-white/5 text-white/50 hover:bg-white/10'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input gain */}
              <div>
                <p className="text-xs font-mono text-white/40 mb-2 flex items-center gap-1">
                  <Volume2 className="w-3 h-3" /> INPUT GAIN — {inputGain}%
                </p>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={inputGain}
                  onChange={(e) => setInputGain(parseInt(e.target.value))}
                  className="w-full h-1 accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Saved takes */}
          {takes.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-mono text-white/40 uppercase tracking-wider">Saved Takes</p>
              {takes.map((take) => (
                <div key={take.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5">
                  <span className="text-xs text-white/70 flex-1">{take.name}</span>
                  <span className="text-xs font-mono text-white/30">{formatDuration(take.duration)}</span>
                  <audio controls src={take.url} className="h-6 w-32 accent-cyan-400" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Main BroadcastPortal ── */
export default function BroadcastPortal() {
  const canvasRef = useRef(null);
  const [isLive, setIsLive] = useState(false);
  const [showMediaPanel, setShowMediaPanel] = useState(false);
  const [mediaType, setMediaType] = useState('upload');
  const [showElevator, setShowElevator] = useState(false);
  const [panelsActive, setPanelsActive] = useState([false, false, false]);
  const [panelBrightness, setPanelBrightness] = useState(0.3);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!canvasRef.current) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 20, 50);
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(8, 4, 8);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const thickGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, metalness: 0.0, roughness: 0.02, transparent: true,
      opacity: 0.05, transmission: 0.98, thickness: 2.5, clearcoat: 1.0,
      clearcoatRoughness: 0.03, ior: 1.5,
    });
    const consoleMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a, metalness: 0.6, roughness: 0.25,
    });
    const edgeLightMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 0.15,
      metalness: 0.9, roughness: 0.1,
    });

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.9, metalness: 0.05 })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const broadcastConsole = new THREE.Mesh(new THREE.BoxGeometry(7, 0.25, 3.5), consoleMaterial);
    broadcastConsole.position.set(0, 1, 0);
    scene.add(broadcastConsole);

    const consoleEdge = new THREE.Mesh(new THREE.BoxGeometry(7.05, 0.04, 3.55), edgeLightMaterial);
    consoleEdge.position.set(0, 1.15, 0);
    scene.add(consoleEdge);

    const panelPositions = [
      { x: -6, y: 4, z: -8, width: 4, height: 5 },
      { x: 0, y: 4.5, z: -10, width: 5, height: 6 },
      { x: 6, y: 4, z: -8, width: 4, height: 5 },
    ];
    panelPositions.forEach((pos) => {
      const panel = new THREE.Mesh(
        new THREE.BoxGeometry(pos.width, pos.height, 0.05),
        thickGlassMaterial
      );
      panel.position.set(pos.x, pos.y, pos.z);
      scene.add(panel);
    });

    // Lighting
    scene.add(new THREE.AmbientLight(0x111111, 0.5));
    const cyanLight = new THREE.PointLight(0x00ffff, 1.5, 30);
    cyanLight.position.set(0, 6, 0);
    scene.add(cyanLight);
    const redLight = new THREE.PointLight(0xff0000, 0.8, 20);
    redLight.position.set(-8, 4, 0);
    scene.add(redLight);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Scan line */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent animate-scan-line" />
      </div>

      {/* ── TOP NAV ── */}
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-auto">
        <div className="backdrop-blur-xl bg-black/60 border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <Link
            to={createPageUrl('Home')}
            className="flex items-center gap-2 text-white/60 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm uppercase tracking-wider hidden sm:inline">Back</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-white/40 uppercase tracking-wider hidden md:inline">
              BROADCAST PORTAL
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPanelsActive((p) => [!p[0], !p[1], !p[2]])}
              className="px-3 py-2 rounded-full text-xs uppercase tracking-wider bg-white/10 text-white/60 hover:bg-white/20 transition-all"
            >
              📺 Panels
            </button>
            <button
              type="button"
              onClick={() => setCurrentSlide((s) => (s + 1) % 3)}
              className="px-3 py-2 rounded-full text-xs uppercase tracking-wider bg-white/10 text-white/60 hover:bg-white/20 transition-all"
            >
              🎞️ Slide {currentSlide + 1}
            </button>
            <button
              type="button"
              onClick={() => setShowElevator(true)}
              className="px-3 py-2 rounded-full text-xs uppercase tracking-wider bg-white/10 text-white/60 hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              Elevator
            </button>
            <div className="relative">
              <GlowingEffect
                spread={50}
                glow={isLive}
                disabled={false}
                proximity={100}
                inactiveZone={0.1}
                borderWidth={3}
                variant={isLive ? 'default' : 'white'}
              />
              <button
                type="button"
                onClick={() => setIsLive(!isLive)}
                className={`relative z-10 px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-all ${
                  isLive
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {isLive ? '● LIVE' : 'Go Live'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MEDIA PANEL BUTTONS (right) ── */}
      <div className="absolute top-20 right-4 z-20 pointer-events-auto">
        <div className="glass-panel rounded-2xl p-3 space-y-2">
          {[
            { type: 'upload', icon: Upload, label: 'Upload' },
            { type: 'video',  icon: Video,  label: 'Video' },
            { type: 'gamma',  icon: FileText, label: 'Gamma' },
            { type: 'spotify', icon: MusicIcon, label: 'Music' },
          ].map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              type="button"
              onClick={() => { setMediaType(type); setShowMediaPanel(true); }}
              className="w-full flex items-center gap-3 px-3 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-white text-sm"
            >
              <Icon className="w-4 h-4 text-cyan-400" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── MEDIA PANEL (left) ── */}
      {showMediaPanel && (
        <div className="absolute top-20 left-4 z-20 pointer-events-auto max-w-md w-full">
          <div className="glass-panel rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-light text-white tracking-wide">
                {mediaType === 'upload' && 'Upload Media'}
                {mediaType === 'video' && 'Video Embed'}
                {mediaType === 'gamma' && 'Gamma Presentation'}
                {mediaType === 'spotify' && 'Music Embed'}
              </h3>
              <button
                type="button"
                onClick={() => setShowMediaPanel(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
            {mediaType === 'upload' && <MediaUpload onUploadComplete={(files) => console.log('Uploaded:', files)} />}
            {mediaType === 'video' && <VideoPlayer />}
            {mediaType === 'gamma' && <GammaEmbed />}
            {(mediaType === 'spotify' || mediaType === 'apple' || mediaType === 'soundcloud') && (
              <SocialEmbeds type={mediaType} />
            )}
            <div className="mt-4 pt-4 border-t border-white/10">
              <SpatialAudio position={{ x: 0, y: 0, z: -5 }} />
            </div>
          </div>
        </div>
      )}

      {/* ── SIGNAL BOOTH PANEL (bottom-left) ── */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-auto w-full max-w-sm">
        <SignalBoothPanel isLive={isLive} />
      </div>

      {/* ── STATION INFO (bottom-center) ── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="glass-panel rounded-2xl px-6 py-4 text-center">
          <div className="flex items-center gap-3 mb-1 justify-center">
            <Radio className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-light text-white tracking-wide">Premium Broadcast Station</h2>
          </div>
          <p className="text-xs text-white/40 max-w-xs">
            Artist-owned station · Liquid glass architecture · Permanent infrastructure
          </p>
        </div>
      </div>

      {/* ── OVERLAYS ── */}
      <DJRedFang context={isLive ? 'live' : 'broadcast'} currentGenre="electronic" chatSentiment="energetic" />
      <LiveChat isLive={isLive} activePoll={null} />
      <ElevatorNav isOpen={showElevator} onClose={() => setShowElevator(false)} />
      <InscriptionExplainer />
      <GlobalPlayer />
    </div>
  );
}
