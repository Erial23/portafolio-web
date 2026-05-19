'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Calendar, Book, ArrowLeft, Target, FolderOpen, List, ChevronDown, ChevronRight, MessagesSquare, Network, Brain, BadgeCheck, Cpu, Layers, Download, Maximize2, Laptop, PenTool } from 'lucide-react';
import Link from 'next/link';
import PDFModal from '@/app/components/PDFModal';

const deberesSubCategories = [
  { id: 'deber', title: 'Deber / Tarea', icon: <List size={28} /> },
  { id: 'consultas', title: 'Consultas', icon: <MessagesSquare size={28} /> },
  { id: 'ekos', title: 'Ekos', icon: <Network size={28} /> },
  { id: 'lectura_critica', title: 'Lectura Crítica Matemática', icon: <Brain size={28} /> },
  { id: 'excelentes', title: 'Excelentes', icon: <BadgeCheck size={28} /> },
  { id: 'talleres', title: 'Talleres', icon: <Cpu size={28} /> },
  { id: 'anexos', title: 'Anexos', icon: <Layers size={28} /> }
];

const categoryTitles = {
  'deber': 'Deber / Tarea',
  'consultas': 'Consultas (Deber)',
  'ekos': 'Ekos (Deber)',
  'lectura_critica': 'Lectura Crítica (Deber)',
  'excelentes': 'Excelentes (Deber)',
  'talleres': 'Talleres (Deber)',
  'anexos': 'Anexos (Deber)'
};

const deberesIds = ['consultas', 'ekos', 'lectura_critica', 'excelentes', 'talleres', 'anexos', 'deber'];

const getOrdinalSemana = (num) => {
  if (!num) return '';
  const ordinals = ["Primera", "Segunda", "Tercera", "Cuarta", "Quinta", "Sexta", "Séptima", "Octava", "Novena", "Décima", "Décima Primera", "Décima Segunda"];
  return ordinals[num - 1] || num;
};

