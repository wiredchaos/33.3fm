import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Radio, Zap } from 'lucide-react';

export default function ThreeDSynthesizer({ onPlay }) {
  const mountRef = useRef(null);
  const [activeNote, setActiveNote] = useState(null);
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

    const synthGroup = new THREE.Group();
    const pads = [];

    // Create 4x4 grid of synth pads
    const notes = [
      { name: 'C4', freq: 261.63 }, { name: 'D4', freq: 293.66 }, { name: 'E4', freq: 329.63 }, { name: 'F4', freq: 349.23 },
      { name: 'G4', freq: 392.00 }, { name: 'A4', freq: 440.00 }, { name: 'B4', freq: 493.88 }, { name: 'C5', freq: 523.25 },
      { name: 'D5', freq: 587.33 }, { name: 'E5', freq: 659.25 }, { name: 'F5', freq: 698.46 }, { name: 'G5', freq: 783.99 },
      { name: 'A5', freq: 880.00 }, { name: 'B5', freq: 987.77 }, { name: 'C6', freq: 1046.50 }, { name: 'D6', freq: 1174.66 }
    ];

    notes.forEach((note, i) => {
      const row = Math.floor(i / 4);
      const col = i % 4;
      
      const pad = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.1, 0.8),
        new THREE.MeshStandardMaterial({
          color: 0x00ffff,
          emissive: 0x00ffff,
          emissiveIntensity: 0.3,
          metalness: 0.8,
          roughness: 0.2
        })
      );

      pad.position.set(col * 1 - 1.5, 0, row * 1 - 1.5);
      pad.userData = { note: note.name, frequency: note.freq };
      pads.push(pad);
      synthGroup.add(pad);
    });

    scene.add(synthGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0x00ffff, 2, 15);
    keyLight.position.set(0, 5, 5);
    scene.add(keyLight);

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const playSynth = (frequency, note) => {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      const filter = audioContextRef.current.createBiquadFilter();
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sawtooth';
      filter.type = 'lowpass';
      filter.frequency.value = 2000;
      
      gainNode.gain.setValueAtTime(0.4, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.6);
      
      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.6);

      setActiveNote(note);
      setTimeout(() => setActiveNote(null), 300);
      if (onPlay) onPlay(note);
    };

    const onMouseMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pads);

      pads.forEach(pad => {
        pad.material.emissiveIntensity = 0.3;
      });

      if (intersects.length > 0) {
        const pad = intersects[0].object;
        pad.material.emissiveIntensity = 1;
        renderer.domElement.style.cursor = 'pointer';
      } else {
        renderer.domElement.style.cursor = 'default';
      }
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pads);

      if (intersects.length > 0) {
        const pad = intersects[0].object;
        playSynth(pad.userData.frequency, pad.userData.note);
        pad.position.y -= 0.05;
        setTimeout(() => { pad.position.y += 0.05; }, 100);
      }
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      synthGroup.rotation.y = Math.sin(time * 0.2) * 0.1;
      keyLight.intensity = 2 + Math.sin(time * 3) * 0.3;

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
  }, [onPlay]);

  return (
    <div className="backdrop-blur-md bg-black/40 border border-cyan-400/50 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm uppercase tracking-wider text-white">3D Synthesizer</h3>
        </div>
        <Zap className="w-4 h-4 text-cyan-400" />
      </div>
      <div ref={mountRef} className="rounded-xl overflow-hidden" />
      {activeNote && (
        <div className="mt-2 text-xs text-cyan-400 text-center animate-pulse">
          {activeNote}
        </div>
      )}
    </div>
  );
}