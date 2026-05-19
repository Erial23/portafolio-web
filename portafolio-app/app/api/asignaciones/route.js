import db from '@/app/lib/db';
import { NextResponse } from 'next/server';
import { checkAuth } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const materiaId = searchParams.get('materiaId');
    const parcial = searchParams.get('parcial');
    
    let query = 'SELECT * FROM asignaciones WHERE 1=1';
    const params = [];
    
    if (materiaId) {
      query += ' AND materia_id = ?';
      params.push(materiaId);
    }
    if (parcial) {
      query += ' AND parcial = ?';
      params.push(parcial);
    }
    const semana = searchParams.get('semana');
    if (semana) {
      query += ' AND semana = ?';
      params.push(semana);
    }
    
    // Devolvemos ordenados por fecha
    query += ' ORDER BY date DESC';
    
    const asignaciones = db.prepare(query).all(...params);
    return NextResponse.json(asignaciones);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { materia_id, type, title, description, date, file_url, parcial, semana } = await request.json();
    const statement = db.prepare('INSERT INTO asignaciones (materia_id, type, title, description, date, file_url, parcial, semana) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    const result = statement.run(materia_id, type, title, description, date, file_url || null, parcial || 1, semana || 1);
    return NextResponse.json({ id: result.lastInsertRowid, success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
