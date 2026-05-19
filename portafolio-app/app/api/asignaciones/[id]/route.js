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
    db.prepare('DELETE FROM asignaciones WHERE id = ?').run(id);
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
    const { title, description, date, type, materia_id, file_url, parcial, semana } = await request.json();
    
    db.prepare('UPDATE asignaciones SET title = ?, description = ?, date = ?, type = ?, materia_id = ?, file_url = ?, parcial = ?, semana = ? WHERE id = ?')
      .run(title, description, date, type, materia_id, file_url, parcial || 1, semana || 1, id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
