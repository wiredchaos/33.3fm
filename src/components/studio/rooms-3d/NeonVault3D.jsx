import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Environment, PerspectiveCamera } from '@react-three/drei';

export function NeonVault3D() {
  const vaultRef = useRef(null);
  const nftRefs = useRef([]);

  useFrame((state) => {
    if (vaultRef.current) {
      vaultRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
    nftRefs.current.forEach((ref, i) => {
      if (ref) {
        ref.rotation.y = state.clock.elapsedTime * (0.3 + i * 0.1);
        ref.rotation.x = Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.1;
      }
    });
  });

  const nftColors = ['#ff0033', '#00ffff', '#ffff00', '#ff00ff', '#00ff88', '#ff8800'];

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 15]} />
      <Environment preset="night" />
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 8, 0]} intensity={1} color="#ff0033" />
      <pointLight position={[-6, 4, 0]} intensity={0.5} color="#00ffff" />
      <pointLight position={[6, 4, 0]} intensity={0.5} color="#ff00ff" />

      <group ref={vaultRef}>
        {/* Central vault structure */}
        <mesh position={[0, 2, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 4, 8]} />
          <meshStandardMaterial color="#ff0033" emissive="#ff0033" emissiveIntensity={0.4} metalness={0.9} />
        </mesh>

        {/* Vault ring */}
        <Float speed={0.3} floatIntensity={0.2}>
          <mesh position={[0, 3, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2, 0.05, 16, 64]} />
            <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.7} transparent opacity={0.8} />
          </mesh>
        </Float>

        {/* NFT frames orbiting */}
        {nftColors.map((color, i) => {
          const angle = (i / nftColors.length) * Math.PI * 2;
          const radius = 4;
          return (
            <group
              key={`nft${i}`}
              ref={el => nftRefs.current[i] = el}
              position={[Math.cos(angle) * radius, 2 + Math.sin(i * 0.8) * 0.5, Math.sin(angle) * radius]}
            >
              {/* Frame */}
              <mesh>
                <boxGeometry args={[1.2, 1.5, 0.05]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} metalness={0.8} roughness={0.2} />
              </mesh>
              {/* Canvas */}
              <mesh position={[0, 0, 0.03]}>
                <planeGeometry args={[1.0, 1.3]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} transparent opacity={0.6} />
              </mesh>
              {/* Glow halo */}
              <mesh position={[0, 0, -0.05]}>
                <planeGeometry args={[1.6, 2.0]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.1} transparent opacity={0.15} />
              </mesh>
            </group>
          );
        })}

        {/* Floating blockchain nodes */}
        {[...Array(30)].map((_, i) => {
          const x = (Math.random() - 0.5) * 14;
          const y = Math.random() * 6;
          const z = (Math.random() - 0.5) * 14;
          return (
            <Float key={`bc${i}`} speed={0.2 + Math.random() * 0.4} floatIntensity={0.6}>
              <mesh position={[x, y, z]}>
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshStandardMaterial
                  color={nftColors[i % nftColors.length]}
                  emissive={nftColors[i % nftColors.length]}
                  emissiveIntensity={0.9}
                />
              </mesh>
            </Float>
          );
        })}

        {/* Pedestal columns */}
        {[...Array(4)].map((_, i) => {
          const angle = (i / 4) * Math.PI * 2;
          const r = 6;
          return (
            <group key={`ped${i}`} position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}>
              <mesh>
                <cylinderGeometry args={[0.2, 0.3, 3, 8]} />
                <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh position={[0, 1.6, 0]}>
                <boxGeometry args={[0.6, 0.1, 0.6]} />
                <meshStandardMaterial color="#ff0033" emissive="#ff0033" emissiveIntensity={0.3} metalness={0.9} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Floor - reflective */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#030303" metalness={1} roughness={0.05} />
      </mesh>
    </>
  );
}
