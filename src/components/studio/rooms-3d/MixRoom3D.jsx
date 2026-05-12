import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Environment, PerspectiveCamera } from '@react-three/drei';

export function MixRoom3D() {
  const meshRef = useRef(null);
  const faderRefs = useRef([]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.06) * 0.04;
    }
    // Animate faders
    faderRefs.current.forEach((ref, i) => {
      if (ref) {
        ref.position.y = 0.3 + Math.sin(state.clock.elapsedTime * (0.5 + i * 0.2)) * 0.15;
      }
    });
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 4, 12]} />
      <Environment preset="studio" />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 5, 0]} intensity={0.7} color="#ff0033" />
      <pointLight position={[-4, 3, 2]} intensity={0.4} color="#00ffff" />
      <pointLight position={[4, 3, 2]} intensity={0.4} color="#ffff00" />
      <group ref={meshRef}>
        {/* Main mixing console - large */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[8, 0.2, 3]} />
          <meshStandardMaterial color="#0d0d0d" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Console surface detail */}
        <mesh position={[0, 0.41, 0]}>
          <boxGeometry args={[7.8, 0.02, 2.8]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Fader channels - 16 channels */}
        {[...Array(16)].map((_, i) => {
          const x = -3.75 + i * 0.5;
          return (
            <group key={`ch${i}`}>
              {/* Fader track */}
              <mesh position={[x, 0.45, 0]}>
                <boxGeometry args={[0.05, 0.02, 1.5]} />
                <meshStandardMaterial color="#333" metalness={0.9} />
              </mesh>
              {/* Fader cap */}
              <mesh
                ref={el => faderRefs.current[i] = el}
                position={[x, 0.5, Math.sin(i * 0.5) * 0.4]}
              >
                <boxGeometry args={[0.25, 0.12, 0.15]} />
                <meshStandardMaterial
                  color={i % 4 === 0 ? '#ff0033' : '#00ffff'}
                  emissive={i % 4 === 0 ? '#ff0033' : '#00ffff'}
                  emissiveIntensity={0.3}
                  metalness={0.8}
                />
              </mesh>
              {/* Channel LED */}
              <mesh position={[x, 0.46, -1.1]}>
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshStandardMaterial
                  color={`hsl(${i * 22}, 100%, 60%)`}
                  emissive={`hsl(${i * 22}, 100%, 40%)`}
                  emissiveIntensity={0.8}
                />
              </mesh>
            </group>
          );
        })}
        {/* VU meters - floating above console */}
        {[...Array(8)].map((_, i) => (
          <Float key={`vu${i}`} speed={1 + i * 0.1} floatIntensity={0.05}>
            <mesh position={[-3.5 + i, 1.5, -1]}>
              <boxGeometry args={[0.15, 1.2, 0.05]} />
              <meshStandardMaterial color="#000" metalness={0.9} />
            </mesh>
            {/* VU bar */}
            <mesh position={[-3.5 + i, 1.0 + Math.random() * 0.3, -0.97]}>
              <boxGeometry args={[0.1, 0.6 + Math.random() * 0.5, 0.02]} />
              <meshStandardMaterial
                color={i < 6 ? '#00ff88' : '#ff0033'}
                emissive={i < 6 ? '#00ff88' : '#ff0033'}
                emissiveIntensity={0.6}
              />
            </mesh>
          </Float>
        ))}
        {/* Monitor speakers */}
        {[-5, 5].map((x, i) => (
          <group key={`mon${i}`} position={[x, 2.5, -3]}>
            <mesh>
              <boxGeometry args={[1, 1.5, 0.8]} />
              <meshStandardMaterial color="#111" metalness={0.7} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.2, 0.41]}>
              <circleGeometry args={[0.35, 32]} />
              <meshStandardMaterial color="#222" metalness={0.5} />
            </mesh>
            <mesh position={[0, -0.4, 0.41]}>
              <circleGeometry args={[0.15, 32]} />
              <meshStandardMaterial color="#ff0033" emissive="#ff0033" emissiveIntensity={0.4} />
            </mesh>
          </group>
        ))}
        {/* Floating EQ nodes */}
        {[...Array(6)].map((_, i) => (
          <Float key={`eq${i}`} speed={0.8 + i * 0.15} rotationIntensity={0.2} floatIntensity={0.5}>
            <mesh position={[-2.5 + i, 3.5, 1]}>
              <octahedronGeometry args={[0.2, 0]} />
              <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} wireframe />
            </mesh>
          </Float>
        ))}
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#060606" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>
    </>
  );
}
