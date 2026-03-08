import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, PawPrint, Sparkles, Cloud, Star } from 'lucide-react';
import DogChat from '../components/DogChat';
import MowgliChatService from '../services/mowgliChat';

interface MowgliProps {
  config?: {
    title?: string;
    content?: string;
  };
}

const Mowgli: React.FC<MowgliProps> = ({ config }) => {
  const [showExportButton, setShowExportButton] = useState(false);
  const chatService = MowgliChatService.getInstance();

  const handleMessageUpdate = (messages: any[]) => {
    // Show export button when there are meaningful conversations
    if (messages.length > 3) {
      setShowExportButton(true);
    }
  };

  const handleExportMessages = () => {
    const stats = chatService.getMessageStats();
    const currentData = {
      messages: JSON.parse(localStorage.getItem('mowgli-chat-data') || '{}').messages || [],
      metadata: {
        exportedAt: new Date().toISOString(),
        stats,
        description: 'Mowgli chat messages - A collection of love and memories'
      }
    };
    
    // Create a more personalized export
    const exportData = {
      ...currentData,
      memorial: {
        name: 'Mowgli',
        adoptionAge: '16 days old',
        lifespan: '3 beautiful years',
        relationship: 'Like a brother',
        message: 'Forever in our hearts, watching over us from the rainbow bridge 🌈'
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mowgli-memorial-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-400/20 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-400/15 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-400/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.3, 0.7, 0.3],
              scale: [0.8, 1.2, 0.8],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5
            }}
            style={{
              top: `${20 + (i * 15)}%`,
              left: `${10 + (i * 15)}%`
            }}
          >
            <Star className="w-4 h-4 text-amber-300" />
          </motion.div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 text-center relative z-10">
        {/* Memorial Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg"
              >
                <PawPrint className="w-12 h-12 text-white" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center"
              >
                <Heart className="w-3 h-3 text-white" />
              </motion.div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 mb-4">
            {config?.title || 'MOWGLI'}
          </h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl md:text-2xl text-amber-200/90 leading-relaxed max-w-3xl mx-auto"
          >
            <p className="mb-4">{config?.content || 'A loving brother who came home at 16 days old and blessed us with 3 beautiful years of unconditional love.'}</p>
            
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-base">
              <div className="flex items-center gap-2 bg-amber-500/20 px-4 py-2 rounded-full">
                <PawPrint className="w-4 h-4 text-amber-400" />
                <span>16 days old when adopted</span>
              </div>
              <div className="flex items-center gap-2 bg-orange-500/20 px-4 py-2 rounded-full">
                <Heart className="w-4 h-4 text-orange-400" />
                <span>3 years of pure love</span>
              </div>
              <div className="flex items-center gap-2 bg-pink-500/20 px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>Like a brother</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Chat Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mb-8"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-amber-200/30 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20">
              <h2 className="text-2xl md:text-3xl font-bold text-amber-100 mb-2 flex items-center justify-center gap-3">
                <Cloud className="w-8 h-8 text-amber-300" />
                Talk to Mowgli
                <Cloud className="w-8 h-8 text-amber-300" />
              </h2>
              <p className="text-amber-200/80 text-center">
                He's always here, watching over you from the rainbow bridge 🌈
              </p>
            </div>
            <DogChat onMessageUpdate={handleMessageUpdate} />
          </div>
        </motion.div>

        {/* Export Button */}
        {showExportButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <button
              onClick={handleExportMessages}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-semibold hover:from-amber-600 hover:to-orange-600 transition-all flex items-center gap-2 mx-auto shadow-lg"
            >
              <Heart className="w-5 h-5" />
              Save Our Conversations
              <Sparkles className="w-5 h-5" />
            </button>
            <p className="text-amber-200/70 text-sm mt-2">
              Keep these precious memories forever
            </p>
          </motion.div>
        )}

        {/* Memorial Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-pink-500/20 px-6 py-3 rounded-full">
            <Star className="w-5 h-5 text-amber-400" />
            <span className="text-amber-200 font-medium">
              Forever in our hearts, watching over us from the stars
            </span>
            <Star className="w-5 h-5 text-amber-400" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Mowgli;