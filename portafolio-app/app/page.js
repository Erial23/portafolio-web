'use client';

import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowRight, Book, FileText, Target, ChevronRight, User, Info, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import RotatingText from './components/RotatingText';
import EntryAnimation from './components/EntryAnimation';
import { useState, useCallback, useEffect, useRef } from 'react';

const Membrete = ({ size = 'large' }) => (
  <motion.div
    style={{
      textAlign: 'center',
      width: '100%',
      padding: '0 2rem',
      marginBottom: size === 'large' ? '2.5rem' : '1.5rem',
      marginTop: size === 'large' ? '1rem' : '0'
    }}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.2 }}
  >
    <h2 style={{
      fontSize: size === 'large' ? '0.75rem' : '0.6rem',
      fontWeight: 800,
      color: 'var(--primary)',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      marginBottom: '0.2rem',
      opacity: 0.9,
      textShadow: '0 0 10px rgba(255,255,255,0.8)'
    }}>
      Universidad Técnica de Ambato
    </h2>
    <h1 style={{
      fontSize: size === 'large' ? '1.8rem' : '1.2rem',
      fontWeight: 900,
      color: 'var(--primary)',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      lineHeight: 1.1,
      textShadow: '0 0 15px rgba(255,255,255,0.8)'
    }}>
      Facultad de Contabilidad y Auditoría
    </h1>
    <div style={{
      width: '60px',
      height: '3px',
      background: 'var(--primary)',
      margin: '0.8rem auto 0',
      borderRadius: '2px'
    }}></div>
  </motion.div>
);

// Componente de Partículas de Escape (Fuego/Energía)
const ParticleExhaust = ({ isDriving }) => {
  return (
    <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: '100px', height: '50px', zIndex: 0, pointerEvents: 'none' }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, scale: 1, opacity: 0.8 }}
          animate={isDriving ? {
            x: [-20 - Math.random() * 50, -150 - Math.random() * 100], // Explosión hacia atrás
            y: [0, (Math.random() - 0.5) * 80],
            scale: [1, Math.random() * 3 + 1, 0],
            opacity: [1, 0],
          } : {
            x: [-10, -40 - Math.random() * 20], // Ralentí suave
            y: [0, (Math.random() - 0.5) * 20],
            scale: [1, 0],
            opacity: [0.6, 0]
          }}
          transition={{
            duration: isDriving ? Math.random() * 0.3 + 0.1 : Math.random() * 0.8 + 0.4,
            repeat: Infinity,
            ease: "easeOut",
            delay: Math.random() * 0.2
          }}
          style={{
            position: 'absolute',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: Math.random() > 0.5 ? '#FF4500' : '#FFA500',
            boxShadow: '0 0 15px #FF4500',
            mixBlendMode: 'screen'
          }}
        />
      ))}
    </div>
  );
};

// Componente de Entrada de Partículas de la Mascota
const MascotParticleEntrance = ({ onFormed }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let animationFrameId;

    // Garantizar que la moto SIEMPRE se materialice después de 2.5 segundos,
    // sin importar latencias en la carga de la imagen o dimensiones del canvas.
    const timer = setTimeout(() => {
      onFormed();
    }, 2500);

    const image = new Image();
    image.src = '/lupa.png';
    image.onload = () => {
      const parent = canvas.parentElement;
      if (!parent || parent.clientWidth === 0 || parent.clientHeight === 0) return;

      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;

      const imgWidth = canvas.width * 1.3;
      const imgHeight = imgWidth * (image.height / image.width);
      const drawX = (canvas.width - imgWidth) / 2;
      const drawY = (canvas.height - imgHeight) / 2;

      ctx.drawImage(image, drawX, drawY, imgWidth, imgHeight);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particlesArray = [];
      const step = 6; // Compacto
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const index = (y * canvas.width + x) * 4;
          const a = data[index + 3];
          if (a > 128) {
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];

            particlesArray.push({
              targetX: x,
              targetY: y,
              x: canvas.width / 2 + (Math.random() - 0.5) * 1500, // Vienen de muy lejos
              y: canvas.height / 2 + (Math.random() - 0.5) * 1500,
              color: `rgb(${r},${g},${b})`,
              size: Math.random() * 2 + 1.5,
              vx: 0,
              vy: 0,
              delay: Math.random() * 30
            });
          }
        }
      }

      let age = 0;
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        age++;

        for (let i = 0; i < particlesArray.length; i++) {
          const p = particlesArray[i];
          if (age < p.delay) continue;

          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;

          p.vx += dx * 0.05;
          p.vy += dy * 0.05;
          p.vx *= 0.82; // Fricción fuerte para que frene rápido
          p.vy *= 0.82;

          p.x += p.vx;
          p.y += p.vy;

          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }

        animationFrameId = requestAnimationFrame(animate);
      };

      animate();
    };

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrameId);
    };
  }, [onFormed]);

  return (
    <motion.canvas
      ref={canvasRef}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px) brightness(2)', scale: 1.1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 5,
        pointerEvents: 'none',
        transform: 'translateZ(50px)' // Mismo nivel 3D que la imagen
      }}
    />
  );
};

