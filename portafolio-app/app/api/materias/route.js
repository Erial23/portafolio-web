import db from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const materias = db.prepare('SELECT * FROM materias').all();
    return NextResponse.json(materias);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, description } = await request.json();
    const statement = db.prepare('INSERT INTO materias (name, description) VALUES (?, ?)');
    const result = statement.run(name, description);
    return NextResponse.json({ id: result.lastInsertRowid, name, description });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
