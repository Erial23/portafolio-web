'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Database, Code, Shield } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '4rem' }}>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div style={{ 
            display: 'inline-block', 
            padding: '8px 16px', 
            borderRadius: '20px', 
            background: 'rgba(0, 240, 255, 0.1)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            marginBottom: '1.5rem',
            color: 'var(--primary)',
            fontWeight: '600',
            fontSize: '0.875rem',
            letterSpacing: '1px'
          }}>
            [ VERSIÓN DEL SISTEMA 1.0.0 ]
          </div>
          <h1 style={{ fontSize: '4rem', lineHeight: '1.1', marginBottom: '1.5rem', textShadow: '0 0 20px rgba(0,240,255,0.3)' }}>
            PORTAFOLIO <br />
            <span className="gradient-text glow-text">INTEGRADO</span>
          </h1>
          <p style={{ maxWidth: '600px', fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', margin: '0 auto 2.5rem' }}>
            Exploración técnica y académica. Sumérgete en el repositorio interactivo de materias, deberes y exámenes del semestre.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/materias">
              <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Acceder al Archivo <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Características (Cards) */}
      <section>
        <div className="grid-3">
          <FeatureCard 
            delay={0.2}
            icon={<Database className="gradient-text" style={{ color: 'var(--primary)' }} size={32} />}
            title="SISTEMA CRUD"
            description="Motor SQLite de alta velocidad con capa lógica en Next.js. Administración estructurada y segura."
          />
          <FeatureCard 
            delay={0.4}
            icon={<Code style={{ color: '#7000ff' }} size={32} />}
            title="DISEÑO PREMIUM"
            description="Arquitectura de vidrio (Glassmorphism), fuentes exclusivas, dark-mode y optimización reactiva."
          />
          <FeatureCard 
            delay={0.6}
            icon={<Shield style={{ color: 'var(--primary)' }} size={32} />}
            title="CONTROL DE ROLES"
            description="Panel de administración blindado vs. vista pública de espectador para el jurado calificador."
          />
        </div>
      </section>
      {/* Footer / Autor */}
      <footer style={{ textAlign: 'center', marginTop: '2rem', padding: '2rem', borderTop: '1px solid var(--glass-border)' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>
          Desarrollado por{' '}
          <a 
            href="https://github.com/Erial23" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}
            className="glow-text"
          >
            @Erial23
          </a>
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="glass glass-card"
      style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <div style={{ 
        width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)'
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.25rem', marginTop: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>{description}</p>
    </motion.div>
  );
}
