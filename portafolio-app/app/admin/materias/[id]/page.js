'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, ArrowLeft, BookOpen, Clock, AlertTriangle, Upload, Pencil, X, FileText, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ConfirmDialog from '../../../components/ConfirmDialog';

export default function GestionMateria({ params }) {
  const { id } = use(params);
  
  const [asignaciones, setAsignaciones] = useState([]);
  const [newAsignacion, setNewAsignacion] = useState({ materia_id: id, type: 'deber', title: '', description: '', date: '', parcial: 1, semana: 1 });
  const [asignacionFile, setAsignacionFile] = useState(null);
  const [editingAsignacion, setEditingAsignacion] = useState(null);
  const [removeFileFlag, setRemoveFileFlag] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // State for Confirmation Dialog
  const [confirmConfig, setConfirmConfig] = useState({ 
    isOpen: false, 
    title: '', 
    message: '', 
    onConfirm: () => {} 
  });

  const fetchAsignaciones = async () => {
    const res = await fetch(`/api/asignaciones?materiaId=${id}`);
    const data = await res.json();
    setAsignaciones(data);
  };

  useEffect(() => {
    const checkSession = async () => {
      const res = await fetch('/api/auth');
      if (res.ok) {
        setIsAuthenticated(true);
        fetchAsignaciones();
      } else {
        router.push('/admin');
      }
    };
    checkSession();
  }, [id, router]);
  
  const uploadFile = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    return data.url;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newAsignacion.title) return;
    
    let file_url = await uploadFile(asignacionFile);
    
    await fetch('/api/asignaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newAsignacion, file_url })
    });
    setNewAsignacion({ ...newAsignacion, title: '', description: '', date: '' });
    setAsignacionFile(null);
    fetchAsignaciones();
    toast.success('Actividad guardada con éxito');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!newAsignacion.title || !editingAsignacion) return;

    let file_url = asignacionFile ? await uploadFile(asignacionFile) : (removeFileFlag ? null : editingAsignacion.file_url);

    await fetch(`/api/asignaciones/${editingAsignacion.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newAsignacion, file_url })
    });

    setEditingAsignacion(null);
    setRemoveFileFlag(false);
    setNewAsignacion({ materia_id: id, type: 'deber', title: '', description: '', date: '', parcial: 1, semana: 1 });
    setAsignacionFile(null);
    fetchAsignaciones();
    toast.success('Registro actualizado correctamente');
  };

  const startEdit = (asig) => {
    setEditingAsignacion(asig);
    setRemoveFileFlag(false);
    setNewAsignacion({ 
      materia_id: asig.materia_id, 
      type: asig.type, 
      title: asig.title, 
      description: asig.description || '', 
      date: asig.date || '',
      parcial: asig.parcial || 1,
      semana: asig.semana || 1
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (asignacionId) => {
    setConfirmConfig({
      isOpen: true,
      title: '¿Eliminar registro?',
      message: '¿Estás seguro de que deseas borrar este registro académico?',
      onConfirm: async () => {
        try {
          await fetch(`/api/asignaciones/${asignacionId}`, { method: 'DELETE' });
          fetchAsignaciones();
          toast.success('Registro eliminado');
        } catch (err) {
          toast.error('Error al eliminar');
        }
      }
    });
  };
  
  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
      toast.success('Sesión cerrada');
      router.push('/admin');
    } catch (err) {
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Global Confirm Dialog */}
      <ConfirmDialog 
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={confirmConfig.onConfirm}
      />

      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/admin">
            <button className="btn-outline" style={{ padding: '8px', display: 'flex' }}><ArrowLeft size={20} /></button>
          </Link>
          <h1 className="gradient-text">Gestionar Actividades</h1>
        </div>
        <button 
          className="btn-outline" 
          onClick={handleLogout}
          style={{ borderColor: 'rgba(255,51,102,0.3)', color: '#ff3366', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Lock size={16} /> Cerrar Sesión
        </button>
      </header>

      <section className="glass" style={{ padding: '2rem', marginBottom: '3rem', border: editingAsignacion ? '1px solid var(--primary)' : '' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: 'var(--primary)', margin: 0 }}>
            {editingAsignacion ? 'Editar Registro' : 'Añadir Actividad'}
          </h2>
          {editingAsignacion && (
            <button onClick={() => { setEditingAsignacion(null); setRemoveFileFlag(false); setNewAsignacion({ materia_id: id, type: 'deber', title: '', description: '', date: '', parcial: 1, semana: 1 }); }} className="btn-outline" style={{ padding: '5px 12px', fontSize: '0.8rem', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
              <X size={14} style={{ marginRight: '5px' }}/> Cancelar Edición
            </button>
          )}
        </div>
        <form onSubmit={editingAsignacion ? handleUpdate : handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <select 
            className="input-tech" 
            value={newAsignacion.type}
            onChange={(e) => setNewAsignacion({...newAsignacion, type: e.target.value})}
          >
            <option value="materia">Contenido Materia</option>
            <option value="examen">Examen / Evaluación</option>
            <option value="apes">APES</option>
            <option value="deber">Deber / Tarea</option>
            <option value="consultas">Consulta</option>
            <option value="talleres">Taller</option>
          </select>
          <input 
            className="input-tech" 
            type="date"
            value={newAsignacion.date}
            onChange={(e) => setNewAsignacion({...newAsignacion, date: e.target.value})}
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select 
              className="input-tech" 
              style={{ flex: 1 }}
              value={newAsignacion.parcial}
              onChange={(e) => setNewAsignacion({...newAsignacion, parcial: parseInt(e.target.value)})}
            >
              <option value="1">Parcial I</option>
              <option value="2">Parcial II</option>
            </select>
            <select 
              className="input-tech" 
              style={{ flex: 1 }}
              value={newAsignacion.semana}
              onChange={(e) => setNewAsignacion({...newAsignacion, semana: parseInt(e.target.value)})}
            >
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(w => {
                const ordinals = ["Primera", "Segunda", "Tercera", "Cuarta", "Quinta", "Sexta", "Séptima", "Octava", "Novena", "Décima", "Décima Primera", "Décima Segunda"];
                return (
                  <option key={w} value={w}>Semana {ordinals[w-1]}</option>
                );
              })}
            </select>
          </div>
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
          
          <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '10px 16px', borderRadius: '8px', border: '1px dashed var(--primary)' }}>
              <Upload size={18} color="var(--primary)" />
              <span style={{ fontSize: '0.9rem', color: 'white' }}>{asignacionFile ? asignacionFile.name : 'Adjuntar PDF'}</span>
              <input type="file" style={{ display: 'none' }} accept=".pdf,.zip,.rar" onChange={(e) => { setAsignacionFile(e.target.files[0]); setRemoveFileFlag(false); }} />
            </label>

            {editingAsignacion && editingAsignacion.file_url && !removeFileFlag && !asignacionFile && (
              <button type="button" onClick={() => setRemoveFileFlag(true)} className="btn-outline" style={{ borderColor: '#ff3366', color: '#ff3366', padding: '10px 16px', fontSize: '0.9rem' }}>
                <Trash2 size={16} style={{ marginRight: '5px' }}/> {editingAsignacion.type === 'materia' ? 'Borrar archivo materia' : 'Borrar documento'}
              </button>
            )}

            {removeFileFlag && (
              <span style={{ color: '#ff3366', fontSize: '0.85rem', flex: 1 }}>Archivo marcado para eliminación</span>
            )}

            <button type="submit" className="btn-primary" style={{ marginLeft: 'auto' }}>
              {editingAsignacion ? 'Guardar Cambios' : 'Guardar Actividad'}
            </button>
          </div>
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
                <div className="badge-pill pink" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>P{asig.parcial} - S{asig.semana}</div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0.5rem 0', fontSize: '0.9rem' }}>{asig.description}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--primary)' }}>
                <Clock size={14} /> {asig.date || 'Sin fecha'}
              </div>
              {asig.file_url && <a href={asig.file_url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '5px', fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'underline' }}>Ver archivo adjunto</a>}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => startEdit(asig)} className="btn-outline" style={{ padding: '8px' }}><Pencil size={18} /></button>
              <button onClick={() => handleDelete(asig.id)} className="btn-outline" style={{ borderColor: '#ff3366', color: '#ff3366', padding: '8px' }}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {asignaciones.length === 0 && <p style={{ color: 'rgba(255,255,255,0.5)' }}>No hay actividades registradas.</p>}
      </div>
    </motion.div>
  );
}
