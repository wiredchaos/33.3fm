import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import * as THREE from 'three';
import { ArrowLeft, Play, Square, Save, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function GestureStudio() {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [sessionName, setSessionName] = useState('');
  const [gestureCount, setGestureCount] = useState(0);
  const [currentHands, setCurrentHands] = useState({ left: null, right: null });
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showReplay, setShowReplay] = useState(false);
  const [replaySessionId, setReplaySessionId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    // Standalone auth — no server needed
  };

  useEffect(() => {
    if (!canvasRef.current || !videoRef.current) return;

    // Three.js Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Particle System
    const particleCount = 15000;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      velocities[i * 3] = 0;
      velocities[i * 3 + 1] = 0;
      velocities[i * 3 + 2] = 0;

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
    const delay = audioCtx.createDelay();
    const feedback = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = 440;
    filter.type = 'lowpass';
    filter.frequency.value = 1000;
    delay.delayTime.value = 0.3;
    feedback.gain.value = 0.3;
    gainNode.gain.value = 0;

    oscillator.connect(filter);
    filter.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();

    // Mouse-based gesture control (MediaPipe requires camera permissions)
    const handleMouseMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const targetX = (x - 0.5) * 100;
      const targetY = (0.5 - y) * 100;
      for (let j = 0; j < particleCount; j++) {
        const dx = targetX - positions[j * 3];
        const dy = targetY - positions[j * 3 + 1];
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 20) {
          velocities[j * 3] += (dx / distance) * 0.5;
          velocities[j * 3 + 1] += (dy / distance) * 0.5;
        }
      }
      if (e.buttons === 1) {
        const freq = 200 + y * 800;
        oscillator.frequency.setTargetAtTime(freq, audioCtx.currentTime, 0.01);
        gainNode.gain.setTargetAtTime(0.3, audioCtx.currentTime, 0.01);
      } else {
        gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.05);
      }
    };
    renderer.domElement.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.016;

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];

        velocities[i * 3] *= 0.98;
        velocities[i * 3 + 1] *= 0.98;
        velocities[i * 3 + 2] *= 0.98;

        if (Math.abs(positions[i * 3]) > 50) positions[i * 3] *= -0.8;
        if (Math.abs(positions[i * 3 + 1]) > 50) positions[i * 3 + 1] *= -0.8;
      }

      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      try { renderer.domElement.removeEventListener('mousemove', handleMouseMove); } catch(e) {}
      oscillator.stop();
      renderer.dispose();
    };
  }, [isRecording, sessionId]);

  const startSession = async () => {
    const name = sessionName || `Session ${new Date().toLocaleTimeString()}`;
    const id = `session_${Date.now()}`;
    setSessionId(id);
    setIsRecording(true);
    setGestureCount(0);
  };

  const stopSession = async () => {
    setIsRecording(false);
    setSessionId(null);
  };

  const logGestureEvent = async (hand, x, y, velocity, audioParams) => {
    if (!sessionId) return;
    setGestureCount(prev => prev + 1);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <video ref={videoRef} className="hidden" />

      {/* Top Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <Link 
          to={createPageUrl('Home')}
          className="backdrop-blur-md bg-black/40 border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2 text-white/60 hover:text-cyan-400 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs uppercase tracking-wider">Back</span>
        </Link>

        <div className="backdrop-blur-md bg-black/60 border border-cyan-400/30 rounded-lg px-4 py-2">
          <div className="text-cyan-400 font-bold text-sm">GESTURE STUDIO</div>
          <div className="text-white/40 text-xs">33.3FM DOGECHAIN</div>
        </div>

        <button
          onClick={() => setShowHistory(!showHistory)}
          className="backdrop-blur-md bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white/60 hover:text-cyan-400 transition-all"
        >
          <User className="w-5 h-5" />
        </button>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-0 right-0 z-10 flex flex-col items-center gap-4 px-4">
        <div className="backdrop-blur-xl bg-black/60 border border-cyan-400/30 rounded-2xl p-4 max-w-md w-full">
          <Input
            placeholder="Session Name (optional)"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            disabled={isRecording}
            className="bg-white/5 border-white/10 text-white mb-3"
          />

          <div className="flex gap-3">
            {!isRecording ? (
              <Button
                onClick={startSession}
                className="flex-1 bg-gradient-to-r from-cyan-400 to-purple-600 hover:opacity-90"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Session
              </Button>
            ) : (
              <Button
                onClick={stopSession}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-700 hover:opacity-90"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop ({gestureCount} gestures)
              </Button>
            )}

            <Button
              onClick={() => setShowSettings(!showSettings)}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Hand Status */}
        {(currentHands.left || currentHands.right) && (
          <div className="flex gap-4">
            {currentHands.left && (
              <div className="backdrop-blur-md bg-black/40 border border-cyan-400/30 rounded-lg px-3 py-2 text-xs text-cyan-400">
                Left Hand Active
              </div>
            )}
            {currentHands.right && (
              <div className="backdrop-blur-md bg-black/40 border border-purple-400/30 rounded-lg px-3 py-2 text-xs text-purple-400">
                Right Hand Active
              </div>
            )}
          </div>
        )}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-20 right-4 z-20 backdrop-blur-xl bg-black/80 border border-white/10 rounded-xl p-4 w-64">
          <div className="text-white text-sm font-mono mb-2">Gesture Settings</div>
          <p className="text-white/40 text-xs font-mono mb-4">Move mouse over canvas to control particles. Click and drag to play audio.</p>
          <button onClick={() => setShowSettings(false)} className="text-white/40 text-xs font-mono border border-white/10 px-3 py-1 rounded">Close</button>
        </div>
      )}
    </div>
  );
}