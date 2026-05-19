'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, FileText, ArrowLeft, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import PDFModal from '@/app/components/PDFModal';

export default function MateriasList() {
  const [materias, setMaterias] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    fetch('/api/materias')
      .then(res => res.json())
      .then(data => setMaterias(data));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.95 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      style={{ 
        paddingTop: '6rem',
        paddingBottom: '4rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: '80vh'
      }}
    >
      <header style={{ marginBottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}
        >
          <div style={{ color: 'var(--primary)' }}>
            <GraduationCap size={44} />
          </div>
          <h1 className="gradient-text" style={{ fontSize: '3.5rem', fontWeight: 800, margin: 0 }}>
            Archivo Académico
          </h1>
        </motion.div>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ color: 'var(--foreground)', fontSize: '1.25rem', maxWidth: '700px', lineHeight: '1.6', fontWeight: 500 }}
        >
          Explora la colección sistematizada de recursos, deberes y evaluaciones por cada materia del semestre.
        </motion.p>
      </header>

      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 400px))',
          gap: '24px',
          width: '100%', 
          maxWidth: '1200px',
          justifyContent: 'center'
        }}>
        {materias.map((materia, index) => {
          // Alternar colores de las tarjetas bento
          const bentoClass = index % 3 === 0 ? 'bento-pink' : (index % 3 === 1 ? 'bento-white' : 'bento-red');
          const btnClass = bentoClass === 'bento-red' ? 'btn-pill' : 'btn-primary btn-pill';
          const btnStyle = bentoClass === 'bento-red' ? { background: 'var(--white)', color: 'var(--primary)', width: '100%' } : { width: '100%' };

          return (
            <motion.div 
              key={materia.id}
              variants={itemVariants}
            >
              <div className={`bento-card ${bentoClass}`} style={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
                  {materia.name.toLowerCase().includes('matemática') ? (
                    <motion.img
                      src="/lua.png"
                      alt="Iluminación"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6 }}
                      style={{ 
                        width: '100px', 
                        height: '100px', 
                        objectFit: 'cover',
                        borderRadius: '50%',
                        background: bentoClass === 'bento-red' ? 'rgba(255,255,255,0.2)' : 'rgba(201, 31, 31, 0.1)',
                        padding: '12px'
                      }}
                    />
                  ) : (
                    <div style={{ 
                      padding: '16px', 
                      background: bentoClass === 'bento-red' ? 'rgba(255,255,255,0.2)' : 'rgba(201, 31, 31, 0.1)', 
                      borderRadius: '50%', 
                      color: bentoClass === 'bento-red' ? 'white' : 'var(--primary)' 
                    }}>
                      <BookOpen size={28} />
                    </div>
                  )}
                  {materia.file_url && (
                    <button 
                      onClick={() => setSelectedPdf({ url: materia.file_url, title: `Portafolio: ${materia.name}` })}
                      className="badge-pill"
                      style={{ 
                        border: 'none', 
                        cursor: 'pointer',
                        background: bentoClass === 'bento-red' ? 'var(--white)' : 'var(--primary)',
                        color: bentoClass === 'bento-red' ? 'var(--primary)' : 'var(--white)'
                      }}
                    >
                      <FileText size={14} /> PDF
                    </button>
                  )}
                </div>

                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>
                  {materia.name}
                </h2>
                
                <p style={{ 
                  flex: 1, 
                  marginBottom: '2.5rem', 
                  lineHeight: '1.6', 
                  fontSize: '1.05rem',
                  opacity: 0.9,
                  fontWeight: 500,
                  color: '#000'
                }}>
                  {materia.description}
                </p>
                
                <Link href={`/materias/${materia.id}`}>
                  <motion.div 
                    className={btnClass}
                    whileHover={{ scale: 1.02 }}
                    style={{ ...btnStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    EXPLORAR MATERIA <ChevronRight size={18} />
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          );
        })}
        </div>
      </div>

      {materias.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="bento-card bento-white"
          style={{ textAlign: 'center', marginTop: '2rem', maxWidth: '500px' }}
        >
          <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
            <BookOpen size={48} style={{ margin: '0 auto' }} />
          </div>
          <p style={{ color: 'var(--foreground)', fontSize: '1.2rem', fontWeight: 600 }}>Aún no se han publicado materias en este semestre.</p>
        </motion.div>
      )}

      <PDFModal 
        url={selectedPdf?.url} 
        title={selectedPdf?.title} 
        onClose={() => setSelectedPdf(null)} 
      />
    </motion.div>
  );
}
