import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import * as THREE from 'three';
import { ArrowLeft, Music, Save, Upload, Layers } from 'lucide-react';
import MediaUpload from '@/components/media/MediaUpload';
import LiveChat from '@/components/chat/LiveChat';
import DJRedFang from '@/components/dj/DJRedFang';
import MusicVisualizer from '@/components/audio/MusicVisualizer';
import ElevatorNav from '@/components/navigation/ElevatorNav';

export default function RecordingStudio() {
  const canvasRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showElevator, setShowElevator] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0000);
    scene.fog = new THREE.Fog(0x0a0000, 10, 50);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(6, 3, 10);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

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

    const redGlowMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: isRecording ? 0.8 : 0.2,
    });

    const cyanGlowMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.4,
    });

    const limeGlowMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      emissive: 0x00ff00,
      emissiveIntensity: isSaving ? 0.8 : 0,
      transparent: true,
      opacity: isSaving ? 1 : 0,
    });

    // Vocal booth - glass enclosure with red accents
    const boothGeometry = new THREE.BoxGeometry(3, 3.5, 3);
    const booth = new THREE.Mesh(boothGeometry, glassMaterial);
    booth.position.set(-3, 1.75, 0);
    scene.add(booth);

    const boothEdges = new THREE.EdgesGeometry(boothGeometry);
    const boothEdgeMaterial = new THREE.LineBasicMaterial({ 
      color: isRecording ? 0xff0000 : 0x00ffff, 
      transparent: true, 
      opacity: isRecording ? 0.9 : 0.6 
    });
    const boothFrame = new THREE.LineSegments(boothEdges, boothEdgeMaterial);
    boothFrame.position.copy(booth.position);
    scene.add(boothFrame);

    // Professional microphone setup in booth
    const micGroup = new THREE.Group();

    // Mic boom arm
    const boomGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
    const boom = new THREE.Mesh(boomGeometry, glassMaterial);
    boom.position.y = 2;
    boom.rotation.z = Math.PI / 6;

    // Microphone
    const micGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.4, 16);
    const mic = new THREE.Mesh(micGeometry, redGlowMaterial);
    mic.position.y = 2.5;

    // Shock mount
    const shockMount = new THREE.TorusGeometry(0.15, 0.02, 8, 16);
    const shockMesh = new THREE.Mesh(shockMount, cyanGlowMaterial);
    shockMesh.position.y = 2.5;
    shockMesh.rotation.x = Math.PI / 2;

    // Pop filter
    const popFilter = new THREE.RingGeometry(0.25, 0.3, 32);
    const popMesh = new THREE.Mesh(popFilter, glassMaterial);
    popMesh.position.set(0, 2.5, 0.4);

    micGroup.add(boom);
    micGroup.add(mic);
    micGroup.add(shockMesh);
    micGroup.add(popMesh);
    micGroup.position.set(-3, 0, 0);
    scene.add(micGroup);

    // Professional control room with mixing desk
    const controlDesk = new THREE.Group();

    // Main mixing desk surface
    const deskGeometry = new THREE.BoxGeometry(4, 0.15, 2);
    const desk = new THREE.Mesh(deskGeometry, glassMaterial);
    desk.position.y = 1;
    desk.rotation.x = -0.1;
    controlDesk.add(desk);

    // Desk frame with red accent
    const deskFrameGeometry = new THREE.BoxGeometry(4.1, 0.1, 2.1);
    const deskFrame = new THREE.Mesh(deskFrameGeometry, redGlowMaterial);
    deskFrame.position.y = 1;
    deskFrame.rotation.x = -0.1;
    controlDesk.add(deskFrame);

    // Faders and knobs
    for (let i = 0; i < 16; i++) {
      const fader = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.3, 0.05),
        i % 3 === 0 ? redGlowMaterial : cyanGlowMaterial
      );
      fader.position.set(-1.8 + (i * 0.24), 1.3, 0);
      controlDesk.add(fader);
    }

    // Control panels - floating glass screens
    const panelPositions = [
      { x: -1.5, y: 2, z: -0.8 },
      { x: 0, y: 2, z: -0.8 },
      { x: 1.5, y: 2, z: -0.8 }
    ];

    const controlPanels = [];
    panelPositions.forEach((pos) => {
      const panelGeometry = new THREE.PlaneGeometry(1.2, 1.5);
      const panel = new THREE.Mesh(panelGeometry, glassMaterial);
      panel.position.set(pos.x, pos.y, pos.z);
      controlDesk.add(panel);
      controlPanels.push(panel);
    });

    controlDesk.position.set(3, 0, 0);
    scene.add(controlDesk);

    // Waveform displays on panels
    const waveforms = [];
    panelPositions.forEach((pos, panelIndex) => {
      const waveformGroup = new THREE.Group();
      for (let i = 0; i < 15; i++) {
        const barGeometry = new THREE.BoxGeometry(0.04, 0.5, 0.02);
        const bar = new THREE.Mesh(barGeometry, cyanGlowMaterial);
        bar.position.x = (i - 7) * 0.08;
        bar.position.y = 0;
        waveformGroup.add(bar);
      }
      waveformGroup.position.set(pos.x + 3, pos.y, pos.z + 0.01);
      scene.add(waveformGroup);
      waveforms.push(waveformGroup);
    });

    // Save indicator - lime green pulse
    const saveIndicatorGeometry = new THREE.RingGeometry(0.5, 0.7, 32);
    const saveIndicator = new THREE.Mesh(saveIndicatorGeometry, limeGlowMaterial);
    saveIndicator.position.set(3, 3.5, -0.8);
    scene.add(saveIndicator);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const keyLight = new THREE.SpotLight(0xffffff, 0.4);
    keyLight.position.set(0, 8, 8);
    keyLight.angle = Math.PI / 4;
    keyLight.penumbra = 0.5;
    scene.add(keyLight);

    const boothLight = new THREE.PointLight(isRecording ? 0xff0000 : 0x00ffff, isRecording ? 1 : 0.5, 10);
    boothLight.position.set(-3, 3, 0);
    scene.add(boothLight);

    const controlLight = new THREE.PointLight(0xff0000, 0.6, 10);
    controlLight.position.set(3, 3, 0);
    scene.add(controlLight);

    const accentLight = new THREE.PointLight(0xff0000, 0.4, 20);
    accentLight.position.set(0, 5, 5);
    scene.add(accentLight);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Camera movement - gentle shift between booth and control
      camera.position.x = 6 + Math.sin(time * 0.08) * 2;
      camera.position.y = 3 + Math.sin(time * 0.1) * 0.5;
      camera.lookAt(0, 2, 0);

      // Waveform animations
      waveforms.forEach((waveformGroup) => {
        waveformGroup.children.forEach((bar, i) => {
          if (isRecording) {
            const wave = Math.sin(time * 4 + i * 0.5) * 0.5 + 0.5;
            bar.scale.y = 0.5 + wave * 2;
          } else {
            bar.scale.y = 0.3;
          }
        });
      });

      // Mic subtle float
      micGroup.position.y = Math.sin(time * 0.5) * 0.05;

      // Control panels subtle rotation
      controlPanels.forEach((panel, i) => {
        panel.rotation.y = Math.sin(time * 0.3 + i) * 0.05;
      });

      // Save indicator pulse
      if (isSaving) {
        saveIndicator.scale.setScalar(1 + Math.sin(time * 8) * 0.2);
        limeGlowMaterial.emissiveIntensity = 0.8 + Math.sin(time * 8) * 0.4;
      } else {
        saveIndicator.scale.setScalar(0);
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
  }, [isRecording, isSaving]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 2000);
  };

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

          <div className="flex items-center gap-4">
            <div className="text-xs uppercase tracking-widest text-white/40">
              Recording Studio
            </div>
            <button
              onClick={() => setShowElevator(true)}
              className="px-3 py-2 rounded-full text-xs uppercase tracking-wider bg-white/10 text-white/60 hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              Elevator
            </button>
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-all ${
                isRecording 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/50 animate-pulse' 
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {isRecording ? '● REC' : 'Record'}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 rounded-full text-xs uppercase tracking-wider bg-white/10 text-white/60 hover:bg-white/20 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="px-4 py-2 rounded-full text-xs uppercase tracking-wider bg-white/10 text-white/60 hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
          </div>
        </div>

        {/* Upload Panel */}
        {showUpload && (
          <div className="absolute top-24 right-6 pointer-events-auto max-w-md w-full">
            <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-light text-white tracking-wide">
                  Upload Audio/Media
                </h3>
                <button 
                  onClick={() => setShowUpload(false)}
                  className="text-white/60 hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
              <MediaUpload onUploadComplete={(files) => console.log('Uploaded:', files)} />
            </div>
          </div>
        )}

        {/* Music Visualizer */}
        {isRecording && (
          <div className="absolute top-24 left-6 pointer-events-auto">
            <MusicVisualizer isActive={isRecording} intensity={1} />
          </div>
        )}

        {/* DJ Red Fang */}
        <DJRedFang context={isRecording ? 'recording' : 'greeting'} currentGenre="electronic" chatSentiment="focused" />

        {/* Live Chat */}
        <LiveChat isLive={isRecording} activePoll={null} />

        {/* Environment Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Music className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-light text-white tracking-wide">
                Recording Studio
              </h2>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
              Artist-owned recording studio for music creation, demos, and production sessions.
              Lime green pulse indicates when audio is inscribed and permanently saved.
            </p>
            <div className="mt-4 flex gap-2 text-xs uppercase tracking-wider">
              <span className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-400">
                Music Creation
              </span>
              <span className="px-3 py-1 rounded-full bg-lime-500/20 text-lime-400">
                Permanent Storage
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white/60">
                CRAB Core
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Elevator Navigation */}
      <ElevatorNav isOpen={showElevator} onClose={() => setShowElevator(false)} />
    </div>
  );
}