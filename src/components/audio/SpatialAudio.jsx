import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

export default function SpatialAudio({ audioUrl, position = { x: 0, y: 0, z: 0 }, cameraPosition = { x: 0, y: 0, z: 0 } }) {
  const audioContextRef = useRef(null);
  const audioElementRef = useRef(null);
  const pannerRef = useRef(null);
  const sourceRef = useRef(null);
  const analyserRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  useEffect(() => {
    // Initialize Web Audio API for spatial audio
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContextRef.current = new AudioContext();

    // Enhanced panner with better 3D positioning
    const panner = audioContextRef.current.createPanner();
    panner.panningModel = 'HRTF'; // Head-related transfer function
    panner.distanceModel = 'inverse';
    panner.refDistance = 1;
    panner.maxDistance = 10000;
    panner.rolloffFactor = 2; // Increased for more realistic falloff
    panner.coneInnerAngle = 120;
    panner.coneOuterAngle = 180;
    panner.coneOuterGain = 0.3;

    // Set sound source position
    panner.setPosition(position.x, position.y, position.z);
    panner.setOrientation(0, 0, -1);
    pannerRef.current = panner;

    // Enhanced listener with orientation
    const listener = audioContextRef.current.listener;
    if (listener.positionX) {
      listener.positionX.value = cameraPosition.x;
      listener.positionY.value = cameraPosition.y;
      listener.positionZ.value = cameraPosition.z;
      listener.forwardX.value = 0;
      listener.forwardY.value = 0;
      listener.forwardZ.value = -1;
      listener.upX.value = 0;
      listener.upY.value = 1;
      listener.upZ.value = 0;
    } else {
      listener.setPosition(cameraPosition.x, cameraPosition.y, cameraPosition.z);
      listener.setOrientation(0, 0, -1, 0, 1, 0);
    }

    // Analyser for visualizing audio
    const analyser = audioContextRef.current.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [position, cameraPosition]);

  const togglePlay = async () => {
    if (!audioElementRef.current) {
      // Create audio element
      const audio = new Audio(audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
      audio.loop = true;
      audio.crossOrigin = 'anonymous';
      audioElementRef.current = audio;

      // Connect to Web Audio API with analyser
      const source = audioContextRef.current.createMediaElementSource(audio);
      source.connect(analyserRef.current);
      analyserRef.current.connect(pannerRef.current);
      pannerRef.current.connect(audioContextRef.current.destination);
      sourceRef.current = source;

      // Start audio level monitoring
      const monitorAudio = () => {
        if (audioElementRef.current && !audioElementRef.current.paused) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average / 255);
          requestAnimationFrame(monitorAudio);
        }
      };
      monitorAudio();
    }

    if (isPlaying) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    } else {
      await audioContextRef.current.resume();
      audioElementRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (audioElementRef.current) {
      audioElementRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          onClick={togglePlay}
          size="sm"
          variant="outline"
          className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
        >
          {isPlaying ? 'Pause' : 'Play'} 3D Audio
        </Button>
        {isPlaying && (
          <Button
            onClick={toggleMute}
            size="icon"
            variant="ghost"
            className="text-white/60 hover:text-cyan-400"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        )}
      </div>
      
      {isPlaying && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-cyan-400">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Spatial Audio Active • HRTF</span>
          </div>
          
          {/* Audio Level Meter */}
          <div className="space-y-1">
            <div className="text-[10px] text-white/40 uppercase tracking-wider">Audio Level</div>
            <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-red-400 transition-all duration-75"
                style={{ width: `${audioLevel * 100}%` }}
              />
            </div>
          </div>

          {/* 3D Position Indicator */}
          <div className="text-[10px] text-white/40 space-y-0.5">
            <div>Source: [{position.x.toFixed(1)}, {position.y.toFixed(1)}, {position.z.toFixed(1)}]</div>
            <div>Listener: [{cameraPosition.x.toFixed(1)}, {cameraPosition.y.toFixed(1)}, {cameraPosition.z.toFixed(1)}]</div>
          </div>
        </div>
      )}
    </div>
  );
}