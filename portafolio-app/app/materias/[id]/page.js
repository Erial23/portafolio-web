'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, ArrowLeft, Calendar, FileText, Target } from 'lucide-react';
import Link from 'next/link';

export default function DetalleMateria({ params }) {
  const { id } = use(params);
  
  const [asignaciones, setAsignaciones] = useState([]);
  const [materia, setMateria] = useState(null);

  useEffect(() => {
    // Buscar la información de la materia
    fetch('/api/materias')
      .then(res => res.json())
      .then(data => {
        const found = data.find(m => m.id.toString() === id);
        setMateria(found);
      });

    // Buscar las asignaciones de esta materia
    fetch(`/api/asignaciones?materiaId=${id}`)
      .then(res => res.json())
      .then(data => setAsignaciones(data));
  }, [id]);

  if (!materia) return <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--primary)' }}>Sincronizando datos...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <header style={{ marginBottom: '3rem' }}>
        <Link href="/materias">
          <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', padding: '8px 16px' }}>
            <ArrowLeft size={18} /> Volver al Archivo
          </button>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <FolderOpen size={40} className="gradient-text glow-text" style={{ color: 'var(--primary)' }} />
          <h1 className="gradient-text glow-text" style={{ fontSize: '3rem', margin: 0 }}>{materia.name}</h1>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', maxWidth: '800px' }}>{materia.description}</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {asignaciones.map((asig, i) => (
          <motion.div 
            key={asig.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="glass glass-card"
            style={{ padding: '2rem', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}
          >
            <div style={{ 
              background: asig.type === 'examen' ? 'rgba(112,0,255,0.1)' : 'rgba(0,240,255,0.1)',
              border: asig.type === 'examen' ? '1px solid var(--secondary)' : '1px solid var(--primary)',
              padding: '1rem',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '100px'
            }}>
              {asig.type === 'examen' ? <Target size={32} color="var(--secondary)" /> : <FileText size={32} color="var(--primary)" />}
              <span style={{ fontSize: '0.8rem', marginTop: '8px', fontWeight: 'bold', textTransform: 'uppercase', color: asig.type === 'examen' ? 'var(--secondary)' : 'var(--primary)' }}>
                {asig.type}
              </span>
            </div>

            <div style={{ flex: 1 }}>
              <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>{asig.title}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                <Calendar size={16} /> {asig.date || 'Sin fecha asignada'}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>{asig.description}</p>
            </div>
          </motion.div>
        ))}

        {asignaciones.length === 0 && (
          <div className="glass" style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
            No se han subido deberes ni exámenes a esta materia aún.
          </div>
        )}
      </div>
    </motion.div>
  );
}
