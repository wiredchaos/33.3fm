import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import * as THREE from 'three';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import VirtualStore from '@/components/monetization/VirtualStore';

export default function Store() {
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

    // Floating product displays
    const displays = [];
    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.BoxGeometry(1, 1, 0.1);
      const material = new THREE.MeshPhysicalMaterial({
        color: i % 2 === 0 ? 0xff0000 : 0x00ffff,
        emissive: i % 2 === 0 ? 0xff0000 : 0x00ffff,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.7,
      });
      const display = new THREE.Mesh(geometry, material);
      display.position.x = (i - 2) * 2;
      display.position.y = Math.sin(i) * 2;
      display.position.z = -5;
      displays.push(display);
      scene.add(display);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const redLight = new THREE.PointLight(0xff0000, 1, 20);
    redLight.position.set(-5, 3, 3);
    scene.add(redLight);

    const cyanLight = new THREE.PointLight(0x00ffff, 1, 20);
    cyanLight.position.set(5, 3, 3);
    scene.add(cyanLight);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      displays.forEach((display, i) => {
        display.rotation.y = time + i * 0.5;
        display.position.y = Math.sin(time + i) * 0.5;
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
            <ShoppingBag className="w-6 h-6 text-red-400" />
            <h1 className="text-2xl font-light text-white tracking-wide">Virtual Store</h1>
          </div>
        </div>

        {/* Store Content */}
        <div className="p-6">
          <VirtualStore />
        </div>
      </div>
    </div>
  );
}