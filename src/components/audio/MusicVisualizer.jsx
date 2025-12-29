import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function MusicVisualizer({ isActive = false, intensity = 1 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(400, 400);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create visualizer bars
    const bars = [];
    const barCount = 64;
    const radius = 3;

    for (let i = 0; i < barCount; i++) {
      const angle = (i / barCount) * Math.PI * 2;
      const geometry = new THREE.BoxGeometry(0.1, 0.5, 0.1);
      const material = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0xff0000 : 0x00ffff,
        emissive: i % 2 === 0 ? 0xff0000 : 0x00ffff,
        emissiveIntensity: 0.5,
      });
      const bar = new THREE.Mesh(geometry, material);
      
      bar.position.x = Math.cos(angle) * radius;
      bar.position.z = Math.sin(angle) * radius;
      bar.rotation.y = -angle;
      
      bars.push(bar);
      scene.add(bar);
    }

    // Lighting
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 0, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.05;

      bars.forEach((bar, i) => {
        if (isActive) {
          const wave = Math.sin(time * 2 + i * 0.2) * 0.5 + 0.5;
          bar.scale.y = 1 + wave * 3 * intensity;
          bar.material.emissiveIntensity = 0.3 + wave * 0.7;
        } else {
          bar.scale.y = 1 + Math.sin(time * 0.5 + i * 0.1) * 0.2;
          bar.material.emissiveIntensity = 0.2;
        }
      });

      camera.rotation.y = time * 0.1;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
    };
  }, [isActive, intensity]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="rounded-xl" />
      {isActive && (
        <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-red-500/80 text-white text-xs uppercase tracking-wider animate-pulse">
          LIVE
        </div>
      )}
    </div>
  );
}