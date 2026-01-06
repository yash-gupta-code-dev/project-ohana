
import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppState, SiteConfig } from './types';
import Landing from './pages/Landing';
import Gallery from './pages/Gallery';
import Lab from './pages/Lab';
import Finale from './pages/Finale';
import CursorFollower from './components/CursorFollower';
import { Volume2, VolumeX, Menu, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { siteConfig as initialConfig } from './data/config';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AppState>('landing');
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [config, setConfig] = useState<SiteConfig>(initialConfig);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data from an Admin API
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      setConfig(initialConfig);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const pages: AppState[] = ['landing', 'gallery', 'lab', 'finale'];
  const currentIndex = pages.indexOf(currentPage);

  const nextPage = () => currentIndex < pages.length - 1 && setCurrentPage(pages[currentIndex + 1]);
  const prevPage = () => currentIndex > 0 && setCurrentPage(pages[currentIndex - 1]);

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-[#0a0b1e] flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-cyan-400 font-bold tracking-widest text-xl"
        >
          LOADING OHANA...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0b1e]">
      <CursorFollower />
      
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-900/10 blur-[120px] rounded-full" />
      </div>

      <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-400 uppercase tracking-tighter"
        >
          {config.title}
        </motion.div>

        <div className="flex gap-4 items-center">
          <button onClick={() => setIsAudioOn(!isAudioOn)} className="p-3 rounded-full glass hover:bg-white/10 transition-colors">
            {isAudioOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-3 rounded-full glass hover:bg-white/10 transition-colors">
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-40 flex items-center justify-end"
          >
            <div className="w-full md:w-96 h-full glass p-12 flex flex-col justify-center gap-8 shadow-2xl">
              <h2 className="text-4xl font-bold mb-4">Journey Map</h2>
              {pages.map((p, idx) => (
                <button
                  key={p}
                  onClick={() => { setCurrentPage(p); setIsMenuOpen(false); }}
                  className={`text-2xl text-left transition-all ${currentPage === p ? 'text-cyan-400 scale-110 pl-4' : 'text-white/60 hover:text-white'}`}
                >
                  0{idx + 1}. {p.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="hidden md:block absolute inset-0 -z-10 bg-black/40" onClick={() => setIsMenuOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen"
          >
            <Suspense fallback={<div className="h-screen flex items-center justify-center">Syncing...</div>}>
              {currentPage === 'landing' && <Landing config={config.landing} onStart={nextPage} />}
              {currentPage === 'gallery' && <Gallery config={config.gallery} />}
              {currentPage === 'lab' && <Lab config={config.lab} />}
              {currentPage === 'finale' && <Finale config={config.finale} />}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="fixed bottom-8 right-8 flex gap-4 z-50">
        {currentIndex > 0 && (
          <button onClick={prevPage} className="p-4 rounded-full glass hover:bg-white/10 transition-all flex items-center gap-2 group">
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          </button>
        )}
        {currentIndex < pages.length - 1 && (
          <button onClick={nextPage} className="p-4 px-6 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-all flex items-center gap-2 group shadow-[0_0_20px_rgba(0,243,255,0.4)]">
            <span>Next</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
