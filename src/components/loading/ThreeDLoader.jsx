import React, { useEffect, useState } from 'react';
import { Loader2, Cpu, Zap } from 'lucide-react';

export default function ThreeDLoader({ progress = 0, stage = 'initializing', visible = true }) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  const stages = {
    initializing: { label: 'Initializing 3D Engine', icon: Cpu },
    loading_scene: { label: 'Loading Scene', icon: Loader2 },
    loading_assets: { label: 'Loading Assets', icon: Zap },
    optimizing: { label: 'Optimizing Performance', icon: Cpu },
    ready: { label: 'Ready', icon: Zap }
  };

  const currentStage = stages[stage] || stages.initializing;
  const Icon = currentStage.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 relative">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-400/20" />
          <div 
            className="absolute inset-0 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin"
            style={{ animationDuration: '1s' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="w-8 h-8 text-cyan-400" />
          </div>
        </div>

        <h2 className="text-xl text-white font-light mb-2">
          {currentStage.label}{dots}
        </h2>

        <div className="w-64 h-2 mx-auto bg-white/10 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-purple-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-sm text-white/60">
          {Math.round(progress)}%
        </div>

        <div className="mt-6 text-xs text-white/40 uppercase tracking-wider">
          Powered by WIRED CHAOS META
        </div>
      </div>
    </div>
  );
}