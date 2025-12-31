import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import * as THREE from 'three';
import { Shirt, Eye, Camera, RotateCw, Maximize } from 'lucide-react';

export default function VirtualTryOn({ itemId }) {
  const canvasRef = useRef(null);
  const [isTryingOn, setIsTryingOn] = useState(false);
  const [rotation, setRotation] = useState(0);

  const { data: item } = useQuery({
    queryKey: ['phygitalItem', itemId],
    queryFn: async () => {
      const items = await base44.entities.PhygitalItem.list();
      return items.find(i => i.id === itemId);
    },
    enabled: !!itemId
  });

  useEffect(() => {
    if (!canvasRef.current || !isTryingOn) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(50, 400 / 600, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(400, 600);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Avatar mannequin
    const bodyGeometry = new THREE.CapsuleGeometry(0.8, 2, 4, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.7,
      metalness: 0.3
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    scene.add(body);

    // Item overlay (e.g., shirt)
    let itemMesh;
    if (item?.item_type === 'apparel') {
      const itemGeometry = new THREE.CylinderGeometry(0.85, 1, 1.2, 8);
      const itemMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.7,
        roughness: 0.5
      });
      itemMesh = new THREE.Mesh(itemGeometry, itemMaterial);
      itemMesh.position.y = 0.6;
      scene.add(itemMesh);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(2, 3, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x00ffff, 0.5, 10);
    rimLight.position.set(-2, 2, -2);
    scene.add(rimLight);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      body.rotation.y = rotation;
      if (itemMesh) {
        itemMesh.rotation.y = rotation;
        itemMesh.position.y = 0.6 + Math.sin(time * 2) * 0.05;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
    };
  }, [isTryingOn, rotation, item]);

  if (!item) return null;

  return (
    <div className="backdrop-blur-xl bg-black/80 border border-cyan-400/30 rounded-2xl p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400/20 to-purple-600/20 flex items-center justify-center">
            <Shirt className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-medium">Virtual Try-On</h3>
            <p className="text-xs text-white/60">{item.item_name}</p>
          </div>
        </div>
        <Button
          onClick={() => setIsTryingOn(!isTryingOn)}
          size="sm"
          className="bg-cyan-400 hover:bg-cyan-500 text-black"
        >
          <Eye className="w-4 h-4 mr-1" />
          {isTryingOn ? 'Close' : 'Try On'}
        </Button>
      </div>

      {isTryingOn && (
        <>
          <div className="rounded-xl overflow-hidden border border-cyan-400/30 mb-4">
            <canvas ref={canvasRef} className="w-full" />
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <Button
              onClick={() => setRotation(rotation - 0.5)}
              variant="outline"
              size="sm"
              className="flex-1 border-cyan-400/30 text-cyan-400"
            >
              <RotateCw className="w-4 h-4 mr-1 rotate-180" />
              Rotate Left
            </Button>
            <Button
              onClick={() => setRotation(rotation + 0.5)}
              variant="outline"
              size="sm"
              className="flex-1 border-cyan-400/30 text-cyan-400"
            >
              <RotateCw className="w-4 h-4 mr-1" />
              Rotate Right
            </Button>
          </div>

          {item.ar_enabled && (
            <div className="mt-3 p-3 rounded-lg bg-cyan-400/10 border border-cyan-400/30">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-white font-medium">AR Ready</span>
              </div>
              <p className="text-xs text-white/70 mb-2">
                Open this in mobile AR to see the item in your real environment
              </p>
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-cyan-400 to-purple-600 text-white"
              >
                <Maximize className="w-3 h-3 mr-1" />
                Launch AR Experience
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}