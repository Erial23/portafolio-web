import './globals.css';
import { Inter, Outfit } from 'next/font/google';
import Navbar from './components/Navbar';
import ParticleTransition from './components/ParticleTransition';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-heading' });

export const metadata = {
  title: 'Portafolio Tech | Cyber Sec & Dev',
  description: 'Portafolio semestral de alta tecnología',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${outfit.variable}`}>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--glass-border)',
              color: 'white',
              borderRadius: '12px',
              fontFamily: 'var(--font-body)',
            },
            className: 'glass-toast',
          }}
        />

        {/* Navegación principal */}
        <Navbar />
        <ParticleTransition />

        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
