import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Drum } from 'lucide-react';

export default function ThreeDDrumKit({ onDrumHit }) {
  const mountRef = useRef(null);
  const [lastHit, setLastHit] = useState(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 400 / 300, 0.1, 1000);
    camera.position.set(0, 3, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(400, 300);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

    const drumKit = new THREE.Group();
    const drums = [];

    // Kick drum
    const kick = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.6, 0.5, 32),
      new THREE.MeshStandardMaterial({ 
        color: 0xff0000, 
        metalness: 0.7, 
        roughness: 0.3,
        emissive: 0xff0000,
        emissiveIntensity: 0.2
      })
    );
    kick.position.set(0, 0.25, 0);
    kick.rotation.z = Math.PI / 2;
    kick.userData = { name: 'Kick', frequency: 60 };
    drums.push(kick);
    drumKit.add(kick);

    // Snare
    const snare = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.35, 0.2, 32),
      new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        metalness: 0.8, 
        roughness: 0.2,
        emissive: 0x00ffff,
        emissiveIntensity: 0.2
      })
    );
    snare.position.set(-0.8, 0.8, 0.3);
    snare.userData = { name: 'Snare', frequency: 200 };
    drums.push(snare);
    drumKit.add(snare);

    // Hi-hat
    const hihat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.25, 0.05, 32),
      new THREE.MeshStandardMaterial({ 
        color: 0xffff00, 
        metalness: 0.9, 
        roughness: 0.1,
        emissive: 0xffff00,
        emissiveIntensity: 0.2
      })
    );
    hihat.position.set(-1.2, 1.2, -0.3);
    hihat.userData = { name: 'Hi-Hat', frequency: 800 };
    drums.push(hihat);
    drumKit.add(hihat);

    // Tom 1
    const tom1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 0.3, 32),
      new THREE.MeshStandardMaterial({ 
        color: 0x00ff00, 
        metalness: 0.7, 
        roughness: 0.3,
        emissive: 0x00ff00,
        emissiveIntensity: 0.2
      })
    );
    tom1.position.set(0.5, 1, 0);
    tom1.userData = { name: 'Tom 1', frequency: 150 };
    drums.push(tom1);
    drumKit.add(tom1);

    // Tom 2
    const tom2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.35, 0.35, 32),
      new THREE.MeshStandardMaterial({ 
        color: 0x0000ff, 
        metalness: 0.7, 
        roughness: 0.3,
        emissive: 0x0000ff,
        emissiveIntensity: 0.2
      })
    );
    tom2.position.set(1, 0.5, 0.3);
    tom2.userData = { name: 'Tom 2', frequency: 120 };
    drums.push(tom2);
    drumKit.add(tom2);

    // Crash cymbal
    const crash = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 0.02, 32),
      new THREE.MeshStandardMaterial({ 
        color: 0xff00ff, 
        metalness: 0.95, 
        roughness: 0.05,
        emissive: 0xff00ff,
        emissiveIntensity: 0.2
      })
    );
    crash.position.set(1.3, 1.5, -0.5);
    crash.userData = { name: 'Crash', frequency: 1000 };
    drums.push(crash);
    drumKit.add(crash);

    scene.add(drumKit);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0x00ffff, 2, 15);
    keyLight.position.set(0, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xff00ff, 1.5, 10);
    rimLight.position.set(-3, 3, -3);
    scene.add(rimLight);

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const playDrum = (frequency, name) => {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = name === 'Hi-Hat' || name === 'Crash' ? 'square' : 'sine';
      
      gainNode.gain.setValueAtTime(0.5, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.3);
      
      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.3);

      setLastHit(name);
      setTimeout(() => setLastHit(null), 200);
      
      if (onDrumHit) onDrumHit(name);
    };

    const onMouseMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(drums);

      drums.forEach(drum => {
        drum.material.emissiveIntensity = 0.2;
      });

      if (intersects.length > 0) {
        const drum = intersects[0].object;
        drum.material.emissiveIntensity = 0.8;
        renderer.domElement.style.cursor = 'pointer';
      } else {
        renderer.domElement.style.cursor = 'default';
      }
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(drums);

      if (intersects.length > 0) {
        const drum = intersects[0].object;
        playDrum(drum.userData.frequency, drum.userData.name);
        
        // Visual hit feedback
        drum.scale.set(0.9, 0.9, 0.9);
        setTimeout(() => drum.scale.set(1, 1, 1), 100);
      }
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      drumKit.rotation.y = Math.sin(time * 0.2) * 0.1;
      keyLight.intensity = 2 + Math.sin(time * 2) * 0.3;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('click', onClick);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onDrumHit]);

  return (
    <div className="backdrop-blur-md bg-black/40 border border-purple-500/50 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Drum className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm uppercase tracking-wider text-white">3D Drum Kit</h3>
        </div>
        {lastHit && (
          <span className="text-xs text-cyan-400 animate-pulse">{lastHit}</span>
        )}
      </div>
      <div ref={mountRef} className="rounded-xl overflow-hidden" />
      <div className="mt-2 text-xs text-white/40 text-center">
        Click on drums to play
      </div>
    </div>
  );
}