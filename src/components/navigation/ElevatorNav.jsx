import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Mic, Music, User, Radio, X } from 'lucide-react';

export default function ElevatorNav({ isOpen, onClose }) {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [selectedFloor, setSelectedFloor] = useState(null);

  const floors = [
    { name: 'Broadcast Portal', page: 'BroadcastPortal', icon: Radio, level: 4, color: 0xff0000 },
    { name: 'Recording Studio', page: 'RecordingStudio', icon: Music, level: 3, color: 0x84cc16 },
    { name: 'Podcast Booth', page: 'PodcastBooth', icon: Mic, level: 2, color: 0x00ffff },
    { name: 'Artist Profile', page: 'ArtistProfile', icon: User, level: 1, color: 0x00ffff },
  ];

  useEffect(() => {
    if (!canvasRef.current || !isOpen) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(60, 400 / 600, 0.1, 1000);
    camera.position.set(3, 10, 8);
    camera.lookAt(0, 10, 0);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(400, 600);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Elevator shaft
    const shaftGeometry = new THREE.BoxGeometry(4, 30, 4);
    const shaftMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.05,
      transparent: true,
      opacity: 0.1,
      transmission: 0.95,
    });
    const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
    shaft.position.y = 15;
    scene.add(shaft);

    // Elevator cabin
    const cabinGeometry = new THREE.BoxGeometry(3.5, 4, 3.5);
    const cabinMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.7,
    });
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabin.position.y = 2;
    scene.add(cabin);

    // Floor indicators
    const floorMarkers = floors.map((floor) => {
      const marker = new THREE.Mesh(
        new THREE.RingGeometry(0.5, 0.7, 32),
        new THREE.MeshStandardMaterial({
          color: floor.color,
          emissive: floor.color,
          emissiveIntensity: 0.5,
        })
      );
      marker.position.set(2.5, floor.level * 6, 0);
      marker.rotation.y = -Math.PI / 4;
      scene.add(marker);
      return marker;
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00ffff, 1, 20);
    cyanLight.position.set(0, 15, 5);
    scene.add(cyanLight);

    let time = 0;
    let targetY = 2;

    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Smooth cabin movement
      cabin.position.y += (targetY - cabin.position.y) * 0.05;

      // Cabin glow pulse
      cabinMaterial.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.1;

      // Camera gentle movement
      camera.position.x = 3 + Math.sin(time * 0.3) * 0.5;

      renderer.render(scene, camera);
    };
    animate();

    // Handle floor selection
    if (selectedFloor !== null) {
      targetY = floors[selectedFloor].level * 6;
      setTimeout(() => {
        navigate(createPageUrl(floors[selectedFloor].page));
        onClose();
      }, 1500);
    }

    return () => {
      renderer.dispose();
    };
  }, [isOpen, selectedFloor, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative flex gap-6">
        {/* 3D Elevator */}
        <div className="relative">
          <canvas ref={canvasRef} className="rounded-2xl border border-white/20" />
          <div className="absolute top-4 left-4 text-xs uppercase tracking-widest text-cyan-400">
            3D Elevator
          </div>
        </div>

        {/* Floor Selection Panel */}
        <div className="backdrop-blur-md bg-black/60 border border-white/10 rounded-2xl p-6 w-80">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-light text-white tracking-wide">Select Floor</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5 text-white/60" />
            </Button>
          </div>

          <div className="space-y-3">
            {floors.map((floor, index) => (
              <button
                key={floor.page}
                onClick={() => setSelectedFloor(index)}
                disabled={selectedFloor !== null}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                  selectedFloor === index
                    ? 'bg-cyan-400 text-black'
                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400/20 to-transparent flex items-center justify-center">
                  <floor.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-medium">{floor.name}</div>
                  <div className="text-xs opacity-60">Level {floor.level}</div>
                </div>
              </button>
            ))}
          </div>

          {selectedFloor !== null && (
            <div className="mt-6 text-center text-sm text-cyan-400 animate-pulse">
              Ascending to {floors[selectedFloor].name}...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}