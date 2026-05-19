'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const words = [
  { text: 'DEBERES', color: '#F59E0B' }, // Ámbar
  { text: 'MATERIA', color: '#FFFFFF' }, // Blanco
  { text: 'EXÁMENES', color: '#D97706' } // Dorado Cálido
];

export default function RotatingText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ 
      height: '1.2em', 
      overflow: 'hidden', 
      display: 'inline-flex', 
      flexDirection: 'column',
      verticalAlign: 'top',
      position: 'relative',
      padding: '0'
    }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index].text}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.76, 0, 0.24, 1] 
          }}
          style={{ 
            color: words[index].color,
            fontWeight: 800,
            display: 'block',
            textShadow: `0 0 20px ${words[index].color}33`,
            letterSpacing: '-2px'
          }}
        >
          {words[index].text}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
