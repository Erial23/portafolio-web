'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Plus, Trash2, FolderEdit } from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [materias, setMaterias] = useState([]);
  const [newMateria, setNewMateria] = useState({ name: '', description: '' });

  // Peticiones
  const fetchMaterias = async () => {
    const res = await fetch('/api/materias');
    const data = await res.json();
    setMaterias(data);
  };

  useEffect(() => {
    if (isAuthenticated) fetchMaterias();
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    // Clave súper secreta para el concurso
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Credenciales de administrador incorrectas.');
    }
  };

  const handleCreateMateria = async (e) => {
    e.preventDefault();
    if (!newMateria.name) return;
    await fetch('/api/materias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMateria)
    });
    setNewMateria({ name: '', description: '' });
    fetchMaterias();
  };

  const handleDeleteMateria = async (id) => {
    if(!confirm('¿Seguro que deseas eliminar esta materia y todo su contenido?')) return;
    await fetch(`/api/materias/${id}`, { method: 'DELETE' });
    fetchMaterias();
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="glass" 
          style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}
        >
          <div style={{ background: 'rgba(0,240,255,0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
            <Lock size={32} />
          </div>
          <h2 style={{ marginBottom: '2rem' }}>Panel de Control</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="password" 
              placeholder="Contraseña Maestra..." 
              className="input-tech"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <span style={{ color: '#ff3366', fontSize: '0.875rem' }}>{error}</span>}
            <button type="submit" className="btn-primary">Acceder</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h1 className="gradient-text"><FolderEdit size={32} style={{ verticalAlign: 'middle', marginRight: '10px' }} /> Dashboard Admin</h1>
        <button className="btn-outline" onClick={() => setIsAuthenticated(false)}>Cerrar Sesión</button>
      </header>

      <section className="glass" style={{ padding: '2rem', marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>
          <Plus size={24} style={{ verticalAlign: 'middle' }} /> Nueva Materia
        </h2>
        <form onSubmit={handleCreateMateria} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <input 
            className="input-tech" 
            style={{ flex: '1 1 250px' }} 
            placeholder="Nombre de la Materia (ej. Cálculo)" 
            value={newMateria.name}
            onChange={(e) => setNewMateria({...newMateria, name: e.target.value})}
          />
          <input 
            className="input-tech" 
            style={{ flex: '2 1 400px' }} 
            placeholder="Descripción del semestre" 
            value={newMateria.description}
            onChange={(e) => setNewMateria({...newMateria, description: e.target.value})}
          />
          <button type="submit" className="btn-primary" style={{ padding: '12px 24px' }}>Guardar</button>
        </form>
      </section>

      <h2 style={{ marginBottom: '1.5rem' }}>Materias Actuales</h2>
      <div className="grid-3">
        {materias.map(materia => (
          <div key={materia.id} className="glass glass-card" style={{ padding: '1.5rem' }}>
            <h3>{materia.name}</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem', marginBottom: '1.5rem', minHeight: '40px' }}>{materia.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <a href={`/admin/materias/${materia.id}`} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.875rem' }}>
                Gestionar Contenido
              </a>
              <button onClick={() => handleDeleteMateria(materia.id)} className="btn-outline" style={{ padding: '6px 12px', borderColor: '#ff3366', color: '#ff3366' }}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
