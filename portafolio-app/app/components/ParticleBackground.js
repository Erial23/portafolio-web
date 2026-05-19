'use client';

import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // AUMENTO DE PARTÍCULAS: De 120 a 250 para una densidad extrema y premium
    let particles = [];
    const particleCount = 250; 
    
    // Paleta de colores MUCHO más brillante para resaltar en el fondo oscuro
    const colors = [
      '#DC2626', // Rojo Fuerte
      '#B91C1C', // Vino Oscuro
      '#F87171', // Rojo Coral Claro
      '#EF4444', // Carmesí 
      '#991B1B'  // Rojo Muy Oscuro
    ];

    const mouseRadius = 150; // Radio de interacción sutilmente ajustado
    const repulsionForce = 0.8;
    const returnForce = 0.05;

    let mouse = { x: null, y: null };

    const handleResize = () => {
      if (typeof window !== 'undefined') {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
      }
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    class Particle {
      constructor(x, y) {
        this.baseX = x;
        this.baseY = y;
        this.x = x;
        this.y = y;
        this.size = Math.random() * 1.5 + 0.3; // Más pequeñas para no sobrecargar con 250
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.5 + 0.15; // Un poco más traslúcidas
        
        // Movimiento flotante base más dinámico
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        
        this.shape = Math.random() > 0.6 ? 'stroke' : 'dot';
        this.angle = Math.random() * Math.PI * 2;
        this.va = (Math.random() - 0.5) * 0.05;
        this.width = Math.random() * 8 + 4; 
      }
      
      draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        if (this.shape === 'dot') {
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-this.width/2, -1, this.width, 2);
        }
        
        ctx.restore();
        ctx.globalAlpha = 1.0;
      }
      
      update() {
        // Movimiento constante
        this.baseX += this.vx;
        this.baseY += this.vy;
        
        // Mantener dentro de los bordes
        if (this.baseX < 0 || this.baseX > canvas.width) this.vx *= -1;
        if (this.baseY < 0 || this.baseY > canvas.height) this.vy *= -1;

        // Interacción con el mouse
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouseRadius) {
            const force = (mouseRadius - distance) / mouseRadius;
            const directionX = dx / distance;
            const directionY = dy / distance;
            
            // Empujarlas suavemente
            this.x -= directionX * force * 10 * repulsionForce;
            this.y -= directionY * force * 10 * repulsionForce;
          }
        }

        // Suavizado para retornar a su posición original/flotante
        const dx = this.x - this.baseX;
        const dy = this.y - this.baseY;
        this.x -= dx * returnForce;
        this.y -= dy * returnForce;

        this.angle += this.va;
        this.draw();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        particles.push(new Particle(x, y));
      }
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
    };

    // Ejecutar inmediatamente y forzar resize
    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -2,
        pointerEvents: 'none',
      }}
    />
  );
}
