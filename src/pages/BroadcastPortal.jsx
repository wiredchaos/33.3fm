import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import * as THREE from 'three';
import { ArrowLeft, Radio, Play, Pause, Video, Calendar, Upload, FileText, Music as MusicIcon, Volume2, Layers } from 'lucide-react';
import MediaUpload from '@/components/media/MediaUpload';
import VideoPlayer from '@/components/media/VideoPlayer';
import GammaEmbed from '@/components/media/GammaEmbed';
import SocialEmbeds from '@/components/media/SocialEmbeds';
import SpatialAudio from '@/components/audio/SpatialAudio';
import ElevatorNav from '@/components/navigation/ElevatorNav';
import InscriptionExplainer from '@/components/education/InscriptionExplainer';
import LiveChat from '@/components/chat/LiveChat';
import DJRedFang from '@/components/dj/DJRedFang';

export default function BroadcastPortal() {
  const canvasRef = useRef(null);
  const [isLive, setIsLive] = useState(false);
  const [accentColor, setAccentColor] = useState('purple'); // purple, pink, orange, lime
  const [showMediaPanel, setShowMediaPanel] = useState(false);
  const [mediaType, setMediaType] = useState('upload'); // upload, video, gamma, spotify, apple, soundcloud
  const [showElevator, setShowElevator] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0000);
    scene.fog = new THREE.Fog(0x0a0000, 15, 60);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 3, 15);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Color mapping for accent
    const accentColors = {
      purple: 0x9333ea,
      pink: 0xec4899,
      orange: 0xf97316,
      lime: 0x84cc16
    };

    const redGlowMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: isLive ? 0.8 : 0.3,
    });

    // Materials
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.05,
      transparent: true,
      opacity: 0.2,
      transmission: 0.95,
      thickness: 0.5,
    });

    const cyanGlowMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.4,
    });

    const accentGlowMaterial = new THREE.MeshStandardMaterial({
      color: accentColors[accentColor],
      emissive: accentColors[accentColor],
      emissiveIntensity: 0.3,
    });

    const redLiveMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: isLive ? 0.8 : 0.1,
    });

    // Central broadcast console - floating glass structure
    const consoleGroup = new THREE.Group();
    
    const consoleBase = new THREE.Mesh(
      new THREE.BoxGeometry(8, 0.2, 4),
      glassMaterial
    );
    consoleBase.position.y = 1;
    consoleGroup.add(consoleBase);

    const consoleEdge = new THREE.Mesh(
      new THREE.BoxGeometry(8.2, 0.15, 4.2),
      isLive ? redGlowMaterial : cyanGlowMaterial
    );
    consoleEdge.position.y = 1;
    consoleGroup.add(consoleEdge);

    // Control buttons on console
    for (let i = 0; i < 12; i++) {
      const button = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16),
        i % 3 === 0 ? redGlowMaterial : cyanGlowMaterial
      );
      button.position.set(-3 + (i * 0.6), 1.1, 1.5);
      button.rotation.x = Math.PI / 2;
      consoleGroup.add(button);
    }

    scene.add(consoleGroup);

    // Media walls - three floating screens
    const mediaWalls = [];
    const wallPositions = [
      { x: -6, y: 4, z: -5, width: 4, height: 3 },
      { x: 0, y: 5, z: -8, width: 6, height: 4 },
      { x: 6, y: 4, z: -5, width: 4, height: 3 }
    ];

    wallPositions.forEach((pos) => {
      const wallGroup = new THREE.Group();
      
      const wall = new THREE.Mesh(
        new THREE.PlaneGeometry(pos.width, pos.height),
        glassMaterial
      );
      
      const wallFrame = new THREE.Mesh(
        new THREE.PlaneGeometry(pos.width + 0.2, pos.height + 0.2),
        cyanGlowMaterial
      );
      wallFrame.position.z = -0.05;
      
      wallGroup.add(wall);
      wallGroup.add(wallFrame);
      wallGroup.position.set(pos.x, pos.y, pos.z);
      
      mediaWalls.push(wallGroup);
      scene.add(wallGroup);
    });

    // Waveform visualizer - large scale
    const waveformBars = [];
    for (let i = 0; i < 40; i++) {
      const barGeometry = new THREE.BoxGeometry(0.15, 2, 0.1);
      const bar = new THREE.Mesh(barGeometry, cyanGlowMaterial);
      bar.position.x = (i - 20) * 0.4;
      bar.position.y = 1.5;
      bar.position.z = -3;
      waveformBars.push(bar);
      scene.add(bar);
    }

    // Live indicator - large floating
    const liveIndicatorGeometry = new THREE.PlaneGeometry(2, 0.6);
    const liveIndicator = new THREE.Mesh(liveIndicatorGeometry, redLiveMaterial);
    liveIndicator.position.set(0, 7, -7.9);
    scene.add(liveIndicator);

    // Accent glow rings - decorative
    const accentRings = [];
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(2 + i * 0.5, 2.2 + i * 0.5, 32),
        accentGlowMaterial
      );
      ring.position.set(0, 1, -10 - i * 2);
      accentRings.push(ring);
      scene.add(ring);
    }

    // Floating control orbs
    const controlOrbs = [];
    const orbPositions = [
      { x: -3, y: 2, z: 2 },
      { x: 3, y: 2, z: 2 },
      { x: 0, y: 2.5, z: 3 }
    ];

    orbPositions.forEach((pos) => {
      const orb = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 32, 32),
        cyanGlowMaterial
      );
      orb.position.set(pos.x, pos.y, pos.z);
      controlOrbs.push(orb);
      scene.add(orb);
    });

    // Lighting - studio grade
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const keyLight = new THREE.SpotLight(0xffffff, 0.6);
    keyLight.position.set(0, 10, 10);
    keyLight.angle = Math.PI / 4;
    keyLight.penumbra = 0.5;
    scene.add(keyLight);

    const cyanLight = new THREE.PointLight(0x00ffff, 0.8, 30);
    cyanLight.position.set(0, 5, 5);
    scene.add(cyanLight);

    const accentLight = new THREE.PointLight(accentColors[accentColor], 0.5, 25);
    accentLight.position.set(0, 3, -10);
    scene.add(accentLight);

    const rimLight = new THREE.PointLight(0x00ffff, 0.4, 40);
    rimLight.position.set(0, 2, -15);
    scene.add(rimLight);

    // Floating energy particles
    const energyParticles = new THREE.Group();
    const particleCount = 300;
    const particlePositions = [];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.03, 8, 8),
        new THREE.MeshBasicMaterial({
          color: Math.random() > 0.5 ? 0x00ffff : accentColors[accentColor],
          transparent: true,
          opacity: Math.random() * 0.5 + 0.3
        })
      );
      particle.position.set(
        (Math.random() - 0.5) * 30,
        Math.random() * 15,
        (Math.random() - 0.5) * 40
      );
      particlePositions.push({
        velocity: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: Math.random() * 0.05 + 0.02
        },
        mesh: particle
      });
      energyParticles.add(particle);
    }
    scene.add(energyParticles);

    // Holographic data streams
    const dataStreams = [];
    for (let i = 0; i < 5; i++) {
      const streamGeometry = new THREE.BufferGeometry();
      const streamPoints = [];
      for (let j = 0; j < 20; j++) {
        streamPoints.push(new THREE.Vector3(
          (i - 2) * 3,
          j * 0.5,
          -5 - j * 0.3
        ));
      }
      streamGeometry.setFromPoints(streamPoints);
      const streamMaterial = new THREE.LineBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.4
      });
      const stream = new THREE.Line(streamGeometry, streamMaterial);
      dataStreams.push({ line: stream, offset: i * 0.5 });
      scene.add(stream);
    }

    // Volumetric light cones
    const lightCones = [];
    for (let i = 0; i < 4; i++) {
      const coneGeometry = new THREE.ConeGeometry(2, 8, 32, 1, true);
      const coneMaterial = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x00ffff : accentColors[accentColor],
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
      });
      const cone = new THREE.Mesh(coneGeometry, coneMaterial);
      cone.position.set((i - 1.5) * 5, 10, -5);
      cone.rotation.x = Math.PI;
      lightCones.push(cone);
      scene.add(cone);
    }

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Camera float through space
      camera.position.x = Math.sin(time * 0.05) * 2;
      camera.position.y = 3 + Math.sin(time * 0.08) * 0.5;
      camera.lookAt(0, 3, 0);

      // Console gentle bob
      consoleGroup.position.y = Math.sin(time * 0.3) * 0.1;

      // Media walls ripple effect
      mediaWalls.forEach((wall, i) => {
        wall.children[0].material.opacity = 0.2 + Math.sin(time * 0.5 + i) * 0.05;
        wall.rotation.y = Math.sin(time * 0.2 + i * 0.5) * 0.02;
      });

      // Waveform - react to broadcast state
      waveformBars.forEach((bar, i) => {
        if (isLive) {
          const wave = Math.sin(time * 5 + i * 0.3) * 0.5 + 0.5;
          bar.scale.y = 0.5 + wave * 2.5;
        } else {
          bar.scale.y = 0.3 + Math.sin(time * 0.5 + i * 0.2) * 0.2;
        }
      });

      // Live indicator pulse
      if (isLive) {
        redLiveMaterial.emissiveIntensity = 0.8 + Math.sin(time * 5) * 0.3;
        liveIndicator.scale.setScalar(1 + Math.sin(time * 5) * 0.05);
      }

      // Accent rings rotation
      accentRings.forEach((ring, i) => {
        ring.rotation.z = time * (0.1 + i * 0.05);
      });

      // Control orbs float
      controlOrbs.forEach((orb, i) => {
        orb.position.y = 2 + i * 0.5 + Math.sin(time * 0.6 + i) * 0.15;
      });

      // Lighting pulse
      cyanLight.intensity = 0.8 + Math.sin(time * 2) * 0.2;

      // Energy particles movement
      particlePositions.forEach((particle) => {
        particle.mesh.position.x += particle.velocity.x;
        particle.mesh.position.y += particle.velocity.y;
        particle.mesh.position.z += particle.velocity.z;

        if (particle.mesh.position.z > 20) {
          particle.mesh.position.z = -20;
        }
        if (Math.abs(particle.mesh.position.x) > 15) {
          particle.velocity.x *= -1;
        }
        if (particle.mesh.position.y > 15 || particle.mesh.position.y < 0) {
          particle.velocity.y *= -1;
        }

        particle.mesh.material.opacity = 0.3 + Math.sin(time * 5 + particle.mesh.position.x) * 0.2;
      });

      // Data streams animation
      dataStreams.forEach((stream, idx) => {
        stream.line.material.opacity = 0.4 + Math.sin(time * 2 + stream.offset) * 0.2;
        stream.line.position.y = Math.sin(time + stream.offset) * 0.5;
      });

      // Light cones pulse
      lightCones.forEach((cone, i) => {
        cone.material.opacity = 0.1 + Math.sin(time * 3 + i) * 0.05;
        cone.rotation.y = time * (0.2 + i * 0.1);
      });

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
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [isLive, accentColor]);

  const accentOptions = [
    { name: 'Purple', color: 'purple', hex: '#9333ea' },
    { name: 'Pink', color: 'pink', hex: '#ec4899' },
    { name: 'Orange', color: 'orange', hex: '#f97316' },
    { name: 'Lime', color: 'lime', hex: '#84cc16' }
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute inset-0" />
      
      {/* UI Overlay */}
      <div className="relative z-10 pointer-events-none">
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between pointer-events-auto">
          <Link 
            to={createPageUrl('Home')}
            className="flex items-center gap-2 text-white/60 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm uppercase tracking-wider">Back</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="text-xs uppercase tracking-widest text-white/40">
              Broadcast Portal
            </div>
            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs uppercase tracking-wider">
              Paid
            </span>
            <button
              onClick={() => setShowElevator(true)}
              className="px-3 py-2 rounded-full text-xs uppercase tracking-wider bg-white/10 text-white/60 hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              Elevator
            </button>
            <button
              onClick={() => setIsLive(!isLive)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-all ${
                isLive 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/50' 
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {isLive ? '● LIVE' : 'Go Live'}
            </button>
          </div>
        </div>

        {/* Control Panel */}
        <div className="absolute top-24 right-6 pointer-events-auto">
          <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-4 space-y-3">
            <button 
              onClick={() => setShowMediaPanel(!showMediaPanel)}
              className="w-full flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-white"
            >
              <Upload className="w-4 h-4 text-cyan-400" />
              <span className="text-sm">Upload Media</span>
            </button>
            <button 
              onClick={() => { setMediaType('video'); setShowMediaPanel(true); }}
              className="w-full flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-white"
            >
              <Video className="w-4 h-4 text-cyan-400" />
              <span className="text-sm">Video Embed</span>
            </button>
            <button 
              onClick={() => { setMediaType('gamma'); setShowMediaPanel(true); }}
              className="w-full flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-white"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span className="text-sm">Gamma Slides</span>
            </button>
            <button 
              onClick={() => { setMediaType('spotify'); setShowMediaPanel(true); }}
              className="w-full flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-white"
            >
              <MusicIcon className="w-4 h-4 text-cyan-400" />
              <span className="text-sm">Spotify</span>
            </button>
            <button 
              onClick={() => { setMediaType('apple'); setShowMediaPanel(true); }}
              className="w-full flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-white"
            >
              <MusicIcon className="w-4 h-4 text-cyan-400" />
              <span className="text-sm">Apple Music</span>
            </button>
            <button 
              onClick={() => { setMediaType('soundcloud'); setShowMediaPanel(true); }}
              className="w-full flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-white"
            >
              <MusicIcon className="w-4 h-4 text-cyan-400" />
              <span className="text-sm">SoundCloud</span>
            </button>
          </div>

          {/* Accent Color Selector */}
          <div className="mt-4 backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-4">
            <div className="text-xs uppercase tracking-widest text-white/60 mb-3">
              Accent
            </div>
            <div className="grid grid-cols-2 gap-2">
              {accentOptions.map((option) => (
                <button
                  key={option.color}
                  onClick={() => setAccentColor(option.color)}
                  className={`px-3 py-2 rounded-lg text-xs uppercase tracking-wider transition-all ${
                    accentColor === option.color
                      ? 'bg-white/20 border border-white/30'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                  style={{
                    color: accentColor === option.color ? option.hex : 'rgba(255,255,255,0.6)'
                  }}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Media Panel */}
        {showMediaPanel && (
          <div className="absolute top-24 left-6 pointer-events-auto max-w-2xl w-full">
            <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-light text-white tracking-wide">
                  {mediaType === 'upload' && 'Upload Media'}
                  {mediaType === 'video' && 'Video Embed'}
                  {mediaType === 'gamma' && 'Gamma Presentation'}
                </h3>
                <button 
                  onClick={() => setShowMediaPanel(false)}
                  className="text-white/60 hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>

              {mediaType === 'upload' && (
                <MediaUpload onUploadComplete={(files) => console.log('Uploaded:', files)} />
              )}
              {mediaType === 'video' && (
                <VideoPlayer />
              )}
              {mediaType === 'gamma' && (
                <GammaEmbed />
              )}
              {mediaType === 'spotify' && (
                <SocialEmbeds type="spotify" />
              )}
              {mediaType === 'apple' && (
                <SocialEmbeds type="apple" />
              )}
              {mediaType === 'soundcloud' && (
                <SocialEmbeds type="soundcloud" />
              )}

              {/* Spatial Audio Control */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs uppercase tracking-wider text-white/60">Spatial Audio</div>
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                </div>
                <SpatialAudio position={{ x: 0, y: 0, z: -5 }} />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Radio className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-light text-white tracking-wide">
                3D Broadcast Portal
              </h2>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
              Your artist-owned radio station and content hub. Always-on presence supporting live broadcasts, 
              scheduled programming, and on-demand content. Full creative control with OTT channel capabilities.
            </p>
            <div className="mt-4 flex gap-2 text-xs uppercase tracking-wider flex-wrap">
              <span className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-400">
                Radio Station
              </span>
              <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400">
                Live Capable
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white/60">
                Scheduled Shows
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white/60">
                CRAB Full Stack
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DJ Red Fang */}
      <DJRedFang context={isLive ? 'live' : 'broadcast'} currentGenre="electronic" chatSentiment="energetic" />

      {/* Live Chat */}
      <LiveChat isLive={isLive} activePoll={null} />

      {/* 3D Elevator Navigation */}
      <ElevatorNav isOpen={showElevator} onClose={() => setShowElevator(false)} />
    </div>
  );
}