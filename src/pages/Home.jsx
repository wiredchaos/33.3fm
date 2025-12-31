import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import * as THREE from 'three';
import { Radio, Mic, Music, User, Radio as Station, Sparkles, Layers, Crown, ShoppingBag, User as UserIcon, TrendingUp } from 'lucide-react';
import NeuroConcierge from '@/components/navigation/NeuroConcierge';
import ElevatorNav from '@/components/navigation/ElevatorNav';
import ElevatorDoors from '@/components/navigation/ElevatorDoors';
import SocialAuth from '@/components/auth/SocialAuth';

export default function Home() {
  const canvasRef = useRef(null);
  const [showTour, setShowTour] = useState(false);
  const [showElevator, setShowElevator] = useState(false);
  const [showDoors, setShowDoors] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [showSocialAuth, setShowSocialAuth] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Liquid glass material
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00ffff,
      metalness: 0.1,
      roughness: 0.1,
      transparent: true,
      opacity: 0.15,
      transmission: 0.9,
      thickness: 0.5,
    });

    // Create floating glass panels
    const panels = [];
    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.PlaneGeometry(2, 3, 32, 32);
      const panel = new THREE.Mesh(geometry, glassMaterial);
      panel.position.x = (i - 2) * 3;
      panel.position.z = -2;
      panels.push(panel);
      scene.add(panel);
    }

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Cyan accent light
    const cyanLight = new THREE.PointLight(0x00ffff, 1, 100);
    cyanLight.position.set(0, 5, 5);
    scene.add(cyanLight);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      panels.forEach((panel, i) => {
        panel.position.y = Math.sin(time + i * 0.5) * 0.3;
        panel.rotation.y = Math.sin(time * 0.3 + i) * 0.1;
      });

      cyanLight.intensity = 0.8 + Math.sin(time * 2) * 0.2;
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
  }, []);

  const environments = [
    {
      name: 'Discover',
      description: 'Content feed & recommendations',
      icon: TrendingUp,
      path: 'Discover',
      tier: 'FREE'
    },
    {
      name: 'Podcast Booth',
      description: 'Voice-first broadcast environment',
      icon: Mic,
      path: 'PodcastBooth',
      tier: 'CORE'
    },
    {
      name: 'Recording Studio',
      description: 'Music creation & production',
      icon: Music,
      path: 'RecordingStudio',
      tier: 'CORE'
    },
    {
      name: 'Artist Profile',
      description: 'Free discovery portal',
      icon: User,
      path: 'ArtistProfile',
      tier: 'FREE'
    },
    {
      name: 'Broadcast Portal',
      description: 'Artist-owned station',
      icon: Station,
      path: 'BroadcastPortal',
      tier: 'PAID'
    }
  ];

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-black">
      {showDoors && <ElevatorDoors onDoorsOpen={() => setShowDoors(false)} />}
      
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0" 
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      />
      
      <div 
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4"
        style={{ transform: `translateY(${scrollY * -0.2}px)` }}
      >
        {/* Logo & Title */}
        <div className="text-center mb-16">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Radio className="w-12 h-12 text-cyan-400" />
          </div>
          <h1 className="text-6xl md:text-8xl font-light tracking-tight text-white mb-4">
            33.3FM
          </h1>
          <p className="text-xl md:text-2xl text-cyan-400 font-light tracking-wide">
            DOGECHAIN
          </p>
          <div className="mt-4 text-sm text-white/40 uppercase tracking-widest">
            WIRED CHAOS META · CRAB 3DT TRINITY
          </div>
          
          {/* Tour & Navigation Buttons */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => setShowTour(true)}
              className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-purple-600 text-white rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-cyan-400/30"
            >
              <Sparkles className="w-5 h-5" />
              Start NEURO CONCIERGE Tour
            </button>
            <button
              onClick={() => setShowElevator(true)}
              className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-full flex items-center gap-2 hover:bg-white/20 transition-all"
            >
              <Layers className="w-5 h-5" />
              3D Elevator
            </button>
          </div>

          {/* Monetization Quick Links */}
          <div className="mt-4 flex gap-3">
            <Link
              to={createPageUrl('Subscription')}
              className="px-4 py-2 bg-white/5 border border-red-500/30 text-red-400 rounded-full text-sm flex items-center gap-2 hover:bg-red-500/10 transition-all"
            >
              <Crown className="w-4 h-4" />
              Subscribe
            </Link>
            <Link
              to={createPageUrl('Store')}
              className="px-4 py-2 bg-white/5 border border-cyan-400/30 text-cyan-400 rounded-full text-sm flex items-center gap-2 hover:bg-cyan-400/10 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              Store
            </Link>
            <button
              onClick={() => setShowSocialAuth(true)}
              className="px-4 py-2 bg-white/5 border border-purple-400/30 text-purple-400 rounded-full text-sm flex items-center gap-2 hover:bg-purple-400/10 transition-all"
            >
              <User className="w-4 h-4" />
              Connect
            </button>
          </div>
        </div>

        {/* Environment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl w-full">
          {environments.map((env) => (
            <Link
              key={env.path}
              to={createPageUrl(env.path)}
              className="group relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-cyan-400/50 transition-all duration-500 hover:bg-black/60"
            >
              {/* Tier Badge */}
              <div className={`absolute top-4 right-4 text-xs px-2 py-1 rounded-full ${
                env.tier === 'FREE' ? 'bg-cyan-400/20 text-cyan-400' :
                env.tier === 'PAID' ? 'bg-red-500/20 text-red-400' :
                'bg-white/10 text-white/60'
              }`}>
                {env.tier}
              </div>

              {/* Icon */}
              <div className="mb-6 flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-transparent flex items-center justify-center group-hover:from-cyan-400/30 transition-all duration-500">
                  <env.icon className="w-8 h-8 text-cyan-400" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-light text-white mb-2 tracking-wide">
                {env.name}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                {env.description}
              </p>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-cyan-400/0 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-white/30 text-xs uppercase tracking-widest">
          Liquid Glass iOS · Broadcast Infrastructure
        </div>
      </div>

      {/* NEURO CONCIERGE Tour */}
      <NeuroConcierge isActive={showTour} onClose={() => setShowTour(false)} />

      {/* 3D Elevator Navigation */}
      <ElevatorNav isOpen={showElevator} onClose={() => setShowElevator(false)} />

      {/* Social Auth Modal */}
      {showSocialAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative">
            <button
              onClick={() => setShowSocialAuth(false)}
              className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              ×
            </button>
            <SocialAuth onSuccess={() => setShowSocialAuth(false)} />
          </div>
        </div>
      )}
    </div>
  );
}