import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Mic, Volume2 } from 'lucide-react';

export default function ThreeDMicrophone({ onRecord, isRecording = false }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 300 / 300, 0.1, 1000);
    camera.position.set(2, 2, 4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(300, 300);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Microphone stand
    const standGroup = new THREE.Group();
    
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.35, 0.05, 32),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.9, roughness: 0.3 })
    );
    base.position.y = 0.025;
    standGroup.add(base);

    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 2, 16),
      new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.8, roughness: 0.4 })
    );
    pole.position.y = 1;
    standGroup.add(pole);

    // Microphone body
    const micBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.4, 32),
      new THREE.MeshStandardMaterial({ 
        color: 0x1a1a1a, 
        metalness: 0.9, 
        roughness: 0.2,
        emissive: 0x00ffff,
        emissiveIntensity: 0.2
      })
    );
    micBody.position.y = 2.2;
    standGroup.add(micBody);

    // Microphone grille
    const grille = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 32, 32),
      new THREE.MeshStandardMaterial({ 
        color: 0x3a3a3a, 
        metalness: 0.9, 
        roughness: 0.5,
        emissive: isRecording ? 0xff0000 : 0x00ffff,
        emissiveIntensity: isRecording ? 0.8 : 0.3
      })
    );
    grille.position.y = 2.45;
    standGroup.add(grille);

    // Recording indicator ring
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.15, 0.01, 16, 32),
      new THREE.MeshStandardMaterial({
        color: isRecording ? 0xff0000 : 0x00ffff,
        emissive: isRecording ? 0xff0000 : 0x00ffff,
        emissiveIntensity: isRecording ? 1 : 0.5
      })
    );
    ring.position.y = 2.45;
    ring.rotation.x = Math.PI / 2;
    standGroup.add(ring);

    scene.add(standGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0x00ffff, 1.5, 10);
    keyLight.position.set(3, 5, 3);
    scene.add(keyLight);

    const accentLight = new THREE.PointLight(
      isRecording ? 0xff0000 : 0x00ffff, 
      1, 
      8
    );
    accentLight.position.set(0, 3, 0);
    scene.add(accentLight);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      standGroup.rotation.y = time * 0.3;
      
      if (isRecording) {
        grille.material.emissiveIntensity = 0.8 + Math.sin(time * 10) * 0.2;
        ring.material.emissiveIntensity = 1 + Math.sin(time * 10) * 0.3;
        accentLight.intensity = 1 + Math.sin(time * 5) * 0.5;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isRecording]);

  return (
    <div className="backdrop-blur-md bg-black/40 border border-red-500/50 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-red-400" />
          <h3 className="text-sm uppercase tracking-wider text-white">Vocal Mic</h3>
        </div>
        {isRecording && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-red-400">REC</span>
          </div>
        )}
      </div>
      <div ref={mountRef} className="rounded-xl overflow-hidden" />
      <button
        onClick={onRecord}
        className={`w-full mt-3 px-4 py-2 rounded-lg text-sm transition-all ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-white/10 hover:bg-white/20 text-white'
        }`}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  );
}