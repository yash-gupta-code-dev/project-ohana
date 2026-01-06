
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import StitchMascot from '../components/StitchMascot';
import { Calendar, Heart, Camera, Star, Sparkles as SparklesIcon } from 'lucide-react';
import { Photo, HiddenItem } from '../types';

interface GalleryProps {
  config: {
    description: string;
    photos: Photo[];
    hiddenItems: HiddenItem[];
  };
}

const Gallery: React.FC<GalleryProps> = ({ config }) => {
  const [foundItems, setFoundItems] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [hoveredPhoto, setHoveredPhoto] = useState<string | null>(null);
  const [sparkles, setSparkles] = useState<Array<{id: number, x: number, y: number}>>([]);

  const toggleItem = (id: string) => {
    if (!foundItems.includes(id)) {
      setFoundItems([...foundItems, id]);
      // Create sparkles effect when finding an item
      const newSparkles = Array.from({length: 8}, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100
      }));
      setSparkles(newSparkles);
      setTimeout(() => setSparkles([]), 1000);
    }
  };

  const isGameComplete = foundItems.length === config.hiddenItems.length;

  return (
    <div className="relative min-h-screen pt-32 pb-40 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-20 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex justify-center items-center gap-4 mb-4">
            <Camera className="text-cyan-400" size={32} />
            <h2 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Memory Vault
            </h2>
            <Camera className="text-pink-400" size={32} />
          </div>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed"
        >
          {config.description}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex justify-center gap-6 mt-12"
        >
          {config.hiddenItems.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: foundItems.includes(item.id) ? 1.2 : 1, rotate: 0 }}
              transition={{ delay: 0.7 + index * 0.1, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`p-4 rounded-2xl glass transition-all duration-300 ${
                foundItems.includes(item.id) 
                  ? 'bg-gradient-to-br from-cyan-500/30 to-pink-500/30 border-2 border-cyan-400 shadow-lg shadow-cyan-500/25' 
                  : 'opacity-40 hover:opacity-70 border border-white/10'
              }`}
            >
              <motion.span 
                className="text-3xl block"
                animate={{ 
                  rotate: foundItems.includes(item.id) ? [0, 360, 0] : 0,
                  scale: foundItems.includes(item.id) ? [1, 1.5, 1] : 1
                }}
                transition={{ duration: 0.6 }}
              >
                {item.icon}
              </motion.span>
            </motion.div>
          ))}
        </motion.div>

        {/* Sparkles effect */}
        <AnimatePresence>
          {sparkles.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1, opacity: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 1 }}
              style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
              className="absolute pointer-events-none"
            >
              <SparklesIcon className="text-yellow-400" size={20} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {config.photos.map((photo, idx) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              delay: idx * 0.1, 
              duration: 0.6,
              type: "spring",
              stiffness: 100
            }}
            onClick={() => setSelectedPhoto(photo)}
            onMouseEnter={() => setHoveredPhoto(photo.id)}
            onMouseLeave={() => setHoveredPhoto(null)}
            className="group relative rounded-3xl overflow-hidden cursor-pointer glass border border-white/10 hover:border-white/20 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20"
          >
            <div className="relative overflow-hidden">
              <motion.img 
                src={photo.url} 
                alt={photo.caption}
                className="w-full h-auto object-cover transition-transform duration-700"
                animate={{ 
                  scale: hoveredPhoto === photo.id ? 1.15 : 1,
                  rotate: hoveredPhoto === photo.id ? 2 : 0
                }}
              />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{ opacity: hoveredPhoto === photo.id ? 1 : 0 }}
              >
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <motion.h3 
                    className="text-2xl font-bold mb-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: hoveredPhoto === photo.id ? 0 : 20, opacity: hoveredPhoto === photo.id ? 1 : 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {photo.caption}
                  </motion.h3>
                  <motion.p 
                    className="text-white/70 text-base flex items-center gap-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: hoveredPhoto === photo.id ? 0 : 20, opacity: hoveredPhoto === photo.id ? 1 : 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Calendar size={16} /> {photo.date}
                  </motion.p>
                </div>
              </motion.div>

              {/* Floating particles effect */}
              <AnimatePresence>
                {hoveredPhoto === photo.id && (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                        initial={{ 
                          x: Math.random() * 100 + '%',
                          y: Math.random() * 100 + '%',
                          opacity: 0,
                          scale: 0
                        }}
                        animate={{ 
                          y: [null, '-100%'],
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0]
                        }}
                        transition={{ 
                          duration: 2 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 0.5
                        }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Enhanced hidden items with better animations */}
            {idx === 0 && !foundItems.includes('item1') && (
              <motion.button 
                onClick={(e) => { e.stopPropagation(); toggleItem('item1'); }} 
                className="absolute top-4 left-4 text-2xl z-10"
                whileHover={{ scale: 1.3, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                animate={{ 
                  y: [0, -5, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-full shadow-lg"
                  whileHover={{ boxShadow: "0 0 20px rgba(251, 191, 36, 0.5)" }}
                >
                  {config.hiddenItems[0].icon}
                </motion.div>
              </motion.button>
            )}
            {idx === Math.floor(config.photos.length / 2) && !foundItems.includes('item2') && (
              <motion.button 
                onClick={(e) => { e.stopPropagation(); toggleItem('item2'); }} 
                className="absolute bottom-1/2 right-4 text-2xl z-10"
                whileHover={{ scale: 1.3, rotate: -10 }}
                whileTap={{ scale: 0.9 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <motion.div
                  className="bg-gradient-to-br from-pink-400 to-purple-500 p-3 rounded-full shadow-lg"
                  whileHover={{ boxShadow: "0 0 20px rgba(236, 72, 153, 0.5)" }}
                >
                  {config.hiddenItems[1].icon}
                </motion.div>
              </motion.button>
            )}
            {idx === config.photos.length - 1 && !foundItems.includes('item3') && (
              <motion.button 
                onClick={(e) => { e.stopPropagation(); toggleItem('item3'); }} 
                className="absolute bottom-4 left-1/4 text-2xl z-10"
                whileHover={{ scale: 1.3, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                animate={{ 
                  opacity: [0.7, 1, 0.7],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <motion.div
                  className="bg-gradient-to-br from-cyan-400 to-blue-500 p-3 rounded-full shadow-lg"
                  whileHover={{ boxShadow: "0 0 20px rgba(34, 211, 238, 0.5)" }}
                >
                  {config.hiddenItems[2].icon}
                </motion.div>
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Completion Celebration */}
      <AnimatePresence>
        {isGameComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="glass rounded-3xl p-6 border-2 border-cyan-400 shadow-2xl shadow-cyan-500/30">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Star className="text-cyan-400 fill-cyan-400" size={32} />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold text-cyan-400">🎉 Memory Vault Complete!</h3>
                  <p className="text-white/70">You found all the hidden treasures! Stitch is so happy!</p>
                </div>
                <motion.div
                  animate={{ rotate: [0, -360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Star className="text-pink-400 fill-pink-400" size={32} />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Stitch with celebration effects */}
      <motion.div 
        className="fixed bottom-10 left-10 w-48 h-48 pointer-events-none z-20"
        animate={isGameComplete ? {
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Canvas>
          <Float speed={isGameComplete ? 4 : 2} rotationIntensity={0.5} floatIntensity={0.5}>
            <StitchMascot scale={0.8} mood={isGameComplete ? 'happy' : 'idle'} />
          </Float>
          {isGameComplete && (
            <>
              {[...Array(8)].map((_, i) => (
                <Float key={i} speed={3} rotationIntensity={1} floatIntensity={2}>
                  <mesh position={[Math.cos(i * Math.PI / 4) * 3, Math.sin(i * Math.PI / 4) * 3, 0]}>
                    <sphereGeometry args={[0.1, 8, 8]} />
                    <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
                  </mesh>
                </Float>
              ))}
            </>
          )}
        </Canvas>
      </motion.div>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div 
              layoutId={selectedPhoto.id}
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="max-w-4xl w-full glass rounded-[40px] overflow-hidden border border-white/20 shadow-2xl shadow-cyan-500/20"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative">
                <img src={selectedPhoto.url} className="w-full max-h-[70vh] object-contain bg-black/40" />
                <motion.div 
                  className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Heart className="text-pink-500 fill-pink-500" size={24} />
                </motion.div>
              </div>
              <motion.div 
                className="p-10 bg-gradient-to-br from-white/5 to-transparent"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <motion.h2 
                      className="text-4xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {selectedPhoto.caption}
                    </motion.h2>
                    <motion.p 
                      className="text-white/60 mt-2 text-lg flex items-center gap-3"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Calendar size={20} /> {selectedPhoto.date}
                    </motion.p>
                  </div>
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, type: "spring" }}
                  >
                    <Heart className="text-pink-500 fill-pink-500" size={40} />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;