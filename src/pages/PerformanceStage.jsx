import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import * as THREE from 'three';
import { ArrowLeft, Mic, Users, Radio, Layers, Sparkles } from 'lucide-react';
import ThreeDKeyboard from '@/components/interactive/3DKeyboard';
import MultiplayerChat from '@/components/social/MultiplayerChat';
import ElevatorNav from '@/components/navigation/ElevatorNav';
import DJRedFang from '@/components/dj/DJRedFang';
import ThreeDMicrophone from '@/components/interactive/3DMicrophone';
import ThreeDDrumKit from '@/components/interactive/3DDrumKit';
import ThreeDOrchestra from '@/components/interactive/3DOrchestra';
import ThreeDSynthesizer from '@/components/interactive/3DSynthesizer';

export default function PerformanceStage() {
  const canvasRef = useRef(null);
  const [isLive, setIsLive] = useState(false);
  const [showElevator, setShowElevator] = useState(false);
  const [audienceCount, setAudienceCount] = useState(47);
  const [isRecording, setIsRecording] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [, forceUpdate] = useState();

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 10, 60);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 15);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Stage platform
    const stage = new THREE.Mesh(
      new THREE.BoxGeometry(12, 0.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.8, roughness: 0.3 })
    );
    stage.position.y = 0.25;
    scene.add(stage);

    // Stage edge lights
    const edgeLights = [];
    for (let i = 0; i < 20; i++) {
      const light = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.3, 16),
        new THREE.MeshStandardMaterial({
          color: 0x00ffff,
          emissive: 0x00ffff,
          emissiveIntensity: 0.8
        })
      );
      light.position.set(-6 + (i * 0.6), 0.5, i % 2 === 0 ? 4 : -4);
      edgeLights.push(light);
      scene.add(light);
    }

    // Spotlight rigs
    const spotlights = [];
    for (let i = 0; i < 5; i++) {
      const spotLight = new THREE.SpotLight(
        i % 2 === 0 ? 0xff0000 : 0x00ffff,
        2,
        30,
        Math.PI / 6,
        0.5
      );
      spotLight.position.set(-6 + i * 3, 10, 0);
      spotLight.target.position.set(-6 + i * 3, 0, 0);
      scene.add(spotLight);
      scene.add(spotLight.target);
      spotlights.push(spotLight);
    }

    // Virtual audience avatars
    const audience = [];
    for (let i = 0; i < 50; i++) {
      const avatar = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 16, 16),
        new THREE.MeshStandardMaterial({
          color: Math.random() > 0.5 ? 0x00ffff : 0xff00ff,
          emissive: Math.random() > 0.5 ? 0x00ffff : 0xff00ff,
          emissiveIntensity: 0.5
        })
      );
      avatar.position.set(
        (Math.random() - 0.5) * 20,
        0.5 + Math.random() * 2,
        8 + Math.random() * 10
      );
      audience.push(avatar);
      scene.add(avatar);
    }

    // Center Stage Microphone Stand
    const micStand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.08, 3, 16),
      new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.9,
        roughness: 0.1
      })
    );
    micStand.position.set(0, 2, 0);
    scene.add(micStand);

    // Microphone
    const micBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 0.4, 16),
      new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.9,
        roughness: 0.2
      })
    );
    micBody.position.set(0, 3.7, 0);
    scene.add(micBody);

    const micGrille = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: isRecording ? 1.0 : 0.3,
        metalness: 0.8,
        roughness: 0.3
      })
    );
    micGrille.position.set(0, 4, 0);
    scene.add(micGrille);

    // Holographic screens
    const screens = [];
    for (let i = 0; i < 3; i++) {
      const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(4, 3),
        new THREE.MeshStandardMaterial({
          color: 0x00ffff,
          emissive: 0x00ffff,
          emissiveIntensity: 0.6,
          transparent: true,
          opacity: 0.3
        })
      );
      screen.position.set(-6 + i * 6, 5, -3);
      screens.push(screen);
      scene.add(screen);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(0xff0000, 1.5, 30);
    mainLight.position.set(0, 8, 0);
    scene.add(mainLight);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      camera.position.x = Math.sin(time * 0.1) * 3;
      camera.position.y = 5 + Math.sin(time * 0.15) * 1;
      camera.lookAt(0, 2, 0);

      // Edge lights wave
      edgeLights.forEach((light, i) => {
        light.material.emissiveIntensity = 0.8 + Math.sin(time * 3 + i * 0.5) * 0.4;
      });

      // Spotlights sweep
      spotlights.forEach((light, i) => {
        light.target.position.x = -6 + i * 3 + Math.sin(time * 0.5 + i) * 2;
        light.intensity = isLive ? (2 + Math.sin(time * 2 + i) * 0.5) : 1;
      });

      // Audience bounce
      audience.forEach((avatar, i) => {
        avatar.position.y = 0.5 + Math.sin(time * 2 + i * 0.2) * 0.3;
        if (isLive) {
          avatar.material.emissiveIntensity = 0.5 + Math.sin(time * 3 + i) * 0.3;
        }
      });

      // Screens pulse
      screens.forEach((screen, i) => {
        screen.material.emissiveIntensity = 0.6 + Math.sin(time * 2 + i) * 0.2;
      });

      // Microphone glow
      micGrille.material.emissiveIntensity = isRecording 
        ? (1.0 + Math.sin(time * 5) * 0.3)
        : (0.3 + Math.sin(time * 2) * 0.1);

      mainLight.intensity = isLive ? (1.5 + Math.sin(time * 4) * 0.5) : 1;

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
  }, [isLive, isRecording]);

  // Sound bar animation
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate({});
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute inset-0" />
      
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
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
              <Users className="w-4 h-4 text-cyan-400" />
              <span className="text-white text-sm">{audienceCount} watching</span>
            </div>
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
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/50 animate-pulse' 
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {isLive ? '● PERFORMING' : 'Go Live'}
            </button>
          </div>
        </div>

        {/* Left Side Instruments */}
        <div className="absolute top-24 left-6 pointer-events-auto space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <ThreeDKeyboard onNotePlay={(note) => console.log('Played:', note)} />
          <ThreeDMicrophone 
            onRecord={() => setIsRecording(!isRecording)} 
            isRecording={isRecording} 
          />
          <ThreeDDrumKit onDrumHit={(drum) => console.log('Hit:', drum)} />
          <ThreeDSynthesizer onPlay={(note) => console.log('Synth:', note)} />
        </div>

        {/* Right Side - Chat & Orchestra */}
        <div className="absolute top-24 right-6 w-80 pointer-events-auto space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <MultiplayerChat room="performance" />
          <ThreeDOrchestra isPremium={true} />
        </div>

        {/* DJ Red Fang */}
        <DJRedFang context="live" currentGenre="electronic" chatSentiment="hyped" />

        {/* Sound Bar Visualizer - Bottom Center */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 pointer-events-auto">
          <div className="backdrop-blur-xl bg-black/60 border border-cyan-400/30 rounded-2xl px-8 py-4">
            <div className="flex items-end gap-1 h-16">
              {[...Array(32)].map((_, i) => {
                const height = isLive 
                  ? Math.random() * 100 
                  : 20 + Math.sin(Date.now() / 200 + i) * 15;
                return (
                  <div
                    key={i}
                    className="w-1.5 bg-gradient-to-t from-cyan-400 to-purple-600 rounded-full transition-all duration-100"
                    style={{ height: `${height}%` }}
                  />
                );
              })}
            </div>
            <div className="mt-2 text-center">
              <div className="text-xs text-cyan-400 uppercase tracking-wider">
                {isRecording ? '● Recording' : 'Audio Monitor'}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Mic className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-light text-white tracking-wide">
                Virtual Performance Stage
              </h2>
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
              Live multiplayer performance space with interactive 3D keyboard, real-time audience, and social features. 
              Broadcast to the WIRED CHAOS community and perform together.
            </p>
            <div className="mt-4 flex gap-2 text-xs uppercase tracking-wider">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400">
                Live Performance
              </span>
              <span className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-400">
                Multiplayer
              </span>
              <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400">
                Social Features
              </span>
            </div>
          </div>
        </div>
      </div>

      <ElevatorNav isOpen={showElevator} onClose={() => setShowElevator(false)} />
    </div>
  );
}