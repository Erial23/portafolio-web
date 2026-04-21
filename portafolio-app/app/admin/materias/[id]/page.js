'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, ArrowLeft, BookOpen, Clock } from 'lucide-react';
import Link from 'next/link';

export default function GestionMateria({ params }) {
  const { id } = use(params);
  
  const [asignaciones, setAsignaciones] = useState([]);
  const [newAsignacion, setNewAsignacion] = useState({ materia_id: id, type: 'deber', title: '', description: '', date: '' });

  const fetchAsignaciones = async () => {
    const res = await fetch(`/api/asignaciones?materiaId=${id}`);
    const data = await res.json();
    setAsignaciones(data);
  };

  useEffect(() => {
    fetchAsignaciones();
  }, [id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newAsignacion.title) return;
    await fetch('/api/asignaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAsignacion)
    });
    setNewAsignacion({ ...newAsignacion, title: '', description: '', date: '' });
    fetchAsignaciones();
  };

  const handleDelete = async (asignacionId) => {
    if(!confirm('¿Eliminar registro?')) return;
    await fetch(`/api/asignaciones/${asignacionId}`, { method: 'DELETE' });
    fetchAsignaciones();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <Link href="/admin">
          <button className="btn-outline" style={{ padding: '8px', display: 'flex' }}><ArrowLeft size={20} /></button>
        </Link>
        <h1 className="gradient-text">Gestionar Actividades (Materia ID: {id})</h1>
      </header>

      <section className="glass" style={{ padding: '2rem', marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}><Plus size={24} style={{ verticalAlign: 'middle' }} /> Añadir Registro</h2>
        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <select 
            className="input-tech" 
            value={newAsignacion.type}
            onChange={(e) => setNewAsignacion({...newAsignacion, type: e.target.value})}
          >
            <option value="deber">Deber / Tarea</option>
            <option value="examen">Examen / Evaluación</option>
          </select>
          <input 
            className="input-tech" 
            type="date"
            value={newAsignacion.date}
            onChange={(e) => setNewAsignacion({...newAsignacion, date: e.target.value})}
          />
          <input 
            className="input-tech" 
            style={{ gridColumn: 'span 2' }}
            placeholder="Título (ej. Proyecto Final)" 
            value={newAsignacion.title}
            onChange={(e) => setNewAsignacion({...newAsignacion, title: e.target.value})}
          />
          <textarea 
            className="input-tech" 
            style={{ gridColumn: 'span 2', minHeight: '100px' }}
            placeholder="Descripción detallada de la actividad..." 
            value={newAsignacion.description}
            onChange={(e) => setNewAsignacion({...newAsignacion, description: e.target.value})}
          />
          <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2' }}>Guardar Actividad</button>
        </form>
      </section>

      <h2 style={{ marginBottom: '1.5rem' }}>Registro Académico</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {asignaciones.map(asig => (
          <div key={asig.id} className="glass" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ 
                  background: asig.type === 'examen' ? 'rgba(112, 0, 255, 0.2)' : 'rgba(0, 240, 255, 0.2)',
                  color: asig.type === 'examen' ? 'var(--secondary)' : 'var(--primary)',
                  padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase'
                }}>
                  {asig.type}
                </span>
                <h3 style={{ margin: 0 }}>{asig.title}</h3>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0.5rem 0', fontSize: '0.9rem' }}>{asig.description}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--primary)' }}>
                <Clock size={14} /> {asig.date || 'Sin fecha'}
              </div>
            </div>
            <button onClick={() => handleDelete(asig.id)} className="btn-outline" style={{ borderColor: '#ff3366', color: '#ff3366', padding: '10px' }}>
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        {asignaciones.length === 0 && <p style={{ color: 'rgba(255,255,255,0.5)' }}>No hay actividades registradas.</p>}
      </div>
    </motion.div>
  );
}
