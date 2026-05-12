import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { SignalBooth3D } from './rooms-3d/SignalBooth3D';
import { ProducerRoom3D } from './rooms-3d/ProducerRoom3D';
import { MixRoom3D } from './rooms-3d/MixRoom3D';
import { ControlRoom3D } from './rooms-3d/ControlRoom3D';
import { NeonVault3D } from './rooms-3d/NeonVault3D';

const ROOMS = {
  'signal-booth': SignalBooth3D,
  'producer-room': ProducerRoom3D,
  'mix-room': MixRoom3D,
  'control-room': ControlRoom3D,
  'neon-vault': NeonVault3D,
};

export function Room3DWrapper({ room, className = '', opacity = 0.3, interactive = false }) {
  const RoomComponent = ROOMS[room];

  useEffect(() => {
    const suppressResizeObserver = (e) => {
      if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
        e.stopImmediatePropagation();
      }
    };
    window.addEventListener('error', suppressResizeObserver);
    return () => window.removeEventListener('error', suppressResizeObserver);
  }, []);

  if (!RoomComponent) return null;

  return (
    <div
      className={className}
      style={{
        position: interactive ? 'relative' : 'fixed',
        inset: 0,
        zIndex: interactive ? 0 : -10,
        opacity,
        pointerEvents: interactive ? 'auto' : 'none',
      }}
    >
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        resize={{ debounce: 100 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <RoomComponent />
        </Suspense>
      </Canvas>
    </div>
  );
}
