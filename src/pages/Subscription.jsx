import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import * as THREE from 'three';
import { ArrowLeft, Crown } from 'lucide-react';
import SubscriptionTiers from '@/components/monetization/SubscriptionTiers';

export default function Subscription() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0000);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Tier pedestals
    const pedestals = [];
    for (let i = 0; i < 4; i++) {
      const geometry = new THREE.CylinderGeometry(0.8, 1, 2, 32);
      const material = new THREE.MeshStandardMaterial({
        color: i === 2 ? 0xff0000 : 0x00ffff,
        emissive: i === 2 ? 0xff0000 : 0x00ffff,
        emissiveIntensity: 0.4,
      });
      const pedestal = new THREE.Mesh(geometry, material);
      pedestal.position.x = (i - 1.5) * 3;
      pedestal.position.y = i === 2 ? 1 : 0;
      pedestals.push(pedestal);
      scene.add(pedestal);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xff0000, 1);
    spotLight.position.set(0, 10, 5);
    scene.add(spotLight);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      pedestals.forEach((pedestal, i) => {
        pedestal.rotation.y = time * 0.5;
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

  return (
    <div className="relative w-full min-h-screen overflow-y-auto bg-black">
      <canvas ref={canvasRef} className="fixed inset-0" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="p-6 flex items-center justify-between backdrop-blur-md bg-black/40 border-b border-red-500/30">
          <Link 
            to={createPageUrl('Home')}
            className="flex items-center gap-2 text-white/60 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm uppercase tracking-wider">Back</span>
          </Link>

          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-red-400" />
            <h1 className="text-2xl font-light text-white tracking-wide">Subscription Plans</h1>
          </div>
        </div>

        {/* Tiers */}
        <div className="py-12">
          <SubscriptionTiers />
        </div>
      </div>
    </div>
  );
}