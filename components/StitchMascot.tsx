
import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Capsule, Torus } from '@react-three/drei';
import * as THREE from 'three';

interface StitchMascotProps {
  mood?: 'idle' | 'happy' | 'wave' | 'eat' | 'sneeze';
  scale?: number;
}

const StitchMascot: React.FC<StitchMascotProps> = ({ mood = 'idle', scale = 1 }) => {
  const group = useRef<THREE.Group>(null);
  const leftEar = useRef<THREE.Group>(null);
  const rightEar = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const headGroup = useRef<THREE.Group>(null);
  const bodyGroup = useRef<THREE.Group>(null);
  const tailGroup = useRef<THREE.Group>(null);
  
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 120);
    }, 3000 + Math.random() * 5000);
    return () => clearInterval(blinkInterval);
  }, []);

  const colors = {
    main: "#3a86ff", // Stitch Blue
    darkSpot: "#1e3a8a", // Pattern Blue
    secondary: "#bde0fe", // Belly Blue
    innerEar: "#ffafcc", // Pinkish
    nose: "#023e8a", // Darker Blue
    eyes: "#0d1b2a", // Almost Black
    claws: "#f1f5f9" // Whiteish
  };

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (group.current) {
      group.current.position.y = Math.sin(t * 1.5) * 0.1;
      if (mood === 'happy') group.current.rotation.y = Math.sin(t * 4) * 0.2;
    }

    if (headGroup.current && bodyGroup.current) {
      const breathing = Math.sin(t * 2) * 0.025;
      headGroup.current.position.y = 0.6 + breathing;
      bodyGroup.current.scale.setScalar(1 + breathing * 0.4);
      
      headGroup.current.rotation.y = Math.sin(t * 0.5) * 0.12;
      headGroup.current.rotation.x = Math.cos(t * 0.7) * 0.04;
    }

    if (leftEar.current && rightEar.current) {
      const earWiggle = Math.sin(t * 2.5) * 0.05;
      const moodBonus = mood === 'sneeze' ? Math.sin(t * 50) * 0.4 : 0;
      leftEar.current.rotation.z = -0.5 + earWiggle + moodBonus;
      rightEar.current.rotation.z = 0.5 - earWiggle - moodBonus;
    }

    if (tailGroup.current) {
      const wag = mood === 'happy' ? Math.sin(t * 20) * 0.5 : Math.sin(t * 2) * 0.1;
      tailGroup.current.rotation.z = wag;
    }

    if (mood === 'wave' && rightArm.current) {
      rightArm.current.rotation.z = -Math.PI / 2 + Math.sin(t * 12) * 1.2;
    }
  });

  return (
    <group ref={group} scale={[scale, scale, scale]}>
      {/* --- BODY --- */}
      <group ref={bodyGroup} position={[0, -0.4, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.85, 40, 40]} />
          <meshStandardMaterial color={colors.main} roughness={0.65} metalness={0.1} />
        </mesh>
        
        {/* Back Spots (Iconic patterns) */}
        <mesh position={[0, 0.2, -0.75]} rotation={[-0.4, 0, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color={colors.darkSpot} />
        </mesh>
        <mesh position={[0.3, 0, -0.8]} rotation={[-0.2, 0.4, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color={colors.darkSpot} />
        </mesh>
        <mesh position={[-0.3, 0, -0.8]} rotation={[-0.2, -0.4, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color={colors.darkSpot} />
        </mesh>

        {/* Belly Patch */}
        <mesh position={[0, -0.05, 0.45]} rotation={[-0.2, 0, 0]}>
          <sphereGeometry args={[0.6, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <meshStandardMaterial color={colors.secondary} roughness={0.8} />
        </mesh>

        {/* Tail */}
        <group ref={tailGroup} position={[0, -0.5, -0.7]} rotation={[0.4, 0, 0]}>
          <Capsule args={[0.12, 0.25, 4, 8]}>
            <meshStandardMaterial color={colors.main} />
          </Capsule>
        </group>
      </group>

      {/* --- HEAD --- */}
      <group ref={headGroup} position={[0, 0.6, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[1.05, 40, 40]} />
          <meshStandardMaterial color={colors.main} roughness={0.5} />
        </mesh>

        {/* Eye Ridges / Brows */}
        <group position={[0, 0.4, 0.6]}>
          <mesh position={[-0.4, 0, 0.1]} rotation={[0, 0, 0.3]}>
            <torusGeometry args={[0.3, 0.05, 12, 24, Math.PI]} />
            <meshStandardMaterial color={colors.main} />
          </mesh>
          <mesh position={[0.4, 0, 0.1]} rotation={[0, 0, -0.3]}>
            <torusGeometry args={[0.3, 0.05, 12, 24, Math.PI]} />
            <meshStandardMaterial color={colors.main} />
          </mesh>
        </group>

        {/* Snout Area */}
        <group position={[0, -0.2, 0.65]}>
          <mesh scale={[1.3, 0.9, 0.85]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color={colors.secondary} roughness={0.7} />
          </mesh>
          {/* Mouth line */}
          <mesh position={[0, -0.2, 0.45]} rotation={[Math.PI/2, 0, 0]}>
            <torusGeometry args={[0.28, 0.008, 8, 32, Math.PI]} />
            <meshBasicMaterial color="#000" transparent opacity={0.2} />
          </mesh>
        </group>

        {/* Nose */}
        <mesh position={[0, -0.05, 1.0]} scale={[1.4, 1, 1.2]}>
          <sphereGeometry args={[0.17, 24, 24]} />
          <meshStandardMaterial color={colors.nose} roughness={0.1} metalness={0.4} />
        </mesh>

        {/* Eyes */}
        <group position={[-0.5, 0.3, 0.78]} rotation={[0, -0.4, 0]}>
          <mesh scale={[1, blink ? 0.05 : 1.5, 1]}>
            <sphereGeometry args={[0.35, 32, 32]} />
            <meshStandardMaterial color={colors.eyes} roughness={0.05} metalness={0.2} />
          </mesh>
          {!blink && (
            <mesh position={[0.15, 0.15, 0.3]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial color="white" />
            </mesh>
          )}
        </group>

        <group position={[0.5, 0.3, 0.78]} rotation={[0, 0.4, 0]}>
          <mesh scale={[1, blink ? 0.05 : 1.5, 1]}>
            <sphereGeometry args={[0.35, 32, 32]} />
            <meshStandardMaterial color={colors.eyes} roughness={0.05} metalness={0.2} />
          </mesh>
          {!blink && (
            <mesh position={[-0.15, 0.15, 0.3]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial color="white" />
            </mesh>
          )}
        </group>

        {/* Ears - Higher Detail notches */}
        <group ref={leftEar} position={[-0.8, 0.8, 0]} rotation={[0, 0.4, -0.6]}>
          <mesh position={[0, 0.9, 0]} scale={[0.9, 2.3, 0.25]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color={colors.main} />
          </mesh>
          <mesh position={[0.05, 0.8, 0.04]} scale={[0.7, 1.9, 0.18]}>
            <sphereGeometry args={[0.45, 32, 32]} />
            <meshStandardMaterial color={colors.innerEar} />
          </mesh>
          {/* Ear Cut-out 1 */}
          <mesh position={[-0.45, 1.3, 0]} rotation={[0, 0, 0.5]}>
            <boxGeometry args={[0.35, 0.25, 0.4]} />
            <meshStandardMaterial color={colors.main} />
          </mesh>
        </group>

        <group ref={rightEar} position={[0.8, 0.8, 0]} rotation={[0, -0.4, 0.6]}>
          <mesh position={[0, 0.9, 0]} scale={[0.9, 2.3, 0.25]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color={colors.main} />
          </mesh>
          <mesh position={[-0.05, 0.8, 0.04]} scale={[0.7, 1.9, 0.18]}>
            <sphereGeometry args={[0.45, 32, 32]} />
            <meshStandardMaterial color={colors.innerEar} />
          </mesh>
          {/* Ear Cut-out 1 */}
          <mesh position={[0.45, 1.6, 0]} rotation={[0, 0, -0.3]}>
            <boxGeometry args={[0.35, 0.2, 0.4]} />
            <meshStandardMaterial color={colors.main} />
          </mesh>
        </group>
      </group>

      {/* --- ARMS & HANDS --- */}
      <group position={[-0.9, -0.35, 0.25]} rotation={[0, 0, 0.4]}>
        <Capsule args={[0.2, 0.65, 8, 16]}>
          <meshStandardMaterial color={colors.main} />
        </Capsule>
        <group position={[0, -0.45, 0]}>
          <Sphere args={[0.2, 16, 16]}><meshStandardMaterial color={colors.main} /></Sphere>
          {[ -0.12, 0, 0.12 ].map((x, i) => (
            <mesh key={i} position={[x, -0.15, 0.15]}>
              <capsuleGeometry args={[0.045, 0.12, 4, 8]} />
              <meshStandardMaterial color={colors.claws} />
            </mesh>
          ))}
        </group>
      </group>

      <group ref={rightArm} position={[0.9, -0.35, 0.25]} rotation={[0, 0, -0.4]}>
        <Capsule args={[0.2, 0.65, 8, 16]}>
          <meshStandardMaterial color={colors.main} />
        </Capsule>
        <group position={[0, -0.45, 0]}>
          <Sphere args={[0.2, 16, 16]}><meshStandardMaterial color={colors.main} /></Sphere>
          {[ -0.12, 0, 0.12 ].map((x, i) => (
            <mesh key={i} position={[x, -0.15, 0.15]}>
              <capsuleGeometry args={[0.045, 0.12, 4, 8]} />
              <meshStandardMaterial color={colors.claws} />
            </mesh>
          ))}
        </group>
      </group>

      {/* --- LEGS --- */}
      <group position={[-0.6, -1.2, 0.4]}>
        <Sphere args={[0.36, 24, 24]}>
          <meshStandardMaterial color={colors.main} />
        </Sphere>
        {[ -0.2, 0, 0.2 ].map((x, i) => (
          <mesh key={i} position={[x, -0.15, 0.28]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshStandardMaterial color={colors.claws} />
          </mesh>
        ))}
      </group>

      <group position={[0.6, -1.2, 0.4]}>
        <Sphere args={[0.36, 24, 24]}>
          <meshStandardMaterial color={colors.main} />
        </Sphere>
        {[ -0.2, 0, 0.2 ].map((x, i) => (
          <mesh key={i} position={[x, -0.15, 0.28]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshStandardMaterial color={colors.claws} />
          </mesh>
        ))}
      </group>

      <ambientLight intensity={1.5} />
      <pointLight position={[10, 10, 10]} intensity={3} color="#fff" />
      <spotLight position={[-10, 20, 10]} angle={0.25} penumbra={1} intensity={4} castShadow />
      <directionalLight position={[0, -5, 5]} intensity={0.6} color={colors.main} />
    </group>
  );
};

export default StitchMascot;