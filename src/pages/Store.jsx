import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import * as THREE from 'three';
import { ArrowLeft, ShoppingBag, Sparkles, Package } from 'lucide-react';
import VirtualStore from '@/components/monetization/VirtualStore';
import XMRPayment from '@/components/monetization/XMRPayment';

export default function Store() {
  const canvasRef = useRef(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 5, 20);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Store floor with grid
    const floorGeometry = new THREE.PlaneGeometry(30, 30, 20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Create 3D product pedestals in circular arrangement
    const pedestals = [];
    const products = [];
    const numProducts = 8;
    const radius = 5;

    for (let i = 0; i < numProducts; i++) {
      const angle = (i / numProducts) * Math.PI * 2;
      
      // Pedestal
      const pedestalGeometry = new THREE.CylinderGeometry(0.8, 1, 2, 8);
      const pedestalMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x1a1a1a,
        metalness: 0.8,
        roughness: 0.2,
        emissive: i % 2 === 0 ? 0xff0000 : 0x00ffff,
        emissiveIntensity: 0.2,
      });
      const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
      pedestal.position.x = Math.cos(angle) * radius;
      pedestal.position.z = Math.sin(angle) * radius;
      pedestal.position.y = 1;
      pedestals.push(pedestal);
      scene.add(pedestal);

      // Product display (floating cube)
      const productGeometry = new THREE.BoxGeometry(1, 1, 1);
      const productMaterial = new THREE.MeshPhysicalMaterial({
        color: i % 2 === 0 ? 0xff0000 : 0x00ffff,
        emissive: i % 2 === 0 ? 0xff0000 : 0x00ffff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8,
        metalness: 0.7,
        roughness: 0.3,
      });
      const product = new THREE.Mesh(productGeometry, productMaterial);
      product.position.x = pedestal.position.x;
      product.position.z = pedestal.position.z;
      product.position.y = 3;
      products.push(product);
      scene.add(product);

      // Holographic ring around product
      const ringGeometry = new THREE.TorusGeometry(0.7, 0.05, 8, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xff0000 : 0x00ffff,
        transparent: true,
        opacity: 0.6,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.copy(product.position);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
    }

    // Central display pillar
    const centralGeometry = new THREE.CylinderGeometry(0.5, 0.5, 6, 8);
    const centralMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.3,
      transmission: 0.9,
    });
    const central = new THREE.Mesh(centralGeometry, centralMaterial);
    central.position.y = 3;
    scene.add(central);

    // Dramatic lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const redSpotlight = new THREE.SpotLight(0xff0000, 2, 20, Math.PI / 6);
    redSpotlight.position.set(-8, 10, -8);
    scene.add(redSpotlight);

    const cyanSpotlight = new THREE.SpotLight(0x00ffff, 2, 20, Math.PI / 6);
    cyanSpotlight.position.set(8, 10, 8);
    scene.add(cyanSpotlight);

    const topLight = new THREE.PointLight(0xffffff, 1, 30);
    topLight.position.set(0, 15, 0);
    scene.add(topLight);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Rotate camera slowly around the store
      camera.position.x = Math.sin(time * 0.1) * 8;
      camera.position.z = Math.cos(time * 0.1) * 8;
      camera.lookAt(0, 2, 0);

      // Animate products
      products.forEach((product, i) => {
        product.rotation.y = time + i * 0.5;
        product.position.y = 3 + Math.sin(time * 2 + i) * 0.2;
      });

      // Pulse central pillar
      centralMaterial.emissiveIntensity = 0.4 + Math.sin(time * 3) * 0.2;

      // Pulse lights
      redSpotlight.intensity = 2 + Math.sin(time * 2) * 0.5;
      cyanSpotlight.intensity = 2 + Math.cos(time * 2) * 0.5;

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
        <div className="p-6 flex items-center justify-between backdrop-blur-xl bg-black/60 border-b border-red-500/30">
          <Link 
            to={createPageUrl('Home')}
            className="flex items-center gap-2 text-white/60 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm uppercase tracking-wider">Back</span>
          </Link>

          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-red-400" />
            <h1 className="text-2xl font-light text-white tracking-wide">3D Virtual Store</h1>
          </div>

          <div className="flex items-center gap-2 text-cyan-400 text-sm">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>8 Items Available</span>
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="p-6 pb-0">
          <div className="backdrop-blur-xl bg-gradient-to-r from-red-500/10 via-cyan-400/10 to-purple-600/10 border border-cyan-400/30 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-red-500/20 flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-light text-white mb-2">Welcome to the 3D Store</h2>
                <p className="text-sm text-white/70 leading-relaxed">
                  Shop overlays, effects, equipment, and phygital items for your virtual spaces. 
                  All purchases are yours to use across broadcasts, recordings, and 3D profiles.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* XMR Payment Banner */}
        <div className="px-6 pb-4">
          <div className="rounded-2xl bg-orange-400/5 border border-orange-400/20 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-400/40 flex items-center justify-center flex-shrink-0">
              <span className="text-orange-400 font-bold text-xl">&#625;</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white mb-0.5">Pay with Monero (XMR) &mdash; 10% off all items</h3>
              <p className="text-xs text-white/40">Private &middot; Fungible &middot; Permissionless. Select XMR at checkout on any item.</p>
            </div>
            <Link to={createPageUrl('Subscription')} className="flex-shrink-0 px-4 py-2 rounded-full bg-orange-400/15 border border-orange-400/30 text-orange-400 text-xs font-mono hover:bg-orange-400/25 transition-all">
              View Plans &rarr;
            </Link>
          </div>
        </div>
        {/* Store Content */}
        <div className="p-6 pt-0">
          <VirtualStore />
        </div>
      </div>
    </div>
  );
}