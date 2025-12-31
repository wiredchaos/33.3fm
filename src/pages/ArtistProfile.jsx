import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import * as THREE from 'three';
import { ArrowLeft, User, ArrowUpRight } from 'lucide-react';

export default function ArtistProfile() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Gallery Materials - Clean iOS Aesthetic
    const whiteMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5f5f5,
      roughness: 0.2,
      metalness: 0.1,
    });

    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0xe0e0e0,
      roughness: 0.3,
      metalness: 0.2,
    });

    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.4,
      roughness: 0.2,
      metalness: 0.8,
    });

    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.1,
      metalness: 0.3,
    });

    // Gallery space - iOS clean aesthetic
    const galleryFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      floorMaterial
    );
    galleryFloor.rotation.x = -Math.PI / 2;
    galleryFloor.position.y = 0;
    scene.add(galleryFloor);
    
    const galleryCeiling = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, side: THREE.DoubleSide })
    );
    galleryCeiling.rotation.x = -Math.PI / 2;
    galleryCeiling.position.y = 6;
    scene.add(galleryCeiling);
    
    // Main feature wall - white
    const mainWall = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 6),
      whiteMaterial
    );
    mainWall.position.set(0, 3, -5);
    scene.add(mainWall);
    
    // Avatar pedestal - gallery style
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.7, 1.5, 32),
      whiteMaterial
    );
    pedestal.position.set(0, 0.75, -2);
    scene.add(pedestal);
    
    // Artist avatar sphere - modern sculpture
    const avatarSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 64, 64),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.05,
        metalness: 0.95,
      })
    );
    avatarSphere.position.set(0, 2.2, -2);
    scene.add(avatarSphere);
    
    // Accent ring around avatar
    const accentRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.8, 0.04, 16, 64),
      accentMaterial
    );
    accentRing.position.copy(avatarSphere.position);
    accentRing.rotation.x = Math.PI / 2;
    scene.add(accentRing);
    
    // Link display panels - minimalist frames
    const linkPanels = [];
    for (let i = 0; i < 4; i++) {
      const panel = new THREE.Group();
      
      // Panel backing
      const back = new THREE.Mesh(
        new THREE.BoxGeometry(3.5, 0.65, 0.08),
        whiteMaterial
      );
      panel.add(back);
      
      // Panel frame
      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(3.6, 0.7, 0.06),
        frameMaterial
      );
      frame.position.z = -0.05;
      panel.add(frame);
      
      // Accent line
      const accent = new THREE.Mesh(
        new THREE.BoxGeometry(3.5, 0.02, 0.01),
        accentMaterial
      );
      accent.position.set(0, -0.3, 0.05);
      panel.add(accent);
      
      panel.position.set(-4 + (i % 2) * 8, 3.5 - Math.floor(i / 2) * 1.2, -4.9);
      linkPanels.push(panel);
      scene.add(panel);
    }
    
    // Side walls with minimal art
    for (let side = 0; side < 2; side++) {
      const wall = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 6),
        whiteMaterial
      );
      wall.position.set(side === 0 ? -7 : 7, 3, 0);
      wall.rotation.y = side === 0 ? Math.PI / 2 : -Math.PI / 2;
      scene.add(wall);
      
      // Art pieces on side walls
      for (let i = 0; i < 2; i++) {
        const artFrame = new THREE.Mesh(
          new THREE.BoxGeometry(1.5, 1.2, 0.1),
          frameMaterial
        );
        artFrame.position.set(
          side === 0 ? -6.9 : 6.9,
          2.5 + i * 0.2,
          -2 + i * 2
        );
        artFrame.rotation.y = side === 0 ? Math.PI / 2 : -Math.PI / 2;
        scene.add(artFrame);
      }
    }

    // Gallery track lighting
    for (let i = 0; i < 5; i++) {
      const trackLight = new THREE.SpotLight(0xffffff, 1.8, 20, Math.PI / 8, 0.3);
      trackLight.position.set(-4 + i * 2, 5.8, 0);
      trackLight.target.position.set(-4 + i * 2, 0, 0);
      trackLight.castShadow = true;
      scene.add(trackLight);
      scene.add(trackLight.target);
    }
    
    // Avatar spotlight
    const avatarSpot = new THREE.SpotLight(0xffffff, 2.5, 15, Math.PI / 6, 0.2);
    avatarSpot.position.set(0, 5.5, -1);
    avatarSpot.target.position.set(0, 2.2, -2);
    scene.add(avatarSpot);
    scene.add(avatarSpot.target);
    
    // Accent lighting
    const accentLight = new THREE.PointLight(0x00ffff, 0.8, 10);
    accentLight.position.set(0, 2.2, -1);
    scene.add(accentLight);

    // Ambient gallery lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-5, 4, 5);
    scene.add(fillLight);



    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Minimal parallax
      const mouseX = 0;
      const mouseY = 0;
      camera.position.x = mouseX * 0.3;
      camera.position.y = mouseY * 0.3;
      camera.lookAt(0, 0, 0);

      // Avatar sphere rotation
      avatarSphere.rotation.y = time * 0.3;
      avatarSphere.rotation.x = Math.sin(time * 0.2) * 0.1;
      
      // Accent ring pulse
      accentRing.scale.setScalar(1 + Math.sin(time * 2) * 0.03);
      accentMaterial.emissiveIntensity = 0.4 + Math.sin(time * 3) * 0.1;

      // Link panels subtle depth
      linkPanels.forEach((panel, i) => {
        panel.position.z = -4.9 + Math.sin(time * 0.6 + i * 0.8) * 0.02;
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
  }, []);

  const links = [
    { title: 'Latest Release', url: '#' },
    { title: 'Live Schedule', url: '#' },
    { title: 'Discography', url: '#' },
    { title: 'Contact', url: '#' }
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
              Artist Profile
            </div>
            <span className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-400 text-xs uppercase tracking-wider">
              Free
            </span>
          </div>
        </div>

        {/* Central Content */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto px-4">
          <div className="text-center max-w-md w-full">
            {/* Artist Info */}
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-4" />
              <h1 className="text-4xl font-light text-white tracking-wide mb-2">
                Artist Name
              </h1>
              <p className="text-cyan-400 text-sm uppercase tracking-widest">
                Electronic · Producer
              </p>
            </div>

            {/* Links */}
            <div className="space-y-3 mb-8">
              {links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  className="block backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl px-6 py-3 hover:bg-white/10 hover:border-cyan-400/50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-light">{link.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-cyan-400 transition-colors" />
                  </div>
                </a>
              ))}
            </div>

            {/* Upgrade CTA */}
            <div className="backdrop-blur-md bg-gradient-to-br from-cyan-400/10 to-transparent border border-cyan-400/30 rounded-2xl p-4">
              <h3 className="text-base font-light text-white mb-1">
                Upgrade to Broadcast Portal
              </h3>
              <p className="text-xs text-white/60 mb-3">
                Launch your own radio station with live streaming
              </p>
              <Link
                to={createPageUrl('BroadcastPortal')}
                className="inline-block px-4 py-1.5 bg-cyan-400 text-black rounded-full text-xs uppercase tracking-wider hover:bg-cyan-300 transition-colors"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <User className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-light text-white tracking-wide">
                Free Profile Portal
              </h2>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
              Your free 3D discovery space. A modern link-in-bio replacement designed for fast loading 
              and artist presentation. Upgrade to unlock full broadcast capabilities.
            </p>
            <div className="mt-4 flex gap-2 text-xs uppercase tracking-wider">
              <span className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-400">
                Discovery
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white/60">
                Free Tier
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white/60">
                Gallery Mode
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}