import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import * as THREE from 'three';
import { ArrowLeft, Radio, Layers, Upload, Video, FileText, Music as MusicIcon } from 'lucide-react';
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
  const [showMediaPanel, setShowMediaPanel] = useState(false);
  const [mediaType, setMediaType] = useState('upload');
  const [showElevator, setShowElevator] = useState(false);

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

    // Premium Liquid Glass Material - Heavy, Thick
    const thickGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.0,
      roughness: 0.02,
      transparent: true,
      opacity: 0.05,
      transmission: 0.98,
      thickness: 2.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      ior: 1.5,
    });

    // Black Glass - Media Panels OFF
    const mediaPanelOff = new THREE.MeshPhysicalMaterial({
      color: 0x000000,
      metalness: 0.2,
      roughness: 0.1,
      transparent: true,
      opacity: 0.15,
      transmission: 0.5,
      thickness: 0.8,
    });

    // Console Material
    const consoleMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      metalness: 0.6,
      roughness: 0.25,
    });

    // Cyan Edge Light - Minimal
    const edgeLightMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.15,
      metalness: 0.9,
      roughness: 0.1,
    });

    // Floor - Black, Minimal Reflection
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      new THREE.MeshStandardMaterial({ 
        color: 0x000000, 
        roughness: 0.9, 
        metalness: 0.05 
      })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Broadcast Console - Central, Heavy
    const console = new THREE.Mesh(
      new THREE.BoxGeometry(7, 0.25, 3.5),
      consoleMaterial
    );
    console.position.set(0, 1, 0);
    scene.add(console);

    // Console Edge - Cyan Signal
    const consoleEdge = new THREE.Mesh(
      new THREE.BoxGeometry(7.05, 0.04, 3.55),
      edgeLightMaterial
    );
    consoleEdge.position.set(0, 1.15, 0);
    scene.add(consoleEdge);

    // Three Media Panels - Suspended, OFF by Default
    const mediaPanels = [];
    const panelPositions = [
      { x: -6, y: 4, z: -8, width: 4, height: 5 },
      { x: 0, y: 4.5, z: -10, width: 5, height: 6 },
      { x: 6, y: 4, z: -8, width: 4, height: 5 }
    ];

    panelPositions.forEach(pos => {
      const panel = new THREE.Mesh(
        new THREE.BoxGeometry(pos.width, pos.height, 0.2),
        mediaPanelOff.clone()
      );
      panel.position.set(pos.x, pos.y, pos.z);
      mediaPanels.push(panel);
      scene.add(panel);
    });

    // ON AIR Indicator - Red, Top Center
    const onAirMaterial = new THREE.MeshStandardMaterial({
      color: isLive ? 0xff0000 : 0x0a0a0a,
      emissive: isLive ? 0xff0000 : 0x000000,
      emissiveIntensity: isLive ? 1.2 : 0,
    });

    const onAirIndicator = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.4, 0.1),
      onAirMaterial
    );
    onAirIndicator.position.set(0, 8, -9.9);
    scene.add(onAirIndicator);

    // Premium Lighting - Overhead, Quiet
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.12);
    scene.add(ambientLight);

    // Key Light - Overhead Cone
    const keyLight = new THREE.SpotLight(0xffffff, 3.5, 40, Math.PI / 12, 0.12);
    keyLight.position.set(0, 18, 2);
    keyLight.target.position.set(0, 1, 0);
    keyLight.castShadow = true;
    scene.add(keyLight);
    scene.add(keyLight.target);

    // Cyan Edge Light (Minimal)
    const edgeLight = new THREE.PointLight(0x00ffff, 0.3, 15);
    edgeLight.position.set(0, 2, -8);
    scene.add(edgeLight);

    // Red Live Light (Only When Broadcasting)
    const liveLight = new THREE.PointLight(0xff0000, isLive ? 2.0 : 0, 12);
    liveLight.position.set(0, 8, -8);
    scene.add(liveLight);

    // Animation - Locked Camera, Minimal Breathing
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.004;

      // Locked Camera - Subtle Breathing Only
      camera.position.x = 8 + Math.sin(time * 0.3) * 0.08;
      camera.position.y = 4 + Math.sin(time * 0.5) * 0.04;
      camera.lookAt(0, 2, 0);

      // Console Breathing
      console.position.y = 1 + Math.sin(time * 1.2) * 0.01;

      // Edge Light Pulse
      edgeLightMaterial.emissiveIntensity = 0.15 + Math.sin(time * 3) * 0.03;

      // ON AIR pulse when live
      if (isLive) {
        onAirMaterial.emissiveIntensity = 1.2 + Math.sin(time * 8) * 0.15;
      }

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
  }, [isLive]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute inset-0" />
      
      <div className="relative z-10 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between pointer-events-auto">
          <Link to={createPageUrl('Home')} className="flex items-center gap-2 text-white/60 hover:text-cyan-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm uppercase tracking-wider">Back</span>
          </Link>

          <div className="flex items-center gap-3">
            <button onClick={() => setShowElevator(true)} className="px-3 py-2 rounded-full text-xs uppercase tracking-wider bg-white/10 text-white/60 hover:bg-white/20 transition-all flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Elevator
            </button>
            <button onClick={() => setIsLive(!isLive)} className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-all ${isLive ? 'bg-red-500 text-white shadow-lg shadow-red-500/50' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}>
              {isLive ? '● LIVE' : 'Go Live'}
            </button>
          </div>
        </div>

        <div className="absolute top-24 right-6 pointer-events-auto animate-in slide-in-from-right duration-300">
          <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-4 space-y-3 max-w-xs">
            <button onClick={() => { setMediaType('upload'); setShowMediaPanel(true); }} className="w-full flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-white">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span className="text-sm">Upload</span>
            </button>
            <button onClick={() => { setMediaType('video'); setShowMediaPanel(true); }} className="w-full flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-white">
              <Video className="w-4 h-4 text-cyan-400" />
              <span className="text-sm">Video</span>
            </button>
            <button onClick={() => { setMediaType('gamma'); setShowMediaPanel(true); }} className="w-full flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-white">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span className="text-sm">Gamma</span>
            </button>
            <button onClick={() => { setMediaType('spotify'); setShowMediaPanel(true); }} className="w-full flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-white">
              <MusicIcon className="w-4 h-4 text-cyan-400" />
              <span className="text-sm">Music</span>
            </button>
          </div>
        </div>

        {showMediaPanel && (
          <div className="absolute top-24 left-6 pointer-events-auto max-w-md w-full animate-in slide-in-from-left duration-300">
            <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-light text-white tracking-wide">{mediaType === 'upload' && 'Upload Media'}{mediaType === 'video' && 'Video Embed'}{mediaType === 'gamma' && 'Gamma Presentation'}{mediaType === 'spotify' && 'Music Embed'}</h3>
                <button onClick={() => setShowMediaPanel(false)} className="text-white/60 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
              </div>
              {mediaType === 'upload' && <MediaUpload onUploadComplete={(files) => console.log('Uploaded:', files)} />}
              {mediaType === 'video' && <VideoPlayer />}
              {mediaType === 'gamma' && <GammaEmbed />}
              {(mediaType === 'spotify' || mediaType === 'apple' || mediaType === 'soundcloud') && <SocialEmbeds type={mediaType} />}
              <div className="mt-4 pt-4 border-t border-white/10">
                <SpatialAudio position={{ x: 0, y: 0, z: -5 }} />
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Radio className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-light text-white tracking-wide">Premium Broadcast Station</h2>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-2xl">Artist-owned station with thick liquid glass architecture. Media panels OFF by default, activated during playback. Permanent infrastructure.</p>
          </div>
        </div>
      </div>

      <DJRedFang context={isLive ? 'live' : 'broadcast'} currentGenre="electronic" chatSentiment="energetic" />
      <LiveChat isLive={isLive} activePoll={null} />
      <ElevatorNav isOpen={showElevator} onClose={() => setShowElevator(false)} />
      <InscriptionExplainer />
    </div>
  );
}