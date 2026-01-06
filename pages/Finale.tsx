
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateLoveLetter } from '../services/gemini';
import { Gift, Heart, Sparkles, MapPin, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FinaleProps {
  config: {
    letterContext: string;
    surpriseTitle: string;
    surpriseDescription: string;
    surpriseLocation: string;
  };
}

const Finale: React.FC<FinaleProps> = ({ config }) => {
  const [letter, setLetter] = useState('');
  const [dugguLetter, setDugguLetter] = useState('');
  const [showGift, setShowGift] = useState(false);
  const [showDugguLetter, setShowDugguLetter] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<number>(0);

  // Pre-generated Duggu letters for fallback
  const DUGGU_FALLBACKS = [
    "Dear Duggu, you are the light that brightens every room you enter. Your presence brings warmth and joy to all who know you. Like a gentle breeze on a tropical island, you make everything feel more alive and beautiful. You are truly special, Duggu - a gift to this world.",
    "To my dearest Duggu, your kindness radiates like sunshine through crystal waters. You have this magical way of making people feel seen, heard, and loved. The world is brighter because you're in it, and your laughter is the sweetest melody.",
    "Duggu, you are a rare gem in this vast universe. Your spirit shines so bright that even the stars would be jealous. You bring comfort like a warm hug and joy like a child's laughter. Being around you feels like coming home.",
    "My beloved Duggu, you are the missing piece that makes everything complete. Your smile could light up the darkest night, and your heart is as vast as the ocean. You are loved beyond measure, cherished beyond words.",
    "Sweet Duggu, you are a blessing wrapped in human form. Your gentle soul touches hearts wherever you go. Like a beautiful flower in full bloom, you make the world more colorful, more vibrant, more alive."
  ];

  useEffect(() => {
    const fetchLetter = async () => {
      const msg = await generateLoveLetter(config.letterContext);
      setLetter(msg);
    };
    fetchLetter();
  }, [config.letterContext]);

  useEffect(() => {
    const fetchDugguLetter = async () => {
      setIsGenerating(true);
      try {
        // Check if we have a recent cached letter (within 5 minutes)
        const cachedLetter = localStorage.getItem('dugguLetter');
        const cachedTime = localStorage.getItem('dugguLetterTime');
        const now = Date.now();
        
        if (cachedLetter && cachedTime && (now - parseInt(cachedTime)) < 300000) {
          // Use cached letter if less than 5 minutes old
          setDugguLetter(cachedLetter);
          setIsGenerating(false);
          return;
        }
        
        // Rate limiting: wait at least 10 seconds between API calls
        if (now - lastGenerated < 10000) {
          // Use fallback instead of waiting
          const randomFallback = DUGGU_FALLBACKS[Math.floor(Math.random() * DUGGU_FALLBACKS.length)];
          setDugguLetter(randomFallback);
          setIsGenerating(false);
          return;
        }
        
        const letter = await generateLoveLetter("Duggu - a beloved person who brings joy and light to everyone's life");
        setDugguLetter(letter);
        setLastGenerated(now);
        
        // Cache the successful result
        localStorage.setItem('dugguLetter', letter);
        localStorage.setItem('dugguLetterTime', now.toString());
        
      } catch (error) {
        console.error('Error generating Duggu letter:', error);
        // Use a random fallback letter
        const randomFallback = DUGGU_FALLBACKS[Math.floor(Math.random() * DUGGU_FALLBACKS.length)];
        setDugguLetter(randomFallback);
      } finally {
        setIsGenerating(false);
      }
    };
    fetchDugguLetter();
  }, []);

  const openGift = () => {
    setShowGift(true);
    confetti({
      particleCount: 180,
      spread: 90,
      origin: { y: 0.7 },
      colors: ['#00f3ff', '#ff7eb6', '#ffffff', '#fbbf24']
    });
  };

  const refreshDugguLetter = async () => {
    setIsGenerating(true);
    try {
      const now = Date.now();
      
      // Rate limiting: wait at least 10 seconds between API calls
      if (now - lastGenerated < 10000) {
        // Use fallback instead of waiting
        const randomFallback = DUGGU_FALLBACKS[Math.floor(Math.random() * DUGGU_FALLBACKS.length)];
        setDugguLetter(randomFallback);
        setIsGenerating(false);
        return;
      }
      
      const letter = await generateLoveLetter("Duggu - a beloved person who brings joy and light to everyone's life");
      setDugguLetter(letter);
      setLastGenerated(now);
      
      // Cache the successful result
      localStorage.setItem('dugguLetter', letter);
      localStorage.setItem('dugguLetterTime', now.toString());
      
    } catch (error) {
      console.error('Error refreshing Duggu letter:', error);
      // Use a random fallback letter
      const randomFallback = DUGGU_FALLBACKS[Math.floor(Math.random() * DUGGU_FALLBACKS.length)];
      setDugguLetter(randomFallback);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleDugguLetter = () => {
    setShowDugguLetter(!showDugguLetter);
  };

  return (
    <div className="relative min-h-screen pt-32 pb-40 px-6 flex flex-col items-center justify-center">
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0b1e] via-[#1a237e] to-[#ff7eb6]/20" />
      </div>

      <div className="max-w-3xl w-full relative z-10">
        <AnimatePresence mode="wait">
          {!showDugguLetter ? (
            <motion.div 
              key="main-letter"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="glass p-12 md:p-20 rounded-[50px] shadow-3xl relative overflow-hidden border-white/10"
            >
              <div className="absolute top-8 right-8 text-pink-500 opacity-10">
                <Heart size={160} />
              </div>

              <div className="flex justify-between items-start mb-16">
                <h2 className="text-5xl font-bold flex items-center gap-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                  Infinite Love <Sparkles className="text-yellow-400" />
                </h2>
                <button
                  onClick={toggleDugguLetter}
                  className="p-3 rounded-full glass hover:bg-white/10 transition-all group"
                  title="Read letter for Duggu"
                >
                  <Heart className="group-hover:scale-110 transition-transform" size={20} />
                </button>
              </div>

              <div className="space-y-8 text-2xl leading-relaxed text-white/90 font-handwritten tracking-wide">
                {letter ? (
                  letter.split('\n').map((line, i) => line && (
                    <motion.p key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
                      {line}
                    </motion.p>
                  ))
                ) : (
                  <div className="space-y-6 animate-pulse">
                    <div className="h-4 bg-white/10 rounded-full w-full" />
                    <div className="h-4 bg-white/10 rounded-full w-[85%]" />
                    <div className="h-4 bg-white/10 rounded-full w-[90%]" />
                    <div className="h-4 bg-white/10 rounded-full w-[60%]" />
                  </div>
                )}
              </div>

              <div className="mt-20 pt-10 border-t border-white/10 flex justify-between items-end">
                <div>
                  <p className="text-white/40 text-sm uppercase tracking-[0.3em] font-bold mb-2">Signature</p>
                  <div className="font-handwritten text-4xl text-cyan-400">Forever Ohana</div>
                </div>
                <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="text-5xl drop-shadow-lg">
                  ✨
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="duggu-letter"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="glass p-12 md:p-20 rounded-[50px] shadow-3xl relative overflow-hidden border-white/10"
            >
              <div className="absolute top-8 right-8 text-cyan-500 opacity-10">
                <Heart size={160} />
              </div>

              <div className="flex justify-between items-start mb-16">
                <h2 className="text-5xl font-bold flex items-center gap-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                  For Duggu <Sparkles className="text-cyan-400" />
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={refreshDugguLetter}
                    disabled={isGenerating}
                    className="bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                    title="Generate new letter"
                  >
                    <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    {isGenerating ? 'Generating...' : 'Refresh Letter'}
                  </button>
                  <button
                    onClick={toggleDugguLetter}
                    className="p-3 rounded-full glass hover:bg-white/10 transition-all group"
                    title="Back to main letter"
                  >
                    <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-8 text-2xl leading-relaxed text-white/90 font-handwritten tracking-wide">
                {dugguLetter ? (
                  dugguLetter.split('\n').map((line, i) => line && (
                    <motion.p key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
                      {line}
                    </motion.p>
                  ))
                ) : (
                  <div className="space-y-6 animate-pulse">
                    <div className="h-4 bg-white/10 rounded-full w-full" />
                    <div className="h-4 bg-white/10 rounded-full w-[85%]" />
                    <div className="h-4 bg-white/10 rounded-full w-[90%]" />
                    <div className="h-4 bg-white/10 rounded-full w-[60%]" />
                  </div>
                )}
              </div>

              <div className="mt-20 pt-10 border-t border-white/10 flex justify-between items-end">
                <div>
                  <p className="text-white/40 text-sm uppercase tracking-[0.3em] font-bold mb-2">With Love</p>
                  <div className="font-handwritten text-4xl text-pink-400">Always Yours</div>
                </div>
                <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="text-5xl drop-shadow-lg">
                  💙
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-20 flex flex-col items-center">
          <AnimatePresence>
            {!showGift ? (
              <motion.button
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                whileHover={{ scale: 1.1 }} onClick={openGift} className="relative group"
              >
                <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20 group-hover:opacity-60 transition-opacity" />
                <div className="relative p-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[35px] text-black shadow-2xl flex items-center justify-center">
                  <Gift size={80} />
                </div>
                <p className="mt-6 text-cyan-400 font-bold tracking-[0.4em] uppercase text-xs animate-pulse text-center">Open Your Heart</p>
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                className="glass p-12 rounded-[50px] border-pink-400/30 text-center max-w-lg shadow-4xl backdrop-blur-3xl"
              >
                <div className="w-24 h-24 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <Heart className="text-pink-400 fill-pink-400" size={48} />
                </div>
                <h3 className="text-4xl font-bold mb-6 text-white">{config.surpriseTitle}</h3>
                <p className="text-white/60 text-xl leading-relaxed mb-10">{config.surpriseDescription}</p>
                <div className="flex items-center justify-center gap-3 bg-white/5 py-4 px-8 rounded-full text-pink-300 font-bold border border-white/5 shadow-xl">
                  <MapPin size={22} /> {config.surpriseLocation}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Finale;