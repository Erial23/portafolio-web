'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function EntryAnimation({ onComplete }) {
  const [isExiting, setIsExiting] = useState(false);


  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 4000);

    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 4800);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.8 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      {/* Efecto de Viñeta Cinematográfica eliminado para claridad total */}


      {/* Imagen Principal (mov.jpg) - FULL SCREEN 3D ZOOM */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0, filter: 'blur(0px) brightness(1)' }}
        animate={{ 
          scale: 1, 
          opacity: 1, 
          filter: [
            'blur(0px) brightness(1.1)',
            'blur(2px) brightness(1.1)',
            'blur(12px) brightness(1.05)'
          ],
        }}
        transition={{ 
          duration: 4.5, 
          ease: "easeOut",
          times: [0, 0.3, 1]
        }}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
      >
        <img 
          src="/mov.jpg" 
          alt="Intro Movement"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'contrast(1.1) saturate(1.2)'
          }}
        />
        
        {/* Capa de destello de luz (Light Leak) */}
        <motion.div
          animate={{ 
            opacity: [0.2, 0.5, 0.2],
            x: ['-10%', '10%', '-10%']
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, transparent 0%, rgba(245, 158, 11, 0.1) 50%, transparent 100%)',
            mixBlendMode: 'screen',
            pointerEvents: 'none'
          }}
        />
      </motion.div>
      {/* Texto de Bienvenida Elevado */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        style={{
          position: 'relative',
          zIndex: 10,
          color: 'white',
          textAlign: 'center',
          perspective: '1000px'
        }}
      >
        <motion.span 
          initial={{ opacity: 0, letterSpacing: '0px', filter: 'blur(10px)' }}
          animate={{ opacity: 1, letterSpacing: '8px', filter: 'blur(0px)' }}
          transition={{ duration: 2, delay: 1.5 }}
          style={{ 
            fontSize: '1.2rem', 
            display: 'block', 
            marginBottom: '1rem',
            textTransform: 'uppercase',
            fontWeight: 800,
            color: '#fff',
            textShadow: '0 4px 15px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,1)',
            letterSpacing: '8px'
          }}
        >
          Facultad de Contabilidad y Auditoría
        </motion.span>
        
        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 8vw, 6rem)', 
          fontWeight: 900, 
          letterSpacing: '18px',
          fontFamily: 'var(--font-heading)',
          textTransform: 'uppercase',
          margin: '0.5rem 0',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.9))'
        }}>
          {"MATEMÁTICAS".split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.5, y: 50, rotateX: -90, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
              transition={{ 
                duration: 1.5, 
                delay: 1.5 + (index * 0.08),
                ease: [0.16, 1, 0.3, 1]
              }}
              style={{
                background: 'linear-gradient(to bottom, #ffffff 0%, #eab308 50%, #854d0e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                textShadow: 'none'
              }}
            >
              {char}
            </motion.span>
          ))}
        </h1>

        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 2.8 }}
          style={{ 
            fontSize: '1.1rem', 
            display: 'block', 
            marginTop: '2.5rem',
            textTransform: 'uppercase',
            fontWeight: 700,
            letterSpacing: '6px',
            color: '#fff',
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: '8px 24px',
            borderRadius: '50px',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,184,0,0.3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
            marginInline: 'auto',
            width: 'fit-content'
          }}
        >
          Carrera de Contabilidad y Auditoría
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
