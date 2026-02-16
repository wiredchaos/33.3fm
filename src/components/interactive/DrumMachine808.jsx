import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

const DRUM_SOUNDS = {
  kick: { color: 'bg-red-500', label: 'KICK' },
  snare: { color: 'bg-cyan-400', label: 'SNARE' },
  hihat: { color: 'bg-yellow-400', label: 'HI-HAT' },
  clap: { color: 'bg-purple-500', label: 'CLAP' },
  rim: { color: 'bg-green-400', label: 'RIM' },
  cowbell: { color: 'bg-orange-400', label: 'COWBELL' },
  tom: { color: 'bg-pink-400', label: 'TOM' },
  cymbal: { color: 'bg-blue-400', label: 'CYMBAL' }
};

export default function DrumMachine808({ onPatternChange, className }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bpm, setBpm] = useState(120);
  const [volume, setVolume] = useState(70);
  const [pattern, setPattern] = useState(
    Object.keys(DRUM_SOUNDS).reduce((acc, sound) => {
      acc[sound] = Array(16).fill(false);
      return acc;
    }, {})
  );

  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      const interval = (60 / bpm) * 1000 / 4; // 16th notes
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % 16);
      }, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, bpm]);

  useEffect(() => {
    if (isPlaying) {
      // Play sounds for active steps
      Object.keys(pattern).forEach((sound) => {
        if (pattern[sound][currentStep]) {
          playSound(sound);
        }
      });
    }
  }, [currentStep, isPlaying]);

  const playSound = (sound) => {
    // Simulate sound playback
    onPatternChange?.({ sound, step: currentStep, pattern });
  };

  const toggleStep = (sound, step) => {
    setPattern((prev) => ({
      ...prev,
      [sound]: prev[sound].map((active, idx) => (idx === step ? !active : active))
    }));
  };

  const clearPattern = () => {
    setPattern(
      Object.keys(DRUM_SOUNDS).reduce((acc, sound) => {
        acc[sound] = Array(16).fill(false);
        return acc;
      }, {})
    );
  };

  const randomPattern = () => {
    setPattern(
      Object.keys(DRUM_SOUNDS).reduce((acc, sound) => {
        acc[sound] = Array(16).fill(false).map(() => Math.random() > 0.7);
        return acc;
      }, {})
    );
  };

  return (
    <div className={cn("backdrop-blur-xl bg-black/80 border border-red-500/30 rounded-2xl p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <div className="text-2xl font-bold text-white">808</div>
          </div>
          <div>
            <h3 className="text-xl font-light text-white">Drum Machine</h3>
            <p className="text-xs text-white/40 uppercase tracking-wider">TR-808 Style</p>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider ${
          isPlaying ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-white/5 text-white/40 border border-white/10'
        }`}>
          {isPlaying ? '● REC' : 'STOPPED'}
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-cyan-400 hover:bg-cyan-500'} text-black`}
        >
          {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isPlaying ? 'Stop' : 'Play'}
        </Button>
        <Button onClick={clearPattern} variant="outline" className="border-white/20">
          <RotateCcw className="w-4 h-4 mr-2" />
          Clear
        </Button>
        <Button onClick={randomPattern} variant="outline" className="border-purple-400/30 text-purple-400">
          Random
        </Button>
      </div>

      {/* BPM & Volume */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-3">
          <label className="text-xs text-white/60 uppercase tracking-wider mb-2 block">BPM</label>
          <Slider
            value={[bpm]}
            onValueChange={([v]) => setBpm(v)}
            min={60}
            max={200}
            step={1}
            className="mb-2"
          />
          <div className="text-center text-2xl font-bold text-cyan-400">{bpm}</div>
        </div>

        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-3">
          <label className="text-xs text-white/60 uppercase tracking-wider mb-2 block">Volume</label>
          <div className="flex items-center gap-2 mb-2">
            <Volume2 className="w-4 h-4 text-white/60" />
            <Slider
              value={[volume]}
              onValueChange={([v]) => setVolume(v)}
              max={100}
              step={1}
              className="flex-1"
            />
          </div>
          <div className="text-center text-2xl font-bold text-cyan-400">{volume}%</div>
        </div>
      </div>

      {/* Sequencer Grid */}
      <div className="space-y-2">
        {Object.entries(DRUM_SOUNDS).map(([sound, config]) => (
          <div key={sound} className="flex items-center gap-2">
            <div className="w-20 text-xs font-mono text-white/60 uppercase tracking-wider">
              {config.label}
            </div>
            <div className="flex-1 grid grid-cols-16 gap-1">
              {pattern[sound].map((active, step) => (
                <button
                  key={step}
                  onClick={() => toggleStep(sound, step)}
                  className={cn(
                    "aspect-square rounded transition-all border",
                    active ? `${config.color} border-white/50 shadow-lg` : 'bg-white/5 border-white/10 hover:bg-white/10',
                    currentStep === step && isPlaying && 'ring-2 ring-white/50 scale-110'
                  )}
                >
                  {step % 4 === 0 && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className={cn(
                        "w-1 h-1 rounded-full",
                        active ? 'bg-black/30' : 'bg-white/20'
                      )} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2 mt-4">
        <div className="w-20 text-xs text-white/40 uppercase tracking-wider">Steps</div>
        <div className="flex-1 grid grid-cols-16 gap-1">
          {Array(16).fill(0).map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "aspect-square flex items-center justify-center text-[10px] font-mono rounded",
                currentStep === idx && isPlaying
                  ? 'bg-red-500 text-white'
                  : 'bg-white/5 text-white/40'
              )}
            >
              {idx + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}