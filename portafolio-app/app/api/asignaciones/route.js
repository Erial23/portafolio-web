import db from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const materiaId = searchParams.get('materiaId');
    
    let query = 'SELECT * FROM asignaciones';
    const params = [];
    
    if (materiaId) {
      query += ' WHERE materia_id = ?';
      params.push(materiaId);
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
    const { materia_id, type, title, description, date } = await request.json();
    const statement = db.prepare('INSERT INTO asignaciones (materia_id, type, title, description, date) VALUES (?, ?, ?, ?, ?)');
    const result = statement.run(materia_id, type, title, description, date);
    return NextResponse.json({ id: result.lastInsertRowid, success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
