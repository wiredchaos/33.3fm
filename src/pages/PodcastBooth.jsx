import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import * as THREE from 'three';
import { ArrowLeft, Radio } from 'lucide-react';

export default function PodcastBooth() {
  const canvasRef = useRef(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 15, 40);

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.8, 10);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Liquid Glass Material (Primary)
    const liquidGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.08,
      transparent: true,
      opacity: 0.25,
      transmission: 0.9,
      thickness: 1.2,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      ior: 1.5,
    });

    // Dark Glass (Inactive screens)
    const darkGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0a0a0a,
      metalness: 0.2,
      roughness: 0.15,
      transparent: true,
      opacity: 0.9,
      transmission: 0.1,
      clearcoat: 0.8,
    });

    // Metal (Console frame, mic hardware)
    const studioMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.3,
      metalness: 0.9,
    });

    // Cyan Edge Light Material
    const cyanEdgeMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.2,
      roughness: 0.4,
      metalness: 0.6,
    });

    // ON AIR Indicator
    const onAirMaterial = new THREE.MeshStandardMaterial({
      color: isLive ? 0xff0000 : 0x1a1a1a,
      emissive: isLive ? 0xff0000 : 0x000000,
      emissiveIntensity: isLive ? 1.5 : 0,
    });

    // Central Broadcast Console - Thick Liquid Glass
    const console = new THREE.Group();
    
    // Main console surface - thick frosted glass
    const consoleTop = new THREE.Mesh(
      new THREE.BoxGeometry(5, 0.15, 2.5),
      liquidGlassMaterial
    );
    consoleTop.position.y = 1.1;
    console.add(consoleTop);
    
    // Console base structure
    const consoleBase = new THREE.Mesh(
      new THREE.BoxGeometry(5, 0.8, 2.5),
      new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.7 })
    );
    consoleBase.position.y = 0.5;
    console.add(consoleBase);
    
    // Cyan edge highlight (minimal)
    const edgeHighlight = new THREE.Mesh(
      new THREE.BoxGeometry(5.05, 0.02, 2.55),
      cyanEdgeMaterial
    );
    edgeHighlight.position.y = 1.18;
    console.add(edgeHighlight);
    
    scene.add(console);

    // Abstract Microphone Forms - Minimalist
    const microphones = [];
    for (let i = 0; i < 2; i++) {
      const micGroup = new THREE.Group();
      
      // Simple stand - single cylinder
      const stand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.03, 0.7, 16),
        studioMetalMaterial
      );
      stand.position.y = 1.5;
      micGroup.add(stand);
      
      // Microphone capsule - abstract form
      const capsule = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.2, 32),
        new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.7 })
      );
      capsule.position.y = 1.95;
      micGroup.add(capsule);
      
      micGroup.position.set((i - 0.5) * 2, 0, 0);
      microphones.push(micGroup);
      scene.add(micGroup);
    }

    // Suspended Glass Panels - Architectural
    const glassPanels = [];
    const panelPositions = [
      { x: 0, y: 2.5, z: -5, width: 6, height: 3 }
    ];
    
    panelPositions.forEach(pos => {
      const panel = new THREE.Mesh(
        new THREE.BoxGeometry(pos.width, pos.height, 0.15),
        liquidGlassMaterial
      );
      panel.position.set(pos.x, pos.y, pos.z);
      glassPanels.push(panel);
      scene.add(panel);
      
      // Minimal frame edge
      const frameEdge = new THREE.Mesh(
        new THREE.BoxGeometry(pos.width + 0.05, pos.height + 0.05, 0.02),
        cyanEdgeMaterial
      );
      frameEdge.position.set(pos.x, pos.y, pos.z - 0.08);
      scene.add(frameEdge);
    });
    
    // ON AIR Indicator - Minimal
    const onAirIndicator = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.3, 0.08),
      onAirMaterial
    );
    onAirIndicator.position.set(0, 4.5, -4.9);
    scene.add(onAirIndicator);

    // Floor - Dark, minimal
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.8 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    scene.add(floor);

    // Lighting - Broadcast Studio Grade
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(ambientLight);

    // Single key light - overhead cone
    const keyLight = new THREE.SpotLight(0xffffff, 2, 30, Math.PI / 7, 0.5);
    keyLight.position.set(0, 8, 0);
    keyLight.target.position.set(0, 1, 0);
    scene.add(keyLight);
    scene.add(keyLight.target);
    
    // Subtle cyan rim light (edge only)
    const rimLight = new THREE.PointLight(0x00ffff, 0.4, 15);
    rimLight.position.set(-3, 2, 5);
    scene.add(rimLight);
    
    // ON AIR backlight
    const onAirLight = new THREE.PointLight(
      isLive ? 0xff0000 : 0x000000,
      isLive ? 1 : 0,
      8
    );
    onAirLight.position.set(0, 4.5, -4);
    scene.add(onAirLight);



    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Minimal camera breathing (barely perceptible)
      camera.position.y = 1.8 + Math.sin(time * 0.08) * 0.05;
      camera.position.x = Math.sin(time * 0.05) * 0.1;
      camera.lookAt(0, 1.5, 0);

      // Glass panels subtle depth
      glassPanels.forEach((panel, i) => {
        panel.rotation.y = Math.sin(time * 0.1 + i) * 0.01;
      });

      // Microphones barely move
      microphones.forEach((mic, i) => {
        mic.position.y = Math.sin(time * 0.2 + i) * 0.01;
      });

      // ON AIR indicator pulse (only when live)
      if (isLive) {
        onAirMaterial.emissiveIntensity = 1.5 + Math.sin(time * 2) * 0.2;
        onAirLight.intensity = 1 + Math.sin(time * 2) * 0.2;
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
              Podcast Booth
            </div>
            <button
              onClick={() => setIsLive(!isLive)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-all ${
                isLive 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/50' 
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {isLive ? '● ON AIR' : 'Go Live'}
            </button>
          </div>
        </div>

        {/* Environment Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Radio className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-light text-white tracking-wide">
                Podcast Booth
              </h2>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
              Professional radio podcast booth designed for voice-first broadcasting. 
              Optimized for conversations, interviews, talk shows, and live radio sessions.
            </p>
            <div className="mt-4 flex gap-2 text-xs uppercase tracking-wider">
              <span className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-400">
                Voice-First
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white/60">
                Live Ready
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white/60">
                CRAB Core
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}