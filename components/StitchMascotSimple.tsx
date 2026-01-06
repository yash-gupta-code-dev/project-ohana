import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface StitchMascotSimpleProps {
  mood?: 'idle' | 'happy' | 'wave' | 'eat' | 'sneeze';
  scale?: number;
}

const StitchMascotSimple: React.FC<StitchMascotSimpleProps> = ({ mood = 'idle', scale = 1 }) => {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.position.y = Math.sin(t * 1.5) * 0.1;
      if (mood === 'happy') group.current.rotation.y = Math.sin(t * 4) * 0.2;
    }
  });

  return (
    <group ref={group} scale={[scale, scale, scale]}>
      {/* Simple blue sphere for Stitch's body */}
      <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#3a86ff" />
      </Sphere>
      
      {/* Simple head */}
      <Sphere args={[0.8, 32, 32]} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#3a86ff" />
      </Sphere>
      
      {/* Simple ears */}
      <Sphere args={[0.3, 16, 16]} position={[-0.6, 2.2, 0]}>
        <meshStandardMaterial color="#3a86ff" />
      </Sphere>
      <Sphere args={[0.3, 16, 16]} position={[0.6, 2.2, 0]}>
        <meshStandardMaterial color="#3a86ff" />
      </Sphere>
      
      {/* Simple eyes */}
      <Sphere args={[0.1, 16, 16]} position={[-0.3, 1.6, 0.6]}>
        <meshStandardMaterial color="black" />
      </Sphere>
      <Sphere args={[0.1, 16, 16]} position={[0.3, 1.6, 0.6]}>
        <meshStandardMaterial color="black" />
      </Sphere>
    </group>
  );
};

export default StitchMascotSimple;