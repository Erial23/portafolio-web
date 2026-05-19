'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Plus, Trash2, FolderEdit, Upload, FileText, X, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import ConfirmDialog from '../components/ConfirmDialog';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [materias, setMaterias] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);

  const [newMateria, setNewMateria] = useState({ name: '', description: '' });
  const [materiaFile, setMateriaFile] = useState(null);

  const [newAsignacion, setNewAsignacion] = useState({ materia_id: '', type: 'materia', title: '', description: '', date: '', parcial: 1, semana: 1 });
  const [asignacionFile, setAsignacionFile] = useState(null);

  const [editingMateria, setEditingMateria] = useState(null);
  const [editingAsignacion, setEditingAsignacion] = useState(null);
  const [removeFileFlag, setRemoveFileFlag] = useState(false);

  const [tab, setTab] = useState('materias'); // materias, registros

  // State for Confirmation Dialog
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { }
  });

  const fetchData = async () => {
    const resM = await fetch('/api/materias');
    const dataM = await resM.json();
    setMaterias(dataM);

    const resA = await fetch('/api/asignaciones');
    const dataA = await resA.json();
    setAsignaciones(dataA);
  };

  useEffect(() => {
    // Check session on mount
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
            fetchData();
          }
        }
      } catch (err) {
        console.error('Error checking session', err);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        setIsAuthenticated(true);
        setError('');
      } else {
        const data = await res.json();
        setError(data.error || 'Credenciales incorrectas.');
      }
    } catch (err) {
      setError('Error de conexión.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
      toast.success('Sesión cerrada correctamente');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      toast.error('Error al cerrar sesión');
    }
  };
  const uploadFile = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    return data.url; // url string
  };

  const handleCreateMateria = async (e) => {
    e.preventDefault();
    if (!newMateria.name) return;

    let file_url = await uploadFile(materiaFile);

    await fetch('/api/materias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newMateria, file_url })
    });
    setNewMateria({ name: '', description: '' });
    setMateriaFile(null);
    fetchData();
    toast.success('Materia creada correctamente');
  };

  const handleUpdateMateria = async (e) => {
    e.preventDefault();
    if (!newMateria.name || !editingMateria) return;

    let file_url = materiaFile ? await uploadFile(materiaFile) : editingMateria.file_url;

    await fetch(`/api/materias/${editingMateria.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newMateria, file_url })
    });

    setEditingMateria(null);
    setRemoveFileFlag(false);
    setNewMateria({ name: '', description: '' });
    setMateriaFile(null);
    fetchData();
    toast.success('Materia actualizada con éxito');
  };

  const startEditMateria = (materia) => {
    setTab('materias');
    setEditingMateria(materia);
    setNewMateria({ name: materia.name, description: materia.description });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteMateria = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: '¿Eliminar Materia?',
      message: 'Esta acción eliminará permanentemente la materia y todo su contenido relacionado. ¿Estás seguro?',
      onConfirm: async () => {
        try {
          await fetch(`/api/materias/${id}`, { method: 'DELETE' });
          fetchData();
          toast.success('Materia eliminada con éxito');
        } catch (err) {
          toast.error('Error al eliminar la materia');
        }
      }
    });
  };

  const handleCreateAsignacion = async (e) => {
    e.preventDefault();

    if (!newAsignacion.title || !newAsignacion.materia_id) {
      return toast.error('Título y Materia son obligatorios');
    }

    let file_url = asignacionFile ? await uploadFile(asignacionFile) : (newAsignacion.external_link || null);

    await fetch('/api/asignaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newAsignacion, file_url })
    });

    setNewAsignacion({ materia_id: newAsignacion.materia_id, type: newAsignacion.type, title: '', description: '', date: '', parcial: newAsignacion.parcial, semana: newAsignacion.semana });
    setAsignacionFile(null);
    fetchData();
    toast.success('¡Registro añadido con éxito!');
  };

  const handleUpdateAsignacion = async (e) => {
    e.preventDefault();
    if (!newAsignacion.title || !editingAsignacion) return;

    let file_url = asignacionFile ? await uploadFile(asignacionFile) : (removeFileFlag ? null : (newAsignacion.external_link || editingAsignacion.file_url));

    await fetch(`/api/asignaciones/${editingAsignacion.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newAsignacion, file_url })
    });

    setEditingAsignacion(null);
    setRemoveFileFlag(false);
    setNewAsignacion({ materia_id: '', type: 'materia', title: '', description: '', date: '', parcial: 1, semana: 1 });
    setAsignacionFile(null);
    fetchData();
    toast.success('Registro actualizado correctamente');
  };

  const startEditAsignacion = (asig) => {
    setTab('registros');
    setEditingAsignacion(asig);
    setRemoveFileFlag(false);
    setNewAsignacion({
      materia_id: asig.materia_id,
      type: asig.type || 'materia',
      title: asig.title,
      description: asig.description || '',
      date: asig.date || '',
      parcial: asig.parcial || 1,
      semana: asig.semana || 1,
      external_link: asig.file_url || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteAsignacion = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: '¿Confirmar eliminación?',
      message: '¿Estás seguro de que deseas eliminar este registro?',
      onConfirm: async () => {
        try {
          await fetch(`/api/asignaciones/${id}`, { method: 'DELETE' });
          fetchData();
          toast.success('Registro eliminado');
        } catch (err) {
          toast.error('Error al eliminar el registro');
        }
      }
    });
  };

  const typeNameMap = {
    'materia': 'Materia',
    'examenes': 'Exámenes',
    'video_tabla': 'VIDEOS',
    'apes': 'APES',
    'emprendimiento': 'Emprendimiento',
    'consultas': 'Consultas',
    'ekos': 'Ekos',
    'lectura_critica': 'Lectura Crítica Matemática',
    'excelentes': 'Excelentes',
    'talleres': 'Talleres',
    'anexos': 'Anexos',
    'pruebas_escritas': 'Pruebas Escritas',
    'pruebas_domingo': 'Pruebas Domingo',
    'examenes_finales': 'Exámenes Finales',
    'examen': 'Examen (Antiguo)',
    'deber': 'Deber (Antiguo)',
    'deberes': 'Deberes (General)',
    'deberes_root': 'Deberes (General)'
  };

  const deberesIds = ['deber', 'deberes', 'deberes_root', 'consultas', 'ekos', 'lectura_critica', 'excelentes', 'talleres', 'anexos'];
  const isDeberes = deberesIds.includes(newAsignacion.type);

  const subtopicShortTitles = {
    11: 'U1 Generalidades',
    12: 'U1 Aplicaciones',
    21: 'U2 Generalidades',
    22: 'U2 Aplicaciones',
    31: 'U3 Generalidades',
    32: 'U3 Aplicaciones',
    41: 'U4 Generalidades',
    42: 'U4 Aplicaciones'
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '1rem' }}>
        <style jsx global>{`
          html, body {
            overflow-y: auto !important;
            height: auto !important;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          ::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass" style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center', border: '1px solid var(--secondary)' }}>
          <div style={{ background: 'rgba(201, 31, 31, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
            <Lock size={32} />
          </div>
          <h2 style={{ marginBottom: '2rem', color: 'var(--primary)' }}>Panel de Control</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="password" placeholder="Contraseña Maestra..." className="input-tech" style={{ border: '2px solid var(--secondary)' }} value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <span style={{ color: '#ff3366', fontSize: '0.875rem' }}>{error}</span>}
            <button type="submit" className="btn-primary" style={{ cursor: 'pointer', borderRadius: 'var(--radius-pill)', padding: '14px' }}>Acceder</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <style jsx global>{`
        html, body {
          overflow-y: auto !important;
          height: auto !important;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        ::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {/* Global Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={confirmConfig.onConfirm}
      />

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', position: 'relative', zIndex: 1100 }}>
        <h1 className="gradient-text"><FolderEdit size={32} style={{ verticalAlign: 'middle', marginRight: '10px' }} /> Área de Gestión</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginRight: '120px' }}>
          <button
            className="btn-outline"
            onClick={handleLogout}
            style={{
              borderColor: 'rgba(255,51,102,0.3)',
              color: '#ff3366',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              position: 'relative',
              zIndex: 1200
            }}
          >
            <Lock size={16} /> Cerrar Sesión
          </button>
        </div>
      </header>

      {/* TABS para navegar entre Materias y Registros */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button onClick={() => setTab('materias')} className={tab === 'materias' ? 'btn-primary' : 'btn-outline'} style={{ flex: 1, padding: '12px', minWidth: '140px' }}><Plus size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Gestión de Materias</button>
        <button onClick={() => setTab('registros')} className={tab === 'registros' ? 'btn-primary' : 'btn-outline'} style={{ flex: 1, padding: '12px', minWidth: '140px' }}><FileText size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Subida de Registros</button>
      </div>

      {tab === 'materias' && (
        <section className="glass" style={{ padding: '2rem', marginBottom: '3rem', border: editingMateria ? '1px solid var(--primary)' : '' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: 'var(--primary)', margin: 0 }}>{editingMateria ? 'Editar Materia' : 'Crear Nueva Materia'}</h2>
            {editingMateria && (
              <button onClick={() => { setEditingMateria(null); setNewMateria({ name: '', description: '' }); }} className="btn-outline" style={{ padding: '5px 12px', fontSize: '0.8rem' }}>
                <X size={14} style={{ marginRight: '5px' }} /> Cancelar Edición
              </button>
            )}
          </div>
          <form onSubmit={editingMateria ? handleUpdateMateria : handleCreateMateria} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input className="input-tech" style={{ flex: 1 }} placeholder="Nombre (ej. Matemáticas)" value={newMateria.name} onChange={(e) => setNewMateria({ ...newMateria, name: e.target.value })} />
              <input className="input-tech" style={{ flex: 2 }} placeholder="Descripción corta" value={newMateria.description} onChange={(e) => setNewMateria({ ...newMateria, description: e.target.value })} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--white)', padding: '10px 16px', borderRadius: '8px', border: '2px solid var(--secondary)' }}>
                <Upload size={18} color="var(--primary)" />
                <span style={{ fontSize: '0.9rem', color: 'var(--foreground)' }}>{materiaFile ? materiaFile.name : 'Adjuntar PDF / Archivo base'}</span>
                <input type="file" style={{ display: 'none' }} accept=".pdf,.docx" onChange={(e) => setMateriaFile(e.target.files[0])} />
              </label>
              <button type="submit" className="btn-primary" style={{ marginLeft: 'auto' }}>
                {editingMateria ? 'Guardar Cambios' : 'Añadir Materia'}
              </button>
            </div>
          </form>

          <h3 style={{ marginTop: '3rem', marginBottom: '1.5rem', color: 'var(--foreground)' }}>Lista de Materias</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {materias.map(materia => (
              <div key={materia.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--white)', borderRadius: '16px', border: '1px solid var(--secondary)' }}>
                <div>
                  <strong style={{ color: 'var(--foreground)' }}>{materia.name}</strong> - <span style={{ color: 'var(--foreground)', opacity: 0.7 }}>{materia.description}</span>
                  {materia.file_url && <span style={{ marginLeft: '10px', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>(Archivo adjunto)</span>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => startEditMateria(materia)} className="btn-outline" style={{ padding: '8px' }}><Pencil size={16} /></button>
                  <button onClick={() => handleDeleteMateria(materia.id)} className="btn-outline" style={{ borderColor: '#ff3366', color: '#ff3366', padding: '8px' }}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'registros' && (
        <section className="glass" style={{ padding: '2rem', marginBottom: '3rem', border: editingAsignacion ? '1px solid var(--primary)' : '' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: 'var(--primary)', margin: 0 }}>
              {editingAsignacion ? 'Editar Registro' : 'Añadir Nuevo Registro'}
            </h2>
            {editingAsignacion && (
              <button onClick={() => { setEditingAsignacion(null); setNewAsignacion({ materia_id: '', type: 'materia', title: '', description: '', date: '', parcial: 1, semana: 1 }); }} className="btn-outline" style={{ padding: '5px 12px', fontSize: '0.8rem' }}>
                <X size={14} style={{ marginRight: '5px' }} /> Cancelar Edición
              </button>
            )}
          </div>
          {materias.length === 0 ? (
            <p style={{ color: '#ff3366' }}>Primero debes crear al menos una Materia.</p>
          ) : (
            <form onSubmit={editingAsignacion ? handleUpdateAsignacion : handleCreateAsignacion} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Row 1: Materia and Parcial */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--foreground)', marginBottom: '0.5rem', fontWeight: 600 }}>Materia *</label>
                  <select className="input-tech" style={{ width: '100%' }} value={newAsignacion.materia_id} onChange={(e) => setNewAsignacion({ ...newAsignacion, materia_id: e.target.value })} required>
                    <option value="">-- Seleccionar Materia --</option>
                    {materias.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--foreground)', marginBottom: '0.5rem', fontWeight: 600 }}>Parcial *</label>
                  <select className="input-tech" style={{ width: '100%' }} value={newAsignacion.parcial} onChange={(e) => {
                    const p = parseInt(e.target.value);
                    setNewAsignacion({ 
                      ...newAsignacion, 
                      parcial: p, 
                      semana: newAsignacion.type === 'consultas' 
                        ? (newAsignacion.semana === 2 ? 2 : (p === 1 ? 11 : 31)) 
                        : (p === 1 ? 1 : 8) 
                    });
                  }} required>
                    <option value={1}>Parcial I</option>
                    <option value={2}>Parcial II</option>
                  </select>
                </div>
                {isDeberes && (
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--foreground)', marginBottom: '0.5rem', fontWeight: 600 }}>
                      {newAsignacion.type === 'consultas' ? 'Formato *' : 'Semana *'}
                    </label>
                    {newAsignacion.type === 'consultas' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <select 
                          className="input-tech" 
                          style={{ width: '100%' }} 
                          value={newAsignacion.semana === 2 ? 2 : 1} 
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (val === 2) {
                              setNewAsignacion({ ...newAsignacion, semana: 2 });
                            } else {
                              setNewAsignacion({ ...newAsignacion, semana: newAsignacion.parcial === 1 ? 11 : 31 });
                            }
                          }} 
                          required
                        >
                          <option value={1}>A COMPUTADORA</option>
                          <option value={2}>A MANO</option>
                        </select>
                        
                        {newAsignacion.semana !== 2 && (
                          <select 
                            className="input-tech" 
                            style={{ width: '100%', marginTop: '0.5rem' }} 
                            value={newAsignacion.semana} 
                            onChange={(e) => setNewAsignacion({ ...newAsignacion, semana: parseInt(e.target.value) })} 
                            required
                          >
                            {newAsignacion.parcial === 1 ? (
                              <>
                                <option value={11}>U1 - Generalidades de la lógica matemática</option>
                                <option value={12}>U1 - Aplicaciones de la Lógica Matemática</option>
                                <option value={21}>U2 - Generalidades de las funciones</option>
                                <option value={22}>U2 - Aplicaciones de las funciones</option>
                              </>
                            ) : (
                              <>
                                <option value={31}>U3 - Generalidades de Límites</option>
                                <option value={32}>U3 - Aplicaciones de los Límites</option>
                                <option value={41}>U4 - Generalidades de la Derivada</option>
                                <option value={42}>U4 - Aplicaciones de la derivada</option>
                              </>
                            )}
                          </select>
                        )}
                      </div>
                    ) : (
                      <select className="input-tech" style={{ width: '100%' }} value={newAsignacion.semana} onChange={(e) => setNewAsignacion({ ...newAsignacion, semana: parseInt(e.target.value) })} required>
                        {(newAsignacion.parcial === 1 ? [1, 2, 3, 4, 5, 6, 7] : [8, 9, 10, 11, 12]).map(w => (
                          <option key={w} value={w}>Semana {w}</option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
              </div>

              {/* Row 2: Type and Date */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--foreground)', marginBottom: '0.5rem', fontWeight: 600 }}>Categoría Principal *</label>
                  <select
                    className="input-tech"
                    style={{ width: '100%' }}
                    value={
                      ['pruebas_escritas', 'pruebas_domingo', 'examenes_finales', 'examenes'].includes(newAsignacion.type) ? 'examenes' :
                        newAsignacion.type
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'examenes') {
                        setNewAsignacion({ ...newAsignacion, type: 'pruebas_escritas' });
                      } else {
                        setNewAsignacion({ ...newAsignacion, type: val });
                      }
                    }}
                    required
                  >
                    <option value="materia">Materia</option>
                    <option value="video_tabla">Video Tabla de Verdad</option>
                    <option value="apes">APES</option>
                    <option value="emprendimiento">Emprendimiento</option>
                    <option value="deberes">Deberes (General)</option>
                    <option value="consultas">Consultas</option>
                    <option value="ekos">Ekos</option>
                    <option value="lectura_critica">Lectura Crítica Matemática</option>
                    <option value="examenes">Exámenes</option>
                    <option value="excelentes">Excelentes</option>
                    <option value="talleres">Talleres</option>
                    <option value="anexos">Anexos</option>
                  </select>
                </div>

                {['pruebas_escritas', 'pruebas_domingo', 'examenes_finales', 'examenes'].includes(newAsignacion.type) && (
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--foreground)', marginBottom: '0.5rem', fontWeight: 600 }}>Tipo de Examen *</label>
                    <select className="input-tech" style={{ width: '100%' }} value={newAsignacion.type} onChange={(e) => setNewAsignacion({ ...newAsignacion, type: e.target.value })} required>
                      <option value="pruebas_escritas">Pruebas Escritas</option>
                      <option value="pruebas_domingo">Pruebas Domingo</option>
                      <option value="examenes_finales">Exámenes Finales</option>
                      <option value="examenes">Otros Exámenes</option>
                    </select>
                  </div>
                )}

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--foreground)', marginBottom: '0.5rem', fontWeight: 600 }}>Fecha</label>
                  <input className="input-tech" type="date" style={{ width: '100%' }} value={newAsignacion.date} onChange={(e) => setNewAsignacion({ ...newAsignacion, date: e.target.value })} />
                </div>
              </div>

              {/* Row 3: Title and Description */}
              <input className="input-tech" placeholder="Título del archivo *" value={newAsignacion.title} onChange={(e) => setNewAsignacion({ ...newAsignacion, title: e.target.value })} required />
              <textarea className="input-tech" placeholder="Descripción aclaratoria..." value={newAsignacion.description} onChange={(e) => setNewAsignacion({ ...newAsignacion, description: e.target.value })} />

              {newAsignacion.type === 'video_tabla' && (
                <input className="input-tech" placeholder="Opcional: Enlace a YouTube, Drive, etc." value={newAsignacion.external_link || ''} onChange={(e) => setNewAsignacion({ ...newAsignacion, external_link: e.target.value })} />
              )}

              {/* Row 4: File Upload & Submit */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--white)', padding: '10px 16px', borderRadius: '8px', border: '2px solid var(--secondary)' }}>
                  <Upload size={18} color="var(--primary)" />
                  <span style={{ fontSize: '0.9rem', color: 'var(--foreground)' }}>
                    {asignacionFile ? asignacionFile.name : (
                      newAsignacion.type === 'video_tabla' || newAsignacion.type === 'apes'
                        ? 'Subir Archivo PDF, ZIP o Video (.mp4)' 
                        : (['pruebas_escritas', 'pruebas_domingo', 'examenes_finales', 'examenes'].includes(newAsignacion.type) ? 'Subir PDF, ZIP o Imagen' : 'Subir Archivo PDF o ZIP')
                    )}
                  </span>
                  <input type="file" style={{ display: 'none' }} accept={newAsignacion.type === 'video_tabla' || newAsignacion.type === 'apes' ? ".mp4,.webm,.ogg,.mov,.pdf,.zip,.rar" : (['pruebas_escritas', 'pruebas_domingo', 'examenes_finales', 'examenes'].includes(newAsignacion.type) ? ".pdf,.zip,.rar,.jpg,.jpeg,.png,.webp" : ".pdf,.zip,.rar")} onChange={(e) => { setAsignacionFile(e.target.files[0]); setRemoveFileFlag(false); }} />
                </label>

                {editingAsignacion && editingAsignacion.file_url && !removeFileFlag && !asignacionFile && (
                  <button type="button" onClick={() => setRemoveFileFlag(true)} className="btn-outline" style={{ borderColor: '#ff3366', color: '#ff3366', padding: '10px 16px', fontSize: '0.9rem' }}>
                    <Trash2 size={16} style={{ marginRight: '5px' }} /> Eliminar Archivo Actual
                  </button>
                )}

                {removeFileFlag && (
                  <span style={{ color: '#ff3366', fontSize: '0.85rem' }}>Archivo marcado para eliminación</span>
                )}

                <button type="submit" className="btn-primary" style={{ marginLeft: 'auto' }}>
                  {editingAsignacion ? 'Actualizar Registro' : 'Guardar Registro'}
                </button>
              </div>
            </form>
          )}

          <h3 style={{ marginTop: '3rem', marginBottom: '1.5rem', color: 'var(--foreground)' }}>Todos los Registros</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {asignaciones.map(asig => (
              <div key={asig.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem', background: 'var(--white)', border: '1px solid var(--secondary)', borderRadius: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: 'rgba(201, 31, 31, 0.1)', color: 'var(--primary)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                      PARCIAL {asig.parcial || 1} {deberesIds.includes(asig.type) && (
                        asig.type === 'consultas' 
                          ? (asig.semana === 2 
                              ? ' - A MANO' 
                              : ` - A COMP (${subtopicShortTitles[asig.semana] || asig.semana})`
                            ) 
                          : ` - S${asig.semana || 1}`
                      )}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--foreground)', opacity: 0.6 }}>
                      • {typeNameMap[asig.type] || asig.type}
                    </span>
                  </div>
                  <strong style={{ color: 'var(--foreground)', fontSize: '1.1rem', display: 'block', marginBottom: '4px' }}>{asig.title}</strong>
                  <span style={{ color: 'var(--foreground)', opacity: 0.7, fontSize: '0.9rem' }}>{materias.find(m => Number(m.id) === Number(asig.materia_id))?.name}</span>
                  {asig.file_url && <a href={asig.file_url} target="_blank" rel="noreferrer" style={{ marginLeft: '15px', fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'underline', fontWeight: 600 }}>Ver archivo</a>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                  <button onClick={() => startEditAsignacion(asig)} className="btn-outline" style={{ padding: '8px' }}><Pencil size={18} /></button>
                  <button onClick={() => handleDeleteAsignacion(asig.id)} className="btn-outline" style={{ borderColor: '#ff3366', color: '#ff3366', padding: '8px' }}><Trash2 size={18} /></button>
                </div>
              </div>
            ))}

            {asignaciones.length === 0 && (
              <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '2rem' }}>No hay registros subidos todavía.</p>
            )}
          </div>
        </section>
      )}
    </motion.div>
  );
}
