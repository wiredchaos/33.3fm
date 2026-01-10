import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { X, Play, Pause, RotateCcw } from 'lucide-react';
import * as THREE from 'three';

export default function PerformanceReplay({ sessionId, onClose }) {
  const [session, setSession] = useState(null);
  const [events, setEvents] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    loadSessionData();
  }, [sessionId]);

  const loadSessionData = async () => {
    try {
      const sessionData = await base44.entities.GestureSession.filter({ id: sessionId });
      if (sessionData.length > 0) {
        setSession(sessionData[0]);
      }

      const gestureEvents = await base44.entities.GestureEvent.filter(
        { session_id: sessionId },
        'created_date',
        1000
      );
      setEvents(gestureEvents);
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  };

  useEffect(() => {
    if (!canvasRef.current || events.length === 0) return;

    // Replay Three.js Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.7);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Particle System
    const particleCount = 10000;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = 0;

      const hue = Math.random();
      const color = new THREE.Color().setHSL(hue, 1, 0.5);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.8
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Audio Context
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const audioCtx = audioContextRef.current;

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    oscillator.type = 'sine';
    filter.type = 'lowpass';
    gainNode.gain.value = 0;

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (isPlaying && currentEventIndex < events.length) {
        const event = events[currentEventIndex];

        // Reconstruct particle forces from stored data
        const targetX = (event.position_x - 0.5) * 100;
        const targetY = (0.5 - event.position_y) * 100;

        for (let i = 0; i < particleCount; i++) {
          const dx = targetX - positions[i * 3];
          const dy = targetY - positions[i * 3 + 1];
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 20) {
            const force = event.hand === 'right' ? 0.5 : -0.5;
            velocities[i * 3] += (dx / distance) * force;
            velocities[i * 3 + 1] += (dy / distance) * force;
          }
        }

        // Reconstruct audio from stored parameters
        if (event.audio_params) {
          oscillator.frequency.setTargetAtTime(
            event.audio_params.frequency || 440,
            audioCtx.currentTime,
            0.01
          );
          filter.frequency.setTargetAtTime(
            event.audio_params.filterFreq || 1000,
            audioCtx.currentTime,
            0.01
          );
          gainNode.gain.setTargetAtTime(
            event.audio_params.gain || 0,
            audioCtx.currentTime,
            0.01
          );
        }

        setCurrentEventIndex(prev => prev + 1);
        setCurrentTime(prev => prev + 16); // Approximate 60fps
      }

      // Update particles
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];

        velocities[i * 3] *= 0.98;
        velocities[i * 3 + 1] *= 0.98;

        if (Math.abs(positions[i * 3]) > 50) positions[i * 3] *= -0.8;
        if (Math.abs(positions[i * 3 + 1]) > 50) positions[i * 3 + 1] *= -0.8;
      }

      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      oscillator.stop();
      renderer.dispose();
    };
  }, [events, isPlaying, currentEventIndex]);

  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentEventIndex >= events.length - 1) {
        setCurrentEventIndex(0);
        setCurrentTime(0);
      }
      setIsPlaying(true);
    }
  };

  const restart = () => {
    setCurrentEventIndex(0);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4 text-center">
          <h2 className="text-2xl font-light text-white mb-2">
            {session?.session_name || 'Performance Replay'}
          </h2>
          <div className="text-cyan-400 text-sm">
            AI-Driven Reconstruction • {events.length} Gestures
          </div>
        </div>

        <canvas ref={canvasRef} className="rounded-xl border-2 border-cyan-400/30" />

        <div className="mt-6 flex items-center gap-4">
          <Button
            onClick={togglePlayback}
            className="bg-gradient-to-r from-cyan-400 to-purple-600 hover:opacity-90"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          <Button
            onClick={restart}
            variant="outline"
            className="border-white/20 text-white"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
          <div className="text-white text-sm">
            {currentEventIndex} / {events.length} events
          </div>
        </div>
      </div>
    </div>
  );
}