export default function DeberesList() {
  const [asignaciones, setAsignaciones] = useState([]);
  const [materiasMap, setMateriasMap] = useState({});
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [activeParcial, setActiveParcial] = useState(null);
  const [activeWeek, setActiveWeek] = useState(null);
  const [activeCategory, setActiveCategory] = useState('deberes_root');
  const [openingFolder, setOpeningFolder] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);

  const subtopicTitles = {
    11: 'Generalidades de la lógica matemática',
    12: 'Aplicaciones de la Lógica Matemática',
    21: 'Generalidades de las funciones',
    22: 'Aplicaciones de las funciones',
    31: 'Generalidades de Límites',
    32: 'Aplicaciones de los Límites',
    41: 'Generalidades de la Derivada',
    42: 'Aplicaciones de la derivada'
  };

  useEffect(() => {
    setSelectedSubtopic(null);
  }, [activeCategory, activeWeek, activeParcial]);

  useEffect(() => {
    fetch('/api/materias')
      .then(res => res.json())
      .then(data => {
        const mapa = {};
        data.forEach(m => { mapa[m.id] = m.name });
        setMateriasMap(mapa);
        return fetch('/api/asignaciones');
      })
      .then(res => res.json())
      .then(data => {
        setAsignaciones(data.filter(d => deberesIds.includes(d.type)));
      });
  }, []);

  const handleFolderClick = (id) => {
    if (openingFolder) return;
    setOpeningFolder(id);
    setTimeout(() => {
      setActiveParcial(id);
      setOpeningFolder(null);
    }, 1400);
  };

  const isDeberesSub = deberesSubCategories.some(sub => sub.id === activeCategory);

  const filteredItems = asignaciones.filter(a => {
    const p = a.parcial || 1;
    if (p !== activeParcial) return false;

    if (activeWeek !== null) {
      if (activeCategory === 'consultas') {
        if (activeWeek === 2) {
          return a.semana === 2;
        } else {
          return a.semana === selectedSubtopic;
        }
      } else {
        const w = a.semana || 1;
        if (w !== activeWeek) return false;
      }
    }

    if (activeCategory !== 'deberes_root' && activeCategory !== 'deber') {
      return a.type === activeCategory;
    }

    return true;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ padding: '24px', background: 'var(--white)', borderRadius: '50%', color: 'var(--primary)', boxShadow: '0 10px 30px rgba(201,31,31,0.1)' }}>
            <FileText size={48} />
          </div>
        </div>
        <h1 className="gradient-text" style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 800 }}>Archivo de Deberes</h1>
        <p style={{ color: 'var(--foreground)', fontSize: '1.2rem', fontWeight: 500 }}>Explora todas tus tareas organizadas por parcial y semana.</p>
      </header>

      <AnimatePresence mode="wait">
        {!activeParcial ? (
          <motion.div
            key="parciales"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.4 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
          >
            <motion.h2
              animate={{ opacity: openingFolder ? 0 : 1, y: openingFolder ? -20 : 0 }}
              style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '4rem', fontSize: '2.5rem', fontWeight: 'bold' }}
            >
              ¿Qué parcial deseas consultar?
            </motion.h2>

            <div style={{ display: 'flex', gap: '4rem', justifyContent: 'center', flexWrap: 'wrap', perspective: '2000px' }}>
              {[
                { id: 1, title: 'PARCIAL I', theme: 'bento-pink' },
                { id: 2, title: 'PARCIAL II', theme: 'bento-red' }
              ].map(p => (
                <motion.div
                  key={p.id}
                  onClick={() => handleFolderClick(p.id)}
                  animate={{
                    scale: openingFolder === p.id ? 1.1 : 1,
                    opacity: openingFolder && openingFolder !== p.id ? 0 : 1,
                    y: openingFolder === p.id ? -20 : 0
                  }}
                  whileHover={!openingFolder ? { y: -15, scale: 1.03 } : {}}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{
                    width: '320px',
                    height: '240px',
                    position: 'relative',
                    cursor: openingFolder ? 'default' : 'pointer',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div
                    className={`bento-card ${p.theme}`}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '1.5rem', zIndex: 1, border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                  >
                    <h3 style={{ fontSize: '2.5rem', margin: 0, color: p.id === 1 ? "var(--primary)" : "var(--white)", fontWeight: 800 }}>{p.title}</h3>
                  </div>

                  <AnimatePresence>
                    {openingFolder === p.id && (
                      <>
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            initial={{ y: 20, opacity: 0, scale: 0.5, rotate: 0 }}
                            animate={{ y: -180 - (i * 40), opacity: 1, scale: 1, rotate: (i === 1 ? -15 : (i === 2 ? 20 : -5)) }}
                            transition={{ delay: 0.2 + (i * 0.15), type: 'spring', stiffness: 120, damping: 12 }}
                            style={{
                              position: 'absolute',
                              top: '10px',
                              left: '50%',
                              marginLeft: '-70px',
                              width: '140px',
                              height: '180px',
                              background: 'var(--white)',
                              borderRadius: '12px',
                              boxShadow: '0 15px 35px rgba(201,31,31,0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 2,
                              border: '1px solid rgba(201,31,31,0.1)'
                            }}
                          >
                            <div style={{ width: '80%', height: '80%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              <div style={{ width: '40%', height: '12px', background: 'var(--primary)', borderRadius: '4px', opacity: 0.8 }} />
                              <div style={{ width: '100%', height: '8px', background: 'var(--foreground)', borderRadius: '4px', opacity: 0.2 }} />
                              <div style={{ width: '80%', height: '8px', background: 'var(--foreground)', borderRadius: '4px', opacity: 0.2 }} />
                              <div style={{ width: '90%', height: '8px', background: 'var(--foreground)', borderRadius: '4px', opacity: 0.2 }} />
                              <Target size={32} color="var(--primary)" opacity={0.3} style={{ marginTop: 'auto', alignSelf: 'flex-end' }} />
                            </div>
                          </motion.div>
                        ))}
                      </>
                    )}
                  </AnimatePresence>

                  <motion.div
                    animate={{ rotateX: openingFolder === p.id ? -130 : 0 }}
                    transition={{ duration: 0.8, type: 'spring', stiffness: 70, damping: 14 }}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '65%',
                      background: 'var(--white)',
                      borderTopLeftRadius: '8px',
                      borderTopRightRadius: '8px',
                      borderBottomLeftRadius: '24px',
                      borderBottomRightRadius: '24px',
                      transformOrigin: 'bottom',
                      zIndex: 10,
                      boxShadow: '0 -10px 30px rgba(0,0,0,0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(201,31,31,0.05)',
                      backfaceVisibility: 'hidden'
                    }}
                  >
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(201,31,31,0.02)', transform: 'rotateY(180deg) translateZ(1px)', backfaceVisibility: 'hidden', borderRadius: 'inherit' }} />
                    <div style={{ position: 'absolute', top: '15px', width: '80px', height: '6px', background: 'rgba(201,31,31,0.2)', borderRadius: '10px' }} />
                    <img src="/carpeta.png" alt="Carpeta" style={{ width: '120px', height: '120px', objectFit: 'contain', zIndex: 2 }} />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="deberes-dashboard"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ display: 'flex', gap: '3rem', maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}
          >
            {/* Sidebar similar a materia detail */}
            <div style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <motion.button
                whileHover={{ x: -5 }}
                onClick={() => { setActiveParcial(null); setActiveWeek(null); setActiveCategory('deberes_root'); }}
                className="btn-outline"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--primary)', padding: '10px 15px', background: 'var(--white)', border: 'none', boxShadow: '0 5px 15px rgba(201,31,31,0.1)' }}
              >
                <ArrowLeft size={16} /> REGRESAR A PARCIALES
              </motion.button>

              {activeWeek && (
                <motion.button
                  whileHover={{ x: -5 }}
                  onClick={() => { setActiveWeek(null); if (activeCategory !== 'consultas') setActiveCategory('deberes_root'); }}
                  className="btn-pill"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--white)', padding: '10px 15px', background: 'var(--primary)', border: 'none', boxShadow: '0 5px 15px rgba(201,31,31,0.2)' }}
                >
                  {activeCategory === 'consultas' ? <ArrowLeft size={16} /> : <Calendar size={16} />} {activeCategory === 'consultas' ? 'REGRESAR' : 'CAMBIAR SEMANA'}
                </motion.button>
              )}

              {selectedSubtopic && (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: -5 }}
                  onClick={() => setSelectedSubtopic(null)}
                  className="btn-outline"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--primary)', padding: '10px 15px', background: 'var(--white)', border: 'none', boxShadow: '0 5px 15px rgba(201,31,31,0.1)', marginTop: '0.5rem' }}
                >
                  <ArrowLeft size={16} /> REGRESAR A UNIDADES
                </motion.button>
              )}

              <div className="bento-card bento-white" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', position: 'sticky', top: '100px', border: 'none' }}>
                <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary)', marginBottom: '1rem', fontWeight: 800, paddingLeft: '10px' }}>
                  {activeCategory === 'consultas' 
                    ? `PARCIAL ${activeParcial} - ${activeWeek ? (activeWeek === 2 ? 'A MANO' : 'A COMPUTADORA') : 'FORMATO'}`
                    : `PARCIAL ${activeParcial} ${activeWeek ? `- SEMANA ${getOrdinalSemana(activeWeek).toUpperCase()}` : ''}`
                  }
                </h3>

                <button
                  onClick={() => setActiveCategory('deberes_root')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 15px', borderRadius: '16px',
                    background: activeCategory === 'deberes_root' ? 'var(--secondary)' : 'transparent',
                    color: activeCategory === 'deberes_root' ? 'var(--primary)' : 'var(--foreground)',
                    border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: activeCategory === 'deberes_root' ? 800 : 600,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <List size={18} /> Todos los Deberes
                </button>

                {deberesSubCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 15px', borderRadius: '16px',
                      background: activeCategory === cat.id ? 'var(--secondary)' : 'transparent',
                      color: activeCategory === cat.id ? 'var(--primary)' : 'var(--foreground)',
                      border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: activeCategory === cat.id ? 800 : 600,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {cat.icon} {cat.title}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <AnimatePresence mode="wait">
                {!activeWeek ? (
                  <motion.div
                    key="semana-selector"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <h2 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '3rem', fontSize: '2.5rem', fontWeight: 800 }}>
                      {activeCategory === 'consultas' ? 'Selecciona el formato' : 'Selecciona una semana'}
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2.5rem', justifyContent: 'center' }}>
                      {activeCategory === 'consultas' ? (
                        [
                          { n: 1, t: 'A COMPUTADORA', icon: <Laptop size={72} color="var(--primary)" /> },
                          { n: 2, t: 'A MANO', icon: <PenTool size={72} color="var(--primary)" /> }
                        ].map(w => (
                          <motion.div
                            key={w.n}
                            whileHover={{ y: -10, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveWeek(w.n)}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem', cursor: 'pointer' }}
                          >
                            <div style={{ width: '220px', height: '220px', background: 'rgba(255, 255, 255, 0.9)', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(201,31,31,0.12)', border: '1px solid rgba(201,31,31,0.05)', backdropFilter: 'blur(10px)', position: 'relative', overflow: 'hidden' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', padding: '20px', zIndex: 2 }}>
                                {w.icon}
                              </div>
                              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(201,31,31,0.05) 0%, transparent 75%)', zIndex: 1 }} />
                            </div>
                            <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>
                              {w.t}
                            </span>
                          </motion.div>
                        ))
                      ) : (
                        (activeParcial === 1 ? [
                          { n: 1, t: 'Primera Semana', gif: 'https://media1.tenor.com/m/GvP7L0FwFyMAAAAC/dancing-number-dancing-letter.gif' },
                          { n: 2, t: 'Segunda Semana', gif: 'https://media1.tenor.com/m/J-MYuLM6fXUAAAAC/dancing-number-dancing-letter.gif' },
                          { n: 3, t: 'Tercera Semana', gif: 'https://media1.tenor.com/m/o96-hgLmCQ0AAAAC/dancing-number-dancing-letter.gif' },
                          { n: 4, t: 'Cuarta Semana', gif: 'https://media1.tenor.com/m/G4W1KBzAoQsAAAAC/dancing-number-dancing-letter.gif' },
                          { n: 5, t: 'Quinta Semana', gif: 'https://media1.tenor.com/m/JD-y9a5fHBsAAAAC/dancing-number-dancing-letter.gif' },
                          { n: 6, t: 'Sexta Semana', gif: 'https://media1.tenor.com/m/Vj1qjksWYvcAAAAC/dancing-number-dancing-letter.gif' },
                          { n: 7, t: 'Séptima Semana', gif: 'https://media1.tenor.com/m/6-3dxjy6qSMAAAAC/dancing-number-dancing-letter.gif' }
                        ] : [
                          { n: 8, t: 'Octava Semana', gif: 'https://media1.tenor.com/m/d3HlvsnflX0AAAAC/dancing-number-dancing-letter.gif' },
                          { n: 9, t: 'Novena Semana', gif: 'https://media1.tenor.com/m/i0x1-y8QubAAAAAC/dancing-number-dancing-letter.gif' },
                          { n: 10, t: 'Décima Semana', gif: ['https://media1.tenor.com/m/GvP7L0FwFyMAAAAC/dancing-number-dancing-letter.gif', 'https://media1.tenor.com/m/DtNdi4Bzj_UAAAAC/dancing-number-dancing-letter.gif'] },
                          { n: 11, t: 'Décima Primera', gif: ['https://media1.tenor.com/m/GvP7L0FwFyMAAAAC/dancing-number-dancing-letter.gif', 'https://media1.tenor.com/m/GvP7L0FwFyMAAAAC/dancing-number-dancing-letter.gif'] },
                          { n: 12, t: 'Décima Segunda', gif: ['https://media1.tenor.com/m/GvP7L0FwFyMAAAAC/dancing-number-dancing-letter.gif', 'https://media1.tenor.com/m/J-MYuLM6fXUAAAAC/dancing-number-dancing-letter.gif'] }
                        ]).map(w => (
                          <motion.div
                            key={w.n}
                            whileHover={{ y: -10, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveWeek(w.n)}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem', cursor: 'pointer' }}
                          >
                            <div style={{ width: '180px', height: '180px', background: 'rgba(255, 255, 255, 0.9)', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(201,31,31,0.12)', border: '1px solid rgba(201,31,31,0.05)', backdropFilter: 'blur(10px)', position: 'relative', overflow: 'hidden' }}>
                              <div style={{ display: 'flex', gap: '2px', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', padding: '10px' }}>
                                {Array.isArray(w.gif) ? (
                                  w.gif.map((g, idx) => (
                                    <img key={idx} src={g} alt={`Semana ${w.n} digit ${idx}`} style={{ width: '50%', height: '100%', objectFit: 'contain', zIndex: 2 }} />
                                  ))
                                ) : (
                                  <img src={w.gif} alt={`Semana ${w.n}`} style={{ width: '110%', height: '110%', objectFit: 'contain', zIndex: 2 }} />
                                )}
                              </div>
                              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(201,31,31,0.03) 0%, transparent 70%)', zIndex: 1 }} />
                            </div>
                            <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>
                              Semana {getOrdinalSemana(w.n)}
                            </span>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="items-list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '2px solid rgba(201,31,31,0.1)', flexWrap: 'wrap', gap: '1rem' }}>
                      <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ color: 'var(--secondary)' }}>/</span> {categoryTitles[activeCategory] || 'Todos los Deberes'}
                        {activeWeek && (
                          <span style={{ fontSize: '1.2rem', background: 'var(--secondary)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '10px' }}>
                            {activeCategory === 'consultas' 
                              ? (activeWeek === 2 
                                  ? 'A Mano' 
                                  : (selectedSubtopic 
                                      ? `A Computadora - ${subtopicTitles[selectedSubtopic]}` 
                                      : 'A Computadora'
                                    )
                                )
                              : `Semana ${getOrdinalSemana(activeWeek)}`
                            }
                          </span>
                        )}
                      </h2>

                      {/* Navigation buttons */}
                      {activeWeek && (
                        <div style={{ display: 'flex', gap: '10px' }}>
                          {activeCategory === 'consultas' ? (
                            <>
                              <button
                                onClick={() => setActiveWeek(1)}
                                className="btn-outline"
                                style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', opacity: activeWeek === 1 ? 0.5 : 1, pointerEvents: activeWeek === 1 ? 'none' : 'auto' }}
                              >
                                A Computadora
                              </button>
                              <button
                                onClick={() => setActiveWeek(2)}
                                className="btn-outline"
                                style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', opacity: activeWeek === 2 ? 0.5 : 1, pointerEvents: activeWeek === 2 ? 'none' : 'auto' }}
                              >
                                A Mano
                              </button>
                            </>
                          ) : (
                            <>
                              {activeWeek > 1 && (
                                <button
                                  onClick={() => {
                                    const prevW = activeWeek - 1;
                                    setActiveWeek(prevW);
                                    if (prevW <= 7) {
                                      setActiveParcial(1);
                                    } else {
                                      setActiveParcial(2);
                                    }
                                  }}
                                  className="btn-outline"
                                  style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                                >
                                  Semana Anterior
                                </button>
                              )}
                              {activeWeek < 12 && (
                                <button
                                  onClick={() => {
                                    const nextW = activeWeek + 1;
                                    setActiveWeek(nextW);
                                    if (nextW <= 7) {
                                      setActiveParcial(1);
                                    } else {
                                      setActiveParcial(2);
                                    }
                                  }}
                                  className="btn-outline"
                                  style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                                >
                                  Siguiente Semana
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {activeCategory === 'consultas' && activeWeek === 1 && selectedSubtopic === null ? (
                      <div style={{ padding: '1rem 0' }}>
                        <h2 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '3rem', fontSize: '2.5rem', fontWeight: 800 }}>
                          {activeParcial === 1 ? 'Primer Parcial' : 'Segundo Parcial'} - Unidades A Computadora
                        </h2>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
                          {activeParcial === 1 ? (
                            <>
                              {/* UNIDAD 1 */}
                              <motion.div whileHover={{ y: -5 }} className="bento-card bento-white" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(201,31,31,0.05)' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', background: 'rgba(201, 31, 31, 0.1)', color: 'var(--primary)', alignSelf: 'flex-start', letterSpacing: '1px' }}>UNIDAD 1</span>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)', margin: 0 }}>Lógica Matemática</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                                  <button onClick={() => setSelectedSubtopic(11)} className="btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', textAlign: 'left', width: '100%', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 600 }}>
                                    <span>Generalidades de la lógica matemática</span>
                                    <ChevronRight size={16} />
                                  </button>
                                  <button onClick={() => setSelectedSubtopic(12)} className="btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', textAlign: 'left', width: '100%', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 600 }}>
                                    <span>Aplicaciones de la Lógica Matemática</span>
                                    <ChevronRight size={16} />
                                  </button>
                                </div>
                              </motion.div>

                              {/* UNIDAD 2 */}
                              <motion.div whileHover={{ y: -5 }} className="bento-card bento-white" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(201,31,31,0.05)' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', background: 'rgba(201, 31, 31, 0.1)', color: 'var(--primary)', alignSelf: 'flex-start', letterSpacing: '1px' }}>UNIDAD 2</span>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)', margin: 0 }}>Funciones</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                                  <button onClick={() => setSelectedSubtopic(21)} className="btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', textAlign: 'left', width: '100%', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 600 }}>
                                    <span>Generalidades de las funciones</span>
                                    <ChevronRight size={16} />
                                  </button>
                                  <button onClick={() => setSelectedSubtopic(22)} className="btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', textAlign: 'left', width: '100%', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 600 }}>
                                    <span>Aplicaciones de las funciones</span>
                                    <ChevronRight size={16} />
                                  </button>
                                </div>
                              </motion.div>
                            </>
                          ) : (
                            <>
                              {/* UNIDAD 3 */}
                              <motion.div whileHover={{ y: -5 }} className="bento-card bento-white" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(201,31,31,0.05)' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', background: 'rgba(201, 31, 31, 0.1)', color: 'var(--primary)', alignSelf: 'flex-start', letterSpacing: '1px' }}>UNIDAD 3</span>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)', margin: 0 }}>Límites</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                                  <button onClick={() => setSelectedSubtopic(31)} className="btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', textAlign: 'left', width: '100%', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 600 }}>
                                    <span>Generalidades de Límites</span>
                                    <ChevronRight size={16} />
                                  </button>
                                  <button onClick={() => setSelectedSubtopic(32)} className="btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', textAlign: 'left', width: '100%', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 600 }}>
                                    <span>Aplicaciones de los Límites</span>
                                    <ChevronRight size={16} />
                                  </button>
                                </div>
                              </motion.div>

                              {/* UNIDAD 4 */}
                              <motion.div whileHover={{ y: -5 }} className="bento-card bento-white" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(201,31,31,0.05)' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', background: 'rgba(201, 31, 31, 0.1)', color: 'var(--primary)', alignSelf: 'flex-start', letterSpacing: '1px' }}>UNIDAD 4</span>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)', margin: 0 }}>Derivadas</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                                  <button onClick={() => setSelectedSubtopic(41)} className="btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', textAlign: 'left', width: '100%', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 600 }}>
                                    <span>Generalidades de la Derivada</span>
                                    <ChevronRight size={16} />
                                  </button>
                                  <button onClick={() => setSelectedSubtopic(42)} className="btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', textAlign: 'left', width: '100%', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 600 }}>
                                    <span>Aplicaciones de la derivada</span>
                                    <ChevronRight size={16} />
                                  </button>
                                </div>
                              </motion.div>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      <AnimatePresence mode='popLayout'>
                        {filteredItems.map((asig, i) => {
                          const isImage = asig.file_url?.match(/\.(jpeg|jpg|gif|png|webp|bmp)$/i) != null;
                          return (
                            <motion.div
                              layout
                              key={asig.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.4, delay: i * 0.1 }}
                              className="bento-card bento-white"
                              style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', padding: '2.5rem' }}
                            >
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                                  <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>{asig.title}</h3>
                                  <Link href={`/materias/${asig.materia_id}`}>
                                    <span className="badge-pill pink" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <Book size={14} /> {materiasMap[asig.materia_id] || 'Materia'}
                                    </span>
                                  </Link>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--foreground)', opacity: 0.7 }}>
                                  <Calendar size={18} /> Fecha: {asig.date || 'Sin fecha'}
                                </div>
                                <p style={{ lineHeight: '1.6', marginBottom: asig.file_url ? '1.5rem' : '0', fontWeight: 500, color: 'var(--foreground)' }}>{asig.description}</p>
                                
                                {asig.file_url && (
                                  <button 
                                    onClick={() => setSelectedPdf({ url: asig.file_url, title: asig.title })}
                                    className="btn-pill" 
                                    style={{ fontSize: '0.9rem', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
                                  >
                                    <Download size={16} /> ABRIR DOCUMENTO
                                  </button>
                                )}
                              </div>

                              {asig.file_url && (
                                <div style={{ flex: 1, minWidth: '300px', height: isImage ? 'auto' : '280px', display: 'flex', justifyContent: 'center', position: 'relative', borderRadius: '16px', border: '2px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', overflow: 'hidden', background: '#fff' }}>
                                  {isImage ? (
                                    <img src={asig.file_url} alt={asig.title} style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }} onClick={() => setSelectedPdf({ url: asig.file_url, title: asig.title })} />
                                  ) : (
                                    <iframe src={`${asig.file_url}#toolbar=0&navpanes=0`} style={{ width: '100%', height: '100%', border: 'none' }} />
                                  )}
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => { e.stopPropagation(); setSelectedPdf({ url: asig.file_url, title: asig.title }); }}
                                    style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--primary)', color: 'var(--white)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.2)', zIndex: 20 }}
                                  >
                                    <Maximize2 size={18} />
                                  </motion.button>
                                </div>
                              )}
                            </motion.div>
                          );
                        })}

                        {filteredItems.length === 0 && (
                          <div className="bento-card bento-pink" style={{ padding: '6rem 2rem', textAlign: 'center', color: 'var(--primary)' }}>
                            <FolderOpen size={48} style={{ margin: '0 auto 1.5rem' }} />
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 800 }}>No hay deberes registrados</h3>
                            <p style={{ fontWeight: 600 }}>No se encontraron archivos para esta selección.</p>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PDFModal 
        url={selectedPdf?.url} 
        title={selectedPdf?.title} 
        onClose={() => setSelectedPdf(null)} 
      />
    </motion.div>
  );
}

