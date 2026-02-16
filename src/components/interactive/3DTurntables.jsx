import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCcw, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export default function Turntables3D({ onScratch, onPlay, className }) {
  const containerRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState([false, false]);
  const [volume, setVolume] = useState([70, 70]);
  const turntablesRef = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(50, containerRef.current.clientWidth / 400, 0.1, 1000);
    camera.position.set(0, 8, 15);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, 400);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const redLight = new THREE.PointLight(0xff0000, 1.5, 20);
    redLight.position.set(-5, 5, 5);
    scene.add(redLight);

    const cyanLight = new THREE.PointLight(0x00ffff, 1.5, 20);
    cyanLight.position.set(5, 5, 5);
    scene.add(cyanLight);

    // Create two turntables
    const createTurntable = (xPos, color) => {
      const group = new THREE.Group();
      
      // Base
      const baseGeometry = new THREE.CylinderGeometry(2, 2.2, 0.5, 32);
      const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1a1a1a,
        metalness: 0.8,
        roughness: 0.2
      });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      group.add(base);

      // Platter
      const platterGeometry = new THREE.CylinderGeometry(1.8, 1.8, 0.1, 64);
      const platterMaterial = new THREE.MeshStandardMaterial({ 
        color: color,
        metalness: 0.9,
        roughness: 0.1,
        emissive: color,
        emissiveIntensity: 0.3
      });
      const platter = new THREE.Mesh(platterGeometry, platterMaterial);
      platter.position.y = 0.3;
      group.add(platter);

      // Vinyl record
      const vinylGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.05, 64);
      const vinylMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x000000,
        metalness: 0.7,
        roughness: 0.3
      });
      const vinyl = new THREE.Mesh(vinylGeometry, vinylMaterial);
      vinyl.position.y = 0.35;
      
      // Add grooves
      for (let i = 0; i < 10; i++) {
        const grooveGeometry = new THREE.TorusGeometry(1.3 - i * 0.1, 0.01, 8, 32);
        const grooveMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x111111,
          metalness: 0.5,
          roughness: 0.5
        });
        const groove = new THREE.Mesh(grooveGeometry, grooveMaterial);
        groove.rotation.x = Math.PI / 2;
        groove.position.y = 0.38;
        vinyl.add(groove);
      }
      
      group.add(vinyl);

      // Tonearm
      const armGeometry = new THREE.BoxGeometry(0.1, 0.1, 2);
      const armMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333,
        metalness: 0.9,
        roughness: 0.1
      });
      const arm = new THREE.Mesh(armGeometry, armMaterial);
      arm.position.set(1.5, 0.6, 0);
      arm.rotation.y = -Math.PI / 6;
      group.add(arm);

      // Stylus
      const stylusGeometry = new THREE.ConeGeometry(0.05, 0.3, 8);
      const stylusMaterial = new THREE.MeshStandardMaterial({ 
        color: color,
        emissive: color,
        emissiveIntensity: 0.5
      });
      const stylus = new THREE.Mesh(stylusGeometry, stylusMaterial);
      stylus.position.set(1.5, 0.3, 1);
      stylus.rotation.x = Math.PI;
      group.add(stylus);

      group.position.x = xPos;
      scene.add(group);

      return { group, vinyl, platter };
    };

    const turntable1 = createTurntable(-4, 0xff0000);
    const turntable2 = createTurntable(4, 0x00ffff);
    turntablesRef.current = [turntable1, turntable2];

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Rotate vinyls if spinning
      turntablesRef.current.forEach((tt, idx) => {
        if (isSpinning[idx]) {
          tt.vinyl.rotation.y += 0.05;
          tt.platter.rotation.y += 0.05;
        }
      });

      // Pulsing lights
      redLight.intensity = 1.5 + Math.sin(time * 2) * 0.3;
      cyanLight.intensity = 1.5 + Math.cos(time * 2) * 0.3;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / 400;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, 400);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [isSpinning]);

  const togglePlay = (deck) => {
    const newState = [...isSpinning];
    newState[deck] = !newState[deck];
    setIsSpinning(newState);
    onPlay?.(deck, newState[deck]);
  };

  return (
    <div className={className}>
      <div ref={containerRef} className="w-full rounded-xl overflow-hidden border border-red-500/30" />
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        {[0, 1].map((deck) => (
          <div key={deck} className="backdrop-blur-xl bg-black/60 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white/60 uppercase tracking-wider">
                Deck {deck + 1}
              </span>
              <div className={`w-2 h-2 rounded-full ${isSpinning[deck] ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`} />
            </div>
            
            <div className="flex gap-2 mb-3">
              <Button
                onClick={() => togglePlay(deck)}
                variant="outline"
                size="sm"
                className={`flex-1 ${isSpinning[deck] ? 'bg-red-500/20 border-red-500/50' : 'border-white/20'}`}
              >
                {isSpinning[deck] ? (
                  <Pause className="w-4 h-4 mr-2 text-red-400" />
                ) : (
                  <Play className="w-4 h-4 mr-2 text-cyan-400" />
                )}
                {isSpinning[deck] ? 'Pause' : 'Play'}
              </Button>
              <Button
                onClick={() => onScratch?.(deck)}
                variant="outline"
                size="sm"
                className="border-white/20"
              >
                <RotateCcw className="w-4 h-4 text-purple-400" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {volume[deck] > 0 ? (
                <Volume2 className="w-4 h-4 text-white/60" />
              ) : (
                <VolumeX className="w-4 h-4 text-white/60" />
              )}
              <Slider
                value={[volume[deck]]}
                onValueChange={([v]) => {
                  const newVol = [...volume];
                  newVol[deck] = v;
                  setVolume(newVol);
                }}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-white/40 w-8 text-right">{volume[deck]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}