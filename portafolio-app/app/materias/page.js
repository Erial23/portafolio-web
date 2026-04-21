'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function MateriasList() {
  const [materias, setMaterias] = useState([]);

  useEffect(() => {
    fetch('/api/materias')
      .then(res => res.json())
      .then(data => setMaterias(data));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 className="gradient-text glow-text" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Archivo Semestral</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem' }}>Explora el contenido de las materias impartidas.</p>
      </header>

      <div className="grid-3">
        {materias.map((materia, i) => (
          <motion.div 
            key={materia.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link href={`/materias/${materia.id}`}>
              <div className="glass glass-card" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ padding: '12px', background: 'rgba(0, 240, 255, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}>
                    <BookOpen size={24} />
                  </div>
                  <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{materia.name}</h2>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.6)', flex: 1, marginBottom: '2rem', lineHeight: '1.6' }}>
                  {materia.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--primary)', fontWeight: 'bold' }}>
                  Ver Contenido <ChevronRight size={18} style={{ marginLeft: '4px' }} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      
      {materias.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.5)' }}>
          Aún no se han publicado materias en este semestre.
        </div>
      )}
    </motion.div>
  );
}
