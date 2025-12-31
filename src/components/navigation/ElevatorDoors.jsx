import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';

export default function ElevatorDoors({ onDoorsOpen }) {
  const canvasRef = useRef(null);
  const [doorsOpen, setDoorsOpen] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Elevator doors
    const doorMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x00ffff,
      emissiveIntensity: 0.3
    });

    const leftDoor = new THREE.Mesh(
      new THREE.BoxGeometry(3, 6, 0.2),
      doorMaterial
    );
    leftDoor.position.set(-1.5, 0, 0);

    const rightDoor = new THREE.Mesh(
      new THREE.BoxGeometry(3, 6, 0.2),
      doorMaterial.clone()
    );
    rightDoor.position.set(1.5, 0, 0);

    scene.add(leftDoor);
    scene.add(rightDoor);

    // Door frame
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.8,
      roughness: 0.3
    });

    const topFrame = new THREE.Mesh(
      new THREE.BoxGeometry(6.5, 0.3, 0.3),
      frameMaterial
    );
    topFrame.position.set(0, 3.15, 0);
    scene.add(topFrame);

    const bottomFrame = new THREE.Mesh(
      new THREE.BoxGeometry(6.5, 0.3, 0.3),
      frameMaterial
    );
    bottomFrame.position.set(0, -3.15, 0);
    scene.add(bottomFrame);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00ffff, 2, 20);
    cyanLight.position.set(0, 0, 3);
    scene.add(cyanLight);

    // Animation
    let time = 0;
    const targetLeftX = doorsOpen ? -4.5 : -1.5;
    const targetRightX = doorsOpen ? 4.5 : 1.5;

    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Smooth door movement
      leftDoor.position.x += (targetLeftX - leftDoor.position.x) * 0.05;
      rightDoor.position.x += (targetRightX - rightDoor.position.x) * 0.05;

      // Door glow pulse
      leftDoor.material.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.1;
      rightDoor.material.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.1;

      cyanLight.intensity = 2 + Math.sin(time * 3) * 0.3;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Auto-open doors after 1 second
    const timer = setTimeout(() => {
      setDoorsOpen(true);
      if (onDoorsOpen) {
        setTimeout(() => onDoorsOpen(), 1500);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [doorsOpen, onDoorsOpen]);

  return (
    <div className="fixed inset-0 z-50">
      <canvas ref={canvasRef} className="absolute inset-0" />
      {doorsOpen && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="text-cyan-400 text-sm uppercase tracking-widest animate-pulse">
            Welcome to 33.3FM DOGECHAIN
          </div>
        </div>
      )}
    </div>
  );
}