import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { signCookie, verifyCookie } from '@/app/lib/auth';

export async function POST(request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      console.error("ADMIN_PASSWORD is not set in environment variables!");
      return NextResponse.json({ error: 'Error de configuración del servidor' }, { status: 500 });
    }

    if (password === adminPassword) {
      const cookieStore = await cookies();
      
      const tokenValue = signCookie('authenticated');
      
      // Establecer cookie HttpOnly
      cookieStore.set('admin_token', tokenValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 semana
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  // Cerrar sesión
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  return NextResponse.json({ success: true });
}

export async function GET() {
  // Verificar sesión actual
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  
  if (token && verifyCookie(token.value) === 'authenticated') {
    return NextResponse.json({ authenticated: true });
  }
  
  return NextResponse.json({ authenticated: false }, { status: 401 });
}
