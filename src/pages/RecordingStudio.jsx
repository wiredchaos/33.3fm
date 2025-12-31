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
import WatermarkRemoval from '@/components/monetization/WatermarkRemoval';
import Jukebox from '@/components/media/Jukebox';
import ChangeMachine from '@/components/monetization/ChangeMachine';
import ThreeDKeyboard from '@/components/interactive/3DKeyboard';
import MultiplayerChat from '@/components/social/MultiplayerChat';

export default function RecordingStudio() {
  const canvasRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showElevator, setShowElevator] = useState(false);
  const [showChangeMachine, setShowChangeMachine] = useState(false);
  const [hasWatermarkRemoval, setHasWatermarkRemoval] = useState(false);

  useEffect(() => {
    const checkWatermark = async () => {
      try {
        const user = await base44.auth.me();
        const purchases = await base44.entities.Purchase.filter({ 
          user_email: user.email,
          item_name: 'Watermark Removal'
        });
        setHasWatermarkRemoval(purchases.length > 0);
      } catch (error) {
        setHasWatermarkRemoval(false);
      }
    };
    checkWatermark();
  }, []);

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

    // Realistic Materials
    const woodMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d2817,
      roughness: 0.8,
      metalness: 0.1,
    });

    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0x444444,
      roughness: 0.3,
      metalness: 0.9,
    });

    const fabricMaterial = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.9,
      metalness: 0,
    });

    const ledMaterial = new THREE.MeshStandardMaterial({
      color: isRecording ? 0xff0000 : 0x00ff00,
      emissive: isRecording ? 0xff0000 : 0x00ff00,
      emissiveIntensity: isRecording ? 1 : 0.5,
    });

    const screenMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      emissive: 0x00ffff,
      emissiveIntensity: 0.3,
      roughness: 0.2,
      metalness: 0.7,
    });

    const limeGlowMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      emissive: 0x00ff00,
      emissiveIntensity: isSaving ? 0.8 : 0,
      transparent: true,
      opacity: isSaving ? 1 : 0,
    });

    // Particle system - floating audio particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      velocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: Math.random() * 0.03 + 0.01,
        z: (Math.random() - 0.5) * 0.02
      });
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Holographic display panels
    const holoDisplays = [];
    const holoPositions = [
      { x: -3, y: 3, z: -2, scale: 1 },
      { x: 3, y: 2.5, z: -1.5, scale: 0.8 }
    ];

    holoPositions.forEach((pos) => {
      const holoGeometry = new THREE.PlaneGeometry(1.5, 1);
      const holoMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      const holo = new THREE.Mesh(holoGeometry, holoMaterial);
      holo.position.set(pos.x, pos.y, pos.z);
      holo.scale.setScalar(pos.scale);
      holoDisplays.push(holo);
      scene.add(holo);

      // Holo scan lines
      const scanLines = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 0.02),
        new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 })
      );
      scanLines.position.copy(holo.position);
      scanLines.position.z += 0.01;
      holoDisplays.push(scanLines);
      scene.add(scanLines);
    });

    // Vocal booth walls - realistic
    const boothWalls = new THREE.Group();
    
    // Floor
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.1, 3),
      woodMaterial
    );
    floor.position.y = 0;
    boothWalls.add(floor);
    
    // Back wall with foam padding
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(3, 3.5, 0.2),
      fabricMaterial
    );
    backWall.position.set(0, 1.75, -1.4);
    boothWalls.add(backWall);
    
    // Side walls
    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 3.5, 3),
      fabricMaterial
    );
    leftWall.position.set(-1.4, 1.75, 0);
    boothWalls.add(leftWall);
    
    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 3.5, 3),
      fabricMaterial
    );
    rightWall.position.set(1.4, 1.75, 0);
    boothWalls.add(rightWall);
    
    // Acoustic foam panels
    for (let i = 0; i < 12; i++) {
      const foam = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.4, 0.1),
        new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 1 })
      );
      foam.position.set(
        -1.2 + (i % 3) * 0.8,
        2 + Math.floor(i / 3) * 0.5,
        -1.35
      );
      boothWalls.add(foam);
    }
    
    boothWalls.position.set(-3, 0, 0);
    scene.add(boothWalls);

    // Professional microphone setup
    const micStand = new THREE.Group();
    
    // Base
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.3, 0.05, 32),
      metalMaterial
    );
    base.position.y = 0.025;
    micStand.add(base);
    
    // Stand pole
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 1.5, 16),
      metalMaterial
    );
    pole.position.y = 0.8;
    micStand.add(pole);
    
    // Boom arm
    const boomArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.8, 16),
      metalMaterial
    );
    boomArm.position.set(0.3, 1.6, 0);
    boomArm.rotation.z = Math.PI / 3;
    micStand.add(boomArm);
    
    // Microphone body - realistic Neumann style
    const micBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.35, 32),
      new THREE.MeshStandardMaterial({ 
        color: 0x2a2a2a, 
        roughness: 0.4, 
        metalness: 0.8 
      })
    );
    micBody.position.set(0.5, 2, 0);
    micBody.rotation.z = Math.PI / 2;
    micStand.add(micBody);
    
    // Mic grille
    const micGrille = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 32, 32),
      new THREE.MeshStandardMaterial({ 
        color: 0x4a4a4a, 
        roughness: 0.6, 
        metalness: 0.9 
      })
    );
    micGrille.position.set(0.68, 2, 0);
    micStand.add(micGrille);
    
    // Shock mount
    const shockRing1 = new THREE.Mesh(
      new THREE.TorusGeometry(0.12, 0.008, 16, 32),
      metalMaterial
    );
    shockRing1.position.set(0.5, 2, 0);
    shockRing1.rotation.y = Math.PI / 2;
    micStand.add(shockRing1);
    
    // Pop filter
    const popFrame = new THREE.Mesh(
      new THREE.TorusGeometry(0.15, 0.01, 16, 32),
      metalMaterial
    );
    popFrame.position.set(0.35, 2, 0);
    popFrame.rotation.y = Math.PI / 2;
    micStand.add(popFrame);
    
    const popMesh = new THREE.Mesh(
      new THREE.CircleGeometry(0.15, 32),
      new THREE.MeshStandardMaterial({ 
        color: 0x1a1a1a, 
        transparent: true, 
        opacity: 0.6,
        side: THREE.DoubleSide 
      })
    );
    popMesh.position.set(0.35, 2, 0);
    popMesh.rotation.y = Math.PI / 2;
    micStand.add(popMesh);
    
    micStand.position.set(-3, 0, 0);
    scene.add(micStand);

    // Professional mixing console
    const mixingConsole = new THREE.Group();
    
    // Console base
    const consoleBase = new THREE.Mesh(
      new THREE.BoxGeometry(4.5, 0.8, 2.5),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.7 })
    );
    consoleBase.position.y = 0.4;
    mixingConsole.add(consoleBase);
    
    // Console surface - angled
    const consoleSurface = new THREE.Mesh(
      new THREE.BoxGeometry(4.5, 0.1, 2),
      new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.6 })
    );
    consoleSurface.position.y = 0.85;
    consoleSurface.rotation.x = -0.15;
    mixingConsole.add(consoleSurface);
    
    // Channel strips with faders
    for (let i = 0; i < 16; i++) {
      // Channel strip background
      const strip = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.02, 1.5),
        new THREE.MeshStandardMaterial({ color: 0x0a0a0a })
      );
      strip.position.set(-1.8 + (i * 0.23), 0.91, 0);
      strip.rotation.x = -0.15;
      mixingConsole.add(strip);
      
      // Fader
      const fader = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.04, 0.12),
        new THREE.MeshStandardMaterial({ 
          color: i % 4 === 0 ? 0xff0000 : 0x666666,
          roughness: 0.4,
          metalness: 0.6
        })
      );
      fader.position.set(-1.8 + (i * 0.23), 0.95, -0.2 + Math.random() * 0.4);
      fader.rotation.x = -0.15;
      mixingConsole.add(fader);
      
      // Knobs
      for (let j = 0; j < 4; j++) {
        const knob = new THREE.Mesh(
          new THREE.CylinderGeometry(0.03, 0.03, 0.02, 16),
          metalMaterial
        );
        knob.position.set(-1.8 + (i * 0.23), 0.95, 0.4 - (j * 0.15));
        knob.rotation.x = Math.PI / 2 - 0.15;
        mixingConsole.add(knob);
      }
    }

    // Studio monitors (speakers)
    for (let i = 0; i < 2; i++) {
      const speakerGroup = new THREE.Group();
      
      const speakerBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.6, 0.35),
        new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8 })
      );
      speakerGroup.add(speakerBox);
      
      const woofer = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.05, 32),
        new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.9 })
      );
      woofer.rotation.x = Math.PI / 2;
      woofer.position.z = 0.18;
      speakerGroup.add(woofer);
      
      const tweeter = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.03, 32),
        metalMaterial
      );
      tweeter.rotation.x = Math.PI / 2;
      tweeter.position.set(0, 0.2, 0.18);
      speakerGroup.add(tweeter);
      
      // LED
      const led = new THREE.Mesh(
        new THREE.CircleGeometry(0.01, 16),
        ledMaterial
      );
      led.position.set(0, -0.25, 0.18);
      speakerGroup.add(led);
      
      speakerGroup.position.set(i === 0 ? -1.2 : 1.2, 1.6, -0.5);
      speakerGroup.rotation.y = i === 0 ? 0.3 : -0.3;
      mixingConsole.add(speakerGroup);
    }
    
    // Computer monitors
    for (let i = 0; i < 2; i++) {
      const monitorStand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.1, 0.3, 16),
        metalMaterial
      );
      monitorStand.position.set(-0.6 + (i * 1.2), 1.2, -0.7);
      mixingConsole.add(monitorStand);
      
      const screen = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.5, 0.05),
        screenMaterial
      );
      screen.position.set(-0.6 + (i * 1.2), 1.6, -0.7);
      mixingConsole.add(screen);
      
      const screenBezel = new THREE.Mesh(
        new THREE.BoxGeometry(0.72, 0.52, 0.03),
        new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.3 })
      );
      screenBezel.position.set(-0.6 + (i * 1.2), 1.6, -0.68);
      mixingConsole.add(screenBezel);
    }
    
    mixingConsole.position.set(3, 0, 0);
    scene.add(mixingConsole);

    // Studio chair
    const chair = new THREE.Group();
    const seat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.3, 0.1, 32),
      fabricMaterial
    );
    seat.position.y = 0.7;
    chair.add(seat);
    
    const backrest = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.6, 0.1),
      fabricMaterial
    );
    backrest.position.set(0, 1.1, -0.2);
    chair.add(backrest);
    
    const wheelBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 0.05, 5),
      metalMaterial
    );
    wheelBase.position.y = 0.1;
    chair.add(wheelBase);
    
    chair.position.set(3, 0, 1.5);
    scene.add(chair);

    // Ceiling and walls
    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(15, 15),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9, side: THREE.DoubleSide })
    );
    ceiling.rotation.x = -Math.PI / 2;
    ceiling.position.y = 4;
    scene.add(ceiling);
    
    const studioFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(15, 15),
      woodMaterial
    );
    studioFloor.rotation.x = -Math.PI / 2;
    studioFloor.position.y = 0;
    scene.add(studioFloor);
    
    // Recording light
    const recordingLight = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.15, 0.3),
      new THREE.MeshStandardMaterial({
        color: isRecording ? 0xff0000 : 0x00ff00,
        emissive: isRecording ? 0xff0000 : 0x00ff00,
        emissiveIntensity: isRecording ? 1 : 0.5
      })
    );
    recordingLight.position.set(-3, 3.7, -1.5);
    scene.add(recordingLight);

    // 33.3FM 3D Watermark - Octane render style
    const watermarkGroup = new THREE.Group();
    
    // Create text using 3D shapes (simulating text)
    const watermarkMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.4,
      metalness: 0.8,
      roughness: 0.2
    });

    // "33.3FM" as floating 3D elements
    const textElements = [];
    for (let i = 0; i < 5; i++) {
      const element = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.25, 0.05),
        watermarkMaterial
      );
      element.position.set(-0.5 + i * 0.25, 0, 0);
      textElements.push(element);
      watermarkGroup.add(element);
    }

    // Octane-style glow ring around watermark
    const glowRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.8, 0.02, 16, 100),
      new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.3
      })
    );
    watermarkGroup.add(glowRing);

    watermarkGroup.position.set(0, 3.5, -4);
    watermarkGroup.rotation.x = -0.3;
    watermarkGroup.visible = !hasWatermarkRemoval; // Hide if user paid to remove
    scene.add(watermarkGroup);

    // Realistic studio lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Main ceiling lights
    const ceilingLight1 = new THREE.SpotLight(0xffe8d6, 1.2, 20, Math.PI / 6, 0.3);
    ceilingLight1.position.set(-3, 3.8, 0);
    ceilingLight1.castShadow = true;
    scene.add(ceilingLight1);

    const ceilingLight2 = new THREE.SpotLight(0xffe8d6, 1.2, 20, Math.PI / 6, 0.3);
    ceilingLight2.position.set(3, 3.8, 0);
    ceilingLight2.castShadow = true;
    scene.add(ceilingLight2);

    // Monitor backlights
    const monitorLight = new THREE.PointLight(0x00aaff, 0.6, 5);
    monitorLight.position.set(3, 1.6, -1);
    scene.add(monitorLight);

    // Recording indicator light
    const recordLight = new THREE.PointLight(
      isRecording ? 0xff0000 : 0x00ff00,
      isRecording ? 0.8 : 0.3,
      8
    );
    recordLight.position.set(-3, 3.5, -1.5);
    scene.add(recordLight);

    // Volumetric fog lights
    const volumetricLights = [];
    for (let i = 0; i < 3; i++) {
      const vLight = new THREE.SpotLight(i === 1 ? 0xff0000 : 0x00ffff, 0.5, 15, Math.PI / 6, 0.5);
      vLight.position.set((i - 1) * 5, 6, -2);
      vLight.target.position.set((i - 1) * 5, 0, 0);
      scene.add(vLight);
      scene.add(vLight.target);
      volumetricLights.push(vLight);
    }

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Camera movement - gentle shift between booth and control
      camera.position.x = 6 + Math.sin(time * 0.08) * 2;
      camera.position.y = 3 + Math.sin(time * 0.1) * 0.5;
      camera.lookAt(0, 2, 0);

      // Mic stand subtle movement
      micStand.rotation.y = Math.sin(time * 0.2) * 0.02;

      // Recording light pulse
      recordLight.intensity = isRecording ? (0.8 + Math.sin(time * 3) * 0.2) : 0.3;
      recordingLight.material.emissiveIntensity = isRecording ? (1 + Math.sin(time * 3) * 0.2) : 0.5;



      // Particle animation
      const positions = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i].x;
        positions[i * 3 + 1] += velocities[i].y;
        positions[i * 3 + 2] += velocities[i].z;

        if (positions[i * 3 + 1] > 10) {
          positions[i * 3 + 1] = 0;
          positions[i * 3] = (Math.random() - 0.5) * 20;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y = time * 0.05;

      // Holographic displays
      holoDisplays.forEach((holo, i) => {
        if (i % 2 === 0) {
          holo.material.emissiveIntensity = 0.5 + Math.sin(time * 3 + i) * 0.2;
          holo.rotation.y = Math.sin(time * 0.5 + i) * 0.1;
        } else {
          holo.position.y += Math.sin(time * 10 + i) * 0.005;
        }
      });

      // Volumetric lights pulse
      volumetricLights.forEach((light, i) => {
        light.intensity = 0.5 + Math.sin(time * 2 + i) * 0.2;
      });

      // Watermark animation
      watermarkGroup.rotation.y = time * 0.3;
      textElements.forEach((el, i) => {
        el.position.y = Math.sin(time * 2 + i * 0.5) * 0.1;
      });
      glowRing.rotation.z = time * 0.5;

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

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
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
            <WatermarkRemoval />
            <button
              onClick={() => setShowChangeMachine(true)}
              className="px-3 py-2 rounded-full text-xs uppercase tracking-wider bg-gradient-to-r from-cyan-400/20 to-purple-600/20 border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/30 transition-all flex items-center gap-2"
            >
              <Music className="w-4 h-4" />
              Get CHAOS XP
            </button>
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

        {/* Spotify Live Embed */}
        <div className="absolute top-24 left-6 pointer-events-auto space-y-4">
          <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-4 w-80">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm uppercase tracking-wider text-white/60">33.3FM LIVE</h3>
              <Music className="w-4 h-4 text-red-400 animate-pulse" />
            </div>
            <iframe 
              style={{borderRadius: '12px'}}
              src="https://open.spotify.com/embed/playlist/2VwOYrB1C93gNIPiBZNxhH?utm_source=generator&theme=0"
              width="100%" 
              height="152" 
              frameBorder="0" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
            />
          </div>
          <ThreeDKeyboard onNotePlay={(note) => console.log('Note played:', note)} />
        </div>

        {/* Social Features */}
        <div className="fixed top-24 right-6 z-30 w-96 pointer-events-auto space-y-4">
          <MultiplayerChat room="studio" />
        </div>

        {/* Jukebox */}
        <div className="fixed bottom-24 right-6 z-30 w-96 pointer-events-auto">
          <Jukebox isLive={isRecording} />
        </div>

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

      {/* Change Machine */}
      <ChangeMachine isOpen={showChangeMachine} onClose={() => setShowChangeMachine(false)} />
    </div>
  );
}