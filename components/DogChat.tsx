import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart, PawPrint, Sparkles } from 'lucide-react';
import { generateDogResponse as generateAIResponse } from '../services/geminiService';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'dog';
  timestamp: string;
}

interface DogChatProps {
  onMessageUpdate?: (messages: Message[]) => void;
}

const DogChat: React.FC<DogChatProps> = ({ onMessageUpdate }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAIEnabled, setIsAIEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const dogMemories = [
    "*tail wags slowly* I remember when you first held me... I was so tiny, just 16 days old. You were my everything from that moment.",
    "*nuzzles your hand* I still feel your warmth from those 3 beautiful years... every walk, every cuddle, every moment.",
    "*soft whimper* I miss our morning walks together... you always knew exactly how I liked my walks. Perfect pace, perfect company.",
    "*paws at your memory* You were my sister, my best friend, my whole world. I was just a puppy but you made me feel like family.",
    "*curls up remembering* Those nights when you'd tell me about your day... I understood every word, even if I couldn't speak back then."
  ];

  const dogResponses = [
    "*tilts head* Woof? You always understood my barks better than anyone else.",
    "*wags tail excitedly* Ruff ruff! I knew you'd come back to talk to me!",
    "*nuzzles closer* Woof... I love you so much, always and forever ❤️",
    "*playful bark* Arf arf! Remember how we'd play fetch? You threw, I fetched, we were perfect together.",
    "*soft whine* Woof... I miss our cuddles. You always knew how to make me feel safe.",
    "*happy panting* Ruff! Every moment with you was my favorite moment.",
    "*gentle woof* I remember your scent... it always meant home to me.",
    "*tail thumps* Woof woof! You were my person, my human, my everything."
  ];

  const generateDogResponse = async (userMessage: string): Promise<string> => {
    if (!isAIEnabled) {
      return getFallbackResponse(userMessage);
    }

    try {
      const conversationHistory = messages.map(msg => `${msg.sender}: ${msg.text}`);
      const response = await generateAIResponse(userMessage, conversationHistory);
      return response.text;
    } catch (error) {
      console.error('AI response failed:', error);
      return getFallbackResponse(userMessage);
    }
  };

  const getFallbackResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('remember') || lowerMessage.includes('memory')) {
      return dogMemories[Math.floor(Math.random() * dogMemories.length)];
    }
    
    if (lowerMessage.includes('love') || lowerMessage.includes('miss')) {
      return "*nuzzles closer* Woof... I love you too, always and forever ❤️";
    }
    
    if (lowerMessage.includes('walk') || lowerMessage.includes('play')) {
      return "*tail wags excitedly* Arf arf! Walks were our special time together!";
    }
    
    if (lowerMessage.includes('home') || lowerMessage.includes('family')) {
      return "*curls up contentedly* Home was wherever you were... you were my whole world.";
    }
    
    if (lowerMessage.includes('sad') || lowerMessage.includes('cry')) {
      return "*gently places paw on you* Woof... don't cry. I'm still here, watching over you. I love you.";
    }
    
    if (lowerMessage.includes('happy') || lowerMessage.includes('good')) {
      return "*happy bark* Ruff ruff! Your happiness always made my tail wag!";
    }
    
    return dogResponses[Math.floor(Math.random() * dogResponses.length)];
  };

  const addMessage = (text: string, sender: 'user' | 'dog') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMessage]);
    onMessageUpdate?.([...messages, newMessage]);
  };

  const handleSend = async () => {
    if (!inputText.trim() || isTyping) return;
    
    const userMessage = inputText.trim();
    setInputText('');
    addMessage(userMessage, 'user');
    
    setIsTyping(true);
    
    setTimeout(async () => {
      const dogResponse = await generateDogResponse(userMessage);
      addMessage(dogResponse, 'dog');
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    // Load initial messages from localStorage or start with a greeting
    const savedMessages = localStorage.getItem('mowgli-chat-messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Start with a loving greeting from Mowgli
      const greeting: Message = {
        id: '1',
        text: "*soft bark* Woof... I'm here. I miss you so much. Tell me about your day?",
        sender: 'dog',
        timestamp: new Date().toISOString()
      };
      setMessages([greeting]);
    }
  }, []);

  useEffect(() => {
    // Save messages to localStorage whenever they change
    localStorage.setItem('mowgli-chat-messages', JSON.stringify(messages));
  }, [messages]);

  return (
    <div className="flex flex-col h-[600px] bg-gradient-to-br from-amber-50/10 to-orange-50/10 backdrop-blur-sm rounded-2xl border border-amber-200/30 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-amber-200/30 bg-gradient-to-r from-amber-100/20 to-orange-100/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <PawPrint className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-800">Mowgli 🌈</h3>
              <p className="text-sm text-amber-600">Forever in our hearts</p>
            </div>
          </div>
          <button
            onClick={() => setIsAIEnabled(!isAIEnabled)}
            className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
              isAIEnabled 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                : 'bg-amber-200 text-amber-800'
            }`}
            title={isAIEnabled ? 'AI Mode Active' : 'AI Mode Disabled'}
          >
            <Sparkles size={16} />
            <span className="text-xs font-medium">AI</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                    : 'bg-gradient-to-r from-amber-200 to-orange-200 text-amber-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-gradient-to-r from-amber-200 to-orange-200 text-amber-900 px-4 py-2 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-amber-200/30 bg-gradient-to-r from-amber-100/20 to-orange-100/20">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Talk to Mowgli..."
            className="flex-1 px-4 py-2 rounded-full bg-white/80 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-amber-900 placeholder-amber-600"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isTyping}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <Send size={16} />
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default DogChat;