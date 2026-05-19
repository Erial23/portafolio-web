import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { X, Minus, Square, Maximize2 } from 'lucide-react';

const PDFModal = ({ url, title, onClose }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [size, setSize] = useState({ width: 900, height: 650 });
  const [isResizing, setIsResizing] = useState(false);
  
  const controls = useDragControls();
  const constraintsRef = useRef(null);
  const windowRef = useRef(null);

  // Deshabilitar scroll del body
  useEffect(() => {
    if (url && !isMinimized) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [url, isMinimized]);

  if (!url) return null;

  const handleClose = () => {
    setIsMaximized(false);
    setIsMinimized(false);
    onClose();
  };

  // Lógica de Redimensión Manual
  const startResizing = (e) => {
    e.preventDefault();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const onPointerMove = (moveEvent) => {
      const newWidth = Math.max(400, startWidth + (moveEvent.clientX - startX));
      const newHeight = Math.max(300, startHeight + (moveEvent.clientY - startY));
      setSize({ width: newWidth, height: newHeight });
    };

    const onPointerUp = () => {
      setIsResizing(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  return (
    <AnimatePresence>
      {url && (
        <motion.div
          ref={constraintsRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 2000,
            background: isMinimized ? 'transparent' : 'rgba(10, 10, 10, 0.95)',
            backdropFilter: isMinimized ? 'none' : 'blur(20px)',
            pointerEvents: isMinimized ? 'none' : 'auto',
            display: 'flex',
            alignItems: isMinimized ? 'flex-end' : 'center',
            justifyContent: isMinimized ? 'flex-end' : 'center',
            padding: isMinimized ? '30px' : '0',
          }}
        >
          {/* Contenedor del PDF (La Ventana) */}
          <motion.div
            ref={windowRef}
            drag={!isMaximized}
            dragControls={controls}
            dragListener={false}
            dragConstraints={constraintsRef}
            dragElastic={0.05}
            layout
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ 
              scale: isMinimized ? 0.4 : 1,
              opacity: 1,
              width: isMaximized ? '100%' : (isMinimized ? '350px' : `${size.width}px`),
              height: isMaximized ? '100%' : (isMinimized ? '50px' : `${size.height}px`),
            }}
            style={{
              backgroundColor: '#111111',
              borderRadius: isMaximized || isMinimized ? '0px' : '16px',
              overflow: 'hidden',
              boxShadow: isResizing ? '0 30px 60px rgba(0,0,0,0.8)' : '0 20px 40px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              pointerEvents: 'auto', // Asegura que la ventana sea interactuable aunque el padre no lo sea
              cursor: isMinimized ? 'pointer' : 'default',
              touchAction: 'none'
            }}
            onClick={() => isMinimized && setIsMinimized(false)}
          >
            {/* Header / Barra de Título */}
            <div 
              onPointerDown={(e) => !isMaximized && controls.start(e)}
              onDoubleClick={() => { setIsMaximized(!isMaximized); setIsMinimized(false); }}
              style={{
                padding: '0.6rem 1.2rem',
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                cursor: isMaximized ? 'default' : 'grab',
                userSelect: 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={(e) => { e.stopPropagation(); handleClose(); }} style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56', border: 'none', cursor: 'pointer' }} />
                  <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e', border: 'none', cursor: 'pointer' }} />
                  <button onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); setIsMinimized(false); }} style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f', border: 'none', cursor: 'pointer' }} />
                </div>
                <span style={{ marginLeft: '0.75rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 600 }}>
                  {title || 'DOCUMENTO'} {isMinimized ? '(Click para maximizar)' : ''}
                </span>
              </div>
            </div>

            {/* Iframe / Imagen Contenedor */}
            <div style={{ flex: 1, display: isMinimized ? 'none' : 'block', background: '#f3f4f6', position: 'relative' }}>
              {url?.match(/\.(jpeg|jpg|gif|png|webp|bmp)$/i) ? (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                  <img src={url} alt={title || 'Imagen adjunta'} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
              ) : (
                <iframe
                  src={`${url}#toolbar=0`}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              )}
              {isResizing && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }} />}
            </div>

            {/* Handle de Redimensión */}
            {!isMaximized && !isMinimized && (
              <div 
                onPointerDown={startResizing}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '20px',
                  height: '20px',
                  cursor: 'nwse-resize',
                  zIndex: 20
                }}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PDFModal;
