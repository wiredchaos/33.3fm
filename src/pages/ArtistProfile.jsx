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

    // Materials
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.05,
      transparent: true,
      opacity: 0.15,
      transmission: 0.95,
      thickness: 0.5,
    });

    const cyanGlowMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.3,
    });

    // Central identity panel - main glass surface
    const mainPanelGeometry = new THREE.PlaneGeometry(4, 5);
    const mainPanel = new THREE.Mesh(mainPanelGeometry, glassMaterial);
    mainPanel.position.z = 0;
    scene.add(mainPanel);

    // Panel frame with cyan glow
    const frameGeometry = new THREE.PlaneGeometry(4.1, 5.1);
    const frameEdges = new THREE.EdgesGeometry(frameGeometry);
    const frameMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.6 });
    const frame = new THREE.LineSegments(frameEdges, frameMaterial);
    frame.position.z = -0.05;
    scene.add(frame);

    // Artist avatar placeholder (floating glass sphere)
    const avatarGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const avatar = new THREE.Mesh(avatarGeometry, glassMaterial);
    avatar.position.set(0, 1.5, 0.2);
    scene.add(avatar);

    const avatarGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.85, 32, 32),
      cyanGlowMaterial
    );
    avatarGlow.position.copy(avatar.position);
    scene.add(avatarGlow);

    // Floating link cards (minimal)
    const linkCards = [];
    for (let i = 0; i < 4; i++) {
      const cardGeometry = new THREE.PlaneGeometry(3, 0.6);
      const card = new THREE.Mesh(cardGeometry, glassMaterial);
      card.position.set(0, 0.5 - i * 0.8, 0.1);
      linkCards.push(card);
      scene.add(card);

      // Card edge highlight
      const cardEdges = new THREE.EdgesGeometry(cardGeometry);
      const cardFrame = new THREE.LineSegments(cardEdges, frameMaterial);
      cardFrame.position.copy(card.position);
      cardFrame.position.z -= 0.02;
      scene.add(cardFrame);
    }

    // Background subtle glass panels
    const bgPanels = [];
    for (let i = 0; i < 3; i++) {
      const bgPanel = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 6),
        new THREE.MeshPhysicalMaterial({
          color: 0x00ffff,
          metalness: 0.1,
          roughness: 0.1,
          transparent: true,
          opacity: 0.05,
          transmission: 0.9,
        })
      );
      bgPanel.position.set((i - 1) * 5, 0, -3);
      bgPanel.rotation.y = (i - 1) * 0.2;
      bgPanels.push(bgPanel);
      scene.add(bgPanel);
    }

    // Lighting - bright editorial style
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x00ffff, 0.3);
    fillLight.position.set(-5, 3, 3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x00ffff, 0.5, 20);
    rimLight.position.set(0, 0, -5);
    scene.add(rimLight);

    // Floating light particles
    const lightParticles = new THREE.Group();
    for (let i = 0; i < 100; i++) {
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.02, 8, 8),
        new THREE.MeshBasicMaterial({
          color: 0x00ffff,
          transparent: true,
          opacity: Math.random() * 0.6 + 0.2
        })
      );
      particle.position.set(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      particle.userData = {
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        )
      };
      lightParticles.add(particle);
    }
    scene.add(lightParticles);

    // Holographic rings around avatar
    const holoRings = [];
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(1.2 + i * 0.3, 1.3 + i * 0.3, 64),
        new THREE.MeshBasicMaterial({
          color: 0x00ffff,
          transparent: true,
          opacity: 0.3,
          side: THREE.DoubleSide
        })
      );
      ring.position.copy(avatar.position);
      ring.rotation.x = Math.PI / 2;
      holoRings.push(ring);
      scene.add(ring);
    }

    // Neon glow lines
    const neonLines = [];
    for (let i = 0; i < 8; i++) {
      const points = [];
      const startX = (Math.random() - 0.5) * 10;
      const startY = (Math.random() - 0.5) * 8;
      points.push(new THREE.Vector3(startX, startY, -5));
      points.push(new THREE.Vector3(startX + (Math.random() - 0.5) * 2, startY + Math.random() * 3, -3));
      
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.3
      });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      neonLines.push(line);
      scene.add(line);
    }

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

      // Avatar gentle float
      avatar.position.y = 1.5 + Math.sin(time * 0.5) * 0.1;
      avatarGlow.position.copy(avatar.position);
      avatarGlow.scale.setScalar(1 + Math.sin(time * 2) * 0.05);

      // Link cards subtle hover effect
      linkCards.forEach((card, i) => {
        card.position.z = 0.1 + Math.sin(time * 0.8 + i * 0.5) * 0.02;
      });

      // Background panels slow rotation
      bgPanels.forEach((panel, i) => {
        panel.rotation.y = (i - 1) * 0.2 + Math.sin(time * 0.1 + i) * 0.1;
      });

      // Light particles drift
      lightParticles.children.forEach((particle) => {
        particle.position.add(particle.userData.velocity);
        
        if (Math.abs(particle.position.x) > 7.5) particle.userData.velocity.x *= -1;
        if (Math.abs(particle.position.y) > 5) particle.userData.velocity.y *= -1;
        if (Math.abs(particle.position.z) > 5) particle.userData.velocity.z *= -1;

        particle.material.opacity = 0.2 + Math.sin(time * 2 + particle.position.x) * 0.3;
      });

      // Holographic rings rotation
      holoRings.forEach((ring, i) => {
        ring.rotation.z = time * (0.3 + i * 0.1);
        ring.material.opacity = 0.3 + Math.sin(time * 2 + i) * 0.1;
        ring.scale.setScalar(1 + Math.sin(time * 1.5 + i * 0.5) * 0.05);
      });

      // Neon lines pulse
      neonLines.forEach((line, i) => {
        line.material.opacity = 0.3 + Math.sin(time * 3 + i * 0.5) * 0.2;
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
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <div className="text-center max-w-md">
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
            <div className="backdrop-blur-md bg-gradient-to-br from-cyan-400/10 to-transparent border border-cyan-400/30 rounded-2xl p-6">
              <h3 className="text-lg font-light text-white mb-2">
                Upgrade to Broadcast Portal
              </h3>
              <p className="text-sm text-white/60 mb-4">
                Launch your own radio station with live streaming, scheduling, and full creative control
              </p>
              <Link
                to={createPageUrl('BroadcastPortal')}
                className="inline-block px-6 py-2 bg-cyan-400 text-black rounded-full text-sm uppercase tracking-wider hover:bg-cyan-300 transition-colors"
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