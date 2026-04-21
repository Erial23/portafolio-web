import db from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  try {
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
