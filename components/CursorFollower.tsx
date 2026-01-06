
import React, { useEffect, useState } from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

const CursorFollower: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [clickEffect, setClickEffect] = useState(false);
  
  const springConfig = { damping: 25, stiffness: 200 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      x.set(e.clientX - 12);
      y.set(e.clientY - 12);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);
    const handleMouseDown = () => setClickEffect(true);
    const handleMouseUp = () => setClickEffect(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Check for clickable elements
    const checkHoverState = () => {
      const element = document.elementFromPoint(mousePosition.x, mousePosition.y);
      if (element) {
        const isClickable = element.tagName === 'BUTTON' || 
                           element.tagName === 'A' || 
                           element.closest('button') || 
                           element.closest('a') ||
                           element.classList.contains('cursor-pointer');
        setIsHovering(!!isClickable);
      }
    };

    const interval = setInterval(checkHoverState, 50);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      clearInterval(interval);
    };
  }, [x, y, mousePosition]);

  useEffect(() => {
    if (isHovering) {
      scale.set(1.3);
    } else if (clickEffect) {
      scale.set(0.8);
    } else {
      scale.set(1);
    }
  }, [isHovering, clickEffect, scale]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ x, y }}
      >
        <motion.div
          style={{ scale }}
          animate={{ 
            rotate: isHovering ? [0, 10, -10, 0] : 0,
          }}
          transition={{ 
            rotate: { duration: 0.5, repeat: Infinity },
            scale: { type: "spring", stiffness: 300, damping: 20 }
          }}
        >
          <Heart 
            className={`text-pink-500 fill-pink-500 transition-all duration-200 ${
              isHovering ? 'drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]' : 'drop-shadow-[0_0_4px_rgba(236,72,153,0.3)]'
            }`}
            size={24}
          />
        </motion.div>
      </motion.div>
      
      {/* Click ripple effect */}
      <AnimatePresence>
        {clickEffect && (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9998]"
            style={{ x: mousePosition.x - 25, y: mousePosition.y - 25 }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="w-12 h-12 rounded-full border-2 border-pink-400" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CursorFollower;