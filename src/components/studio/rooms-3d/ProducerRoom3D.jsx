import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Environment, PerspectiveCamera } from '@react-three/drei';

export function ProducerRoom3D() {
  const meshRef = useRef(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.08) * 0.03;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 3, 10]} />
      <Environment preset="studio" />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 4, 0]} intensity={0.6} color="#00ffff" />
      <pointLight position={[3, 2, -2]} intensity={0.4} color="#ffff00" />
      <group ref={meshRef}>
        {/* Drum pad grid 4x3 */}
        {[...Array(4)].map((_, row) =>
          [...Array(3)].map((_, col) => {
            const x = (col - 1) * 1.2;
            const z = (row - 1.5) * 1.2;
            const hue = (row * 3 + col) * 30;
            return (
              <Float key={`${row}-${col}`} speed={0.5 + (row * 3 + col) * 0.05} floatIntensity={0.15}>
                <mesh position={[x, 0.5, z]}>
                  <boxGeometry args={[0.9, 0.15, 0.9]} />
                  <meshStandardMaterial color={`hsl(${hue}, 80%, 50%)`} emissive={`hsl(${hue}, 80%, 30%)`} emissiveIntensity={0.3} metalness={0.7} roughness={0.3} />
                </mesh>
              </Float>
            );
          })
        )}
        {/* Sample pack boxes orbiting */}
        {[...Array(5)].map((_, i) => {
          const angle = (i / 5) * Math.PI * 2;
          const radius = 4;
          return (
            <Float key={`s${i}`} speed={0.3 + i * 0.1} rotationIntensity={0.1} floatIntensity={0.3}>
              <mesh position={[Math.cos(angle) * radius, 2 + Math.sin(i) * 0.5, Math.sin(angle) * radius]}>
                <boxGeometry args={[0.6, 0.6, 0.6]} />
                <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.3} metalness={0.8} />
              </mesh>
            </Float>
          );
        })}
        {/* Mixing console surface */}
        <mesh position={[0, 0.1, -2]}>
          <boxGeometry args={[5, 0.1, 2]} />
          <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Fader knobs on console */}
        {[...Array(8)].map((_, i) => (
          <mesh key={`f${i}`} position={[-3.5 + i * 1, 0.22, -2]}>
            <cylinderGeometry args={[0.08, 0.08, 0.25, 12]} />
            <meshStandardMaterial color="#ff0033" emissive="#ff0033" emissiveIntensity={0.4} metalness={0.8} />
          </mesh>
        ))}
        {/* Speakers */}
        {[-3, 3].map((x, i) => (
          <group key={`sp${i}`} position={[x, 2, -4]}>
            <mesh>
              <boxGeometry args={[0.8, 1.2, 0.6]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0, 0.31]}>
              <circleGeometry args={[0.3, 32]} />
              <meshStandardMaterial color="#333" metalness={0.5} />
            </mesh>
          </group>
        ))}
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[25, 25]} />
          <meshStandardMaterial color="#080808" metalness={0.9} roughness={0.3} />
        </mesh>
      </group>
    </>
  );
}