export default function Home() {
  const [isEntering, setIsEntering] = useState(true);
  const [isDriving, setIsDriving] = useState(false);
  const [mascotPhase, setMascotPhase] = useState('hidden'); // hidden, particles, materialized

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleComplete = useCallback(() => {
    setIsEntering(false);
    // Iniciar la formación de partículas tan pronto desaparece la pantalla de carga principal
    setTimeout(() => {
      setMascotPhase('particles');
    }, 500);
  }, []);

  const handleMascotFormed = useCallback(() => {
    setMascotPhase('materialized');
    // Automáticamente despega
    setIsDriving(true);
    setTimeout(() => {
      setIsDriving(false);
    }, 4000);
  }, []);

  const handleLupaClick = () => {
    if (isDriving || mascotPhase !== 'materialized') return;
    setIsDriving(true);
    setTimeout(() => {
      setIsDriving(false);
    }, 4000);
  };

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const transformRotateX = useTransform(mouseYSpring, [-300, 300], [10, -10]);
  const transformRotateY = useTransform(mouseXSpring, [-300, 300], [-10, 10]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  return (
    <>
      <></>

      <AnimatePresence>
        {isEntering && (
          <EntryAnimation onComplete={handleComplete} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isEntering ? 0 : 1 }}
        transition={{ duration: 1 }}
        style={{
          width: '100%',
          height: '100vh',
          overflowY: 'auto',
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
        }}
      >
        {/* SECCIÓN 1: HOME PRINCIPAL */}
        <section style={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 1rem 2rem 1rem',
          scrollSnapAlign: 'start',
          position: 'relative',
          overflowX: 'hidden'
        }}>
          <div className="container" style={{ padding: '0 2rem', maxWidth: '1200px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            <Membrete size="large" />

            <div className="grid-bento" style={{ alignItems: 'stretch', width: '100%' }}>

              {/* Bloque Hero + Info */}
              <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <motion.div
                  className="bento-card bento-red"
                  style={{
                    padding: '3.5rem',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    background: '#be2020', // Mas parecido al rojo de la imagen
                    borderRadius: '40px'
                  }}
                >
                  <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '10px' }}>
                    <span className="badge-pill" style={{ background: 'rgba(255,255,255,0.3)', color: 'white', fontSize: '0.7rem', padding: '4px 15px' }}>PORTAFOLIO</span>
                  </div>
                  <h1 style={{ fontSize: '3.8rem', fontWeight: 900, lineHeight: '1', marginBottom: '1.5rem', letterSpacing: '-2px' }}>
                    Aquí podrás encontrar <br />
                    <span style={{ color: '#d9a11d' }}>DEBERES</span>
                  </h1>
                  <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '2rem', fontWeight: 500, maxWidth: '440px' }}>
                    Explora los aprendizajes, tareas y evaluaciones de este periodo académico.
                  </p>
                  <div>
                    <Link href="/materias">
                      <button className="btn-pill" style={{ background: 'var(--white)', color: 'var(--primary)', border: 'none', fontSize: '0.9rem', padding: '12px 30px' }}>
                        Ver Materias <ArrowRight size={18} />
                      </button>
                    </Link>
                  </div>
                </motion.div>

                <div className="bento-card" style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  textAlign: 'center',
                  alignItems: 'center',
                  background: '#f8d7da', // Rosa claro de la imagen
                  borderRadius: '40px',
                  height: '150px'
                }}>
                  <span className="badge-pill" style={{
                    background: '#be2020',
                    color: 'white',
                    marginBottom: '1rem',
                    fontSize: '0.7rem',
                    padding: '4px 15px'
                  }}>
                    <User size={12} style={{ marginRight: '5px' }} /> ESTUDIANTE
                  </span>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '0', fontWeight: 900, color: '#000000' }}>Lizeth Alexandra Vaca Escobar</h3>
                </div>
              </div>

              {/* Bloque Moto Flotante Épico 3D */}
              <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '24px' }}>
                <div
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => {
                    x.set(0);
                    y.set(0);
                  }}
                  style={{
                    width: '100%',
                    flex: 1,
                    minHeight: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    perspective: 1200, // Mayor perspectiva para efecto 3D más profundo
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                  onClick={handleLupaClick}
                >
                  <motion.div
                    style={{
                      position: 'relative',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      rotateX: transformRotateX,
                      rotateY: transformRotateY,
                      transformStyle: 'preserve-3d'
                    }}
                    animate={isDriving ? {
                      x: [0, -40, 2500, -2500, 0], // Sale por derecha, reaparece por izquierda
                      scale: [1, 1.1, 0.4, 0.4, 1],
                      rotateZ: [0, -15, 15, 5, 0], // Mantiene inclinación mientras regresa
                      filter: ['blur(0px)', 'blur(0px)', 'blur(10px)', 'blur(10px)', 'blur(0px)']
                    } : {
                      y: [0, -15, 0]
                    }}
                    transition={isDriving ? {
                      duration: 3,
                      times: [0, 0.1, 0.5, 0.501, 1],
                      ease: "easeInOut"
                    } : {
                      y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    {/* SOMBRA DINÁMICA: Reacciona al movimiento y al 3D */}
                    <motion.div
                      style={{
                        position: 'absolute',
                        bottom: '-10%',
                        width: '60%',
                        height: '20px',
                        background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(8px)',
                        transform: 'translateZ(-50px)', // Empujado hacia atrás en 3D
                        zIndex: 1
                      }}
                      animate={{
                        scale: isDriving ? 0 : [1, 1.1, 1],
                        opacity: isDriving ? 0 : [0.3, 0.6, 0.3]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* RESPLANDOR TRASERO: Efecto de iluminación épica */}
                    <motion.div
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        background: 'radial-gradient(circle, rgba(255, 200, 0, 0.4) 0%, transparent 60%)',
                        borderRadius: '50%',
                        filter: 'blur(40px)',
                        transform: 'translateZ(-20px)',
                        zIndex: 1,
                        pointerEvents: 'none'
                      }}
                      animate={{
                        opacity: isDriving ? [0.2, 1, 0] : [0.1, 0.3, 0.1],
                        scale: isDriving ? [1, 1.5, 0] : [1, 1.1, 1]
                      }}
                      transition={{ duration: isDriving ? 2.5 : 3, repeat: isDriving ? 0 : Infinity, ease: "easeInOut" }}
                    />

                    {/* Partículas de Escape Continúo (Solo si está materializada) */}
                    {mascotPhase === 'materialized' && <ParticleExhaust isDriving={isDriving} />}

                    {/* ORBES FLOTANTES 3D (Efecto Polvo Estelar/Energía) */}
                    {mascotPhase === 'materialized' && [...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        style={{
                          position: 'absolute',
                          width: Math.random() * 6 + 4 + 'px',
                          height: Math.random() * 6 + 4 + 'px',
                          borderRadius: '50%',
                          background: 'white',
                          boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
                          transform: `translateZ(${Math.random() * 100 + 50}px)`, // Diferentes profundidades 3D
                          left: `${Math.random() * 80 + 10}%`,
                          top: `${Math.random() * 80 + 10}%`,
                          zIndex: 3
                        }}
                        animate={{
                          y: [0, Math.random() * -30 - 10, 0],
                          x: [0, (Math.random() - 0.5) * 20, 0],
                          opacity: [0.2, 0.8, 0.2]
                        }}
                        transition={{
                          duration: Math.random() * 2 + 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: Math.random() * 2
                        }}
                      />
                    ))}

                    {/* Imagen principal: oculta en phase 'particles' o 'hidden', y animada desde 'particles' */}
                    <motion.img
                      src="/lupa.png"
                      alt="Moto"
                      initial={{ opacity: 0, filter: 'blur(10px) brightness(2)' }}
                      animate={{
                        opacity: mascotPhase === 'materialized' ? 1 : 0,
                        filter: mascotPhase === 'materialized' ? 'blur(0px) brightness(1)' : 'blur(10px) brightness(2)'
                      }}
                      transition={{ duration: 0.5 }}
                      style={{
                        width: '130%', // Aún más grande e imponente
                        height: 'auto',
                        position: 'relative',
                        zIndex: 2,
                        transform: 'translateZ(50px)', // La imagen salta hacia adelante en 3D
                        filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.4))'
                      }}
                      whileHover={{ scale: 1.05, filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.6)) brightness(1.1)' }}
                    />

                    {/* Lógica de Partículas */}
                    <AnimatePresence>
                      {mascotPhase === 'particles' && (
                        <MascotParticleEntrance onFormed={handleMascotFormed} />
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                <motion.div
                  className="bento-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  style={{
                    padding: '1.5rem',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textAlign: 'center',
                    alignItems: 'center',
                    background: '#f8d7da',
                    borderRadius: '40px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    height: '150px'
                  }}
                >
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#be2020', margin: 0, lineHeight: '1.2' }}>
                    Primer Semestre "B"
                  </h3>
                  <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#000000', margin: '0.5rem 0 0 0' }}>
                    Nº de Lista 20
                  </p>
                </motion.div>
              </div>
            </div>
          </div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ position: 'absolute', bottom: '1.5rem', color: 'var(--primary)', opacity: 0.4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <ChevronRight size={20} style={{ transform: 'rotate(90deg)' }} />
          </motion.div>
        </section>

        {/* SECCIÓN 2: MISIÓN Y VISIÓN */}
        <section style={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 1rem 2rem 1rem',
          scrollSnapAlign: 'start'
        }}>
          <div className="container" style={{ maxWidth: '1000px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Membrete size="small" />

            <div className="grid-bento" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', width: '100%' }}>
              <motion.div
                className="bento-card bento-red"
                style={{ padding: '4rem 3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ background: 'white', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}>
                    <Target size={32} />
                  </div>
                  <h2 style={{ fontSize: '2.5rem', color: 'white', margin: 0, fontWeight: 900 }}>MISIÓN</h2>
                </div>
                <p style={{ fontSize: '1.25rem', lineHeight: '1.7', color: 'rgba(255,255,255,0.95)', fontWeight: 500 }}>
                  La Facultad de Contabilidad y Auditoría formará profesionales líderes competentes, con visión humanista y pensamiento crítico a través de la Docencia, la Investigación y la Vinculación.
                </p>
              </motion.div>

              <motion.div
                className="bento-card bento-pink"
                style={{ padding: '4rem 3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '12px', color: 'white' }}>
                    <Target size={32} />
                  </div>
                  <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', margin: 0, fontWeight: 900 }}>VISIÓN</h2>
                </div>
                <p style={{ fontSize: '1.25rem', lineHeight: '1.7', color: 'var(--foreground)', fontWeight: 600 }}>
                  La Facultad de Contabilidad y Auditoría se constituirá como un centro de formación superior con liderazgo y proyección nacional e internacional.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </motion.div>

      {/* GitHub Link */}
      <footer style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100 }}>
        <motion.a
          href="https://github.com/Erial23"
          target="_blank"
          className="btn-pill"
          style={{ background: 'var(--white)', color: 'var(--primary)', border: '2px solid var(--secondary)', padding: '10px 20px', fontSize: '0.8rem' }}
          whileHover={{ scale: 1.05 }}
        >
          <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: '8px' }}>
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
          </svg>
          GitHub / Erial23
        </motion.a>
      </footer>
    </>
  );
}
