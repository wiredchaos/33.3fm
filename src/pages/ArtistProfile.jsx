import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import * as THREE from 'three';
import { ArrowLeft, User, ArrowUpRight, Plus, Package, Eye } from 'lucide-react';
import SocialAuth from '@/components/auth/SocialAuth';
import FollowButton from '@/components/social/FollowButton';
import FanInteractions from '@/components/social/FanInteractions';
import PhygitalManager from '@/components/phygital/PhygitalManager';
import VirtualTryOn from '@/components/phygital/VirtualTryOn';

export default function ArtistProfile() {
  const canvasRef = useRef(null);
  const [user, setUser] = useState(null);
  const [showSocialAuth, setShowSocialAuth] = useState(false);
  const [showPhygital, setShowPhygital] = useState(false);
  const [showTryOn, setShowTryOn] = useState(false);
  const [phygitalItems, setPhygitalItems] = useState([]);

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
    const loadPhygitalItems = async () => {
      try {
        const currentUser = await base44.auth.me();
        const items = await base44.entities.PhygitalItem.filter({ user_email: currentUser.email });
        setPhygitalItems(items);
      } catch (error) {
        console.error('Failed to load phygital items');
      }
    };
    loadPhygitalItems();
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 8, 25);

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 10);

    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Premium Materials
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x88ccff,
      transmission: 0.95,
      opacity: 0.1,
      metalness: 0,
      roughness: 0.05,
      thickness: 0.5,
      envMapIntensity: 1.5,
      clearcoat: 1,
      clearcoatRoughness: 0.1
    });

    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.5,
      roughness: 0.1,
      metalness: 1
    });

    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      roughness: 0.2,
      metalness: 0.8
    });

    // Futuristic floor with grid
    const floorGeometry = new THREE.PlaneGeometry(40, 40, 40, 40);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Grid overlay
    const gridHelper = new THREE.GridHelper(40, 40, 0x00ffff, 0x00ffff);
    gridHelper.material.opacity = 0.1;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Central holographic platform
    const platformGeometry = new THREE.CylinderGeometry(3, 3.5, 0.3, 8);
    const platform = new THREE.Mesh(platformGeometry, metalMaterial);
    platform.position.y = 0.15;
    platform.castShadow = true;
    scene.add(platform);

    // Holographic rings around platform
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.5 + i * 0.5, 0.05, 8, 64),
        new THREE.MeshBasicMaterial({
          color: 0x00ffff,
          transparent: true,
          opacity: 0.4 - i * 0.1
        })
      );
      ring.position.y = 0.3 + i * 0.2;
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
    }

    // Avatar pedestal - premium crystal
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 1, 2, 8),
      glassMaterial
    );
    pedestal.position.set(0, 1, 0);
    pedestal.castShadow = true;
    scene.add(pedestal);

    // Floating avatar sphere - high-end
    const avatarSphere = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1, 2),
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.9,
        opacity: 0.8,
        metalness: 0.1,
        roughness: 0.05,
        clearcoat: 1
      })
    );
    avatarSphere.position.set(0, 3, 0);
    avatarSphere.castShadow = true;
    scene.add(avatarSphere);

    // Energy core inside avatar
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8
      })
    );
    core.position.copy(avatarSphere.position);
    scene.add(core);

    // Phygital item display pedestals
    const phygitalPedestals = [];
    const phygitalItems = [];
    const itemPositions = [
      { x: -4, z: -2 },
      { x: 4, z: -2 },
      { x: -4, z: 2 },
      { x: 4, z: 2 }
    ];

    itemPositions.forEach((pos, i) => {
      const itemPedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.6, 1.5, 8),
        glassMaterial
      );
      itemPedestal.position.set(pos.x, 0.75, pos.z);
      itemPedestal.castShadow = true;
      scene.add(itemPedestal);
      phygitalPedestals.push(itemPedestal);

      // Floating item placeholder
      const item = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.8, 0.8),
        new THREE.MeshPhysicalMaterial({
          color: 0xff00ff,
          emissive: 0xff00ff,
          emissiveIntensity: 0.3,
          transparent: true,
          opacity: 0.7,
          metalness: 0.8,
          roughness: 0.2
        })
      );
      item.position.set(pos.x, 2.5, pos.z);
      item.castShadow = true;
      scene.add(item);
      phygitalItems.push(item);

      // Item glow ring
      const glow = new THREE.Mesh(
        new THREE.TorusGeometry(0.6, 0.03, 8, 32),
        new THREE.MeshBasicMaterial({ color: 0xff00ff })
      );
      glow.position.copy(item.position);
      glow.rotation.x = Math.PI / 2;
      scene.add(glow);
    });

    // Holographic info panels
    const infoPanels = [];
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const radius = 6;
      
      const panel = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 1.2),
        new THREE.MeshBasicMaterial({
          color: 0x00ffff,
          transparent: true,
          opacity: 0.3,
          side: THREE.DoubleSide
        })
      );
      panel.position.set(
        Math.sin(angle) * radius,
        2,
        Math.cos(angle) * radius
      );
      panel.lookAt(0, 2, 0);
      scene.add(panel);
      infoPanels.push(panel);
    }

    // Dynamic lighting system
    const ambientLight = new THREE.AmbientLight(0x222244, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(5, 10, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    const cyanLight = new THREE.PointLight(0x00ffff, 2, 20);
    cyanLight.position.set(0, 5, 0);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0xff00ff, 1.5, 15);
    purpleLight.position.set(-5, 3, 5);
    scene.add(purpleLight);

    // Spotlights on items
    phygitalItems.forEach((item) => {
      const spotlight = new THREE.SpotLight(0xff00ff, 1, 10, Math.PI / 6);
      spotlight.position.set(item.position.x, 6, item.position.z);
      spotlight.target = item;
      spotlight.castShadow = true;
      scene.add(spotlight);
    });



    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Cinematic camera orbit
      camera.position.x = Math.sin(time * 0.1) * 12;
      camera.position.z = Math.cos(time * 0.1) * 12;
      camera.position.y = 3 + Math.sin(time * 0.05) * 1;
      camera.lookAt(0, 2, 0);

      // Avatar sphere - complex rotation
      avatarSphere.rotation.y = time * 0.5;
      avatarSphere.rotation.x = Math.sin(time * 0.3) * 0.2;
      avatarSphere.position.y = 3 + Math.sin(time * 2) * 0.1;

      // Core pulse
      core.scale.setScalar(1 + Math.sin(time * 4) * 0.2);
      core.material.opacity = 0.6 + Math.sin(time * 3) * 0.3;

      // Platform rotation
      platform.rotation.y = time * 0.2;

      // Phygital items animation
      phygitalItems.forEach((item, i) => {
        item.rotation.y = time * 0.8 + i;
        item.position.y = 2.5 + Math.sin(time * 3 + i) * 0.15;
      });

      // Info panels fade
      infoPanels.forEach((panel, i) => {
        panel.material.opacity = 0.2 + Math.sin(time * 2 + i) * 0.1;
      });

      // Dynamic lighting
      cyanLight.intensity = 1.8 + Math.sin(time * 2) * 0.4;
      purpleLight.intensity = 1.3 + Math.cos(time * 2.5) * 0.3;



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

            {/* Follow Button */}
            <div className="mb-6 flex justify-center">
              <FollowButton 
                artistEmail={user?.email || 'artist@example.com'} 
                artistName={user?.imported_name || user?.full_name || 'Artist'} 
              />
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

            {/* Phygital Collection Button */}
            <div className="mb-4 flex gap-3 justify-center">
              <button
                onClick={() => setShowPhygital(true)}
                className="backdrop-blur-md bg-gradient-to-r from-cyan-400/20 to-purple-600/20 border border-cyan-400/30 rounded-xl px-6 py-3 hover:from-cyan-400/30 hover:to-purple-600/30 transition-all flex items-center gap-2"
              >
                <Package className="w-4 h-4 text-cyan-400" />
                <span className="text-white font-medium">Phygital Items</span>
                {phygitalItems.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-black text-xs font-bold">
                    {phygitalItems.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowTryOn(true)}
                className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl px-6 py-3 hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <Eye className="w-4 h-4 text-white/60" />
                <span className="text-white/80 font-medium">Virtual Try-On</span>
              </button>
            </div>

            {/* Fan Interactions - Optimized Layout */}
            <div className="mb-6 mx-auto" style={{ maxWidth: '28rem' }}>
              <FanInteractions 
                artistEmail={user?.email || 'artist@example.com'}
                artistName={user?.imported_name || user?.full_name || 'Artist'}
              />
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

        {/* Bottom Left - Fan Wall Monitor Label */}
        <div className="absolute bottom-20 left-8 pointer-events-auto">
          <div className="backdrop-blur-xl bg-black/60 border border-cyan-400/30 rounded-xl px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-400 text-xs uppercase tracking-wider">Live Fan Wall</span>
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

      {/* Phygital Manager Modal */}
      {showPhygital && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm px-4 overflow-y-auto py-8">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setShowPhygital(false)}
              className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-10"
            >
              ×
            </button>
            <PhygitalManager onItemAdded={(item) => {
              setPhygitalItems([...phygitalItems, item]);
            }} />
          </div>
        </div>
      )}

      {/* Virtual Try-On Modal */}
      {showTryOn && phygitalItems.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm px-4">
          <div className="relative">
            <button
              onClick={() => setShowTryOn(false)}
              className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-10"
            >
              ×
            </button>
            <VirtualTryOn itemId={phygitalItems[0]?.id} />
          </div>
        </div>
      )}
    </div>
  );
}