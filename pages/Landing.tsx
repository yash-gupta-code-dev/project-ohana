
import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls, Float, Points, PointMaterial, MeshDistortMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import StitchMascot from '../components/StitchMascot';
import * as THREE from 'three';

interface LandingProps {
  config: {
    heroText: string;
    subHeroText: string;
    ctaText: string;
  };
  onStart: () => void;
}

const ShootingStars = () => {
  const ref = useRef<THREE.Group>(null);
  const count = 15;
  const stars = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10 - 10
      ),
      speed: 0.2 + Math.random() * 0.5,
      scale: 0.1 + Math.random() * 0.4
    }));
  }, []);

  useFrame(() => {
    if (ref.current) {
      ref.current.children.forEach((child, i) => {
        child.position.x += stars[i].speed;
        child.position.y -= stars[i].speed * 0.5;
        if (child.position.x > 30) {
          child.position.x = -30;
          child.position.y = (Math.random() - 0.5) * 20;
        }
      });
    }
  });

  return (
    <group ref={ref}>
      {stars.map((s, i) => (
        <mesh key={i} position={s.pos} scale={[s.scale, 0.02, 0.02]}>
          <boxGeometry />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
};

const AdvancedNebula = () => {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      ref.current.rotation.z = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group ref={ref}>
      {/* Deep Blue Layer */}
      <mesh position={[5, -2, -10]} scale={8}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color="#1e3a8a"
          speed={2}
          distort={0.4}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Pink Glow Layer */}
      <mesh position={[-6, 4, -12]} scale={10}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color="#db2777"
          speed={1.5}
          distort={0.5}
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Cyan Ethereal Layer */}
      <mesh position={[0, -5, -8]} scale={6}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color="#06b6d4"
          speed={3}
          distort={0.6}
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

const TwinklingStars = () => {
  const count = 4000;
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 80;
      p[i * 3 + 1] = (Math.random() - 0.5) * 80;
      p[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    return p;
  }, []);

  const starRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (starRef.current) {
      starRef.current.rotation.y = state.clock.getElapsedTime() * 0.01;
      // Procedural twinkling
      const time = state.clock.getElapsedTime();
      // Fix: Cast material to PointsMaterial to access opacity safely after ensuring it is not an array.
      const material = starRef.current.material;
      if (material && !Array.isArray(material)) {
        (material as THREE.PointsMaterial).opacity = 0.6 + Math.sin(time * 2) * 0.4;
      }
    }
  });

  return (
    <Points ref={starRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.07}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const Landing: React.FC<LandingProps> = ({ config, onStart }) => {
  return (
    <div className="relative h-screen w-full flex flex-col md:flex-row items-center justify-center overflow-hidden bg-[#020412]">
      {/* Deep Space Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }} shadows>
          <color attach="background" args={['#020412']} />
          <fog attach="fog" args={['#020412', 8, 25]} />
          
          <Suspense fallback={null}>
            <TwinklingStars />
            <AdvancedNebula />
            <ShootingStars />
            
            <Float speed={2} rotationIntensity={0.8} floatIntensity={1}>
              <StitchMascot scale={1.8} />
            </Float>
          </Suspense>

          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={0.3}
            maxPolarAngle={Math.PI / 1.7}
            minPolarAngle={Math.PI / 2.3}
          />
          
          <ambientLight intensity={0.5} />
          <pointLight position={[15, 10, 15]} intensity={2} color="#4ade80" />
          <pointLight position={[-15, -10, -5]} intensity={1.5} color="#ec4899" />
        </Canvas>
      </div>

      {/* UI Overlay - Dashboard Style */}
      <div className="relative z-10 w-full max-w-7xl px-8 md:px-16 flex flex-col items-center md:items-start">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="max-w-4xl"
        >
          {/* Status Header */}
          <div className="flex items-center gap-6 mb-10">
            <div className="px-5 py-2 rounded-full glass border-cyan-500/30 flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
              <span className="text-cyan-400 text-[11px] font-black tracking-[0.5em] uppercase">
                Satellite Linked: OHANA-626
              </span>
            </div>
            <div className="hidden lg:block h-[1px] w-24 bg-gradient-to-r from-cyan-500/40 to-transparent" />
          </div>
          
          <h1 className="text-8xl md:text-[12rem] font-black mb-6 leading-[0.85] tracking-tighter text-white select-none">
            {config.heroText.split(' ').map((word, i) => (
              <span key={i} className={`block ${word === 'Family' ? 'text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 via-blue-500 to-indigo-600' : ''}`}>
                {word}
              </span>
            ))}
          </h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-2xl md:text-4xl text-white/30 mb-14 max-w-2xl font-handwritten italic leading-relaxed"
          >
            {config.subHeroText}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-10 items-center"
          >
            <button
              onClick={onStart}
              className="group relative px-16 py-8 bg-transparent border border-white/20 text-white font-black rounded-full text-2xl transition-all hover:border-cyan-400 hover:text-cyan-400 overflow-hidden active:scale-95"
            >
              <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 uppercase tracking-[0.2em]">{config.ctaText}</span>
            </button>
            
            
          </motion.div>
        </motion.div>
      </div>

      {/* Side Decorative HUD */}
      <div className="absolute left-10 bottom-10 hidden xl:block border-l border-white/10 pl-6 py-2">
        <div className="text-[10px] text-white/40 font-mono space-y-1">
          <div>// SCAN_STATUS: COMPLETE</div>
          <div>// EMOTION_INDEX: 1.00</div>
          <div>// DESTINATION: HOME</div>
        </div>
      </div>

      {/* Background scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
};

export default Landing;
