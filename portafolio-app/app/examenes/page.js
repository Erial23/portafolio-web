'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Calendar, Book, ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';
import PDFModal from '@/app/components/PDFModal';

export default function ExamenesList() {
  const [examenes, setExamenes] = useState([]);
  const [materiasMap, setMateriasMap] = useState({});
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    // 1. Obtener materias para el mapa de IDs -> Nombres
    fetch('/api/materias')
      .then(res => res.json())
      .then(data => {
        const mapa = {};
        data.forEach(m => { mapa[m.id] = m.name });
        setMateriasMap(mapa);
        
        // 2. Obtener todas las asignaciones
        return fetch('/api/asignaciones');
      })
      .then(res => res.json())
      .then(data => {
        // Filtrar solo los 'examen'
        setExamenes(data.filter(d => d.type === 'examen'));
      });
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ padding: '24px', background: 'var(--primary)', borderRadius: '50%', color: 'var(--white)', boxShadow: '0 10px 30px rgba(201,31,31,0.2)' }}>
            <Target size={48} />
          </div>
        </div>
        <h1 className="gradient-text" style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 800 }}>
          Registro de Exámenes
        </h1>
        <p style={{ color: 'var(--foreground)', fontSize: '1.2rem', fontWeight: 500 }}>Cronograma y temario de evaluaciones del semestre.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        {examenes.map((asig, i) => {
          const isPink = i % 2 !== 0;
          const cardClass = isPink ? 'bento-card bento-pink' : 'bento-card bento-red';
          const linkBadgeClass = isPink ? 'badge-pill red' : 'badge-pill' ;
          const linkBadgeStyle = isPink ? {} : { background: 'var(--white)', color: 'var(--primary)' };
          const textOpacity = isPink ? 1 : 0.9;

          return (
            <motion.div 
              key={asig.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={cardClass}
              style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', fontWeight: 800 }}>{asig.title}</h2>
                  <Link href={`/materias/${asig.materia_id}`}>
                    <span className={linkBadgeClass} style={{ ...linkBadgeStyle, cursor: 'pointer' }}>
                      <Book size={14} /> {materiasMap[asig.materia_id] || 'Materia'}
                    </span>
                  </Link>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', opacity: textOpacity }}>
                  <Calendar size={18} /> Fecha de evaluación: {asig.date || 'Por definir'}
                </div>
                <p style={{ lineHeight: '1.6', marginBottom: asig.file_url ? '1.5rem' : '0', fontWeight: 500, opacity: textOpacity }}>{asig.description}</p>
                
                {asig.file_url && (
                  <button 
                    onClick={() => setSelectedPdf({ url: asig.file_url, title: asig.title })}
                    className="btn-pill" 
                    style={{ 
                      fontSize: '0.9rem', 
                      background: 'var(--white)',
                      color: 'var(--primary)',
                      border: 'none',
                      padding: '10px 20px'
                    }}
                  >
                    <FileText size={16} /> Ver Examen PDF
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}

        {examenes.length === 0 && (
          <div className="bento-card bento-white" style={{ padding: '4rem', textAlign: 'center', color: 'var(--foreground)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No hay exámenes</h3>
            <p>Actualmente no hay exámenes programados en el sistema.</p>
          </div>
        )}
      </div>

      <PDFModal 
        url={selectedPdf?.url} 
        title={selectedPdf?.title} 
        onClose={() => setSelectedPdf(null)} 
      />
    </motion.div>
  );
}
