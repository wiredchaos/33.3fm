import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Environment, PerspectiveCamera } from '@react-three/drei';

export function ControlRoom3D() {
  const screenRef = useRef(null);
  const orbitRef = useRef(null);

  useFrame((state) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
    if (screenRef.current) {
      screenRef.current.children.forEach((child, i) => {
        if (child.material) {
          child.material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.1;
        }
      });
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 4, 12]} />
      <Environment preset="night" />
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#ff0033" />
      <pointLight position={[-5, 3, 0]} intensity={0.3} color="#00ffff" />
      <pointLight position={[5, 3, 0]} intensity={0.3} color="#ff0033" />

      {/* Monitor wall - 3x2 screens */}
      <group ref={screenRef} position={[0, 2.5, -5]}>
        {[...Array(6)].map((_, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const x = (col - 1) * 2.5;
          const y = (1 - row) * 1.5;
          const colors = ['#ff0033', '#00ffff', '#ffff00', '#00ff88', '#ff00ff', '#ff8800'];
          return (
            <group key={`scr${i}`} position={[x, y, 0]}>
              <mesh>
                <boxGeometry args={[2.2, 1.3, 0.05]} />
                <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
              </mesh>
              <mesh position={[0, 0, 0.03]}>
                <planeGeometry args={[2.0, 1.1]} />
                <meshStandardMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={0.3} transparent opacity={0.8} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Central command desk */}
      <mesh position={[0, 0.4, 1]}>
        <boxGeometry args={[6, 0.15, 2.5]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Holographic display above desk */}
      <Float speed={0.5} floatIntensity={0.3}>
        <mesh position={[0, 2, 1]}>
          <torusGeometry args={[1.5, 0.02, 16, 64]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.6} transparent opacity={0.7} />
        </mesh>
      </Float>

      {/* Orbiting data nodes */}
      <group ref={orbitRef} position={[0, 2, 1]}>
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <Float key={`dn${i}`} speed={1 + i * 0.1} floatIntensity={0.2}>
              <mesh position={[Math.cos(angle) * 1.5, Math.sin(i * 0.5) * 0.3, Math.sin(angle) * 1.5]}>
                <boxGeometry args={[0.15, 0.15, 0.15]} />
                <meshStandardMaterial
                  color={i % 2 === 0 ? '#ff0033' : '#00ffff'}
                  emissive={i % 2 === 0 ? '#ff0033' : '#00ffff'}
                  emissiveIntensity={0.6}
                />
              </mesh>
            </Float>
          );
        })}
      </group>

      {/* Control buttons on desk */}
      {[...Array(12)].map((_, i) => (
        <mesh key={`btn${i}`} position={[-2.5 + i * 0.45, 0.5, 1]}>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 12]} />
          <meshStandardMaterial
            color={`hsl(${i * 30}, 100%, 50%)`}
            emissive={`hsl(${i * 30}, 100%, 30%)`}
            emissiveIntensity={0.5}
            metalness={0.8}
          />
        </mesh>
      ))}

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#050505" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Ceiling grid lights */}
      {[...Array(9)].map((_, i) => {
        const x = ((i % 3) - 1) * 4;
        const z = (Math.floor(i / 3) - 1) * 4;
        return (
          <pointLight key={`cl${i}`} position={[x, 5, z]} intensity={0.1} color="#ff0033" distance={6} />
        );
      })}
    </>
  );
}
