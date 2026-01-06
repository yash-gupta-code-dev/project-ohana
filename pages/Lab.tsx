
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import StitchMascot from '../components/StitchMascot';
import { generateStitchResponse } from '../services/gemini';
import { Send, Music, Cookie, Ghost, Sparkles, Wifi, WifiOff, Cpu } from 'lucide-react';
import { Suspense } from 'react';

interface LabProps {
  config: {
    title: string;
    subtitle: string;
  };
}

const Lab: React.FC<LabProps> = ({ config }) => {
  const [chatInput, setChatInput] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [messages, setMessages] = useState<{role: 'user' | 'stitch', text: string, source?: 'cloud' | 'local'}[]>([
    { role: 'stitch', text: "Meega nala kweesta! Talk to Stitch!", source: 'local' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [mood, setMood] = useState<'idle' | 'happy' | 'wave' | 'eat' | 'sneeze'>('idle');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);
    setMood('wave');
    
    const response = await generateStitchResponse(userMsg);
    
    setMessages(prev => [...prev, { 
      role: 'stitch', 
      text: response.text, 
      source: response.source 
    }]);
    
    setIsTyping(false);
    setMood(response.source === 'cloud' ? 'happy' : 'idle');
    setTimeout(() => setMood('idle'), 2000);
  };

  const performAction = (action: typeof mood, text: string) => {
    setMood(action);
    setMessages(prev => [...prev, { role: 'stitch', text, source: 'local' }]);
    setTimeout(() => setMood('idle'), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col pt-20 pb-4 px-4 gap-4">
      {/* Header */}
      <div className="glass rounded-2xl p-4 border-white/5 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              {config.title} <Sparkles className="text-cyan-400" />
            </h1>
            <p className="text-sm text-white/60 mt-1">{config.subtitle}</p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${isOnline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
            {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
            {isOnline ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>

      {/* Main Content - Desktop: side by side, Mobile: stacked */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4">
        {/* Interaction Lab Section */}
        <div className="flex-1 glass rounded-2xl relative overflow-hidden border-white/5 shadow-lg min-h-[500px] lg:min-h-0 flex flex-col">
          {/* Header overlay */}
          <div className="absolute top-4 left-4 right-4 z-10 glass rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Interaction Lab</h2>
              <div className="text-xs text-white/60">
                Drag to rotate • Scroll to zoom
              </div>
            </div>
          </div>

          {/* 3D Canvas */}
          <div className="w-full h-full min-h-[400px]">
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white/60">Loading 3D Scene...</p>
                </div>
              </div>
            }>
              <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <Environment preset="city" />
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 5, 5]} intensity={0.8} />
                <directionalLight position={[-5, 3, -5]} intensity={0.3} />
                <StitchMascot scale={1} mood={mood} />
                <ContactShadows opacity={0.3} scale={8} blur={1.5} far={1} />
                <OrbitControls makeDefault enablePan={false} minDistance={2} maxDistance={10} />
              </Canvas>
            </Suspense>
          </div>

          {/* Action buttons */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 bg-white/10 backdrop-blur-xl p-3 rounded-2xl border border-white/10">
            <button 
              onClick={() => performAction('eat', "Mmm! Coconut! Meega hungry!")} 
              className="p-3 rounded-xl glass hover:bg-cyan-500/20 group transition-all duration-200 hover:scale-105"
              title="Feed Stitch"
            >
              <Cookie size={20} className="group-hover:scale-110 transition-transform" />
            </button>
            <button 
              onClick={() => performAction('happy', "Hula time! Meega love music!")} 
              className="p-3 rounded-xl glass hover:bg-pink-500/20 group transition-all duration-200 hover:scale-105"
              title="Play Music"
            >
              <Music size={20} className="group-hover:scale-110 transition-transform" />
            </button>
            <button 
              onClick={() => performAction('sneeze', "Alien dust! A-choo!")} 
              className="p-3 rounded-xl glass hover:bg-yellow-500/20 group transition-all duration-200 hover:scale-105"
              title="Make Stitch Sneeze"
            >
              <Ghost size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Stitch Chat Box Section */}
        <div className="w-full lg:w-[400px] flex flex-col glass rounded-2xl overflow-hidden border-white/5 shadow-lg min-h-[500px] max-h-[500px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-white/10 bg-white/5 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-lg shadow-lg">💙</div>
              <div>
                <h3 className="font-bold text-base">Stitch</h3>
                <p className="text-xs text-cyan-400 flex items-center gap-1 uppercase tracking-wide font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> 
                  {isTyping ? 'Typing...' : 'Ready to chat'}
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages - Scrollable Area */}
           <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-cyan-400 scrollbar-track-transparent" style={{ maxHeight: 'calc(500px - 140px)' }}>
            {messages.map((m, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed relative ${
                  m.role === 'user' 
                    ? 'bg-cyan-500 text-black font-medium shadow-lg rounded-tr-none' 
                    : 'glass rounded-tl-none border-white/10 shadow-lg'
                }`}>
                  {m.text}
                  {m.source === 'local' && m.role === 'stitch' && (
                    <div className="absolute -top-1.5 -right-1.5 bg-slate-800 p-0.5 rounded-full text-white/40" title="Offline Response">
                      <Cpu size={8} />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="glass p-3 rounded-xl rounded-tl-none flex gap-1">
                  <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce" />
                  <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input - Fixed at Bottom */}
          <div className="p-4 bg-black/20 border-t border-white/10 flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isOnline ? "Ask Stitch anything..." : "Offline mode active..."}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm transition-all"
              />
              <button 
                onClick={handleSend} 
                className="p-2.5 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-all shadow-lg active:scale-95"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lab;