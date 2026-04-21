import './globals.css';
import { Inter, Outfit } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-heading' });

export const metadata = {
  title: 'Portafolio Tech | Cyber Sec & Dev',
  description: 'Portafolio semestral de alta tecnología',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${outfit.variable}`}>
        {/* Esferas decorativas de fondo */}
        <div className="ambient-sphere sphere-1"></div>
        <div className="ambient-sphere sphere-2"></div>

        {/* Navegación principal */}
        <nav className="navbar glass">
          <div className="nav-logo">
            <Link href="/" className="gradient-text glow-text" style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'var(--font-heading)' }}>
              PORTAFOLIO.SYS
            </Link>
          </div>
          <div className="nav-links">
            <Link href="/" className="nav-link">Inicio</Link>
            <Link href="/materias" className="nav-link">Materias</Link>
            <Link href="/admin" className="nav-link">
              <span className="btn-outline" style={{ padding: '6px 16px', fontSize: '0.9rem' }}>Admin</span>
            </Link>
          </div>
        </nav>

        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
