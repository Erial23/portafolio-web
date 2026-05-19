'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Check } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen) return null;
  if (!mounted) return null;

  return createPortal(
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 999999, // extremely high to override everything
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      pointerEvents: 'auto'
    }}>
      {/* Backdrop with a premium, soft dark blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(12px)',
          zIndex: 999999
        }}
      />

      {/* Dialog Card - Beautiful Premium Light glassmorphism with red/coral accents */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: 'spring', duration: 0.5 }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          padding: '2.5rem',
          textAlign: 'center',
          boxShadow: '0 25px 60px -15px rgba(201, 31, 31, 0.15), 0 15px 30px -10px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(201, 31, 31, 0.12)',
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(20px)',
          borderRadius: '28px',
          zIndex: 1000000,
          color: 'var(--foreground)'
        }}
      >
        {/* Decorative close button */}
        <button 
          onClick={onClose} 
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(0, 0, 0, 0.04)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--foreground)',
            opacity: 0.6,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.background = 'rgba(201, 31, 31, 0.1)'; e.currentTarget.style.color = 'var(--primary)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.6; e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)'; e.currentTarget.style.color = 'var(--foreground)'; }}
        >
          <X size={16} />
        </button>

        {/* Warning Icon Container */}
        <div style={{
          background: 'rgba(201, 31, 31, 0.07)',
          width: '84px',
          height: '84px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0.5rem auto 1.5rem',
          color: 'var(--primary)',
          border: '2px solid rgba(201, 31, 31, 0.15)'
        }}>
          <AlertTriangle size={42} style={{ filter: 'drop-shadow(0 4px 6px rgba(201,31,31,0.15))' }} />
        </div>

        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.8rem', color: 'var(--primary)', fontWeight: 800, letterSpacing: '-0.5px' }}>
          {title}
        </h2>
        <p style={{ color: 'var(--foreground)', opacity: 0.75, lineHeight: '1.6', marginBottom: '2.5rem', fontSize: '1.05rem', fontWeight: 500 }}>
          {message}
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '14px',
              border: '1.5px solid rgba(0, 0, 0, 0.1)',
              background: 'transparent',
              color: 'var(--foreground)',
              borderRadius: '16px',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0, 0, 0, 0.03)'; e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)'; }}
          >
            <X size={18} />
            Cancelar
          </button>
          
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '16px',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(201, 31, 31, 0.25)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(201, 31, 31, 0.35)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(201, 31, 31, 0.25)'; }}
          >
            <Check size={18} />
            Confirmar
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
