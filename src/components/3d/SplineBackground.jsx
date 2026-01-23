import React from 'react';
import SplineScene from './SplineScene';

export default function SplineBackground({ scene, children, overlay = true }) {
  return (
    <div className="relative w-full h-full">
      {/* Spline 3D Background */}
      <div className="absolute inset-0 z-0">
        <SplineScene 
          scene={scene} 
          className="w-full h-full"
        />
      </div>

      {/* Optional overlay for better text readability */}
      {overlay && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-[1]" />
      )}

      {/* Content layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}