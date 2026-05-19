import db from '@/app/lib/db';
import { NextResponse } from 'next/server';
import { checkAuth } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

export async function DELETE(request, { params }) {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    // Primero, eliminamos asignaciones asociadas por seguridad
    db.prepare('DELETE FROM asignaciones WHERE materia_id = ?').run(id);
    // Luego eliminamos la materia
    db.prepare('DELETE FROM materias WHERE id = ?').run(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function PUT(request, { params }) {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { name, description, file_url } = await request.json();
    
    db.prepare('UPDATE materias SET name = ?, description = ?, file_url = ? WHERE id = ?')
      .run(name, description, file_url, id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
