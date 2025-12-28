import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Box, Torus, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function FloatingDevice() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef}>
        {/* Main device body */}
        <Box args={[2, 3, 0.15]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
        </Box>
        
        {/* Screen */}
        <Box args={[1.8, 2.6, 0.02]} position={[0, 0.1, 0.09]}>
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.3} />
        </Box>

        {/* Home button */}
        <Sphere args={[0.08, 32, 32]} position={[0, -1.3, 0.1]}>
          <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
        </Sphere>

        {/* Camera */}
        <Sphere args={[0.05, 32, 32]} position={[0, 1.35, 0.1]}>
          <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
        </Sphere>
      </group>
    </Float>
  );
}

function GlowingOrb({ position, color, size = 0.3 }: { position: [number, number, number]; color: string; size?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.3;
    }
  });

  return (
    <Sphere ref={meshRef} args={[size, 32, 32]} position={position}>
      <MeshDistortMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        distort={0.3}
        speed={2}
        transparent
        opacity={0.8}
      />
    </Sphere>
  );
}

function CircuitRings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.2;
      groupRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Torus args={[3, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.5} transparent opacity={0.6} />
      </Torus>
      <Torus args={[3.5, 0.015, 16, 100]} rotation={[Math.PI / 2, 0, Math.PI / 4]}>
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.5} transparent opacity={0.4} />
      </Torus>
      <Torus args={[4, 0.01, 16, 100]} rotation={[Math.PI / 2, 0, -Math.PI / 6]}>
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.3} transparent opacity={0.3} />
      </Torus>
    </group>
  );
}

export const Scene3D = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00d4ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
        <spotLight position={[0, 10, 0]} intensity={0.5} color="#ffffff" angle={0.3} />
        
        <FloatingDevice />
        <CircuitRings />
        
        <GlowingOrb position={[-4, 2, -2]} color="#00d4ff" size={0.2} />
        <GlowingOrb position={[4, -1, -3]} color="#8b5cf6" size={0.25} />
        <GlowingOrb position={[-3, -2, -1]} color="#00d4ff" size={0.15} />
        <GlowingOrb position={[3, 2, -2]} color="#8b5cf6" size={0.18} />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
};
