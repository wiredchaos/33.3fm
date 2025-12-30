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
    scene.fog = new THREE.Fog(0x000000, 10, 50);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 8);

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

    const cyanGlowMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.3,
    });

    // Broadcast desk - floating glass surface
    const deskGeometry = new THREE.BoxGeometry(6, 0.1, 3);
    const desk = new THREE.Mesh(deskGeometry, glassMaterial);
    desk.position.y = 1;
    scene.add(desk);

    // Desk edge glow
    const edgeGeometry = new THREE.BoxGeometry(6.1, 0.05, 3.1);
    const deskEdge = new THREE.Mesh(edgeGeometry, cyanGlowMaterial);
    deskEdge.position.y = 1;
    scene.add(deskEdge);

    // Microphone stands (abstract)
    const micStands = [];
    for (let i = 0; i < 3; i++) {
      const standGroup = new THREE.Group();
      
      const standGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
      const stand = new THREE.Mesh(standGeometry, glassMaterial);
      stand.position.y = 1.75;
      
      const micGeometry = new THREE.SphereGeometry(0.15, 16, 16);
      const mic = new THREE.Mesh(micGeometry, cyanGlowMaterial);
      mic.position.y = 2.5;
      
      standGroup.add(stand);
      standGroup.add(mic);
      standGroup.position.x = (i - 1) * 2;
      standGroup.position.z = 0;
      
      micStands.push(standGroup);
      scene.add(standGroup);
    }

    // Back panel with waveform visualization
    const panelGeometry = new THREE.PlaneGeometry(10, 6);
    const panel = new THREE.Mesh(panelGeometry, glassMaterial);
    panel.position.z = -4;
    panel.position.y = 3;
    scene.add(panel);

    // Waveform bars
    const waveformBars = [];
    for (let i = 0; i < 20; i++) {
      const barGeometry = new THREE.BoxGeometry(0.2, 1, 0.1);
      const bar = new THREE.Mesh(barGeometry, cyanGlowMaterial);
      bar.position.x = (i - 10) * 0.4;
      bar.position.y = 3;
      bar.position.z = -3.9;
      waveformBars.push(bar);
      scene.add(bar);
    }

    // ON AIR indicator
    const onAirGeometry = new THREE.PlaneGeometry(1.5, 0.4);
    const onAirMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: isLive ? 0.8 : 0.1,
      transparent: true,
      opacity: isLive ? 1 : 0.3,
    });
    const onAir = new THREE.Mesh(onAirGeometry, onAirMaterial);
    onAir.position.set(0, 5, -3.9);
    scene.add(onAir);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const keyLight = new THREE.SpotLight(0xffffff, 0.5);
    keyLight.position.set(0, 8, 5);
    keyLight.angle = Math.PI / 6;
    keyLight.penumbra = 0.5;
    scene.add(keyLight);

    const cyanLight = new THREE.PointLight(0x00ffff, 0.6, 20);
    cyanLight.position.set(0, 2, 2);
    scene.add(cyanLight);

    // Volumetric light beams
    const lightBeams = [];
    for (let i = 0; i < 3; i++) {
      const beamGeometry = new THREE.CylinderGeometry(0.5, 1.5, 8, 32, 1, true);
      const beamMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide
      });
      const beam = new THREE.Mesh(beamGeometry, beamMaterial);
      beam.position.set((i - 1) * 3, 8, -2);
      lightBeams.push(beam);
      scene.add(beam);
    }

    // Floating sound wave particles
    const soundParticles = new THREE.Group();
    const soundParticleData = [];
    
    for (let i = 0; i < 150; i++) {
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.03, 8, 8),
        new THREE.MeshBasicMaterial({
          color: Math.random() > 0.3 ? 0x00ffff : 0xff0000,
          transparent: true,
          opacity: 0.6
        })
      );
      particle.position.set(
        (Math.random() - 0.5) * 20,
        Math.random() * 8,
        (Math.random() - 0.5) * 15
      );
      soundParticleData.push({
        mesh: particle,
        baseY: particle.position.y,
        speed: Math.random() * 0.02 + 0.01,
        amplitude: Math.random() * 0.3 + 0.2
      });
      soundParticles.add(particle);
    }
    scene.add(soundParticles);

    // Holographic frequency rings
    const freqRings = [];
    for (let i = 0; i < 5; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2 + i * 0.5, 0.02, 16, 100),
        new THREE.MeshBasicMaterial({
          color: 0x00ffff,
          transparent: true,
          opacity: 0.4
        })
      );
      ring.position.set(0, 1.5, -3);
      ring.rotation.x = Math.PI / 2;
      freqRings.push(ring);
      scene.add(ring);
    }

    // Neon grid floor
    const gridHelper = new THREE.GridHelper(20, 20, 0x00ffff, 0x00ffff);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.1;
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Gentle camera orbit
      camera.position.x = Math.sin(time * 0.1) * 1;
      camera.position.y = 2 + Math.sin(time * 0.15) * 0.3;
      camera.lookAt(0, 1.5, 0);

      // Waveform animation
      waveformBars.forEach((bar, i) => {
        const wave = Math.sin(time * 3 + i * 0.5) * 0.5 + 0.5;
        bar.scale.y = 0.3 + wave * 1.5;
      });

      // Microphone subtle movement
      micStands.forEach((stand, i) => {
        stand.position.y = Math.sin(time * 0.5 + i) * 0.05;
      });

      // Update ON AIR indicator
      onAirMaterial.emissiveIntensity = isLive ? (0.8 + Math.sin(time * 4) * 0.2) : 0.1;

      // Light beams rotation
      lightBeams.forEach((beam, i) => {
        beam.rotation.y = time * (0.2 + i * 0.1);
        beam.material.opacity = 0.08 + Math.sin(time * 2 + i) * 0.03;
      });

      // Sound particles wave motion
      soundParticleData.forEach((data, i) => {
        data.mesh.position.y = data.baseY + Math.sin(time * 5 + i * 0.1) * data.amplitude;
        data.mesh.position.x += Math.sin(time + i) * 0.005;
        data.mesh.material.opacity = 0.6 + Math.sin(time * 3 + i * 0.2) * 0.3;
      });
      soundParticles.rotation.y = time * 0.05;

      // Frequency rings pulse
      freqRings.forEach((ring, i) => {
        ring.scale.setScalar(1 + Math.sin(time * 2 - i * 0.5) * 0.1);
        ring.material.opacity = 0.4 + Math.sin(time * 3 - i * 0.3) * 0.2;
      });

      // Grid pulse with audio
      gridHelper.material.opacity = 0.1 + Math.sin(time * 4) * 0.05;

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