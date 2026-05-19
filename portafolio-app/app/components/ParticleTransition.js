'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function ParticleTransition() {
  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = useState(false);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      // Si navegamos a cualquier parte de materias, disparamos
      if (pathname.startsWith('/materias')) {
        setIsAnimating(false); // Reset por si ya estaba
        setTimeout(() => setIsAnimating(true), 10);
        const timer = setTimeout(() => setIsAnimating(false), 1500);
        return () => clearTimeout(timer);
      }
    }
    prevPathname.current = pathname;
  }, [pathname]);

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100000, // Z-Index ultra alto
            pointerEvents: 'none',
            overflow: 'hidden'
          }}
        >
          {/* Fondo de Flash Sólido para que se note el cambio */}
          <motion.div 
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'var(--primary)',
              zIndex: 100001
            }}
          />

          {/* Partículas Épicas de Transición (Más cantidad) */}
          {Array.from({ length: 60 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * 100 + 'vw', 
                y: '100vh', 
                scale: 0,
                opacity: 1
              }}
              animate={{ 
                y: '-20vh',
                x: (Math.random() * 100 - 10) + 'vw',
                scale: [0, 2.5, 0.5],
                opacity: [1, 1, 0],
                rotate: [0, 720]
              }}
              transition={{ 
                duration: 1.2 + Math.random(), 
                ease: "easeOut",
                delay: Math.random() * 0.4
              }}
              style={{
                position: 'absolute',
                width: '12px',
                height: '12px',
                background: i % 3 === 0 ? 'var(--primary)' : (i % 3 === 1 ? '#ffcc00' : 'white'),
                borderRadius: '2px',
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.8)',
                zIndex: 100002
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
