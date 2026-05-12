import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Environment, PerspectiveCamera } from '@react-three/drei';

export function SignalBooth3D() {
  const meshRef = useRef(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 8]} />
      <Environment preset="studio" />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 3, 0]} intensity={0.5} color="#ff0033" />
      <pointLight position={[-3, 2, 2]} intensity={0.3} color="#00ffff" />
      <group ref={meshRef}>
        {/* Vocal Booth - glass cube */}
        <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
          <mesh position={[0, 1, 0]}>
            <boxGeometry args={[2, 2.5, 2]} />
            <meshPhysicalMaterial color="#000000" transparent opacity={0.1} metalness={0.9} roughness={0.1} envMapIntensity={1} />
          </mesh>
        </Float>
        {/* Microphone body */}
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
          <group position={[0, 1.5, 0]}>
            <mesh>
              <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
              <meshStandardMaterial color="#ff0033" emissive="#ff0033" emissiveIntensity={0.5} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.3, 0]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color="#ff0033" emissive="#ff0033" emissiveIntensity={0.5} metalness={0.8} />
            </mesh>
          </group>
        </Float>
        {/* Waveform rings */}
        {[...Array(3)].map((_, i) => (
          <Float key={i} speed={0.5 + i * 0.2} rotationIntensity={0} floatIntensity={0.1}>
            <mesh position={[0, 1.5 + i * 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.8 + i * 0.3, 0.02, 16, 32]} />
              <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5 - i * 0.1} transparent opacity={0.6 - i * 0.15} />
            </mesh>
          </Float>
        ))}
        {/* Floating data particles */}
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const r = 3 + Math.sin(i) * 0.5;
          return (
            <Float key={`p${i}`} speed={0.4 + i * 0.05} floatIntensity={0.4}>
              <mesh position={[Math.cos(angle) * r, 1 + Math.sin(i * 0.7) * 0.8, Math.sin(angle) * r]}>
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.9} />
              </mesh>
            </Float>
          );
        })}
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#050505" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Grid lines on floor */}
        {[...Array(10)].map((_, i) => (
          <mesh key={`g${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[(i - 5) * 2, -0.49, 0]}>
            <planeGeometry args={[0.02, 20]} />
            <meshStandardMaterial color="#ff0033" emissive="#ff0033" emissiveIntensity={0.3} transparent opacity={0.3} />
          </mesh>
        ))}
      </group>
    </>
  );
}
