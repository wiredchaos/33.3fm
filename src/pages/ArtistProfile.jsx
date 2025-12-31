import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import * as THREE from 'three';
import { ArrowLeft, User, ArrowUpRight, Plus } from 'lucide-react';
import SocialAuth from '@/components/auth/SocialAuth';

export default function ArtistProfile() {
  const canvasRef = useRef(null);
  const [user, setUser] = useState(null);
  const [showSocialAuth, setShowSocialAuth] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    } catch (error) {
      console.error('User not logged in');
    }
  };

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
        {/* Permanent 33.3FM Branding - Top Left */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <div className="backdrop-blur-md bg-black/60 border border-cyan-400/30 rounded-xl px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">33.3</span>
              </div>
              <div>
                <div className="text-cyan-400 font-bold text-sm tracking-wide">33.3FM</div>
                <div className="text-white/40 text-[10px] uppercase tracking-wider">DOGECHAIN</div>
              </div>
            </div>
          </div>
        </div>

        {/* Permanent WIRED CHAOS META Branding - Bottom Right */}
        <div className="absolute bottom-4 right-4 pointer-events-none">
          <div className="backdrop-blur-md bg-black/60 border border-purple-400/30 rounded-xl px-3 py-2">
            <div className="text-purple-400 font-bold text-xs uppercase tracking-widest">
              WIRED CHAOS META
            </div>
            <div className="text-white/40 text-[9px] uppercase tracking-wider mt-0.5">
              Powered by CRAB 3DT TRINITY
            </div>
          </div>
        </div>

        {/* Top Bar */}
        <div className="absolute top-4 right-4 p-2 flex items-center justify-end gap-3 pointer-events-auto">
          <Link 
            to={createPageUrl('Home')}
            className="backdrop-blur-md bg-black/40 border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2 text-white/60 hover:text-cyan-400 hover:border-cyan-400/50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Back</span>
          </Link>

          <span className="backdrop-blur-md bg-black/40 border border-cyan-400/30 rounded-lg px-3 py-1.5 text-cyan-400 text-xs uppercase tracking-wider">
            Free Tier
          </span>
        </div>

        {/* Central Content */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto px-4">
          <div className="text-center max-w-md w-full">
            {/* Artist Info */}
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-4 backdrop-blur-md bg-white/5 border border-cyan-400/30 rounded-2xl flex items-center justify-center overflow-hidden">
                {user?.imported_avatar ? (
                  <img src={user.imported_avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-cyan-400" />
                )}
              </div>
              <h1 className="text-4xl font-light text-white tracking-wide mb-2">
                {user?.imported_name || user?.full_name || 'Artist Name'}
              </h1>
              <p className="text-cyan-400 text-sm uppercase tracking-widest mb-3">
                {user?.imported_bio || 'Electronic · Producer'}
              </p>
              {user?.social_connected && (
                <div className="inline-block backdrop-blur-md bg-white/5 border border-cyan-400/30 rounded-full px-3 py-1 mb-2">
                  <div className="text-[10px] text-cyan-400 uppercase tracking-wider">
                    Connected via {user.social_connected}
                  </div>
                </div>
              )}
              <button
                onClick={() => setShowSocialAuth(true)}
                className="inline-flex items-center gap-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-white/60 hover:text-cyan-400 hover:border-cyan-400/30 transition-all"
              >
                <Plus className="w-3 h-3" />
                Import Social Profile
              </button>
              <div className="mt-3 inline-block backdrop-blur-md bg-black/40 border border-white/10 rounded-full px-4 py-1.5">
                <div className="text-[10px] text-white/40 uppercase tracking-wider">
                  Powered by 33.3FM DOGECHAIN
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="space-y-3 mb-6">
              {links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  className="block backdrop-blur-md bg-white/5 border border-white/10 rounded-xl px-6 py-3.5 hover:bg-white/10 hover:border-cyan-400/50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-light tracking-wide">{link.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-cyan-400 transition-colors" />
                  </div>
                </a>
              ))}
            </div>

            {/* Upgrade CTA */}
            <div className="backdrop-blur-md bg-gradient-to-br from-cyan-400/10 to-purple-600/10 border border-cyan-400/30 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-light text-white">
                  Upgrade to Remove Branding
                </h3>
                <span className="text-[10px] text-white/40 uppercase tracking-wider">Premium</span>
              </div>
              <p className="text-xs text-white/60 mb-4 leading-relaxed">
                Remove 33.3FM watermarks, launch your own branded radio station with live streaming, scheduling, and full creative control
              </p>
              <Link
                to={createPageUrl('BroadcastPortal')}
                className="inline-block w-full px-4 py-2.5 bg-gradient-to-r from-cyan-400 to-purple-600 text-white rounded-xl text-sm uppercase tracking-wider hover:from-cyan-300 hover:to-purple-500 transition-all shadow-lg shadow-cyan-400/20"
              >
                Upgrade to Broadcast Portal
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Info - Left Side */}
        <div className="absolute bottom-4 left-4 max-w-md">
          <div className="backdrop-blur-xl bg-black/60 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400/20 to-transparent flex items-center justify-center border border-cyan-400/30">
                <User className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-light text-white tracking-wide">
                  Free 3D Profile
                </h2>
                <div className="text-xs text-white/40 uppercase tracking-wider">Artist Discovery Portal</div>
              </div>
            </div>
            <p className="text-xs text-white/60 leading-relaxed mb-3">
              Your free 3D gallery space with permanent 33.3FM branding. Modern link-in-bio alternative with fast loading and professional presentation.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wider">
              <span className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-400 border border-cyan-400/30">
                Free Tier
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 text-white/60 border border-white/10">
                3D Gallery
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-400/20 text-purple-400 border border-purple-400/30">
                33.3FM Branded
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Social Auth Modal */}
      {showSocialAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm px-4">
          <div className="relative">
            <button
              onClick={() => setShowSocialAuth(false)}
              className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-10"
            >
              ×
            </button>
            <SocialAuth onSuccess={() => { setShowSocialAuth(false); loadUser(); }} />
          </div>
        </div>
      )}
    </div>
  );
}