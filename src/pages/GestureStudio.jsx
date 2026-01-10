import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import * as THREE from 'three';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { ArrowLeft, Play, Square, Save, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GestureControls from '@/components/gesture/GestureControls';
import SessionHistory from '@/components/gesture/SessionHistory';

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
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    } catch (error) {
      console.error('User not logged in');
    }
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
    const reverb = audioCtx.createConvolver();

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

    // MediaPipe Hands
    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    hands.onResults((results) => {
      if (results.multiHandLandmarks && results.multiHandedness) {
        const handsData = { left: null, right: null };

        results.multiHandLandmarks.forEach((landmarks, i) => {
          const handedness = results.multiHandedness[i].label.toLowerCase();
          const indexTip = landmarks[8];
          const velocity = Math.random() * 2; // Simplified velocity calculation

          handsData[handedness] = {
            x: indexTip.x,
            y: indexTip.y,
            velocity
          };

          // Apply forces to particles
          const targetX = (indexTip.x - 0.5) * 100;
          const targetY = (0.5 - indexTip.y) * 100;

          for (let j = 0; j < particleCount; j++) {
            const dx = targetX - positions[j * 3];
            const dy = targetY - positions[j * 3 + 1];
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 20) {
              const force = handedness === 'right' ? 0.5 : -0.5;
              velocities[j * 3] += (dx / distance) * force;
              velocities[j * 3 + 1] += (dy / distance) * force;
            }
          }

          // Audio mapping
          if (handedness === 'right') {
            const freq = 200 + indexTip.y * 800;
            oscillator.frequency.setTargetAtTime(freq, audioCtx.currentTime, 0.01);
            filter.frequency.setTargetAtTime(500 + indexTip.x * 2000, audioCtx.currentTime, 0.01);
            gainNode.gain.setTargetAtTime(velocity * 0.3, audioCtx.currentTime, 0.01);
          }

          // Log gesture event
          if (isRecording && sessionId) {
            logGestureEvent(handedness, indexTip.x, indexTip.y, velocity);
          }
        });

        setCurrentHands(handsData);
      }
    });

    const cameraInstance = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current });
      },
      width: 640,
      height: 480
    });
    cameraInstance.start();

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
      cameraInstance.stop();
      oscillator.stop();
      renderer.dispose();
    };
  }, [isRecording, sessionId]);

  const startSession = async () => {
    if (!user) {
      alert('Please sign in to record sessions');
      return;
    }

    const name = sessionName || `Session ${new Date().toLocaleTimeString()}`;
    const session = await base44.entities.GestureSession.create({
      user_email: user.email,
      session_name: name,
      timestamp: new Date().toISOString(),
      duration_seconds: 0,
      gesture_count: 0
    });

    setSessionId(session.id);
    setIsRecording(true);
    setGestureCount(0);
  };

  const stopSession = async () => {
    if (sessionId) {
      await base44.entities.GestureSession.update(sessionId, {
        gesture_count: gestureCount
      });
    }
    setIsRecording(false);
    setSessionId(null);
  };

  const logGestureEvent = async (hand, x, y, velocity) => {
    if (!sessionId) return;

    try {
      await base44.entities.GestureEvent.create({
        session_id: sessionId,
        hand,
        gesture_type: 'point',
        position_x: x,
        position_y: y,
        velocity,
        timestamp: new Date().toISOString()
      });
      setGestureCount(prev => prev + 1);
    } catch (error) {
      console.error('Failed to log gesture:', error);
    }
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
        <GestureControls onClose={() => setShowSettings(false)} />
      )}

      {/* Session History */}
      {showHistory && user && (
        <SessionHistory userEmail={user.email} onClose={() => setShowHistory(false)} />
      )}
    </div>
  );
}