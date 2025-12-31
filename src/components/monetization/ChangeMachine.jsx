import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import * as THREE from 'three';
import { Zap, DollarSign, TrendingUp, Sparkles, X } from 'lucide-react';

export default function ChangeMachine({ isOpen, onClose }) {
  const canvasRef = useRef(null);
  const [usdAmount, setUsdAmount] = useState(10);
  const [chaosAmount, setChaosAmount] = useState(100);
  const [balance, setBalance] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const conversionRate = 10; // 1 USD = 10 CHAOS XP

  useEffect(() => {
    setChaosAmount(usdAmount * conversionRate);
  }, [usdAmount]);

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const user = await base44.auth.me();
      const accounts = await base44.entities.ChaosXP.filter({ user_email: user.email });
      if (accounts.length > 0) {
        setBalance(accounts[0].balance);
      } else {
        await base44.entities.ChaosXP.create({ user_email: user.email, balance: 0, total_earned: 0, total_spent: 0 });
        setBalance(0);
      }
    } catch (error) {
      console.error('Failed to load balance:', error);
    }
  };

  const convertCurrency = async () => {
    if (usdAmount < 1) return;
    setIsProcessing(true);
    
    try {
      const user = await base44.auth.me();
      
      // Update balance
      const accounts = await base44.entities.ChaosXP.filter({ user_email: user.email });
      const account = accounts[0];
      await base44.entities.ChaosXP.update(account.id, {
        balance: account.balance + chaosAmount,
        total_earned: account.total_earned + chaosAmount
      });

      // Log transaction
      await base44.entities.ChaosTransaction.create({
        user_email: user.email,
        type: 'purchase',
        amount: chaosAmount,
        usd_amount: usdAmount,
        description: `Converted $${usdAmount} to ${chaosAmount} CHAOS XP`
      });

      setBalance(account.balance + chaosAmount);
      setUsdAmount(10);
      setTimeout(() => {
        setIsProcessing(false);
      }, 1500);
    } catch (error) {
      console.error('Conversion failed:', error);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!canvasRef.current || !isOpen) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(50, 400 / 400, 0.1, 1000);
    camera.position.set(0, 2, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(400, 400);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Change machine body
    const machineGroup = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(2, 3, 1.5),
      new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.8,
        roughness: 0.3
      })
    );
    machineGroup.add(body);

    // Screen
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 1),
      new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.5
      })
    );
    screen.position.set(0, 0.5, 0.76);
    machineGroup.add(screen);

    // Coin slot
    const coinSlot = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.1, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9 })
    );
    coinSlot.position.set(0, -0.5, 0.76);
    machineGroup.add(coinSlot);

    // CHAOS XP dispenser
    const dispenser = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.3, 0.3),
      new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 0.6
      })
    );
    dispenser.position.set(0, -1.2, 0.76);
    machineGroup.add(dispenser);

    // Floating CHAOS XP symbols
    const chaosSymbols = [];
    for (let i = 0; i < 8; i++) {
      const symbol = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.1),
        new THREE.MeshStandardMaterial({
          color: 0x00ffff,
          emissive: 0x00ffff,
          emissiveIntensity: 0.8
        })
      );
      symbol.position.set(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2
      );
      chaosSymbols.push(symbol);
      scene.add(symbol);
    }

    scene.add(machineGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const keyLight = new THREE.SpotLight(0x00ffff, 1.5, 20);
    keyLight.position.set(0, 5, 5);
    scene.add(keyLight);

    const accentLight = new THREE.PointLight(0xff00ff, 1, 10);
    accentLight.position.set(0, -1, 3);
    scene.add(accentLight);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      machineGroup.rotation.y = Math.sin(time * 0.3) * 0.1;
      screen.material.emissiveIntensity = 0.5 + Math.sin(time * 3) * 0.2;

      chaosSymbols.forEach((symbol, i) => {
        symbol.rotation.x = time * (0.5 + i * 0.1);
        symbol.rotation.y = time * (0.3 + i * 0.1);
        symbol.position.y += Math.sin(time * 2 + i) * 0.01;
      });

      if (isProcessing) {
        accentLight.intensity = 1 + Math.sin(time * 10) * 0.5;
        dispenser.material.emissiveIntensity = 0.6 + Math.sin(time * 10) * 0.4;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
    };
  }, [isOpen, isProcessing]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="relative flex gap-6">
        {/* 3D Visualization */}
        <div className="relative">
          <canvas ref={canvasRef} className="rounded-2xl border-2 border-cyan-400/50" />
          <div className="absolute top-4 left-4 text-xs uppercase tracking-widest text-cyan-400">
            WIRED CHAOS • CHANGE MACHINE
          </div>
        </div>

        {/* Control Panel */}
        <div className="backdrop-blur-md bg-black/80 border-2 border-cyan-400/50 rounded-2xl p-6 w-96">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-light text-white tracking-wide">Currency Exchange</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5 text-white/60" />
            </Button>
          </div>

          {/* Balance Display */}
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-cyan-400/20 to-purple-600/20 border border-cyan-400/30">
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/60 uppercase tracking-wider">Your Balance</div>
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-bold text-cyan-400 mt-2">{balance.toFixed(0)} XP</div>
          </div>

          {/* Conversion */}
          <div className="space-y-4">
            <div>
              <label className="text-xs text-white/60 uppercase tracking-wider mb-2 block">
                USD Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  type="number"
                  min="1"
                  step="1"
                  value={usdAmount}
                  onChange={(e) => setUsdAmount(parseFloat(e.target.value) || 1)}
                  className="bg-white/5 border-white/10 text-white pl-10"
                />
              </div>
            </div>

            <div className="flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
            </div>

            <div>
              <label className="text-xs text-white/60 uppercase tracking-wider mb-2 block">
                CHAOS XP
              </label>
              <div className="relative">
                <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                <Input
                  type="number"
                  value={chaosAmount}
                  readOnly
                  className="bg-cyan-400/10 border-cyan-400/30 text-cyan-400 pl-10"
                />
              </div>
            </div>

            <div className="text-xs text-center text-white/40">
              Rate: 1 USD = {conversionRate} CHAOS XP
            </div>

            {/* Quick amounts */}
            <div className="grid grid-cols-4 gap-2">
              {[10, 25, 50, 100].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setUsdAmount(amount)}
                  className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm transition-all"
                >
                  ${amount}
                </button>
              ))}
            </div>

            <Button
              onClick={convertCurrency}
              disabled={isProcessing || usdAmount < 1}
              className="w-full bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-500 hover:to-purple-700 text-white"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Convert to CHAOS XP
                </>
              )}
            </Button>

            <p className="text-xs text-white/40 text-center">
              WIRED CHAOS currency • Non-refundable • Use for jukebox, tips, and premium features
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}