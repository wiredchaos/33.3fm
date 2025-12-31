import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Music, Volume2 } from 'lucide-react';

export default function ThreeDKeyboard({ onNotePlay }) {
  const mountRef = useRef(null);
  const [activeKeys, setActiveKeys] = useState([]);
  const audioContextRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 400 / 300, 0.1, 1000);
    camera.position.set(0, 3, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(400, 300);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Audio context
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

    // Keyboard
    const keyboardGroup = new THREE.Group();
    const keys = [];
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const frequencies = [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88];

    notes.forEach((note, i) => {
      const isBlack = note.includes('#');
      const key = new THREE.Mesh(
        new THREE.BoxGeometry(isBlack ? 0.4 : 0.6, 0.1, isBlack ? 1.5 : 2.5),
        new THREE.MeshStandardMaterial({
          color: isBlack ? 0x000000 : 0xffffff,
          metalness: 0.3,
          roughness: 0.7
        })
      );

      const xOffset = i * 0.65 - 3.5;
      key.position.set(xOffset, isBlack ? 0.1 : 0, isBlack ? 0.5 : 0);
      key.userData = { note, frequency: frequencies[i], index: i };
      
      keys.push(key);
      keyboardGroup.add(key);
    });

    scene.add(keyboardGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0x00ffff, 1, 20);
    keyLight.position.set(0, 5, 3);
    scene.add(keyLight);

    // Raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const playNote = (frequency, note) => {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.5);
      
      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.5);

      if (onNotePlay) onNotePlay(note);
    };

    const onMouseMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(keys);

      keys.forEach(key => {
        const isBlack = key.userData.note.includes('#');
        key.material.emissive.setHex(0x000000);
        key.material.color.setHex(isBlack ? 0x000000 : 0xffffff);
      });

      if (intersects.length > 0) {
        const key = intersects[0].object;
        key.material.emissive.setHex(0x00ffff);
        renderer.domElement.style.cursor = 'pointer';
      } else {
        renderer.domElement.style.cursor = 'default';
      }
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(keys);

      if (intersects.length > 0) {
        const key = intersects[0].object;
        playNote(key.userData.frequency, key.userData.note);
        setActiveKeys(prev => [...prev, key.userData.note]);
        setTimeout(() => {
          setActiveKeys(prev => prev.filter(n => n !== key.userData.note));
        }, 200);

        // Visual feedback
        key.position.y -= 0.05;
        setTimeout(() => { key.position.y += 0.05; }, 100);
      }
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      keyboardGroup.rotation.y = Math.sin(time * 0.3) * 0.1;
      keyLight.intensity = 1 + Math.sin(time * 2) * 0.2;

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
  }, [onNotePlay]);

  return (
    <div className="backdrop-blur-md bg-black/40 border border-cyan-400/50 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm uppercase tracking-wider text-white">3D Keyboard</h3>
        </div>
        <Volume2 className="w-4 h-4 text-cyan-400" />
      </div>
      <div ref={mountRef} className="rounded-xl overflow-hidden" />
      {activeKeys.length > 0 && (
        <div className="mt-2 text-xs text-cyan-400 flex gap-2">
          {activeKeys.map((note, i) => (
            <span key={i} className="px-2 py-1 rounded bg-cyan-400/20">{note}</span>
          ))}
        </div>
      )}
    </div>
  );
}