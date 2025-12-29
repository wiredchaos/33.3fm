import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

export default function SpatialAudio({ audioUrl, position = { x: 0, y: 0, z: 0 } }) {
  const audioContextRef = useRef(null);
  const audioElementRef = useRef(null);
  const pannerRef = useRef(null);
  const sourceRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Initialize Web Audio API for spatial audio
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContextRef.current = new AudioContext();

    const panner = audioContextRef.current.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.refDistance = 1;
    panner.maxDistance = 10000;
    panner.rolloffFactor = 1;
    panner.coneInnerAngle = 360;
    panner.coneOuterAngle = 0;
    panner.coneOuterGain = 0;

    // Set position
    panner.setPosition(position.x, position.y, position.z);
    pannerRef.current = panner;

    // Set listener position (viewer)
    const listener = audioContextRef.current.listener;
    if (listener.positionX) {
      listener.positionX.value = 0;
      listener.positionY.value = 0;
      listener.positionZ.value = 0;
    } else {
      listener.setPosition(0, 0, 0);
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [position]);

  const togglePlay = async () => {
    if (!audioElementRef.current) {
      // Create audio element
      const audio = new Audio(audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
      audio.loop = true;
      audio.crossOrigin = 'anonymous';
      audioElementRef.current = audio;

      // Connect to Web Audio API
      const source = audioContextRef.current.createMediaElementSource(audio);
      source.connect(pannerRef.current);
      pannerRef.current.connect(audioContextRef.current.destination);
      sourceRef.current = source;
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
    <div className="flex items-center gap-2">
      <Button
        onClick={togglePlay}
        size="sm"
        variant="outline"
        className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
      >
        {isPlaying ? 'Pause' : 'Play'} Spatial Audio
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
      {isPlaying && (
        <div className="text-xs text-cyan-400 animate-pulse">
          3D Audio Active
        </div>
      )}
    </div>
  );
}