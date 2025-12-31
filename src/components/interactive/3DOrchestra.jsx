import React, { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import * as THREE from 'three';
import { Music, Lock, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ThreeDOrchestra({ isPremium = false }) {
  const mountRef = useRef(null);
  const [isLocked, setIsLocked] = useState(!isPremium);
  const [chaosBalance, setChaosBalance] = useState(0);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const audioContextRef = useRef(null);
  const unlockCost = 500; // 500 CHAOS XP per use

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const user = await base44.auth.me();
      const accounts = await base44.entities.ChaosXP.filter({ user_email: user.email });
      if (accounts.length > 0) {
        setChaosBalance(accounts[0].balance);
      }
    } catch (error) {
      console.error('Failed to load balance:', error);
    }
  };

  const unlockOrchestra = async () => {
    if (chaosBalance < unlockCost) return;
    setIsUnlocking(true);

    try {
      const user = await base44.auth.me();
      const accounts = await base44.entities.ChaosXP.filter({ user_email: user.email });
      const account = accounts[0];

      await base44.entities.ChaosXP.update(account.id, {
        balance: account.balance - unlockCost,
        total_spent: account.total_spent + unlockCost
      });

      await base44.entities.ChaosTransaction.create({
        user_email: user.email,
        type: 'spend',
        amount: unlockCost,
        description: '3D Orchestra access'
      });

      setChaosBalance(account.balance - unlockCost);
      setIsLocked(false);
      setIsUnlocking(false);
    } catch (error) {
      console.error('Failed to unlock:', error);
      setIsUnlocking(false);
    }
  };

  useEffect(() => {
    if (!mountRef.current || isLocked) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);
    camera.position.set(0, 5, 12);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(500, 400);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

    const orchestra = new THREE.Group();
    const instruments = [];

    // Instrument definitions with colors and frequencies
    const instrumentData = [
      { name: 'Violin', color: 0xff0000, freq: 440, pos: [-3, 0, 0] },
      { name: 'Cello', color: 0xff6600, freq: 220, pos: [-1.5, 0, 0] },
      { name: 'Flute', color: 0xffff00, freq: 880, pos: [0, 0, 0] },
      { name: 'Clarinet', color: 0x00ff00, freq: 660, pos: [1.5, 0, 0] },
      { name: 'Trumpet', color: 0x00ffff, freq: 523, pos: [3, 0, 0] },
      { name: 'French Horn', color: 0x0000ff, freq: 349, pos: [-3, 0, 2] },
      { name: 'Trombone', color: 0xff00ff, freq: 294, pos: [-1.5, 0, 2] },
      { name: 'Tuba', color: 0xff0088, freq: 147, pos: [0, 0, 2] },
      { name: 'Harp', color: 0xffd700, freq: 523, pos: [1.5, 0, 2] },
      { name: 'Piano', color: 0xffffff, freq: 261, pos: [3, 0, 2] }
    ];

    instrumentData.forEach(data => {
      const instrument = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 32, 32),
        new THREE.MeshStandardMaterial({
          color: data.color,
          emissive: data.color,
          emissiveIntensity: 0.3,
          metalness: 0.7,
          roughness: 0.3
        })
      );
      instrument.position.set(...data.pos);
      instrument.userData = { ...data };
      instruments.push(instrument);
      orchestra.add(instrument);

      // Add label
      const labelSprite = createTextSprite(data.name);
      labelSprite.position.copy(instrument.position);
      labelSprite.position.y += 0.8;
      labelSprite.scale.set(1, 0.5, 1);
      orchestra.add(labelSprite);
    });

    function createTextSprite(text) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 64;
      
      context.fillStyle = 'rgba(0, 255, 255, 0.8)';
      context.font = '24px Arial';
      context.textAlign = 'center';
      context.fillText(text, 128, 40);
      
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture });
      return new THREE.Sprite(material);
    }

    scene.add(orchestra);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0x00ffff, 2, 20);
    keyLight.position.set(0, 8, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xff00ff, 1.5, 15);
    rimLight.position.set(-5, 5, -5);
    scene.add(rimLight);

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const playInstrument = (frequency, name) => {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 1);
      
      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 1);
    };

    const onMouseMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(instruments);

      instruments.forEach(inst => {
        inst.material.emissiveIntensity = 0.3;
        inst.scale.set(1, 1, 1);
      });

      if (intersects.length > 0) {
        const inst = intersects[0].object;
        inst.material.emissiveIntensity = 1;
        inst.scale.set(1.2, 1.2, 1.2);
        renderer.domElement.style.cursor = 'pointer';
      } else {
        renderer.domElement.style.cursor = 'default';
      }
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(instruments);

      if (intersects.length > 0) {
        const inst = intersects[0].object;
        playInstrument(inst.userData.freq, inst.userData.name);
      }
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      orchestra.rotation.y = time * 0.1;
      
      instruments.forEach((inst, i) => {
        inst.position.y = Math.sin(time * 2 + i) * 0.2;
      });

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
  }, [isLocked]);

  if (isLocked) {
    return (
      <div className="backdrop-blur-md bg-black/60 border-2 border-cyan-400/50 rounded-2xl p-6 w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg uppercase tracking-wider text-white">3D Orchestra</h3>
          </div>
          <Crown className="w-5 h-5 text-cyan-400" />
        </div>
        
        <div className="aspect-[5/4] rounded-xl bg-gradient-to-br from-cyan-400/10 to-purple-600/10 border-2 border-cyan-400/30 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-10">
            <Lock className="w-16 h-16 text-cyan-400" />
            <div className="text-center">
              <h4 className="text-xl text-white mb-2">Premium Feature</h4>
              <p className="text-sm text-white/60 mb-4">Unlock the full orchestra experience</p>
              <div className="text-xs text-white/40 mb-4">
                Your Balance: {chaosBalance} XP • Cost: {unlockCost} XP
              </div>
              <Button
                onClick={unlockOrchestra}
                disabled={chaosBalance < unlockCost || isUnlocking}
                className="bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-500 hover:to-purple-700 text-white"
              >
                {isUnlocking ? (
                  'Unlocking...'
                ) : chaosBalance < unlockCost ? (
                  'Insufficient CHAOS XP'
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Unlock for {unlockCost} XP
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-xs text-white/60">
          <div className="flex items-center gap-2">
            <Music className="w-3 h-3 text-cyan-400" />
            <span>10 orchestral instruments</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>Interactive touchscreen control</span>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="w-3 h-3 text-cyan-400" />
            <span>Premium experience</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-md bg-black/40 border-2 border-cyan-400/50 rounded-2xl p-4 w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm uppercase tracking-wider text-white">3D Orchestra</h3>
        </div>
        <Crown className="w-4 h-4 text-cyan-400 animate-pulse" />
      </div>
      <div ref={mountRef} className="rounded-xl overflow-hidden" />
      <div className="mt-2 text-xs text-center text-white/60">
        Click instruments to play • Rotate view
      </div>
    </div>
  );
}