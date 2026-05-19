'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDown, Book, FileText, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [typedKeys, setTypedKeys] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Solo nos importan letras individuales
      if (e.key.length !== 1) return;

      const newSequence = (typedKeys + e.key.toLowerCase()).slice(-5);
      setTypedKeys(newSequence);

      if (newSequence === 'admin') {
        router.push('/admin');
        setTypedKeys('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [typedKeys, router]);

  return (
    <nav className="navbar" style={{
      background: 'none',
      border: 'none',
      backdropFilter: 'none',
      boxShadow: 'none',
      width: '100%',
      position: 'fixed',
      top: 0,
      right: 0,
      padding: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      zIndex: 1000
    }}>
      <div className="nav-links">
        {pathname !== '/' && (
          <Link href="/" className="btn-pill" style={{
            background: 'var(--primary)',
            color: 'var(--white)',
            padding: '10px 30px',
            fontSize: '0.95rem',
            boxShadow: '0 4px 15px rgba(201,31,31,0.2)'
          }}>
            Inicio
          </Link>
        )}
      </div>
    </nav>
  );
}
