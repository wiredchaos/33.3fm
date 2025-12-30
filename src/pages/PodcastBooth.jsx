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

    // Realistic Materials
    const woodMaterial = new THREE.MeshStandardMaterial({
      color: 0x2d1f15,
      roughness: 0.85,
      metalness: 0.05,
    });

    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0x383838,
      roughness: 0.25,
      metalness: 0.95,
    });

    const fabricMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.95,
      metalness: 0,
    });

    const screenMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      emissive: 0x00ffff,
      emissiveIntensity: 0.4,
      roughness: 0.15,
      metalness: 0.8,
    });

    const ledMaterial = new THREE.MeshStandardMaterial({
      color: isLive ? 0xff0000 : 0x00ff00,
      emissive: isLive ? 0xff0000 : 0x00ff00,
      emissiveIntensity: isLive ? 1.2 : 0.6,
    });

    // Professional podcast table
    const table = new THREE.Group();
    
    // Table top - realistic wood
    const tableTop = new THREE.Mesh(
      new THREE.BoxGeometry(6, 0.12, 3),
      woodMaterial
    );
    tableTop.position.y = 1;
    table.add(tableTop);
    
    // Table edge trim
    const edgeTrim = new THREE.Mesh(
      new THREE.BoxGeometry(6.1, 0.05, 3.1),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 })
    );
    edgeTrim.position.y = 1.08;
    table.add(edgeTrim);
    
    // Table legs
    const legPositions = [
      { x: -2.5, z: -1.2 },
      { x: 2.5, z: -1.2 },
      { x: -2.5, z: 1.2 },
      { x: 2.5, z: 1.2 }
    ];
    
    legPositions.forEach(pos => {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.1, 0.95, 16),
        metalMaterial
      );
      leg.position.set(pos.x, 0.5, pos.z);
      table.add(leg);
    });
    
    scene.add(table);

    // Professional broadcast microphones
    const micSetups = [];
    for (let i = 0; i < 3; i++) {
      const micGroup = new THREE.Group();
      
      // Boom arm base
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.15, 0.06, 32),
        metalMaterial
      );
      base.position.y = 1.09;
      micGroup.add(base);
      
      // Boom arm vertical pole
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 0.6, 16),
        metalMaterial
      );
      pole.position.y = 1.4;
      micGroup.add(pole);
      
      // Boom horizontal arm
      const boomArm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 1.2, 16),
        metalMaterial
      );
      boomArm.position.set(0.55, 1.7, 0);
      boomArm.rotation.z = Math.PI / 2;
      micGroup.add(boomArm);
      
      // Microphone body - Shure SM7B style
      const micBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.18, 0.12),
        new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5, metalness: 0.3 })
      );
      micBody.position.set(1.1, 1.7, 0);
      micGroup.add(micBody);
      
      // Mic grille
      const grille = new THREE.Mesh(
        new THREE.BoxGeometry(0.11, 0.16, 0.11),
        new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.7, metalness: 0.6 })
      );
      grille.position.set(1.1, 1.7, 0);
      micGroup.add(grille);
      
      // Foam windscreen
      const windscreen = new THREE.Mesh(
        new THREE.BoxGeometry(0.13, 0.19, 0.13),
        new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 1, transparent: true, opacity: 0.8 })
      );
      windscreen.position.set(1.1, 1.7, 0);
      micGroup.add(windscreen);
      
      // Pop filter
      const popFrame = new THREE.Mesh(
        new THREE.TorusGeometry(0.18, 0.012, 16, 32),
        metalMaterial
      );
      popFrame.position.set(0.85, 1.7, 0);
      popFrame.rotation.y = Math.PI / 2;
      micGroup.add(popFrame);
      
      const popMesh = new THREE.Mesh(
        new THREE.CircleGeometry(0.18, 32),
        new THREE.MeshStandardMaterial({ color: 0x0a0a0a, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
      );
      popMesh.position.set(0.85, 1.7, 0);
      popMesh.rotation.y = Math.PI / 2;
      micGroup.add(popMesh);
      
      micGroup.position.x = (i - 1) * 2.2;
      micSetups.push(micGroup);
      scene.add(micGroup);
    }

    // Back wall with acoustic treatment
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 8),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 })
    );
    backWall.position.set(0, 3, -4.5);
    scene.add(backWall);
    
    // Acoustic foam panels
    const foamPanels = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        const foam = new THREE.Mesh(
          new THREE.BoxGeometry(0.6, 0.6, 0.15),
          new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 1 })
        );
        foam.position.set(
          -3 + col * 0.8,
          2 + row * 0.8,
          -4.4
        );
        foamPanels.push(foam);
        scene.add(foam);
      }
    }
    
    // Monitor screens on wall
    for (let i = 0; i < 2; i++) {
      const monitor = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.6, 0.08),
        screenMaterial
      );
      monitor.position.set(-1.5 + i * 3, 3.5, -4.3);
      scene.add(monitor);
      
      const bezel = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 0.65, 0.05),
        new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.3 })
      );
      bezel.position.set(-1.5 + i * 3, 3.5, -4.25);
      scene.add(bezel);
    }
    
    // ON AIR sign - realistic LED panel
    const onAirBox = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.5, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 })
    );
    onAirBox.position.set(0, 5.2, -4.3);
    scene.add(onAirBox);
    
    const onAirLight = new THREE.Mesh(
      new THREE.PlaneGeometry(1.4, 0.35),
      new THREE.MeshStandardMaterial({
        color: isLive ? 0xff0000 : 0x330000,
        emissive: isLive ? 0xff0000 : 0x330000,
        emissiveIntensity: isLive ? 1.5 : 0.2,
      })
    );
    onAirLight.position.set(0, 5.2, -4.24);
    scene.add(onAirLight);

    // Studio chairs
    for (let i = 0; i < 3; i++) {
      const chair = new THREE.Group();
      
      const seat = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.32, 0.12, 32),
        fabricMaterial
      );
      seat.position.y = 0.7;
      chair.add(seat);
      
      const backrest = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.65, 0.12),
        fabricMaterial
      );
      backrest.position.set(0, 1.1, -0.22);
      chair.add(backrest);
      
      const wheelBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.28, 0.06, 5),
        metalMaterial
      );
      wheelBase.position.y = 0.12;
      chair.add(wheelBase);
      
      chair.position.set((i - 1) * 2.2, 0, 0.8);
      scene.add(chair);
    }
    
    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(15, 15),
      woodMaterial
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    scene.add(floor);
    
    // Ceiling
    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(15, 15),
      new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.9, side: THREE.DoubleSide })
    );
    ceiling.rotation.x = -Math.PI / 2;
    ceiling.position.y = 6;
    scene.add(ceiling);
    
    // Ceiling lights - studio lighting
    for (let i = 0; i < 3; i++) {
      const lightFixture = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.3, 0.15, 32),
        new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.6 })
      );
      lightFixture.position.set((i - 1) * 2.5, 5.85, -1);
      scene.add(lightFixture);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Studio spotlights
    for (let i = 0; i < 3; i++) {
      const spotlight = new THREE.SpotLight(0xffe8d6, 1.5, 25, Math.PI / 8, 0.4);
      spotlight.position.set((i - 1) * 2.5, 5.8, -1);
      spotlight.target.position.set((i - 1) * 2.2, 1, 0);
      spotlight.castShadow = true;
      scene.add(spotlight);
      scene.add(spotlight.target);
    }

    // Monitor backlights
    const monitorLight = new THREE.PointLight(0x00aaff, 0.7, 8);
    monitorLight.position.set(0, 3.5, -3.5);
    scene.add(monitorLight);
    
    // ON AIR indicator light
    const onAirGlow = new THREE.PointLight(
      isLive ? 0xff0000 : 0x003300,
      isLive ? 1.2 : 0.3,
      10
    );
    onAirGlow.position.set(0, 5.2, -3.5);
    scene.add(onAirGlow);



    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Gentle camera orbit
      camera.position.x = Math.sin(time * 0.1) * 1;
      camera.position.y = 2 + Math.sin(time * 0.15) * 0.3;
      camera.lookAt(0, 1.5, 0);

      // Microphone subtle movement
      micSetups.forEach((setup, i) => {
        setup.rotation.y = Math.sin(time * 0.3 + i) * 0.02;
      });

      // Update ON AIR indicator
      onAirLight.material.emissiveIntensity = isLive ? (1.5 + Math.sin(time * 4) * 0.3) : 0.2;
      onAirGlow.intensity = isLive ? (1.2 + Math.sin(time * 4) * 0.3) : 0.3;



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